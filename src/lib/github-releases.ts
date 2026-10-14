import 'server-only';

const GITHUB_API = 'https://api.github.com';
const MAX_ASSETS_PER_RELEASE = 1_000;
const BATCH_TAG = /^assets-batch-(\d{3,})(?:-[0-9a-f-]{36})?$/i;
const MAX_GITHUB_REQUEST_ATTEMPTS = 3;
const MAX_BATCH_RELEASE_CREATE_ATTEMPTS = 10;
const MAX_BATCH_TAG_PAGES = 100;
const GITHUB_PAGE_SIZE = 100;
const RETRYABLE_GITHUB_STATUSES = new Set([408, 500, 502, 503, 504]);
const RETRYABLE_NETWORK_CODES = new Set([
  'ECONNRESET',
  'ECONNREFUSED',
  'EAI_AGAIN',
  'ENETUNREACH',
  'ETIMEDOUT',
  'UND_ERR_CONNECT_TIMEOUT',
  'UND_ERR_SOCKET',
]);

type GitHubAsset = {
  id: number;
  name: string;
  browser_download_url: string;
  size?: number;
};

type GitHubRelease = {
  id: number;
  tag_name: string;
  name: string | null;
  draft: boolean;
  upload_url: string;
  assets: GitHubAsset[];
};

type GithubApiFailure = Error & { status?: number };

// Try the available releases first, then let the final attempt create a clean
// batch if every existing batch rejects the upload (for example, a 422).
const MAX_ASSET_UPLOAD_ATTEMPTS = 4;

export type UploadedReleaseAsset = {
  url: string;
  releaseTag: string;
  assetName: string;
};

function repositoryName() {
  return (process.env.GITHUB_RELEASES_REPOSITORY || 'Guizzhjz/guizzprints-assets').trim();
}

function releaseToken() {
  return (process.env.GITHUB_RELEASES_TOKEN || '').trim();
}

function validRepository(repository: string) {
  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository);
}

export function hasGithubReleasesConfig() {
  return Boolean(releaseToken() && validRepository(repositoryName()));
}

export function githubReleaseRepository() {
  const repository = repositoryName();
  if (!validRepository(repository)) throw new Error('GITHUB_RELEASES_REPOSITORY is invalid.');
  return repository;
}

function githubHeaders(contentType?: string) {
  const token = releaseToken();
  if (!token) throw new Error('GitHub Releases storage is not configured.');
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    ...(contentType ? { 'Content-Type': contentType } : {}),
  };
}

function nestedNetworkCode(error: unknown): string | null {
  let current = error;
  for (let depth = 0; depth < 4 && current && typeof current === 'object'; depth += 1) {
    if ('code' in current && typeof current.code === 'string') return current.code;
    current = 'cause' in current ? current.cause : null;
  }
  return null;
}

export function isGithubReleaseTransportFailure(error: unknown) {
  if (!error || typeof error !== 'object' || 'status' in error) return false;
  const message = 'message' in error && typeof error.message === 'string' ? error.message : '';
  const code = nestedNetworkCode(error);
  return (error instanceof TypeError && /fetch failed|failed to fetch|networkerror/i.test(message))
    || Boolean(code && RETRYABLE_NETWORK_CODES.has(code));
}

function retryableRequestFailure(error: unknown) {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as GithubApiFailure).status;
    return typeof status === 'number' && RETRYABLE_GITHUB_STATUSES.has(status);
  }
  return isGithubReleaseTransportFailure(error);
}

function retryDelay(attempt: number) {
  return new Promise((resolve) => setTimeout(resolve, 350 * attempt));
}

