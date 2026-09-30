import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_PATH_LENGTH = 640;

type RouteContext = { params: Promise<{ path: string[] }> };

function safePath(parts: string[]) {
  if (!Array.isArray(parts) || !parts.length) return null;
  const pathname = parts.join('/');
  // Next's exported route chunks keep dynamic route names such as
  // `pages/convert/[conversion]` in the filename. Brackets are safe path
  // characters here; traversal segments are rejected separately below.
  if (pathname.length > MAX_PATH_LENGTH || !/^[A-Za-z0-9._/@\[\]-]+$/.test(pathname)) return null;
  if (pathname.split('/').some((part) => !part || part === '.' || part === '..')) return null;
  return pathname;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const pathname = safePath((await context.params).path);
  if (!pathname) return NextResponse.json({ error: 'Invalid converter asset.' }, { status: 400 });
  const response = NextResponse.redirect(
    new URL(`/guide3d/original-converter/${pathname}`, request.url),
    307,
  );
  // Keep this API surface consistent with the rest of the authenticated and
  // operational endpoints: it only directs to a static asset and must never
  // become a cacheable source of request-specific URLs.
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
