from PIL import Image
import numpy as np
import os

out_dir = r"C:\Users\srisa\.gemini\antigravity-ide\scratch\gaming\public\images\battleship"
files = [
    "dodgem_isometric_view.png",
    "dodgem_front_view.png",
    "dodgem_side_view.png",
    "dodgem_rear_view.png",
    "dodgem_top_view.png"
]

for filename in files:
    filepath = os.path.join(out_dir, filename)
    if not os.path.exists(filepath):
        continue
    img = Image.open(filepath).convert("RGBA")
    data = np.array(img)
    
    # Check dimensions
    h, w, c = data.shape
    print(f"Processing {filename}: {w}x{h}")

print("Image analysis complete!")
