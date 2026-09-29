import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { hasGithubReleasesConfig, uploadReleaseAsset } from '@/lib/github-releases';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_FILE_BYTES = 100 * 1024 * 1024;
const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

const allowedKinds = new Set(['source', 'schem', 'cover', 'view', 'board', 'download']);
const allowedExtensions: Record<string, RegExp> = {
  source: /\.mcstructure$/i,
  schem: /\.schem$/i,
  cover: /\.png$/i,
  view: /\.png$/i,
  board: /\.png$/i,
};

const downloadExtensions: Record<string, RegExp> = {
  // HoloPrint consumes Bedrock structure files, so it intentionally shares
  // the extension accepted by the generated source asset.
  holoprint: /\.mcstructure$/i,
  mcstructure: /\.mcstructure$/i,
  mcaddon: /\.mcaddon$/i,
  mcworld: /\.mcworld$/i,
  litematic: /\.litematic$/i,
  schematic: /\.(?:schematic|schem)$/i,
  world: /\.(?:zip|mcworld)$/i,
  mcfunction: /\.mcfunction$/i,
};

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: noStoreHeaders });
}

function publishingFailure(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  if (message.includes('GitHub Releases storage is not configured')) {
    return fail('O armazenamento GitHub Releases ainda não está configurado. Adicione GITHUB_RELEASES_TOKEN ao ambiente do servidor.', 503);
  }
  return fail(message || 'Não foi possível enviar este arquivo gerado.', 500);
}

function cleanSlug(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') return '';
  return value.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

function cleanFormat(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function contentTypeFor(kind: string, format: string) {
  if (kind === 'cover' || kind === 'view' || kind === 'board') return 'image/png';
  if (kind !== 'download') return 'application/octet-stream';
  if (format === 'mcfunction') return 'text/plain; charset=utf-8';
  if (format === 'world') return 'application/zip';
  return 'application/octet-stream';
}

export async function GET(request: NextRequest) {
  if (!await requireAdmin(request)) return fail('Administrator access required.', 403);
  return NextResponse.json({
    data: {
      maxFileBytes: MAX_FILE_BYTES,
      formats: Object.keys(downloadExtensions),
    },
  }, { headers: noStoreHeaders });
}

export async function POST(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) return fail('Administrator access required.', 403);
    if (!hasGithubReleasesConfig()) {
      return fail('O armazenamento GitHub Releases ainda não está configurado. Adicione GITHUB_RELEASES_TOKEN ao ambiente do servidor.', 503);
    }

    const form = await request.formData();
    const kind = typeof form.get('kind') === 'string' ? String(form.get('kind')) : '';
    const format = cleanFormat(form.get('format'));
    const slug = cleanSlug(form.get('slug'));
    const file = form.get('file');

    if (!allowedKinds.has(kind) || !slug || !(file instanceof File)) return fail('Invalid publishing asset.', 400);
    const extensionRule = kind === 'download' ? downloadExtensions[format] : allowedExtensions[kind];
    if (!extensionRule || !file.size || file.size > MAX_FILE_BYTES || !extensionRule.test(file.name)) {
      return fail('This file is not valid for the selected publishing asset.', 400);
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const assetKind = kind === 'download' ? `download-${format}` : kind;
    const releaseName = `${slug}-${assetKind}-${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const contentType = contentTypeFor(kind, format);
    const stored = await uploadReleaseAsset(await file.arrayBuffer(), releaseName, contentType);
    return NextResponse.json({ data: stored }, { headers: noStoreHeaders });
  } catch (error) {
    return publishingFailure(error);
  }
}
