import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { fetchMinecraftMarketplaceMetadata } from '@/lib/minecraft-marketplace';
import { logServerFailure } from '@/lib/server-observability';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };
const MAX_BODY_BYTES = 8 * 1024;

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: noStoreHeaders });
}

async function readUrl(request: NextRequest) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    throw new Error('Invalid request body.');
  }
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    throw new Error('Invalid request body.');
  }
  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) throw new Error('Invalid request body.');

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    throw new Error('Invalid request body.');
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid request body.');
  const url = (body as { url?: unknown }).url;
  if (typeof url !== 'string' || !url.trim()) throw new Error('Minecraft Marketplace URL is required.');
  return url.trim();
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return errorResponse('Administrator access required.', 403);

  try {
    const sourceUrl = await readUrl(request);
    const metadata = await fetchMinecraftMarketplaceMetadata(sourceUrl);
    return NextResponse.json({ data: metadata }, { headers: noStoreHeaders });
  } catch (error) {
    logServerFailure('admin-minecraft-import', 'fetch', error instanceof Error ? error.message : 'unknown');
    return errorResponse('Unable to read this Minecraft Marketplace item. Check the official URL and try again.', 422);
  }
}
