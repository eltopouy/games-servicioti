# -*- coding: utf-8 -*-
"""
slice_and_deploy_all_birds.py
Procesa los 8 spritesheets generados con Gemini Web (Imagen 3) según la investigación etológica:
1. Segmentación en 3 paneles (reposo, canto_pico, canto_alas).
2. Eliminación de fondo blanco con canal alfa suave y patas limpias.
3. Bloqueo de línea base de patas y centroide para eliminar vibración o saltos.
4. Exportación a assets_mobile como WebP optimizado.
5. Actualización de index.html y sw.js a v14.
"""

import os
import re
import numpy as np
from PIL import Image

BRAIN_DIR = r"C:\Users\Andrés\.gemini\antigravity\brain\2c8522f2-d285-4029-a1c6-364a7d948fbd"
DEST_DIR = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\assets_mobile"
INDEX_PATH = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\index.html"
SW_PATH = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\sw.js"

SHEETS = {
    'benteveo': os.path.join(BRAIN_DIR, 'benteveo_spritesheet_1793058905042.jpg'),
    'cardenal': os.path.join(BRAIN_DIR, 'cardinal_singing_spritesheet_1793058921520.jpg'),
    'tordo':    os.path.join(BRAIN_DIR, 'shiny_cowbird_spritesheet_1793058934217.jpg'),
    'zorzal':   os.path.join(BRAIN_DIR, 'zorzal_colorado_spritesheet_1793058941527.jpg'),
    'cotorra':  os.path.join(BRAIN_DIR, 'monk_parakeet_spritesheet_1793058960462.jpg'),
    'tero':     os.path.join(BRAIN_DIR, 'tero_animation_spritesheet_1793058975212.jpg'),
    'chingolo': os.path.join(BRAIN_DIR, 'chingolo_spritesheet_1793058989458.jpg'),
    'gaviota':  os.path.join(BRAIN_DIR, 'kelp_gull_spritesheet_1793058999532.jpg')
}

def make_trans(crop_im):
    arr = np.array(crop_im).astype(float)
    # White background thresholding with smooth feathering
    diff = 255.0 - np.minimum(np.minimum(arr[:, :, 0], arr[:, :, 1]), arr[:, :, 2])
    alpha = np.clip((diff - 6.0) * (255.0 / 22.0), 0, 255).astype(np.uint8)
    rgba = np.dstack((arr.astype(np.uint8), alpha))
    out = Image.fromarray(rgba, 'RGBA')
    bbox = out.getbbox()
    return out.crop(bbox) if bbox else out

for bird_id, sheet_path in SHEETS.items():
    if not os.path.exists(sheet_path):
        print(f"Error: No existe {sheet_path}")
        continue
    
    im = Image.open(sheet_path).convert('RGB')
    w, h = im.size
    
    # 3 equal thirds with small margin
    w_third = w // 3
    segs = [
        im.crop((0, 0, w_third, h)),
        im.crop((w_third, 0, w_third * 2, h)),
        im.crop((w_third * 2, 0, w, h))
    ]
    
    frames = [make_trans(s) for s in segs]
    
    max_w = max(f.width for f in frames) + 30
    max_h = max(f.height for f in frames) + 30
    
    aligned = []
    for f in frames:
        canvas = Image.new('RGBA', (max_w, max_h), (0, 0, 0, 0))
        px = (max_w - f.width) // 2
        py = max_h - f.height - 15  # Feet locked to bottom baseline
        canvas.paste(f, (px, py), f)
        aligned.append(canvas)
    
    # Preserve current wide wingspan as vuelo if not yet created
    vuelo_path = os.path.join(DEST_DIR, f"{bird_id}_vuelo_trans.webp")
    alas_old = os.path.join(DEST_DIR, f"{bird_id}_canto_alas_trans.webp")
    if os.path.exists(alas_old) and not os.path.exists(vuelo_path):
        Image.open(alas_old).save(vuelo_path, 'WEBP', quality=95)
    
    # Save 3 frames
    p_reposo = os.path.join(DEST_DIR, f"{bird_id}_reposo_trans.webp")
    p_pico = os.path.join(DEST_DIR, f"{bird_id}_canto_pico_trans.webp")
    p_canto = os.path.join(DEST_DIR, f"{bird_id}_canto_trans.webp")
    p_alas = os.path.join(DEST_DIR, f"{bird_id}_canto_alas_trans.webp")
    
    aligned[0].save(p_reposo, 'WEBP', quality=95)
    aligned[1].save(p_pico, 'WEBP', quality=95)
    aligned[1].save(p_canto, 'WEBP', quality=95)
    aligned[2].save(p_alas, 'WEBP', quality=95)
    
    print(f"Procesado exitosamente {bird_id}: reposo, canto_pico, canto_alas.")

