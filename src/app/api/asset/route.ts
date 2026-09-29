import type { NextRequest } from 'next/server';
import { GET as mediaGet } from '../media/route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// This legacy alias remains intentionally uncacheable. The canonical /api/media
// endpoint owns transformed-image caching and all source validation.
export async function GET(request: NextRequest) {
  const response = await mediaGet(request);
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
