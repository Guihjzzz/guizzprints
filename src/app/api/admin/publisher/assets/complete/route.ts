import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { uploadReleaseAsset } from '@/lib/github-releases';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import {
  MAX_PUBLISHER_CHUNKS,
  MAX_PUBLISHER_FILE_BYTES,
  PUBLISHER_BUCKET,
  cleanPublisherFormat,
  cleanPublisherSlug,
  publisherAssetKinds,
  publisherContentType,
  publisherFileRule,
  publisherTempPath,
  validPublisherUploadId,
} from '@/lib/publisher-assets';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };
const MAX_BODY_BYTES = 16 * 1024;

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: noStoreHeaders });
}

function integer(value: unknown) {
  if (typeof value !== 'number' || !Number.isSafeInteger(value)) return null;
  return value;
}

export async function POST(request: NextRequest) {
  let paths: string[] = [];
  try {
    const admin = await requireAdmin(request);
    if (!admin) return fail('Administrator access required.', 403);

    const raw = await request.text();
    if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) return fail('Invalid upload request.', 413);
    const body = JSON.parse(raw) as Record<string, unknown>;
    const kind = typeof body.kind === 'string' ? body.kind : '';
    const format = cleanPublisherFormat(body.format);
    const slug = cleanPublisherSlug(body.slug);
    const uploadId = body.uploadId;
    const fileName = typeof body.fileName === 'string' ? body.fileName.trim() : '';
    const contentType = typeof body.contentType === 'string' ? body.contentType.slice(0, 120) : '';
    const totalChunks = integer(body.totalChunks);
    const totalBytes = integer(body.totalBytes);

    if (!publisherAssetKinds.has(kind) || !slug || !validPublisherUploadId(uploadId) || !fileName || totalChunks === null || totalBytes === null) {
      return fail('Invalid upload request.', 400);
    }
    const extensionRule = publisherFileRule(kind, format);
    if (!extensionRule || !extensionRule.test(fileName) || totalChunks < 1 || totalChunks > MAX_PUBLISHER_CHUNKS || totalBytes < 1 || totalBytes > MAX_PUBLISHER_FILE_BYTES) {
      return fail('Invalid upload request.', 400);
    }

    const uploadIdValue = uploadId as string;
    const storage = getSupabaseAdmin().storage.from(PUBLISHER_BUCKET);
    paths = Array.from({ length: totalChunks }, (_, index) => publisherTempPath(uploadIdValue, index));
    const pieces: Uint8Array[] = [];
    let assembledBytes = 0;
    for (const path of paths) {
      const { data, error } = await storage.download(path);
      if (error || !data) return fail('Uma parte do arquivo não está disponível. Envie novamente.', 409);
      const piece = new Uint8Array(await data.arrayBuffer());
      pieces.push(piece);
      assembledBytes += piece.byteLength;
    }
    if (assembledBytes !== totalBytes) return fail('O tamanho do arquivo enviado não confere.', 400);

    const assembled = new Uint8Array(assembledBytes);
    let offset = 0;
    for (const piece of pieces) {
      assembled.set(piece, offset);
      offset += piece.byteLength;
    }
    const extension = fileName.split('.').pop()?.toLowerCase() || 'bin';
    const assetKind = kind === 'download' ? `download-${format}` : kind;
    const assetName = `${slug}-${assetKind}-${uploadIdValue}.${extension}`;
    const stored = await uploadReleaseAsset(assembled.buffer, assetName, contentType || publisherContentType(kind, format));
    return NextResponse.json({ data: stored }, { headers: noStoreHeaders });
  } catch (error) {
    console.error('publisher-upload-complete-failure', { kind: error instanceof Error ? error.name : 'unknown' });
    return fail('Não foi possível finalizar o envio do arquivo.', 500);
  } finally {
    if (paths.length) {
      try {
        await getSupabaseAdmin().storage.from(PUBLISHER_BUCKET).remove(paths);
      } catch (cleanupError) {
        console.error('publisher-upload-cleanup', { kind: cleanupError instanceof Error ? cleanupError.name : 'unknown' });
      }
    }
  }
}
