from PIL import Image
import os

source_path = r"C:\Users\srisa\.gemini\antigravity-ide\brain\4e9f428c-7f89-4bdd-b837-66eb699f33c3\.user_uploaded\media_1790016016207.png"
out_dir = r"C:\Users\srisa\.gemini\antigravity-ide\scratch\gaming\public\images\battleship"
os.makedirs(out_dir, exist_ok=True)

img = Image.open(source_path)
w, h = img.size
print(f"Original dimensions: {w}x{h}")

# The image is a grid with a header banner:
# Header banner: top ~0% to ~8%
# Row 1 (top half):
#   Col 1: blank / white
#   Col 2: 1. Front View (~30% to 66% width)
#   Col 3: 5. 3/4 Isometric View (~66% to 100% width)
# Row 2 (bottom half):
#   Col 1: 2. Side Profile View (~0% to 30% width)
#   Col 2: 3. Rear View (~30% to 50% width)
#   Col 3: 4. Top View (~50% to 66% width)
#   Col 4: 6. Exploded Component View (~66% to 100% width)

# Let's calculate precise box coordinates:
# Header is ~8.5% of height (y: 0 to h * 0.085)
# Row 1: y from h * 0.085 to h * 0.50
# Row 2: y from h * 0.50 to h * 1.0

# 1. Front View:
box_front = (int(w * 0.306), int(h * 0.085), int(w * 0.666), int(h * 0.50))
front_img = img.crop(box_front)
front_img.save(os.path.join(out_dir, "dodgem_front_view.png"))

# 2. Isometric 3/4 View:
box_iso = (int(w * 0.666), int(h * 0.085), int(w * 0.995), int(h * 0.50))
iso_img = img.crop(box_iso)
iso_img.save(os.path.join(out_dir, "dodgem_isometric_view.png"))

# 3. Side Profile View:
box_side = (int(w * 0.005), int(h * 0.50), int(w * 0.306), int(h * 0.995))
side_img = img.crop(box_side)
side_img.save(os.path.join(out_dir, "dodgem_side_view.png"))

# 4. Rear View:
box_rear = (int(w * 0.306), int(h * 0.50), int(w * 0.505), int(h * 0.995))
rear_img = img.crop(box_rear)
rear_img.save(os.path.join(out_dir, "dodgem_rear_view.png"))

# 5. Top View:
box_top = (int(w * 0.505), int(h * 0.50), int(w * 0.666), int(h * 0.995))
top_img = img.crop(box_top)
top_img.save(os.path.join(out_dir, "dodgem_top_view.png"))

# 6. Exploded Component View:
box_exploded = (int(w * 0.666), int(h * 0.50), int(w * 0.995), int(h * 0.995))
exploded_img = img.crop(box_exploded)
exploded_img.save(os.path.join(out_dir, "dodgem_exploded_view.png"))

# 7. Full Chart:
img.save(os.path.join(out_dir, "dodgem_full_technical_chart.png"))

print("All views cropped and saved successfully!")
