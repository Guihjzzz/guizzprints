import type { MetadataRoute } from 'next';
import { buildCatalogSitemap, getCatalogSitemapIds } from '@/lib/catalog-sitemap';

// Rebuild sitemap shards periodically, rather than requiring a deploy for
// every new construction. Each shard stays below Supabase's normal row cap.
export const revalidate = 3600;

export async function generateSitemaps() {
  return (await getCatalogSitemapIds()).map((id) => ({ id }));
}

export default async function sitemap({ id }: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const page = Number(await id);
  return buildCatalogSitemap(Number.isSafeInteger(page) && page >= 0 ? page : 0);
}