async function githubRequest<T>(url: string, init: RequestInit = {}) {
  for (let attempt = 1; attempt <= MAX_GITHUB_REQUEST_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...init,
        headers: { ...githubHeaders(), ...init.headers },
        cache: 'no-store',
      });
      if (response.ok) return await response.json() as T;

      let detail = '';
      try {
        const payload = await response.json() as { message?: unknown; errors?: unknown };
        if (typeof payload.message === 'string') detail = payload.message;
        if (Array.isArray(payload.errors)) {
          const validationDetails = payload.errors.flatMap((entry) => {
            if (!entry || typeof entry !== 'object') return [];
            const error = entry as { field?: unknown; code?: unknown; message?: unknown };
            const parts = [error.field, error.code, error.message]
              .filter((part): part is string => typeof part === 'string' && Boolean(part.trim()))
              .map((part) => part.trim().slice(0, 120));
            return parts.length ? [parts.join(': ')] : [];
          });
          if (validationDetails.length) detail = [detail, validationDetails.join('; ')].filter(Boolean).join(' — ');
        }
      } catch {
        // GitHub occasionally sends an empty non-JSON error body. Keep the
        // server response useful without leaking credentials or response data.
      }
      const error = new Error(`GitHub Releases request failed (${response.status})${detail ? `: ${detail}` : ''}`) as GithubApiFailure;
      error.status = response.status;
      throw error;
    } catch (error) {
      if (attempt >= MAX_GITHUB_REQUEST_ATTEMPTS || !retryableRequestFailure(error)) throw error;
      console.warn('github-releases-transient-retry', {
        attempt,
        status: githubReleaseErrorStatus(error),
        networkCode: nestedNetworkCode(error),
      });
      await retryDelay(attempt);
    }
  }
  throw new Error('GitHub Releases request failed after retries.');
}

function batchNumber(release: GitHubRelease) {
  const match = BATCH_TAG.exec(release.tag_name);
  return match ? Number.parseInt(match[1], 10) : null;
}

async function listBatchReleases() {
  const repository = githubReleaseRepository();
  const releases = await githubRequest<GitHubRelease[]>(`${GITHUB_API}/repos/${repository}/releases?per_page=100&page=1`);
  return releases
    .filter((release) => batchNumber(release) !== null)
    .sort((left, right) => (batchNumber(left) || 0) - (batchNumber(right) || 0));
}

async function listNewestBatchRelease() {
  const repository = githubReleaseRepository();
  const releases = await githubRequest<GitHubRelease[]>(`${GITHUB_API}/repos/${repository}/releases?per_page=1&page=1`);
  return releases.find((release) => batchNumber(release) !== null) || null;
}

async function listBatchTagNumbers() {
  const repository = githubReleaseRepository();
  const numbers: number[] = [];
  for (let page = 1; page <= MAX_BATCH_TAG_PAGES; page += 1) {
    const refs = await githubRequest<Array<{ ref?: string }>>(
      `${GITHUB_API}/repos/${repository}/git/matching-refs/tags/assets-batch-?per_page=${GITHUB_PAGE_SIZE}&page=${page}`,
    );
    numbers.push(...refs.flatMap((reference) => {
      if (typeof reference.ref !== 'string') return [];
      const match = /^refs\/tags\/assets-batch-(\d{3,})(?:-[0-9a-f-]{36})?$/i.exec(reference.ref);
      return match ? [Number.parseInt(match[1], 10)] : [];
    }));
    if (refs.length < GITHUB_PAGE_SIZE) return numbers;
  }
  throw new Error('GitHub returned too many asset batch tags to safely choose the next release.');
}

function nextBatchNumber(releases: GitHubRelease[]) {
  return releases.reduce((maximum, release) => Math.max(maximum, batchNumber(release) || 0), 0) + 1;
}

function nextBatchNumberFromReferences(releases: GitHubRelease[], tagNumbers: number[]) {
  const maximumTag = tagNumbers.reduce((maximum, number) => Math.max(maximum, number), 0);
  return Math.max(nextBatchNumber(releases), maximumTag + 1);
}

export function githubReleaseErrorStatus(error: unknown) {
  if (!error || typeof error !== 'object' || !('status' in error)) return null;
  const status = (error as GithubApiFailure).status;
  return typeof status === 'number' ? status : null;
}

function releaseTitle(number: number) {
  return `Guizzprints · Lote ${String(number).padStart(3, '0')}`;
}

function releaseTag(number: number, nonce?: string) {
  const base = `assets-batch-${String(number).padStart(3, '0')}`;
  return nonce ? `${base}-${nonce}` : base;
}

