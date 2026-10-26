import os
from PIL import Image
import numpy as np

assets_dir = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\assets_mobile"

frames = {
    "reposo": os.path.join(assets_dir, "hornero_v3_sheet_reposo.webp"),
    "pico":   os.path.join(assets_dir, "hornero_v3_sheet_pico.webp"),
    "alas":   os.path.join(assets_dir, "hornero_v3_sheet_alas.webp")
}

cleaned_frames = {}

for key, path in frames.items():
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    
    # Clean any faint shadows (alpha > 0 but RGB very close to white or very low opacity)
    # in bottom 25 pixels
    h, w, _ = arr.shape
    bottom_strip = arr[h-25:h, :, :]
    
    # If alpha is below 70 in bottom strip, set alpha to 0
    faint_mask = (arr[:, :, 3] < 60)
    arr[faint_mask, 3] = 0
    
    # Also if color is nearly pure white (r>230, g>230, b>230) in borders, clear it
    white_halo = (arr[:, :, 0] > 235) & (arr[:, :, 1] > 235) & (arr[:, :, 2] > 235)
    arr[white_halo, 3] = 0
    
    cleaned = Image.fromarray(arr, "RGBA")
    cleaned_frames[key] = cleaned

# Save official assets
cleaned_frames["reposo"].save(os.path.join(assets_dir, "hornero_reposo_trans.webp"), "WEBP", quality=95)
cleaned_frames["pico"].save(os.path.join(assets_dir, "hornero_canto_pico_trans.webp"), "WEBP", quality=95)
cleaned_frames["alas"].save(os.path.join(assets_dir, "hornero_canto_alas_trans.webp"), "WEBP", quality=95)

# Also maintain backwards-compatibility for canto (points to pico or alas)
cleaned_frames["pico"].save(os.path.join(assets_dir, "hornero_canto_trans.webp"), "WEBP", quality=95)

# Also update the preview GIF with the cleaned frames
seq = [
    cleaned_frames["reposo"],
    cleaned_frames["pico"],
    cleaned_frames["alas"],
    cleaned_frames["pico"],
    cleaned_frames["alas"],
    cleaned_frames["pico"]
]
durations = [350, 180, 220, 180, 220, 220]
gif_path = os.path.join(assets_dir, "hornero_canto_3frames.gif")
seq[0].save(gif_path, save_all=True, append_images=seq[1:], duration=durations, loop=0, disposal=2)

print("Saved cleaned official frames and hornero_canto_3frames.gif successfully!")
