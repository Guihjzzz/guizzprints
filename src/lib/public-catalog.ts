import 'server-only';

import { createClient } from '@supabase/supabase-js';

/**
 * Server-side reader for public catalog data. It deliberately uses the public
 * key and the `public_mods` view, so sitemap generation never needs an admin
 * credential and cannot expose unpublished fields.
 */
export function getPublicCatalogClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
