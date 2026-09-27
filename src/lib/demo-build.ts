export const DEMO_BUILD_ID = 'demo-warden-guizzprints';

export const DEMO_BUILD = {
  id: DEMO_BUILD_ID,
  title: 'Warden Monument — Demonstração 3D',
  category: 'bedrock',
  subcategory: 'mcstructure',
  description: 'Modelo de demonstração do Guizzprints com 3.747 blocos. Inclui capa isométrica, capa com quatro vistas, prancha completa, imagens individuais, vídeo giratório e uma amostra interativa do Guia 3D com zoom e controle de camadas.',
  version: '1.21.0',
  file_size: '241 KB',
  price: 'Grátis',
  created_at: '2026-09-27T19:45:00.000Z',
  image_url_1: '/demo/warden/four-views.png',
  image_url_2: '/demo/warden/isometric.png',
  image_url_3: '/demo/warden/board.png',
  image_url_4: '/demo/warden/view-1.png',
  image_url_5: '/demo/warden/view-2.png',
  youtube_trailer_url: '',
  spin_video_url: '/demo/warden/spin.webm',
  guide_schem_url: '/demo/warden/warden.schem',
  studio_board_url: '/demo/warden/board.png',
  direct_download_url: '/demo/warden/warden.mcstructure',
  downloads: 0,
  rating: 5,
  is_demo: true,
} as const;

export const DEMO_BUILD_SUMMARY = {
  id: DEMO_BUILD.id,
  title: DEMO_BUILD.title,
  category: DEMO_BUILD.category,
  subcategory: DEMO_BUILD.subcategory,
  image_url_1: DEMO_BUILD.image_url_1,
  downloads: DEMO_BUILD.downloads,
  rating: DEMO_BUILD.rating,
};
