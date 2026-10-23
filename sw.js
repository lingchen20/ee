const CACHE_VERSION = 'v2.31'; 
const CACHE_NAME = 'ancient-rpg-' + CACHE_VERSION;
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/dexie@3.2.2/dist/dexie.min.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('灵气汇聚 (缓存写入中):', CACHE_NAME);
      return cache.addAll(ASSETS);
    })
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('ancient-rpg-') && cacheName !== CACHE_NAME) {
            console.log('天道更迭，抹除旧纪元法则 (清理旧缓存):', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
