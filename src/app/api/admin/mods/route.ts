import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { parseAllowedDownloadUrl } from '@/lib/download-url';
import { parseContentTaxonomy } from '@/lib/mod-categories';
import { validateModVersion } from '@/lib/mod-version';
import { parseMinecraftMarketplaceUrl } from '@/lib/minecraft-marketplace';
import { logServerFailure } from '@/lib/server-observability';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };
const MAX_BODY_BYTES = 64 * 1024;

type ModPayload = {
  title: string;
  category: string;
  subcategory: string | null;
  description: string;
  version: string;
  file_size: string;
  price: string;
  terabox_url: string;
  youtube_trailer_url: string | null;
  image_url_1: string | null;
  image_url_2: string | null;
  image_url_3: string | null;
  image_url_4: string | null;
  image_url_5: string | null;
  source_url: string | null;
  source_provider: 'minecraft_marketplace' | null;
  source_synced_at: string | null;
  source_fingerprint: string | null;
  source_last_checked_at: string | null;
  source_sync_status: 'ok' | null;
  source_sync_error: string | null;
  source_sync_failed_at: string | null;
  source_creator: string | null;
  source_tags: string[] | null;
  source_published_at: string | null;
  content_themes: string[];
  content_size: string;
  content_categories: string[];
};

function stringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function nullableString(value: unknown) {
  const normalized = stringValue(value);
  return normalized || null;
}

function nullableTags(value: unknown) {
  if (!Array.isArray(value)) return null;
  const tags: string[] = [];
  for (const entry of value) {
    if (typeof entry !== 'string') continue;
    const tag = entry.trim().slice(0, 160);
    if (!tag || tags.includes(tag)) continue;
    tags.push(tag);
    if (tags.length >= 32) break;
  }
  return tags.length ? tags : null;
}

function nullableSourceDate(value: unknown) {
  const raw = nullableString(value);
  if (!raw) return null;
  const timestamp = Date.parse(raw);
  if (!Number.isFinite(timestamp)) return null;
  const date = new Date(timestamp);
  return date.getUTCFullYear() >= 2000 && date.getUTCFullYear() <= 2100 ? date.toISOString() : null;
}

function sanitizePayload(body: Record<string, unknown>): ModPayload {
  const title = stringValue(body.title);
  const category = stringValue(body.category);
  const subcategory = stringValue(body.subcategory);
  const teraboxUrl = stringValue(body.terabox_url);
  const sourceUrlInput = nullableString(body.source_url);
  const sourceUrl = sourceUrlInput ? parseMinecraftMarketplaceUrl(sourceUrlInput).toString() : null;
  const sourceFingerprintInput = nullableString(body.source_fingerprint);
  const sourceFingerprint = sourceFingerprintInput && /^[a-f0-9]{64}$/i.test(sourceFingerprintInput)
    ? sourceFingerprintInput.toLowerCase() : null;
  const taxonomy = parseContentTaxonomy(body, { required: false });

  const formats: Record<string, string[]> = {
    bedrock: ['holoprint', 'mcstructure', 'mcaddon', 'mcworld'],
    java: ['litematic', 'schematic', 'world', 'mcfunction'],
  };
  if (!title || !formats[category]?.includes(subcategory) || !teraboxUrl) {
    throw new Error('Title, platform, file format and direct download URL are required.');
  }

  return {
    title,
    category,
    subcategory,
    description: stringValue(body.description),
    version: validateModVersion(stringValue(body.version, '1.0.0')),
    file_size: stringValue(body.file_size),
    price: stringValue(body.price, 'Free'),
    terabox_url: parseAllowedDownloadUrl(teraboxUrl).toString(),
    youtube_trailer_url: nullableString(body.youtube_trailer_url),
    image_url_1: nullableString(body.image_url_1),
    image_url_2: nullableString(body.image_url_2),
    image_url_3: nullableString(body.image_url_3),
    image_url_4: nullableString(body.image_url_4),
    image_url_5: nullableString(body.image_url_5),
    source_url: sourceUrl,
    source_provider: sourceUrl ? 'minecraft_marketplace' : null,
    // The importer supplies this as an informational value only. The server
    // owns the sync clock so clients cannot keep an item perpetually fresh.
    source_synced_at: sourceUrl ? new Date().toISOString() : null,
    source_fingerprint: sourceUrl ? sourceFingerprint : null,
    source_last_checked_at: sourceUrl ? new Date().toISOString() : null,
    source_sync_status: sourceUrl ? 'ok' : null,
    source_sync_error: null,
    source_sync_failed_at: null,
    source_creator: sourceUrl ? nullableString(body.source_creator) : null,
    source_tags: sourceUrl ? nullableTags(body.source_tags) : null,
    source_published_at: sourceUrl ? nullableSourceDate(body.source_published_at) : null,
    ...taxonomy,
  };
}

