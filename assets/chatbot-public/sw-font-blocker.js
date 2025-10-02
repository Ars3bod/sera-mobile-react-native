// Service Worker to block DGA font requests
self.addEventListener('fetch', function(event) {
  const url = event.request.url;
  
  // Block any request to the problematic Vercel domain
  if (url.includes('assets-nu-mauve.vercel.app')) {
    console.log('Service Worker blocked DGA font request:', url);
    event.respondWith(
      new Response('', {
        status: 404,
        statusText: 'Blocked by Service Worker'
      })
    );
    return;
  }
  
  // Let other requests proceed normally
  event.respondWith(fetch(event.request));
});

self.addEventListener('install', function(event) {
  console.log('DGA Font Blocker Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('DGA Font Blocker Service Worker activated');
  event.waitUntil(self.clients.claim());
});