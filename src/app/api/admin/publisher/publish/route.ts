import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { isGithubReleaseAssetUrl } from '@/lib/github-releases';
import { parseAllowedDownloadUrl } from '@/lib/download-url';
import { parseContentTaxonomy } from '@/lib/mod-categories';
import { validateModVersion } from '@/lib/mod-version';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };
const MAX_BODY_BYTES = 128 * 1024;
const BEDROCK_FORMATS = new Set(['holoprint', 'mcstructure', 'mcaddon', 'mcworld']);
const JAVA_FORMATS = new Set(['litematic', 'schematic', 'world', 'mcfunction']);
const ALL_FORMATS = new Set([...BEDROCK_FORMATS, ...JAVA_FORMATS]);

function failure(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: noStoreHeaders });
}

async function readBody(request: NextRequest) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new Error('Invalid request body.');
  const raw = await request.text();
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) throw new Error('Invalid request body.');
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid request body.');
  return parsed as Record<string, unknown>;
}

function text(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

type LinkEntry = { id: string; url: string };

function readLinks(value: unknown) {
  if (!Array.isArray(value)) return [] as LinkEntry[];
  const links: LinkEntry[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const id = text((item as { id?: unknown }).id, 32).toLowerCase();
    const raw = text((item as { url?: unknown }).url, 2_000);
    if (!ALL_FORMATS.has(id) || !raw || links.some((link) => link.id === id)) continue;
    links.push({ id, url: parseAllowedDownloadUrl(raw).toString() });
  }
  return links;
}

function generatedAsset(value: unknown) {
  const url = text(value, 2_000);
  if (!url || !isGithubReleaseAssetUrl(url)) {
    throw new Error('Os arquivos gerados precisam estar no GitHub Releases configurado.');
  }
  return url;
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return failure('Administrator access required.', 403);
    const body = await readBody(request);
    const title = text(body.title, 160);
    const description = text(body.description, 12_000);
    if (!title || !description) return failure('Title and detailed description are required.', 400);

    const version = validateModVersion(text(body.version, 50) || '1.0.0');
    const taxonomy = parseContentTaxonomy(body);
    const assets = body.assets && typeof body.assets === 'object' && !Array.isArray(body.assets)
      ? body.assets as Record<string, unknown> : {};
    const source = generatedAsset(assets.source);
    const schem = generatedAsset(assets.schem);
    const cover = generatedAsset(assets.cover);
    const board = generatedAsset(assets.board);
    const rawViews = Array.isArray(assets.views) ? assets.views : [];
    if (rawViews.length !== 8) return failure('Gere as oito vistas antes de publicar.', 400);
    const views = rawViews.map(generatedAsset);

    const links = readLinks(body.download_links);
    if (!links.length) return failure('Adicione pelo menos um link de download direto.', 400);
    const bedrockLinks = links.filter((link) => BEDROCK_FORMATS.has(link.id));
    const javaLinks = links.filter((link) => JAVA_FORMATS.has(link.id));
    if (!bedrockLinks.some((link) => link.id === 'mcstructure')) bedrockLinks.push({ id: 'mcstructure', url: source });
    if (!javaLinks.some((link) => link.id === 'schematic')) javaLinks.push({ id: 'schematic', url: schem });

    const common = {
      title,
      description,
      version,
      file_size: text(body.file_size, 80) || 'N/A',
      price: 'Free',
      image_url_1: views[0],
      image_url_2: views[1],
      image_url_3: views[2],
      image_url_4: views[3],
      image_url_5: views[4],
      image_url_6: views[5],
      image_url_7: views[6],
      image_url_8: views[7],
      showcase_cover_url: cover,
      guide_mcstructure_url: source,
      guide_schem_url: schem,
      studio_board_url: board,
      spin_video_url: null,
      ...taxonomy,
    };
    const bedrockId = crypto.randomUUID();
    const javaId = crypto.randomUUID();
    const { error } = await admin.supabase.from('mods').insert([
      {
        ...common,
        id: bedrockId,
        category: 'bedrock',
        // The legacy catalog schema requires a subcategory. Keep it aligned
        // with the first chosen content category, never with a file format.
        subcategory: taxonomy.content_categories[0],
        terabox_url: bedrockLinks[0].url,
        download_formats: bedrockLinks,
        available_formats: bedrockLinks.map((link) => link.id),
      },
      {
        ...common,
        id: javaId,
        category: 'java',
        subcategory: taxonomy.content_categories[0],
        terabox_url: javaLinks[0].url,
        download_formats: javaLinks,
        available_formats: javaLinks.map((link) => link.id),
      },
    ]);
    if (error) {
      // Database details stay server-side; the editor receives an actionable
      // message without exposing schema or infrastructure information.
      console.error('publisher-catalog-insert', { code: error.code, message: error.message });
      return failure('Não foi possível gravar a publicação no catálogo. Confira a categoria e tente novamente.', 503);
    }
    return NextResponse.json({ data: { bedrockId, javaId } }, { status: 201, headers: noStoreHeaders });
  } catch (error) {
    return failure(error instanceof Error ? error.message : 'Unable to publish this item.', 400);
  }
}
