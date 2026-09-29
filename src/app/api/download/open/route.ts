import { NextRequest, NextResponse } from 'next/server';
import { downloadAccessCookie, readDownloadAccessToken } from '@/lib/download-access';
import { parseAllowedDownloadUrl } from '@/lib/download-url';
import { invokeGuizzCatalog } from '@/lib/guizz-catalog-edge';
import { logServerFailure } from '@/lib/server-observability';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0', 'Referrer-Policy': 'no-referrer' };
const FORMAT_IDS = new Set(['default', 'holoprint', 'mcstructure', 'mcaddon', 'mcworld', 'litematic', 'schematic', 'world', 'mcfunction']);

function failure(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: noStoreHeaders });
}

function crossSite(request: NextRequest) {
  const origin = request.headers.get('origin')?.trim();
  if (origin) {
    try {
      const requestOrigin = new URL(origin).origin;
      if (requestOrigin === request.nextUrl.origin) return false;
      const host = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '').split(',')[0].trim();
      const protocol = (request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(/:$/, '')).split(',')[0].trim();
      return !host || requestOrigin !== `${protocol}://${host}`;
    } catch { return true; }
  }
  return request.headers.get('sec-fetch-site')?.trim().toLowerCase() === 'cross-site';
}

export async function GET(request: NextRequest) {
  if (crossSite(request)) return failure('This download must be started from its mod page.', 403);
  const modId = request.nextUrl.searchParams.get('mod')?.trim();
  const formatId = request.nextUrl.searchParams.get('format')?.trim().toLowerCase() || 'default';
  const access = modId && FORMAT_IDS.has(formatId) ? readDownloadAccessToken(request.cookies.get(downloadAccessCookie(modId, formatId))?.value) : null;
  if (!modId || !FORMAT_IDS.has(formatId) || !access || access.modId !== modId || (access.formatId || 'default') !== formatId) return failure('This download must be started from its mod page.', 403);
  if (access.expiresAt <= Date.now()) return failure('This download session expired. Start again from the mod page.', 401);

  try {
    const preflight = request.nextUrl.searchParams.get('check') === '1';
    const edge = await invokeGuizzCatalog<{ url?: string; ready?: boolean }>({
      action: preflight ? 'check-download' : 'open-download', modId, format: formatId, nonce: access.nonce,
    });
    if (!edge.ok) return failure(edge.error || 'The download is unavailable.', edge.status || 503);
    if (preflight) return NextResponse.json({ ready: edge.data?.ready === true }, { headers: noStoreHeaders });
    if (!edge.data?.url) return failure('The download is unavailable.', 503);
    const destination = parseAllowedDownloadUrl(edge.data.url);
    const result = NextResponse.redirect(destination, 302);
    result.headers.set('Cache-Control', 'no-store, max-age=0');
    result.headers.set('Referrer-Policy', 'no-referrer');
    result.cookies.set({ name: downloadAccessCookie(modId, formatId), value: '', httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0 });
    return result;
  } catch {
    logServerFailure('download-open', 'edge-open', 'unexpected');
    return failure('The download link is invalid or unavailable.', 404);
  }
}
