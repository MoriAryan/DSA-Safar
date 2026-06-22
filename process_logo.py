import numpy as np
from PIL import Image
import sys

def process_logo(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)
    
    # R, G, B, A
    r = data[:,:,0].astype(float)
    g = data[:,:,1].astype(float)
    b = data[:,:,2].astype(float)
    a = data[:,:,3].astype(float)
    
    # We want to KEEP the red parts.
    # Red means R is significantly higher than G and B.
    # We can define a "redness" score: r - max(g, b)
    # Also, "white lines" have high R, high G, and high B. Their redness score will be low!
    redness = r - np.maximum(g, b)
    
    # Create a mask. If redness > 30, it's likely our red logo.
    # For smoothing, we can use an alpha channel based on redness.
    # Let's just do a sharp threshold first, or a soft blend.
    
    # Any pixel with redness < 40 becomes transparent.
    # White pixels: R=255, G=255, B=255 -> redness = 0 -> becomes transparent.
    # Black/gray pixels: R=G=B -> redness = 0 -> transparent.
    
    # Soft alpha mapping
    # redness < 20 -> alpha = 0
    # redness > 60 -> alpha = original alpha
    
    new_alpha = np.clip((redness - 20) / 40.0, 0, 1) * a
    data[:,:,3] = new_alpha.astype(np.uint8)
    
    # Also, we might want to boost the red color slightly where it's kept, 
    # but the original red is probably fine. To avoid any white fringes 
    # bleeding through on partial alpha pixels, we can force the RGB of ALL 
    # non-fully-transparent pixels to be pure red. But that might destroy some shading.
    # Let's just force the RGB to the original red color for pixels with partial alpha to prevent white fringes.
    # Average red color of highly red pixels:
    high_red_mask = redness > 50
    if np.any(high_red_mask):
        avg_r = np.mean(r[high_red_mask])
        avg_g = np.mean(g[high_red_mask])
        avg_b = np.mean(b[high_red_mask])
        
        # for pixels with low new_alpha (fringe), shift color towards avg red
        fringe_mask = (new_alpha > 0) & (new_alpha < 255)
        data[fringe_mask, 0] = avg_r
        data[fringe_mask, 1] = avg_g
        data[fringe_mask, 2] = avg_b

    Image.fromarray(data).save(output_path)
    print("Processed logo saved to", output_path)

if __name__ == "__main__":
    process_logo("public/logo.png", "public/logo_clean.png")
