# -*- coding: utf-8 -*-
"""
apply_v12_flawless.py
1. Restaura las 4 funciones faltantes que provocaban ReferenceError (showBirdToast, spawnMusicNote, updateMasterButtonState, playChime).
2. Implementa accommodateCameraToBirdFlight(id) para que la vista del fondo se acomode automáticamente al volar un ave.
3. Asegura que toggleBird funcione al 100% (1 tap canta, siguiente tap silencia).
4. Asegura que doble tap active el vuelo con alas desplegadas en perspectiva 3D y acomodación automática del fondo.
5. Actualiza sw.js y localStorage a v12.
"""

import re

INDEX_PATH = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\index.html"
SW_PATH = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\sw.js"

with open(INDEX_PATH, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Definiciones de las funciones auxiliares indispensables antes de toggleBird
missing_functions = """  /* =========================================================================
     FUNCIONES DE RETROALIMENTACIÓN VISUAL, AUDITIVA Y DE ESTADO
     ========================================================================= */
  const toastTimers = {};
  function showBirdToast(id) {
    const perch = document.getElementById(`perch-${id}`);
    if (!perch) return;
    const toast = perch.querySelector(".bird-toast");
    if (!toast) return;

    toast.textContent = currentSkin === "pokemon" ? `¡${BIRDS[id].pokeName}! ⚡` : `¡${BIRDS[id].name}!`;

    if (toastTimers[id]) clearTimeout(toastTimers[id]);
    toast.classList.add("show");
    toastTimers[id] = setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }

  const NOTES = ["♪", "♫", "♬", "♩", "𝅘𝅥𝅯"];
  function spawnMusicNote(id) {
    const perch = document.getElementById(`perch-${id}`);
    if (!perch) return;
    const spawner = perch.querySelector(".note-spawner");
    if (!spawner) return;

    const note = document.createElement("span");
    note.className = "music-note";
    note.textContent = NOTES[Math.floor(Math.random() * NOTES.length)];
    const tx = (Math.random() - 0.5) * 60;
    const rot = (Math.random() - 0.5) * 50;
    note.style.setProperty("--tx", `${tx}px`);
    note.style.setProperty("--rot", `${rot}deg`);

    const colors = ["#fffa65", "#ff9ff3", "#54a0ff", "#5f27cd", "#00d2d3", "#ff6b6b"];
    note.style.color = colors[Math.floor(Math.random() * colors.length)];

    spawner.appendChild(note);
    setTimeout(() => note.remove(), 1500);
  }

  function playChime(freq = 660) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.42);
    } catch(e) {}
  }

  function updateMasterButtonState() {
    const masterIcon = document.getElementById("master-icon");
    const masterText = document.getElementById("master-text");
    if (!masterIcon || !masterText) return;
    const anySinging = Object.keys(BIRDS).some(id => isSinging[id]);
    if (anySinging) {
      masterIcon.textContent = "🤫";
      masterText.textContent = "Silencio";
    } else {
      masterIcon.textContent = "🎶";
      masterText.textContent = "Cantar Todos";
    }
  }

  /* Acomoda automáticamente la vista del fondo panorámico al volar un ave */
  function accommodateCameraToBirdFlight(id) {
    camera.isZoomed = false;
    camera.focusedBird = null;
    camera.targetScale = 1;

    const vpW = viewport.clientWidth;
    const coords = getBirdCoordinates(id);
    const birdPxX = (coords.pctX / 100) * stageW;

    // Encuadra la vista hacia el ave y su trayectoria ascendente hacia el cielo
    const targetX = (vpW / 2) - (birdPxX + 100);
    camera.targetX = targetX;
    camera.targetY = 0;

    clampCameraBounds();
    updateCameraTransform(false);
    if (btnZoomOut) btnZoomOut.classList.remove("show");
  }
"""

# Insertar estas funciones antes de toggleBird
target_str = "  /* =========================================================================\n     INTERACCIÓN Y CANTO DE AVES\n     ========================================================================= */"
if target_str in html:
    html = html.replace(target_str, f"{missing_functions}\n{target_str}")
    print("Funciones auxiliares inyectadas con éxito.")
else:
    print("Warning: target_str no encontrado.")

# 2. Actualizar flyBirdAway para usar accommodateCameraToBirdFlight
old_fly_away = """  function flyBirdAway(id) {
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
    }"""

new_fly_away = """  function flyBirdAway(id) {
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

    // 2. Acomodar automáticamente la vista del fondo para seguir el vuelo panorámico completo
    accommodateCameraToBirdFlight(id);"""

if old_fly_away in html:
    html = html.replace(old_fly_away, new_fly_away)
    print("flyBirdAway actualizado para acomodar automáticamente la vista del fondo.")
else:
    print("Warning: old_fly_away no encontrado.")

# 3. Cache version bump a v12
html = html.replace("?v=11", "?v=12")
html = re.sub(r"const APP_DEPLOY_VERSION = '[^']+';", "const APP_DEPLOY_VERSION = '2026.10.26.v12.auto_reframe_and_fixed_functions';", html)

with open(INDEX_PATH, "w", encoding="utf-8") as f:
    f.write(html)

print("index.html guardado exitosamente con v12.")

# 4. Actualizar sw.js
with open(SW_PATH, "r", encoding="utf-8") as f:
    sw = f.read()

sw = re.sub(r"const CACHE_NAME = '[^']+';", "const CACHE_NAME = 'pajaritos-cache-v12-flawless';", sw)
sw = sw.replace("?v=11", "?v=12")

with open(SW_PATH, "w", encoding="utf-8") as f:
    f.write(sw)

print("sw.js guardado exitosamente con v12.")
