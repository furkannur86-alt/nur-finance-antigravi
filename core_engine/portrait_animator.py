"""
NUR Finance — Portrait Micro-Animation Engine

Transforms static 512x512 RGBA portraits into frame sequences with:
  - Breathing: subtle vertical scale oscillation (~15 breaths/min)
  - Head sway: gentle lateral drift (~0.08 Hz)
  - Blink: periodic eye-area darken (every 4-7 seconds)
  - Shoulder rise: synced with breathing cycle
"""

from __future__ import annotations

import math
import os
import random
from PIL import Image, ImageEnhance, ImageFilter

FPS = 30
PORTRAIT_SIZE = 480


def _breathing_offset(frame: int, fps: int = FPS) -> tuple[float, float]:
    """Vertical + scale shift simulating chest breathing. ~15 breaths/min."""
    t = frame / fps
    phase = math.sin(2 * math.pi * 0.25 * t)
    y_shift = phase * 2.0
    scale = 1.0 + phase * 0.004
    return y_shift, scale


def _sway_offset(frame: int, fps: int = FPS, seed: int = 0) -> tuple[float, float]:
    """Gentle lateral head drift — two layered sine waves for organic feel."""
    t = frame / fps
    x = math.sin(2 * math.pi * 0.08 * t + seed) * 3.0 + math.sin(2 * math.pi * 0.03 * t + seed * 0.7) * 1.5
    y = math.cos(2 * math.pi * 0.06 * t + seed * 1.3) * 1.0
    return x, y


def _blink_factor(frame: int, fps: int = FPS, blink_frames: list[int] | None = None) -> float:
    """Returns 0.0-1.0 indicating blink intensity (1.0 = fully closed)."""
    if blink_frames is None:
        return 0.0
    blink_duration = 6
    for bf in blink_frames:
        dist = frame - bf
        if 0 <= dist < blink_duration:
            if dist < 2:
                return dist / 2.0
            elif dist < 4:
                return 1.0
            else:
                return 1.0 - (dist - 4) / 2.0
    return 0.0


def _generate_blink_schedule(total_frames: int, fps: int = FPS, seed: int = 42) -> list[int]:
    """Generate random blink timings — every 3-6 seconds with slight variation."""
    rng = random.Random(seed)
    blinks = []
    f = fps * 2
    while f < total_frames - fps:
        blinks.append(f)
        interval = rng.uniform(3.0, 6.0) * fps
        f += int(interval)
    return blinks


def _apply_blink(portrait: Image.Image, factor: float) -> Image.Image:
    """Darken the upper third of the portrait to simulate eye closing."""
    if factor <= 0:
        return portrait
    result = portrait.copy()
    eye_region_top = int(PORTRAIT_SIZE * 0.22)
    eye_region_bottom = int(PORTRAIT_SIZE * 0.38)
    eye_strip = result.crop((0, eye_region_top, PORTRAIT_SIZE, eye_region_bottom))
    darkener = ImageEnhance.Brightness(eye_strip)
    darkened = darkener.enhance(1.0 - factor * 0.3)
    if factor > 0.5:
        darkened = darkened.filter(ImageFilter.GaussianBlur(radius=factor * 1.5))
    result.paste(darkened, (0, eye_region_top))
    return result


def animate_portrait(
    portrait_path: str,
    total_frames: int,
    size: int = PORTRAIT_SIZE,
    fps: int = FPS,
    seed: int | None = None,
) -> list[Image.Image]:
    """Generate a sequence of micro-animated portrait frames."""
    portrait_orig = Image.open(portrait_path).convert("RGBA")
    portrait_orig = portrait_orig.resize((size, size), Image.LANCZOS)

    if seed is None:
        seed = hash(portrait_path) % 10000

    blink_schedule = _generate_blink_schedule(total_frames, fps, seed)
    frames = []

    for f in range(total_frames):
        breath_y, breath_scale = _breathing_offset(f, fps)
        sway_x, sway_y = _sway_offset(f, fps, seed)
        blink = _blink_factor(f, fps, blink_schedule)

        scaled_size = int(size * breath_scale)
        portrait = portrait_orig.resize((scaled_size, scaled_size), Image.LANCZOS)

        if blink > 0.05:
            portrait = _apply_blink(portrait, blink)

        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        offset_x = (size - scaled_size) // 2 + int(sway_x)
        offset_y = (size - scaled_size) // 2 + int(sway_y + breath_y)
        canvas.paste(portrait, (offset_x, offset_y), portrait)

        frames.append(canvas)

    return frames


def animate_portrait_on_background(
    background: Image.Image,
    portrait_path: str,
    paste_x: int,
    paste_y: int,
    total_frames: int,
    size: int = PORTRAIT_SIZE,
    fps: int = FPS,
    seed: int | None = None,
) -> list[Image.Image]:
    """Composite animated portrait onto a static background for each frame."""
    composited = []
    for pf in iter_animated_portrait(portrait_path, total_frames, size, fps, seed):
        frame = background.copy() if background.mode == "RGB" else background.convert("RGB").copy()
        frame.paste(pf, (paste_x, paste_y), pf)
        composited.append(frame)
    return composited


def iter_animated_portrait(
    portrait_path: str,
    total_frames: int,
    size: int = PORTRAIT_SIZE,
    fps: int = FPS,
    seed: int | None = None,
):
    """Yield one animated portrait frame at a time (memory-efficient generator)."""
    portrait_orig = Image.open(portrait_path).convert("RGBA")
    portrait_orig = portrait_orig.resize((size, size), Image.LANCZOS)

    if seed is None:
        seed = hash(portrait_path) % 10000

    blink_schedule = _generate_blink_schedule(total_frames, fps, seed)

    for f in range(total_frames):
        breath_y, breath_scale = _breathing_offset(f, fps)
        sway_x, sway_y = _sway_offset(f, fps, seed)
        blink = _blink_factor(f, fps, blink_schedule)

        scaled_size = int(size * breath_scale)
        portrait = portrait_orig.resize((scaled_size, scaled_size), Image.LANCZOS)

        if blink > 0.05:
            portrait = _apply_blink(portrait, blink)

        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        offset_x = (size - scaled_size) // 2 + int(sway_x)
        offset_y = (size - scaled_size) // 2 + int(sway_y + breath_y)
        canvas.paste(portrait, (offset_x, offset_y), portrait)

        yield canvas


def stream_frames_to_pipe(
    background: Image.Image,
    portrait_path: str,
    paste_x: int,
    paste_y: int,
    total_frames: int,
    pipe,
    size: int = PORTRAIT_SIZE,
    fps: int = FPS,
    seed: int | None = None,
) -> int:
    """Stream animated frames as raw RGB bytes directly to an ffmpeg stdin pipe."""
    bg_rgb = background.convert("RGB")
    count = 0
    for pf in iter_animated_portrait(portrait_path, total_frames, size, fps, seed):
        frame = bg_rgb.copy()
        frame.paste(pf, (paste_x, paste_y), pf)
        try:
            pipe.write(frame.tobytes())
        except BrokenPipeError:
            break
        count += 1
    return count
