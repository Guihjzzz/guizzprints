import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  createDownloadAccessToken,
  downloadAccessCookie,
  DOWNLOAD_ACCESS_TTL_SECONDS,
  DOWNLOAD_WAIT_MS,
  readDownloadAccessToken,
} from '@/lib/download-access';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { getActiveVipEntitlement, getUserFromBearer } from '@/lib/vip-entitlement';
import { logServerFailure } from '@/lib/server-observability';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const noStoreHeaders = {
  'Cache-Control': 'no-store, max-age=0',
  'Referrer-Policy': 'no-referrer',
};
const MAX_BODY_BYTES = 2048;

function isCrossSiteRequest(request: NextRequest) {
  const fetchSite = request.headers.get('sec-fetch-site')?.trim().toLowerCase();
  if (fetchSite === 'cross-site') return true;

  const origin = request.headers.get('origin')?.trim();
  if (!origin) return false;
  try {
    return new URL(origin).origin !== request.nextUrl.origin;
  } catch {
    return true;
  }
}

export async function POST(request: NextRequest) {
  let stage = 'request';
  try {
    // Session creation mutates the private nonce ledger. Reject an explicit
    // cross-site signal before parsing or touching the database, while still
    // supporting direct browser requests that omit Fetch Metadata headers.
    if (isCrossSiteRequest(request)) {
      return NextResponse.json({ error: 'This download must be started from its mod page.' }, {
        status: 403, headers: noStoreHeaders,
      });
    }

    // This endpoint needs only a tiny JSON object. Reject oversized or
    // non-JSON requests before parsing so public callers cannot use the
    // download gate as an avoidable body-parsing/memory sink.
    if (!request.headers.get('content-type')?.startsWith('application/json')) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400, headers: noStoreHeaders });
    }
    const declaredLength = Number(request.headers.get('content-length'));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 413, headers: noStoreHeaders });
    }
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 413, headers: noStoreHeaders });
    }
    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400, headers: noStoreHeaders });
    }
    const modId = typeof (body as { modId?: unknown })?.modId === 'string'
      ? (body as { modId: string }).modId.trim()
      : '';

    if (!modId || modId.length > 200) {
      return NextResponse.json({ error: 'Invalid mod.' }, { status: 400, headers: noStoreHeaders });
    }

    stage = 'mod-lookup';
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('mods').select('id').eq('id', modId).maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: 'Mod not found.' }, { status: 404, headers: noStoreHeaders });
    }

    stage = 'auth';
    const now = Date.now();
    const user = await getUserFromBearer(request, supabase);
    const entitlement = user ? await getActiveVipEntitlement(supabase, user.id) : null;
    const vip = Boolean(entitlement);
    // VIP sessions are deliberately short-lived so a revocation takes effect
    // quickly, while normal visitors keep the ten-minute signed session.
    const entitlementExpiry = entitlement ? Date.parse(entitlement.expiresAt) : NaN;
    const expiresAt = vip && Number.isFinite(entitlementExpiry)
      ? Math.min(now + 120_000, entitlementExpiry)
      : now + DOWNLOAD_ACCESS_TTL_SECONDS * 1000;
    stage = 'existing-session';
    const existingCookie = request.cookies.get(downloadAccessCookie(modId))?.value;
    const existingAccess = readDownloadAccessToken(existingCookie);
    if (existingAccess?.modId === modId && existingAccess.expiresAt > now) {
      const { data: existingSession, error: existingSessionError } = await supabase
        .from('download_access_sessions')
        .select('ready_at, expires_at, vip')
        .eq('nonce', existingAccess.nonce)
        .eq('mod_id', modId)
        .is('consumed_at', null)
        .maybeSingle();
      if (!existingSessionError && existingSession
        && typeof existingSession.ready_at === 'string'
        && typeof existingSession.expires_at === 'string'
        && typeof existingSession.vip === 'boolean') {
        const existingReadyAt = Date.parse(existingSession.ready_at);
        const existingExpiresAt = Date.parse(existingSession.expires_at);
        // Do not carry a stale non-VIP wait into a newly entitled account, or
        // preserve a no-wait session after an entitlement was revoked.
        if (existingSession.vip === vip
          && Number.isFinite(existingReadyAt) && Number.isFinite(existingExpiresAt) && existingExpiresAt > now) {
          return NextResponse.json(
            { readyAt: existingReadyAt, expiresAt: existingExpiresAt, serverTime: now, vip: existingSession.vip },
            { headers: noStoreHeaders },
          );
        }
      }
    }
    const cookieMaxAge = Math.max(1, Math.ceil((expiresAt - now) / 1000));
    const readyAt = vip ? now : now + DOWNLOAD_WAIT_MS;
    const nonce = randomUUID();
    stage = 'persist';
    const { error: sessionError } = await supabase.from('download_access_sessions').insert({
      nonce,
      mod_id: modId,
      ready_at: new Date(readyAt).toISOString(),
      expires_at: new Date(expiresAt).toISOString(),
      vip,
    });
    if (sessionError) {
      return NextResponse.json(
        { error: 'Unable to start the protected download.' },
        { status: 503, headers: noStoreHeaders },
      );
    }
    const token = createDownloadAccessToken({
      modId,
      readyAt,
      expiresAt,
      nonce,
      vip,
    });

    const response = NextResponse.json(
      { readyAt, expiresAt, serverTime: now, vip },
      { headers: noStoreHeaders },
    );

    response.cookies.set({
      name: downloadAccessCookie(modId),
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: cookieMaxAge,
    });

    return response;
  } catch {
    logServerFailure('download-session', stage, 'unexpected');
    return NextResponse.json(
      { error: 'Unable to start the protected download.' },
      { status: 500, headers: noStoreHeaders },
    );
  }
}
