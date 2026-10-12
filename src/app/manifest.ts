import type { MetadataRoute } from 'next';

const APP_ICON_VERSION = '2026-10-site-cover-v3';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Guizzprints',
    short_name: 'Guizzprints',
    description: 'Construções Minecraft para Bedrock e Java com download direto.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0B0F17',
    theme_color: '#2563EB',
    icons: [
      { src: `/icons/guizz-192.png?v=${APP_ICON_VERSION}`, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: `/icons/guizz-192.png?v=${APP_ICON_VERSION}`, sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: `/icons/guizz-512.png?v=${APP_ICON_VERSION}`, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: `/icons/guizz-512.png?v=${APP_ICON_VERSION}`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
