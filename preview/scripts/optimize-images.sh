#!/usr/bin/env bash
# Convierte las fotos de /img a webp multi-tamaño en site/assets/img/food/
# Uso: ./scripts/optimize-images.sh
set -euo pipefail
cd "$(dirname "$0")/../.."

SRC="img"
OUT="site/assets/img/food"
mkdir -p "$OUT"

python3 - "$SRC" "$OUT" <<'PY'
import sys, os, glob
from PIL import Image, ImageFilter

src, out = sys.argv[1], sys.argv[2]
files = sorted(glob.glob(os.path.join(src, "*.jpg")))
print(f"Procesando {len(files)} imagenes (thumbs IG -> upscale con sharpen)...")

def crisp(im, size):
    w, h = im.size
    scale = max(1.0, size / max(w, h))
    if scale > 1.0:
        im = im.resize((int(w*scale), int(h*scale)), Image.LANCZOS)
        im = im.filter(ImageFilter.UnsharpMask(radius=2, percent=80, threshold=3))
    return im

for i, f in enumerate(files, 1):
    name = f"food-{i:02d}"
    im = Image.open(f).convert("RGB")
    w, h = im.size
    target_ratio = 4/3
    ratio = w/h
    if ratio < target_ratio * 0.85:
        nh = int(w / target_ratio)
        top = max(0, (h - nh)//2)
        im = im.crop((0, top, w, top+nh))
    elif ratio > target_ratio * 1.25:
        nw = int(h * target_ratio)
        left = max(0, (w - nw)//2)
        im = im.crop((left, 0, left+nw, h))

    for label, size in [("hero", 1200), ("grid", 720), ("thumb", 360)]:
        tmp = crisp(im, size)
        tmp.save(os.path.join(out, f"{name}-{label}.webp"), "WEBP", quality=82, method=6)
        print(f"  {name}-{label}.webp {tmp.size[0]}x{tmp.size[1]}")
    og = crisp(im, 1200)
    og.save(os.path.join(out, f"{name}-og.jpg"), "JPEG", quality=86)
print("Listo.")
PY

echo "Imagenes optimizadas en $OUT"
