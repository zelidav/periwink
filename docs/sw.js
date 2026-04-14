// Minimal service worker for PWA install support
self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});
