import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_SOURCE_BYTES = 8 * 1024 * 1024;
const MAX_SOURCE_URL_LENGTH = 2_048;
const MAX_WIDTH = 1_600;
const MAX_HEIGHT = 1_200;
const MAX_QUALITY = 90;
const FETCH_TIMEOUT_MS = 8_000;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function isPrivateHostname(hostname: string) {
  const host = hostname.toLowerCase().replace(/^\[/u, '').replace(/\]$/u, '').replace(/\.$/u, '');
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) return true;
  if (host === '::1' || host === '0.0.0.0' || host === '127.0.0.1') return true;
  if (host.includes(':')) return host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe8') || host.startsWith('fe9') || host.startsWith('fea') || host.startsWith('feb');

  const octets = host.split('.').map(Number);
  if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [first, second] = octets;
  return first === 10 || first === 127 || (first === 172 && second >= 16 && second <= 31) || (first === 192 && second === 168) || (first === 169 && second === 254);
}

function isAllowedRemoteUrl(value: URL) {
  return (value.protocol === 'http:' || value.protocol === 'https:') && !isPrivateHostname(value.hostname);
}

function hasImageFileExtension(value: URL) {
  return /\.(?:avif|gif|jpe?g|png|webp)$/iu.test(value.pathname);
}

async function readBoundedBody(response: Response) {
  const contentLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_SOURCE_BYTES) throw new Error('image-too-large');
  if (!response.body) {
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength > MAX_SOURCE_BYTES) throw new Error('image-too-large');
    return buffer;
  }

  const reader = response.body.getReader();
  const chunks: Buffer[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_SOURCE_BYTES) {
      await reader.cancel();
      throw new Error('image-too-large');
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks, total);
}

function errorResponse(status: number, message: string) {
  return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get('src')?.trim() || '';
  if (!source || source.length > MAX_SOURCE_URL_LENGTH) return errorResponse(400, 'Invalid image source');

  let parsed: URL;
  try {
    parsed = new URL(source);
  } catch {
    return errorResponse(400, 'Invalid image source');
  }
  if (!isAllowedRemoteUrl(parsed)) return errorResponse(400, 'Private image hosts are not allowed');

  const width = clamp(Number(request.nextUrl.searchParams.get('w')) || 480, 64, MAX_WIDTH);
  const heightParam = Number(request.nextUrl.searchParams.get('h'));
  const height = Number.isFinite(heightParam) && heightParam > 0 ? clamp(heightParam, 64, MAX_HEIGHT) : undefined;
  const quality = clamp(Number(request.nextUrl.searchParams.get('q')) || 74, 40, MAX_QUALITY);

  try {
    let upstream: Response | null = null;
    let currentUrl = parsed;
    for (let redirect = 0; redirect <= 2; redirect += 1) {
      upstream = await fetch(currentUrl, {
        headers: { Accept: 'image/avif,image/webp,image/jpeg,image/png,*/*;q=0.5' },
        redirect: 'manual',
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (![301, 302, 303, 307, 308].includes(upstream.status)) break;
      const location = upstream.headers.get('location');
      if (!location) return errorResponse(502, 'Image source redirect is invalid');
      currentUrl = new URL(location, currentUrl);
      if (!isAllowedRemoteUrl(currentUrl)) return errorResponse(400, 'Private image hosts are not allowed');
      upstream = null;
    }
    if (!upstream || [301, 302, 303, 307, 308].includes(upstream.status)) return errorResponse(502, 'Image source redirect is invalid');
    if (!upstream.ok) return errorResponse(502, 'Image source unavailable');

    const contentType = upstream.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() || '';
    // GitHub Releases returns uploaded PNGs as `application/octet-stream`,
    // even when the asset has a valid image extension. Let Sharp verify those
    // bounded assets instead of hiding valid covers, views and boards.
    if (!contentType.startsWith('image/') && !hasImageFileExtension(parsed) && !hasImageFileExtension(currentUrl)) {
      return errorResponse(415, 'Image source is not an image');
    }

    const input = await readBoundedBody(upstream);
    const output = await sharp(input, { failOn: 'none' })
      .rotate()
      .resize({ width, height, fit: height ? 'cover' : 'inside', withoutEnlargement: true })
      .webp({ quality, effort: 3 })
      .toBuffer();

    return new NextResponse(output, {
      headers: {
        'Content-Type': 'image/webp',
        // The transformation URL contains the source and exact dimensions,
        // so successful variants are safe to reuse for 30 days in browsers.
        // Keep the CDN warm for a year while avoiding `immutable`: a
        // Marketplace image can legitimately be replaced at the same URL.
        'Cache-Control': 'public, max-age=2592000, s-maxage=31536000, stale-while-revalidate=604800',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'image-too-large') return errorResponse(413, 'Image source is too large');
    return errorResponse(502, 'Image transformation failed');
  }
}
