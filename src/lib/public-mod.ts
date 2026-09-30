import 'server-only';

import { cache } from 'react';
import { getPublicCatalogClient } from '@/lib/public-catalog';

/**
 * Reads one public construction once per server render. Metadata and the page
 * both need this record, so sharing it removes a duplicate catalog round-trip
 * during client navigation without making recent publications stale.
 */
export const getPublicMod = cache(async (id: string) => {
  const catalog = getPublicCatalogClient();
  if (!catalog) return null;

  const { data, error } = await catalog
    .from('public_mods')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) return null;
  return data;
});
