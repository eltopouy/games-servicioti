import re

html_path = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\index.html"
sw_path = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\sw.js"

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update version to v9
html = re.sub(r'(\.(?:webp|jpg))\?v=\d+', r'\1?v=9', html)

# 2. Make Balneario Costa the default in HTML
html = html.replace('<div id="world-stage" class="theme-mediodia">', '<div id="world-stage" class="theme-costa">')

# 3. Remove "Pinamar Aves" link that led to servicioti.com.uy
# Find in header.hud-bar
old_brand_link = r'<a href="https://servicioti\.com\.uy"[^>]*>.*?</a>'
html = re.sub(old_brand_link, '', html, flags=re.DOTALL)

# 4. Update THEMES list in Javascript:
# Put "costa" first, named "Balneario Pinamar Escuela 295"
old_themes_pattern = r'const THEMES = \[.*?\];'
new_themes = """const THEMES = [
    { id: "costa", icon: "🏖️", name: "Balneario Pinamar Escuela 295" },
    { id: "mediodia", icon: "☀️", name: "Calle de Tosca - Mediodía" },
    { id: "atardecer", icon: "🌇", name: "Calle de Tosca - Atardecer" },
    { id: "amanecer", icon: "🌅", name: "Calle de Tosca - Amanecer" }
  ];"""
html = re.sub(old_themes_pattern, new_themes, html, flags=re.DOTALL)

# 5. Update initial theme text in HUD and Menu
html = html.replace('<span id="theme-text">Mediodía</span>', '<span id="theme-text">Balneario Pinamar Escuela 295</span>')
html = html.replace('<span id="theme-icon">☀️</span>', '<span id="theme-icon">🏖️</span>')

# 6. Update CSS for Flight with active wing-flapping and perspective skew
flight_css_pattern = r'/\* Animación de vuelo y salida \(Doble Tap\) \*/.*?@keyframes birdLandAnim \{.*?\n  \}'
new_flight_css = """/* Animación de vuelo y salida (Doble Tap con alas y perspectiva) */
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
  }"""
html = re.sub(flight_css_pattern, new_flight_css, html, flags=re.DOTALL)

# 7. Replace the entire interaction, toggleBird, and startLipSyncEngine block
js_core_pattern = r'function toggleBird\(id, triggeredByClick = true\) \{.*?requestAnimationFrame\(loop\);\s*\}'

new_js_core = """function toggleBird(id, triggeredByClick = true) {
    const hint = document.getElementById("help-hint");
    if (hint) {
      hint.style.opacity = "0";
      setTimeout(() => hint.remove(), 500);
    }

    const audio = audioElements[id];
    const perch = document.getElementById(`perch-${id}`);
    const img = document.getElementById(`img-${id}`);

    showBirdToast(id);

    if (isSinging[id]) {
      // DETENER CANTO: Apagar audio y regresar al fotograma de reposo (pico cerrado)
      isSinging[id] = false;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      perch.classList.remove("is-singing");
      perch.classList.add("is-muted");
      img.src = currentSkin === "pokemon" ? BIRDS[id].pokemon : BIRDS[id].reposo;
      img.setAttribute("data-beak", "closed");
      img.setAttribute("data-frame-state", "reposo");
      if (camera.focusedBird === id) resetZoom();
    } else {
      // INICIAR CANTO: Iniciar audio y animar fotogramas
      isSinging[id] = true;
      perch.classList.remove("is-muted");
      perch.classList.add("is-singing");
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log("Audio play err", e));
      }
      spawnMusicNote(id);

      // Iniciar de inmediato en el fotograma de canto
      if (currentSkin !== "pokemon") {
        img.src = BIRDS[id].cantoPico || BIRDS[id].canto;
        img.setAttribute("data-beak", "open");
        img.setAttribute("data-frame-state", "pico");
      }

      if (triggeredByClick) {
        zoomToBird(id);
      }
    }

    updateMasterButtonState();
  }

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
  const hasFlown = {};
  const lastTapTime = {};
  const lastTapHandledTime = {};

  function playWingFlapSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.1));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.32);
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
          const t = (audio && audio.currentTime > 0) ? audio.currentTime : (now * 0.001);

          // Para aves con 3 fotogramas (Hornero con aleteo)
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
          } else {
            // Para las otras aves: alternar entre pico abierto cantando y reposo
            const isOpen = (Math.sin(t * 16 + (id.charCodeAt(0) % 5)) > -0.15);
            const targetState = isOpen ? "pico" : "reposo";
            const targetSrc = isOpen ? BIRDS[id].canto : BIRDS[id].reposo;

            if (img.getAttribute("data-frame-state") !== targetState) {
              img.src = targetSrc;
              img.setAttribute("data-frame-state", targetState);
              img.setAttribute("data-beak", isOpen ? "open" : "closed");
            }
          }
        });
      }

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }"""

html = re.sub(js_core_pattern, new_js_core, html, flags=re.DOTALL)

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Updated index.html to v9 successfully!")

# Also update sw.js CACHE_NAME to pajaritos-cache-v9-tap-flight
with open(sw_path, "r", encoding="utf-8") as f:
    sw_code = f.read()

sw_code = re.sub(r'const CACHE_NAME = [^;]+;', "const CACHE_NAME = 'pajaritos-cache-v9-tap-flight';", sw_code)
sw_code = re.sub(r'\?v=\d+', '?v=9', sw_code)

with open(sw_path, "w", encoding="utf-8") as f:
    f.write(sw_code)

print("Updated sw.js to v9 successfully!")