async function readBody(request: NextRequest) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    throw new Error('Invalid request body.');
  }
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    throw new Error('Invalid request body.');
  }
  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) {
    throw new Error('Invalid request body.');
  }
  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    throw new Error('Invalid request body.');
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error('Invalid request body.');
  }

  return body as Record<string, unknown>;
}

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: noStoreHeaders });
}

function databaseErrorResponse(message: string, stage: string, error: unknown) {
  const code = typeof (error as { code?: unknown })?.code === 'string'
    ? (error as { code: string }).code : 'unknown';
  logServerFailure('admin-mods', stage, code);
  return errorResponse(message, 503);
}

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return errorResponse('Administrator access required.', 403);

    if (request.nextUrl.searchParams.get('export') === '1') {
      const after = request.nextUrl.searchParams.get('after');
      if (after && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(after)) {
        return errorResponse('Invalid export cursor.', 400);
      }
      // Export is independent of list filters. Keyset pagination avoids offsets
      // and keeps traversing even if Supabase caps batches below our limit.
      let query = admin.supabase.from('mods')
        .select('id, title, category, subcategory, content_themes, content_size, content_categories, version, created_at')
        .order('id', { ascending: true })
        .limit(200);
      if (after) query = query.gt('id', after);
      const { data, error } = await query;
      if (error) return databaseErrorResponse('Unable to export the catalog.', 'export', error);
      const items = data || [];
      return NextResponse.json({ data: {
        items,
        nextCursor: items.length ? items[items.length - 1].id : null,
      } }, { headers: noStoreHeaders });
    }

    const id = request.nextUrl.searchParams.get('id')?.trim();
    if (id) {
      const { data, error } = await admin.supabase.from('mods').select('*').eq('id', id).maybeSingle();
      if (error) return databaseErrorResponse('Unable to load the mod.', 'read-one', error);
      if (!data) return errorResponse('Mod not found.', 404);
      return NextResponse.json({ data }, { headers: noStoreHeaders });
    }

    const params = request.nextUrl.searchParams;
    const page = Number(params.get('page') || 1);
    const pageSize = Number(params.get('pageSize') || 20);
    if (!Number.isSafeInteger(page) || page < 1 || page > 100_000 || ![10, 20, 50].includes(pageSize)) {
      return errorResponse('Invalid catalog page or page size.', 400);
    }
    const category = params.get('category') || 'all';
    if (!['all', 'bedrock', 'java'].includes(category)) {
      return errorResponse('Invalid catalog category.', 400);
    }
    const sorts = {
      newest: { column: 'created_at', ascending: false },
      oldest: { column: 'created_at', ascending: true },
      title: { column: 'title', ascending: true },
      downloads: { column: 'downloads', ascending: false },
    } as const;
    const sortKey = params.get('sort') || 'newest';
    if (!Object.hasOwn(sorts, sortKey)) return errorResponse('Invalid catalog order.', 400);
    const sort = sorts[sortKey as keyof typeof sorts];
    const attention = params.get('attention') || '0';
    if (!['0', '1'].includes(attention)) return errorResponse('Invalid attention filter.', 400);
    const search = (params.get('q') || '').trim();
    if (search.length > 100) return errorResponse('Search is too long.', 400);

    let query = admin.supabase.from('mods')
      .select('id, title, category, subcategory, content_themes, content_size, content_categories, version, file_size, downloads, rating, created_at, guide_mcstructure_url, guide_schem_url, source_provider, source_sync_status, source_sync_error, source_sync_failed_at, source_creator, source_tags, source_published_at');
    // Category is validated against the whitelist above before interpolation.
    if (category !== 'all') query = query.or(`category.ilike.${category},subcategory.ilike.${category}`);
    if (search) {
      // Escape LIKE wildcards so user input remains a literal title search.
      query = query.ilike('title', `%${search.replace(/[\\%_]/g, '\\$&')}%`);
    }
    if (attention === '1') {
      query = query.eq('source_provider', 'minecraft_marketplace').eq('source_sync_status', 'error');
    }
    const from = (page - 1) * pageSize;
    const [{ data, error }, { count: attentionCount }] = await Promise.all([
      query
      .order(sort.column, { ascending: sort.ascending, nullsFirst: false })
      .order('id', { ascending: true })
      // One extra row tells us whether another page exists, without COUNT(*).
      .range(from, from + pageSize),
      admin.supabase.from('mods')
        .select('id', { count: 'exact', head: true })
        .eq('source_provider', 'minecraft_marketplace')
        .eq('source_sync_status', 'error'),
    ]);
    if (error) return databaseErrorResponse('Unable to load the admin catalog.', 'list', error);
    return NextResponse.json({ data: {
      items: (data || []).slice(0, pageSize),
      hasMore: (data?.length || 0) > pageSize,
      page,
      attentionCount: attentionCount || 0,
    } }, { headers: noStoreHeaders });
  } catch {
    return errorResponse('Unable to load the admin catalog.', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return errorResponse('Administrator access required.', 403);

    const payload = sanitizePayload(await readBody(request));
    const { error } = await admin.supabase.from('mods').insert(payload);

    if (error) return databaseErrorResponse('Unable to create the mod.', 'create', error);
    return NextResponse.json({ success: true }, { status: 201, headers: noStoreHeaders });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to create the mod.', 400);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return errorResponse('Administrator access required.', 403);

    const body = await readBody(request);
    const id = stringValue(body.id);
    if (!id) return errorResponse('Mod ID is required.', 400);

    const payload = sanitizePayload(body);
    const { data: current, error: currentError } = await admin.supabase.from('mods')
      .select('source_url, source_synced_at, source_fingerprint, source_last_checked_at, source_sync_status, source_sync_error, source_sync_failed_at, source_creator, source_tags, source_published_at')
      .eq('id', id)
      .maybeSingle();
    if (currentError) return databaseErrorResponse('Unable to update the mod.', 'read-before-update', currentError);
    if (current?.source_url && current.source_url === payload.source_url) {
      payload.source_synced_at = current.source_synced_at;
      payload.source_fingerprint = current.source_fingerprint;
      payload.source_last_checked_at = current.source_last_checked_at;
      payload.source_sync_status = current.source_sync_status;
      payload.source_sync_error = current.source_sync_error;
      payload.source_sync_failed_at = current.source_sync_failed_at;
      payload.source_creator = current.source_creator;
      payload.source_tags = current.source_tags;
      payload.source_published_at = current.source_published_at;
    }
    const { error } = await admin.supabase.from('mods').update(payload).eq('id', id);

    if (error) return databaseErrorResponse('Unable to update the mod.', 'update', error);
    return NextResponse.json({ success: true }, { headers: noStoreHeaders });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to update the mod.', 400);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return errorResponse('Administrator access required.', 403);

    const id = request.nextUrl.searchParams.get('id')?.trim();
    if (!id) return errorResponse('Mod ID is required.', 400);

    const { data: current, error: currentError } = await admin.supabase.from('mods')
      .select('guide_mcstructure_url, guide_schem_url')
      .eq('id', id)
      .maybeSingle();
    if (currentError) return databaseErrorResponse('Unable to delete the mod.', 'read-before-delete', currentError);
    if (!current) return errorResponse('Mod not found.', 404);

    let deleteQuery = admin.supabase.from('mods').delete();
    const groupKey = (typeof current.guide_mcstructure_url === 'string' ? current.guide_mcstructure_url.trim() : '')
      || (typeof current.guide_schem_url === 'string' ? current.guide_schem_url.trim() : '');
    deleteQuery = groupKey ? deleteQuery.eq('guide_mcstructure_url', groupKey) : deleteQuery.eq('id', id);
    const { error } = await deleteQuery;
    if (error) return databaseErrorResponse('Unable to delete the mod.', 'delete', error);

    return NextResponse.json({ success: true }, { headers: noStoreHeaders });
  } catch {
    return errorResponse('Unable to delete the mod.', 500);
  }
}
