import os
import collections
from PIL import Image

BRAIN_DIR = r"C:\Users\Andrés\.gemini\antigravity\brain\2c8522f2-d285-4029-a1c6-364a7d948fbd"
DEST_DIR = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\assets_pokemon"
os.makedirs(DEST_DIR, exist_ok=True)
os.makedirs(os.path.join(DEST_DIR, "raw"), exist_ok=True)

BIRDS_DATA = [
    {
        "id": "hornero",
        "name": "Hornero",
        "poke_name": "Hornerox",
        "type": "Tierra / Volador",
        "file": "hornero_pokemon_1792975065098.jpg"
    },
    {
        "id": "tero",
        "name": "Tero",
        "poke_name": "Teroraptor",
        "type": "Lucha / Volador",
        "file": "tero_pokemon_1792975104763.jpg"
    },
    {
        "id": "benteveo",
        "name": "Benteveo",
        "poke_name": "Bentechú",
        "type": "Eléctrico / Volador",
        "file": "benteveo_pokemon_stylized_1792975130505.jpg"
    },
    {
        "id": "cotorra",
        "name": "Cotorra",
        "poke_name": "Cotorriff",
        "type": "Planta / Volador",
        "file": "cotorra_pokemon_clean_1792975139840.jpg"
    },
    {
        "id": "cardenal",
        "name": "Cardenal",
        "poke_name": "Cardeflame",
        "type": "Fuego / Volador",
        "file": "cardenal_pokemon_1792975121982.jpg"
    },
    {
        "id": "zorzal",
        "name": "Zorzal Colorado",
        "poke_name": "Zorzalson",
        "type": "Sonido / Volador",
        "file": "zorzal_colorado_pokemon_1792975129279.jpg"
    },
    {
        "id": "chingolo",
        "name": "Chingolo",
        "poke_name": "Chingolín",
        "type": "Normal / Volador",
        "file": "chingolo_pokemon_1792975136909.jpg"
    },
    {
        "id": "gaviota",
        "name": "Gaviota Cocinera",
        "poke_name": "Gaviotix",
        "type": "Agua / Volador",
        "file": "gaviota_cocinera_pokemon_1792975144141.jpg"
    }
]

def make_transparent_cutout(img_path, out_path):
    img = Image.open(img_path).convert("RGBA")
    w, h = img.size
    pixels = img.load()
    
    visited = bytearray(w * h)
    queue = collections.deque()
    
    # Border seed pixels
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
        
    # Resize max dimension to 512px for snappy loading
    max_dim = max(img.size)
    if max_dim > 512:
        scale = 512 / max_dim
        new_size = (int(img.width * scale), int(img.height * scale))
        img = img.resize(new_size, Image.Resampling.LANCZOS)
        
    img.save(out_path, "WEBP", quality=90)
    print(f"Processed cutout: {out_path} ({img.size})")

for b in BIRDS_DATA:
    src_p = os.path.join(BRAIN_DIR, b["file"])
    # 1. Raw card
    raw_dest = os.path.join(DEST_DIR, "raw", f"{b['id']}_card.jpg")
    img_raw = Image.open(src_p).convert("RGB")
    img_raw.save(raw_dest, "JPEG", quality=90)
    
    # 2. Transparent Sprite
    sprite_dest = os.path.join(DEST_DIR, f"{b['id']}_pokemon.webp")
    make_transparent_cutout(src_p, sprite_dest)

print("All 8 Pokemon bird sprites processed successfully!")
