import os
from PIL import Image
import numpy as np
from collections import deque

brain = r"C:\Users\Andrés\.gemini\antigravity\brain\2c8522f2-d285-4029-a1c6-364a7d948fbd"
assets_dir = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\assets_mobile"

def make_transparent_clean(im_rgb, tolerance=24, crop=True):
    im_rgba = im_rgb.convert("RGBA")
    w, h = im_rgba.size
    pixels = np.array(im_rgba)
    
    r = pixels[:, :, 0].astype(int)
    g = pixels[:, :, 1].astype(int)
    b = pixels[:, :, 2].astype(int)
    
    # Distance from white (255, 255, 255)
    dist = np.maximum(np.maximum(255 - r, 255 - g), 255 - b)
    is_white = dist < tolerance
    
    visited = np.zeros((h, w), dtype=bool)
    queue = deque()
    
    for x in range(w):
        if is_white[0, x]: queue.append((0, x)); visited[0, x] = True
        if is_white[h-1, x]: queue.append((h-1, x)); visited[h-1, x] = True
    for y in range(h):
        if is_white[y, 0]: queue.append((y, 0)); visited[y, 0] = True
        if is_white[y, w-1]: queue.append((y, w-1)); visited[y, w-1] = True
        
    while queue:
        cy, cx = queue.popleft()
        for dy, dx in [(-1,0),(1,0),(0,-1),(0,1)]:
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                if is_white[ny, nx]:
                    visited[ny, nx] = True
                    queue.append((ny, nx))
                    
    alpha = pixels[:, :, 3]
    alpha[visited] = 0
    
    # Anti-aliasing feathering
    feather_dist = 42
    boundary = (~visited) & (dist < feather_dist)
    alpha[boundary] = np.clip(((dist[boundary] - tolerance) / (feather_dist - tolerance) * 255), 0, 255).astype(np.uint8)
    
    pixels[:, :, 3] = alpha
    result = Image.fromarray(pixels, "RGBA")
    
    if crop:
        bbox = result.getbbox()
        if bbox:
            result = result.crop(bbox)
    return result

# 1. TORDO (No branch, completely bare feet)
tordo_raw = Image.open(os.path.join(brain, "tordo_renegrido_disney_noshadow_1793020508605.jpg"))
tordo_clean = make_transparent_clean(tordo_raw, tolerance=22)
tordo_clean.save(os.path.join(assets_dir, "tordo_reposo_trans.webp"), "WEBP", quality=95)
tordo_clean.save(os.path.join(assets_dir, "tordo_canto_trans.webp"), "WEBP", quality=95)
print("Tordo saved:", tordo_clean.size)

# 2. BENTEVEO (No branch, bare feet)
benteveo_raw = Image.open(os.path.join(brain, "benteveo_pixar_character_1793020492232.jpg"))
benteveo_clean = make_transparent_clean(benteveo_raw, tolerance=25)
benteveo_clean.save(os.path.join(assets_dir, "benteveo_reposo_trans.webp"), "WEBP", quality=95)
benteveo_clean.save(os.path.join(assets_dir, "benteveo_canto_trans.webp"), "WEBP", quality=95)
print("Benteveo saved:", benteveo_clean.size)

# 3. CARDENAL (No branch, bare feet)
cardenal_raw = Image.open(os.path.join(brain, "uruguayan_cardenal_pixar_1793020501401.jpg"))
cardenal_clean = make_transparent_clean(cardenal_raw, tolerance=25)
cardenal_clean.save(os.path.join(assets_dir, "cardenal_reposo_trans.webp"), "WEBP", quality=95)
cardenal_clean.save(os.path.join(assets_dir, "cardenal_canto_trans.webp"), "WEBP", quality=95)
print("Cardenal saved:", cardenal_clean.size)

# 4. COTORRA (No branch, bare claws)
cotorra_raw = Image.open(os.path.join(brain, "uruguayan_cotorra_pixar_png_1793020502146.jpg"))
cotorra_clean = make_transparent_clean(cotorra_raw, tolerance=25)
cotorra_clean.save(os.path.join(assets_dir, "cotorra_reposo_trans.webp"), "WEBP", quality=95)
cotorra_clean.save(os.path.join(assets_dir, "cotorra_canto_trans.webp"), "WEBP", quality=95)
print("Cotorra saved:", cotorra_clean.size)

# 5. ZORZAL (Cut branch cleanly, keeping feet)
zorzal_orig = Image.open(os.path.join(assets_dir, "zorzal_reposo_trans.webp")).convert("RGBA")
z_arr = np.array(zorzal_orig)
zh, zw, _ = z_arr.shape
# Cut off the branch below 80% and remove leaves on left
cutoff_y = int(zh * 0.81)
z_arr[cutoff_y:, :, 3] = 0
# Remove the leafy branch on the bottom left (x < 35%, y > 50%)
for y in range(int(zh * 0.50), zh):
    for x in range(int(zw * 0.35)):
        # Greenish leaves: g > r and g > b
        if z_arr[y, x, 1] > z_arr[y, x, 0] and z_arr[y, x, 1] > z_arr[y, x, 2]:
            z_arr[y, x, 3] = 0
zorzal_clean = Image.fromarray(z_arr, "RGBA")
z_bbox = zorzal_clean.getbbox()
if z_bbox:
    zorzal_clean = zorzal_clean.crop(z_bbox)
zorzal_clean.save(os.path.join(assets_dir, "zorzal_reposo_trans.webp"), "WEBP", quality=95)
zorzal_clean.save(os.path.join(assets_dir, "zorzal_canto_trans.webp"), "WEBP", quality=95)
print("Zorzal cleaned without branch:", zorzal_clean.size)
