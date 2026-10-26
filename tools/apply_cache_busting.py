import re

path = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\index.html"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add meta cache control tags in head
if '<meta http-equiv="Cache-Control"' not in content:
    meta_tags = """<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
"""
    content = content.replace('<meta name="theme-color" content="#0c1017">', '<meta name="theme-color" content="#0c1017">\n' + meta_tags)

# 2. Update initial bird <img> tags to have ?v=7
for bird in ["cotorra", "hornero", "benteveo", "gaviota", "cardenal", "zorzal", "chingolo", "tero", "tordo"]:
    old_tag_pattern = rf'(<img id="img-{bird}"[^>]*src="[^"]+?)(\?v=\d+)?(")'
    content = re.sub(old_tag_pattern, rf'\1?v=7\3', content)

# 3. Update BIRDS dictionary to append ?v=7 to webp paths
# Replace reposo, canto, cantoPico, cantoAlas, pokemon
def replace_birds_block(match):
    block = match.group(0)
    # Strip existing ?v=... and add ?v=7 to .webp and .jpg
    block = re.sub(r'(\.(?:webp|jpg))(?:\?v=\d+)?', r'\1?v=7', block)
    return block

content = re.sub(r'const BIRDS = \{.*?\n  \};', replace_birds_block, content, flags=re.DOTALL)

# 4. Add "🔄 Actualizar" button in HUD bar
if 'id="btn-force-update"' not in content:
    hud_btn = """      <button id="btn-force-update" class="hud-btn" title="Forzar actualización y limpiar caché local">
        <span class="btn-icon">🔄</span>
        <span class="btn-text">Actualizar</span>
      </button>
"""
    # Insert before the last closing hud-group or before #btn-sound
    content = content.replace('<button id="btn-sound" class="hud-btn"', hud_btn + '      <button id="btn-sound" class="hud-btn"')

# 5. Add forceAppUpdate logic and aggressive Service Worker update script
sw_logic = """
  // Auto-Actualizador agresivo con limpieza de caché PWA
  const APP_DEPLOY_VERSION = '2026.10.26.v7.wings_and_grounded';
  if (localStorage.getItem('pajaritos_app_version') !== APP_DEPLOY_VERSION) {
    localStorage.setItem('pajaritos_app_version', APP_DEPLOY_VERSION);
    if ('caches' in window) {
      caches.keys().then((names) => {
        return Promise.all(names.map(name => caches.delete(name)));
      }).then(() => {
        console.log('Cachés locales purgadas con éxito.');
      });
    }
  }

  const btnForceUpdate = document.getElementById('btn-force-update');
  if (btnForceUpdate) {
    btnForceUpdate.addEventListener('click', () => {
      btnForceUpdate.style.transform = 'rotate(360deg)';
      btnForceUpdate.style.transition = 'transform 0.5s ease';
      if ('caches' in window) {
        caches.keys().then(names => Promise.all(names.map(n => caches.delete(n)))).then(() => {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(regs => {
              for (let reg of regs) reg.unregister();
              window.location.href = window.location.origin + window.location.pathname + '?reload=' + Date.now();
            });
          } else {
            window.location.href = window.location.origin + window.location.pathname + '?reload=' + Date.now();
          }
        });
      } else {
        window.location.reload(true);
      }
    });
  }

  // Registro de Service Worker para carga offline con chequeo de red inmediato
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js?v=7').then((reg) => {
        reg.update();
      }).catch(() => {});

      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    });
  }
"""

# Replace the old service worker registration block at the end of script
old_sw_block = re.search(r"// Registro de Service Worker.*?</script>", content, re.DOTALL)
if old_sw_block:
    content = content[:old_sw_block.start()] + sw_logic + "\n</script>" + content[old_sw_block.end():]

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Applied cache-busting to index.html successfully!")
