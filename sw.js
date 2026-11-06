/* Lahiyo — makes the app installable and opens it quickly. Letters and data always come from the server. */
const CACHE = 'lahiyo-v3.0';
const SHELL = ['./', './index.html', './lahiyo-api.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  // Only the app's own files; never the server calls (POST) or other sites.
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // Network first, so updates appear at once; the saved copy is used only when offline.
  e.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
  );
});
