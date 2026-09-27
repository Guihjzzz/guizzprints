import { NextResponse } from 'next/server';
import { fetchMinecraftMarketplaceMetadata } from '@/lib/minecraft-marketplace';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { logServerFailure } from '@/lib/server-observability';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 10;

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };
const ON_DEMAND_COOLDOWN_MS = 30 * 60 * 1_000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const GENERIC_SYNC_ERROR = 'Marketplace source unavailable; manual review required.';

function response(data: Record<string, unknown>, status = 200) {
  return NextResponse.json(data, { status, headers: noStoreHeaders });
}

function isRecentlyChecked(value: unknown) {
  if (typeof value !== 'string') return false;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && Date.now() - timestamp < ON_DEMAND_COOLDOWN_MS;
}

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) return response({ error: 'Invalid mod ID.' }, 400);

  const supabase = getSupabaseAdmin();
  const { data: source, error: sourceError } = await supabase
    .from('mods')
    .select('id, title, description, youtube_trailer_url, image_url_1, image_url_2, image_url_3, image_url_4, image_url_5, source_url, source_provider, source_last_checked_at')
    .eq('id', id)
    .maybeSingle();

  if (sourceError) {
    logServerFailure('minecraft-refresh', 'read', sourceError.code || 'database');
    return response({ error: 'Unable to refresh this item.' }, 503);
  }
  if (!source || source.source_provider !== 'minecraft_marketplace' || !source.source_url) {
    return response({ ok: true, refreshed: false });
  }
  if (isRecentlyChecked(source.source_last_checked_at)) {
    return response({ ok: true, refreshed: false });
  }

  const claimedAt = new Date().toISOString();
  const { data: claimed, error: claimError } = await supabase
    .from('mods')
    .update({
      source_last_checked_at: claimedAt,
      source_sync_status: 'checking',
      source_sync_error: null,
    })
    .eq('id', id)
    .eq('source_provider', 'minecraft_marketplace')
    .not('source_url', 'is', null)
    .select('id')
    .maybeSingle();

  if (claimError) {
    logServerFailure('minecraft-refresh', 'claim', claimError.code || 'database');
    return response({ error: 'Unable to refresh this item.' }, 503);
  }
  if (!claimed) return response({ ok: true, refreshed: false });

  try {
    const metadata = await fetchMinecraftMarketplaceMetadata(source.source_url);
    const images = metadata.imageUrls;
    const { error: updateError } = await supabase.from('mods').update({
      title: metadata.title || source.title,
      description: metadata.description || source.description,
      youtube_trailer_url: metadata.youtubeTrailerUrl,
      image_url_1: images[0] || source.image_url_1,
      image_url_2: images[1] || source.image_url_2,
      image_url_3: images[2] || source.image_url_3,
      image_url_4: images[3] || source.image_url_4,
      image_url_5: images[4] || source.image_url_5,
      source_synced_at: metadata.fetchedAt,
      source_fingerprint: metadata.fingerprint,
      source_creator: metadata.creator,
      source_tags: metadata.tags.length ? metadata.tags : null,
      source_published_at: metadata.publishedAt,
      source_last_checked_at: metadata.fetchedAt,
      source_sync_status: 'ok',
      source_sync_error: null,
      source_sync_failed_at: null,
    }).eq('id', id);
    if (updateError) throw updateError;
    return response({ ok: true, refreshed: true });
  } catch (error) {
    const failedAt = new Date().toISOString();
    await supabase.from('mods').update({
      source_last_checked_at: failedAt,
      source_sync_status: 'error',
      source_sync_error: GENERIC_SYNC_ERROR,
      source_sync_failed_at: failedAt,
    }).eq('id', id);
    logServerFailure('minecraft-refresh', 'item', error instanceof Error ? error.message : 'unknown');
    return response({ ok: true, refreshed: false });
  }
}
