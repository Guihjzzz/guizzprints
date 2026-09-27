import { NextRequest, NextResponse } from 'next/server';
import { downloadAccessCookie, readDownloadAccessToken } from '@/lib/download-access';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { parseAllowedDownloadUrl } from '@/lib/download-url';
import { logServerFailure } from '@/lib/server-observability';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const noStoreHeaders = {
  'Cache-Control': 'no-store, max-age=0',
  'Referrer-Policy': 'no-referrer',
};

function failure(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: noStoreHeaders });
}

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

export async function GET(request: NextRequest) {
  // The final GET consumes a one-time nonce and increments the download. Do
  // not let a cross-site image/link silently spend a visitor's active session.
  // Browsers may omit these headers for a direct navigation, which remains
  // supported; a present cross-site signal is rejected before any DB lookup.
  if (isCrossSiteRequest(request)) {
    return failure('This download must be started from its mod page.', 403);
  }

  const modId = request.nextUrl.searchParams.get('mod')?.trim();
  const access = modId ? readDownloadAccessToken(request.cookies.get(downloadAccessCookie(modId))?.value) : null;

  if (!modId || !access || access.modId !== modId) {
    return failure('This download must be started from its mod page.', 403);
  }

  const now = Date.now();
  if (access.expiresAt <= now) {
    return failure('This download session expired. Start again from the mod page.', 401);
  }

  if (access.readyAt > now) {
    return failure('The verification timer has not completed yet.', 425);
  }

  let stage = 'mod-lookup';
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('mods')
      .select('terabox_url')
      .eq('id', modId)
      .maybeSingle();

    if (error || !data?.terabox_url) {
      return failure('The download is unavailable.', 404);
    }

    stage = 'destination';
    const destination = parseAllowedDownloadUrl(data.terabox_url);
    const nowIso = new Date(now).toISOString();
    if (request.nextUrl.searchParams.get('check') === '1') {
      // Preflight validates availability without counting or consuming. The
      // final redirect below performs the atomic one-time consumption.
      stage = 'preflight';
      const { data: session, error: sessionError } = await supabase
        .from('download_access_sessions')
        .select('ready_at, expires_at')
        .eq('nonce', access.nonce)
        .eq('mod_id', modId)
        .is('consumed_at', null)
        .maybeSingle();
      if (sessionError || !session) return failure('This download session expired. Start again from the mod page.', 401);
      const readyAt = Date.parse(session.ready_at);
      const expiresAt = Date.parse(session.expires_at);
      if (!Number.isFinite(readyAt) || !Number.isFinite(expiresAt) || expiresAt <= now) {
        return failure('This download session expired. Start again from the mod page.', 401);
      }
      if (readyAt > now) return failure('The verification timer has not completed yet.', 425);
      return NextResponse.json({ ready: true }, { headers: noStoreHeaders });
    }

    // Consume the nonce in the database, so a copied signed cookie cannot be
    // replayed for more downloads during its TTL. The update is atomic.
    stage = 'consume';
    const { data: consumed, error: consumeError } = await supabase
      .from('download_access_sessions')
      .update({ consumed_at: nowIso })
      .eq('nonce', access.nonce)
      .eq('mod_id', modId)
      .is('consumed_at', null)
      .lte('ready_at', nowIso)
      .gt('expires_at', nowIso)
      .select('nonce')
      .maybeSingle();
    if (consumeError) return failure('Unable to open the download right now.', 503);
    if (!consumed) return failure('This download session has already been used. Start again from the mod page.', 401);

    stage = 'increment';
    await supabase.rpc('increment_download', { mod_id: modId });

    const response = NextResponse.redirect(destination, 302);
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Referrer-Policy', 'no-referrer');
    response.cookies.set({
      name: downloadAccessCookie(modId),
      value: '',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch {
    logServerFailure('download-open', stage, 'unexpected');
    return failure('The download link is invalid or unavailable.', 404);
  }
}
