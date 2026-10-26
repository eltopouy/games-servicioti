# -*- coding: utf-8 -*-
"""
apply_v13_subtle_animation.py
Aplica los fotogramas de canto sutil del Hornero y ajusta la cadencia de animación:
- En canto (1 Tap): Solo micro-movimiento de pico y trino sutil, manteniendo exactamente la misma pose y posición corporal.
- En vuelo (Doble Tap): Usa sprite de vuelo con envergadura completa (vuelo).
- Bump a versión v13.
"""

import re

INDEX_PATH = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\index.html"
SW_PATH = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\sw.js"

with open(INDEX_PATH, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Actualizar hornero en BIRDS para añadir vuelo
old_hornero = '''    hornero: {
      id: "hornero",
      name: "Hornero",
      pokeName: "Hornerox",
      pokeType: ["tierra", "volador"],
      pokeNumber: "#001",
      audioSrc: "audio/canto_hornero.mp3",
      voiceSrc: "audio/voz_hornero.mp3",
      reposo: "assets_mobile/hornero_reposo_trans.webp?v=12",
      canto: "assets_mobile/hornero_canto_pico_trans.webp?v=12",
      cantoPico: "assets_mobile/hornero_canto_pico_trans.webp?v=12",
      cantoAlas: "assets_mobile/hornero_canto_alas_trans.webp?v=12",
      pokemon: "assets_pokemon/hornero_pokemon.webp?v=12",'''

new_hornero = '''    hornero: {
      id: "hornero",
      name: "Hornero",
      pokeName: "Hornerox",
      pokeType: ["tierra", "volador"],
      pokeNumber: "#001",
      audioSrc: "audio/canto_hornero.mp3",
      voiceSrc: "audio/voz_hornero.mp3",
      reposo: "assets_mobile/hornero_reposo_trans.webp?v=13",
      canto: "assets_mobile/hornero_canto_pico_trans.webp?v=13",
      cantoPico: "assets_mobile/hornero_canto_pico_trans.webp?v=13",
      cantoAlas: "assets_mobile/hornero_canto_alas_trans.webp?v=13",
      vuelo: "assets_mobile/hornero_vuelo_trans.webp?v=13",
      pokemon: "assets_pokemon/hornero_pokemon.webp?v=13",'''

if old_hornero in html:
    html = html.replace(old_hornero, new_hornero)
    print("Hornero actualizado con nuevo sprite de vuelo y versión v13.")
else:
    print("Warning: old_hornero exacto no encontrado.")

# 2. Actualizar flyBirdAway para usar vuelo
old_fly_sprite = "img.src = BIRDS[id].cantoAlas || BIRDS[id].canto;"
new_fly_sprite = "img.src = BIRDS[id].vuelo || BIRDS[id].cantoAlas || BIRDS[id].canto;"
if old_fly_sprite in html:
    html = html.replace(old_fly_sprite, new_fly_sprite)
    print("flyBirdAway actualizado con BIRDS[id].vuelo.")

# 3. Ajustar startLipSyncEngine para cadencia más sutil y natural
old_engine = """          // Para aves con 3 fotogramas (Hornero con aleteo)
          if (BIRDS[id].cantoAlas && BIRDS[id].cantoPico) {
            // Ciclo musical cadenciado a 24 FPS:
            // 0: pico abierto cantando
            // 1: alas abiertas aleteando
            // 2: alas abiertas aleteando
            // 3: pico abierto cantando
            const cycleFrame = Math.floor(t * 6) % 4;
            const isWings = (cycleFrame === 1 || cycleFrame === 2);
            const targetState = isWings ? "alas" : "pico";
            const targetSrc = isWings ? BIRDS[id].cantoAlas : BIRDS[id].cantoPico;

            if (img.getAttribute("data-frame-state") !== targetState) {
              img.src = targetSrc;
              img.setAttribute("data-frame-state", targetState);
              img.setAttribute("data-beak", "open");
            }
          }"""

new_engine = """          // Para aves con 3 fotogramas de micro-animación sutil (Hornero)
          if (BIRDS[id].cantoAlas && BIRDS[id].cantoPico) {
            // Cadencia sutil: la mayor parte del tiempo pico abierto cantando,
            // con un aleteo y trino sutil (alas) y una micro-respiración
            const cycleFrame = Math.floor(t * 4.5) % 5;
            let targetState = "pico";
            let targetSrc = BIRDS[id].cantoPico;

            if (cycleFrame === 1) {
              targetState = "alas";
              targetSrc = BIRDS[id].cantoAlas;
            } else if (cycleFrame === 4) {
              targetState = "reposo";
              targetSrc = BIRDS[id].reposo;
            }

            if (img.getAttribute("data-frame-state") !== targetState) {
              img.src = targetSrc;
              img.setAttribute("data-frame-state", targetState);
              img.setAttribute("data-beak", targetState === "reposo" ? "closed" : "open");
            }
          }"""

if old_engine in html:
    html = html.replace(old_engine, new_engine)
    print("startLipSyncEngine actualizado a cadencia sutil.")
else:
    print("Warning: old_engine no encontrado.")

# 4. Bump a v13
html = html.replace("?v=12", "?v=13")
html = re.sub(r"const APP_DEPLOY_VERSION = '[^']+';", "const APP_DEPLOY_VERSION = '2026.10.26.v13.subtle_singing_frames';", html)

with open(INDEX_PATH, "w", encoding="utf-8") as f:
    f.write(html)

print("index.html guardado exitosamente con v13.")

# 5. Actualizar sw.js
with open(SW_PATH, "r", encoding="utf-8") as f:
    sw = f.read()

sw = re.sub(r"const CACHE_NAME = '[^']+';", "const CACHE_NAME = 'pajaritos-cache-v13-subtle-singing';", sw)
sw = sw.replace("?v=12", "?v=13")
if "./assets_mobile/hornero_vuelo_trans.webp?v=13" not in sw:
    sw = sw.replace("  './assets_mobile/hornero_canto_alas_trans.webp?v=13',", "  './assets_mobile/hornero_canto_alas_trans.webp?v=13',\n  './assets_mobile/hornero_vuelo_trans.webp?v=13',")

with open(SW_PATH, "w", encoding="utf-8") as f:
    f.write(sw)

print("sw.js guardado con v13.")
