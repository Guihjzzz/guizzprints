import type { MetadataRoute } from 'next';
import { siteLocales } from '@/lib/site-pages';

// Vercel redirects the apex host to the public www host. Keep every sitemap
// URL on the final canonical origin so crawlers do not see cross-property
// redirects or split indexing signals.
const BASE_URL = 'https://www.guizz.xyz';
const paths = ['', '/about', '/privacy', '/terms', '/contact', '/category/bedrock', '/category/java'];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) => siteLocales.map((locale) => ({
    url: `${BASE_URL}/${locale}${path}`,
    changeFrequency: path === '' ? 'daily' as const : 'weekly' as const,
    priority: path === '' ? 1 : path.startsWith('/category/') ? 0.8 : 0.5,
    alternates: {
      languages: Object.fromEntries(siteLocales.map((alternateLocale) => [alternateLocale, `${BASE_URL}/${alternateLocale}${path}`])),
    },
  })));
}
