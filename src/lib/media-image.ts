const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1200;
const MAX_QUALITY = 90;
const RESPONSIVE_WIDTHS = [64, 96, 128, 160, 220, 256, 320, 384, 480, 640, 768, 1024, 1280, 1440, 1600];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function isRemoteImageSource(source: string | null | undefined) {
  const value = source?.trim();
  if (!value || value.startsWith('/') || value.startsWith('data:')) return false;

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function proportionalHeight(baseWidth: number, baseHeight: number | undefined, width: number) {
  if (!baseHeight) return undefined;
  return Math.max(64, Math.round(baseHeight * (width / baseWidth)));
}

/**
 * Returns the bounded candidates used by the browser's native srcset picker.
 * The smallest candidate is kept large enough for the API's minimum height so
 * fixed-ratio cards do not become distorted at narrow widths.
 */
export function responsiveImageWidths(width: number, height?: number) {
  const maxWidth = clamp(width, 64, MAX_WIDTH);
  const minWidth = height ? Math.max(64, Math.ceil((64 * maxWidth) / clamp(height, 64, MAX_HEIGHT))) : 64;
  const candidates = RESPONSIVE_WIDTHS.filter((candidate) => candidate >= minWidth && candidate < maxWidth);
  return [...new Set([...candidates, maxWidth])];
}

/**
 * Builds a same-origin image URL for remote catalog media. Local assets stay
 * untouched so the optimizer can never turn a broken remote image into a
 * broken logo or icon.
 */
export function optimizedImageUrl(
  source: string | null | undefined,
  width: number,
  height?: number,
  quality = 74,
) {
  const value = source?.trim();
  if (!value || value.startsWith('/') || value.startsWith('data:')) {
    return value || '/logo.jpg';
  }

  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return value;
  } catch {
    return value;
  }

  const params = new URLSearchParams({
    src: value,
    w: String(clamp(width, 64, MAX_WIDTH)),
    q: String(clamp(quality, 40, MAX_QUALITY)),
  });
  if (height) params.set('h', String(clamp(height, 64, MAX_HEIGHT)));
  return `/api/asset?${params.toString()}`;
}

/**
 * Builds a responsive srcset for remote images. Each candidate keeps the
 * source aspect ratio while remaining bounded by the same transformation
 * route used for the fallback `src`.
 */
export function optimizedImageSrcSet(
  source: string | null | undefined,
  width: number,
  height?: number,
  quality = 74,
) {
  if (!isRemoteImageSource(source)) return undefined;

  const maxWidth = clamp(width, 64, MAX_WIDTH);
  return responsiveImageWidths(maxWidth, height)
    .map((candidate) => {
      const candidateHeight = proportionalHeight(maxWidth, height, candidate);
      const url = optimizedImageUrl(source, candidate, candidateHeight, quality);
      return `${url} ${candidate}w`;
    })
    .join(', ');
}
