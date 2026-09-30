const LEGACY_CACHE_PREFIXES = [
  'guizzprints',
  'next-pwa',
  'workbox-precache',
  'workbox-runtime',
];

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names
        .filter((name) => LEGACY_CACHE_PREFIXES.some((prefix) => name.toLowerCase().startsWith(prefix)))
        .map((name) => caches.delete(name)),
    );
    await self.clients.claim();
  })());
});

// The installed app always reads pages and catalogue media from the current
// website. Normal browser/CDN caching still works through HTTP headers, while
// the worker never serves an obsolete application shell or cover image.
self.addEventListener('fetch', () => {});
