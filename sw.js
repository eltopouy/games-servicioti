const CACHE_NAME = 'pajaritos-cache-v27-webaudio';
const PRIORITY_AUDIO_AND_CORE = [
  './index.html',
  './manifest.json',
  './coloring_game.js?v=27',
  './kids_games.js?v=27',
  './audio/canto_cotorra.mp3',
  './audio/canto_hornero.mp3',
  './audio/canto_benteveo.mp3',
  './audio/canto_gaviota.mp3',
  './audio/canto_cardenal.mp3',
  './audio/canto_zorzal_colorado.mp3',
  './audio/canto_chingolo.mp3',
  './audio/canto_tero.mp3',
  './audio/canto_tordo.mp3',
  './audio/canto_carpintero.mp3',
  './audio/canto_dorado.mp3',
  './audio/canto_nacurutu.mp3',
  './audio/canto_torcaza.mp3',
  './audio/canto_calandria.mp3',
  './audio/canto_picaflor.mp3',
  './audio/voz_benteveo.mp3',
  './audio/voz_cardenal.mp3',
  './audio/voz_cotorra.mp3',
  './audio/voz_hornero.mp3',
  './audio/voz_tero.mp3',
  './audio/voz_tordo.mp3',
  './audio/voz_chingolo.mp3',
  './audio/voz_gaviota.mp3',
  './audio/voz_zorzal_colorado.mp3'
];

