import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

function loadGithubReleases() {
  process.env.GITHUB_RELEASES_TOKEN = 'test-token';
  process.env.GITHUB_RELEASES_REPOSITORY = 'owner/repo';
  const source = readFileSync('src/lib/github-releases.ts', 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  new Function('require', 'exports', code)((name) => {
    if (name === 'server-only') return {};
    throw new Error(`Unexpected dependency: ${name}`);
  }, exports);
  return exports;
}

function release(id, tag, { draft = false, assets = [] } = {}) {
  return {
    id,
    tag_name: tag,
    name: tag,
    draft,
    upload_url: `https://uploads.github.com/repos/owner/repo/releases/${id}/assets{?name,label}`,
    assets,
  };
}

function jsonResponse(value, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } });
}

test('a 422 upload retry reuses the same asset if GitHub already stored it', async () => {
  const { uploadReleaseAsset } = loadGithubReleases();
  const uploaded = { id: 51, name: 'cover.png', browser_download_url: 'https://github.com/owner/repo/releases/download/assets-batch-001/cover.png', size: 4 };
  const firstRelease = release(1, 'assets-batch-001');
  const calls = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(String(input));
    calls.push({ url, method: init.method || 'GET' });
    if (url.pathname.endsWith('/releases') && !init.method) return jsonResponse([firstRelease]);
    if (url.pathname.endsWith('/releases/1/assets') && init.method === 'POST') {
      return jsonResponse({ message: 'Validation Failed', errors: [{ code: 'already_exists' }] }, 422);
    }
    if (url.pathname.endsWith('/releases/1') && !init.method) return jsonResponse({ ...firstRelease, assets: [uploaded] });
    throw new Error(`Unexpected GitHub request: ${init.method || 'GET'} ${url}`);
  };

  try {
    const result = await uploadReleaseAsset(new Uint8Array([1, 2, 3, 4]).buffer, uploaded.name, 'image/png');
    assert.equal(result.url, uploaded.browser_download_url);
    assert.equal(result.releaseTag, 'assets-batch-001');
    assert.equal(calls.filter((call) => call.method === 'POST').length, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('a transient fetch failure is retried before uploading an asset', async () => {
  const { uploadReleaseAsset } = loadGithubReleases();
  const currentRelease = release(7, 'assets-batch-007');
  const uploaded = { id: 77, name: 'cover.png', browser_download_url: 'https://github.com/owner/repo/releases/download/assets-batch-007/cover.png', size: 4 };
  const originalFetch = globalThis.fetch;
  let releaseListAttempts = 0;
  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(String(input));
    if (url.pathname.endsWith('/releases') && !init.method) {
      releaseListAttempts += 1;
      if (releaseListAttempts === 1) throw new TypeError('fetch failed');
      return jsonResponse([currentRelease]);
    }
    if (url.pathname.endsWith('/releases/7/assets') && init.method === 'POST') return jsonResponse(uploaded, 201);
    if (url.pathname.endsWith('/releases/7') && init.method === 'PATCH') return jsonResponse({ ...currentRelease, draft: false });
    throw new Error(`Unexpected GitHub request: ${init.method || 'GET'} ${url}`);
  };

  try {
    const result = await uploadReleaseAsset(new Uint8Array([1, 2, 3, 4]).buffer, uploaded.name, 'image/png');
    assert.equal(result.url, uploaded.browser_download_url);
    assert.equal(releaseListAttempts, 2);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('a lost upload response reuses the asset created by the first request', async () => {
  const { uploadReleaseAsset } = loadGithubReleases();
  const uploaded = { id: 88, name: 'cover.png', browser_download_url: 'https://github.com/owner/repo/releases/download/assets-batch-008/cover.png', size: 4 };
  const currentRelease = release(8, 'assets-batch-008');
  const originalFetch = globalThis.fetch;
  let uploadAttempts = 0;
  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(String(input));
    if (url.pathname.endsWith('/releases') && !init.method) return jsonResponse([currentRelease]);
    if (url.pathname.endsWith('/releases/8/assets') && init.method === 'POST') {
      uploadAttempts += 1;
      if (uploadAttempts === 1) throw new TypeError('fetch failed');
      return jsonResponse({ message: 'Validation Failed', errors: [{ code: 'already_exists' }] }, 422);
    }
    if (url.pathname.endsWith('/releases/8') && !init.method) return jsonResponse({ ...currentRelease, assets: [uploaded] });
    if (url.pathname.endsWith('/releases/8') && init.method === 'PATCH') return jsonResponse({ ...currentRelease, draft: false });
    throw new Error(`Unexpected GitHub request: ${init.method || 'GET'} ${url}`);
  };

  try {
    const result = await uploadReleaseAsset(new Uint8Array([1, 2, 3, 4]).buffer, uploaded.name, 'image/png');
    assert.equal(result.url, uploaded.browser_download_url);
    assert.equal(uploadAttempts, 2);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('a 422 upload conflict moves the asset to a different batch and publishes it', async () => {
  const { uploadReleaseAsset } = loadGithubReleases();
  const firstRelease = release(1, 'assets-batch-001');
  const secondRelease = release(2, 'assets-batch-002', { draft: true });
  const uploaded = { id: 52, name: 'cover.png', browser_download_url: 'https://github.com/owner/repo/releases/download/assets-batch-002/cover.png', size: 4 };
  const calls = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(String(input));
    calls.push({ url, method: init.method || 'GET' });
    if (url.pathname.endsWith('/releases') && !init.method) return jsonResponse([firstRelease, secondRelease]);
    if (url.pathname.endsWith('/releases/1/assets') && init.method === 'POST') {
      return jsonResponse({ message: 'Validation Failed', errors: [{ code: 'already_exists' }] }, 422);
    }
    if (url.pathname.endsWith('/releases/1') && !init.method) return jsonResponse(firstRelease);
    if (url.pathname.endsWith('/releases/2/assets') && init.method === 'POST') return jsonResponse(uploaded, 201);
    if (url.pathname.endsWith('/releases/2') && init.method === 'PATCH') return jsonResponse({ ...secondRelease, draft: false });
    throw new Error(`Unexpected GitHub request: ${init.method || 'GET'} ${url}`);
  };

  try {
    const result = await uploadReleaseAsset(new Uint8Array([1, 2, 3, 4]).buffer, uploaded.name, 'image/png');
    assert.equal(result.url, uploaded.browser_download_url);
    assert.equal(result.releaseTag, 'assets-batch-002');
    assert.deepEqual(calls.filter((call) => call.method === 'POST').map((call) => call.url.pathname), [
      '/repos/owner/repo/releases/1/assets',
      '/repos/owner/repo/releases/2/assets',
    ]);
    assert.equal(calls.filter((call) => call.method === 'PATCH').length, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('a 422 across all available batches creates a clean batch before failing', async () => {
  const { uploadReleaseAsset } = loadGithubReleases();
  const firstRelease = release(1, 'assets-batch-001');
  const secondRelease = release(2, 'assets-batch-002');
  const thirdRelease = release(3, 'assets-batch-003');
  const freshReleaseBase = release(4, 'assets-batch-004', { draft: true });
  let uploaded;
  let createdTag = '';
  const calls = [];
  const originalNow = Date.now;
  Date.now = () => 2_000_000_000_000;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(String(input));
    const method = init.method || 'GET';
    calls.push({ path: url.pathname, method });
    if (url.pathname.endsWith('/releases') && method === 'GET') {
      return jsonResponse([firstRelease, secondRelease, thirdRelease]);
    }
    if (url.pathname.endsWith('/git/matching-refs/tags/assets-batch-')) {
      return jsonResponse([firstRelease, secondRelease, thirdRelease].map((item) => ({ ref: `refs/tags/${item.tag_name}` })));
    }
    if (url.pathname.endsWith('/releases') && method === 'POST') {
      createdTag = JSON.parse(String(init.body)).tag_name;
      assert.match(createdTag, /^assets-batch-2000000000000-[0-9a-f-]{36}$/i);
      uploaded = {
        id: 84,
        name: 'cover.png',
        browser_download_url: `https://github.com/owner/repo/releases/download/${createdTag}/cover.png`,
        size: 4,
      };
      return jsonResponse({ ...freshReleaseBase, tag_name: createdTag }, 201);
    }
    if (/\/releases\/[123]\/assets$/.test(url.pathname) && method === 'POST') {
      return jsonResponse({ message: 'Validation Failed', errors: [{ code: 'already_exists' }] }, 422);
    }
    if (/\/releases\/[123]$/.test(url.pathname) && method === 'GET') {
      const found = [firstRelease, secondRelease, thirdRelease].find((item) => url.pathname.endsWith(`/${item.id}`));
      return jsonResponse(found);
    }
    if (url.pathname.endsWith('/releases/4/assets') && method === 'POST') return jsonResponse(uploaded, 201);
    if (url.pathname.endsWith('/releases/4') && method === 'PATCH') return jsonResponse({ ...freshReleaseBase, tag_name: createdTag, draft: false });
    throw new Error(`Unexpected GitHub request: ${method} ${url}`);
  };

  try {
    const result = await uploadReleaseAsset(new Uint8Array([1, 2, 3, 4]).buffer, 'cover.png', 'image/png');
    assert.equal(result.url, uploaded.browser_download_url);
    assert.equal(result.releaseTag, createdTag);
    assert.deepEqual(calls.filter((call) => call.method === 'POST' && call.path.endsWith('/assets')).map((call) => call.path), [
      '/repos/owner/repo/releases/1/assets',
      '/repos/owner/repo/releases/2/assets',
      '/repos/owner/repo/releases/3/assets',
      '/repos/owner/repo/releases/4/assets',
    ]);
    assert.equal(calls.filter((call) => call.method === 'PATCH').length, 1);
  } finally {
    globalThis.fetch = originalFetch;
    Date.now = originalNow;
  }
});

test('a stale GitHub tag conflict falls back to a unique tag without scanning every orphaned number', async () => {
  const { uploadReleaseAsset } = loadGithubReleases();
  const fullReleases = Array.from({ length: 21 }, (_, index) => release(index + 1, `assets-batch-${String(index + 1).padStart(3, '0')}`, {
    assets: Array.from({ length: 1_000 }, (_, assetIndex) => ({ id: assetIndex + 1, name: `asset-${assetIndex}.bin` })),
  }));
  const nextReleaseBase = release(23, 'assets-batch-023', { draft: true });
  let uploaded;
  const createTags = [];
  let tagReads = 0;
  let createdTag = '';
  const originalNow = Date.now;
  Date.now = () => 2_000_000_000_000;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(String(input));
    const method = init.method || 'GET';
    if (url.pathname.endsWith('/releases') && method === 'GET') return jsonResponse(fullReleases);
    if (url.pathname.endsWith('/git/matching-refs/tags/assets-batch-')) {
      tagReads += 1;
      const highestTag = tagReads === 1 ? 21 : 22;
      return jsonResponse(Array.from({ length: highestTag }, (_, index) => ({
        ref: `refs/tags/assets-batch-${String(index + 1).padStart(3, '0')}`,
      })));
    }
    if (url.pathname.endsWith('/releases') && method === 'POST') {
      const tag = JSON.parse(String(init.body)).tag_name;
      createTags.push(tag);
      if (createTags.length === 1) {
        return jsonResponse({ message: 'Validation Failed', errors: [{ field: 'tag_name', code: 'already_exists' }] }, 422);
      }
      assert.match(tag, /^assets-batch-2000000000001-[0-9a-f-]{36}$/i);
      createdTag = tag;
      uploaded = {
        id: 99,
        name: 'cover.png',
        browser_download_url: `https://github.com/owner/repo/releases/download/${tag}/cover.png`,
        size: 4,
      };
      return jsonResponse({ ...nextReleaseBase, tag_name: tag }, 201);
    }
    if (url.pathname.endsWith('/releases/23/assets') && method === 'POST') return jsonResponse(uploaded, 201);
    if (url.pathname.endsWith('/releases/23') && method === 'PATCH') return jsonResponse({ ...nextReleaseBase, tag_name: createdTag, draft: false });
    throw new Error(`Unexpected GitHub request: ${method} ${url}`);
  };

  try {
    const result = await uploadReleaseAsset(new Uint8Array([1, 2, 3, 4]).buffer, 'cover.png', 'image/png');
    assert.equal(result.url, uploaded.browser_download_url);
    assert.match(result.releaseTag, /^assets-batch-2000000000001-[0-9a-f-]{36}$/i);
    assert.match(createTags[0], /^assets-batch-2000000000000-[0-9a-f-]{36}$/i);
    assert.deepEqual(createTags, [createTags[0], result.releaseTag]);
    assert.equal(tagReads, 2);
  } finally {
    globalThis.fetch = originalFetch;
    Date.now = originalNow;
  }
});

test('a release creation 422 unrelated to tag_name is returned without skipping tags', async () => {
  const { uploadReleaseAsset } = loadGithubReleases();
  const fullReleases = [release(1, 'assets-batch-001', {
    assets: Array.from({ length: 1_000 }, (_, index) => ({ id: index + 1, name: `asset-${index}.bin` })),
  })];
  const createTags = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(String(input));
    const method = init.method || 'GET';
    if (url.pathname.endsWith('/releases') && method === 'GET') return jsonResponse(fullReleases);
    if (url.pathname.endsWith('/git/matching-refs/tags/assets-batch-')) return jsonResponse([{ ref: 'refs/tags/assets-batch-001' }]);
    if (url.pathname.endsWith('/releases') && method === 'POST') {
      createTags.push(JSON.parse(String(init.body)).tag_name);
      return jsonResponse({ message: 'Validation Failed', errors: [{ field: 'name', code: 'already_exists' }] }, 422);
    }
    throw new Error(`Unexpected GitHub request: ${method} ${url}`);
  };

  try {
    await assert.rejects(
      uploadReleaseAsset(new Uint8Array([1, 2, 3, 4]).buffer, 'cover.png', 'image/png'),
      /name: already_exists/,
    );
    assert.equal(createTags.length, 1);
    assert.match(createTags[0], /^assets-batch-\d{13}-[0-9a-f-]{36}$/i);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('batch selection reads all pages of Git tags before creating a release', async () => {
  const { uploadReleaseAsset } = loadGithubReleases();
  const fullRelease = release(1, 'assets-batch-001', {
    assets: Array.from({ length: 1_000 }, (_, index) => ({ id: index + 1, name: `asset-${index}.bin` })),
  });
  const nextReleaseBase = release(106, 'assets-batch-106', { draft: true });
  let createdTag = '';
  let uploaded;
  const pagesRead = [];
  const originalNow = Date.now;
  Date.now = () => 2_000_000_000_000;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(String(input));
    const method = init.method || 'GET';
    if (url.pathname.endsWith('/releases') && method === 'GET') return jsonResponse([fullRelease]);
    if (url.pathname.endsWith('/git/matching-refs/tags/assets-batch-')) {
      const page = Number(url.searchParams.get('page'));
      assert.equal(url.searchParams.get('per_page'), '100');
      pagesRead.push(page);
      const firstNumber = (page - 1) * 100 + 1;
      const endNumber = page === 1 ? 100 : 105;
      return jsonResponse(Array.from({ length: endNumber - firstNumber + 1 }, (_, index) => ({
        ref: `refs/tags/assets-batch-${String(firstNumber + index).padStart(3, '0')}`,
      })));
    }
    if (url.pathname.endsWith('/releases') && method === 'POST') {
      createdTag = JSON.parse(String(init.body)).tag_name;
      assert.match(createdTag, /^assets-batch-2000000000000-[0-9a-f-]{36}$/i);
      uploaded = {
        id: 1061,
        name: 'cover.png',
        browser_download_url: `https://github.com/owner/repo/releases/download/${createdTag}/cover.png`,
        size: 4,
      };
      return jsonResponse({ ...nextReleaseBase, tag_name: createdTag }, 201);
    }
    if (url.pathname.endsWith('/releases/106/assets') && method === 'POST') return jsonResponse(uploaded, 201);
    if (url.pathname.endsWith('/releases/106') && method === 'PATCH') return jsonResponse({ ...nextReleaseBase, tag_name: createdTag, draft: false });
    throw new Error(`Unexpected GitHub request: ${method} ${url}`);
  };

  try {
    const result = await uploadReleaseAsset(new Uint8Array([1, 2, 3, 4]).buffer, 'cover.png', 'image/png');
    assert.equal(result.releaseTag, createdTag);
    assert.match(result.releaseTag, /^assets-batch-2000000000000-[0-9a-f-]{36}$/i);
    assert.deepEqual(pagesRead, [1, 2]);
  } finally {
    globalThis.fetch = originalFetch;
    Date.now = originalNow;
  }
});
