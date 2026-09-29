#!/usr/bin/env python3
"""把单个 PNG 图标归一化为统一风格。

用法：
    python scripts/normalize-icon.py <input.png> <output.png> --style <STYLE>

风格：
    circle      把 logo 放在圆形色板上（CSS border-radius:50% 会把它裁成圆）
    rounded     把 logo 放在圆角色板上
    ring        仅统一尺寸/留白，并加一个细描边环，不改背景

设计原则：
    - 不重新绘制、不变色、不转单色：保留原 logo 的图形与颜色。
    - 只统一画布尺寸、内边距、背景板形状/颜色。
"""
from __future__ import annotations

import argparse
import math
import sys
from pathlib import Path

from PIL import Image


CANVAS = 256
SAFE = 0.70  # logo 占画布直径的 70%


def luminance(rgb):
    r, g, b = rgb
    return 0.299 * r + 0.587 * g + 0.114 * b


def saturation(rgb):
    r, g, b = rgb
    mx, mn = max(r, g, b), min(r, g, b)
    if mx == 0:
        return 0
    return (mx - mn) / mx


def adjust_plate_color(color, lo=55, hi=210):
    """把 plate 颜色亮度钳到可见区间，避免在深浅主题里消失。"""
    r, g, b = color
    lum = luminance(color)
    if lum < lo:
        factor = min(2.0, (lo + 30) / max(lum, 1))
        r, g, b = min(255, int(r * factor)), min(255, int(g * factor)), min(255, int(b * factor))
    elif lum > hi:
        factor = max(0.55, (hi - 30) / max(lum, 1))
        r, g, b = int(r * factor), int(g * factor), int(b * factor)
    return (r, g, b)


