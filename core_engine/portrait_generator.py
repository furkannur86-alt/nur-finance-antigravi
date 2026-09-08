"""
NUR Finance — AI Anchor Portrait Generator

Generates professional broadcast-quality anchor portraits using Pillow.
Each host gets a unique portrait based on their appearance attributes.
Outputs 512x512 PNG with transparent background for compositing.
"""

from __future__ import annotations

import os
import math
import random
import hashlib
from PIL import Image, ImageDraw, ImageFont

SIZE = 512
HALF = SIZE // 2

SKIN_TONES = {
    "fair": (245, 220, 192), "light": (240, 208, 176), "medium": (212, 165, 116),
    "olive": (196, 149, 106), "tan": (184, 134, 90), "brown": (141, 99, 70),
    "deep": (92, 61, 46),
}

HAIR_COLORS = {
    "platinum-blonde": (232, 220, 200), "honey-blonde": (200, 160, 80),
    "golden-brown": (160, 112, 48), "auburn": (139, 58, 26),
    "copper-red": (180, 64, 32), "chestnut": (107, 52, 16),
    "ash-brown": (122, 106, 90), "dark-brown": (59, 32, 16),
    "walnut": (90, 58, 26), "mahogany": (92, 26, 10),
    "espresso": (42, 24, 8), "toffee": (138, 90, 42),
    "jet-black": (26, 26, 26), "midnight-black": (16, 16, 24),
    "raven": (10, 10, 18),
}

EYE_COLORS = {
    "brown": (101, 67, 33), "dark-brown": (59, 36, 20), "hazel": (128, 100, 50),
    "green": (45, 138, 94), "blue": (60, 100, 170), "gray": (130, 140, 150),
    "amber": (170, 120, 40), "black": (30, 25, 20),
}

HOST_APPEARANCES = {
    "host-victoria": {"skin": "fair", "hair": "auburn", "hair_style": "long-straight", "eyes": "green"},
    "host-elena": {"skin": "light", "hair": "dark-brown", "hair_style": "bob", "eyes": "brown"},
    "host-sarah": {"skin": "light", "hair": "honey-blonde", "hair_style": "long-wavy", "eyes": "blue"},
    "host-maya": {"skin": "medium", "hair": "jet-black", "hair_style": "long-straight", "eyes": "dark-brown"},
    "host-defne": {"skin": "olive", "hair": "dark-brown", "hair_style": "long-wavy", "eyes": "brown"},
    "host-zeynep": {"skin": "light", "hair": "chestnut", "hair_style": "bob", "eyes": "hazel"},
    "host-fatima": {"skin": "medium", "hair": "jet-black", "hair_style": "long-straight", "eyes": "dark-brown"},
    "host-nadia": {"skin": "olive", "hair": "dark-brown", "hair_style": "long-wavy", "eyes": "brown"},
    "host-katharina": {"skin": "fair", "hair": "honey-blonde", "hair_style": "bob", "eyes": "blue"},
    "host-lena": {"skin": "fair", "hair": "ash-brown", "hair_style": "long-straight", "eyes": "gray"},
    "host-eloise": {"skin": "light", "hair": "chestnut", "hair_style": "long-wavy", "eyes": "hazel"},
    "host-camille": {"skin": "light", "hair": "dark-brown", "hair_style": "bob", "eyes": "brown"},
    "host-misaki": {"skin": "light", "hair": "jet-black", "hair_style": "long-straight", "eyes": "dark-brown"},
    "host-mio": {"skin": "light", "hair": "midnight-black", "hair_style": "bob", "eyes": "dark-brown"},
    "host-mingyu": {"skin": "light", "hair": "jet-black", "hair_style": "long-straight", "eyes": "dark-brown"},
    "host-yuhan": {"skin": "light", "hair": "midnight-black", "hair_style": "bob", "eyes": "dark-brown"},
    "host-soyeon": {"skin": "light", "hair": "jet-black", "hair_style": "long-wavy", "eyes": "dark-brown"},
    "host-jiwon": {"skin": "light", "hair": "dark-brown", "hair_style": "bob", "eyes": "brown"},
    "host-ananya": {"skin": "tan", "hair": "jet-black", "hair_style": "long-wavy", "eyes": "dark-brown"},
    "host-priya": {"skin": "medium", "hair": "dark-brown", "hair_style": "long-straight", "eyes": "brown"},
    "host-isabella": {"skin": "medium", "hair": "dark-brown", "hair_style": "long-wavy", "eyes": "brown"},
    "host-carolina": {"skin": "olive", "hair": "espresso", "hair_style": "bob", "eyes": "dark-brown"},
    "host-valentina": {"skin": "olive", "hair": "dark-brown", "hair_style": "long-wavy", "eyes": "brown"},
    "host-lucia": {"skin": "medium", "hair": "jet-black", "hair_style": "long-straight", "eyes": "dark-brown"},
    "host-amara": {"skin": "brown", "hair": "jet-black", "hair_style": "short-natural", "eyes": "dark-brown"},
    "host-zara": {"skin": "deep", "hair": "jet-black", "hair_style": "bob", "eyes": "dark-brown"},
    "host-mei-lin": {"skin": "light", "hair": "jet-black", "hair_style": "long-straight", "eyes": "dark-brown"},
    "host-nurul": {"skin": "medium", "hair": "dark-brown", "hair_style": "long-wavy", "eyes": "brown"},
    "host-aisha": {"skin": "fair", "hair": "golden-brown", "hair_style": "long-wavy", "eyes": "green"},
    "host-dana": {"skin": "light", "hair": "ash-brown", "hair_style": "bob", "eyes": "gray"},
}


