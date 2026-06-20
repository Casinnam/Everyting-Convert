/* EverythingConvert service worker.
 *
 * Goals, in priority order:
 *  1. Never break the live site. HTML is always fetched network-first so users
 *     get fresh pages (critical for the payment / checkout flow). Payment, API,
 *     auth, analytics and ad requests are bypassed entirely — the SW does not
 *     touch them.
 *  2. Make the app installable + usable offline. Same-origin static assets and
 *     the heavy CDN conversion libraries (pdf.js, ffmpeg.wasm, etc.) are cached
 *     so a tool you've opened keeps converting with no connection.
 *
 * Bump CACHE_VERSION on any change to this file to retire old caches.
 */
const CACHE_VERSION = 'ec-v1-20260620';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const OFFLINE_URL = '/offline.html';

// Precache only assets guaranteed to exist, so install never fails on a 404.
const PRECACHE = [OFFLINE_URL, '/favicon.svg', '/manifest.webmanifest'];

// Hostnames whose requests must always hit the network untouched.
const BYPASS_HOST = /(?:supabase\.co|stripe\.com|js\.stripe\.com|googlesyndication\.com|doubleclick\.net|google-analytics\.com|googletagmanager\.com|adtrafficquality\.google)/i;

// CDN hosts that serve our conversion libraries / fonts — safe to cache.
const CDN_HOST = /(?:cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)/i;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Allow the page to trigger an immediate update.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

function isStaticAsset(url) {
  return /\.(?:css|js|mjs|svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|wasm|json)$/i.test(url.pathname);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return; // never intercept POST/PUT (API, payments)

  let url;
  try { url = new URL(req.url); } catch (_) { return; }

  // Hard bypass: payments, backend API, auth, analytics, ads. Let the browser
  // handle these exactly as if no service worker existed.
  if (BYPASS_HOST.test(url.hostname)) return;
  if (url.origin === self.location.origin && url.pathname.startsWith('/api/')) return;

  // HTML navigations: network-first so pages are always fresh; fall back to
  // cache, then to the offline page when fully offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(STATIC_CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match(OFFLINE_URL)))
    );
    return;
  }

  // Static assets (same-origin) and CDN libraries: stale-while-revalidate.
  if ((url.origin === self.location.origin && isStaticAsset(url)) || CDN_HOST.test(url.hostname)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          const network = fetch(req)
            .then((res) => {
              // Cache successful or opaque (cross-origin CDN) responses.
              if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
              return res;
            })
            .catch(() => cached);
          return cached || network;
        })
      )
    );
  }
  // Everything else: default network handling (no respondWith).
});