def mark_looks_multicolor(im: Image.Image):
    """如果 mark 本身包含多种显著颜色（如 Google、Wikipedia），用中性底比单一主色更稳。"""
    hist = {}
    for y in range(im.size[1]):
        for x in range(im.size[0]):
            r, g, b, a = im.getpixel((x, y))
            if a < 128:
                continue
            key = (r // 18, g // 18, b // 18)
            hist[key] = hist.get(key, 0) + 1
    if not hist:
        return False
    total = sum(hist.values())
    items = sorted(hist.items(), key=lambda kv: -kv[1])
    # 第一名不够压倒，且前三名加起来不够集中
    top1_share = items[0][1] / total
    top3_share = sum(v for _, v in items[:3]) / total
    return top1_share < 0.45 and top3_share < 0.75


def normalize(input_path: str, output_path: str, style: str):
    im = Image.open(input_path)

    # 1. 判断背景色（通常就是边缘最常见的颜色）
    rgba = im.convert("RGBA")
    bg, bg_ratio = detect_bg_color(rgba)

    # 2. 背景是否"中性"（白/黑/灰/透明）？
    bg_is_neutral = (
        bg is None  # 透明
        or max(bg) - min(bg) <= 30  # 灰
        or luminance(bg) < 35  # 近黑
        or luminance(bg) > 225  # 近白
    )

    if bg_is_neutral and bg is not None:
        # 中性背景：抠掉，用前景主色当 plate
        fg = knock_out_color(rgba, bg)
        plate_color = dominant_color(fg, ignore_transparent=True) or bg
    else:
        # 品牌色背景：用这个颜色当 plate，同时把 mark 抠出来以便放大/居中
        plate_color = bg if bg else dominant_color(rgba, ignore_transparent=True)
        fg = knock_out_color(rgba, bg) if bg else rgba

    # 多色 mark（Google、Wikipedia 等）用中性底，避免某一品牌色喧宾夺主
    if mark_looks_multicolor(fg):
        plate_color = (240, 240, 240)

    plate_color = adjust_plate_color(plate_color or (128, 128, 128))

    # 3. 按内容（mark）裁剪并缩放到安全区
    bbox = fg.getbbox()
    if bbox:
        fg = fg.crop(bbox)

    src_w, src_h = fg.size
    target = int(CANVAS * SAFE)
    scale = target / max(src_w, src_h)
    new_w = max(1, int(src_w * scale))
    new_h = max(1, int(src_h * scale))
    if (new_w, new_h) != fg.size:
        fg = fg.resize((new_w, new_h), Image.Resampling.LANCZOS)

    # 4. 新建画布并画 plate + mark
    canvas = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    cx, cy = CANVAS // 2, CANVAS // 2
    radius = CANVAS // 2

    if style in ("circle", "rounded"):
        draw_plate(canvas, style, cx, cy, radius, plate_color)
        lx = (CANVAS - new_w) // 2
        ly = (CANVAS - new_h) // 2
        canvas.paste(fg, (lx, ly), fg)
    elif style == "ring":
        lx = (CANVAS - new_w) // 2
        ly = (CANVAS - new_h) // 2
        canvas.paste(fg, (lx, ly), fg)
        draw_ring(canvas, cx, cy, radius)
    else:
        raise SystemExit(f"未知风格：{style}")

    canvas.save(output_path, "PNG")


def detect_bg_color(im: Image.Image):
    """返回 (背景 RGB, 背景占比)。透明背景返回 (None, 透明占比)。"""
    w, h = im.size
    # 优先看边缘像素
    edges = []
    for y in range(h):
        for x in [0, w - 1]:
            r, g, b, a = im.getpixel((x, y))
            if a >= 128:
                edges.append((r, g, b))
    for x in range(w):
        for y in [0, h - 1]:
            r, g, b, a = im.getpixel((x, y))
            if a >= 128:
                edges.append((r, g, b))

    # 透明占比
    total = w * h
    transparent = sum(1 for y in range(h) for x in range(w) if im.getpixel((x, y))[3] < 128)
    if transparent / total > 0.35:
        return None, transparent / total

    if not edges:
        return None, transparent / total

    # 边缘众数（粗量化）
    quant = {}
    for c in edges:
        key = (c[0] // 8, c[1] // 8, c[2] // 8)
        quant[key] = quant.get(key, 0) + 1
    top = max(quant, key=quant.get)
    bg = (top[0] * 8, top[1] * 8, top[2] * 8)
    return bg, 0.0


def knock_out_color(im: Image.Image, bg: tuple):
    """把接近 bg 的颜色变透明。"""
    w, h = im.size
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    out_data = []
    for y in range(h):
        for x in range(w):
            r, g, b, a = im.getpixel((x, y))
            if a < 128 or max(abs(r - bg[0]), abs(g - bg[1]), abs(b - bg[2])) <= 28:
                out_data.append((0, 0, 0, 0))
            else:
                out_data.append((r, g, b, a))
    out.putdata(out_data)
    return out


def dominant_color(im: Image.Image, ignore_transparent: bool = True):
    """返回出现最多的颜色；可选忽略透明像素。"""
    w, h = im.size
    hist = {}
    for y in range(h):
        for x in range(w):
            r, g, b, a = im.getpixel((x, y))
            if ignore_transparent and a < 128:
                continue
            key = (r // 12, g // 12, b // 12)
            hist[key] = hist.get(key, 0) + 1
    if not hist:
        return (128, 128, 128)
    top = max(hist, key=hist.get)
    return (top[0] * 12, top[1] * 12, top[2] * 12)


def draw_plate(canvas: Image.Image, style: str, cx: int, cy: int, radius: int, color: tuple):
    """在画布上画圆形或圆角矩形色板。"""
    w, h = canvas.size
    if style == "circle":
        for y in range(h):
            for x in range(w):
                if (x - cx) ** 2 + (y - cy) ** 2 <= radius * radius:
                    canvas.putpixel((x, y), color + (255,))
    else:
        cr = CANVAS * 0.22
        for y in range(h):
            for x in range(w):
                dx, dy = abs(x - cx), abs(y - cy)
                inside = (
                    (dx <= radius - cr and dy <= radius)
                    or (dy <= radius - cr and dx <= radius)
                    or ((dx - (radius - cr)) ** 2 + (dy - (radius - cr)) ** 2 <= cr * cr)
                )
                if inside:
                    canvas.putpixel((x, y), color + (255,))


def draw_ring(canvas: Image.Image, cx: int, cy: int, radius: int):
    """细描边环。"""
    for angle in range(360):
        rad = math.radians(angle)
        for r in range(radius - 2, radius + 1):
            x = int(cx + r * math.cos(rad))
            y = int(cy + r * math.sin(rad))
            if 0 <= x < CANVAS and 0 <= y < CANVAS:
                canvas.putpixel((x, y), (239, 239, 239, 40))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("input", help="输入 PNG")
    parser.add_argument("output", help="输出 PNG")
    parser.add_argument("--style", choices=["circle", "rounded", "ring"], default="circle")
    args = parser.parse_args()
    normalize(args.input, args.output, args.style)
    print(f"ok: {args.output}")
