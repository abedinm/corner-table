/* Corner Table — service worker
   Strategy:
   - App shell (HTML/CSS/JS/manifest/icon): cache-first
   - Everything else (images, fonts): stale-while-revalidate
   Bump CACHE_VERSION whenever you change shell files. */

const CACHE_VERSION = 'corner-table-v1';
const SHELL = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './favicon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isShell = isSameOrigin && SHELL.some((p) => {
    const path = p.replace('./', '/');
    return url.pathname === path || url.pathname.endsWith(path);
  });

  if (isShell) {
    // cache-first
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req))
    );
    return;
  }

  // stale-while-revalidate for everything else (images, fonts, etc.)
  event.respondWith(
    caches.open(CACHE_VERSION).then((cache) =>
      cache.match(req).then((cached) => {
        const fetched = fetch(req)
          .then((res) => {
            // Don't cache opaque or error responses
            if (res && res.status === 200 && res.type !== 'opaque') {
              cache.put(req, res.clone());
            }
            return res;
          })
          .catch(() => cached);   // offline → fall back to cache
        return cached || fetched;
      })
    )
  );
});
