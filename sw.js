const CACHE_NAME = 'pajaritos-cache-v4';
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
  './assets_mobile/hornero_canto_pico_trans.webp',
  './assets_mobile/hornero_canto_alas_trans.webp',
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
  './assets_mobile/tordo_reposo_trans.webp',
  './assets_mobile/tordo_canto_trans.webp',
  './assets_pokemon/hornero_pokemon.webp',
  './assets_pokemon/tero_pokemon.webp',
  './assets_pokemon/benteveo_pokemon.webp',
  './assets_pokemon/cotorra_pokemon.webp',
  './assets_pokemon/cardenal_pokemon.webp',
  './assets_pokemon/zorzal_pokemon.webp',
  './assets_pokemon/chingolo_pokemon.webp',
  './assets_pokemon/gaviota_pokemon.webp',
  './assets_pokemon/tordo_pokemon.webp',
  './assets_pokemon/raw/hornero_card.jpg',
  './assets_pokemon/raw/tero_card.jpg',
  './assets_pokemon/raw/benteveo_card.jpg',
  './assets_pokemon/raw/cotorra_card.jpg',
  './assets_pokemon/raw/cardenal_card.jpg',
  './assets_pokemon/raw/zorzal_card.jpg',
  './assets_pokemon/raw/chingolo_card.jpg',
  './assets_pokemon/raw/gaviota_card.jpg',
  './assets_pokemon/raw/tordo_card.jpg',
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
