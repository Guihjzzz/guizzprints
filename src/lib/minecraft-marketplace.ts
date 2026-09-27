import { createHash } from 'node:crypto';

const MINECRAFT_HOSTS = new Set(['minecraft.net', 'www.minecraft.net']);
const ASSET_HOST_PATTERNS = [
  /^xforgeassets\d+\.xboxlive\.com$/i,
  /^content\d+\.prod\.catalog\.playfab\.com$/i,
];
// Marketplace item IDs are GUIDs today, but accepting an opaque URL-safe ID
// keeps the importer resilient if Minecraft changes the identifier format.
// Minecraft's canonical slugs can contain punctuation such as `&`, `:` and
// their percent-encoded forms. The host, locale, route shape and opaque item
// identifier remain strictly constrained; only the two human-readable slug
// segments are intentionally permissive.
const MARKETPLACE_PATH = /^\/[a-z]{2}(?:-[a-z]{2})?\/marketplace\/pdp\/[^/]+\/[^/]+\/[A-Za-z0-9_-]{8,128}\/?$/i;
const MAX_SOURCE_BYTES = 2_500_000;
// Keep the request below the Hobby function budget while leaving enough room
// for Minecraft's CDN to finish its HTML response on a cold serverless invoke.
const FETCH_TIMEOUT_MS = 9_000;

export type MinecraftMarketplaceMetadata = {
  sourceUrl: string;
  title: string;
  description: string;
  youtubeTrailerUrl: string | null;
  imageUrls: string[];
  categorySuggestion: string | null;
  /** Official Marketplace metadata kept separate from GuizzMods pricing. */
  creator: string | null;
  tags: string[];
  publishedAt: string | null;
  packType: string | null;
  subcategorySuggestion: string | null;
  fingerprint: string;
  fetchedAt: string;
};

const MAX_METADATA_TEXT = 160;
const MAX_TAGS = 32;

function normalizeMetadataText(value: unknown) {
  if (typeof value !== 'string') return null;
  const normalized = decodeHtml(value).replace(/\s+/g, ' ').trim();
  return normalized ? normalized.slice(0, MAX_METADATA_TEXT) : null;
}

function readNamedValue(value: unknown): string | null {
  const direct = normalizeMetadataText(value);
  if (direct) return direct;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  for (const key of ['name', 'displayName', 'title', 'label', 'value', 'type', 'slug']) {
    const named = normalizeMetadataText(record[key]);
    if (named) return named;
  }
  return null;
}

function normalizeTags(value: unknown) {
  const values = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(/[;,|]/u)
      : [value];
  const tags: string[] = [];
  for (const entry of values) {
    const tag = readNamedValue(entry);
    if (!tag || tags.includes(tag)) continue;
    tags.push(tag);
    if (tags.length >= MAX_TAGS) break;
  }
  return tags;
}

function normalizePublishedAt(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    // APIs commonly use Unix seconds, while JavaScript uses milliseconds.
    const milliseconds = value < 10_000_000_000 ? value * 1_000 : value;
    const date = new Date(milliseconds);
    return date.getUTCFullYear() >= 2000 && date.getUTCFullYear() <= 2100 ? date.toISOString() : null;
  }
  const text = normalizeMetadataText(value);
  if (!text) return null;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) || date.getUTCFullYear() < 2000 || date.getUTCFullYear() > 2100
    ? null
    : date.toISOString();
}

function packTypeKey(value: string | null) {
  return value?.toLowerCase().replace(/[^a-z0-9]+/g, '') || '';
}

