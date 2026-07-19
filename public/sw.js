// public/sw.js
const CACHE_NAME = 'eduasas-cache-v1';

// Tunacache core assets pekee (CSS, JS, Images) ili app ifunguke fasta
const ASSETS = ['/', '/index.html'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (event) => {
  // Tunacache request za GET pekee
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Tunaupdate cache kila tunapopata data mpya kutoka API
        if (networkResponse.ok) {
          const cacheClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheClone));
        }
        return networkResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});