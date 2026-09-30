import 'server-only';

import type { MetadataRoute } from 'next';
import { siteLocales } from '@/lib/site-pages';
import { getPublicCatalogClient } from '@/lib/public-catalog';

export const SITE_URL = 'https://guizzprints.xyz';
// Supabase projects commonly cap a REST result at 1,000 rows. Keeping one
// sitemap page within that bound makes the index complete at 20,000+ builds.
export const MODS_PER_SITEMAP = 1_000;

const staticPaths = ['', '/about', '/privacy', '/terms', '/contact', '/category/bedrock', '/category/java'];

export function staticSitemapEntries(): MetadataRoute.Sitemap {
  return staticPaths.flatMap((path) => siteLocales.map((locale) => ({
    url: `${SITE_URL}/${locale}${path}`,
    changeFrequency: path === '' ? 'daily' as const : path.startsWith('/category/') ? 'daily' as const : 'monthly' as const,
    priority: path === '' ? 1 : path.startsWith('/category/') ? 0.8 : 0.5,
    alternates: {
      languages: Object.fromEntries(siteLocales.map((alternateLocale) => [alternateLocale, `${SITE_URL}/${alternateLocale}${path}`])),
    },
  })));
}

export async function getCatalogSitemapIds() {
  const catalog = getPublicCatalogClient();
  if (!catalog) return [0];

  try {
    const { count, error } = await catalog.from('public_mods').select('id', { count: 'exact', head: true });
    if (error) return [0];
    const pages = Math.max(1, Math.ceil((count || 0) / MODS_PER_SITEMAP));
    return Array.from({ length: pages }, (_, index) => index);
  } catch {
    // Keep the site-level entries crawlable even if the catalog is briefly
    // unavailable while the sitemap route is revalidating.
    return [0];
  }
}

export async function buildCatalogSitemap(page: number): Promise<MetadataRoute.Sitemap> {
  const entries = page === 0 ? staticSitemapEntries() : [];
  const catalog = getPublicCatalogClient();
  if (!catalog || !Number.isSafeInteger(page) || page < 0) return entries;

  try {
    const from = page * MODS_PER_SITEMAP;
    const { data, error } = await catalog
      .from('public_mods')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(from, from + MODS_PER_SITEMAP - 1);
    if (error || !data) return entries;

    return [
      ...entries,
      ...data.flatMap((mod) => siteLocales.map((locale) => ({
        url: `${SITE_URL}/${locale}/mod/${mod.id}`,
        lastModified: mod.created_at || undefined,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(siteLocales.map((alternateLocale) => [alternateLocale, `${SITE_URL}/${alternateLocale}/mod/${mod.id}`])),
        },
      }))),
    ];
  } catch {
    return entries;
  }
}

export async function getCatalogSitemapUrls() {
  return (await getCatalogSitemapIds()).map((id) => `${SITE_URL}/sitemap/${id}.xml`);
}
