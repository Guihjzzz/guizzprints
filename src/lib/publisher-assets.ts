export const PUBLISHER_BUCKET = 'guizz-publisher';
export const MAX_PUBLISHER_FILE_BYTES = 100 * 1024 * 1024;
// Vercel rejects oversized function request bodies before the route runs. Keep
// each multipart request well below that platform limit, including FormData
// overhead and authorization headers.
export const PUBLISHER_CHUNK_BYTES = 2 * 1024 * 1024;
export const MAX_PUBLISHER_CHUNKS = Math.ceil(MAX_PUBLISHER_FILE_BYTES / PUBLISHER_CHUNK_BYTES);

export const publisherAssetKinds = new Set(['source', 'schem', 'cover', 'view', 'board', 'download']);
export const publisherAssetExtensions: Record<string, RegExp> = {
  source: /\.mcstructure$/i,
  schem: /\.schem$/i,
  cover: /\.png$/i,
  view: /\.png$/i,
  board: /\.png$/i,
};
export const publisherDownloadExtensions: Record<string, RegExp> = {
  holoprint: /\.mcstructure$/i,
  mcstructure: /\.mcstructure$/i,
  mcaddon: /\.mcaddon$/i,
  mcworld: /\.mcworld$/i,
  litematic: /\.litematic$/i,
  schematic: /\.(?:schematic|schem)$/i,
  world: /\.(?:zip|mcworld)$/i,
  mcfunction: /\.mcfunction$/i,
};

export function cleanPublisherSlug(value: unknown) {
  if (typeof value !== 'string') return '';
  return value.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

export function cleanPublisherFormat(value: unknown) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export function publisherContentType(kind: string, format: string) {
  if (kind === 'cover' || kind === 'view' || kind === 'board') return 'image/png';
  if (kind !== 'download') return 'application/octet-stream';
  if (format === 'mcfunction') return 'text/plain; charset=utf-8';
  if (format === 'world') return 'application/zip';
  return 'application/octet-stream';
}

export function publisherFileRule(kind: string, format: string) {
  return kind === 'download' ? publisherDownloadExtensions[format] : publisherAssetExtensions[kind];
}

export function validPublisherUploadId(value: unknown) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function publisherTempPath(uploadId: string, index: number) {
  return `tmp/${uploadId}/${String(index).padStart(4, '0')}.part`;
}