# Actualizar index.html para configurar BIRDS con cantoPico y vuelo en todas las aves
with open(INDEX_PATH, 'r', encoding='utf-8') as f:
    html = f.read()

for b in ['tero', 'benteveo', 'cotorra', 'cardenal', 'zorzal', 'chingolo', 'gaviota', 'tordo']:
    # Añadir cantoPico y vuelo si no están
    target = f'canto: "assets_mobile/{b}_canto_trans.webp?v='
    # Ensure cantoPico exists
    if f'cantoPico: "assets_mobile/{b}_canto_pico_trans.webp' not in html:
        old_block = f'canto: "assets_mobile/{b}_canto_trans.webp?v=13",'
        new_block = f'canto: "assets_mobile/{b}_canto_pico_trans.webp?v=14",\n      cantoPico: "assets_mobile/{b}_canto_pico_trans.webp?v=14",\n      vuelo: "assets_mobile/{b}_vuelo_trans.webp?v=14",'
        html = html.replace(old_block, new_block)

# Actualizar startLipSyncEngine para que anime sutilmente a TODAS las aves con 3 frames
old_engine = """          // Para aves con 3 fotogramas de micro-animación sutil (Hornero)
          if (BIRDS[id].cantoAlas && BIRDS[id].cantoPico) {"""

new_engine = """          // Micro-animación sutil adaptada para todas las aves posadas
          if (BIRDS[id].cantoAlas && BIRDS[id].cantoPico) {"""

html = html.replace(old_engine, new_engine)

# Bump de versión v13 -> v14
html = html.replace("?v=13", "?v=14")
html = re.sub(r"const APP_DEPLOY_VERSION = '[^']+';", "const APP_DEPLOY_VERSION = '2026.10.26.v14.all_birds_ethological';", html)

with open(INDEX_PATH, 'w', encoding='utf-8') as f:
    f.write(html)

print("index.html actualizado con v14.")

# Actualizar sw.js
with open(SW_PATH, 'r', encoding='utf-8') as f:
    sw = f.read()

sw = re.sub(r"const CACHE_NAME = '[^']+';", "const CACHE_NAME = 'pajaritos-cache-v14-all-birds-ethological';", sw)
sw = sw.replace("?v=13", "?v=14")

# Añadir los nuevos archivos de vuelo y canto_pico al service worker
for b in ['benteveo', 'cardenal', 'tordo', 'zorzal', 'cotorra', 'tero', 'chingolo', 'gaviota']:
    entry_pico = f"  './assets_mobile/{b}_canto_pico_trans.webp?v=14',"
    entry_vuelo = f"  './assets_mobile/{b}_vuelo_trans.webp?v=14',"
    if entry_pico not in sw:
        sw = sw.replace("  './audio/canto_cotorra.mp3',", f"{entry_pico}\n{entry_vuelo}\n  './audio/canto_cotorra.mp3',")

with open(SW_PATH, 'w', encoding='utf-8') as f:
    f.write(sw)

print("sw.js actualizado con v14.")
