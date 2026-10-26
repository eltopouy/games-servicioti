import os
from PIL import Image
import numpy as np
from collections import deque

brain = r"C:\Users\Andrés\.gemini\antigravity\brain\2c8522f2-d285-4029-a1c6-364a7d948fbd"
assets_dir = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\assets_mobile"
tools_dir = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\tools"

def make_transparent_bfs(im_rgb, tolerance=25):
    """
    Flood fills from corners on white background to avoid removing white reflections inside the eyes/body.
    Tolerance: distance from (255, 255, 255).
    """
    im_rgba = im_rgb.convert("RGBA")
    w, h = im_rgba.size
    pixels = np.array(im_rgba)
    
    # R, G, B channels
    r = pixels[:, :, 0].astype(int)
    g = pixels[:, :, 1].astype(int)
    b = pixels[:, :, 2].astype(int)
    
    # Difference from white
    dist = np.maximum(np.maximum(255 - r, 255 - g), 255 - b)
    is_white = dist < tolerance
    
    visited = np.zeros((h, w), dtype=bool)
    queue = deque()
    
    # Add borders
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
                    
    # Transparent where visited
    alpha = pixels[:, :, 3]
    alpha[visited] = 0
    
    # Soft feathering at the boundary
    feather_dist = 40
    boundary = (~visited) & (dist < feather_dist)
    # Blend alpha
    alpha[boundary] = np.clip(((dist[boundary] - tolerance) / (feather_dist - tolerance) * 255), 0, 255).astype(np.uint8)
    
    pixels[:, :, 3] = alpha
    result = Image.fromarray(pixels, "RGBA")
    
    # Crop to bounding box
    bbox = result.getbbox()
    if bbox:
        result = result.crop(bbox)
    return result

# 1. Process Individual Frames:
f_pico = os.path.join(brain, "hornero_pixar_singing_1793018151786.jpg")
f_alas = os.path.join(brain, "hornero_singing_pixar_1793018149596.jpg")
f_sheet = os.path.join(brain, "rufous_hornero_spritesheet_png_1793018157578.jpg")

print("Processing individual frames...")
im_pico = Image.open(f_pico)
trans_pico = make_transparent_bfs(im_pico, tolerance=28)
trans_pico.save(os.path.join(assets_dir, "hornero_anim_pico.webp"), "WEBP", quality=92)
print("Saved hornero_anim_pico.webp", trans_pico.size)

im_alas = Image.open(f_alas)
trans_alas = make_transparent_bfs(im_alas, tolerance=28)
trans_alas.save(os.path.join(assets_dir, "hornero_anim_alas.webp"), "WEBP", quality=92)
print("Saved hornero_anim_alas.webp", trans_alas.size)

# Also check sheet frames:
sheet_img = Image.open(f_sheet)
sw, sh = sheet_img.size
print(f"Spritesheet size: {sw}x{sh}")
# Sheet has 3 columns:
col_w = sw // 3
frame1_raw = sheet_img.crop((0, 0, col_w, sh))
frame2_raw = sheet_img.crop((col_w, 0, col_w*2, sh))
frame3_raw = sheet_img.crop((col_w*2, 0, sw, sh))

s_reposo = make_transparent_bfs(frame1_raw, tolerance=28)
s_pico = make_transparent_bfs(frame2_raw, tolerance=28)
s_alas = make_transparent_bfs(frame3_raw, tolerance=28)

s_reposo.save(os.path.join(assets_dir, "hornero_sheet_reposo.webp"), "WEBP", quality=92)
s_pico.save(os.path.join(assets_dir, "hornero_sheet_pico.webp"), "WEBP", quality=92)
s_alas.save(os.path.join(assets_dir, "hornero_sheet_alas.webp"), "WEBP", quality=92)

print("Saved spritesheet cutouts:", s_reposo.size, s_pico.size, s_alas.size)
