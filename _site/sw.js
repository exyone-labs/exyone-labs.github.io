// Service Worker for Exyone Blog
// Caches static assets for offline access

const CACHE_NAME = 'exyone-blog-v1';

const PRECACHE_URLS = [
  '/',
  '/assets/css/main.css',
  '/assets/js/main.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        var responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          if (event.request.url.startsWith(self.location.origin)) {
            cache.put(event.request, responseToCache);
          }
        });

        return response;
      });
    })
  );
});
