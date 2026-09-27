import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
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
    sitemap: 'https://www.guizz.xyz/sitemap.xml',
    host: 'https://www.guizz.xyz',
  };
}
