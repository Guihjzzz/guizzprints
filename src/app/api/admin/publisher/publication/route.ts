import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';
import { parseAllowedDownloadUrl } from '@/lib/download-url';
import { parseContentTaxonomy } from '@/lib/mod-categories';
import { validateModVersion } from '@/lib/mod-version';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };
const MAX_BODY_BYTES = 32 * 1024;
const BEDROCK_FORMATS = new Set(['holoprint', 'mcstructure', 'mcaddon', 'mcworld']);
const JAVA_FORMATS = new Set(['litematic', 'schematic', 'world', 'mcfunction']);
const ALL_FORMATS = new Set([...BEDROCK_FORMATS, ...JAVA_FORMATS]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type DownloadLink = { id: string; url: string };
type PublishedEdition = {
  id: string;
  category: 'bedrock' | 'java';
  title: string;
  description: string;
  version: string;
  file_size: string;
  terabox_url: string;
  download_formats: unknown;
  guide_mcstructure_url: string | null;
  guide_schem_url: string | null;
  content_themes: string[];
  content_size: string;
  content_categories: string[];
};

function failure(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: noStoreHeaders });
}

function text(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

async function readBody(request: NextRequest) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new Error('Invalid request body.');
  const raw = await request.text();
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) throw new Error('Invalid request body.');
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid request body.');
  return parsed as Record<string, unknown>;
}

function readLinks(value: unknown) {
  if (!Array.isArray(value)) return [] as DownloadLink[];
  const links: DownloadLink[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const id = text((item as { id?: unknown }).id, 32).toLowerCase();
    const url = text((item as { url?: unknown }).url, 2_000);
    if (!ALL_FORMATS.has(id) || !url || links.some((link) => link.id === id)) continue;
    links.push({ id, url: parseAllowedDownloadUrl(url).toString() });
  }
  return links;
}

function linksForEdition(links: DownloadLink[], formats: Set<string>, generatedId: string, generatedUrl: string) {
  const editionLinks = links.filter((link) => formats.has(link.id));
  if (!editionLinks.some((link) => link.id === generatedId)) {
    editionLinks.push({ id: generatedId, url: parseAllowedDownloadUrl(generatedUrl).toString() });
  }
  return editionLinks;
}

async function publicationPair(supabase: SupabaseClient, id: string) {
  const fields = 'id, category, title, description, version, file_size, terabox_url, download_formats, guide_mcstructure_url, guide_schem_url, content_themes, content_size, content_categories';
  const { data: selected, error: selectedError } = await supabase.from('mods').select(fields).eq('id', id).maybeSingle();
  if (selectedError) throw new Error('Não foi possível encontrar a publicação.');
  if (!selected || !selected.guide_mcstructure_url) throw new Error('Esta publicação não foi criada pelo Publicador 3D.');

  const { data: candidates, error: candidatesError } = await supabase.from('mods')
    .select(fields)
    .eq('guide_mcstructure_url', selected.guide_mcstructure_url)
    .in('category', ['bedrock', 'java']);
  if (candidatesError) throw new Error('Não foi possível carregar as edições da publicação.');

  const bedrock = candidates?.find((item) => item.category === 'bedrock') as PublishedEdition | undefined;
  const java = candidates?.find((item) => item.category === 'java') as PublishedEdition | undefined;
  if (!bedrock || !java) throw new Error('As duas edições desta publicação não foram encontradas.');
  return { bedrock, java };
}

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return failure('Administrator access required.', 403);
    const id = request.nextUrl.searchParams.get('id')?.trim() || '';
    if (!UUID.test(id)) return failure('Invalid publication.', 400);
    const pair = await publicationPair(admin.supabase, id);
    return NextResponse.json({ data: pair }, { headers: noStoreHeaders });
  } catch (error) {
    return failure(error instanceof Error ? error.message : 'Não foi possível carregar a publicação.', 400);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return failure('Administrator access required.', 403);
    const body = await readBody(request);
    const bedrockId = text(body.bedrockId, 64);
    const javaId = text(body.javaId, 64);
    const title = text(body.title, 160);
    const description = text(body.description, 12_000);
    if (!UUID.test(bedrockId) || !UUID.test(javaId) || bedrockId === javaId || !title || !description) {
      return failure('Preencha o título e a descrição da publicação.', 400);
    }

    const pair = await publicationPair(admin.supabase, bedrockId);
    if (pair.bedrock.id !== bedrockId || pair.java.id !== javaId) return failure('As edições não pertencem à mesma publicação.', 400);
    if (!pair.bedrock.guide_mcstructure_url || !pair.java.guide_schem_url) return failure('Os arquivos gerados desta publicação não estão disponíveis.', 400);

    const version = validateModVersion(text(body.version, 50) || '1.0.0');
    const fileSize = text(body.file_size, 80) || 'N/A';
    const taxonomy = parseContentTaxonomy(body);
    const links = readLinks(body.download_links);
    const bedrockLinks = linksForEdition(links, BEDROCK_FORMATS, 'mcstructure', pair.bedrock.guide_mcstructure_url);
    const javaLinks = linksForEdition(links, JAVA_FORMATS, 'schematic', pair.java.guide_schem_url);
    const common = { title, description, version, file_size: fileSize, ...taxonomy };

    const [bedrockResult, javaResult] = await Promise.all([
      admin.supabase.from('mods').update({
        ...common,
        subcategory: taxonomy.content_categories[0],
        terabox_url: bedrockLinks[0].url,
        download_formats: bedrockLinks,
        available_formats: bedrockLinks.map((link) => link.id),
      }).eq('id', bedrockId),
      admin.supabase.from('mods').update({
        ...common,
        subcategory: taxonomy.content_categories[0],
        terabox_url: javaLinks[0].url,
        download_formats: javaLinks,
        available_formats: javaLinks.map((link) => link.id),
      }).eq('id', javaId),
    ]);
    if (bedrockResult.error || javaResult.error) return failure('Não foi possível salvar as duas edições.', 503);
    return NextResponse.json({ data: { bedrockId, javaId } }, { headers: noStoreHeaders });
  } catch (error) {
    return failure(error instanceof Error ? error.message : 'Não foi possível salvar a publicação.', 400);
  }
}

/**
 * Removes the paired Bedrock and Java entries created by the 3D publisher.
 * Generated release assets are retained because a GitHub Release can contain
 * files referenced by other publications; the public catalog no longer
 * exposes either edition after this operation.
 */
export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return failure('Administrator access required.', 403);

    const id = request.nextUrl.searchParams.get('id')?.trim() || '';
    if (!UUID.test(id)) return failure('Invalid publication.', 400);

    const pair = await publicationPair(admin.supabase, id);
    const { error } = await admin.supabase
      .from('mods')
      .delete()
      .in('id', [pair.bedrock.id, pair.java.id]);
    if (error) return failure('Não foi possível excluir as duas edições.', 503);

    return NextResponse.json({ data: { bedrockId: pair.bedrock.id, javaId: pair.java.id } }, { headers: noStoreHeaders });
  } catch (error) {
    return failure(error instanceof Error ? error.message : 'Não foi possível excluir a publicação.', 400);
  }
}
