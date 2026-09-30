import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import {
  MAX_PUBLISHER_CHUNKS,
  MAX_PUBLISHER_FILE_BYTES,
  PUBLISHER_BUCKET,
  PUBLISHER_CHUNK_BYTES,
  publisherTempPath,
  validPublisherUploadId,
} from '@/lib/publisher-assets';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: noStoreHeaders });
}

function integer(value: FormDataEntryValue | null) {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return fail('Administrator access required.', 403);

    const form = await request.formData();
    const uploadId = form.get('uploadId');
    const index = integer(form.get('index'));
    const totalChunks = integer(form.get('totalChunks'));
    const totalBytes = integer(form.get('totalBytes'));
    const chunk = form.get('chunk');

    if (!validPublisherUploadId(uploadId) || index === null || totalChunks === null || totalBytes === null || !(chunk instanceof File)) {
      return fail('Invalid upload chunk.', 400);
    }
    if (totalChunks < 1 || totalChunks > MAX_PUBLISHER_CHUNKS || index < 0 || index >= totalChunks || totalBytes < 1 || totalBytes > MAX_PUBLISHER_FILE_BYTES) {
      return fail('Invalid upload size.', 400);
    }
    if (!chunk.size || chunk.size > PUBLISHER_CHUNK_BYTES || (index < totalChunks - 1 && chunk.size !== PUBLISHER_CHUNK_BYTES)) {
      return fail('Invalid upload chunk size.', 400);
    }

    const storage = getSupabaseAdmin().storage.from(PUBLISHER_BUCKET);
    const path = publisherTempPath(uploadId as string, index);
    const { error } = await storage.upload(path, chunk, {
      contentType: chunk.type || 'application/octet-stream',
      upsert: true,
    });
    if (error) {
      console.error('publisher-upload-chunk', { code: error.name || 'storage_error' });
      return fail('Não foi possível armazenar uma parte do arquivo.', 502);
    }
    return NextResponse.json({ data: { uploadId, index } }, { headers: noStoreHeaders });
  } catch (error) {
    console.error('publisher-upload-chunk-failure', { kind: error instanceof Error ? error.name : 'unknown' });
    return fail('Não foi possível enviar uma parte do arquivo.', 500);
  }
}
