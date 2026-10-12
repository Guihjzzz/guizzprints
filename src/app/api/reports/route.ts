import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'node:crypto';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { requireAuthenticatedUser } from '@/lib/user-auth';
import { logServerFailure } from '@/lib/server-observability';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0', 'Referrer-Policy': 'no-referrer' };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const REASONS = new Set([
  'download_broken', 'wrong_file', 'wrong_images',
  'wrong_description', 'wrong_edition_or_version', 'other',
]);
const EDITIONS = new Set(['bedrock', 'java']);
const MAX_BODY_BYTES = 4096;
const REPORTS_PER_HOUR = 5;

function anonymousReporterId(request: NextRequest) {
  const address = request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')?.trim()
    || request.headers.get('cf-connecting-ip')?.trim();
  const fallback = [
    request.headers.get('user-agent')?.slice(0, 512) || 'unknown-agent',
    request.headers.get('accept-language')?.slice(0, 128) || 'unknown-language',
  ].join('|');
  const source = address || fallback;
  const secret = process.env.REPORTS_RATE_LIMIT_SECRET
    || process.env.SUPABASE_SECRET_KEY
    || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error('Anonymous report rate limiting is not configured.');

  // Keep the raw network address out of the reports table while allowing a
  // shared hourly limit for repeat anonymous submissions from one connection.
  return `anonymous:${createHmac('sha256', secret).update(source).digest('hex')}`;
}

function result(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: noStoreHeaders });
}

export async function POST(request: NextRequest) {
  try {
    // A verified account gives a better per-person limit, but an account is
    // optional. If a stale token cannot be verified, continue as a guest.
    const user = await requireAuthenticatedUser(request).catch(() => null);
    const reporterId = user?.id ?? anonymousReporterId(request);

    if (!request.headers.get('content-type')?.startsWith('application/json')) return result({ error: 'Invalid request.' }, 400);
    const declaredLength = Number(request.headers.get('content-length'));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return result({ error: 'Request is too large.' }, 413);
    const raw = await request.text();
    if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) return result({ error: 'Request is too large.' }, 413);

    let body: unknown;
    try { body = JSON.parse(raw); } catch { return result({ error: 'Invalid request.' }, 400); }
    const input = body as { modId?: unknown; edition?: unknown; reason?: unknown; details?: unknown };
    const modId = typeof input?.modId === 'string' ? input.modId.trim() : '';
    const edition = typeof input?.edition === 'string' ? input.edition.trim().toLowerCase() : '';
    const reason = typeof input?.reason === 'string' ? input.reason.trim() : '';
    const details = typeof input?.details === 'string' ? input.details.trim() : '';
    if (!UUID.test(modId) || !EDITIONS.has(edition) || !REASONS.has(reason) || details.length > 1500) {
      return result({ error: 'Invalid report.' }, 400);
    }

    const database = getSupabaseAdmin();
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: rateError } = await database
      .from('mod_reports')
      .select('id', { count: 'exact', head: true })
      .eq('reporter_id', reporterId)
      .gte('created_at', since);
    if (rateError) throw rateError;
    if ((count ?? 0) >= REPORTS_PER_HOUR) return result({ error: 'Report limit reached.' }, 429);

    // Look up the public row on the server and snapshot its title/category so
    // an admin can still understand the report if the catalog entry changes.
    const { data: mod, error: modError } = await database
      .from('public_mods')
      .select('id, title, category, subcategory')
      .eq('id', modId)
      .maybeSingle();
    if (modError) throw modError;
    if (!mod) return result({ error: 'Catalog item not found.' }, 404);
    if (mod.category !== edition) return result({ error: 'Report edition does not match this item.' }, 400);

    const { error: insertError } = await database.from('mod_reports').insert({
      mod_id: mod.id,
      mod_title: mod.title,
      edition,
      category: typeof mod.subcategory === 'string' ? mod.subcategory : '',
      reason,
      details,
      reporter_id: reporterId,
    });
    if (insertError) throw insertError;

    return result({ submitted: true }, 201);
  } catch {
    logServerFailure('reports', 'submit', 'database');
    return result({ error: 'Unable to submit this report.' }, 503);
  }
}
