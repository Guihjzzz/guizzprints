import type { MetadataRoute } from 'next';

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
      { src: '/icons/guizz-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/guizz-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
