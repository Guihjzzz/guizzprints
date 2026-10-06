import 'server-only';

const GITHUB_API = 'https://api.github.com';
const MAX_ASSETS_PER_RELEASE = 1_000;
const BATCH_TAG = /^assets-batch-(\d{3,})$/;

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

const MAX_ASSET_UPLOAD_ATTEMPTS = 3;

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

async function githubRequest<T>(url: string, init: RequestInit = {}) {
  const response = await fetch(url, {
    ...init,
    headers: { ...githubHeaders(), ...init.headers },
    cache: 'no-store',
  });
  if (response.ok) return await response.json() as T;

  let detail = '';
  try {
    const payload = await response.json() as { message?: unknown };
    if (typeof payload.message === 'string') detail = payload.message;
  } catch {
    // GitHub occasionally sends an empty non-JSON error body. Keep the
    // server response useful without leaking credentials or response data.
  }
  const error = new Error(`GitHub Releases request failed (${response.status})${detail ? `: ${detail}` : ''}`) as GithubApiFailure;
  error.status = response.status;
  throw error;
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

function nextBatchNumber(releases: GitHubRelease[]) {
  return releases.reduce((maximum, release) => Math.max(maximum, batchNumber(release) || 0), 0) + 1;
}

export function githubReleaseErrorStatus(error: unknown) {
  if (!error || typeof error !== 'object' || !('status' in error)) return null;
  const status = (error as GithubApiFailure).status;
  return typeof status === 'number' ? status : null;
}

function releaseTitle(number: number) {
  return `Guizzprints · Lote ${String(number).padStart(3, '0')}`;
}

function releaseTag(number: number) {
  return `assets-batch-${String(number).padStart(3, '0')}`;
}

async function createBatchRelease(number: number) {
  const repository = githubReleaseRepository();
  return await githubRequest<GitHubRelease>(`${GITHUB_API}/repos/${repository}/releases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tag_name: releaseTag(number),
      name: releaseTitle(number),
      body: 'Lote automático do catálogo Guizzprints. Os arquivos são publicados pelo painel administrativo.',
      draft: true,
      prerelease: false,
    }),
  });
}

async function selectReleaseWithSpace(excludedReleaseIds = new Set<number>()) {
  const releases = await listBatchReleases();
  const existing = releases.find((release) => !excludedReleaseIds.has(release.id) && release.assets.length < MAX_ASSETS_PER_RELEASE);
  if (existing) return existing;

  const number = nextBatchNumber(releases);
  try {
    return await createBatchRelease(number);
  } catch (error) {
    // A second publish request can create the same next batch between our
    // listing and POST. Read the list again and use its available release.
    if ((error as GithubApiFailure).status !== 422) throw error;
    const refreshed = await listBatchReleases();
    const createdElsewhere = refreshed.find((release) => !excludedReleaseIds.has(release.id) && release.assets.length < MAX_ASSETS_PER_RELEASE);
    if (createdElsewhere) return createdElsewhere;
    throw error;
  }
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
  let asset: GitHubAsset | null = null;

  for (let attempt = 0; attempt < MAX_ASSET_UPLOAD_ATTEMPTS; attempt += 1) {
    const uploadBase = release.upload_url.replace(/\{\?.*$/, '');
    const url = new URL(uploadBase);
    url.searchParams.set('name', assetName);

    try {
      asset = await githubRequest<GitHubAsset>(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': contentType || 'application/octet-stream' },
        body: file,
      });
      break;
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
        break;
      }

      // GitHub rejects duplicate asset names with 422. Retry the same asset
      // name in another batch when the selected release changed concurrently
      // or already contains an incompatible asset with that name.
      attemptedReleaseIds.add(release.id);
      if (attempt + 1 >= MAX_ASSET_UPLOAD_ATTEMPTS) throw error;
      release = await selectReleaseWithSpace(attemptedReleaseIds);
    }
  }

  if (!asset) throw new Error('GitHub Releases could not store the generated asset.');
  release = await publishRelease(release);

  return { url: asset.browser_download_url, releaseTag: release.tag_name, assetName: asset.name };
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
