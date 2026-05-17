const CACHE_VERSION = "v5";
const STATIC_CACHE = `blogdungaucher-static-${CACHE_VERSION}`;
const FONT_CACHE   = `blogdungaucher-fonts-${CACHE_VERSION}`;
const IMAGE_CACHE  = `blogdungaucher-images-${CACHE_VERSION}`;

const PRECACHE = [
  "/fr/",
  "/manifest.json",
  "/favicon.svg",
  "/images/favicon-32x32.png",
  "/images/apple-touch-icon.png",
  "/images/icon-192x192.png",
  "/images/icon-512x512.png",
];

// ── Utilitaires de classification des requêtes ──────────────────────
function isFontFile(url) {
  return /\.(woff2?|ttf|otf)$/.test(url.pathname);
}
function isImageFile(url) {
  return /\.(png|jpe?g|webp|avif|gif|svg|ico)$/.test(url.pathname);
}
function isStaticAsset(url) {
  // Fichiers Astro hachés : CSS, JS, jamais modifiés à URL identique
  return url.pathname.startsWith("/_astro/") && /\.(css|js)$/.test(url.pathname);
}
function isVideoFile(url) {
  return /\.(mp4|webm|ogv)$/.test(url.pathname);
}
function isHTMLPage(url) {
  return url.pathname.endsWith("/") || url.pathname.endsWith(".html");
}

// ── Install : précache des pages et assets critiques ────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// ── Activate : nettoyage des anciens caches ──────────────────────────
self.addEventListener("activate", (event) => {
  const CURRENT = [STATIC_CACHE, FONT_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => !CURRENT.includes(k)).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch : routage par stratégie ────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Ignorer les requêtes cross-origin (Google Analytics, AdSense, etc.)
  if (url.origin !== self.location.origin) return;

  // Ignorer les vidéos (trop volumineuses pour le cache)
  if (isVideoFile(url)) return;

  // ── FONTS : cache-first, TTL très long ──
  if (isFontFile(url)) {
    event.respondWith(cacheFirst(request, FONT_CACHE));
    return;
  }

  // ── ASSETS HACHÉS (CSS/JS Astro) : cache-first ──
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // ── IMAGES : stale-while-revalidate ──
  if (isImageFile(url)) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }

  // ── PAGES HTML : network-first, fallback cache ──
  if (isHTMLPage(url)) {
    event.respondWith(networkFirst(request, STATIC_CACHE));
    return;
  }

  // ── Reste : network-first par défaut ──
  event.respondWith(networkFirst(request, STATIC_CACHE));
});

// ── Stratégies ──────────────────────────────────────────────────────

/** Cache-first : sert depuis le cache, va sur le réseau seulement si absent. */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Ressource indisponible hors ligne.", { status: 503 });
  }
}

/** Stale-while-revalidate : sert le cache immédiatement, puis met à jour en arrière-plan. */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkFetch = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);

  return cached ?? await networkFetch ?? new Response("Ressource indisponible.", { status: 503 });
}

/** Network-first : essaie le réseau, utilise le cache en cas d'échec. */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached ?? new Response("Page indisponible hors ligne.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
