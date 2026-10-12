import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { logServerFailure } from '@/lib/server-observability';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0', 'Referrer-Policy': 'no-referrer' };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const STATUSES = new Set(['open', 'reviewing', 'resolved', 'dismissed']);
const FILTER_STATUSES = new Set(['all', ...STATUSES]);
const PAGE_SIZE = 30;
const MAX_BODY_BYTES = 1024;

function result(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: noStoreHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return result({ error: 'Administrator access required.' }, 403);

    const rawPage = Number(request.nextUrl.searchParams.get('page') || '1');
    const page = Number.isInteger(rawPage) ? Math.max(1, Math.min(rawPage, 100_000)) : 1;
    const status = request.nextUrl.searchParams.get('status') || 'all';
    if (!FILTER_STATUSES.has(status)) return result({ error: 'Invalid status filter.' }, 400);

    let query = admin.supabase
      .from('mod_reports')
      .select('id, mod_id, mod_title, edition, category, reason, details, status, created_at, updated_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
    if (status !== 'all') query = query.eq('status', status);

    const { data, count, error } = await query;
    if (error) throw error;
    return result({ items: data || [], total: count ?? 0, page, pageSize: PAGE_SIZE });
  } catch {
    logServerFailure('admin-reports', 'load', 'database');
    return result({ error: 'Unable to load reports.' }, 503);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return result({ error: 'Administrator access required.' }, 403);
    if (!request.headers.get('content-type')?.startsWith('application/json')) return result({ error: 'Invalid request.' }, 400);
    const declaredLength = Number(request.headers.get('content-length'));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return result({ error: 'Request is too large.' }, 413);
    const raw = await request.text();
    if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) return result({ error: 'Request is too large.' }, 413);

    let body: unknown;
    try { body = JSON.parse(raw); } catch { return result({ error: 'Invalid request.' }, 400); }
    const input = body as { id?: unknown; status?: unknown };
    const id = typeof input?.id === 'string' ? input.id.trim() : '';
    const status = typeof input?.status === 'string' ? input.status.trim() : '';
    if (!UUID.test(id) || !STATUSES.has(status)) return result({ error: 'Invalid report update.' }, 400);

    const { data, error } = await admin.supabase
      .from('mod_reports')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, status, updated_at')
      .maybeSingle();
    if (error) throw error;
    if (!data) return result({ error: 'Report not found.' }, 404);
    return result({ item: data });
  } catch {
    logServerFailure('admin-reports', 'update', 'database');
    return result({ error: 'Unable to update this report.' }, 503);
  }
}
