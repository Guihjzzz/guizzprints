import { NextRequest, NextResponse } from 'next/server';
import { getRequestVipEntitlement } from '@/lib/vip-entitlement';
import { logServerFailure } from '@/lib/server-observability';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

export async function GET(request: NextRequest) {
  const stage = 'entitlement';
  try {
    const entitlement = await getRequestVipEntitlement(request);
    return NextResponse.json(
      entitlement
        ? { vip: true, planId: entitlement.planId, expiresAt: entitlement.expiresAt }
        : { vip: false },
      { headers: noStoreHeaders },
    );
  } catch {
    logServerFailure('vip-status', stage, 'unexpected');
    // Fail closed for benefits: a missing service configuration never grants VIP.
    return NextResponse.json({ vip: false }, { headers: noStoreHeaders });
  }
}
