const CACHE_NAME = 'pajaritos-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets_mobile/pinamar_mediodia_gemini.webp',
  './assets_mobile/pinamar_costa_gemini.webp',
  './assets_mobile/pinamar_atardecer_gemini.webp',
  './assets_mobile/pinamar_amanecer_gemini.webp',
  './assets_mobile/cotorra_reposo_trans.webp',
  './assets_mobile/cotorra_canto_trans.webp',
  './assets_mobile/hornero_reposo_trans.webp',
  './assets_mobile/hornero_canto_trans.webp',
  './assets_mobile/benteveo_reposo_trans.webp',
  './assets_mobile/benteveo_canto_trans.webp',
  './assets_mobile/gaviota_reposo_trans.webp',
  './assets_mobile/gaviota_canto_trans.webp',
  './assets_mobile/cardenal_reposo_trans.webp',
  './assets_mobile/cardenal_canto_trans.webp',
  './assets_mobile/zorzal_reposo_trans.webp',
  './assets_mobile/zorzal_canto_trans.webp',
  './assets_mobile/chingolo_reposo_trans.webp',
  './assets_mobile/chingolo_canto_trans.webp',
  './assets_mobile/tero_reposo_trans.webp',
  './assets_mobile/tero_canto_trans.webp',
  './audio/canto_cotorra.mp3',
  './audio/canto_hornero.mp3',
  './audio/canto_benteveo.mp3',
  './audio/canto_gaviota.mp3',
  './audio/canto_cardenal.mp3',
  './audio/canto_zorzal_colorado.mp3',
  './audio/canto_chingolo.mp3',
  './audio/canto_tero.mp3'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
