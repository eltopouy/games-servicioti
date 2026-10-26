import os
import re

html_path = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\index.html"
sw_path = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\sw.js"

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update version tags to ?v=8 everywhere
html = re.sub(r'(\.(?:webp|jpg))\?v=\d+', r'\1?v=8', html)

# 2. Add Hamburger & Flight CSS rules
css_to_add = """
  /* =========================================================================
     ESTILOS DEL MENÚ HAMBURGUESA, CAJÓN LATERAL Y VUELO DE AVES
     ========================================================================= */
  .hud-btn-menu {
    background: #0ea5e9 !important;
    color: #ffffff !important;
    border-color: #38bdf8 !important;
    box-shadow: 0 4px 14px rgba(14, 165, 233, 0.45);
  }
  .hud-btn-menu:hover {
    background: #0284c7 !important;
    transform: scale(1.05);
  }

  .menu-modal {
    position: fixed;
    inset: 0;
    z-index: 1200;
    display: none;
    align-items: center;
    justify-content: flex-end;
  }
  .menu-modal.open {
    display: flex;
  }

  .menu-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .menu-modal.open .menu-backdrop {
    opacity: 1;
  }

  .menu-panel {
    position: relative;
    width: 100%;
    max-width: 380px;
    height: 100%;
    background: #111827;
    border-left: 2px solid rgba(255, 255, 255, 0.15);
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    color: #f3f4f6;
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 2;
    overflow-y: auto;
  }
  .menu-modal.open .menu-panel {
    transform: translateX(0);
  }

  .menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: #1f2937;
  }
  .menu-header h3 {
    font-family: 'Fredoka One', cursive;
    font-size: 1.25rem;
    color: #38bdf8;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .menu-close-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .menu-close-btn:hover {
    background: #ef4444;
    transform: scale(1.1);
  }

  .menu-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .menu-item-card {
    background: #1f2937;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    transition: border-color 0.2s ease, transform 0.2s ease;
  }
  .menu-item-card:hover {
    border-color: rgba(56, 189, 248, 0.4);
    transform: translateY(-2px);
  }

  .menu-item-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }
  .menu-item-info .item-icon {
    font-size: 1.6rem;
  }
  .menu-item-info strong {
    display: block;
    font-size: 0.95rem;
    color: #fff;
  }
  .menu-item-info small {
    display: block;
    font-size: 0.78rem;
    color: #9ca3af;
    line-height: 1.3;
    margin-top: 2px;
  }

  .menu-action-btn {
    background: #374151;
    color: #fff;
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 8px 14px;
    font-family: 'Fredoka One', cursive;
    font-size: 0.88rem;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s ease, transform 0.15s ease;
  }
  .menu-action-btn:hover {
    background: #38bdf8;
    color: #0c1017;
    border-color: #38bdf8;
    transform: scale(1.05);
  }

  /* Animación de vuelo y salida (Doble Tap) */
  .bird-perch.is-flying-away {
    animation: birdFlyAwayAnim 1.3s cubic-bezier(0.2, 0.8, 0.3, 1) forwards !important;
    pointer-events: none !important;
  }

  @keyframes birdFlyAwayAnim {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 1;
    }
    20% {
      transform: translate3d(0, -35px, 0) scale(1.08) rotate(-8deg);
      opacity: 1;
    }
    50% {
      transform: translate3d(70px, -150px, 0) scale(0.85) rotate(10deg);
      opacity: 0.85;
    }
    100% {
      transform: translate3d(240px, -500px, 0) scale(0.25) rotate(22deg);
      opacity: 0;
      visibility: hidden;
    }
  }

  /* Animación de aterrizaje suave al reiniciar */
  .bird-perch.is-landing {
    animation: birdLandAnim 0.75s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards !important;
  }

  @keyframes birdLandAnim {
    0% {
      transform: translate3d(0, -120px, 0) scale(0.35);
      opacity: 0;
    }
    75% {
      transform: translate3d(0, 6px, 0) scale(1.04);
      opacity: 1;
    }
    100% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 1;
    }
  }
"""

