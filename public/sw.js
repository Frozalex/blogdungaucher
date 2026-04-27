const CACHE = "blogdungaucher-v2";

const PRECACHE = [
  "/",
  "/blog",
  "/science",
  "/esprit",
  "/societe",
  "/favicon.svg",
  "/manifest.json",
  "/images/favicon-32x32.png",
  "/images/apple-touch-icon.png",
  "/images/icon-192x192.png",
  "/images/icon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Ne pas intercepter les requêtes non-GET ni les API externes
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Stratégie : Network first, cache en fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Ne mettre en cache que les réponses valides
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
