/**
 * ============================================================================
 * PAJARITOS DE PINAMAR - SALA DE MINIJUEGOS INFANTILES (3+ AÑOS) (v26)
 * ============================================================================
 * Módulo autocontenido que inyecta su propio CSS, el modal #kids-games-modal
 * y el HUD flotante #kids-where-hud en document.body.
 *
 * Incluye 3 minijuegos completos diseñados para niños desde 3 años (sin requerir
 * lectoescritura) más accesos directos a "Pintar Pajaritos" y "Dar de Comer":
 *   1. 👂 ¿Quién Canta? (Discriminación auditiva con los cantos reales)
 *   2. 🃏 Memoria de Pajaritos (Memotest visual y sonoro: 3 parejas / 6 parejas)
 *   3. 🕵️ ¿Dónde Está? (Búsqueda visual en el paisaje con zoom, voz y botón Pista)
 *
 * Expone globalmente:
 *   - window.openKidsGamesModal(initialTab)
 *   - window.closeKidsGamesModal()
 * ============================================================================
 */
(function () {
  "use strict";

  const FALLBACK_BIRDS = {
    hornero:    { id: "hornero",    name: "Hornero",          reposo: "assets_mobile/hornero_reposo_trans.webp?v=25",    audioSrc: "audio/canto_hornero.mp3" },
    tero:       { id: "tero",       name: "Tero",             reposo: "assets_mobile/tero_reposo_trans.webp?v=25",       audioSrc: "audio/canto_tero.mp3" },
    benteveo:   { id: "benteveo",   name: "Benteveo",         reposo: "assets_mobile/benteveo_reposo_trans.webp?v=25",   audioSrc: "audio/canto_benteveo.mp3" },
    cotorra:    { id: "cotorra",    name: "Cotorra",          reposo: "assets_mobile/cotorra_reposo_trans.webp?v=25",    audioSrc: "audio/canto_cotorra.mp3" },
    cardenal:   { id: "cardenal",   name: "Cardenal",         reposo: "assets_mobile/cardenal_reposo_trans.webp?v=25",   audioSrc: "audio/canto_cardenal.mp3" },
    zorzal:     { id: "zorzal",     name: "Zorzal Colorado",  reposo: "assets_mobile/zorzal_reposo_trans.webp?v=25",     audioSrc: "audio/canto_zorzal_colorado.mp3" },
    chingolo:   { id: "chingolo",   name: "Chingolo",         reposo: "assets_mobile/chingolo_reposo_trans.webp?v=25",   audioSrc: "audio/canto_chingolo.mp3" },
    gaviota:    { id: "gaviota",    name: "Gaviota Cocinera", reposo: "assets_mobile/gaviota_reposo_trans.webp?v=25",    audioSrc: "audio/canto_gaviota.mp3" },
    tordo:      { id: "tordo",      name: "Tordo Renegrido",  reposo: "assets_mobile/tordo_reposo_trans.webp?v=25",      audioSrc: "audio/canto_tordo.mp3" },
    carpintero: { id: "carpintero", name: "Carpintero",       reposo: "assets_mobile/carpintero_reposo_trans.webp?v=25", audioSrc: "audio/canto_carpintero.mp3" },
    dorado:     { id: "dorado",     name: "Dorado",           reposo: "assets_mobile/dorado_reposo_trans.webp?v=25",     audioSrc: "audio/canto_dorado.mp3" },
    nacurutu:   { id: "nacurutu",   name: "Ñacurutú",         reposo: "assets_mobile/nacurutu_reposo_trans.webp?v=25",   audioSrc: "audio/canto_nacurutu.mp3" },
    torcaza:    { id: "torcaza",    name: "Torcaza",          reposo: "assets_mobile/torcaza_reposo_trans.webp?v=25",    audioSrc: "audio/canto_torcaza.mp3" },
    calandria:  { id: "calandria",  name: "Calandria",        reposo: "assets_mobile/calandria_reposo_trans.webp?v=25",  audioSrc: "audio/canto_calandria.mp3" },
    picaflor:   { id: "picaflor",   name: "Picaflor",         reposo: "assets_mobile/picaflor_reposo_trans.webp?v=25",   audioSrc: "audio/canto_picaflor.mp3" }
  };

  function getBirdsMap() {
    if (typeof BIRDS !== "undefined" && BIRDS && Object.keys(BIRDS).length > 0) {
      window.BIRDS = BIRDS;
      return BIRDS;
    }
    if (window.BIRDS && Object.keys(window.BIRDS).length > 0) {
      return window.BIRDS;
    }
    return FALLBACK_BIRDS;
  }

  function getBirdList() {
    return Object.values(getBirdsMap());
  }

  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  /* =========================================================================
     AUDIO SINTETIZADO Y REPRODUCCIÓN DE CANTOS REALES
     ========================================================================= */
  let localAudioCtx = null;
  let activeSongAudio = null;
  let activeSongBirdId = null;
  let activeSongStopTimer = null;

  function getAudioContext() {
    if (typeof getSharedAudioCtx === "function") {
      const shared = getSharedAudioCtx();
      if (shared) return shared;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!localAudioCtx || localAudioCtx.state === "closed") {
      localAudioCtx = new AudioCtx();
    }
    if (localAudioCtx.state === "suspended") {
      localAudioCtx.resume().catch(() => {});
    }
    return localAudioCtx;
  }

  function playSoftErrorSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(310, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.22);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {}
  }

  function playSuccessSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // Do5 - Mi5 - Sol5 - Do6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        const start = now + idx * 0.075;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.36);
      });
    } catch (e) {}
  }

  function playFlipSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.09);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  function playTrophyFanfare() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const melody = [
        { f: 523.25, t: 0.0, d: 0.14 },
        { f: 659.25, t: 0.12, d: 0.14 },
        { f: 783.99, t: 0.24, d: 0.14 },
        { f: 1046.5, t: 0.38, d: 0.45 }
      ];
      melody.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.26, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d + 0.02);
      });
    } catch (e) {}
  }

  function stopActiveQuizSong() {
    if (activeSongStopTimer) {
      clearTimeout(activeSongStopTimer);
      activeSongStopTimer = null;
    }
    if (activeSongAudio) {
      try {
        if (typeof isSinging !== "undefined" && activeSongBirdId && isSinging[activeSongBirdId]) {
          // Si estaba cantando en el paisaje principal, no cortarlo bruscamente
        } else {
          activeSongAudio.pause();
          activeSongAudio.currentTime = 0;
        }
      } catch (e) {}
      activeSongAudio = null;
      activeSongBirdId = null;
    }
    const speakerBtn = document.getElementById("kg-who-speaker-btn");
    if (speakerBtn) speakerBtn.classList.remove("is-playing");
  }

  function playBirdSongSnippet(birdId, durationMs = 4200) {
    stopActiveQuizSong();
    getAudioContext();
    const birds = getBirdsMap();
    const bird = birds[birdId];
    if (!bird) return;

    // Silenciar aves del fondo si estaban cantando para escuchar con claridad el juego
    if (typeof isSinging !== "undefined" && typeof toggleBird === "function") {
      Object.keys(isSinging).forEach(id => {
        if (isSinging[id]) {
          toggleBird(id, false);
        }
      });
    }

    let audio = (typeof audioElements !== "undefined" && audioElements && audioElements[birdId])
      ? audioElements[birdId]
      : null;

    if (!audio && bird.audioSrc) {
      audio = new Audio(bird.audioSrc);
    }
    if (!audio) return;

    activeSongAudio = audio;
    activeSongBirdId = birdId;

    const speakerBtn = document.getElementById("kg-who-speaker-btn");
    if (speakerBtn) speakerBtn.classList.add("is-playing");

    try {
      audio.volume = 1;
      audio.currentTime = 0;
      const p = audio.play();
      if (p !== undefined) {
        p.catch(() => {
          if (speakerBtn) speakerBtn.classList.remove("is-playing");
        });
      }
    } catch (e) {}

    if (durationMs > 0) {
      activeSongStopTimer = setTimeout(() => {
        stopActiveQuizSong();
      }, durationMs);
    }
  }

  function triggerBirdVoiceSafe(birdId) {
    if (typeof playBirdVoice === "function") {
      try {
        playBirdVoice(birdId);
      } catch (e) {}
    }
  }

  /* =========================================================================
     INYECCIÓN DE ESTILOS CSS INFANTILES (3+ AÑOS)
     ========================================================================= */
  function injectStyles() {
    if (document.getElementById("kids-games-styles")) return;
    const style = document.createElement("style");
    style.id = "kids-games-styles";
    style.textContent = `
      #kids-games-modal {
        position: fixed;
        inset: 0;
        z-index: 280;
        background: rgba(10, 18, 32, 0.86);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 10px;
        opacity: 0;
        transition: opacity 0.25s ease;
        touch-action: none;
      }
      #kids-games-modal.open {
        display: flex;
        opacity: 1;
      }
      .kg-container {
        width: 100%;
        max-width: 900px;
        max-height: 94vh;
        max-height: 94dvh;
        background: linear-gradient(180deg, #fffef9 0%, #f0f9ff 100%);
        border: 4px solid #fbbf24;
        border-radius: 28px;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65), inset 0 2px 0 rgba(255, 255, 255, 0.9);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        color: #1e293b;
        position: relative;
      }
      .kg-header {
        background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
        padding: 12px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        border-bottom: 3px solid #d97706;
        color: #fff;
      }
      .kg-title-wrap {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .kg-title-icon {
        font-size: 1.8rem;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));
      }
      .kg-title {
        font-family: 'Fredoka One', cursive;
        font-size: clamp(1.05rem, 3.2vw, 1.45rem);
        letter-spacing: 0.5px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        margin: 0;
      }
      .kg-close-btn {
        background: rgba(0, 0, 0, 0.28);
        border: 2.5px solid rgba(255, 255, 255, 0.75);
        color: #fff;
        border-radius: 50%;
        width: 42px;
        height: 42px;
        font-size: 1.25rem;
        font-weight: 900;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.15s ease, background 0.2s ease;
        flex-shrink: 0;
      }
      .kg-close-btn:hover, .kg-close-btn:active {
        background: #ef4444;
        transform: scale(1.08);
      }

      /* Pestañas de Selección de Juegos */
      .kg-tabs {
        display: flex;
        gap: 8px;
        padding: 10px 14px;
        background: #fef3c7;
        border-bottom: 2px solid #fde68a;
        overflow-x: auto;
        justify-content: center;
        flex-wrap: wrap;
      }
      .kg-tab-btn {
        border: 3px solid #cbd5e1;
        background: #ffffff;
        color: #334155;
        border-radius: 50px;
        padding: 8px 16px;
        font-family: 'Fredoka One', cursive;
        font-size: clamp(0.82rem, 2.5vw, 1rem);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease;
      }
      .kg-tab-btn:active {
        transform: scale(0.95);
      }
      .kg-tab-btn.active {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: #ffffff;
        border-color: #1d4ed8;
        box-shadow: 0 5px 14px rgba(37, 99, 235, 0.35);
      }

      /* Cuerpo scrollable del modal */
      .kg-body {
        padding: 16px;
        overflow-y: auto;
        flex: 1;
        touch-action: pan-y;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      /* Barra de Estrellas / Progreso */
      .kg-status-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #ffffff;
        border: 2px solid #e2e8f0;
        border-radius: 20px;
        padding: 8px 16px;
        box-shadow: 0 3px 8px rgba(0,0,0,0.05);
        flex-wrap: wrap;
        gap: 8px;
      }
      .kg-stars-pill {
        font-family: 'Fredoka One', cursive;
        font-size: clamp(0.95rem, 2.8vw, 1.15rem);
        color: #d97706;
        background: #fef3c7;
        border: 2px solid #fcd34d;
        padding: 4px 14px;
        border-radius: 30px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .kg-feedback-msg {
        font-weight: 800;
        font-size: clamp(0.9rem, 2.6vw, 1.08rem);
        color: #0f172a;
        text-align: center;
        flex: 1;
      }

      /* JUEGO 1: ¿QUIÉN CANTA? */
      .kg-speaker-zone {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        margin: 4px 0;
      }
      .kg-speaker-btn {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        border: 4px solid #a7f3d0;
        color: #ffffff;
        border-radius: 60px;
        padding: 14px 28px;
        font-family: 'Fredoka One', cursive;
        font-size: clamp(1rem, 3vw, 1.25rem);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 8px 22px rgba(16, 185, 129, 0.4);
        transition: transform 0.15s ease, box-shadow 0.2s ease;
      }
      .kg-speaker-btn:active {
        transform: scale(0.94);
      }
      .kg-speaker-btn.is-playing {
        animation: kgPulseSpeaker 1s infinite ease-in-out;
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        border-color: #fde68a;
        box-shadow: 0 8px 25px rgba(245, 158, 11, 0.5);
      }
      @keyframes kgPulseSpeaker {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.07); }
      }

      .kg-choices-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
        width: 100%;
      }
      @media (max-width: 600px) {
        .kg-choices-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
      }
      .kg-bird-card {
        background: #ffffff;
        border: 4px solid #cbd5e1;
        border-radius: 24px;
        padding: 12px 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
        transition: transform 0.18s ease, border-color 0.2s ease, background 0.2s ease;
        position: relative;
        min-height: 170px;
      }
      .kg-bird-card:hover {
        transform: translateY(-4px);
        border-color: #60a5fa;
      }
      .kg-bird-card:active {
        transform: scale(0.95);
      }
      .kg-bird-card-img-wrap {
        width: 100%;
        height: clamp(95px, 20vw, 145px);
        background: radial-gradient(circle, #e0f2fe 0%, #f8fafc 100%);
        border-radius: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px;
        margin-bottom: 8px;
      }
      .kg-bird-card-img {
        max-width: 94%;
        max-height: 94%;
        object-fit: contain;
        filter: drop-shadow(0 4px 6px rgba(0,0,0,0.18));
        pointer-events: none;
      }
      .kg-bird-card-name {
        font-family: 'Fredoka One', cursive;
        font-size: clamp(0.85rem, 2.6vw, 1.1rem);
        color: #1e293b;
        text-align: center;
      }
      .kg-bird-card.kg-card-correct {
        border-color: #22c55e;
        background: #dcfce7;
        animation: kgBounceWin 0.6s ease;
      }
      .kg-bird-card.kg-card-wrong {
        border-color: #f97316;
        background: #ffedd5;
        animation: kgWiggleWrong 0.45s ease;
      }
      @keyframes kgWiggleWrong {
        0%, 100% { transform: translateX(0) rotate(0deg); }
        20% { transform: translateX(-8px) rotate(-4deg); }
        40% { transform: translateX(8px) rotate(4deg); }
        60% { transform: translateX(-6px) rotate(-2deg); }
        80% { transform: translateX(6px) rotate(2deg); }
      }
      @keyframes kgBounceWin {
        0%, 100% { transform: scale(1); }
        40% { transform: scale(1.1); }
        70% { transform: scale(0.97); }
      }

      /* JUEGO 2: MEMORIA DE PAJARITOS */
      .kg-memory-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .kg-diff-btn {
        border: 3px solid #cbd5e1;
        background: #ffffff;
        color: #334155;
        border-radius: 40px;
        padding: 7px 16px;
        font-family: 'Fredoka One', cursive;
        font-size: clamp(0.8rem, 2.4vw, 0.95rem);
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .kg-diff-btn.active {
        background: #8b5cf6;
        color: #ffffff;
        border-color: #6d28d9;
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.35);
      }
      .kg-memory-grid {
        display: grid;
        gap: 10px;
        width: 100%;
        margin: 0 auto;
      }
      .kg-memory-grid.pairs-3 {
        grid-template-columns: repeat(3, 1fr);
        max-width: 580px;
      }
      .kg-memory-grid.pairs-6 {
        grid-template-columns: repeat(4, 1fr);
        max-width: 720px;
      }
      @media (max-width: 520px) {
        .kg-memory-grid.pairs-6 {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      .kg-mem-card {
        aspect-ratio: 1 / 1.05;
        perspective: 800px;
        cursor: pointer;
        position: relative;
      }
      .kg-mem-inner {
        position: absolute;
        inset: 0;
        transition: transform 0.42s cubic-bezier(0.2, 0.85, 0.4, 1.2);
        transform-style: preserve-3d;
        border-radius: 20px;
      }
      .kg-mem-card.flipped .kg-mem-inner,
      .kg-mem-card.matched .kg-mem-inner {
        transform: rotateY(180deg);
      }
      .kg-mem-face {
        position: absolute;
        inset: 0;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 5px 14px rgba(0,0,0,0.1);
      }
      .kg-mem-front {
        background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
        border: 4px solid #bae6fd;
        color: #ffffff;
        font-size: clamp(2rem, 6vw, 2.8rem);
      }
      .kg-mem-back {
        background: #ffffff;
        border: 4px solid #93c5fd;
        transform: rotateY(180deg);
        padding: 6px;
        justify-content: space-between;
      }
      .kg-mem-card.matched .kg-mem-back {
        border-color: #eab308;
        background: #fef9c3;
        box-shadow: 0 0 18px rgba(234, 179, 8, 0.45);
      }
      .kg-mem-img {
        max-width: 86%;
        max-height: 72%;
        object-fit: contain;
        margin-top: 4px;
        pointer-events: none;
      }
      .kg-mem-name {
        font-family: 'Fredoka One', cursive;
        font-size: clamp(0.7rem, 2vw, 0.88rem);
        color: #1e293b;
        text-align: center;
        line-height: 1.1;
        margin-bottom: 2px;
      }

      /* CELEBRACIÓN DE TROFEO (5 RONDAS O MEMOTEST COMPLETO) */
      .kg-trophy-box {
        background: linear-gradient(180deg, #fef9c3 0%, #fde68a 100%);
        border: 4px solid #f59e0b;
        border-radius: 26px;
        padding: 24px 18px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        box-shadow: 0 12px 30px rgba(245, 158, 11, 0.25);
        animation: kgBounceWin 0.6s ease;
      }
      .kg-trophy-icon {
        font-size: 4rem;
        line-height: 1;
        filter: drop-shadow(0 6px 10px rgba(0,0,0,0.2));
      }
      .kg-trophy-title {
        font-family: 'Fredoka One', cursive;
        font-size: clamp(1.3rem, 4vw, 1.75rem);
        color: #b45309;
      }
      .kg-trophy-sub {
        font-size: 1rem;
        font-weight: 800;
        color: #78350f;
      }
      .kg-play-again-btn {
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        border: 3px solid #bbf7d0;
        color: #fff;
        font-family: 'Fredoka One', cursive;
        font-size: 1.15rem;
        padding: 12px 28px;
        border-radius: 50px;
        cursor: pointer;
        box-shadow: 0 6px 18px rgba(22, 163, 74, 0.4);
        transition: transform 0.15s ease;
      }
      .kg-play-again-btn:active {
        transform: scale(0.94);
      }

      /* TARJETAS DE ACCESO DIRECTO A PINTAR Y DAR DE COMER */
      .kg-shortcuts-bar {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
        gap: 10px;
        padding-top: 8px;
        border-top: 2px dashed #cbd5e1;
      }
      .kg-shortcut-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        border-radius: 18px;
        cursor: pointer;
        border: 3px solid transparent;
        transition: transform 0.15s ease, box-shadow 0.2s ease;
        text-align: left;
      }
      .kg-shortcut-card:active {
        transform: scale(0.96);
      }
      .kg-shortcut-paint {
        background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
        border-color: #f472b6;
        color: #831843;
      }
      .kg-shortcut-feed {
        background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
        border-color: #4ade80;
        color: #14532d;
      }
      .kg-shortcut-where {
        background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
        border-color: #38bdf8;
        color: #0c4a6e;
      }
      .kg-shortcut-icon {
        font-size: 1.9rem;
        flex-shrink: 0;
      }
      .kg-shortcut-title {
        font-family: 'Fredoka One', cursive;
        font-size: 0.98rem;
        display: block;
      }
      .kg-shortcut-desc {
        font-size: 0.78rem;
        font-weight: 800;
        opacity: 0.85;
      }

      /* =====================================================================
         JUEGO 3: BANNER FLOTANTE "¿DÓNDE ESTÁ?" EN EL PAISAJE (#kids-where-hud)
         ===================================================================== */
      #kids-where-hud {
        position: fixed;
        top: max(68px, env(safe-area-inset-top));
        left: 50%;
        transform: translateX(-50%);
        z-index: 210;
        background: rgba(255, 255, 255, 0.95);
        border: 4px solid #f59e0b;
        border-radius: 28px;
        padding: 8px 14px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
        display: none;
        align-items: center;
        gap: 12px;
        max-width: 96vw;
        pointer-events: auto;
        touch-action: none;
      }
      #kids-where-hud.active {
        display: flex;
        animation: kgBounceWin 0.4s ease;
      }
      .kg-where-avatar-wrap {
        width: 66px;
        height: 66px;
        border-radius: 18px;
        background: radial-gradient(circle, #fef3c7 0%, #fde68a 100%);
        border: 3px solid #f59e0b;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        cursor: pointer;
        position: relative;
      }
      .kg-where-avatar {
        max-width: 92%;
        max-height: 92%;
        object-fit: contain;
        filter: drop-shadow(0 3px 5px rgba(0,0,0,0.25));
      }
      .kg-where-info {
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 140px;
      }
      .kg-where-prompt {
        font-family: 'Fredoka One', cursive;
        font-size: clamp(0.88rem, 2.6vw, 1.1rem);
        color: #1e293b;
        line-height: 1.2;
      }
      .kg-where-sub {
        font-size: 0.8rem;
        font-weight: 800;
        color: #b45309;
      }
      .kg-where-actions {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .kg-where-btn {
        border: none;
        border-radius: 40px;
        padding: 8px 14px;
        font-family: 'Fredoka One', cursive;
        font-size: clamp(0.78rem, 2.3vw, 0.92rem);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        transition: transform 0.15s ease;
      }
      .kg-where-btn:active {
        transform: scale(0.92);
      }
      .kg-btn-hint {
        background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
        color: #fff;
        border: 2px solid #fef08a;
      }
      .kg-btn-exit {
        background: #ef4444;
        color: #fff;
        border: 2px solid #fecaca;
      }

      /* Anillo dorado pulsante cuando el niño pide 💡 Pista en el paisaje */
      .bird-perch.kg-target-hint-ring::after {
        content: "✨👇✨";
        position: absolute;
        inset: -18px;
        border: 5px solid #fbbf24;
        border-radius: 50%;
        box-shadow: 0 0 28px #f59e0b, inset 0 0 18px #fde047;
        animation: kgHintRingPulse 0.9s infinite ease-in-out;
        pointer-events: none;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        font-size: 1.2rem;
        padding-top: -18px;
        z-index: 99;
      }
      @keyframes kgHintRingPulse {
        0%, 100% { transform: scale(0.95); opacity: 0.9; }
        50% { transform: scale(1.16); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  /* =========================================================================
     ESTADO DE LOS 3 MINIJUEGOS
     ========================================================================= */
  let currentTab = "who"; // "who" | "memory" | "where"

  // Estado Juego 1: ¿Quién Canta?
  const whoState = {
    round: 0,
    maxRounds: 5,
    stars: 0,
    targetId: null,
    choices: [],
    answered: false,
    deck: []
  };

  // Estado Juego 2: Memoria de Pajaritos
  const memState = {
    pairCount: 3, // 3 (🐣 Pequeños 3+) | 6 (🦅 Exploradores 5+)
    cards: [],
    flippedIndices: [],
    matchedBirdIds: new Set(),
    locked: false
  };

  // Estado Juego 3: ¿Dónde Está?
  const whereState = {
    active: false,
    stars: 0,
    maxRounds: 5,
    targetId: null,
    deck: [],
    waitingNext: false,
    nextTimer: null
  };

  /* =========================================================================
     CONSTRUCCIÓN DEL MODAL Y DEL HUD EN EL DOM
     ========================================================================= */
  function ensureDomCreated() {
    injectStyles();

    if (!document.getElementById("kids-games-modal")) {
      const modal = document.createElement("div");
      modal.id = "kids-games-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-label", "Sala de Minijuegos Infantiles 3+");

      modal.innerHTML = `
        <div class="kg-container">
          <div class="kg-header">
            <div class="kg-title-wrap">
              <span class="kg-title-icon">🎮</span>
              <h2 class="kg-title">Juegos de Pajaritos (3+ Años)</h2>
            </div>
            <button type="button" class="kg-close-btn" id="kg-close-btn" aria-label="Cerrar juegos">✕</button>
          </div>

          <div class="kg-tabs">
            <button type="button" class="kg-tab-btn active" data-tab="who">
              <span>👂</span><span>¿Quién Canta?</span>
            </button>
            <button type="button" class="kg-tab-btn" data-tab="memory">
              <span>🃏</span><span>Memoria</span>
            </button>
            <button type="button" class="kg-tab-btn" data-tab="where">
              <span>🕵️</span><span>¿Dónde Está?</span>
            </button>
          </div>

          <div class="kg-body" id="kg-body-content"></div>
        </div>
      `;

      // Bloquear propagación de eventos al mapa panorámico inferior
      const stopEvents = ["pointerdown", "pointermove", "pointerup", "wheel", "touchstart", "touchmove", "touchend"];
      stopEvents.forEach(evtName => {
        modal.addEventListener(evtName, e => {
          e.stopPropagation();
        }, { passive: false });
      });

      modal.addEventListener("click", e => {
        e.stopPropagation();
        if (e.target === modal) {
          closeKidsGamesModal();
        }
      });

      document.body.appendChild(modal);

      document.getElementById("kg-close-btn").addEventListener("click", closeKidsGamesModal);

      modal.querySelectorAll(".kg-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const tab = btn.getAttribute("data-tab");
          switchKidsTab(tab);
        });
      });
    }

    if (!document.getElementById("kids-where-hud")) {
      const hud = document.createElement("div");
      hud.id = "kids-where-hud";
      hud.innerHTML = `
        <div class="kg-where-avatar-wrap" id="kg-where-avatar-btn" title="Tocar para escuchar su canto">
          <img class="kg-where-avatar" id="kg-where-img" src="" alt="Pajarito a buscar">
        </div>
        <div class="kg-where-info">
          <div class="kg-where-prompt" id="kg-where-prompt">🔍 ¡Buscá al pajarito!</div>
          <div class="kg-where-sub" id="kg-where-stars">⭐ 0 / 5 encontrados</div>
        </div>
        <div class="kg-where-actions">
          <button type="button" class="kg-where-btn kg-btn-hint" id="kg-where-hint-btn">
            <span>💡</span><span>Pista</span>
          </button>
          <button type="button" class="kg-where-btn kg-btn-exit" id="kg-where-exit-btn">
            <span>❌</span><span>Salir</span>
          </button>
        </div>
      `;

      ["pointerdown", "pointermove", "pointerup", "wheel", "touchstart", "touchmove", "click"].forEach(evtName => {
        hud.addEventListener(evtName, e => {
          e.stopPropagation();
        }, { passive: false });
      });

      document.body.appendChild(hud);

      document.getElementById("kg-where-avatar-btn").addEventListener("click", () => {
        if (whereState.active && whereState.targetId) {
          playBirdSongSnippet(whereState.targetId, 3200);
          triggerBirdVoiceSafe(whereState.targetId);
        }
      });

      document.getElementById("kg-where-hint-btn").addEventListener("click", () => {
        giveWhereHint();
      });

      document.getElementById("kg-where-exit-btn").addEventListener("click", () => {
        stopWhereIsGame();
      });
    }

    bindLandscapeWhereListener();
  }

  /* =========================================================================
     TARJETAS DE ACCESO DIRECTO INFERIORES (PINTAR Y DAR DE COMER)
     ========================================================================= */
  function renderShortcutsHTML() {
    return `
      <div class="kg-shortcuts-bar">
        <button type="button" class="kg-shortcut-card kg-shortcut-paint" id="kg-goto-paint">
          <span class="kg-shortcut-icon">🎨</span>
          <div>
            <span class="kg-shortcut-title">Pintar Pajaritos</span>
            <span class="kg-shortcut-desc">Coloreá sin salirte de la raya</span>
          </div>
        </button>
        <button type="button" class="kg-shortcut-card kg-shortcut-feed" id="kg-goto-feed">
          <span class="kg-shortcut-icon">🌾</span>
          <div>
            <span class="kg-shortcut-title">Dar de Comer</span>
            <span class="kg-shortcut-desc">Alimentá a las 15 aves en el mapa</span>
          </div>
        </button>
        <button type="button" class="kg-shortcut-card kg-shortcut-where" id="kg-goto-where">
          <span class="kg-shortcut-icon">🕵️</span>
          <div>
            <span class="kg-shortcut-title">¿Dónde Está?</span>
            <span class="kg-shortcut-desc">Buscá al pajarito en el paisaje</span>
          </div>
        </button>
      </div>
    `;
  }

  function bindShortcutButtons(container) {
    const btnPaint = container.querySelector("#kg-goto-paint");
    if (btnPaint) {
      btnPaint.addEventListener("click", () => {
        closeKidsGamesModal();
        if (typeof window.openColoringGame === "function") {
          window.openColoringGame();
        }
      });
    }

    const btnFeed = container.querySelector("#kg-goto-feed");
    if (btnFeed) {
      btnFeed.addEventListener("click", () => {
        closeKidsGamesModal();
        stopWhereIsGame();
        if (typeof feedMode !== "undefined" && typeof toggleFeedMode === "function") {
          if (!feedMode) toggleFeedMode();
        } else {
          const feedBtn = document.getElementById("btn-feed-mode");
          if (feedBtn) feedBtn.click();
        }
      });
    }

    const btnWhere = container.querySelector("#kg-goto-where");
    if (btnWhere) {
      btnWhere.addEventListener("click", () => {
        startWhereIsGame();
      });
    }
  }

  /* =========================================================================
     JUEGO 1: 👂 ¿QUIÉN CANTA? (DISCRIMINACIÓN AUDITIVA 3+)
     ========================================================================= */
  function startWhoSingsGame() {
    whoState.round = 0;
    whoState.stars = 0;
    whoState.deck = shuffleArray(getBirdList().map(b => b.id));
    nextWhoSingsRound();
  }

  function nextWhoSingsRound() {
    const body = document.getElementById("kg-body-content");
    if (!body) return;

    if (whoState.stars >= whoState.maxRounds) {
      stopActiveQuizSong();
      playTrophyFanfare();
      body.innerHTML = `
        <div class="kg-trophy-box">
          <div class="kg-trophy-icon">🏆🌟</div>
          <div class="kg-trophy-title">¡Súper Oído Musical!</div>
          <div class="kg-trophy-sub">¡Adivinaste los 5 cantos de los pajaritos de Pinamar! 🐦🎶</div>
          <div style="font-size: 2rem; letter-spacing: 6px;">⭐⭐⭐⭐⭐</div>
          <button type="button" class="kg-play-again-btn" id="kg-who-restart">🌟 ¡Jugar Otra Vez!</button>
        </div>
        ${renderShortcutsHTML()}
      `;
      body.querySelector("#kg-who-restart").addEventListener("click", startWhoSingsGame);
      bindShortcutButtons(body);
      return;
    }

    whoState.answered = false;
    const birdsMap = getBirdsMap();
    const allIds = Object.keys(birdsMap);

    if (whoState.deck.length === 0) {
      whoState.deck = shuffleArray(allIds);
    }
    const targetId = whoState.deck.pop();
    whoState.targetId = targetId;

    const distractors = shuffleArray(allIds.filter(id => id !== targetId)).slice(0, 2);
    whoState.choices = shuffleArray([targetId, ...distractors]);

    const starsIcons = "⭐".repeat(whoState.stars) + "☆".repeat(Math.max(0, whoState.maxRounds - whoState.stars));

    body.innerHTML = `
      <div class="kg-status-bar">
        <div class="kg-stars-pill" id="kg-who-stars-pill">
          <span>${starsIcons}</span>
          <span>(${whoState.stars}/${whoState.maxRounds})</span>
        </div>
        <div class="kg-feedback-msg" id="kg-who-feedback">
          👂 ¡Escuchá el canto y tocá el pajarito que canta!
        </div>
      </div>

      <div class="kg-speaker-zone">
        <button type="button" class="kg-speaker-btn" id="kg-who-speaker-btn">
          <span style="font-size: 1.6rem;">🔊</span>
          <span>Escuchar de nuevo</span>
        </button>
      </div>

      <div class="kg-choices-grid" id="kg-who-choices">
        ${whoState.choices.map(cid => {
          const b = birdsMap[cid];
          return `
            <div class="kg-bird-card" data-bird-id="${b.id}" role="button" tabindex="0">
              <div class="kg-bird-card-img-wrap">
                <img class="kg-bird-card-img" src="${b.reposo}" alt="${b.name}">
              </div>
              <div class="kg-bird-card-name">${b.name}</div>
            </div>
          `;
        }).join("")}
      </div>

      ${renderShortcutsHTML()}
    `;

    document.getElementById("kg-who-speaker-btn").addEventListener("click", () => {
      playBirdSongSnippet(targetId, 4500);
    });

    body.querySelectorAll(".kg-bird-card").forEach(card => {
      card.addEventListener("click", () => {
        handleWhoChoiceTap(card);
      });
    });

    bindShortcutButtons(body);

    // Reproducir el canto automáticamente al abrir la ronda
    setTimeout(() => {
      const modal = document.getElementById("kids-games-modal");
      if (modal && modal.classList.contains("open") && currentTab === "who") {
        playBirdSongSnippet(targetId, 4500);
      }
    }, 30);
  }

  function handleWhoChoiceTap(cardEl) {
    if (whoState.answered) return;
    const chosenId = cardEl.getAttribute("data-bird-id");
    const birdsMap = getBirdsMap();
    const feedbackEl = document.getElementById("kg-who-feedback");

    if (chosenId === whoState.targetId) {
      whoState.answered = true;
      whoState.stars += 1;
      cardEl.classList.add("kg-card-correct");

      playSuccessSound();
      playBirdSongSnippet(chosenId, 1650);
      triggerBirdVoiceSafe(chosenId);

      const birdName = birdsMap[chosenId] ? birdsMap[chosenId].name : "Pajarito";
      if (feedbackEl) {
        feedbackEl.textContent = `🎉 ¡Muy bien! ¡Es el ${birdName}! ⭐`;
        feedbackEl.style.color = "#15803d";
      }

      const starsPill = document.getElementById("kg-who-stars-pill");
      if (starsPill) {
        const starsIcons = "⭐".repeat(whoState.stars) + "☆".repeat(Math.max(0, whoState.maxRounds - whoState.stars));
        starsPill.innerHTML = `<span>${starsIcons}</span><span>(${whoState.stars}/${whoState.maxRounds})</span>`;
      }

      setTimeout(() => {
        const modal = document.getElementById("kids-games-modal");
        if (modal && modal.classList.contains("open") && currentTab === "who") {
          nextWhoSingsRound();
        }
      }, 1900);
    } else {
      cardEl.classList.remove("kg-card-wrong");
      void cardEl.offsetWidth;
      cardEl.classList.add("kg-card-wrong");
      playSoftErrorSound();
      if (feedbackEl) {
        feedbackEl.textContent = "¡Casi! Probá con otro pajarito 🐦";
        feedbackEl.style.color = "#c2410c";
      }
    }
  }

  /* =========================================================================
     JUEGO 2: 🃏 MEMORIA DE PAJARITOS (MEMOTEST VISUAL Y SONORO 3+)
     ========================================================================= */
  function startMemoryGame(pairCount) {
    stopActiveQuizSong();
    if (pairCount) memState.pairCount = pairCount;
    memState.flippedIndices = [];
    memState.matchedBirdIds = new Set();
    memState.locked = false;

    const pickedBirds = shuffleArray(getBirdList()).slice(0, memState.pairCount);
    const pairCards = [];
    pickedBirds.forEach(b => {
      pairCards.push({ id: b.id, name: b.name, reposo: b.reposo });
      pairCards.push({ id: b.id, name: b.name, reposo: b.reposo });
    });
    memState.cards = shuffleArray(pairCards);

    renderMemoryBoard();
  }

  function renderMemoryBoard() {
    const body = document.getElementById("kg-body-content");
    if (!body) return;

    const matchedCount = memState.matchedBirdIds.size;
    const totalPairs = memState.pairCount;

    if (matchedCount >= totalPairs) {
      playTrophyFanfare();
      body.innerHTML = `
        <div class="kg-trophy-box">
          <div class="kg-trophy-icon">🏆🃏</div>
          <div class="kg-trophy-title">¡Memoria de Campeón!</div>
          <div class="kg-trophy-sub">¡Encontraste todas las ${totalPairs} parejas de pajaritos! 🎉</div>
          <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
            <button type="button" class="kg-play-again-btn" id="kg-mem-again-3">🐣 Jugar 6 Cartas (3+)</button>
            <button type="button" class="kg-play-again-btn" id="kg-mem-again-6" style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);">🦅 Jugar 12 Cartas (5+)</button>
          </div>
        </div>
        ${renderShortcutsHTML()}
      `;
      body.querySelector("#kg-mem-again-3").addEventListener("click", () => startMemoryGame(3));
      body.querySelector("#kg-mem-again-6").addEventListener("click", () => startMemoryGame(6));
      bindShortcutButtons(body);
      return;
    }

    body.innerHTML = `
      <div class="kg-status-bar">
        <div class="kg-memory-controls">
          <button type="button" class="kg-diff-btn ${totalPairs === 3 ? "active" : ""}" id="kg-diff-3">
            🐣 Pequeños (3+ años · 6 cartas)
          </button>
          <button type="button" class="kg-diff-btn ${totalPairs === 6 ? "active" : ""}" id="kg-diff-6">
            🦅 Exploradores (5+ años · 12 cartas)
          </button>
        </div>
        <div class="kg-stars-pill" id="kg-mem-score">
          ⭐ Parejas: ${matchedCount} / ${totalPairs}
        </div>
      </div>

      <div class="kg-memory-grid pairs-${totalPairs}" id="kg-mem-grid">
        ${memState.cards.map((c, idx) => {
          const isMatched = memState.matchedBirdIds.has(c.id);
          const isFlipped = memState.flippedIndices.includes(idx);
          return `
            <div class="kg-mem-card ${isFlipped ? "flipped" : ""} ${isMatched ? "matched" : ""}" data-idx="${idx}">
              <div class="kg-mem-inner">
                <div class="kg-mem-face kg-mem-front">🐣</div>
                <div class="kg-mem-face kg-mem-back">
                  <img class="kg-mem-img" src="${c.reposo}" alt="${c.name}">
                  <div class="kg-mem-name">${c.name}</div>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>

      ${renderShortcutsHTML()}
    `;

    body.querySelector("#kg-diff-3").addEventListener("click", () => startMemoryGame(3));
    body.querySelector("#kg-diff-6").addEventListener("click", () => startMemoryGame(6));

    body.querySelectorAll(".kg-mem-card").forEach(cardEl => {
      cardEl.addEventListener("click", () => {
        const idx = parseInt(cardEl.getAttribute("data-idx"), 10);
        handleMemoryCardTap(idx, cardEl);
      });
    });

    bindShortcutButtons(body);
  }

  function handleMemoryCardTap(idx, cardEl) {
    if (memState.locked) return;
    const cardData = memState.cards[idx];
    if (!cardData) return;
    if (memState.matchedBirdIds.has(cardData.id)) return;
    if (memState.flippedIndices.includes(idx)) return;

    playFlipSound();
    memState.flippedIndices.push(idx);
    cardEl.classList.add("flipped");

    if (memState.flippedIndices.length === 1) {
      playBirdSongSnippet(cardData.id, 1400);
    }

    if (memState.flippedIndices.length === 2) {
      memState.locked = true;
      const [i1, i2] = memState.flippedIndices;
      const c1 = memState.cards[i1];
      const c2 = memState.cards[i2];

      if (c1.id === c2.id) {
        // ¡Pareja encontrada!
        memState.matchedBirdIds.add(c1.id);
        memState.flippedIndices = [];
        memState.locked = false;

        playSuccessSound();
        playBirdSongSnippet(c1.id, 2600);
        triggerBirdVoiceSafe(c1.id);

        const grid = document.getElementById("kg-mem-grid");
        if (grid) {
          grid.querySelectorAll(`.kg-mem-card[data-idx="${i1}"], .kg-mem-card[data-idx="${i2}"]`).forEach(el => {
            el.classList.add("matched");
          });
        }
        const scoreEl = document.getElementById("kg-mem-score");
        if (scoreEl) {
          scoreEl.textContent = `⭐ Parejas: ${memState.matchedBirdIds.size} / ${memState.pairCount}`;
        }

        if (memState.matchedBirdIds.size >= memState.pairCount) {
          setTimeout(() => {
            const modal = document.getElementById("kids-games-modal");
            if (modal && modal.classList.contains("open") && currentTab === "memory") {
              renderMemoryBoard();
            }
          }, 1400);
        }
      } else {
        // No coinciden: dar tiempo al niño para observar ambos pajaritos y voltear
        setTimeout(() => {
          const grid = document.getElementById("kg-mem-grid");
          if (grid) {
            grid.querySelectorAll(`.kg-mem-card[data-idx="${i1}"], .kg-mem-card[data-idx="${i2}"]`).forEach(el => {
              el.classList.remove("flipped");
            });
          }
          memState.flippedIndices = [];
          memState.locked = false;
        }, 950);
      }
    }
  }

  /* =========================================================================
     JUEGO 3: 🕵️ ¿DÓNDE ESTÁ? (BÚSQUEDA VISUAL EN EL PAISAJE 3+)
     ========================================================================= */
  function clearAllHintRings() {
    document.querySelectorAll(".bird-perch.kg-target-hint-ring").forEach(el => {
      el.classList.remove("kg-target-hint-ring");
    });
  }

  function startWhereIsGame() {
    ensureDomCreated();
    stopActiveQuizSong();

    // Cerrar el modal para jugar directamente sobre el paisaje interactivo
    const modal = document.getElementById("kids-games-modal");
    if (modal) modal.classList.remove("open");

    // Desactivar modo Dar de Comer si estuviera activo para evitar colisión
    if (typeof feedMode !== "undefined" && feedMode && typeof toggleFeedMode === "function") {
      toggleFeedMode();
    }

    // Asegurar que todas las 15 aves estén presentes en sus perchas
    if (typeof hasFlown !== "undefined" && typeof recallAllBirds === "function") {
      if (Object.keys(hasFlown).some(id => hasFlown[id])) {
        recallAllBirds();
      }
    }

    if (typeof resetZoom === "function") {
      resetZoom();
    }

    whereState.active = true;
    whereState.stars = 0;
    whereState.waitingNext = false;
    whereState.deck = shuffleArray(getBirdList().map(b => b.id));

    const hud = document.getElementById("kids-where-hud");
    if (hud) hud.classList.add("active");

    pickNextWhereBird();
  }

  function stopWhereIsGame() {
    whereState.active = false;
    whereState.waitingNext = false;
    if (whereState.nextTimer) {
      clearTimeout(whereState.nextTimer);
      whereState.nextTimer = null;
    }
    clearAllHintRings();
    const hud = document.getElementById("kids-where-hud");
    if (hud) hud.classList.remove("active");
    if (typeof resetZoom === "function") {
      resetZoom();
    }
  }

  function pickNextWhereBird() {
    clearAllHintRings();
    whereState.waitingNext = false;

    const birdsMap = getBirdsMap();
    const allIds = Object.keys(birdsMap);
    if (whereState.deck.length === 0) {
      whereState.deck = shuffleArray(allIds);
    }

    const targetId = whereState.deck.pop();
    whereState.targetId = targetId;
    const bird = birdsMap[targetId];
    if (!bird) return;

    const imgEl = document.getElementById("kg-where-img");
    const promptEl = document.getElementById("kg-where-prompt");
    const starsEl = document.getElementById("kg-where-stars");

    if (imgEl) {
      imgEl.src = bird.reposo;
      imgEl.alt = bird.name;
    }
    if (promptEl) {
      promptEl.textContent = `🔍 ¡Buscá y tocá al ${bird.name} en el paisaje!`;
      promptEl.style.color = "#1e293b";
    }
    if (starsEl) {
      starsEl.textContent = `⭐ ${whereState.stars} / ${whereState.maxRounds} encontrados`;
    }

    playBirdSongSnippet(targetId, 2400);
    triggerBirdVoiceSafe(targetId);
  }

  function giveWhereHint() {
    if (!whereState.active || !whereState.targetId) return;
    const targetId = whereState.targetId;
    const birdsMap = getBirdsMap();
    const bird = birdsMap[targetId];

    clearAllHintRings();
    const perch = document.getElementById(`perch-${targetId}`);
    if (perch) {
      perch.classList.add("kg-target-hint-ring");
    }

    if (typeof zoomToBird === "function") {
      zoomToBird(targetId);
    }

    playBirdSongSnippet(targetId, 2800);

    const promptEl = document.getElementById("kg-where-prompt");
    if (promptEl && bird) {
      promptEl.textContent = `💡 ¡Miralo ahí brillando! ¡Tocá al ${bird.name}!`;
      promptEl.style.color = "#d97706";
    }
  }

  let landscapeWhereBound = false;
  function bindLandscapeWhereListener() {
    if (landscapeWhereBound) return;
    landscapeWhereBound = true;

    const stageEl = document.getElementById("world-stage") || document;
    stageEl.addEventListener("pointerdown", e => {
      if (!whereState.active) return;
      const perch = e.target && e.target.closest ? e.target.closest(".bird-perch") : null;
      if (!perch) return;

      const birdId = perch.id ? perch.id.replace("perch-", "") : null;
      if (!birdId) return;

      // Interceptar el toque en modo búsqueda para que no inicie arrastre ni vuele por error
      e.stopPropagation();

      if (whereState.waitingNext) return;

      const birdsMap = getBirdsMap();
      const tappedBird = birdsMap[birdId];
      const targetBird = birdsMap[whereState.targetId];
      const promptEl = document.getElementById("kg-where-prompt");
      const starsEl = document.getElementById("kg-where-stars");

      if (birdId === whereState.targetId) {
        whereState.waitingNext = true;
        whereState.stars += 1;
        clearAllHintRings();

        playSuccessSound();
        playBirdSongSnippet(birdId, 2300);
        triggerBirdVoiceSafe(birdId);

        if (typeof zoomToBird === "function") {
          zoomToBird(birdId);
        }
        if (typeof showBirdToast === "function") {
          showBirdToast(birdId);
        }
        if (typeof spawnMusicNote === "function") {
          spawnMusicNote(birdId);
          setTimeout(() => spawnMusicNote(birdId), 250);
        }

        if (promptEl && targetBird) {
          promptEl.textContent = `🎉 ¡Excelente! ¡Encontraste al ${targetBird.name}! ⭐`;
          promptEl.style.color = "#15803d";
        }
        if (starsEl) {
          starsEl.textContent = `⭐ ${whereState.stars} / ${whereState.maxRounds} encontrados`;
        }

        whereState.nextTimer = setTimeout(() => {
          if (!whereState.active) return;
          if (whereState.stars >= whereState.maxRounds) {
            stopWhereIsGame();
            openKidsGamesModal("where-win");
          } else {
            if (typeof resetZoom === "function") {
              resetZoom();
            }
            setTimeout(() => {
              if (whereState.active) pickNextWhereBird();
            }, 450);
          }
        }, 2100);
      } else {
        playSoftErrorSound();
        if (promptEl && tappedBird && targetBird) {
          promptEl.textContent = `¡Ese es el ${tappedBird.name}! Buscá al ${targetBird.name} 🔍`;
          promptEl.style.color = "#c2410c";
        }
      }
    }, true);

    stageEl.addEventListener("click", e => {
      if (!whereState.active) return;
      const perch = e.target && e.target.closest ? e.target.closest(".bird-perch") : null;
      if (perch) {
        e.stopPropagation();
        e.preventDefault();
      }
    }, true);
  }

  function renderWhereWinScreen() {
    const body = document.getElementById("kg-body-content");
    if (!body) return;
    playTrophyFanfare();
    body.innerHTML = `
      <div class="kg-trophy-box">
        <div class="kg-trophy-icon">🏆🕵️</div>
        <div class="kg-trophy-title">¡Gran Explorador de Pinamar!</div>
        <div class="kg-trophy-sub">¡Encontraste a los 5 pajaritos escondidos en el paisaje! 🌲🏖️</div>
        <div style="font-size: 2rem; letter-spacing: 6px;">⭐⭐⭐⭐⭐</div>
        <button type="button" class="kg-play-again-btn" id="kg-where-again">🔍 ¡Buscar Más Pajaritos!</button>
      </div>
      ${renderShortcutsHTML()}
    `;
    body.querySelector("#kg-where-again").addEventListener("click", () => {
      startWhereIsGame();
    });
    bindShortcutButtons(body);
  }

  /* =========================================================================
     NAVEGACIÓN DE PESTAÑAS Y APERTURA / CIERRE GLOBAL DEL MODAL
     ========================================================================= */
  function switchKidsTab(tabName) {
    ensureDomCreated();
    stopActiveQuizSong();

    if (tabName === "where") {
      startWhereIsGame();
      return;
    }

    const modal = document.getElementById("kids-games-modal");
    if (modal) {
      modal.querySelectorAll(".kg-tab-btn").forEach(btn => {
        const bTab = btn.getAttribute("data-tab");
        btn.classList.toggle("active", bTab === tabName || (tabName === "where-win" && bTab === "where"));
      });
    }

    if (tabName === "where-win") {
      currentTab = "where";
      renderWhereWinScreen();
    } else if (tabName === "memory" || tabName === "memoria") {
      currentTab = "memory";
      startMemoryGame(memState.pairCount || 3);
    } else {
      currentTab = "who";
      startWhoSingsGame();
    }
  }

  function openKidsGamesModal(initialTab) {
    ensureDomCreated();
    stopWhereIsGame();

    // Si estaba abierto el menú hamburguesa, cerrarlo suavemente
    const menuModal = document.getElementById("menu-modal");
    if (menuModal && menuModal.classList.contains("open")) {
      menuModal.classList.remove("open");
    }

    if (initialTab === "where" || initialTab === "donde") {
      startWhereIsGame();
      return;
    }

    const modal = document.getElementById("kids-games-modal");
    if (modal) {
      modal.classList.add("open");
    }

    switchKidsTab(initialTab || currentTab || "who");
  }

  function closeKidsGamesModal() {
    stopActiveQuizSong();
    const modal = document.getElementById("kids-games-modal");
    if (modal) {
      modal.classList.remove("open");
    }
  }

  // Exponer API global requerida
  window.openKidsGamesModal = openKidsGamesModal;
  window.closeKidsGamesModal = closeKidsGamesModal;

  // Inicializar DOM al cargar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureDomCreated);
  } else {
    ensureDomCreated();
  }
})();