if '.menu-modal' not in html:
    html = html.replace('</style>', css_to_add + '\n</style>')

# 3. Replace the Header HUD and add Menu Modal
new_hud = """  <!-- Barra Superior de Control Organizada y Limpia -->
  <header class="hud-bar">
    <div class="hud-group">
      <a href="https://servicioti.com.uy" target="_blank" rel="noopener" class="hud-btn" title="ServicioTI Games" style="text-decoration:none; background: rgba(12, 16, 23, 0.82); color: #38bdf8; border: 1.5px solid rgba(56, 189, 248, 0.45); font-weight:800; font-size: clamp(0.75rem, 2.2vw, 0.9rem);">
        <span>🐦</span>
        <span>Pinamar Aves</span>
      </a>

      <button id="btn-feed-mode" class="hud-btn" type="button" aria-label="Jugar a dar de comer" style="background: #2ecc71; color: #ffffff; border-color: #27ae60;">
        <span id="feed-btn-icon">🌾</span>
        <span id="feed-btn-text">Dar de Comer</span>
      </button>
    </div>

    <div class="hud-group">
      <button id="btn-quick-recall" class="hud-btn" type="button" aria-label="Llamar a las aves" style="display:none; background:#38bdf8; color:#0c1017; font-weight:800; border-color:#0284c7;">
        <span>🕊️</span>
        <span id="recall-count-text">Llamar Aves</span>
      </button>

      <button id="btn-hamburger" class="hud-btn hud-btn-menu" type="button" aria-label="Abrir menú de opciones">
        <span class="hamburger-icon">☰</span>
        <span class="btn-text">Menú</span>
      </button>
    </div>
  </header>

  <!-- Modal Cajón del Menú Hamburguesa -->
  <div id="menu-modal" class="menu-modal" role="dialog" aria-modal="true" aria-label="Menú de opciones">
    <div class="menu-backdrop" id="menu-backdrop"></div>
    <div class="menu-panel">
      <div class="menu-header">
        <h3><span>🌲</span> Controles del Paisaje</h3>
        <button id="btn-menu-close" class="menu-close-btn" aria-label="Cerrar menú">✕</button>
      </div>

      <div class="menu-body">
        <!-- 1. Volver a llamar a todas las aves -->
        <div class="menu-item-card">
          <div class="menu-item-info">
            <span class="item-icon">🕊️</span>
            <div>
              <strong>Volver a llamar a las aves</strong>
              <small>Hace regresar a todas las aves que volaron con doble tap</small>
            </div>
          </div>
          <button id="btn-recall-birds" class="menu-action-btn">Llamar Aves</button>
        </div>

        <!-- 2. Coro Completo -->
        <div class="menu-item-card">
          <div class="menu-item-info">
            <span class="item-icon">🎶</span>
            <div>
              <strong>Coro Completo</strong>
              <small>Activar o pausar el canto simultáneo de todas las aves</small>
            </div>
          </div>
          <button id="btn-master" class="menu-action-btn">
            <span id="master-icon">🎶</span>
            <span id="master-text">Cantar Todos</span>
          </button>
        </div>

        <!-- 3. Momento del Día / Escenario -->
        <div class="menu-item-card">
          <div class="menu-item-info">
            <span class="item-icon">🌅</span>
            <div>
              <strong>Momento del Día</strong>
              <small>Mediodía, Atardecer, Amanecer o Costa</small>
            </div>
          </div>
          <button id="btn-theme" class="menu-action-btn">
            <span id="theme-icon">☀️</span>
            <span id="theme-text">Mediodía</span>
          </button>
        </div>

        <!-- 4. Modo PokéAves -->
        <div class="menu-item-card">
          <div class="menu-item-info">
            <span class="item-icon">⚡</span>
            <div>
              <strong>Modo PokéAves</strong>
              <small>Transforma las aves en personajes Sugimori</small>
            </div>
          </div>
          <button id="btn-skin" class="menu-action-btn" style="background: rgba(255, 255, 255, 0.9);">
            <span id="skin-icon">⚡</span>
            <span id="skin-text">PokéAves</span>
          </button>
        </div>

        <!-- 5. Pokédex Nacional -->
        <div class="menu-item-card">
          <div class="menu-item-info">
            <span class="item-icon">📕</span>
            <div>
              <strong>Pokédex de Pinamar</strong>
              <small>Fichas ilustradas, cantos y tipos de las 9 aves</small>
            </div>
          </div>
          <button id="btn-pokedex" class="menu-action-btn" style="background:#e74c3c; color:#fff;">
            <span>Fichas</span>
          </button>
        </div>

        <!-- 6. Forzar Actualización y Limpiar Caché -->
        <div class="menu-item-card">
          <div class="menu-item-info">
            <span class="item-icon">🔄</span>
            <div>
              <strong>Actualizar Versión</strong>
              <small>Limpia cachés locales y recarga la versión más fresca</small>
            </div>
          </div>
          <button id="btn-force-update" class="menu-action-btn">
            <span>Refrescar</span>
          </button>
        </div>
      </div>
    </div>
  </div>"""