def _seed(host_id: str) -> random.Random:
    h = int(hashlib.md5(host_id.encode()).hexdigest()[:8], 16)
    return random.Random(h)


def _darken(color: tuple, factor: float = 0.7) -> tuple:
    return tuple(max(0, int(c * factor)) for c in color)


def _lighten(color: tuple, factor: float = 0.3) -> tuple:
    return tuple(min(255, int(c + (255 - c) * factor)) for c in color)


def generate_portrait(host_id: str, output_path: str) -> str:
    """Generate a professional broadcast anchor portrait."""
    appearance = HOST_APPEARANCES.get(host_id, {
        "skin": "medium", "hair": "dark-brown", "hair_style": "long-straight", "eyes": "brown"
    })
    rng = _seed(host_id)

    skin = SKIN_TONES.get(appearance["skin"], (212, 165, 116))
    hair = HAIR_COLORS.get(appearance["hair"], (59, 32, 16))
    eyes = EYE_COLORS.get(appearance["eyes"], (101, 67, 33))
    hair_style = appearance["hair_style"]

    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = HALF, HALF + 20
    neck_w, neck_h = 28, 45

    # Shoulders & blazer
    blazer_color = (26, 38, 58)
    shoulder_top = cy + 80
    draw.ellipse([cx - 130, shoulder_top, cx + 130, shoulder_top + 200], fill=blazer_color)
    draw.rectangle([cx - 130, shoulder_top + 60, cx + 130, SIZE], fill=blazer_color)

    # Blouse / collar
    collar_color = _lighten(blazer_color, 0.6)
    draw.polygon([
        (cx - 22, shoulder_top + 10), (cx, shoulder_top + 50),
        (cx + 22, shoulder_top + 10),
    ], fill=(240, 240, 245))

    # Neck
    draw.ellipse([cx - neck_w, cy + 35, cx + neck_w, cy + 35 + neck_h], fill=skin)
    draw.rectangle([cx - neck_w + 2, cy + 45, cx + neck_w - 2, shoulder_top + 20], fill=skin)

    # Head shape
    head_rx, head_ry = 72, 90
    draw.ellipse([cx - head_rx, cy - head_ry, cx + head_rx, cy + head_ry - 10], fill=skin)

    # Jaw refinement
    jaw_shade = _darken(skin, 0.92)
    draw.ellipse([cx - head_rx + 5, cy + 10, cx + head_rx - 5, cy + head_ry], fill=skin)

    # Ears
    ear_y = cy - 5
    for side in [-1, 1]:
        ex = cx + side * (head_rx - 5)
        draw.ellipse([ex - 10, ear_y - 15, ex + 10, ear_y + 15], fill=skin)
        draw.ellipse([ex - 6, ear_y - 10, ex + 6, ear_y + 10], fill=_darken(skin, 0.9))
        # Earrings
        draw.ellipse([ex - 4, ear_y + 14, ex + 4, ear_y + 26], fill=(220, 190, 80))

    # Eyes
    eye_y = cy - 18
    eye_sep = 28
    for side in [-1, 1]:
        ex = cx + side * eye_sep

        # Eye whites
        draw.ellipse([ex - 16, eye_y - 8, ex + 16, eye_y + 8], fill=(255, 255, 255))

        # Iris
        draw.ellipse([ex - 8, eye_y - 8, ex + 8, eye_y + 8], fill=eyes)

        # Pupil
        draw.ellipse([ex - 4, eye_y - 4, ex + 4, eye_y + 4], fill=(15, 10, 10))

        # Highlight
        draw.ellipse([ex + 2, eye_y - 5, ex + 6, eye_y - 1], fill=(255, 255, 255, 200))

        # Eyelids / lashes
        draw.arc([ex - 17, eye_y - 10, ex + 17, eye_y + 6], 180, 360, fill=_darken(skin, 0.6), width=2)

        # Eyebrows
        brow_y = eye_y - 18
        brow_color = _darken(hair, 0.8)
        draw.arc([ex - 18, brow_y - 6, ex + 18, brow_y + 10], 200, 340, fill=brow_color, width=3)

    # Nose
    nose_tip_y = cy + 10
    nose_shade = _darken(skin, 0.88)
    draw.ellipse([cx - 8, nose_tip_y - 6, cx + 8, nose_tip_y + 6], fill=nose_shade)
    draw.line([(cx, cy - 8), (cx + 3, nose_tip_y - 2)], fill=nose_shade, width=2)

    # Mouth
    mouth_y = cy + 30
    lip_color = (
        min(255, skin[0] + 40),
        max(0, skin[1] - 30),
        max(0, skin[2] - 20),
    )
    # Upper lip
    draw.arc([cx - 16, mouth_y - 6, cx + 16, mouth_y + 6], 0, 180, fill=lip_color, width=2)
    draw.ellipse([cx - 14, mouth_y - 3, cx + 14, mouth_y + 5], fill=lip_color)
    # Lower lip
    draw.ellipse([cx - 12, mouth_y + 1, cx + 12, mouth_y + 9], fill=_lighten(lip_color, 0.15))

    # Subtle smile lines
    for side in [-1, 1]:
        sx = cx + side * 20
        draw.arc([sx - 6, mouth_y - 4, sx + 6, mouth_y + 8], 0 if side > 0 else 180, 180 if side > 0 else 360,
                 fill=_darken(skin, 0.9), width=1)

    # Hair
    if "bob" in hair_style:
        # Bob cut
        draw.ellipse([cx - head_rx - 8, cy - head_ry - 15, cx + head_rx + 8, cy - head_ry + 60], fill=hair)
        draw.rectangle([cx - head_rx - 6, cy - head_ry + 20, cx + head_rx + 6, cy - 10], fill=hair)
        # Side hair
        for side in [-1, 1]:
            sx = cx + side * (head_rx - 5)
            pts = [
                (sx - side * 12, cy - head_ry + 30),
                (sx + side * 15, cy - 10),
                (sx + side * 18, cy + 40),
                (sx + side * 10, cy + 55),
                (sx - side * 5, cy + 40),
            ]
            draw.polygon(pts, fill=hair)
        # Bangs
        for i in range(5):
            bx = cx - 50 + i * 25
            draw.ellipse([bx - 15, cy - head_ry - 5, bx + 15, cy - head_ry + 35], fill=hair)

    elif "short-natural" in hair_style:
        # Short natural
        draw.ellipse([cx - head_rx - 12, cy - head_ry - 20, cx + head_rx + 12, cy - head_ry + 55], fill=hair)
        draw.rectangle([cx - head_rx - 8, cy - head_ry + 10, cx + head_rx + 8, cy - 20], fill=hair)
        # Volume on top
        for i in range(8):
            angle = math.pi * 0.2 + (math.pi * 0.6 / 7) * i
            px = cx + int(math.cos(angle) * (head_rx + 5))
            py = cy - head_ry + 10 + int(math.sin(angle) * 15)
            draw.ellipse([px - 12, py - 12, px + 12, py + 12], fill=hair)

    elif "wavy" in hair_style:
        # Long wavy
        draw.ellipse([cx - head_rx - 10, cy - head_ry - 18, cx + head_rx + 10, cy - head_ry + 55], fill=hair)
        draw.rectangle([cx - head_rx - 6, cy - head_ry + 20, cx + head_rx + 6, cy - 15], fill=hair)
        # Flowing sides with waves
        for side in [-1, 1]:
            sx = cx + side * (head_rx - 2)
            for j in range(6):
                wy = cy - 20 + j * 30
                wave_offset = side * (8 + math.sin(j * 1.2) * 10)
                draw.ellipse([
                    int(sx + wave_offset - 18), wy - 8,
                    int(sx + wave_offset + 18), wy + 25
                ], fill=hair)
        # Soft bangs
        for i in range(6):
            bx = cx - 55 + i * 22
            draw.ellipse([bx - 14, cy - head_ry, bx + 14, cy - head_ry + 40], fill=hair)

    else:
        # Long straight (default)
        draw.ellipse([cx - head_rx - 8, cy - head_ry - 15, cx + head_rx + 8, cy - head_ry + 55], fill=hair)
        draw.rectangle([cx - head_rx - 5, cy - head_ry + 20, cx + head_rx + 5, cy - 10], fill=hair)
        # Straight sides
        for side in [-1, 1]:
            sx = cx + side * (head_rx - 3)
            draw.polygon([
                (sx - side * 8, cy - 20),
                (sx + side * 20, cy),
                (sx + side * 22, cy + 100),
                (sx + side * 15, shoulder_top + 40),
                (sx - side * 2, cy + 60),
            ], fill=hair)
        # Bangs
        for i in range(5):
            bx = cx - 48 + i * 24
            draw.ellipse([bx - 14, cy - head_ry - 2, bx + 14, cy - head_ry + 38], fill=hair)

    # Hair shine highlights
    shine = _lighten(hair, 0.25)
    draw.arc([cx - 40, cy - head_ry - 5, cx + 10, cy - head_ry + 30], 200, 320, fill=shine, width=2)

    # Necklace
    necklace_y = cy + 65
    draw.arc([cx - 30, necklace_y, cx + 30, necklace_y + 20], 0, 180, fill=(220, 190, 80), width=2)
    draw.ellipse([cx - 5, necklace_y + 12, cx + 5, necklace_y + 22], fill=(220, 190, 80))

    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    img.save(output_path, "PNG")
    return output_path


def generate_all_portraits(output_dir: str = "public/assets/characters") -> dict[str, str]:
    results = {}
    for host_id in HOST_APPEARANCES:
        path = os.path.join(output_dir, f"{host_id}.png")
        generate_portrait(host_id, path)
        results[host_id] = path
    return results


if __name__ == "__main__":
    results = generate_all_portraits()
    print(f"Generated {len(results)} portraits:")
    for host_id, path in results.items():
        size = os.path.getsize(path) / 1024
        print(f"  {host_id}: {path} ({size:.1f} KB)")
