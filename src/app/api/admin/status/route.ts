import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { hasGithubReleasesConfig } from '@/lib/github-releases';
import { hasSupabaseAdminConfig } from '@/lib/supabase-admin';

const noStoreHeaders = { 'Cache-Control': 'no-store' };

export async function GET(request: NextRequest) {
  try {
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
  } catch (error) {
    // The side navigation probes this endpoint after every auth state change.
    // A temporary identity-provider outage must not leave the site's login UI
    // in a perpetual loading state or produce an uncaught 500 response.
    console.warn('admin-status-check-unavailable', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json({ isAdmin: false }, { status: 503, headers: noStoreHeaders });
  }

  return NextResponse.json(
    { isAdmin: false },
    { status: 403, headers: noStoreHeaders },
  );
}