async function createBatchRelease(number: number, nonce?: string) {
  const repository = githubReleaseRepository();
  return await githubRequest<GitHubRelease>(`${GITHUB_API}/repos/${repository}/releases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tag_name: releaseTag(number, nonce),
      name: releaseTitle(number),
      body: 'Lote automático do catálogo Guizzprints. Os arquivos são publicados pelo painel administrativo.',
      draft: true,
      prerelease: false,
    }),
  });
}

function isExistingReleaseTagConflict(error: unknown) {
  if (githubReleaseErrorStatus(error) !== 422 || !(error instanceof Error)) return false;
  return /tag_name\s*:\s*already_exists/i.test(error.message);
}

async function selectReleaseWithSpace(excludedReleaseIds = new Set<number>()) {
  // Most uploads fit in the newest batch. Read that single release first so
  // each generated image does not download metadata for every older release
  // and its thousands of assets. Fall back to the complete list only when the
  // newest release is full, stale, or unrelated to this asset store.
  const newest = await listNewestBatchRelease();
  if (newest
    && (!newest.draft || newest.assets.length === 0)
    && !excludedReleaseIds.has(newest.id)
    && newest.assets.length < MAX_ASSETS_PER_RELEASE) return newest;

  const releases = await listBatchReleases();
  // Draft releases with assets may be left behind when GitHub accepts an
  // upload but rejects publishing the release because its tag is already
  // attached to an orphaned ref. Reusing that stale draft for each next file
  // makes every generated asset pay for a failed upload/publish cycle. Empty
  // drafts are safe to reuse, while a newly created draft is used immediately
  // by uploadReleaseAsset.
  const existing = releases.find((release) => (!release.draft || release.assets.length === 0)
    && !excludedReleaseIds.has(release.id)
    && release.assets.length < MAX_ASSETS_PER_RELEASE);
  if (existing) return existing;

  // A deleted release can leave its Git tag behind, and GitHub refuses to
  // recreate a release with that tag. Also handle concurrent publishers that
  // choose the same next number. Keep trying the next number after refreshing
  // releases; only skip when GitHub explicitly identifies tag_name as the
  // conflicting field.
  const tagNumbers = await listBatchTagNumbers();
  // Start new releases above the existing numeric batches, but use a UUID
  // suffix immediately. Sequential tags can already exist as orphaned refs
  // which GitHub's release list does not expose.
  let number = Math.max(nextBatchNumberFromReferences(releases, tagNumbers), Date.now());
  console.info('github-release-batch-selection', {
    releaseCount: releases.length,
    highestReleaseBatch: Math.max(0, ...releases.map((release) => batchNumber(release) || 0)),
    tagCount: tagNumbers.length,
    highestTagNumber: Math.max(0, ...tagNumbers),
    candidateTagPrefix: releaseTag(number),
  });
  let lastTagConflict: unknown;
  let lastAttemptedTag = '';
  for (let attempt = 0; attempt < MAX_BATCH_RELEASE_CREATE_ATTEMPTS; attempt += 1) {
    // Every newly created release gets a unique tag, avoiding collisions from
    // orphaned refs and concurrent publishers even on the first attempt.
    const nonce = crypto.randomUUID();
    const attemptedTag = releaseTag(number, nonce);
    lastAttemptedTag = attemptedTag;
    try {
      return await createBatchRelease(number, nonce);
    } catch (error) {
      if (!isExistingReleaseTagConflict(error)) throw error;
      console.warn('github-release-batch-tag-conflict', { attemptedTag, attempt: attempt + 1 });
      lastTagConflict = error;

      const [refreshed, tagNumbers] = await Promise.all([listBatchReleases(), listBatchTagNumbers()]);
      const createdElsewhere = refreshed.find((release) => !excludedReleaseIds.has(release.id) && release.assets.length < MAX_ASSETS_PER_RELEASE);
      if (createdElsewhere) return createdElsewhere;
      number = Math.max(number + 1, nextBatchNumberFromReferences(refreshed, tagNumbers), Date.now());
    }
  }
  if (lastTagConflict instanceof Error) {
    const error = new Error(`${lastTagConflict.message} (last attempted batch tag: ${lastAttemptedTag})`) as GithubApiFailure;
    error.status = githubReleaseErrorStatus(lastTagConflict) ?? undefined;
    throw error;
  }
  throw new Error('Could not create a new GitHub asset batch after repeated tag conflicts.');
}

async function getRelease(releaseId: number) {
  const repository = githubReleaseRepository();
  return await githubRequest<GitHubRelease>(`${GITHUB_API}/repos/${repository}/releases/${releaseId}`);
}

async function publishRelease(release: GitHubRelease) {
  if (!release.draft) return release;
  const repository = githubReleaseRepository();
  try {
    return await githubRequest<GitHubRelease>(`${GITHUB_API}/repos/${repository}/releases/${release.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draft: false, prerelease: false }),
    });
  } catch (error) {
    // Another request may have published this shared batch first.
    if (githubReleaseErrorStatus(error) !== 422) throw error;
    const refreshed = await getRelease(release.id);
    if (!refreshed.draft) return refreshed;
    throw error;
  }
}

