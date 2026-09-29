import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_SOURCE_BYTES = 100 * 1024 * 1024;

function validReleaseUrl(raw: string | null) {
  if (!raw || raw.length > 2_000) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
    if (url.hostname !== 'github.com' || !url.pathname.startsWith('/Guizzhjz/guizzprints-assets/releases/download/')) return null;
    return url;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const source = validReleaseUrl(request.nextUrl.searchParams.get('url'));
  if (!source) return NextResponse.json({ error: 'Construção 3D indisponível.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });

  try {
    const upstream = await fetch(source, { redirect: 'follow', cache: 'no-store' });
    const advertisedLength = Number(upstream.headers.get('content-length') || '0');
    if (!upstream.ok || (advertisedLength && advertisedLength > MAX_SOURCE_BYTES)) {
      return NextResponse.json({ error: 'Não foi possível carregar a construção 3D.' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
    }
    const bytes = await upstream.arrayBuffer();
    if (!bytes.byteLength || bytes.byteLength > MAX_SOURCE_BYTES) {
      return NextResponse.json({ error: 'A construção 3D é inválida ou excede 100 MB.' }, { status: 422, headers: { 'Cache-Control': 'no-store' } });
    }
    return new NextResponse(bytes, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Não foi possível carregar a construção 3D.' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
