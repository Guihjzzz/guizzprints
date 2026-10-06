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
