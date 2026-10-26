import os
import collections
from PIL import Image

BRAIN_DIR = r"C:\Users\Andrés\.gemini\antigravity\brain\2c8522f2-d285-4029-a1c6-364a7d948fbd"
DEST_MOBILE = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\assets_mobile"
DEST_POKE = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\assets_pokemon"

def make_cutout(img_path, out_path, max_dim=512):
    img = Image.open(img_path).convert("RGBA")
    w, h = img.size
    pixels = img.load()
    
    visited = bytearray(w * h)
    queue = collections.deque()
    
    for x in range(w):
        queue.append((x, 0))
        queue.append((x, h - 1))
    for y in range(h):
        queue.append((0, y))
        queue.append((w - 1, y))
        
    def is_bg(r, g, b):
        return r > 230 and g > 230 and b > 230 and max(abs(r - g), abs(r - b), abs(g - b)) < 22
        
    bg = bytearray(w * h)
    while queue:
        x, y = queue.popleft()
        idx = y * w + x
        if visited[idx]:
            continue
        visited[idx] = 1
        r, g, b, a = pixels[x, y]
        if is_bg(r, g, b):
            bg[idx] = 1
            if x > 0: queue.append((x - 1, y))
            if x < w - 1: queue.append((x + 1, y))
            if y > 0: queue.append((x, y - 1))
            if y < h - 1: queue.append((x, y + 1))
            
    for y in range(h):
        for x in range(w):
            if bg[y * w + x]:
                pixels[x, y] = (0, 0, 0, 0)
                
    bbox = img.split()[-1].getbbox()
    if bbox:
        img = img.crop(bbox)
        
    m = max(img.size)
    if m > max_dim:
        scale = max_dim / m
        new_size = (int(img.width * scale), int(img.height * scale))
        img = img.resize(new_size, Image.Resampling.LANCZOS)
        
    img.save(out_path, "WEBP", quality=90)
    print(f"Saved cutout: {out_path} ({img.size})")

# 1. Hornero Disney (no nest)
p_hornero_disney = os.path.join(BRAIN_DIR, "hornero_disney_pixar_1793015052908.jpg")
make_cutout(p_hornero_disney, os.path.join(DEST_MOBILE, "hornero_reposo_trans.webp"))
make_cutout(p_hornero_disney, os.path.join(DEST_MOBILE, "hornero_canto_trans.webp"))

# 2. Hornero Pokemon (no nest)
p_hornero_poke = os.path.join(BRAIN_DIR, "hornero_pokemon_sugimori_1793015065166.jpg")
make_cutout(p_hornero_poke, os.path.join(DEST_POKE, "hornero_pokemon.webp"))
im_hp_raw = Image.open(p_hornero_poke).convert("RGB")
im_hp_raw.save(os.path.join(DEST_POKE, "raw", "hornero_card.jpg"), "JPEG", quality=90)

# 3. Tordo Disney
p_tordo_disney = os.path.join(BRAIN_DIR, "tordo_renegrido_pixar_1793015033693.jpg")
make_cutout(p_tordo_disney, os.path.join(DEST_MOBILE, "tordo_reposo_trans.webp"))
make_cutout(p_tordo_disney, os.path.join(DEST_MOBILE, "tordo_canto_trans.webp"))

# 4. Tordo Pokemon
p_tordo_poke = os.path.join(BRAIN_DIR, "tordo_renegrido_fakemon_1793015063832.jpg")
make_cutout(p_tordo_poke, os.path.join(DEST_POKE, "tordo_pokemon.webp"))
im_tp_raw = Image.open(p_tordo_poke).convert("RGB")
im_tp_raw.save(os.path.join(DEST_POKE, "raw", "tordo_card.jpg"), "JPEG", quality=90)

print("All sprites processed successfully!")
