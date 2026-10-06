import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { githubReleaseErrorStatus, hasGithubReleasesConfig, isGithubReleaseTransportFailure, uploadReleaseAsset } from '@/lib/github-releases';
import {
  MAX_PUBLISHER_FILE_BYTES,
  cleanPublisherFormat,
  cleanPublisherSlug,
  publisherAssetKinds,
  publisherContentType,
  publisherFileRule,
} from '@/lib/publisher-assets';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: noStoreHeaders });
}

function publishingFailure(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  if (githubReleaseErrorStatus(error) === 422) {
    return fail('O GitHub recusou o arquivo (422). O envio foi tentado novamente em outro lote; tente novamente se o erro persistir.', 422);
  }
  if (message.includes('GitHub Releases storage is not configured')) {
    return fail('O armazenamento GitHub Releases ainda não está configurado. Adicione GITHUB_RELEASES_TOKEN ao ambiente do servidor.', 503);
  }
  if (isGithubReleaseTransportFailure(error)) {
    console.error('publisher-github-transport-failure', { kind: error instanceof Error ? error.name : 'unknown' });
    return fail('A conexão com o armazenamento de arquivos falhou temporariamente. Aguarde alguns segundos e tente publicar novamente.', 503);
  }
  console.error('publisher-asset-upload-failure', { kind: error instanceof Error ? error.name : 'unknown', githubStatus: githubReleaseErrorStatus(error) });
  return fail('Não foi possível enviar este arquivo gerado.', 500);
}

export async function GET(request: NextRequest) {
  if (!await requireAdmin(request)) return fail('Administrator access required.', 403);
  return NextResponse.json({
    data: {
      maxFileBytes: MAX_PUBLISHER_FILE_BYTES,
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
    const format = cleanPublisherFormat(form.get('format'));
    const slug = cleanPublisherSlug(form.get('slug'));
    const file = form.get('file');

    if (!publisherAssetKinds.has(kind) || !slug || !(file instanceof File)) return fail('Invalid publishing asset.', 400);
    const extensionRule = publisherFileRule(kind, format);
    if (!extensionRule || !file.size || file.size > MAX_PUBLISHER_FILE_BYTES || !extensionRule.test(file.name)) {
      return fail('This file is not valid for the selected publishing asset.', 400);
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const assetKind = kind === 'download' ? `download-${format}` : kind;
    const releaseName = `${slug}-${assetKind}-${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const contentType = publisherContentType(kind, format);
    const stored = await uploadReleaseAsset(await file.arrayBuffer(), releaseName, contentType);
    return NextResponse.json({ data: stored }, { headers: noStoreHeaders });
  } catch (error) {
    return publishingFailure(error);
  }
}
