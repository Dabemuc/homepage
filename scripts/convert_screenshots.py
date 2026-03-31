#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow"]
# ///
"""
Convert PNGs in the same directory to 16:9 WebP at max 720p.
Pads to 16:9 with a black background, downscales if needed.
Outputs to ../public/screenshots/
"""

from pathlib import Path
from PIL import Image

TARGET_W, TARGET_H = 1280, 720
QUALITY = 85

script_dir = Path(__file__).parent
out_dir = script_dir.parent / "public" / "screenshots"
out_dir.mkdir(parents=True, exist_ok=True)

pngs = list(script_dir.glob("*.png"))
if not pngs:
    print("No PNG files found.")

for src in pngs:
    img = Image.open(src).convert("RGB")
    w, h = img.size

    # Determine canvas size that fits the image in 16:9
    if w / h >= TARGET_W / TARGET_H:
        # Image is wider — fit to width
        canvas_w = w
        canvas_h = round(w * TARGET_H / TARGET_W)
    else:
        # Image is taller — fit to height
        canvas_h = h
        canvas_w = round(h * TARGET_W / TARGET_H)

    # Pad to 16:9
    canvas = Image.new("RGB", (canvas_w, canvas_h), (0, 0, 0))
    offset_x = (canvas_w - w) // 2
    offset_y = (canvas_h - h) // 2
    canvas.paste(img, (offset_x, offset_y))

    # Downscale to 720p if larger
    if canvas_w > TARGET_W or canvas_h > TARGET_H:
        canvas = canvas.resize((TARGET_W, TARGET_H), Image.LANCZOS)

    dst = out_dir / src.with_suffix(".webp").name
    canvas.save(dst, "WEBP", quality=QUALITY)
    print(f"{src.name} -> {dst} ({canvas.size[0]}x{canvas.size[1]})")
