/* =============================================
   Coran — Service Worker
   - Pré-cache de la coquille de l'application
   - Cache des réponses API (texte, recherche)
   - Fonctionnement hors ligne
   ============================================= */

const SHELL_CACHE = 'coran-shell-v16';
const API_CACHE = 'coran-api-v1';

const SHELL_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/api.js',
  './js/player.js',
  './js/offline.js',
  './js/app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png'
];

/* ---------- Installation : pré-cache de la coquille ---------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== SHELL_CACHE && k !== API_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ---------- Stratégie de récupération ---------- */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // API du Coran : stale-while-revalidate (rapide + à jour)
  if (url.hostname === 'api.alquran.cloud') {
    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        const network = fetch(req)
          .then((res) => {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Audio : réseau d'abord (les versets téléchargés passent par IndexedDB, pas ici)
  if (url.hostname === 'everyayah.com' || url.hostname === 'cdn.islamic.network') {
    return;
  }

  // Ressources locales : cache d'abord, puis réseau
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(req, copy));
            return res;
          })
      )
    );
  }
});