const VISUAL_ASSETS_TO_CACHE = [
  './assets_mobile/pinamar_mediodia_gemini.webp?v=20',
  './assets_mobile/pinamar_costa_gemini.webp?v=20',
  './assets_mobile/pinamar_atardecer_gemini.webp?v=20',
  './assets_mobile/pinamar_amanecer_gemini.webp?v=20',
  './assets_mobile/cotorra_reposo_trans.webp?v=20',
  './assets_mobile/cotorra_canto_trans.webp?v=20',
  './assets_mobile/hornero_reposo_trans.webp?v=20',
  './assets_mobile/hornero_canto_trans.webp?v=20',
  './assets_mobile/hornero_canto_pico_trans.webp?v=20',
  './assets_mobile/hornero_canto_alas_trans.webp?v=20',
  './assets_mobile/hornero_vuelo_trans.webp?v=20',
  './assets_mobile/benteveo_reposo_trans.webp?v=20',
  './assets_mobile/benteveo_canto_trans.webp?v=20',
  './assets_mobile/gaviota_reposo_trans.webp?v=20',
  './assets_mobile/gaviota_canto_trans.webp?v=20',
  './assets_mobile/cardenal_reposo_trans.webp?v=20',
  './assets_mobile/cardenal_canto_trans.webp?v=20',
  './assets_mobile/zorzal_reposo_trans.webp?v=20',
  './assets_mobile/zorzal_canto_trans.webp?v=20',
  './assets_mobile/chingolo_reposo_trans.webp?v=20',
  './assets_mobile/chingolo_canto_trans.webp?v=20',
  './assets_mobile/tero_reposo_trans.webp?v=20',
  './assets_mobile/tero_canto_trans.webp?v=20',
  './assets_mobile/tordo_reposo_trans.webp?v=25',
  './assets_mobile/tordo_canto_trans.webp?v=25',
  './assets_mobile/carpintero_reposo_trans.webp?v=25',
  './assets_mobile/carpintero_canto_trans.webp?v=25',
  './assets_mobile/carpintero_canto_pico_trans.webp?v=25',
  './assets_mobile/carpintero_canto_alas_trans.webp?v=25',
  './assets_mobile/carpintero_vuelo_trans.webp?v=25',
  './assets_mobile/dorado_reposo_trans.webp?v=25',
  './assets_mobile/dorado_canto_trans.webp?v=25',
  './assets_mobile/dorado_canto_pico_trans.webp?v=25',
  './assets_mobile/dorado_canto_alas_trans.webp?v=25',
  './assets_mobile/dorado_vuelo_trans.webp?v=25',
  './assets_mobile/nacurutu_reposo_trans.webp?v=25',
  './assets_mobile/nacurutu_canto_trans.webp?v=25',
  './assets_mobile/nacurutu_canto_pico_trans.webp?v=25',
  './assets_mobile/nacurutu_canto_alas_trans.webp?v=25',
  './assets_mobile/nacurutu_vuelo_trans.webp?v=25',
  './assets_mobile/torcaza_reposo_trans.webp?v=25',
  './assets_mobile/torcaza_canto_trans.webp?v=25',
  './assets_mobile/torcaza_canto_pico_trans.webp?v=25',
  './assets_mobile/torcaza_canto_alas_trans.webp?v=25',
  './assets_mobile/torcaza_vuelo_trans.webp?v=25',
  './assets_mobile/calandria_reposo_trans.webp?v=25',
  './assets_mobile/calandria_canto_trans.webp?v=25',
  './assets_mobile/calandria_canto_pico_trans.webp?v=25',
  './assets_mobile/calandria_canto_alas_trans.webp?v=25',
  './assets_mobile/calandria_vuelo_trans.webp?v=25',
  './assets_mobile/picaflor_reposo_trans.webp?v=25',
  './assets_mobile/picaflor_canto_trans.webp?v=25',
  './assets_mobile/picaflor_canto_pico_trans.webp?v=25',
  './assets_mobile/picaflor_canto_alas_trans.webp?v=25',
  './assets_mobile/picaflor_vuelo_trans.webp?v=25',
  './assets_pokemon/hornero_pokemon.webp?v=20',
  './assets_pokemon/tero_pokemon.webp?v=20',
  './assets_pokemon/benteveo_pokemon.webp?v=20',
  './assets_pokemon/cotorra_pokemon.webp?v=20',
  './assets_pokemon/cardenal_pokemon.webp?v=20',
  './assets_pokemon/zorzal_pokemon.webp?v=20',
  './assets_pokemon/chingolo_pokemon.webp?v=20',
  './assets_pokemon/gaviota_pokemon.webp?v=20',
  './assets_pokemon/tordo_pokemon.webp?v=25',
  './assets_pokemon/carpintero_pokemon.webp?v=25',
  './assets_pokemon/dorado_pokemon.webp?v=25',
  './assets_pokemon/nacurutu_pokemon.webp?v=25',
  './assets_pokemon/torcaza_pokemon.webp?v=25',
  './assets_pokemon/calandria_pokemon.webp?v=25',
  './assets_pokemon/picaflor_pokemon.webp?v=25',
  './assets_mobile/tero_canto_alas_trans.webp?v=20',
  './assets_mobile/benteveo_canto_alas_trans.webp?v=20',
  './assets_mobile/cotorra_canto_alas_trans.webp?v=20',
  './assets_mobile/cardenal_canto_alas_trans.webp?v=20',
  './assets_mobile/zorzal_canto_alas_trans.webp?v=20',
  './assets_mobile/chingolo_canto_alas_trans.webp?v=20',
  './assets_mobile/gaviota_canto_alas_trans.webp?v=20',
  './assets_mobile/tordo_canto_alas_trans.webp?v=25',
  './assets_mobile/benteveo_canto_pico_trans.webp?v=20',
  './assets_mobile/benteveo_vuelo_trans.webp?v=20',
  './assets_mobile/cardenal_canto_pico_trans.webp?v=20',
  './assets_mobile/cardenal_vuelo_trans.webp?v=20',
  './assets_mobile/tordo_canto_pico_trans.webp?v=25',
  './assets_mobile/tordo_vuelo_trans.webp?v=25',
  './assets_mobile/zorzal_canto_pico_trans.webp?v=20',
  './assets_mobile/zorzal_vuelo_trans.webp?v=20',
  './assets_mobile/cotorra_canto_pico_trans.webp?v=20',
  './assets_mobile/cotorra_vuelo_trans.webp?v=20',
  './assets_mobile/tero_canto_pico_trans.webp?v=20',
  './assets_mobile/tero_vuelo_trans.webp?v=20',
  './assets_mobile/chingolo_canto_pico_trans.webp?v=20',
  './assets_mobile/chingolo_vuelo_trans.webp?v=20',
  './assets_mobile/gaviota_canto_pico_trans.webp?v=20',
  './assets_mobile/gaviota_vuelo_trans.webp?v=20'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 1. Prioridad máxima: almacenar primero todos los audios .mp3 y scripts principales de forma individual resiliente
      await Promise.allSettled(
        PRIORITY_AUDIO_AND_CORE.map((url) =>
          fetch(url, { cache: 'reload' }).then((res) => {
            if (res && res.status === 200) return cache.put(url, res);
          }).catch(() => {})
        )
      );
      // 2. Segundo plano: almacenar sprites y fondos
      await Promise.allSettled(
        VISUAL_ASSETS_TO_CACHE.map((url) =>
          cache.add(url).catch(() => {})
        )
      );
    }).catch(() => {})
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
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (!url.protocol.startsWith('http')) return;

  if (req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/') || url.pathname === '') {
    e.respondWith(
      fetch(req).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      }).catch(() => caches.match(req).then((r) => r || caches.match('./index.html') || Response.error()))
    );
    return;
  }

  // Soporte compatible con Safari/iOS y Chrome para peticiones Range de <audio> (.mp3)
  if (req.headers.has('range')) {
    e.respondWith(
      caches.match(req.url, { ignoreSearch: true }).then(async (cachedRes) => {
        let fullRes = cachedRes;
        if (!fullRes) {
          try {
            const netFull = await fetch(req.url);
            if (netFull && netFull.status === 200) {
              const cache = await caches.open(CACHE_NAME);
              await cache.put(req.url, netFull.clone());
              fullRes = netFull;
            }
          } catch (_) {}
        }
        if (fullRes) {
          try {
            const buf = await fullRes.arrayBuffer();
            const bytes = /^bytes\=(\d+)\-(\d+)?$/i.exec(req.headers.get('range'));
            if (bytes) {
              const start = Number(bytes[1]);
              const end = bytes[2] ? Math.min(Number(bytes[2]), buf.byteLength - 1) : buf.byteLength - 1;
              const sliced = buf.slice(start, end + 1);
              return new Response(sliced, {
                status: 206,
                statusText: 'Partial Content',
                headers: [
                  ['Content-Type', fullRes.headers.get('Content-Type') || 'audio/mpeg'],
                  ['Content-Range', `bytes ${start}-${end}/${buf.byteLength}`],
                  ['Content-Length', String(sliced.byteLength)]
                ]
              });
            }
            return fullRes;
          } catch (_) {
            return fullRes;
          }
        }
        return fetch(req).catch(() => Response.error());
      })
    );
    return;
  }

  // Para recursos estáticos: Stale-While-Revalidate sin devolver nunca null a respondWith
  e.respondWith(
    caches.match(req).then((cachedRes) => {
      const fetchPromise = fetch(req).then((networkRes) => {
        if (networkRes && networkRes.status === 200 && (networkRes.type === 'basic' || networkRes.type === 'cors')) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      }).catch(() => cachedRes || caches.match(req, { ignoreSearch: true }) || Response.error());

      return cachedRes || fetchPromise;
    })
  );
});
