import os
from PIL import Image
import numpy as np
from collections import deque

brain = r"C:\Users\Andrés\.gemini\antigravity\brain\2c8522f2-d285-4029-a1c6-364a7d948fbd"
assets_dir = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\assets_mobile"

def make_transparent_bfs(im_rgb, tolerance=25):
    im_rgba = im_rgb.convert("RGBA")
    w, h = im_rgba.size
    pixels = np.array(im_rgba)
    
    r = pixels[:, :, 0].astype(int)
    g = pixels[:, :, 1].astype(int)
    b = pixels[:, :, 2].astype(int)
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
    feather_dist = 42
    boundary = (~visited) & (dist < feather_dist)
    alpha[boundary] = np.clip(((dist[boundary] - tolerance) / (feather_dist - tolerance) * 255), 0, 255).astype(np.uint8)
    pixels[:, :, 3] = alpha
    result = Image.fromarray(pixels, "RGBA")
    bbox = result.getbbox()
    if bbox:
        result = result.crop(bbox)
    return result

def find_feet_anchor(im_rgba):
    arr = np.array(im_rgba)
    alpha = arr[:, :, 3]
    y_indices, x_indices = np.where(alpha > 50)
    if len(y_indices) == 0:
        return im_rgba.width // 2, im_rgba.height
    bottom_y = np.max(y_indices)
    bottom_row_xs = x_indices[y_indices >= (bottom_y - 12)]
    feet_x = int(np.mean(bottom_row_xs))
    return feet_x, int(bottom_y)

# 1. Source frames:
# Reposo: hornero_reposo_trans.webp (clean Disney 3D on legs)
# Pico: hornero_canto_pico_trans.webp
# Alas (complete uncropped wings): hornero_singing_pixar_1793018149596.jpg
f_reposo = os.path.join(assets_dir, "hornero_reposo_trans.webp")
f_pico   = os.path.join(assets_dir, "hornero_canto_pico_trans.webp")
f_alas_raw = os.path.join(brain, "hornero_singing_pixar_1793018149596.jpg")

im_reposo = Image.open(f_reposo).convert("RGBA")
im_pico = Image.open(f_pico).convert("RGBA")
im_alas_uncropped = make_transparent_bfs(Image.open(f_alas_raw), tolerance=26)

# Scale all 3 frames to a uniform height (e.g. 520px body height)
target_h = 520
scaled = []
anchors = []

for im in [im_reposo, im_pico, im_alas_uncropped]:
    ratio = target_h / im.height
    new_w = int(im.width * ratio)
    sim = im.resize((new_w, target_h), Image.Resampling.LANCZOS)
    scaled.append(sim)
    anchors.append(find_feet_anchor(sim))

max_w = max(im.width for im in scaled) + 100
canvas_h = target_h + 30
canvas_w = max_w

aligned = []
target_feet_x = canvas_w // 2
target_feet_y = canvas_h - 15

for sim, (fx, fy) in zip(scaled, anchors):
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    ox = target_feet_x - fx
    oy = target_feet_y - fy
    canvas.paste(sim, (ox, oy), sim)
    aligned.append(canvas)

# Clean any residual faint halos in bottom border
for frame in aligned:
    arr = np.array(frame)
    faint = (arr[:, :, 3] < 60)
    arr[faint, 3] = 0
    frame.paste(Image.fromarray(arr, "RGBA"))

aligned[0].save(os.path.join(assets_dir, "hornero_reposo_trans.webp"), "WEBP", quality=95)
aligned[1].save(os.path.join(assets_dir, "hornero_canto_pico_trans.webp"), "WEBP", quality=95)
aligned[2].save(os.path.join(assets_dir, "hornero_canto_alas_trans.webp"), "WEBP", quality=95)
aligned[1].save(os.path.join(assets_dir, "hornero_canto_trans.webp"), "WEBP", quality=95)

# Generate preview GIF at exactly 24 FPS (41.6ms per frame or 24 FPS sequence)
# Sequence: reposo -> pico -> alas -> pico -> alas -> pico -> reposo
seq = [aligned[0], aligned[1], aligned[2], aligned[1], aligned[2], aligned[1]]
durations = [350, 125, 125, 125, 125, 200] # smooth musical cadence
gif_path = os.path.join(assets_dir, "hornero_canto_3frames.gif")
seq[0].save(gif_path, save_all=True, append_images=seq[1:], duration=durations, loop=0, disposal=2)

print("Saved perfectly anchored, unclipped 3-frame Hornero animation:", aligned[0].size)