function safeAssetName(value: string) {
  const cleaned = value
    .normalize('NFKD')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
  return cleaned || `guizzprints-${crypto.randomUUID()}.bin`;
}

/**
 * Adds an asset to the oldest batch that still has room. Draft batches become
 * public only after their first successful upload, which makes their direct
 * GitHub download URL available immediately while avoiding empty releases.
 */
export async function uploadReleaseAsset(file: ArrayBuffer, fileName: string, contentType: string): Promise<UploadedReleaseAsset> {
  let release = await selectReleaseWithSpace();
  const assetName = safeAssetName(fileName);
  const attemptedReleaseIds = new Set<number>();

  for (let attempt = 0; attempt < MAX_ASSET_UPLOAD_ATTEMPTS; attempt += 1) {
    let asset: GitHubAsset | null = null;
    const uploadBase = release.upload_url.replace(/\{\?.*$/, '');
    const url = new URL(uploadBase);
    url.searchParams.set('name', assetName);

    try {
      asset = await githubRequest<GitHubAsset>(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': contentType || 'application/octet-stream' },
        body: file,
      });
    } catch (error) {
      if (githubReleaseErrorStatus(error) !== 422) throw error;

      // A timed-out/retried request may already have created this exact
      // asset. Reuse it instead of failing the publication or duplicating it.
      let refreshed: GitHubRelease;
      try {
        refreshed = await getRelease(release.id);
      } catch {
        // Keep the actionable upload rejection if GitHub's follow-up read is
        // temporarily unavailable; do not replace it with a second error.
        throw error;
      }
      const existing = refreshed.assets.find((candidate) => candidate.name === assetName && (candidate.size === undefined || candidate.size === file.byteLength));
      if (existing) {
        release = refreshed;
        asset = existing;
      } else {
        // GitHub rejects duplicate asset names with 422. Retry the same asset
        // name in another batch when the selected release changed concurrently
        // or already contains an incompatible asset with that name.
        attemptedReleaseIds.add(release.id);
        if (attempt + 1 >= MAX_ASSET_UPLOAD_ATTEMPTS) throw error;
        release = await selectReleaseWithSpace(attemptedReleaseIds);
        continue;
      }
    }

    if (!asset) throw new Error('GitHub Releases could not store the generated asset.');
    try {
      release = await publishRelease(release);
      return { url: asset.browser_download_url, releaseTag: release.tag_name, assetName: asset.name };
    } catch (error) {
      // A draft release may accept the asset but fail when it is published if
      // GitHub reports that its tag is already attached to another release.
      // Keep this batch out of future attempts and upload the same asset into
      // another batch with a fresh tag instead of failing the whole publish.
      if (!isExistingReleaseTagConflict(error)) throw error;
      const refreshed = await getRelease(release.id).catch(() => null);
      if (refreshed && !refreshed.draft) {
        return { url: asset.browser_download_url, releaseTag: refreshed.tag_name, assetName: asset.name };
      }

      attemptedReleaseIds.add(release.id);
      if (attempt + 1 >= MAX_ASSET_UPLOAD_ATTEMPTS) throw error;
      console.warn('github-release-batch-publish-tag-conflict', {
        releaseId: release.id,
        releaseTag: release.tag_name,
        attempt: attempt + 1,
      });
      release = await selectReleaseWithSpace(attemptedReleaseIds);
    }
  }

  throw new Error('GitHub Releases could not store the generated asset after trying multiple batches.');
}

export function isGithubReleaseAssetUrl(value: string) {
  try {
    const url = new URL(value);
    const [owner, repository] = githubReleaseRepository().split('/');
    return url.protocol === 'https:'
      && url.hostname === 'github.com'
      && url.pathname.startsWith(`/${owner}/${repository}/releases/download/`);
  } catch {
    return false;
  }
}
