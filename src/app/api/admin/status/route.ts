import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { hasGithubReleasesConfig } from '@/lib/github-releases';
import { hasSupabaseAdminConfig } from '@/lib/supabase-admin';

const noStoreHeaders = { 'Cache-Control': 'no-store' };

export async function GET(request: NextRequest) {
  if (await requireAdmin(request)) {
    return NextResponse.json(
      {
        isAdmin: true,
        publishingConfigured: hasSupabaseAdminConfig() && hasGithubReleasesConfig(),
        catalogConfigured: hasSupabaseAdminConfig(),
        githubStorageConfigured: hasGithubReleasesConfig(),
      },
      { headers: noStoreHeaders },
    );
  }

  return NextResponse.json(
    { isAdmin: false },
    { status: 403, headers: noStoreHeaders },
  );
}
