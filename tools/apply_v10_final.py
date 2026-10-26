import re

html_path = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\index.html"
sw_path = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\sw.js"

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update version to v10 everywhere
html = re.sub(r'(\.(?:webp|jpg))\?v=\d+', r'\1?v=10', html)

# 2. Enhance Momento del Día in Hamburger Menu with 4 direct scenario pills
old_theme_card = r'<!-- 3\. Momento del Día / Escenario -->.*?<!-- 4\. Modo PokéAves -->'
new_theme_card = """<!-- 3. Momento del Día / Escenario -->
        <div class="menu-item-card" style="flex-direction: column; align-items: stretch;">
          <div class="menu-item-info">
            <span class="item-icon">🌅</span>
            <div>
              <strong>Escenario y Momento del Día</strong>
              <small id="theme-desc-text">Por defecto: Balneario Pinamar Escuela 295</small>
            </div>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px;">
            <button class="theme-select-btn active" data-theme-id="costa" type="button" style="background:#0284c7; color:#fff; padding:9px 6px; border-radius:12px; border:2px solid #38bdf8; font-weight:800; cursor:pointer; font-size:0.78rem; text-align:center;">🏖️ Balneario Escuela 295</button>
            <button class="theme-select-btn" data-theme-id="mediodia" type="button" style="background:#374151; color:#e5e7eb; padding:9px 6px; border-radius:12px; border:1.5px solid #4b5563; font-weight:700; cursor:pointer; font-size:0.78rem; text-align:center;">☀️ Tosca Mediodía</button>
            <button class="theme-select-btn" data-theme-id="atardecer" type="button" style="background:#374151; color:#e5e7eb; padding:9px 6px; border-radius:12px; border:1.5px solid #4b5563; font-weight:700; cursor:pointer; font-size:0.78rem; text-align:center;">🌇 Tosca Atardecer</button>
            <button class="theme-select-btn" data-theme-id="amanecer" type="button" style="background:#374151; color:#e5e7eb; padding:9px 6px; border-radius:12px; border:1.5px solid #4b5563; font-weight:700; cursor:pointer; font-size:0.78rem; text-align:center;">🌅 Tosca Amanecer</button>
          </div>
        </div>

        <!-- 4. Modo PokéAves -->"""

html = re.sub(old_theme_card, new_theme_card, html, flags=re.DOTALL)

# 3. Add JS logic for direct scenario pills
old_theme_js = r'const THEMES = \[.*?btnMaster\.addEventListener'
new_theme_js = """const THEMES = [
    { id: "costa", icon: "🏖️", name: "Balneario Pinamar Escuela 295" },
    { id: "mediodia", icon: "☀️", name: "Calle de Tosca - Mediodía" },
    { id: "atardecer", icon: "🌇", name: "Calle de Tosca - Atardecer" },
    { id: "amanecer", icon: "🌅", name: "Calle de Tosca - Amanecer" }
  ];
  let themeIndex = 0;

  function switchThemeTo(themeId) {
    const prev = THEMES[themeIndex].id;
    stage.classList.remove(`theme-${prev}`);
    const foundIdx = THEMES.findIndex(t => t.id === themeId);
    themeIndex = foundIdx >= 0 ? foundIdx : 0;
    const current = THEMES[themeIndex];
    stage.classList.add(`theme-${current.id}`);

    // Actualizar botones de selección en el menú
    document.querySelectorAll('.theme-select-btn').forEach(btn => {
      const isCurrent = btn.getAttribute('data-theme-id') === current.id;
      btn.style.background = isCurrent ? "#0284c7" : "#374151";
      btn.style.borderColor = isCurrent ? "#38bdf8" : "#4b5563";
      btn.style.borderWidth = isCurrent ? "2px" : "1.5px";
      btn.style.fontWeight = isCurrent ? "800" : "700";
    });

    const desc = document.getElementById("theme-desc-text");
    if (desc) desc.textContent = `Actual: ${current.name}`;

    showGlobalToast(`Escenario: ${current.name} ✨`);

    if (camera.isZoomed && camera.focusedBird) {
      setTimeout(() => zoomToBird(camera.focusedBird), 120);
    }
  }

  document.querySelectorAll('.theme-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tid = btn.getAttribute('data-theme-id');
      switchThemeTo(tid);
    });
  });

  const btnMaster = document.getElementById("btn-master");"""

html = re.sub(old_theme_js, new_theme_js + '\n  btnMaster.addEventListener', html, flags=re.DOTALL)

# 4. In HUD header, ensure Pinamar Aves is gone and HUD is clean
# Check if any brand link remains
html = re.sub(r'<a href="https://servicioti\.com\.uy"[^>]*>.*?</a>', '', html, flags=re.DOTALL)
html = re.sub(r'<span class="brand-badge">.*?</span>', '', html, flags=re.DOTALL)

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Updated index.html to v10 successfully!")

# Update sw.js CACHE_NAME to v10
with open(sw_path, "r", encoding="utf-8") as f:
    sw_code = f.read()

sw_code = re.sub(r'const CACHE_NAME = [^;]+;', "const CACHE_NAME = 'pajaritos-cache-v10-final';", sw_code)
sw_code = re.sub(r'\?v=\d+', '?v=10', sw_code)

with open(sw_path, "w", encoding="utf-8") as f:
    f.write(sw_code)

print("Updated sw.js to v10 successfully!")