# Replace the old header
html = re.sub(r'<!-- Barra Superior de Control -->.*?<!-- Banner del Minijuego', new_hud + '\n\n  <!-- Banner del Minijuego', html, flags=re.DOTALL)

# 4. Now let's update Javascript:
# We need:
# - Double tap flight logic
# - Re-call all birds logic
# - Hamburger open/close logic
# - 24 FPS animation engine with musical cadence for Hornero
js_engine = """
  /* =========================================================================
     GESTIÓN DE MENÚ HAMBURGUESA
     ========================================================================= */
  const btnHamburger = document.getElementById("btn-hamburger");
  const menuModal = document.getElementById("menu-modal");
  const menuBackdrop = document.getElementById("menu-backdrop");
  const btnMenuClose = document.getElementById("btn-menu-close");
  const btnRecallBirds = document.getElementById("btn-recall-birds");
  const btnQuickRecall = document.getElementById("btn-quick-recall");
  const recallCountText = document.getElementById("recall-count-text");

  function openMenu() {
    if (menuModal) menuModal.classList.add("open");
  }
  function closeMenu() {
    if (menuModal) menuModal.classList.remove("open");
  }

  if (btnHamburger) btnHamburger.addEventListener("click", openMenu);
  if (btnMenuClose) btnMenuClose.addEventListener("click", closeMenu);
  if (menuBackdrop) menuBackdrop.addEventListener("click", closeMenu);

  /* =========================================================================
     MECÁNICA DE VUELO: DOBLE TAP PARA VOLAR Y REINICIAR AVES
     ========================================================================= */
  const lastTapTime = {};
  const tapTimers = {};
  const hasFlown = {};

  function playWingFlapSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      // Ruido filtrado simulando aleteo suave
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.35);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.38);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch(e) {}
  }

  function flyBirdAway(id) {
    const perch = document.getElementById(`perch-${id}`);
    if (!perch || hasFlown[id]) return;

    hasFlown[id] = true;

    // Si estaba cantando, silenciarlo
    if (isSinging[id]) {
      isSinging[id] = false;
      const audio = audioElements[id];
      audio.pause();
      audio.currentTime = 0;
      perch.classList.remove("is-singing");
      perch.classList.add("is-muted");
      if (camera.focusedBird === id) resetZoom();
    }

    playWingFlapSound();

    perch.classList.remove("is-landing");
    void perch.offsetWidth;
    perch.classList.add("is-flying-away");

    showGlobalToast(`¡${BIRDS[id].name} levantó vuelo hacia el cielo! 🕊️💨`);
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

  /* Conectar interacción de toque: 1 Tap = Cantar / 2 Taps = Volar */
  Object.keys(BIRDS).forEach(id => {
    const perch = document.getElementById(`perch-${id}`);
    perch.addEventListener("pointerdown", e => {
      e.stopPropagation();
      drag.active = false;
    });

    perch.addEventListener("click", e => {
      e.stopPropagation();
      if (drag.hasMoved) return;

      const now = Date.now();
      const last = lastTapTime[id] || 0;

      if (now - last < 340) {
        // Doble Tap: Vuela y se va
        clearTimeout(tapTimers[id]);
        lastTapTime[id] = 0;
        flyBirdAway(id);
      } else {
        // Un Tap: Canta
        lastTapTime[id] = now;
        tapTimers[id] = setTimeout(() => {
          if (!hasFlown[id]) {
            toggleBird(id, true);
          }
        }, 340);
      }
    });
  });

  /* =========================================================================
     MOTOR DE ANIMACIÓN A 24 FPS (SUAVE Y CADENCIADO)
     ========================================================================= */
  function startLipSyncEngine() {
    let lastAnimTick = 0;
    const FRAME_INTERVAL = 1000 / 24; // 24 FPS exactos (41.6ms)

    function loop(now) {
      if (now - lastAnimTick >= FRAME_INTERVAL) {
        lastAnimTick = now;

        Object.keys(BIRDS).forEach(id => {
          if (!isSinging[id] || hasFlown[id]) return;

          const img = document.getElementById(`img-${id}`);
          if (!img) return;

          if (currentSkin === "pokemon") {
            if (img.src !== BIRDS[id].pokemon && !img.src.endsWith(BIRDS[id].pokemon)) {
              img.src = BIRDS[id].pokemon;
            }
            return;
          }

          const audio = audioElements[id];
          const t = audio.currentTime || (now * 0.001);

          // Pausa cadenciosa cada ciclo de canto
          const isVocalizing = ((Math.floor(t * 2.2) % 6) !== 0);

          if (!isVocalizing) {
            if (img.getAttribute("data-frame-state") !== "reposo") {
              img.src = BIRDS[id].reposo;
              img.setAttribute("data-frame-state", "reposo");
              img.setAttribute("data-beak", "closed");
            }
            return;
          }

          // Para aves con 3 fotogramas (Hornero con aleteo)
          if (BIRDS[id].cantoAlas && BIRDS[id].cantoPico) {
            // Ciclo rítmico a 24 FPS: pico -> alas -> alas -> pico
            const cycleFrame = Math.floor(t * 7) % 4;
            const isWings = (cycleFrame === 1 || cycleFrame === 2);
            const targetState = isWings ? "alas" : "pico";

            if (img.getAttribute("data-frame-state") !== targetState) {
              img.src = isWings ? BIRDS[id].cantoAlas : BIRDS[id].cantoPico;
              img.setAttribute("data-frame-state", targetState);
              img.setAttribute("data-beak", "open");
            }
          } else {
            if (img.getAttribute("data-frame-state") !== "pico") {
              img.src = BIRDS[id].canto;
              img.setAttribute("data-frame-state", "pico");
              img.setAttribute("data-beak", "open");
            }
          }
        });
      }

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }
"""

# Replace the existing click listeners and startLipSyncEngine
# Find from "Conectar eventos a cada ave" down to end of startLipSyncEngine
pattern = r'// Conectar eventos a cada ave.*?function startLipSyncEngine\(\) \{.*?\n  \}'
html = re.sub(pattern, js_engine.strip(), html, flags=re.DOTALL)

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Updated index.html successfully!")

# Also update sw.js CACHE_NAME to pajaritos-cache-v8-wings-recall
with open(sw_path, "r", encoding="utf-8") as f:
    sw_code = f.read()

sw_code = re.sub(r'const CACHE_NAME = [^;]+;', "const CACHE_NAME = 'pajaritos-cache-v8-wings-recall';", sw_code)
sw_code = re.sub(r'\?v=\d+', '?v=8', sw_code)

with open(sw_path, "w", encoding="utf-8") as f:
    f.write(sw_code)

print("Updated sw.js successfully!")