/** Maps the official package type to one of the catalog's existing categories. */
function suggestSubcategory(packType: string | null) {
  const key = packTypeKey(packType);
  if (!key) return null;
  if (/(?:worldtemplate|world|map|adventure)/.test(key)) return 'maps';
  if (/(?:resourcepack|texturepack|textures?|resource)/.test(key)) return 'textures';
  if (/(?:skinpack|skins?)/.test(key)) return 'skins';
  if (/(?:shaderpack|shaders?)/.test(key)) return 'shaders';
  if (/(?:mashup|mashupworld)/.test(key)) return 'mash-up';
  if (/(?:addonpack|addons?|behaviorpack|behaviourpack|worldtemplateaddon)/.test(key)) return 'addons';
  return null;
}

export function parseMinecraftMarketplaceUrl(input: unknown): URL {
  if (!(input instanceof URL) && (typeof input !== 'string' || input.trim().length === 0 || input.length > 2_048)) {
    throw new Error('A valid Minecraft Marketplace URL is required.');
  }

  let url: URL;
  try {
    url = input instanceof URL ? new URL(input.toString()) : new URL(input.trim());
  } catch {
    throw new Error('A valid Minecraft Marketplace URL is required.');
  }

  if (url.protocol !== 'https:' || !MINECRAFT_HOSTS.has(url.hostname.toLowerCase())
    || url.port || url.username || url.password || !MARKETPLACE_PATH.test(url.pathname)) {
    throw new Error('Only official Minecraft Marketplace item URLs are allowed.');
  }

  url.search = '';
  url.hash = '';
  return url;
}

