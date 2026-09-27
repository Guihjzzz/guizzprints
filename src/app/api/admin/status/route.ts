import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

const noStoreHeaders = { 'Cache-Control': 'no-store' };

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);

  if (!admin) {
    return NextResponse.json(
      { isAdmin: false },
      { status: 403, headers: noStoreHeaders },
    );
  }

  return NextResponse.json(
    { isAdmin: true },
    { headers: noStoreHeaders },
  );
}
