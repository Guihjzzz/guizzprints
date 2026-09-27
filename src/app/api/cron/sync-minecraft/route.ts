import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { fetchMinecraftMarketplaceMetadata } from '@/lib/minecraft-marketplace';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { logServerFailure } from '@/lib/server-observability';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 10;

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };
const MAX_ITEMS_PER_RUN = 10;
const STALE_AFTER_MS = 23 * 60 * 60 * 1_000;
const GENERIC_SYNC_ERROR = 'Marketplace source unavailable; manual review required.';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401, headers: noStoreHeaders });
}

function matchesCronSecret(value: string | null, expected: string) {
  if (!value) return false;
  const actualBytes = Buffer.from(value);
  const expectedBytes = Buffer.from(expected);
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

function isStale(value: unknown) {
  if (typeof value !== 'string') return true;
  const timestamp = Date.parse(value);
  return !Number.isFinite(timestamp) || Date.now() - timestamp >= STALE_AFTER_MS;
}

function healthUpdate(now: string, status: 'ok' | 'error', message: string | null = null) {
  return {
    source_last_checked_at: now,
    source_sync_status: status,
    source_sync_error: message,
    source_sync_failed_at: status === 'error' ? now : null,
  };
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || !matchesCronSecret(request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || null, secret)) {
    return unauthorized();
  }

  const supabase = getSupabaseAdmin();
  const { data: sources, error: listError } = await supabase
    .from('mods')
    .select('id, title, description, youtube_trailer_url, image_url_1, image_url_2, image_url_3, image_url_4, image_url_5, source_url, source_last_checked_at')
    .eq('source_provider', 'minecraft_marketplace')
    .not('source_url', 'is', null)
    .order('source_last_checked_at', { ascending: true, nullsFirst: true })
    .limit(MAX_ITEMS_PER_RUN);

  if (listError) {
    logServerFailure('minecraft-sync', 'list', listError.code || 'database');
    return NextResponse.json({ error: 'Unable to sync Marketplace items.' }, { status: 503, headers: noStoreHeaders });
  }

  const candidates = (sources || []).filter((source) => isStale(source.source_last_checked_at));
  let updated = 0;
  let failed = 0;

  await Promise.all(candidates.map(async (source) => {
    try {
      const metadata = await fetchMinecraftMarketplaceMetadata(source.source_url);
      const images = metadata.imageUrls;
      const update = {
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
        ...healthUpdate(metadata.fetchedAt, 'ok'),
      };
      const { error } = await supabase.from('mods').update(update).eq('id', source.id);
      if (error) throw error;
      updated += 1;
    } catch (error) {
      failed += 1;
      const now = new Date().toISOString();
      await supabase.from('mods').update(healthUpdate(now, 'error', GENERIC_SYNC_ERROR)).eq('id', source.id);
      logServerFailure('minecraft-sync', 'item', error instanceof Error ? error.message : 'unknown');
    }
  }));

  return NextResponse.json({ ok: true, scanned: candidates.length, updated, failed }, { headers: noStoreHeaders });
}
