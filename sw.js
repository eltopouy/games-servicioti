const CACHE_NAME = 'pajaritos-cache-v11-perfect-gestures';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './assets_mobile/pinamar_mediodia_gemini.webp?v=11',
  './assets_mobile/pinamar_costa_gemini.webp?v=11',
  './assets_mobile/pinamar_atardecer_gemini.webp?v=11',
  './assets_mobile/pinamar_amanecer_gemini.webp?v=11',
  './assets_mobile/cotorra_reposo_trans.webp?v=11',
  './assets_mobile/cotorra_canto_trans.webp?v=11',
  './assets_mobile/hornero_reposo_trans.webp?v=11',
  './assets_mobile/hornero_canto_trans.webp?v=11',
  './assets_mobile/hornero_canto_pico_trans.webp?v=11',
  './assets_mobile/hornero_canto_alas_trans.webp?v=11',
  './assets_mobile/benteveo_reposo_trans.webp?v=11',
  './assets_mobile/benteveo_canto_trans.webp?v=11',
  './assets_mobile/gaviota_reposo_trans.webp?v=11',
  './assets_mobile/gaviota_canto_trans.webp?v=11',
  './assets_mobile/cardenal_reposo_trans.webp?v=11',
  './assets_mobile/cardenal_canto_trans.webp?v=11',
  './assets_mobile/zorzal_reposo_trans.webp?v=11',
  './assets_mobile/zorzal_canto_trans.webp?v=11',
  './assets_mobile/chingolo_reposo_trans.webp?v=11',
  './assets_mobile/chingolo_canto_trans.webp?v=11',
  './assets_mobile/tero_reposo_trans.webp?v=11',
  './assets_mobile/tero_canto_trans.webp?v=11',
  './assets_mobile/tordo_reposo_trans.webp?v=11',
  './assets_mobile/tordo_canto_trans.webp?v=11',
  './assets_pokemon/hornero_pokemon.webp?v=11',
  './assets_pokemon/tero_pokemon.webp?v=11',
  './assets_pokemon/benteveo_pokemon.webp?v=11',
  './assets_pokemon/cotorra_pokemon.webp?v=11',
  './assets_pokemon/cardenal_pokemon.webp?v=11',
  './assets_pokemon/zorzal_pokemon.webp?v=11',
  './assets_pokemon/chingolo_pokemon.webp?v=11',
  './assets_pokemon/gaviota_pokemon.webp?v=11',
  './assets_pokemon/tordo_pokemon.webp?v=11',
  './assets_mobile/tero_canto_alas_trans.webp?v=11',
  './assets_mobile/benteveo_canto_alas_trans.webp?v=11',
  './assets_mobile/cotorra_canto_alas_trans.webp?v=11',
  './assets_mobile/cardenal_canto_alas_trans.webp?v=11',
  './assets_mobile/zorzal_canto_alas_trans.webp?v=11',
  './assets_mobile/chingolo_canto_alas_trans.webp?v=11',
  './assets_mobile/gaviota_canto_alas_trans.webp?v=11',
  './assets_mobile/tordo_canto_alas_trans.webp?v=11',
  './audio/canto_cotorra.mp3',
  './audio/canto_hornero.mp3',
  './audio/canto_benteveo.mp3',
  './audio/canto_gaviota.mp3',
  './audio/canto_cardenal.mp3',
  './audio/canto_zorzal_colorado.mp3',
  './audio/canto_chingolo.mp3',
  './audio/canto_tero.mp3',
  './audio/canto_tordo.mp3'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)).catch(() => {})
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Eliminando caché obsoleta:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ESTRATEGIA NETWORK-FIRST PARA DOCUMENTOS / HTML:
// Siempre busca la versión más reciente en GitHub Pages primero.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);

  if (req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/') || url.pathname === '') {
    e.respondWith(
      fetch(req).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Para recursos estáticos: Stale-While-Revalidate
  e.respondWith(
    caches.match(req).then((cachedRes) => {
      const fetchPromise = fetch(req).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      }).catch(() => null);

      return cachedRes || fetchPromise;
    })
  );
});
