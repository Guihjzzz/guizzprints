import type { MetadataRoute } from 'next';
import { getCatalogSitemapUrls, SITE_URL } from '@/lib/catalog-sitemap';

export const revalidate = 3600;

export default async function robots(): Promise<MetadataRoute.Robots> {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/auth/',
        '/en/admin/', '/es/admin/', '/pt/admin/',
        '/en/login/', '/es/login/', '/pt/login/',
        '/en/settings/', '/es/settings/', '/pt/settings/',
        '/en/favorites/', '/es/favorites/', '/pt/favorites/',
        '/en/upload/', '/es/upload/', '/pt/upload/',
        '/en/search/', '/es/search/', '/pt/search/',
      ],
    },
    sitemap: await getCatalogSitemapUrls(),
    host: SITE_URL,
  };
}