function decodeHtml(value: string) {
  return value
    .replace(/&quot;|&#34;|&#x22;/gi, '"')
    .replace(/&apos;|&#39;|&#x27;/gi, "'")
    .replace(/&amp;|&#38;|&#x26;/gi, '&')
    .replace(/&lt;|&#60;|&#x3c;/gi, '<')
    .replace(/&gt;|&#62;|&#x3e;/gi, '>')
    .replace(/&#x2f;|&#47;/gi, '/')
    .trim();
}

function stripTags(value: string) {
  return decodeHtml(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' '));
}

function readAttributes(tag: string) {
  const attributes = new Map<string, string>();
  const pattern = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  for (const match of tag.matchAll(pattern)) {
    attributes.set(match[1].toLowerCase(), decodeHtml(match[2] ?? match[3] ?? ''));
  }
  return attributes;
}

function readMeta(html: string, key: string) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = readAttributes(match[0]);
    if (attributes.get('property')?.toLowerCase() === key.toLowerCase()
      || attributes.get('name')?.toLowerCase() === key.toLowerCase()) {
      return attributes.get('content') || null;
    }
  }
  return null;
}

function isAllowedAsset(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ASSET_HOST_PATTERNS.some((pattern) => pattern.test(url.hostname));
  } catch {
    return false;
  }
}

function collectImages(html: string, jsonLdValues: unknown[]) {
  const candidates: string[] = [];
  const add = (value: unknown) => {
    if (typeof value !== 'string') return;
    const normalized = decodeHtml(value).replace(/\\\//g, '/');
    if (isAllowedAsset(normalized)) candidates.push(normalized);
  };

  for (const value of jsonLdValues) {
    if (!value || typeof value !== 'object') continue;
    const image = (value as { image?: unknown }).image;
    if (Array.isArray(image)) image.forEach(add);
    else add(image);
  }

  for (const match of html.matchAll(/<(?:img|source)\b[^>]*>/gi)) {
    const attributes = readAttributes(match[0]);
    add(attributes.get('src'));
    add(attributes.get('data-src'));
    add(attributes.get('content'));
  }

  const unique = [...new Set(candidates)];
  return unique
    .sort((left, right) => {
      const rank = (value: string) => /thumbnail/i.test(value) ? 0 : /screenshot/i.test(value) ? 1 : 2;
      return rank(left) - rank(right);
    })
    .slice(0, 5);
}

function collectJsonLd(html: string) {
  const values: unknown[] = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(match[1].trim());
      const entries = Array.isArray(parsed) ? parsed : [parsed];
      values.push(...entries.filter((entry) => entry && typeof entry === 'object'));
    } catch {
      // A malformed unrelated JSON-LD block must not prevent importing the page.
    }
  }
  return values;
}

function isProductJsonLd(value: unknown): value is { name?: unknown; description?: unknown; image?: unknown } {
  const type = (value as { '@type'?: unknown } | null)?.['@type'];
  return type === 'Product' || (Array.isArray(type) && type.some((entry) => entry === 'Product'));
}

function readTitle(html: string, jsonLdValues: unknown[]) {
  const product = jsonLdValues.find(isProductJsonLd);
  if (typeof product?.name === 'string' && product.name.trim()) return decodeHtml(product.name);
  const ogTitle = readMeta(html, 'og:title');
  if (ogTitle) return ogTitle;
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return title ? stripTags(title).replace(/\s*[|–-]\s*Minecraft\s*$/i, '').trim() : '';
}

function readDescription(html: string, jsonLdValues: unknown[]) {
  const product = jsonLdValues.find(isProductJsonLd);
  if (typeof product?.description === 'string' && product.description.trim()) return decodeHtml(product.description);
  return readMeta(html, 'description') || readMeta(html, 'og:description') || '';
}

function readVideo(html: string) {
  const normalized = decodeHtml(html).replace(/\\\//g, '/');
  const embed = normalized.match(/https?:\/\/(?:www\.)?youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/i)?.[1]
    || normalized.match(/https?:\/\/(?:www\.)?youtube\.com\/watch\?[^"'\s>]*?v=([A-Za-z0-9_-]{6,})/i)?.[1]
    || normalized.match(/https?:\/\/youtu\.be\/([A-Za-z0-9_-]{6,})/i)?.[1];
  return embed ? `https://www.youtube.com/watch?v=${embed}` : null;
}

function suggestCategory(title: string, html: string) {
  const titleText = title.toLowerCase();
  if (/\bskin(?:s| pack)?\b/.test(titleText)) return 'skins';
  if (/\btexture(?:s| pack)?\b/.test(titleText)) return 'textures';
  if (/\bshader(?:s| pack)?\b/.test(titleText)) return 'shaders';
  if (/\bmash[- ]?up\b/.test(titleText)) return 'mash-up';
  if (/\b(?:world|map|adventure)\b/.test(titleText)) return 'maps';

  const text = stripTags(html).toLowerCase();
  if (/\bskin(?:s| pack)?\b/.test(text)) return 'skins';
  if (/\btexture(?:s| pack)?\b/.test(text)) return 'textures';
  if (/\bshader(?:s| pack)?\b/.test(text)) return 'shaders';
  if (/\b(?:world|map|adventure)\b/.test(text)) return 'maps';
  if (/\badd[- ]?on\b/.test(text)) return 'addons';
  return null;
}

function readMarketplaceApiResult(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const result = (value as { result?: unknown }).result;
  if (!result || typeof result !== 'object' || Array.isArray(result)) return null;
  return result as {
    title?: unknown;
    neutralTitle?: unknown;
    description?: unknown;
    image?: unknown;
    images?: unknown;
    videoUrl?: unknown;
    tags?: unknown;
    localizedGenres?: unknown;
    localizedSubgenres?: unknown;
    packType?: unknown;
    worldType?: unknown;
    creator?: unknown;
    author?: unknown;
    publisher?: unknown;
    creatorName?: unknown;
    authorName?: unknown;
    publisherName?: unknown;
    studio?: unknown;
    publishedAt?: unknown;
    datePublished?: unknown;
    publicationDate?: unknown;
    releaseDate?: unknown;
    createdAt?: unknown;
    published?: unknown;
    time?: unknown;
    productType?: unknown;
  };
}

function normalizeYoutubeUrl(value: unknown) {
  if (typeof value !== 'string') return null;
  const match = value.match(/(?:youtube\.com\/(?:watch\?[^#]*?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i);
  return match ? `https://www.youtube.com/watch?v=${match[1]}` : null;
}

export function parseMinecraftMarketplaceApiPayload(payload: unknown, sourceUrl: URL | string): MinecraftMarketplaceMetadata {
  const canonicalUrl = parseMinecraftMarketplaceUrl(sourceUrl);
  const result = readMarketplaceApiResult(payload);
  const title = typeof result?.title === 'string' && result.title.trim()
    ? result.title.trim()
    : typeof result?.neutralTitle === 'string' && result.neutralTitle.trim()
      ? result.neutralTitle.trim()
      : '';
  if (!title) throw new Error('The Minecraft Marketplace API did not expose an item title.');

  const imageCandidates = [result?.image, ...(Array.isArray(result?.images) ? result.images : [])]
    .filter((value): value is string => typeof value === 'string')
    .filter(isAllowedAsset);
  const imageUrls = [...new Set(imageCandidates)].slice(0, 5);
  const description = typeof result?.description === 'string' ? result.description.trim() : '';
  const youtubeTrailerUrl = normalizeYoutubeUrl(result?.videoUrl);
  const packType = readNamedValue(result?.packType || result?.productType);
  const creator = [result?.creator, result?.author, result?.publisher, result?.studio, result?.creatorName, result?.authorName, result?.publisherName]
    .map(readNamedValue)
    .find((value): value is string => Boolean(value)) || null;
  const directTags = normalizeTags(result?.tags);
  const tags = directTags.length > 0
    ? directTags
    : normalizeTags([result?.localizedGenres, result?.localizedSubgenres]
      .flatMap((value) => Array.isArray(value) ? value : [value]));
  const publishedAt = [result?.publishedAt, result?.datePublished, result?.publicationDate, result?.releaseDate, result?.createdAt, result?.published, result?.time]
    .map(normalizePublishedAt)
    .find((value): value is string => Boolean(value)) || null;
  const textHints = [result?.packType, result?.worldType, result?.localizedGenres, result?.localizedSubgenres, result?.tags]
    .flatMap((value) => Array.isArray(value) ? value : [value])
    .filter((value): value is string => typeof value === 'string')
    .join(' ');
  const subcategorySuggestion = suggestSubcategory(packType);
  // Official pack type is the strongest signal. Reuse it for the required
  // top-level category as well, then fall back to title/description hints.
  const categorySuggestion = subcategorySuggestion || suggestCategory(title, textHints);
  const fingerprint = createHash('sha256')
    .update(JSON.stringify({ title, description, imageUrls, youtubeTrailerUrl, creator, tags, publishedAt, packType, subcategorySuggestion }))
    .digest('hex');

  return {
    sourceUrl: canonicalUrl.toString(),
    title,
    description,
    youtubeTrailerUrl,
    imageUrls,
    categorySuggestion,
    creator,
    tags,
    publishedAt,
    packType,
    subcategorySuggestion,
    fingerprint,
    fetchedAt: new Date().toISOString(),
  };
}

export function parseMinecraftMarketplaceHtml(html: string, sourceUrl: URL | string): MinecraftMarketplaceMetadata {
  if (typeof html !== 'string' || html.length === 0 || html.length > MAX_SOURCE_BYTES) {
    throw new Error('The Minecraft Marketplace page is unavailable or too large.');
  }

  const canonicalUrl = parseMinecraftMarketplaceUrl(sourceUrl).toString();
  const jsonLdValues = collectJsonLd(html);
  const title = readTitle(html, jsonLdValues);
  if (!title) throw new Error('The Minecraft Marketplace page did not expose an item title.');
  const description = readDescription(html, jsonLdValues);
  const imageUrls = collectImages(html, jsonLdValues);
  const youtubeTrailerUrl = readVideo(html);
  const categorySuggestion = suggestCategory(title, html);
  const product = jsonLdValues.find(isProductJsonLd) as Record<string, unknown> | undefined;
  const creator = [product?.creator, product?.author, product?.brand]
    .map(readNamedValue)
    .find((value): value is string => Boolean(value)) || null;
  const tags = normalizeTags(product?.keywords || readMeta(html, 'keywords'));
  const publishedAt = normalizePublishedAt(product?.datePublished || readMeta(html, 'article:published_time'));
  const packType = normalizeMetadataText(product?.category || readMeta(html, 'minecraft:pack_type'));
  const subcategorySuggestion = suggestSubcategory(packType);
  const fingerprint = createHash('sha256')
    .update(JSON.stringify({ title, description, imageUrls, youtubeTrailerUrl, creator, tags, publishedAt, packType, subcategorySuggestion }))
    .digest('hex');

  return {
    sourceUrl: canonicalUrl,
    title,
    description,
    youtubeTrailerUrl,
    imageUrls,
    categorySuggestion,
    creator,
    tags,
    publishedAt,
    packType,
    subcategorySuggestion,
    fingerprint,
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchMinecraftMarketplaceMetadata(input: unknown, fetcher: typeof fetch = fetch) {
  const sourceUrl = parseMinecraftMarketplaceUrl(input);

  // The visible Marketplace page is hydrated client-side and often contains
  // no item data in its initial HTML. The same official site exposes a small,
  // read-only catalog endpoint used by its own page; use it for production
  // imports, while retaining the HTML path for deterministic unit fixtures.
  if (fetcher === fetch) {
    const segments = sourceUrl.pathname.split('/').filter(Boolean);
    const locale = segments[0].toLowerCase();
    const itemId = segments[5];
    const apiUrl = new URL(`https://net-secondary.web.minecraft-services.net/api/v1.0/${locale}/marketplace/item/${itemId}`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetcher(apiUrl, {
        method: 'GET',
        redirect: 'follow',
        cache: 'no-store',
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        },
      });
      if (!response.ok) throw new Error('The Minecraft Marketplace catalog API could not be fetched.');
      if (response.url && new URL(response.url).hostname !== 'net-secondary.web.minecraft-services.net') {
        throw new Error('The Minecraft Marketplace catalog API redirected unexpectedly.');
      }
      const contentType = response.headers.get('content-type') || '';
      if (contentType && !/application\/json/i.test(contentType)) throw new Error('The Minecraft Marketplace catalog response is not JSON.');
      const contentLength = Number(response.headers.get('content-length'));
      if (Number.isFinite(contentLength) && contentLength > MAX_SOURCE_BYTES) throw new Error('The Minecraft Marketplace catalog response is too large.');
      const raw = await response.text();
      if (Buffer.byteLength(raw, 'utf8') > MAX_SOURCE_BYTES) throw new Error('The Minecraft Marketplace catalog response is too large.');
      return parseMinecraftMarketplaceApiPayload(JSON.parse(raw), sourceUrl);
    } finally {
      clearTimeout(timeout);
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetcher(sourceUrl, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
        // Minecraft's edge sometimes serves a challenge page to identifiable
        // bot user-agents. A normal browser UA is still read-only and avoids
        // changing the source site while making the import reliable.
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        'Accept-Encoding': 'identity',
      },
    });
    if (!response.ok) throw new Error('The Minecraft Marketplace page could not be fetched.');
    if (response.url) parseMinecraftMarketplaceUrl(response.url);
    const contentType = response.headers.get('content-type') || '';
    if (contentType && !/text\/html|application\/xhtml\+xml/i.test(contentType)) {
      throw new Error('The Minecraft Marketplace response is not HTML.');
    }
    const contentLength = Number(response.headers.get('content-length'));
    if (Number.isFinite(contentLength) && contentLength > MAX_SOURCE_BYTES) {
      throw new Error('The Minecraft Marketplace page is too large.');
    }
    const html = await response.text();
    return parseMinecraftMarketplaceHtml(html, sourceUrl);
  } finally {
    clearTimeout(timeout);
  }
}
