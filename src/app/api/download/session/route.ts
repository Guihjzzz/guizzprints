import { NextRequest, NextResponse } from 'next/server';
import {
  createDownloadAccessToken,
  downloadAccessCookie,
  DOWNLOAD_ACCESS_TTL_SECONDS,
} from '@/lib/download-access';
import { invokeGuizzCatalog } from '@/lib/guizz-catalog-edge';
import { logServerFailure } from '@/lib/server-observability';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0', 'Referrer-Policy': 'no-referrer' };
const MAX_BODY_BYTES = 2048;
const FORMAT_IDS = new Set(['default', 'holoprint', 'mcstructure', 'mcaddon', 'mcworld', 'litematic', 'schematic', 'world', 'mcfunction']);

function crossSite(request: NextRequest) {
  const origin = request.headers.get('origin')?.trim();
  // `Sec-Fetch-Site` may be reported as cross-site by embedded browsers even
  // when they send an exact local Origin. Prefer the explicit Origin when it
  // exists, while retaining the Fetch Metadata protection for requests that
  // do not carry one.
  if (origin) {
    try {
      const requestOrigin = new URL(origin).origin;
      if (requestOrigin === request.nextUrl.origin) return false;

      // Next's development server can resolve `nextUrl` to its configured
      // host even when the browser is using another loopback alias such as
      // 127.0.0.1. The actual Host/forwarded Host is the request's authority,
      // so accept only an exact Origin match for that authority as well.
      const host = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '').split(',')[0].trim();
      const protocol = (request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(/:$/, '')).split(',')[0].trim();
      return !host || requestOrigin !== `${protocol}://${host}`;
    } catch { return true; }
  }
  return request.headers.get('sec-fetch-site')?.trim().toLowerCase() === 'cross-site';
}

export async function POST(request: NextRequest) {
  try {
    if (crossSite(request)) return NextResponse.json({ error: 'This download must be started from its mod page.' }, { status: 403, headers: noStoreHeaders });
    if (!request.headers.get('content-type')?.startsWith('application/json')) return NextResponse.json({ error: 'Invalid request.' }, { status: 400, headers: noStoreHeaders });
    const declaredLength = Number(request.headers.get('content-length'));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return NextResponse.json({ error: 'Invalid request.' }, { status: 413, headers: noStoreHeaders });
    const raw = await request.text();
    if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) return NextResponse.json({ error: 'Invalid request.' }, { status: 413, headers: noStoreHeaders });
    const body: unknown = JSON.parse(raw);
    const modId = typeof (body as { modId?: unknown })?.modId === 'string' ? (body as { modId: string }).modId.trim() : '';
    const formatId = typeof (body as { format?: unknown })?.format === 'string' ? (body as { format: string }).format.trim().toLowerCase() : 'default';
    if (!modId || modId.length > 200 || !FORMAT_IDS.has(formatId)) return NextResponse.json({ error: 'Invalid mod.' }, { status: 400, headers: noStoreHeaders });

    const edge = await invokeGuizzCatalog<{ readyAt?: number; expiresAt?: number; serverTime?: number; vip?: boolean; nonce?: string }>({
      action: 'create-download-session', modId, format: formatId,
    });
    if (!edge.ok || !edge.data || typeof edge.data.readyAt !== 'number' || typeof edge.data.expiresAt !== 'number' || typeof edge.data.nonce !== 'string') {
      return NextResponse.json({ error: edge.error || 'Unable to start the protected download.' }, { status: edge.status || 503, headers: noStoreHeaders });
    }
    const now = Date.now();
    const token = createDownloadAccessToken({
      modId, formatId, nonce: edge.data.nonce, readyAt: edge.data.readyAt, expiresAt: edge.data.expiresAt, vip: edge.data.vip === true,
    });
    const result = NextResponse.json({
      readyAt: edge.data.readyAt, expiresAt: edge.data.expiresAt, serverTime: edge.data.serverTime || now, vip: edge.data.vip === true,
    }, { headers: noStoreHeaders });
    result.cookies.set({
      name: downloadAccessCookie(modId, formatId), value: token, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/',
      maxAge: Math.max(1, Math.min(DOWNLOAD_ACCESS_TTL_SECONDS, Math.ceil((edge.data.expiresAt - now) / 1000))),
    });
    return result;
  } catch {
    logServerFailure('download-session', 'edge-session', 'unexpected');
    return NextResponse.json({ error: 'Unable to start the protected download.' }, { status: 500, headers: noStoreHeaders });
  }
}
