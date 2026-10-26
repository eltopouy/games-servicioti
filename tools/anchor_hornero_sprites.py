import os
from PIL import Image
import numpy as np

assets_dir = r"C:\Users\Andrés\.gemini\antigravity\scratch\games_servicioti\assets_mobile"

def find_feet_anchor(im_rgba):
    """
    Finds the bottom-most center point of non-transparent pixels (where the feet touch).
    """
    arr = np.array(im_rgba)
    alpha = arr[:, :, 3]
    y_indices, x_indices = np.where(alpha > 50)
    if len(y_indices) == 0:
        return im_rgba.width // 2, im_rgba.height
    bottom_y = np.max(y_indices)
    bottom_row_xs = x_indices[y_indices >= (bottom_y - 10)]
    feet_x = int(np.mean(bottom_row_xs))
    return feet_x, int(bottom_y)

def create_aligned_sprites(frame_files, output_prefix, target_h=600):
    """
    Aligns multiple frames onto an identical canvas dimensions such that
    the feet anchor is at the EXACT same pixel coordinate (cx, bottom - pad).
    """
    images = [Image.open(f).convert("RGBA") for f in frame_files]
    
    # Scale all to a consistent character height
    scaled_images = []
    anchors = []
    for im in images:
        ratio = target_h / im.height
        new_w = int(im.width * ratio)
        sim = im.resize((new_w, target_h), Image.Resampling.LANCZOS)
        scaled_images.append(sim)
        fx, fy = find_feet_anchor(sim)
        anchors.append((fx, fy))
        
    # Calculate required unified canvas
    max_w = max(im.width for im in scaled_images) + 120
    canvas_h = target_h + 40
    canvas_w = max_w
    
    aligned_frames = []
    target_feet_x = canvas_w // 2
    target_feet_y = canvas_h - 20
    
    for sim, (fx, fy) in zip(scaled_images, anchors):
        canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
        offset_x = target_feet_x - fx
        offset_y = target_feet_y - fy
        canvas.paste(sim, (offset_x, offset_y), sim)
        aligned_frames.append(canvas)
        
    for i, (name, frame) in enumerate(zip(["reposo", "pico", "alas"], aligned_frames)):
        out_path = os.path.join(assets_dir, f"{output_prefix}_{name}.webp")
        frame.save(out_path, "WEBP", quality=95)
        print(f"Saved aligned {out_path} ({frame.size})")
        
    # Also create an animated preview GIF to inspect the motion
    gif_path = os.path.join(assets_dir, f"{output_prefix}_anim_preview.gif")
    # Sequence: reposo -> pico -> alas -> pico -> alas -> pico -> reposo
    seq = [aligned_frames[0], aligned_frames[1], aligned_frames[2], aligned_frames[1], aligned_frames[2], aligned_frames[1]]
    durations = [350, 180, 220, 180, 220, 250]
    seq[0].save(gif_path, save_all=True, append_images=seq[1:], duration=durations, loop=0, disposal=2)
    print(f"Saved animation preview GIF: {gif_path}")

print("--- ALIGNING SPRITESHEET FRAMES ---")
create_aligned_sprites([
    os.path.join(assets_dir, "hornero_sheet_reposo.webp"),
    os.path.join(assets_dir, "hornero_sheet_pico.webp"),
    os.path.join(assets_dir, "hornero_sheet_alas.webp")
], "hornero_v3_sheet", target_h=550)

print("--- ALIGNING HIGH-RES INDIVIDUAL FRAMES ---")
create_aligned_sprites([
    os.path.join(assets_dir, "hornero_reposo_trans.webp"),
    os.path.join(assets_dir, "hornero_anim_pico.webp"),
    os.path.join(assets_dir, "hornero_anim_alas.webp")
], "hornero_v3_indiv", target_h=550)
