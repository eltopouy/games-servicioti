/* =========================================================================
   TALLER DE PINTURA INTERACTIVO (3+ AÑOS) - PAJARITOS DE PINAMAR (v26)
   Módulo autocontenido: DOM + CSS + Generador de Contornos + Balde Mágico
   ========================================================================= */
(function () {
  "use strict";

  const CW = 600;
  const CH = 600;
  const MAX_UNDO = 10;

  // Paleta de 14 colores pensada para niños de 3+ años
  const COLOR_PALETTE = [
    { id: "rojo",      name: "Rojo Cardenal",      hex: "#EF233C", rgb: [239, 35, 60] },
    { id: "amarillo",  name: "Amarillo Benteveo",  hex: "#FFD60A", rgb: [255, 214, 10] },
    { id: "dorado",    name: "Dorado Solar",       hex: "#F59E0B", rgb: [245, 158, 11] },
    { id: "naranja",   name: "Naranja Hornero",    hex: "#EA580C", rgb: [234, 88, 12] },
    { id: "verde",     name: "Verde Cotorra",      hex: "#2ECC71", rgb: [46, 204, 113] },
    { id: "esmeralda", name: "Esmeralda Picaflor", hex: "#06D6A0", rgb: [6, 214, 160] },
    { id: "celeste",   name: "Celeste",            hex: "#38BDF8", rgb: [56, 189, 248] },
    { id: "azul",      name: "Azul Cielo",         hex: "#2563EB", rgb: [37, 99, 235] },
    { id: "violeta",   name: "Violeta Tordo",      hex: "#6D28D9", rgb: [109, 40, 217] },
    { id: "rosa",      name: "Rosa Torcaza",       hex: "#F472B6", rgb: [244, 114, 182] },
    { id: "marron",    name: "Marrón Ñacurutú",    hex: "#8B5A2B", rgb: [139, 90, 43] },
    { id: "gris",      name: "Gris Calandria",     hex: "#94A3B8", rgb: [148, 163, 184] },
    { id: "blanco",    name: "Blanco",             hex: "#FFFFFF", rgb: [255, 255, 255] },
    { id: "negro",     name: "Negro",              hex: "#1E293B", rgb: [30, 41, 59] }
  ];

  // Colores reales guía (⭐) por especie para orientar a niños pequeños
  const BIRD_REAL_COLORS = {
    hornero:    ["marron", "naranja", "blanco", "gris"],
    tero:       ["gris", "negro", "blanco", "rojo"],
    benteveo:   ["amarillo", "negro", "blanco", "marron"],
    cotorra:    ["verde", "esmeralda", "gris", "amarillo"],
    cardenal:   ["rojo", "gris", "blanco", "negro"],
    zorzal:     ["naranja", "marron", "dorado", "gris"],
    chingolo:   ["marron", "naranja", "gris", "blanco"],
    gaviota:    ["blanco", "negro", "amarillo", "rojo"],
    tordo:      ["violeta", "negro", "azul"],
    carpintero: ["amarillo", "rojo", "negro", "blanco"],
    dorado:     ["amarillo", "dorado", "naranja"],
    nacurutu:   ["marron", "dorado", "blanco", "negro"],
    torcaza:    ["rosa", "gris", "marron", "blanco"],
    calandria:  ["gris", "blanco", "marron", "negro"],
    picaflor:   ["esmeralda", "verde", "rojo", "dorado"]
  };

  // Respaldo de las 15 aves por si el script se carga antes que BIRDS
  const FALLBACK_BIRDS = {
    hornero:    { id: "hornero",    name: "Hornero",          reposo: "assets_mobile/hornero_reposo_trans.webp?v=20",    audioSrc: "audio/canto_hornero.mp3" },
    tero:       { id: "tero",       name: "Tero",             reposo: "assets_mobile/tero_reposo_trans.webp?v=20",       audioSrc: "audio/canto_tero.mp3" },
    benteveo:   { id: "benteveo",   name: "Benteveo",         reposo: "assets_mobile/benteveo_reposo_trans.webp?v=20",   audioSrc: "audio/canto_benteveo.mp3" },
    cotorra:    { id: "cotorra",    name: "Cotorra",          reposo: "assets_mobile/cotorra_reposo_trans.webp?v=20",    audioSrc: "audio/canto_cotorra.mp3" },
    cardenal:   { id: "cardenal",   name: "Cardenal",         reposo: "assets_mobile/cardenal_reposo_trans.webp?v=20",   audioSrc: "audio/canto_cardenal.mp3" },
    zorzal:     { id: "zorzal",     name: "Zorzal Colorado",  reposo: "assets_mobile/zorzal_reposo_trans.webp?v=20",     audioSrc: "audio/canto_zorzal_colorado.mp3" },
    chingolo:   { id: "chingolo",   name: "Chingolo",         reposo: "assets_mobile/chingolo_reposo_trans.webp?v=20",   audioSrc: "audio/canto_chingolo.mp3" },
    gaviota:    { id: "gaviota",    name: "Gaviota Cocinera", reposo: "assets_mobile/gaviota_reposo_trans.webp?v=20",    audioSrc: "audio/canto_gaviota.mp3" },
    tordo:      { id: "tordo",      name: "Tordo Renegrido",  reposo: "assets_mobile/tordo_reposo_trans.webp?v=25",      audioSrc: "audio/canto_tordo.mp3" },
    carpintero: { id: "carpintero", name: "Carpintero",       reposo: "assets_mobile/carpintero_reposo_trans.webp?v=25", audioSrc: "audio/canto_carpintero.mp3" },
    dorado:     { id: "dorado",     name: "Dorado",           reposo: "assets_mobile/dorado_reposo_trans.webp?v=25",     audioSrc: "audio/canto_dorado.mp3" },
    nacurutu:   { id: "nacurutu",   name: "Ñacurutú",         reposo: "assets_mobile/nacurutu_reposo_trans.webp?v=25",   audioSrc: "audio/canto_nacurutu.mp3" },
    torcaza:    { id: "torcaza",    name: "Torcaza",          reposo: "assets_mobile/torcaza_reposo_trans.webp?v=25",    audioSrc: "audio/canto_torcaza.mp3" },
    calandria:  { id: "calandria",  name: "Calandria",        reposo: "assets_mobile/calandria_reposo_trans.webp?v=25",  audioSrc: "audio/canto_calandria.mp3" },
    picaflor:   { id: "picaflor",   name: "Picaflor",         reposo: "assets_mobile/picaflor_reposo_trans.webp?v=25",   audioSrc: "audio/canto_picaflor.mp3" }
  };

  function getBirdsMap() {
    if (typeof BIRDS !== "undefined" && BIRDS) {
      if (!window.BIRDS) window.BIRDS = BIRDS;
      return BIRDS;
    }
    if (window.BIRDS) return window.BIRDS;
    return FALLBACK_BIRDS;
  }

  function getOriginalSpriteUrl(birdId) {
    const birds = getBirdsMap();
    const b = birds[birdId] || FALLBACK_BIRDS[birdId];
    if (!b) return `assets_mobile/${birdId}_reposo_trans.webp`;
    if (!b._origReposo) {
      b._origReposo = b.reposo || `assets_mobile/${birdId}_reposo_trans.webp`;
    }
    return b._origReposo;
  }

  // Estado del Taller de Pintura
  let currentBirdId = "hornero";
  let currentTool = "brush"; // "brush" | "crayon" | "bucket" | "rainbow" | "eraser"
  let currentColor = COLOR_PALETTE[3]; // Naranja Hornero por defecto
  let rainbowHue = 0;
  let isDrawing = false;
  let lastPt = null;
  let undoStack = [];
  let previewSongTimer = null;

  // Caché de plantillas de contorno y pinturas guardadas en sesión por ave
  const templateCache = {};
  const savedPaintings = {};
  const paintedBirdsSet = new Set();

  // Canvases internos de trabajo
  let displayCanvas = null;
  let displayCtx = null;

  const bgFrameCanvas = document.createElement("canvas");
  bgFrameCanvas.width = CW;
  bgFrameCanvas.height = CH;
  const bgFrameCtx = bgFrameCanvas.getContext("2d");

  const paintCanvas = document.createElement("canvas");
  paintCanvas.width = CW;
  paintCanvas.height = CH;
  const paintCtx = paintCanvas.getContext("2d", { willReadFrequently: true });

  const lineOverlayCanvas = document.createElement("canvas");
  lineOverlayCanvas.width = CW;
  lineOverlayCanvas.height = CH;
  const lineOverlayCtx = lineOverlayCanvas.getContext("2d");

  // Máscaras activas del ave actual
  let activeSilhouetteMask = new Uint8Array(CW * CH);
  let activeLineStrength = new Uint8Array(CW * CH);
  let activeSpriteTransform = {
    origW: 400,
    origH: 400,
    drawX: 60,
    drawY: 60,
    drawW: 480,
    drawH: 480
  };

  /* =========================================================================
     SONIDOS SINTÉTICOS ALEGRES (WEBAUDIO)
     ========================================================================= */
  function getAudioCtx() {
    if (typeof getSharedAudioCtx === "function") {
      return getSharedAudioCtx();
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!window._cgAudioCtx || window._cgAudioCtx.state === "closed") {
      window._cgAudioCtx = new AudioCtx();
    }
    if (window._cgAudioCtx.state === "suspended") {
      window._cgAudioCtx.resume().catch(() => {});
    }
    return window._cgAudioCtx;
  }

  function playPopTone(freq = 580, duration = 0.14, type = "sine") {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + duration);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch (e) {}
  }

  function playBucketSplashSound() {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, now + idx * 0.045);
        gain.gain.setValueAtTime(0.2, now + idx * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.045 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.045);
        osc.stop(now + idx * 0.045 + 0.2);
      });
    } catch (e) {}
  }

  function playFanfareSound() {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Melodía triunfal infantil: Do - Mi - Sol - Do alto!
      const melody = [
        { f: 523.25, t: 0.0,  d: 0.14 },
        { f: 659.25, t: 0.13, d: 0.14 },
        { f: 783.99, t: 0.26, d: 0.16 },
        { f: 1046.5, t: 0.42, d: 0.45 }
      ];
      melody.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.25, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d + 0.02);
      });
    } catch (e) {}
  }

  /* =========================================================================
     INYECCIÓN DE ESTILOS CSS Y ESTRUCTURA DOM (#coloring-modal)
     ========================================================================= */
  function injectStyles() {
    if (document.getElementById("coloring-game-styles")) return;
    const style = document.createElement("style");
    style.id = "coloring-game-styles";
    style.textContent = `
      #coloring-modal {
        position: fixed;
        inset: 0;
        z-index: 320;
        background: rgba(12, 20, 35, 0.92);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        display: none;
        align-items: center;
        justify-content: center;
        padding: max(8px, env(safe-area-inset-top)) 10px max(8px, env(safe-area-inset-bottom)) 10px;
        opacity: 0;
        transition: opacity 0.25s ease;
        user-select: none;
        -webkit-user-select: none;
        touch-action: none;
      }

      #coloring-modal.open {
        display: flex;
        opacity: 1;
      }

      .cg-workshop {
        background: linear-gradient(180deg, #fff9db 0%, #fffdf5 100%);
        border: 4px solid #ffd166;
        border-radius: 26px;
        width: 100%;
        max-width: 1060px;
        height: 100%;
        max-height: 95dvh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 22px 60px rgba(0, 0, 0, 0.65);
        position: relative;
        color: #1e293b;
      }

      /* Cabecera Superior */
      .cg-header {
        background: linear-gradient(90deg, #ff6b6b 0%, #ff8e53 50%, #feca57 100%);
        padding: 8px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        border-bottom: 3px solid #f59e0b;
        flex-shrink: 0;
      }

      .cg-header-title {
        font-family: 'Fredoka One', cursive;
        font-size: clamp(0.95rem, 2.8vw, 1.35rem);
        color: #ffffff;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
      }

      .cg-header-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: nowrap;
      }

      .cg-hdr-btn {
        border: 2.5px solid #ffffff;
        border-radius: 40px;
        padding: 6px 13px;
        font-family: 'Fredoka One', cursive;
        font-size: clamp(0.75rem, 2.2vw, 0.92rem);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        transition: transform 0.15s ease, filter 0.15s ease;
        white-space: nowrap;
      }

      .cg-hdr-btn:active {
        transform: scale(0.92);
      }

      .cg-btn-sing {
        background: #0284c7;
        color: #ffffff;
      }

      .cg-btn-finish {
        background: #10b981;
        color: #ffffff;
        animation: cgPulseBtn 2.2s infinite ease-in-out;
      }

      @keyframes cgPulseBtn {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      .cg-btn-close {
        background: #ef4444;
        color: #ffffff;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        padding: 0;
        justify-content: center;
        font-size: 1.15rem;
      }

      /* Carrusel Horizontal de las 15 Aves */
      .cg-carousel-wrap {
        background: #fef3c7;
        border-bottom: 2px solid #fde68a;
        padding: 6px 8px;
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
      }

      .cg-carousel-nav {
        background: #ffffff;
        border: 2px solid #f59e0b;
        color: #d97706;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        font-weight: 900;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        box-shadow: 0 2px 6px rgba(0,0,0,0.12);
      }

      .cg-bird-strip {
        display: flex;
        align-items: center;
        gap: 8px;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-behavior: smooth;
        padding: 2px 4px;
        flex: 1;
        touch-action: pan-x !important;
        scrollbar-width: none;
      }
      .cg-bird-strip::-webkit-scrollbar {
        display: none;
      }

      .cg-bird-pill {
        background: #ffffff;
        border: 2.5px solid #e2e8f0;
        border-radius: 30px;
        padding: 4px 11px 4px 6px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        flex-shrink: 0;
        transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
        position: relative;
        touch-action: pan-x !important;
      }

      .cg-bird-pill.active {
        background: #fffbeb;
        border-color: #f59e0b;
        transform: scale(1.06);
        box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);
      }

      .cg-bird-pill img {
        width: 30px;
        height: 30px;
        object-fit: contain;
        pointer-events: none;
      }

      .cg-bird-pill span {
        font-family: 'Fredoka One', cursive;
        font-size: 0.78rem;
        color: #334155;
        white-space: nowrap;
      }

      .cg-bird-pill .cg-done-dot {
        font-size: 0.72rem;
        margin-left: 2px;
      }

      /* Área Central de Trabajo (Herramientas + Lienzo + Paleta) */
      .cg-workspace {
        flex: 1;
        min-height: 0;
        display: grid;
        grid-template-columns: 120px 1fr;
        grid-template-rows: 1fr auto;
        gap: 8px;
        padding: 8px 12px;
        overflow: hidden;
      }

      /* Barra de Herramientas Táctiles para 3+ Años */
      .cg-tools-bar {
        grid-column: 1;
        grid-row: 1 / 3;
        display: flex;
        flex-direction: column;
        gap: 6px;
        overflow-y: auto;
        padding-right: 2px;
        scrollbar-width: none;
      }
      .cg-tools-bar::-webkit-scrollbar {
        display: none;
      }

      .cg-tool-btn {
        background: #ffffff;
        border: 3px solid #cbd5e1;
        border-radius: 18px;
        padding: 7px 6px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
        cursor: pointer;
        font-family: 'Fredoka One', cursive;
        font-size: 0.74rem;
        color: #334155;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
        transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
        flex: 1;
        min-height: 46px;
      }

      .cg-tool-btn .cg-tool-emoji {
        font-size: 1.35rem;
        line-height: 1;
      }

      .cg-tool-btn.active {
        background: #e0f2fe;
        border-color: #0284c7;
        color: #0369a1;
        transform: scale(1.04);
        box-shadow: 0 5px 14px rgba(2, 132, 199, 0.28);
      }

      .cg-tool-btn[data-tool="rainbow"].active {
        background: linear-gradient(135deg, #fce7f3, #e0e7ff, #dcfce7, #fef9c3);
        border-color: #ec4899;
        color: #be185d;
      }

      .cg-tool-btn:active {
        transform: scale(0.93);
      }

      /* Escenario del Lienzo */
      .cg-stage-wrap {
        grid-column: 2;
        grid-row: 1;
        position: relative;
        background: #e2e8f0;
        border-radius: 22px;
        border: 3px solid #cbd5e1;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        min-height: 0;
        box-shadow: inset 0 3px 10px rgba(0,0,0,0.1);
      }

      #cg-display-canvas {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        aspect-ratio: 1 / 1;
        border-radius: 16px;
        background: #ffffff;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.18);
        cursor: crosshair;
        touch-action: none;
      }

      /* Mini-Modelo de Referencia en la Esquina */
      .cg-ref-card {
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(255, 255, 255, 0.95);
        border: 3px solid #f59e0b;
        border-radius: 18px;
        padding: 5px 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        z-index: 15;
        transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      .cg-ref-card:hover,
      .cg-ref-card.zoomed {
        transform: scale(1.38);
        transform-origin: top left;
      }

      .cg-ref-card img {
        width: clamp(48px, 8vw, 72px);
        height: clamp(48px, 8vw, 72px);
        object-fit: contain;
        pointer-events: none;
      }

      .cg-ref-card span {
        font-family: 'Fredoka One', cursive;
        font-size: 0.64rem;
        color: #b45309;
        margin-top: 2px;
      }

      /* Indicador flotante de "No salirse de la raya" */
      .cg-magic-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 255, 255, 0.92);
        border: 2px solid #10b981;
        color: #047857;
        font-family: 'Fredoka One', cursive;
        font-size: 0.7rem;
        padding: 4px 10px;
        border-radius: 20px;
        pointer-events: none;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
      }

      /* Paleta de 14 Colores con Guía ⭐ */
      .cg-palette-bar {
        grid-column: 2;
        grid-row: 2;
        background: #ffffff;
        border: 2.5px solid #e2e8f0;
        border-radius: 20px;
        padding: 8px 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        flex-wrap: wrap;
        box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      }

      .cg-swatch {
        width: clamp(34px, 4.8vw, 44px);
        height: clamp(34px, 4.8vw, 44px);
        border-radius: 50%;
        border: 3px solid rgba(0, 0, 0, 0.2);
        cursor: pointer;
        position: relative;
        transition: transform 0.16s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.16s ease;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.18);
        flex-shrink: 0;
      }

      .cg-swatch.active {
        transform: scale(1.22) translateY(-3px);
        border: 3.5px solid #1e293b;
        box-shadow: 0 0 0 3px #ffffff, 0 6px 14px rgba(0, 0, 0, 0.35);
        z-index: 5;
      }

      .cg-swatch-star {
        position: absolute;
        top: -8px;
        right: -6px;
        font-size: 0.85rem;
        line-height: 1;
        filter: drop-shadow(0 1px 3px rgba(0,0,0,0.45));
        animation: cgStarBounce 0.9s infinite alternate ease-in-out;
        pointer-events: none;
      }

      @keyframes cgStarBounce {
        0% { transform: translateY(0) scale(0.95); }
        100% { transform: translateY(-4px) scale(1.15); }
      }

      /* Superposición de Celebración (🎉 ¡Terminé!) */
      .cg-celebration-overlay {
        position: absolute;
        inset: 0;
        background: rgba(15, 23, 42, 0.86);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 50;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }

      .cg-celebration-overlay.open {
        display: flex;
      }

      .cg-celebration-card {
        background: linear-gradient(180deg, #ffffff 0%, #fef9c3 100%);
        border: 5px solid #f59e0b;
        border-radius: 28px;
        padding: 22px 20px;
        max-width: 460px;
        width: 100%;
        text-align: center;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
        animation: cgPopIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      @keyframes cgPopIn {
        0% { transform: scale(0.6); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }

      .cg-celebration-card h3 {
        font-family: 'Fredoka One', cursive;
        font-size: clamp(1.3rem, 4vw, 1.75rem);
        color: #d97706;
        margin-bottom: 10px;
      }

      .cg-celebration-preview {
        width: 170px;
        height: 170px;
        object-fit: contain;
        border-radius: 20px;
        border: 4px solid #fbbf24;
        background: #ffffff;
        margin: 0 auto 14px auto;
        display: block;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
      }

      .cg-celebration-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .cg-cel-btn {
        border: none;
        border-radius: 30px;
        padding: 12px 18px;
        font-family: 'Fredoka One', cursive;
        font-size: 0.98rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        transition: transform 0.15s ease;
      }

      .cg-cel-btn:active {
        transform: scale(0.95);
      }

      .cg-cel-landscape {
        background: linear-gradient(90deg, #10b981, #059669);
        color: #ffffff;
        border: 2.5px solid #a7f3d0;
      }

      .cg-cel-download {
        background: linear-gradient(90deg, #0284c7, #2563eb);
        color: #ffffff;
        border: 2.5px solid #bae6fd;
      }

      .cg-cel-back {
        background: #f1f5f9;
        color: #334155;
        border: 2px solid #cbd5e1;
      }

      /* Partículas de Confeti */
      .cg-confetti {
        position: absolute;
        width: 12px;
        height: 12px;
        border-radius: 3px;
        pointer-events: none;
        z-index: 60;
        animation: cgConfettiFall 1.8s ease-out forwards;
      }

      @keyframes cgConfettiFall {
        0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
        100% { transform: translate(var(--dx, 40px), var(--dy, 260px)) rotate(var(--rot, 520deg)) scale(0.5); opacity: 0; }
      }

      /* Adaptación Responsiva para Móviles en Vertical */
      @media (max-width: 720px) {
        .cg-workspace {
          grid-template-columns: 1fr;
          grid-template-rows: auto 1fr auto;
          padding: 6px 8px;
          gap: 6px;
        }
        .cg-tools-bar {
          grid-column: 1;
          grid-row: 1;
          flex-direction: row;
          overflow-x: auto;
          overflow-y: hidden;
          padding-bottom: 2px;
          touch-action: pan-x !important;
        }
        .cg-tool-btn {
          min-width: 68px;
          min-height: 48px;
          padding: 5px 8px;
          flex-shrink: 0;
          touch-action: pan-x !important;
        }
        .cg-stage-wrap {
          grid-column: 1;
          grid-row: 2;
        }
        .cg-palette-bar {
          grid-column: 1;
          grid-row: 3;
          padding: 6px 6px;
          gap: 6px;
        }
        .cg-swatch {
          width: 33px;
          height: 33px;
        }
        .cg-header-title span.cg-title-sub {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function injectModalDOM() {
    if (document.getElementById("coloring-modal")) return;

    const modal = document.createElement("div");
    modal.id = "coloring-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Taller de Pintura para Niños");

    modal.innerHTML = `
      <div class="cg-workshop" id="cg-workshop">
        <!-- Cabecera -->
        <div class="cg-header">
          <div class="cg-header-title">
            <span>🎨</span>
            <span class="cg-title-sub">Taller:</span>
            <span id="cg-current-bird-title">Hornero</span>
          </div>
          <div class="cg-header-actions">
            <button type="button" class="cg-hdr-btn cg-btn-sing" id="cg-btn-sing" title="Escuchar el canto real">
              <span>🔊</span>
              <span>Escuchar Canto</span>
            </button>
            <button type="button" class="cg-hdr-btn cg-btn-finish" id="cg-btn-finish" title="¡Terminé de pintar!">
              <span>🎉</span>
              <span>¡Terminé!</span>
            </button>
            <button type="button" class="cg-hdr-btn cg-btn-close" id="cg-btn-close" aria-label="Cerrar Taller">✕</button>
          </div>
        </div>

        <!-- Carrusel Selector de las 15 Aves -->
        <div class="cg-carousel-wrap">
          <button type="button" class="cg-carousel-nav" id="cg-strip-prev" aria-label="Anterior">◀</button>
          <div class="cg-bird-strip" id="cg-bird-strip"></div>
          <button type="button" class="cg-carousel-nav" id="cg-strip-next" aria-label="Siguiente">▶</button>
        </div>

        <!-- Área Principal -->
        <div class="cg-workspace">
          <!-- Herramientas para niños 3+ -->
          <div class="cg-tools-bar" id="cg-tools-bar">
            <button type="button" class="cg-tool-btn active" data-tool="brush">
              <span class="cg-tool-emoji">🖌️</span>
              <span>Pincel</span>
            </button>
            <button type="button" class="cg-tool-btn" data-tool="crayon">
              <span class="cg-tool-emoji">🖍️</span>
              <span>Crayón Grueso</span>
            </button>
            <button type="button" class="cg-tool-btn" data-tool="bucket">
              <span class="cg-tool-emoji">🪣</span>
              <span>Pintar Zona</span>
            </button>
            <button type="button" class="cg-tool-btn" data-tool="rainbow">
              <span class="cg-tool-emoji">🌈</span>
              <span>Arcoíris</span>
            </button>
            <button type="button" class="cg-tool-btn" data-tool="eraser">
              <span class="cg-tool-emoji">🧽</span>
              <span>Goma</span>
            </button>
            <button type="button" class="cg-tool-btn" id="cg-btn-undo">
              <span class="cg-tool-emoji">↩️</span>
              <span>Deshacer</span>
            </button>
            <button type="button" class="cg-tool-btn" id="cg-btn-clear">
              <span class="cg-tool-emoji">🗑️</span>
              <span>Borrar Todo</span>
            </button>
          </div>

          <!-- Lienzo con Mini-Modelo de Referencia -->
          <div class="cg-stage-wrap" id="cg-stage-wrap">
            <div class="cg-ref-card" id="cg-ref-card" title="Toca para ver más grande el modelo real">
              <img id="cg-ref-img" src="assets_mobile/hornero_reposo_trans.webp?v=20" alt="Modelo de referencia">
              <span>⭐ Modelo Real</span>
            </div>
            <div class="cg-magic-badge" id="cg-magic-badge">✨ No se sale de la raya</div>
            <canvas id="cg-display-canvas" width="600" height="600"></canvas>
          </div>

          <!-- Paleta de 14 Colores -->
          <div class="cg-palette-bar" id="cg-palette-bar"></div>
        </div>

        <!-- Superposición de Celebración (🎉 ¡Terminé!) -->
        <div class="cg-celebration-overlay" id="cg-celebration-overlay">
          <div class="cg-celebration-card">
            <h3 id="cg-celebration-title">¡Qué lindo te quedó el Hornero! 🎉</h3>
            <img id="cg-celebration-img" class="cg-celebration-preview" alt="Tu pájaro pintado">
            <div class="cg-celebration-actions">
              <button type="button" class="cg-cel-btn cg-cel-landscape" id="cg-btn-use-in-landscape">
                <span>✨</span>
                <span>Usar mi Pájaro Pintado en el Paisaje</span>
              </button>
              <button type="button" class="cg-cel-btn cg-cel-download" id="cg-btn-save-png">
                <span>💾</span>
                <span>Guardar Dibujo (PNG)</span>
              </button>
              <button type="button" class="cg-cel-btn cg-cel-back" id="cg-btn-keep-painting">
                <span>🎨</span>
                <span>Seguir Pintando</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Bloquear propagación de eventos al mapa panorámico de fondo
    const stopProp = (e) => {
      e.stopPropagation();
    };
    ["pointerdown", "pointermove", "pointerup", "wheel", "touchstart", "touchmove", "touchend", "dblclick"].forEach(evt => {
      modal.addEventListener(evt, stopProp, { passive: false });
    });

    // Integrar con window.isInsideModal si existe
    if (typeof window.isInsideModal === "function" && !window.isInsideModal._cgWrapped) {
      const origIsInside = window.isInsideModal;
      const wrapped = function (target) {
        if (target && target.closest && target.closest("#coloring-modal")) return true;
        return origIsInside(target);
      };
      wrapped._cgWrapped = true;
      window.isInsideModal = wrapped;
    }

    setupUIListeners();
  }

  /* =========================================================================
     GENERADOR AUTOMÁTICO DE LIBRO DE COLOREAR (SOBEL + LAPLACIANO + SILUETA)
     ========================================================================= */
  function drawBackgroundStickerFrame(ctx, silhouetteMask) {
    ctx.clearRect(0, 0, CW, CH);

    // 1. Cielo suave pastel de Pinamar
    const skyGrad = ctx.createLinearGradient(0, 0, 0, CH);
    skyGrad.addColorStop(0, "#dbf0ff");
    skyGrad.addColorStop(0.72, "#f6fbff");
    skyGrad.addColorStop(0.73, "#def7e5");
    skyGrad.addColorStop(1, "#c7f0d2");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CW, CH);

    // 2. Nubes decorativas suaves
    ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
    const drawCloud = (cx, cy, r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.arc(cx + r * 0.75, cy + r * 0.1, r * 0.78, 0, Math.PI * 2);
      ctx.arc(cx - r * 0.75, cy + r * 0.15, r * 0.72, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCloud(110, 88, 28);
    drawCloud(485, 76, 24);

    // 3. Halo blanco tipo sticker alrededor del ave para resaltar la silueta
    const stickerImg = ctx.getImageData(0, 0, CW, CH);
    const sData = stickerImg.data;
    const radius = 7;
    for (let y = radius; y < CH - radius; y++) {
      const rowOff = y * CW;
      for (let x = radius; x < CW - radius; x++) {
        const idx = rowOff + x;
        if (silhouetteMask[idx]) continue;
        // Comprobar si está cerca de la silueta
        if (
          silhouetteMask[idx - radius] ||
          silhouetteMask[idx + radius] ||
          silhouetteMask[idx - radius * CW] ||
          silhouetteMask[idx + radius * CW] ||
          silhouetteMask[idx - 4 - 4 * CW] ||
          silhouetteMask[idx + 4 - 4 * CW] ||
          silhouetteMask[idx - 4 + 4 * CW] ||
          silhouetteMask[idx + 4 + 4 * CW]
        ) {
          const p = idx * 4;
          sData[p] = 255;
          sData[p + 1] = 255;
          sData[p + 2] = 255;
          sData[p + 3] = 255;
        }
      }
    }
    ctx.putImageData(stickerImg, 0, 0);

    // 4. Marco redondeado decorativo
    ctx.strokeStyle = "#bae6fd";
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, CW - 10, CH - 10);
  }

  function extractColoringTemplateFromImage(img) {
    const sw = img.naturalWidth || img.width || 400;
    const sh = img.naturalHeight || img.height || 400;

    // 1. Detectar caja delimitadora de píxeles opacos en el sprite original
    const rawCanvas = document.createElement("canvas");
    rawCanvas.width = sw;
    rawCanvas.height = sh;
    const rawCtx = rawCanvas.getContext("2d");
    rawCtx.drawImage(img, 0, 0);
    const rawData = rawCtx.getImageData(0, 0, sw, sh).data;

    let minX = sw, minY = sh, maxX = 0, maxY = 0;
    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const a = rawData[(y * sw + x) * 4 + 3];
        if (a > 35) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX <= minX || maxY <= minY) {
      minX = 0; minY = 0; maxX = sw - 1; maxY = sh - 1;
    }

    const contentW = Math.max(1, maxX - minX + 1);
    const contentH = Math.max(1, maxY - minY + 1);
    const targetBox = CW * 0.78;
    const scale = Math.min(targetBox / contentW, targetBox / contentH);

    const drawW = sw * scale;
    const drawH = sh * scale;
    const drawX = (CW - contentW * scale) / 2 - minX * scale;
    const drawY = (CH - contentH * scale) / 2 - minY * scale;

    const srcCanvas = document.createElement("canvas");
    srcCanvas.width = CW;
    srcCanvas.height = CH;
    const srcCtx = srcCanvas.getContext("2d");
    srcCtx.drawImage(img, drawX, drawY, drawW, drawH);

    const srcPixels = srcCtx.getImageData(0, 0, CW, CH).data;
    const total = CW * CH;

    // 2. Construir máscara estricta de silueta (alpha > 35)
    const rawMask = new Uint8Array(total);
    for (let i = 0; i < total; i++) {
      rawMask[i] = srcPixels[i * 4 + 3] > 35 ? 1 : 0;
    }

    // Cierre morfológico de 1px para eliminar micro-agujeros internos
    const dilated = new Uint8Array(total);
    for (let y = 1; y < CH - 1; y++) {
      const row = y * CW;
      for (let x = 1; x < CW - 1; x++) {
        const i = row + x;
        dilated[i] = (
          rawMask[i] |
          rawMask[i - 1] | rawMask[i + 1] |
          rawMask[i - CW] | rawMask[i + CW]
        );
      }
    }
    const silhouetteMask = new Uint8Array(total);
    for (let y = 1; y < CH - 1; y++) {
      const row = y * CW;
      for (let x = 1; x < CW - 1; x++) {
        const i = row + x;
        silhouetteMask[i] = (
          dilated[i] &
          dilated[i - 1] & dilated[i + 1] &
          dilated[i - CW] & dilated[i + CW]
        );
      }
    }

    // 3. Canales de luminancia y crominancia suavizados para detección de bordes
    const lum = new Float32Array(total);
    const cr = new Float32Array(total);
    const cb = new Float32Array(total);

    for (let i = 0; i < total; i++) {
      const p = i * 4;
      const r = srcPixels[p];
      const g = srcPixels[p + 1];
      const b = srcPixels[p + 2];
      lum[i] = 0.299 * r + 0.587 * g + 0.114 * b;
      cr[i] = r - g;
      cb[i] = b - 0.5 * (r + g);
    }

    // Suavizado 3x3 dentro de la silueta para evitar ruido de textura
    const sLum = new Float32Array(total);
    const sCr = new Float32Array(total);
    const sCb = new Float32Array(total);

    for (let y = 1; y < CH - 1; y++) {
      const row = y * CW;
      for (let x = 1; x < CW - 1; x++) {
        const i = row + x;
        if (!silhouetteMask[i]) continue;
        let sumL = 0, sumR = 0, sumB = 0, cnt = 0;
        for (let dy = -1; dy <= 1; dy++) {
          const r2 = (y + dy) * CW + x;
          for (let dx = -1; dx <= 1; dx++) {
            const ni = r2 + dx;
            if (silhouetteMask[ni]) {
              const w = (dx === 0 && dy === 0) ? 4 : (dx === 0 || dy === 0 ? 2 : 1);
              sumL += lum[ni] * w;
              sumR += cr[ni] * w;
              sumB += cb[ni] * w;
              cnt += w;
            }
          }
        }
        if (cnt > 0) {
          sLum[i] = sumL / cnt;
          sCr[i] = sumR / cnt;
          sCb[i] = sumB / cnt;
        }
      }
    }

    // 4. Sobel + Laplaciano + Borde Exterior de Libro de Colorear
    const lineStrength = new Uint8Array(total);

    for (let y = 3; y < CH - 3; y++) {
      const row = y * CW;
      for (let x = 3; x < CW - 3; x++) {
        const i = row + x;
        if (!silhouetteMask[i]) continue;

        // A. ¿Es borde exterior de la silueta (grosor 3px)?
        if (
          !silhouetteMask[i - 1] || !silhouetteMask[i + 1] ||
          !silhouetteMask[i - CW] || !silhouetteMask[i + CW] ||
          !silhouetteMask[i - 2] || !silhouetteMask[i + 2] ||
          !silhouetteMask[i - 2 * CW] || !silhouetteMask[i + 2 * CW] ||
          !silhouetteMask[i - 3] || !silhouetteMask[i + 3] ||
          !silhouetteMask[i - 3 * CW] || !silhouetteMask[i + 3 * CW] ||
          !silhouetteMask[i - 2 - 2 * CW] || !silhouetteMask[i + 2 - 2 * CW] ||
          !silhouetteMask[i - 2 + 2 * CW] || !silhouetteMask[i + 2 + 2 * CW]
        ) {
          lineStrength[i] = 255;
          continue;
        }

        // B. Gradiente Sobel 3x3 en Luminancia y Color
        const tl = i - CW - 1, tc = i - CW, tr = i - CW + 1;
        const ml = i - 1,                  mr = i + 1;
        const bl = i + CW - 1, bc = i + CW, br = i + CW + 1;

        const gxL = -sLum[tl] + sLum[tr] - 2 * sLum[ml] + 2 * sLum[mr] - sLum[bl] + sLum[br];
        const gyL = -sLum[tl] - 2 * sLum[tc] - sLum[tr] + sLum[bl] + 2 * sLum[bc] + sLum[br];
        const magL = Math.hypot(gxL, gyL) * 0.28;

        const gxC = -sCr[tl] + sCr[tr] - 2 * sCr[ml] + 2 * sCr[mr] - sCr[bl] + sCr[br];
        const gyC = -sCr[tl] - 2 * sCr[tc] - sCr[tr] + sCr[bl] + 2 * sCr[bc] + sCr[br];
        const magC = Math.hypot(gxC, gyC) * 0.16;

        const gxB = -sCb[tl] + sCb[tr] - 2 * sCb[ml] + 2 * sCb[mr] - sCb[bl] + sCb[br];
        const gyB = -sCb[tl] - 2 * sCb[tc] - sCb[tr] + sCb[bl] + 2 * sCb[bc] + sCb[br];
        const magB = Math.hypot(gxB, gyB) * 0.16;

        // C. Laplaciano local (diferencia respecto al promedio a radio 2px) para ojos, pico y plumas
        const ringAvg = (
          sLum[i - 2 * CW] + sLum[i + 2 * CW] +
          sLum[i - 2] + sLum[i + 2] +
          sLum[i - 2 * CW - 2] + sLum[i - 2 * CW + 2] +
          sLum[i + 2 * CW - 2] + sLum[i + 2 * CW + 2]
        ) * 0.125;
        const lapDark = Math.max(0, ringAvg - sLum[i]) * 2.4;

        // D. Preservar pupila/anillo ocular muy oscuro si tiene alto contraste
        const darkFeature = (sLum[i] < 32 && ringAvg > 42) ? 195 : 0;

        const combined = Math.max(magL + magC + magB + lapDark, darkFeature);

        if (combined > 30) {
          // Curva sigmoide hacia negro carbón nítido
          const norm = Math.min(255, Math.round((combined - 30) * 4.2));
          lineStrength[i] = norm > 55 ? Math.min(255, norm + 45) : 0;
        }
      }
    }

    // 5. Generar el canvas de líneas de contorno (carbón oscuro #1a202c con alfa proporcional)
    const overlayCan = document.createElement("canvas");
    overlayCan.width = CW;
    overlayCan.height = CH;
    const overlayCtx = overlayCan.getContext("2d");
    const overlayImg = overlayCtx.createImageData(CW, CH);
    const oData = overlayImg.data;

    for (let i = 0; i < total; i++) {
      const strength = lineStrength[i];
      if (strength > 0) {
        const p = i * 4;
        oData[p] = 24;     // R (#18202c)
        oData[p + 1] = 32; // G
        oData[p + 2] = 44; // B
        oData[p + 3] = strength;
      }
    }
    overlayCtx.putImageData(overlayImg, 0, 0);

    return {
      silhouetteMask,
      lineStrength,
      overlayCan,
      spriteTransform: {
        origW: sw,
        origH: sh,
        drawX,
        drawY,
        drawW,
        drawH
      }
    };
  }

  /* =========================================================================
     GESTIÓN DEL LIENZO, PINTURA CON CLIPPING DE SILUETA Y BALDE MÁGICO
     ========================================================================= */
  function resetPaintCanvasToWhite() {
    paintCtx.globalCompositeOperation = "source-over";
    paintCtx.clearRect(0, 0, CW, CH);
    const imgData = paintCtx.createImageData(CW, CH);
    const data = imgData.data;
    const total = CW * CH;
    for (let i = 0; i < total; i++) {
      if (activeSilhouetteMask[i]) {
        const p = i * 4;
        data[p] = 255;
        data[p + 1] = 255;
        data[p + 2] = 255;
        data[p + 3] = 255;
      }
    }
    paintCtx.putImageData(imgData, 0, 0);
  }

  function renderCompositeDisplay() {
    if (!displayCtx) return;
    displayCtx.clearRect(0, 0, CW, CH);
    displayCtx.drawImage(bgFrameCanvas, 0, 0);
    displayCtx.drawImage(paintCanvas, 0, 0);
    displayCtx.save();
    displayCtx.globalCompositeOperation = "multiply";
    displayCtx.drawImage(lineOverlayCanvas, 0, 0);
    displayCtx.restore();
    displayCtx.drawImage(lineOverlayCanvas, 0, 0);
  }

  function pushUndoState() {
    const snap = paintCtx.getImageData(0, 0, CW, CH);
    undoStack.push(snap);
    if (undoStack.length > MAX_UNDO) {
      undoStack.shift();
    }
  }

  function saveCurrentBirdPaintingState() {
    if (!currentBirdId) return;
    savedPaintings[currentBirdId] = paintCtx.getImageData(0, 0, CW, CH);
  }

  function loadBirdIntoWorkshop(birdId, playSound = true) {
    const birds = getBirdsMap();
    if (!birds[birdId]) birdId = "hornero";

    // Guardar pintura actual antes de cambiar de ave
    if (currentBirdId && templateCache[currentBirdId]) {
      saveCurrentBirdPaintingState();
    }

    currentBirdId = birdId;
    undoStack = [];

    const bird = birds[birdId];
    const titleEl = document.getElementById("cg-current-bird-title");
    if (titleEl) titleEl.textContent = bird.name;

    const refImg = document.getElementById("cg-ref-img");
    const spriteUrl = getOriginalSpriteUrl(birdId);
    if (refImg) refImg.src = spriteUrl;

    // Seleccionar automáticamente el primer color real sugerido para guiar al niño
    const recColors = BIRD_REAL_COLORS[birdId] || ["naranja", "amarillo", "rojo"];
    const firstRec = COLOR_PALETTE.find(c => c.id === recColors[0]);
    if (firstRec && currentTool !== "eraser" && currentTool !== "rainbow") {
      currentColor = firstRec;
    }

    renderBirdCarousel();
    renderColorPalette();

    if (playSound) {
      playPopTone(620, 0.14, "sine");
    }

    if (templateCache[birdId]) {
      applyCachedTemplate(birdId);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      templateCache[birdId] = extractColoringTemplateFromImage(img);
      if (currentBirdId === birdId) {
        applyCachedTemplate(birdId);
      }
    };
    img.onerror = () => {
      // Respaldo geométrico amigable si la imagen demorara
      const fallbackCan = document.createElement("canvas");
      fallbackCan.width = 400;
      fallbackCan.height = 400;
      const fCtx = fallbackCan.getContext("2d");
      fCtx.fillStyle = "#d97706";
      fCtx.beginPath();
      fCtx.arc(200, 200, 130, 0, Math.PI * 2);
      fCtx.fill();
      templateCache[birdId] = extractColoringTemplateFromImage(fallbackCan);
      if (currentBirdId === birdId) {
        applyCachedTemplate(birdId);
      }
    };
    img.src = spriteUrl;
  }

  function applyCachedTemplate(birdId) {
    const tpl = templateCache[birdId];
    if (!tpl) return;

    activeSilhouetteMask = tpl.silhouetteMask;
    activeLineStrength = tpl.lineStrength;
    activeSpriteTransform = tpl.spriteTransform;

    drawBackgroundStickerFrame(bgFrameCtx, activeSilhouetteMask);

    lineOverlayCtx.clearRect(0, 0, CW, CH);
    lineOverlayCtx.drawImage(tpl.overlayCan, 0, 0);

    if (savedPaintings[birdId]) {
      paintCtx.putImageData(savedPaintings[birdId], 0, 0);
    } else {
      resetPaintCanvasToWhite();
    }

    renderCompositeDisplay();
  }

  /* =========================================================================
     ALGORITMO DE BALDE MÁGICO (FLOOD FILL DE ZONA PARA NIÑOS 3+)
     ========================================================================= */
  function floodFillZone(startX, startY, fillRgb) {
    let sx = Math.round(startX);
    let sy = Math.round(startY);
    if (sx < 0 || sx >= CW || sy < 0 || sy >= CH) return false;

    let startIdx = sy * CW + sx;

    // Si el niño tocó apenas fuera del borde del pajarito, buscar el píxel interior más cercano (radio 24px)
    if (!activeSilhouetteMask[startIdx]) {
      let found = -1;
      for (let r = 1; r <= 24 && found === -1; r++) {
        for (let dy = -r; dy <= r; dy++) {
          const ny = sy + dy;
          if (ny < 0 || ny >= CH) continue;
          for (let dx = -r; dx <= r; dx++) {
            const nx = sx + dx;
            if (nx < 0 || nx >= CW) continue;
            const ni = ny * CW + nx;
            if (activeSilhouetteMask[ni] && activeLineStrength[ni] < 130) {
              found = ni;
              break;
            }
          }
          if (found !== -1) break;
        }
      }
      if (found === -1) return false;
      startIdx = found;
    }

    // Si tocó justo encima de una línea negra de contorno, mover al interior vecino más cercano
    if (activeLineStrength[startIdx] >= 135) {
      let clearNeighbor = -1;
      for (let r = 1; r <= 12 && clearNeighbor === -1; r++) {
        for (let dy = -r; dy <= r; dy++) {
          const ny = Math.floor(startIdx / CW) + dy;
          if (ny < 0 || ny >= CH) continue;
          for (let dx = -r; dx <= r; dx++) {
            const nx = (startIdx % CW) + dx;
            if (nx < 0 || nx >= CW) continue;
            const ni = ny * CW + nx;
            if (activeSilhouetteMask[ni] && activeLineStrength[ni] < 120) {
              clearNeighbor = ni;
              break;
            }
          }
          if (clearNeighbor !== -1) break;
        }
      }
      if (clearNeighbor !== -1) {
        startIdx = clearNeighbor;
      }
    }

    pushUndoState();

    const imgData = paintCtx.getImageData(0, 0, CW, CH);
    const data = imgData.data;
    const total = CW * CH;

    const sp = startIdx * 4;
    const targetR = data[sp];
    const targetG = data[sp + 1];
    const targetB = data[sp + 2];

    const [fillR, fillG, fillB] = fillRgb;
    const visited = new Uint8Array(total);
    const filledMask = new Uint8Array(total);
    const queue = new Int32Array(total);
    let qHead = 0;
    let qTail = 0;

    queue[qTail++] = startIdx;
    visited[startIdx] = 1;

    const colorTol = 58;
    const lineBarrier = 145;

    while (qHead < qTail) {
      const curr = queue[qHead++];
      filledMask[curr] = 1;

      const cx = curr % CW;
      const cy = (curr - cx) / CW;

      // 4 vecinos
      const neighbors = [
        cx > 0 ? curr - 1 : -1,
        cx < CW - 1 ? curr + 1 : -1,
        cy > 0 ? curr - CW : -1,
        cy < CH - 1 ? curr + CW : -1
      ];

      for (let k = 0; k < 4; k++) {
        const ni = neighbors[k];
        if (ni === -1 || visited[ni]) continue;
        visited[ni] = 1;

        if (!activeSilhouetteMask[ni]) continue;
        if (activeLineStrength[ni] >= lineBarrier) continue;

        const np = ni * 4;
        const dr = Math.abs(data[np] - targetR);
        const dg = Math.abs(data[np + 1] - targetG);
        const db = Math.abs(data[np + 2] - targetB);

        if (dr <= colorTol && dg <= colorTol && db <= colorTol) {
          queue[qTail++] = ni;
        }
      }
    }

    // Dilatar 1px hacia los bordes de las líneas para que no queden halos blancos junto al trazo negro
    for (let i = 0; i < qTail; i++) {
      const idx = queue[i];
      const cx = idx % CW;
      const cy = (idx - cx) / CW;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = cy + dy;
        if (ny < 0 || ny >= CH) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = cx + dx;
          if (nx < 0 || nx >= CW) continue;
          const ni = ny * CW + nx;
          if (activeSilhouetteMask[ni]) {
            filledMask[ni] = 1;
          }
        }
      }
    }

    // Si la zona encerrada era diminuta (< 90px), pintar también un círculo suave alrededor para que el niño siempre vea resultado
    if (qTail < 90) {
      const cx = startIdx % CW;
      const cy = (startIdx - cx) / CW;
      const fallbackR = 26;
      for (let dy = -fallbackR; dy <= fallbackR; dy++) {
        const ny = cy + dy;
        if (ny < 0 || ny >= CH) continue;
        for (let dx = -fallbackR; dx <= fallbackR; dx++) {
          if (dx * dx + dy * dy > fallbackR * fallbackR) continue;
          const nx = cx + dx;
          if (nx < 0 || nx >= CW) continue;
          const ni = ny * CW + nx;
          if (activeSilhouetteMask[ni]) {
            filledMask[ni] = 1;
          }
        }
      }
    }

    for (let i = 0; i < total; i++) {
      if (filledMask[i]) {
        const p = i * 4;
        data[p] = fillR;
        data[p + 1] = fillG;
        data[p + 2] = fillB;
        data[p + 3] = 255;
      }
    }

    paintCtx.putImageData(imgData, 0, 0);
    paintedBirdsSet.add(currentBirdId);
    renderCompositeDisplay();
    playBucketSplashSound();
    return true;
  }

  /* =========================================================================
     TRAZOS DE PINCEL, CRAYÓN GRUESO, ARCOÍRIS Y GOMA (NO SALIRSE DE LA RAYA)
     ========================================================================= */
  function getCanvasCoords(e) {
    const rect = displayCanvas.getBoundingClientRect();
    const clientX = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY;
    const scaleX = CW / Math.max(1, rect.width);
    const scaleY = CH / Math.max(1, rect.height);
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function getStrokeStyleAndWidth() {
    if (currentTool === "eraser") {
      return { color: "#FFFFFF", width: 34, alpha: 1.0 };
    }
    if (currentTool === "rainbow") {
      rainbowHue = (rainbowHue + 9) % 360;
      return { color: `hsl(${rainbowHue}, 95%, 54%)`, width: 28, alpha: 1.0 };
    }
    if (currentTool === "crayon") {
      return { color: currentColor.hex, width: 42, alpha: 0.92 };
    }
    // Pincel normal
    return { color: currentColor.hex, width: 20, alpha: 1.0 };
  }

  function drawStrokeSegment(fromPt, toPt) {
    const style = getStrokeStyleAndWidth();

    // source-atop garantiza que SOLO se pintan los píxeles donde paintCanvas tiene alpha=255 (la silueta del ave)
    paintCtx.save();
    paintCtx.globalCompositeOperation = "source-atop";
    paintCtx.lineCap = "round";
    paintCtx.lineJoin = "round";
    paintCtx.strokeStyle = style.color;
    paintCtx.fillStyle = style.color;
    paintCtx.lineWidth = style.width;
    paintCtx.globalAlpha = style.alpha;

    paintCtx.beginPath();
    paintCtx.moveTo(fromPt.x, fromPt.y);
    paintCtx.lineTo(toPt.x, toPt.y);
    paintCtx.stroke();

    // Textura suave adicional para el Crayón Grueso
    if (currentTool === "crayon") {
      const dist = Math.hypot(toPt.x - fromPt.x, toPt.y - fromPt.y);
      const steps = Math.max(1, Math.ceil(dist / 6));
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const cx = fromPt.x + (toPt.x - fromPt.x) * t + (Math.random() - 0.5) * 5;
        const cy = fromPt.y + (toPt.y - fromPt.y) * t + (Math.random() - 0.5) * 5;
        paintCtx.beginPath();
        paintCtx.arc(cx, cy, style.width * 0.44, 0, Math.PI * 2);
        paintCtx.fill();
      }
    }

    paintCtx.restore();
    if (currentTool !== "eraser") {
      paintedBirdsSet.add(currentBirdId);
    }
    renderCompositeDisplay();
  }

  /* =========================================================================
     INTERFAZ DE CARRUSEL, PALETA Y BOTONES
     ========================================================================= */
  function renderBirdCarousel() {
    const strip = document.getElementById("cg-bird-strip");
    if (!strip) return;
    const birds = getBirdsMap();
    strip.innerHTML = "";

    Object.keys(birds).forEach(id => {
      const b = birds[id];
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "cg-bird-pill" + (id === currentBirdId ? " active" : "");
      pill.setAttribute("data-bird-id", id);

      const doneBadge = paintedBirdsSet.has(id) ? `<span class="cg-done-dot">🎨</span>` : "";
      pill.innerHTML = `
        <img src="${getOriginalSpriteUrl(id)}" alt="${b.name}">
        <span>${b.name}</span>
        ${doneBadge}
      `;
      pill.addEventListener("click", () => {
        if (id !== currentBirdId) {
          loadBirdIntoWorkshop(id, true);
        } else {
          playPopTone(700, 0.1);
        }
      });
      strip.appendChild(pill);
    });

    // Asegurar visibilidad de la píldora activa
    const activePill = strip.querySelector(".cg-bird-pill.active");
    if (activePill && activePill.scrollIntoView) {
      try {
        activePill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      } catch (e) {}
    }
  }

  function renderColorPalette() {
    const bar = document.getElementById("cg-palette-bar");
    if (!bar) return;
    bar.innerHTML = "";

    const recommended = BIRD_REAL_COLORS[currentBirdId] || [];

    COLOR_PALETTE.forEach((swatch, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      const isSelected = currentColor.id === swatch.id && currentTool !== "eraser" && currentTool !== "rainbow";
      btn.className = "cg-swatch" + (isSelected ? " active" : "");
      btn.style.backgroundColor = swatch.hex;
      btn.title = swatch.name + (recommended.includes(swatch.id) ? " (⭐ Color real del ave)" : "");
      btn.setAttribute("aria-label", swatch.name);

      if (recommended.includes(swatch.id)) {
        const star = document.createElement("span");
        star.className = "cg-swatch-star";
        star.textContent = "⭐";
        btn.appendChild(star);
      }

      btn.addEventListener("click", () => {
        currentColor = swatch;
        if (currentTool === "eraser" || currentTool === "rainbow") {
          setActiveTool("brush");
        }
        playPopTone(460 + index * 28, 0.12, "sine");
        renderColorPalette();
      });

      bar.appendChild(btn);
    });
  }

  function setActiveTool(toolName) {
    currentTool = toolName;
    document.querySelectorAll("#cg-tools-bar .cg-tool-btn[data-tool]").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tool") === toolName);
    });
    renderColorPalette();
  }

  function playCurrentBirdSongInWorkshop() {
    const birds = getBirdsMap();
    const bird = birds[currentBirdId];
    if (!bird) return;

    // Reproducir locución si existe
    if (typeof playBirdVoice === "function") {
      playBirdVoice(currentBirdId);
    }

    // Reproducir canto real del ave durante 3.5 segundos
    if (typeof audioElements !== "undefined" && audioElements[currentBirdId]) {
      const a = audioElements[currentBirdId];
      if (previewSongTimer) clearTimeout(previewSongTimer);
      a.volume = 1;
      a.currentTime = 0;
      a.play().catch(() => {});
      previewSongTimer = setTimeout(() => {
        if (typeof isSinging !== "undefined" && !isSinging[currentBirdId]) {
          a.pause();
          a.currentTime = 0;
        }
      }, 3600);
    } else if (bird.audioSrc) {
      const tempAudio = new Audio(bird.audioSrc);
      tempAudio.play().catch(() => {});
      setTimeout(() => tempAudio.pause(), 3600);
    }
  }

  /* =========================================================================
     EXPORTACIÓN DE DIBUJO (PNG Y SPRITE TRANSPARENTE PARA EL PAISAJE)
     ========================================================================= */
  function buildFramedPosterDataUrl() {
    const birds = getBirdsMap();
    const bird = birds[currentBirdId] || { name: "Pajarito" };
    const outCan = document.createElement("canvas");
    outCan.width = CW;
    outCan.height = CH;
    const outCtx = outCan.getContext("2d");

    outCtx.drawImage(bgFrameCanvas, 0, 0);
    outCtx.drawImage(paintCanvas, 0, 0);
    outCtx.drawImage(lineOverlayCanvas, 0, 0);

    // Etiqueta inferior festiva con el nombre del ave
    outCtx.fillStyle = "rgba(255, 255, 255, 0.92)";
    outCtx.strokeStyle = "#f59e0b";
    outCtx.lineWidth = 4;
    const badgeW = 360;
    const badgeH = 44;
    const bx = (CW - badgeW) / 2;
    const by = CH - 58;
    outCtx.beginPath();
    if (outCtx.roundRect) {
      outCtx.roundRect(bx, by, badgeW, badgeH, 22);
    } else {
      outCtx.rect(bx, by, badgeW, badgeH);
    }
    outCtx.fill();
    outCtx.stroke();

    outCtx.fillStyle = "#b45309";
    outCtx.font = "bold 20px 'Fredoka One', 'Nunito', sans-serif";
    outCtx.textAlign = "center";
    outCtx.textBaseline = "middle";
    outCtx.fillText(`🎨 Mi ${bird.name} — Pajaritos de Pinamar`, CW / 2, by + badgeH / 2);

    return outCan.toDataURL("image/png");
  }

  function buildLandscapeSpriteDataUrl() {
    // Combina únicamente el interior pintado + líneas sobre fondo 100% transparente con las dimensiones exactas del sprite original
    const birdOnlyCan = document.createElement("canvas");
    birdOnlyCan.width = CW;
    birdOnlyCan.height = CH;
    const bCtx = birdOnlyCan.getContext("2d");
    bCtx.drawImage(paintCanvas, 0, 0);
    bCtx.drawImage(lineOverlayCanvas, 0, 0);

    const { origW, origH, drawX, drawY, drawW, drawH } = activeSpriteTransform;
    const spriteCan = document.createElement("canvas");
    spriteCan.width = origW;
    spriteCan.height = origH;
    const sCtx = spriteCan.getContext("2d");

    // Mapeo inverso de (drawX, drawY, drawW, drawH) -> (0, 0, origW, origH)
    const scaleX = origW / Math.max(1, drawW);
    const scaleY = origH / Math.max(1, drawH);
    sCtx.drawImage(
      birdOnlyCan,
      0, 0, CW, CH,
      -drawX * scaleX,
      -drawY * scaleY,
      CW * scaleX,
      CH * scaleY
    );

    return spriteCan.toDataURL("image/png");
  }

  function spawnConfettiBurst() {
    const workshop = document.getElementById("cg-workshop");
    if (!workshop) return;
    const colors = ["#ef233c", "#ffd60a", "#2ecc71", "#38bdf8", "#f472b6", "#a855f7", "#fb923c"];
    for (let i = 0; i < 42; i++) {
      const piece = document.createElement("div");
      piece.className = "cg-confetti";
      piece.style.backgroundColor = colors[i % colors.length];
      piece.style.left = `${20 + Math.random() * 60}%`;
      piece.style.top = `${15 + Math.random() * 25}%`;
      piece.style.setProperty("--dx", `${(Math.random() - 0.5) * 420}px`);
      piece.style.setProperty("--dy", `${160 + Math.random() * 320}px`);
      piece.style.setProperty("--rot", `${(Math.random() - 0.5) * 720}deg`);
      workshop.appendChild(piece);
      setTimeout(() => piece.remove(), 1850);
    }
  }

  function openCelebrationOverlay() {
    saveCurrentBirdPaintingState();
    paintedBirdsSet.add(currentBirdId);
    renderBirdCarousel();

    const birds = getBirdsMap();
    const bird = birds[currentBirdId] || { name: "Pajarito" };
    const titleEl = document.getElementById("cg-celebration-title");
    if (titleEl) {
      titleEl.textContent = `¡Qué lindo te quedó el ${bird.name}! 🎉`;
    }

    const previewImg = document.getElementById("cg-celebration-img");
    if (previewImg) {
      previewImg.src = buildFramedPosterDataUrl();
    }

    const overlay = document.getElementById("cg-celebration-overlay");
    if (overlay) {
      overlay.classList.add("open");
    }

    playFanfareSound();
    spawnConfettiBurst();
  }

  /* =========================================================================
     CONEXIÓN DE EVENTOS DEL TALLER
     ========================================================================= */
  function setupUIListeners() {
    displayCanvas = document.getElementById("cg-display-canvas");
    displayCtx = displayCanvas.getContext("2d");

    // Eventos de pintura (ratón y táctil)
    displayCanvas.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const pt = getCanvasCoords(e);

      if (currentTool === "bucket") {
        const ok = floodFillZone(pt.x, pt.y, currentColor.rgb);
        if (!ok) {
          playPopTone(260, 0.12, "triangle");
        }
        renderBirdCarousel();
        return;
      }

      pushUndoState();
      isDrawing = true;
      lastPt = pt;
      drawStrokeSegment(pt, pt);
      if (displayCanvas.setPointerCapture) {
        try { displayCanvas.setPointerCapture(e.pointerId); } catch (err) {}
      }
    });

    displayCanvas.addEventListener("pointermove", (e) => {
      if (!isDrawing || !lastPt) return;
      e.preventDefault();
      e.stopPropagation();
      const pt = getCanvasCoords(e);
      drawStrokeSegment(lastPt, pt);
      lastPt = pt;
    });

    const finishStroke = () => {
      if (!isDrawing) return;
      isDrawing = false;
      lastPt = null;
      saveCurrentBirdPaintingState();
      renderBirdCarousel();
    };

    displayCanvas.addEventListener("pointerup", finishStroke);
    displayCanvas.addEventListener("pointercancel", finishStroke);

    // Botones de herramientas
    document.querySelectorAll("#cg-tools-bar .cg-tool-btn[data-tool]").forEach(btn => {
      btn.addEventListener("click", () => {
        const t = btn.getAttribute("data-tool");
        setActiveTool(t);
        playPopTone(540, 0.1, "sine");
      });
    });

    // Deshacer (hasta 10 pasos)
    const btnUndo = document.getElementById("cg-btn-undo");
    if (btnUndo) {
      btnUndo.addEventListener("click", () => {
        if (undoStack.length === 0) {
          playPopTone(240, 0.12, "triangle");
          return;
        }
        const prev = undoStack.pop();
        paintCtx.putImageData(prev, 0, 0);
        saveCurrentBirdPaintingState();
        renderCompositeDisplay();
        playPopTone(420, 0.12, "sine");
      });
    }

    // Borrar Todo (guardando antes en undoStack por si un niño pequeño toca sin querer)
    const btnClear = document.getElementById("cg-btn-clear");
    if (btnClear) {
      btnClear.addEventListener("click", () => {
        pushUndoState();
        resetPaintCanvasToWhite();
        saveCurrentBirdPaintingState();
        renderCompositeDisplay();
        playPopTone(350, 0.18, "triangle");
      });
    }

    // Mini-Modelo de Referencia interactivo
    const refCard = document.getElementById("cg-ref-card");
    if (refCard) {
      refCard.addEventListener("click", () => {
        refCard.classList.toggle("zoomed");
        playPopTone(680, 0.12, "sine");
      });
    }

    // Flechas del carrusel
    const strip = document.getElementById("cg-bird-strip");
    const prevBtn = document.getElementById("cg-strip-prev");
    const nextBtn = document.getElementById("cg-strip-next");
    if (prevBtn && strip) {
      prevBtn.addEventListener("click", () => {
        strip.scrollBy({ left: -220, behavior: "smooth" });
      });
    }
    if (nextBtn && strip) {
      nextBtn.addEventListener("click", () => {
        strip.scrollBy({ left: 220, behavior: "smooth" });
      });
    }

    // Botón Escuchar Canto
    const btnSing = document.getElementById("cg-btn-sing");
    if (btnSing) {
      btnSing.addEventListener("click", () => {
        playCurrentBirdSongInWorkshop();
      });
    }

    // Botón ¡Terminé!
    const btnFinish = document.getElementById("cg-btn-finish");
    if (btnFinish) {
      btnFinish.addEventListener("click", () => {
        openCelebrationOverlay();
      });
    }

    // Botón Cerrar Taller
    const btnClose = document.getElementById("cg-btn-close");
    if (btnClose) {
      btnClose.addEventListener("click", () => {
        window.closeColoringGame();
      });
    }

    // Acciones del modal de Celebración
    const btnKeep = document.getElementById("cg-btn-keep-painting");
    if (btnKeep) {
      btnKeep.addEventListener("click", () => {
        const overlay = document.getElementById("cg-celebration-overlay");
        if (overlay) overlay.classList.remove("open");
        playPopTone(520, 0.1);
      });
    }

    const btnSavePng = document.getElementById("cg-btn-save-png");
    if (btnSavePng) {
      btnSavePng.addEventListener("click", () => {
        const dataUrl = buildFramedPosterDataUrl();
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `pajarito_${currentBirdId}_pintado.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        playFanfareSound();
      });
    }

    const btnUseLandscape = document.getElementById("cg-btn-use-in-landscape");
    if (btnUseLandscape) {
      btnUseLandscape.addEventListener("click", () => {
        const paintedDataUrl = buildLandscapeSpriteDataUrl();
        const birds = getBirdsMap();
        const bird = birds[currentBirdId];

        if (bird) {
          if (!bird._origReposo) bird._origReposo = bird.reposo;
          bird.reposo = paintedDataUrl;
        }

        const landscapeImg = document.getElementById(`img-${currentBirdId}`);
        if (landscapeImg) {
          landscapeImg.src = paintedDataUrl;
        }

        const overlay = document.getElementById("cg-celebration-overlay");
        if (overlay) overlay.classList.remove("open");
        window.closeColoringGame();

        if (typeof zoomToBird === "function") {
          setTimeout(() => zoomToBird(currentBirdId), 180);
        }
        if (typeof showGlobalToast === "function" && bird) {
          showGlobalToast(`✨ ¡Tu ${bird.name} pintado ya está posado en el paisaje de Pinamar! 🎨🐦`);
        }
      });
    }
  }

  /* =========================================================================
     API PÚBLICA GLOBAL: openColoringGame & closeColoringGame
     ========================================================================= */
  function ensureInitialized() {
    injectStyles();
    injectModalDOM();
  }

  window.openColoringGame = function (initialBirdId) {
    ensureInitialized();

    // Cerrar menú hamburguesa si estuviera abierto
    if (typeof closeMenu === "function") {
      try { closeMenu(); } catch (e) {}
    }

    const overlay = document.getElementById("cg-celebration-overlay");
    if (overlay) overlay.classList.remove("open");

    const birds = getBirdsMap();
    const targetBird = (initialBirdId && birds[initialBirdId]) ? initialBirdId : (currentBirdId || "hornero");

    const modal = document.getElementById("coloring-modal");
    if (modal) {
      modal.classList.add("open");
    }

    loadBirdIntoWorkshop(targetBird, true);
  };

  window.closeColoringGame = function () {
    saveCurrentBirdPaintingState();
    const modal = document.getElementById("coloring-modal");
    if (modal) {
      modal.classList.remove("open");
    }
    const overlay = document.getElementById("cg-celebration-overlay");
    if (overlay) {
      overlay.classList.remove("open");
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureInitialized);
  } else {
    ensureInitialized();
  }
})();
