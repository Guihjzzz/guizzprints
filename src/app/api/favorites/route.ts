import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { requireAuthenticatedUser } from '@/lib/user-auth';
import { logServerFailure } from '@/lib/server-observability';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0', 'Referrer-Policy': 'no-referrer' };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_BODY_BYTES = 1024;

function result(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: noStoreHeaders });
}

async function requestBody(request: NextRequest): Promise<{ modId: string; favorite: boolean } | null> {
  if (!request.headers.get('content-type')?.startsWith('application/json')) return null;
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return null;
  const raw = await request.text();
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) return null;
  try {
    const body: unknown = JSON.parse(raw);
    const modId = typeof (body as { modId?: unknown })?.modId === 'string'
      ? (body as { modId: string }).modId.trim() : '';
    const favorite = (body as { favorite?: unknown })?.favorite;
    return UUID.test(modId) && typeof favorite === 'boolean' ? { modId, favorite } : null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const user = await requireAuthenticatedUser(request);
  if (!user) return result({ error: 'Authentication required.' }, 401);

  try {
    const { data, error } = await getSupabaseAdmin()
      .from('favorites')
      .select('mod_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return result({ ids: (data || []).flatMap((row) => typeof row.mod_id === 'string' ? [row.mod_id] : []) });
  } catch {
    logServerFailure('favorites', 'load', 'database');
    return result({ error: 'Unable to load favorites.' }, 503);
  }
}

export async function POST(request: NextRequest) {
  const body = await requestBody(request);
  if (!body) return result({ error: 'Invalid request.' }, 400);
  const user = await requireAuthenticatedUser(request);
  if (!user) return result({ error: 'Authentication required.' }, 401);

  try {
    const database = getSupabaseAdmin();
    if (!body.favorite) {
      const { error } = await database.from('favorites').delete().eq('user_id', user.id).eq('mod_id', body.modId);
      if (error) throw error;
      return result({ favorited: false });
    }

    // The historical table uses a partial unique index, so a duplicate-key
    // insert is treated as a successful idempotent favorite request.
    const { error } = await database.from('favorites').insert([{ user_id: user.id, mod_id: body.modId }]);
    if (error && error.code !== '23505') throw error;
    return result({ favorited: true });
  } catch {
    logServerFailure('favorites', body.favorite ? 'add' : 'remove', 'database');
    return result({ error: 'Unable to update favorites.' }, 503);
  }
}
