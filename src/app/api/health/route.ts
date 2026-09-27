import { NextResponse } from 'next/server';

const headers = {
  'Cache-Control': 'no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
};

/**
 * Small public liveness probe for an external uptime monitor.
 *
 * It intentionally checks only that the Next.js runtime can execute a route;
 * database/provider checks belong in authenticated operational probes so a
 * monitor cannot turn this endpoint into a dependency-rate-limit sink.
 */
export function GET() {
  return NextResponse.json(
    { ok: true, service: 'guizzprints' },
    { headers },
  );
}
