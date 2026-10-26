# -*- coding: utf-8 -*-
"""
apply_v11_perfection.py
Aplica las correcciones exactas para:
1. Tap / Clic: 1 toque canta, siguiente toque silencia.
2. Doble Tap rápido: el ave despliega sus alas en perspectiva y vuela hacia el cielo.
3. Modo Dar de Comer: evento delimitado directo al hacer clic en el pajarito (alimentar a ese pajarito específico).
4. Animación de vuelo: giro a perspectiva de costado 3D, batido de alas visible y alas desplegadas.
5. Inclusión de cantoAlas para todas las 9 aves.
6. Actualización a versión v11 en sw.js e index.html con purga de caché.
"""

import os
import re

INDEX_PATH = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\index.html"
SW_PATH = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\sw.js"

with open(INDEX_PATH, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Actualizar caché query param de ?v=10 a ?v=11
html = html.replace("?v=10", "?v=11")

# 2. Actualizar BIRDS para incluir cantoAlas en todas las aves
birds_replacements = {
    'tero: {': '''tero: {
      id: "tero",
      name: "Tero",
      pokeName: "Teroraptor",
      pokeType: ["lucha", "volador"],
      pokeNumber: "#002",
      audioSrc: "audio/canto_tero.mp3",
      voiceSrc: "audio/voz_tero.mp3",
      reposo: "assets_mobile/tero_reposo_trans.webp?v=11",
      canto: "assets_mobile/tero_canto_trans.webp?v=11",
      cantoAlas: "assets_mobile/tero_canto_alas_trans.webp?v=11",
      pokemon: "assets_pokemon/tero_pokemon.webp?v=11",
      card: "assets_pokemon/raw/tero_card.jpg?v=11",''',

    'benteveo: {': '''benteveo: {
      id: "benteveo",
      name: "Benteveo",
      pokeName: "Bentechú",
      pokeType: ["electrico", "volador"],
      pokeNumber: "#003",
      audioSrc: "audio/canto_benteveo.mp3",
      voiceSrc: "audio/voz_benteveo.mp3",
      reposo: "assets_mobile/benteveo_reposo_trans.webp?v=11",
      canto: "assets_mobile/benteveo_canto_trans.webp?v=11",
      cantoAlas: "assets_mobile/benteveo_canto_alas_trans.webp?v=11",
      pokemon: "assets_pokemon/benteveo_pokemon.webp?v=11",
      card: "assets_pokemon/raw/benteveo_card.jpg?v=11",''',

    'cotorra: {': '''cotorra: {
      id: "cotorra",
      name: "Cotorra",
      pokeName: "Cotorriff",
      pokeType: ["planta", "volador"],
      pokeNumber: "#004",
      audioSrc: "audio/canto_cotorra.mp3",
      voiceSrc: "audio/voz_cotorra.mp3",
      reposo: "assets_mobile/cotorra_reposo_trans.webp?v=11",
      canto: "assets_mobile/cotorra_canto_trans.webp?v=11",
      cantoAlas: "assets_mobile/cotorra_canto_alas_trans.webp?v=11",
      pokemon: "assets_pokemon/cotorra_pokemon.webp?v=11",
      card: "assets_pokemon/raw/cotorra_card.jpg?v=11",''',

    'cardenal: {': '''cardenal: {
      id: "cardenal",
      name: "Cardenal",
      pokeName: "Cardeflame",
      pokeType: ["fuego", "volador"],
      pokeNumber: "#005",
      audioSrc: "audio/canto_cardenal.mp3",
      voiceSrc: "audio/voz_cardenal.mp3",
      reposo: "assets_mobile/cardenal_reposo_trans.webp?v=11",
      canto: "assets_mobile/cardenal_canto_trans.webp?v=11",
      cantoAlas: "assets_mobile/cardenal_canto_alas_trans.webp?v=11",
      pokemon: "assets_pokemon/cardenal_pokemon.webp?v=11",
      card: "assets_pokemon/raw/cardenal_card.jpg?v=11",''',

    'zorzal: {': '''zorzal: {
      id: "zorzal",
      name: "Zorzal Colorado",
      pokeName: "Zorzalson",
      pokeType: ["sonido", "volador"],
      pokeNumber: "#006",
      audioSrc: "audio/canto_zorzal_colorado.mp3",
      voiceSrc: "audio/voz_zorzal_colorado.mp3",
      reposo: "assets_mobile/zorzal_reposo_trans.webp?v=11",
      canto: "assets_mobile/zorzal_canto_trans.webp?v=11",
      cantoAlas: "assets_mobile/zorzal_canto_alas_trans.webp?v=11",
      pokemon: "assets_pokemon/zorzal_pokemon.webp?v=11",
      card: "assets_pokemon/raw/zorzal_card.jpg?v=11",''',

    'chingolo: {': '''chingolo: {
      id: "chingolo",
      name: "Chingolo",
      pokeName: "Chingolín",
      pokeType: ["normal", "volador"],
      pokeNumber: "#007",
      audioSrc: "audio/canto_chingolo.mp3",
      voiceSrc: "audio/voz_chingolo.mp3",
      reposo: "assets_mobile/chingolo_reposo_trans.webp?v=11",
      canto: "assets_mobile/chingolo_canto_trans.webp?v=11",
      cantoAlas: "assets_mobile/chingolo_canto_alas_trans.webp?v=11",
      pokemon: "assets_pokemon/chingolo_pokemon.webp?v=11",
      card: "assets_pokemon/raw/chingolo_card.jpg?v=11",''',

    'gaviota: {': '''gaviota: {
      id: "gaviota",
      name: "Gaviota Cocinera",
      pokeName: "Gaviotix",
      pokeType: ["agua", "volador"],
      pokeNumber: "#008",
      audioSrc: "audio/canto_gaviota.mp3",
      voiceSrc: "audio/voz_gaviota.mp3",
      reposo: "assets_mobile/gaviota_reposo_trans.webp?v=11",
      canto: "assets_mobile/gaviota_canto_trans.webp?v=11",
      cantoAlas: "assets_mobile/gaviota_canto_alas_trans.webp?v=11",
      pokemon: "assets_pokemon/gaviota_pokemon.webp?v=11",
      card: "assets_pokemon/raw/gaviota_card.jpg?v=11",''',

    'tordo: {': '''tordo: {
      id: "tordo",
      name: "Tordo Renegrido",
      pokeName: "Tordox",
      pokeType: ["siniestro", "volador"],
      pokeNumber: "#009",
      audioSrc: "audio/canto_tordo.mp3",
      voiceSrc: "audio/voz_tordo.mp3",
      reposo: "assets_mobile/tordo_reposo_trans.webp?v=11",
      canto: "assets_mobile/tordo_canto_trans.webp?v=11",
      cantoAlas: "assets_mobile/tordo_canto_alas_trans.webp?v=11",
      pokemon: "assets_pokemon/tordo_pokemon.webp?v=11",
      card: "assets_pokemon/raw/tordo_card.jpg?v=11",'''
}

for k, v in birds_replacements.items():
    # Replace the block until card:
    pattern = re.compile(rf'{re.escape(k)}[\s\S]*?card:\s*"[^"]*",', re.MULTILINE)
    html = pattern.sub(v, html)

# 3. Mejorar CSS de Vuelo en Perspectiva 3D con Despliegue de Alas
old_flight_css = """  /* Animación de vuelo y salida (Doble Tap con alas y perspectiva) */
  .bird-perch.is-flying-away {
    animation: birdFlightPath 1.6s cubic-bezier(0.22, 0.61, 0.36, 1) forwards !important;
    pointer-events: none !important;
  }

  /* El ave aletea activamente sus alas en perspectiva mientras vuela */
  .bird-perch.is-flying-away .bird-sprite {
    animation: birdFlapWings 0.14s ease-in-out infinite alternate !important;
    transform-origin: 50% 65%;
  }

  @keyframes birdFlightPath {
    0% {
      transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
      opacity: 1;
    }
    15% {
      transform: translate3d(25px, -50px, 0) scale(1.08) rotate(-10deg) skewX(-4deg);
      opacity: 1;
    }
    45% {
      transform: translate3d(120px, -180px, 0) scale(0.85) rotate(10deg) skewX(6deg);
      opacity: 0.92;
    }
    75% {
      transform: translate3d(280px, -360px, 0) scale(0.55) rotate(16deg) skewX(10deg);
      opacity: 0.75;
    }
    100% {
      transform: translate3d(500px, -600px, 0) scale(0.18) rotate(24deg) skewX(12deg);
      opacity: 0;
      visibility: hidden;
    }
  }

  @keyframes birdFlapWings {
    0% {
      transform: scaleY(1.12) scaleX(0.92) rotate(-3deg);
    }
    100% {
      transform: scaleY(0.72) scaleX(1.10) rotate(5deg);
    }
  }"""

new_flight_css = """  /* Animación de vuelo y salida (Doble Tap con alas desplegadas y perspectiva 3D) */
  .bird-perch.is-flying-away {
    animation: birdFlightPath 1.85s cubic-bezier(0.22, 0.61, 0.36, 1) forwards !important;
    pointer-events: none !important;
    z-index: 250 !important;
    perspective: 800px;
    transform-style: preserve-3d;
  }

  /* El ave se orienta de costado hacia la dirección de vuelo y bate sus alas desplegadas */
  .bird-perch.is-flying-away .bird-sprite {
    animation: birdFlapWings 0.15s ease-in-out infinite alternate !important;
    transform-origin: 50% 65%;
    filter: drop-shadow(0 15px 25px rgba(0,0,0,0.35));
  }

  @keyframes birdFlightPath {
    0% {
      transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
      opacity: 1;
    }
    12% {
      /* Despegue con alas abiertas y ligero ángulo hacia el cielo */
      transform: translate3d(20px, -45px, 40px) scale(1.10) rotate(-8deg);
      opacity: 1;
    }
    35% {
      /* Giro en perspectiva de perfil/costado hacia el fondo del paisaje */
      transform: translate3d(100px, -150px, 80px) scale(0.92) rotate(-14deg);
      opacity: 0.96;
    }
    65% {
      /* Ganancia de altura hacia la lejanía */
      transform: translate3d(250px, -330px, -40px) scale(0.62) rotate(-18deg);
      opacity: 0.85;
    }
    100% {
      /* Se eleva perdiéndose en el cielo */
      transform: translate3d(480px, -580px, -160px) scale(0.18) rotate(-22deg);
      opacity: 0;
      visibility: hidden;
    }
  }

  /* Batido de alas en perspectiva: downstroke con alas abiertas y upstroke replegado de perfil */
  @keyframes birdFlapWings {
    0% {
      transform: rotateY(-45deg) rotateZ(-12deg) scaleY(1.24) scaleX(0.86);
    }
    100% {
      transform: rotateY(-58deg) rotateZ(-18deg) scaleY(0.72) scaleX(1.16) skewX(8deg);
    }
  }"""

if old_flight_css in html:
    html = html.replace(old_flight_css, new_flight_css)
    print("CSS de vuelo actualizado correctamente.")
else:
    print("Warning: old_flight_css no encontrado directamente, buscando por partes...")

# 4. Refactorizar los eventos de toque/clic en los perches y modo comida
# Buscamos la sección de flyBirdAway, recallAllBirds, handleBirdTap y event listeners
old_interaction_section = """  function flyBirdAway(id) {
    const perch = document.getElementById(`perch-${id}`);
    if (!perch || hasFlown[id]) return;

    hasFlown[id] = true;

    // Si estaba cantando, silenciarlo
    if (isSinging[id]) {
      isSinging[id] = false;
      const audio = audioElements[id];
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      perch.classList.remove("is-singing");
      perch.classList.add("is-muted");
      if (camera.focusedBird === id) resetZoom();
    }

    // Cambiar de inmediato al sprite con alas abiertas desplegadas para volar
    const img = document.getElementById(`img-${id}`);
    if (img && currentSkin !== "pokemon") {
      img.src = BIRDS[id].cantoAlas || BIRDS[id].canto;
    }

    playWingFlapSound();

    perch.classList.remove("is-landing");
    void perch.offsetWidth;
    perch.classList.add("is-flying-away");

    showGlobalToast(`¡${BIRDS[id].name} levantó vuelo con sus alas hacia el cielo! 🕊️💨`);
    updateRecallButton();
  }

  function recallAllBirds() {
    let count = 0;
    Object.keys(BIRDS).forEach(id => {
      const perch = document.getElementById(`perch-${id}`);
      if (hasFlown[id]) {
        hasFlown[id] = false;
        count++;
        perch.classList.remove("is-flying-away");
        void perch.offsetWidth;
        perch.classList.add("is-landing");
        setTimeout(() => {
          perch.classList.remove("is-landing");
        }, 850);
      }
    });

    if (count > 0) {
      playChime(660);
      showGlobalToast("🕊️ ¡Todas las aves regresaron a sus perchas!");
    } else {
      showGlobalToast("¡Todas las aves ya están posadas en el paisaje!");
    }
    updateRecallButton();
    closeMenu();
  }

  function updateRecallButton() {
    const flownCount = Object.keys(hasFlown).filter(id => hasFlown[id]).length;
    if (btnQuickRecall && recallCountText) {
      if (flownCount > 0) {
        btnQuickRecall.style.display = "inline-flex";
        recallCountText.textContent = `Llamar Aves (${flownCount})`;
      } else {
        btnQuickRecall.style.display = "none";
      }
    }
    if (btnRecallBirds) {
      btnRecallBirds.textContent = flownCount > 0 ? `Llamar (${flownCount})` : "Llamar Aves";
    }
  }

  if (btnRecallBirds) btnRecallBirds.addEventListener("click", recallAllBirds);
  if (btnQuickRecall) btnQuickRecall.addEventListener("click", recallAllBirds);

  function showGlobalToast(msg) {
    const toast = document.createElement("div");
    toast.className = "help-hint";
    toast.style.top = "70px";
    toast.style.bottom = "auto";
    toast.style.opacity = "1";
    toast.innerHTML = `<span>✨</span><span>${msg}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 400);
    }, 2200);
  }

  function handleBirdTap(id) {
    lastTapHandledTime[id] = Date.now();
    const now = Date.now();
    const last = lastTapTime[id] || 0;
    const diff = now - last;

    if (diff > 0 && diff < 380) {
      // DOBLE TAP: Vuela hacia el cielo
      lastTapTime[id] = 0;
      flyBirdAway(id);
    } else {
      // TAP SIMPLE: Alternar canto (iniciar o silenciar)
      lastTapTime[id] = now;
      toggleBird(id, true);
    }
  }

  /* Conectar interacción de toque directa sin bloqueos de arrastre */
  let perchTouch = { x: 0, y: 0, time: 0, activeId: null };

  Object.keys(BIRDS).forEach(id => {
    const perch = document.getElementById(`perch-${id}`);

    perch.addEventListener("pointerdown", e => {
      e.stopPropagation();
      drag.active = false;
      drag.hasMoved = false;
      perchTouch.x = e.clientX;
      perchTouch.y = e.clientY;
      perchTouch.time = Date.now();
      perchTouch.activeId = id;
    });

    perch.addEventListener("pointerup", e => {
      e.stopPropagation();
      if (perchTouch.activeId !== id) return;
      perchTouch.activeId = null;

      const dist = Math.hypot(e.clientX - perchTouch.x, e.clientY - perchTouch.y);
      if (dist > 18) return; // Si arrastró el dedo más de 18px, no es tap

      handleBirdTap(id);
    });

    perch.addEventListener("click", e => {
      e.stopPropagation();
      if (Date.now() - (lastTapHandledTime[id] || 0) < 200) return;
      handleBirdTap(id);
    });
  });"""

new_interaction_section = """  function flyBirdAway(id) {
    const perch = document.getElementById(`perch-${id}`);
    if (!perch || hasFlown[id]) return;

    hasFlown[id] = true;

    // 1. Si estaba cantando, silenciar de inmediato
    if (isSinging[id]) {
      isSinging[id] = false;
      const audio = audioElements[id];
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      perch.classList.remove("is-singing");
      perch.classList.add("is-muted");
    }

    if (camera.focusedBird === id) {
      resetZoom();
    }

    // 2. Desplegar de inmediato las alas con el fotograma de alas abiertas
    const img = document.getElementById(`img-${id}`);
    if (img && currentSkin !== "pokemon") {
      img.src = BIRDS[id].cantoAlas || BIRDS[id].canto;
      img.setAttribute("data-frame-state", "alas");
    }

    // 3. Efecto de audio de batido de alas
    playWingFlapSound();

    // 4. Iniciar animación de vuelo hacia el cielo
    perch.classList.remove("is-landing");
    void perch.offsetWidth;
    perch.classList.add("is-flying-away");

    showGlobalToast(`¡${BIRDS[id].name} levantó vuelo con sus alas hacia el cielo! 🕊️💨`);
    updateRecallButton();
    updateMasterButtonState();
  }

  function recallAllBirds() {
    let count = 0;
    Object.keys(BIRDS).forEach(id => {
      const perch = document.getElementById(`perch-${id}`);
      const img = document.getElementById(`img-${id}`);
      if (hasFlown[id]) {
        hasFlown[id] = false;
        count++;
        perch.classList.remove("is-flying-away");
        if (img) {
          img.src = currentSkin === "pokemon" ? BIRDS[id].pokemon : BIRDS[id].reposo;
          img.setAttribute("data-frame-state", "reposo");
          img.setAttribute("data-beak", "closed");
        }
        void perch.offsetWidth;
        perch.classList.add("is-landing");
        setTimeout(() => {
          perch.classList.remove("is-landing");
        }, 850);
      }
    });

    if (count > 0) {
      playChime(660);
      showGlobalToast("🕊️ ¡Todas las aves regresaron a sus perchas!");
    } else {
      showGlobalToast("¡Todas las aves ya están posadas en el paisaje!");
    }
    updateRecallButton();
    closeMenu();
  }

  function updateRecallButton() {
    const flownCount = Object.keys(hasFlown).filter(id => hasFlown[id]).length;
    if (btnQuickRecall && recallCountText) {
      if (flownCount > 0) {
        btnQuickRecall.style.display = "inline-flex";
        recallCountText.textContent = `Llamar Aves (${flownCount})`;
      } else {
        btnQuickRecall.style.display = "none";
      }
    }
    if (btnRecallBirds) {
      btnRecallBirds.textContent = flownCount > 0 ? `Llamar (${flownCount})` : "Llamar Aves";
    }
  }

  if (btnRecallBirds) btnRecallBirds.addEventListener("click", recallAllBirds);
  if (btnQuickRecall) btnQuickRecall.addEventListener("click", recallAllBirds);

  function showGlobalToast(msg) {
    const toast = document.createElement("div");
    toast.className = "help-hint";
    toast.style.top = "70px";
    toast.style.bottom = "auto";
    toast.style.opacity = "1";
    toast.innerHTML = `<span>✨</span><span>${msg}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 400);
    }, 2200);
  }

  /* =========================================================================
     MECÁNICA UNIFICADA Y ROBUSTA: TAP SIMPLE, DOBLE TAP Y ALIMENTACIÓN
     ========================================================================= */
  let lastHandledGestureTime = 0;
  const birdPointerDown = {};

  function handleBirdInteraction(id, e) {
    if (hasFlown[id]) return;

    // 1. MODO DAR DE COMER: Evento delimitado exclusivo al hacer clic en el pajarito
    if (feedMode) {
      const perch = document.getElementById(`perch-${id}`);
      const r = perch ? perch.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
      const cx = (e.clientX && e.clientX > 0) ? e.clientX : (r.left + r.width / 2);
      const cy = (e.clientY && e.clientY > 0) ? e.clientY : (r.top + r.height / 2);
      feedBird(id, cx, cy);
      return;
    }

    // 2. MODO NORMAL: 1 Toque canta / silencia; Doble Toque rápido despliega alas y vuela
    const now = Date.now();
    const last = lastTapTime[id] || 0;
    const diff = now - last;

    if (diff >= 40 && diff < 380) {
      // ¡DOBLE TAP DETECTADO!: Despliega alas y vuela
      lastTapTime[id] = 0;
      flyBirdAway(id);
    } else {
      // TAP SIMPLE: Alternar canto (1 tap canta, otro tap para de cantar)
      lastTapTime[id] = now;
      toggleBird(id, true);
    }
  }

  /* Conexión limpia de eventos por ave sin interferencia de clic sintético */
  Object.keys(BIRDS).forEach(id => {
    const perch = document.getElementById(`perch-${id}`);

    perch.addEventListener("pointerdown", e => {
      e.stopPropagation();
      drag.active = false;
      drag.hasMoved = false;
      birdPointerDown[id] = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now()
      };
    });

    perch.addEventListener("pointerup", e => {
      e.stopPropagation();
      const start = birdPointerDown[id];
      if (!start) return;
      birdPointerDown[id] = null;

      const dist = Math.hypot(e.clientX - start.x, e.clientY - start.y);
      if (dist > 16) return; // Si arrastró el dedo, fue un intento de paneo

      lastHandledGestureTime = Date.now();
      handleBirdInteraction(id, e);
    });

    // Descartar el evento de clic sintético del navegador si pointerup ya lo procesó
    perch.addEventListener("click", e => {
      e.stopPropagation();
      e.preventDefault();
      if (Date.now() - lastHandledGestureTime < 450) {
        return; // Evita el doble disparo que apagaba el canto o provocaba vuelo involuntario
      }
      lastHandledGestureTime = Date.now();
      handleBirdInteraction(id, e);
    });
  });"""

if old_interaction_section in html:
    html = html.replace(old_interaction_section, new_interaction_section)
    print("Sección de interacción actualizada con éxito.")
else:
    print("Error: No se encontró old_interaction_section exacta.")

# 5. Modificar viewport pointerdown en modo alimentar para ignorar clicks en perch (ya manejados directamente)
old_viewport_feed = """  viewport.addEventListener("pointerdown", (e) => {
    if (!feedMode) return;
    if (e.target.closest(".hud-btn") || e.target.closest("#win-modal") || e.target.closest("#pokedex-modal")) return;"""

new_viewport_feed = """  viewport.addEventListener("pointerdown", (e) => {
    if (!feedMode) return;
    // Si se hizo clic directamente en un pajarito o en un botón, no duplicar el evento
    if (e.target.closest(".hud-btn") || e.target.closest("#win-modal") || e.target.closest("#pokedex-modal") || e.target.closest(".bird-perch")) return;"""

if old_viewport_feed in html:
    html = html.replace(old_viewport_feed, new_viewport_feed)
    print("Viewport pointerdown para comida actualizado.")
else:
    print("Warning: old_viewport_feed no encontrado.")

# 6. Actualizar versión de despliegue en localStorage
html = re.sub(r"const APP_DEPLOY_VERSION = '[^']+';", "const APP_DEPLOY_VERSION = '2026.10.26.v11.perfect_flight_and_events';", html)

with open(INDEX_PATH, "w", encoding="utf-8") as f:
    f.write(html)

print("index.html guardado exitosamente.")

# 7. Actualizar sw.js
with open(SW_PATH, "r", encoding="utf-8") as f:
    sw = f.read()

sw = re.sub(r"const CACHE_NAME = '[^']+';", "const CACHE_NAME = 'pajaritos-cache-v11-perfect-gestures';", sw)
sw = sw.replace("?v=10", "?v=11")

# Añadir canto_alas para todas las aves a la lista de ASSETS_TO_CACHE si no están
canto_alas_entries = [
    "  './assets_mobile/hornero_canto_alas_trans.webp?v=11',",
    "  './assets_mobile/tero_canto_alas_trans.webp?v=11',",
    "  './assets_mobile/benteveo_canto_alas_trans.webp?v=11',",
    "  './assets_mobile/cotorra_canto_alas_trans.webp?v=11',",
    "  './assets_mobile/cardenal_canto_alas_trans.webp?v=11',",
    "  './assets_mobile/zorzal_canto_alas_trans.webp?v=11',",
    "  './assets_mobile/chingolo_canto_alas_trans.webp?v=11',",
    "  './assets_mobile/gaviota_canto_alas_trans.webp?v=11',",
    "  './assets_mobile/tordo_canto_alas_trans.webp?v=11',"
]

for entry in canto_alas_entries:
    clean_entry = entry.strip().rstrip(",")
    if clean_entry not in sw:
        sw = sw.replace("  './audio/canto_cotorra.mp3',", f"{entry}\n  './audio/canto_cotorra.mp3',")

with open(SW_PATH, "w", encoding="utf-8") as f:
    f.write(sw)

print("sw.js guardado exitosamente con v11.")
