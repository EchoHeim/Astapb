# -*- coding: utf-8 -*-
"""
干饭啦 sticker GIF builder - 程序小猴 IP  (final)
Base: 打工小猴/018 (eating noodles).
Motion: bottom-anchored bob + squash/stretch, sparkle twinkle,
text "干饭啦！" pop-in with overshoot then sway.
Outputs:
  - 干饭啦.gif      240x240 / 20f / 70ms / 160 colors  (<=500KB, sticker platform)
  - 干饭啦_480.gif  480x480 / 20f / 70ms / 255 colors  (HD for articles etc.)
"""
import os, math
from PIL import Image, ImageDraw, ImageFont

TMP = r"D:\Personal\Astapb\.workbuddy\_tmp"
SRC = r"D:\Personal\Astapb\CodeKey\01-IP形象\微信表情包\打工小猴\018-ced5-46c5-bbc2-a017ae152f74.png"
OUT_DIR = r"D:\Personal\Astapb\CodeKey\01-IP形象\动态表情"
NAME = "干饭啦"

N = 20                 # frames
DUR = 70               # ms per frame -> 1.40s loop
POP = 5.0 / N          # text pop-in window
BOB_CYCLES = 2         # bounces per loop
TEXT = "干饭啦！"

# house style: orange fill + white stroke + warm shadow, slight per-char bounce
FILL = (255, 132, 22, 255)
STROKE = (255, 255, 255, 255)
SHADOW = (176, 84, 22, 170)
CHAR_DY = [3.5, 1.0, -2.5, -5.0]   # per-char rise, px in 240-space
CHAR_ROT = [-3.5, -1.0, 1.5, 3.0]  # per-char rotation, degrees


def load_font(px):
    cands = [
        (r"C:\Windows\Fonts\msyhbd.ttc", None),
        (r"C:\Windows\Fonts\NotoSansSC-VF.ttf", 900),
        (r"C:\Windows\Fonts\simhei.ttf", None),
    ]
    for path, w in cands:
        try:
            f = ImageFont.truetype(path, px)
            if w is not None:
                try:
                    f.set_variation_by_axes([w])
                except Exception as e:
                    print("  [font] variation failed:", path, e)
            print("  [font] using:", path, "weight", w)
            return f
        except Exception as e:
            print("  [font] load failed:", path, e)
    raise RuntimeError("no usable font")


def draw_sparkle(size, fill=(255, 203, 55, 255), line=(240, 158, 26, 255), lw=2):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    c = (size - 1) / 2.0
    r_out = size / 2.0 - lw
    r_in = r_out * 0.16
    pts = []
    for i in range(8):
        ang = -math.pi / 2 + i * math.pi / 4
        r = r_out if i % 2 == 0 else r_in
        pts.append((c + r * math.cos(ang), c + r * math.sin(ang)))
    d.polygon(pts, fill=fill)
    d.line(pts + [pts[0]], fill=line, width=lw, joint="curve")
    return img


def ease_out_back(u, c1=1.70158, c3=2.70158):
    return 1 + c3 * (u - 1) ** 3 + c1 * (u - 1) ** 2


def alpha_grid(img, gx=12, gy=12):
    a = img.getchannel("A").resize((gx, gy), Image.BOX)
    px = a.load()
    rows = []
    for y in range(gy):
        row = ""
        for x in range(gx):
            v = px[x, y]
            row += "#" if v > 160 else ("+" if v > 40 else ".")
        rows.append(row)
    return "\n".join(rows)


def build_text(k):
    tsize = int(round(44 * k))
    stroke_w = max(2, int(round(6 * k)))
    font = load_font(tsize)
    probe = ImageDraw.Draw(Image.new("RGBA", (4, 4)))
    pad = stroke_w + int(round(4 * k))
    parts = []
    for idx, ch in enumerate(TEXT):
        b = probe.textbbox((0, 0), ch, font=font, stroke_width=stroke_w)
        cw, chh = b[2] - b[0], b[3] - b[1]
        img = Image.new("RGBA", (cw + pad * 2, chh + pad * 2), (0, 0, 0, 0))
        dd = ImageDraw.Draw(img)
        dd.text((pad - b[0], pad - b[1]), ch, font=font, fill=FILL,
                stroke_width=stroke_w, stroke_fill=STROKE)
        img = img.rotate(CHAR_ROT[idx], resample=Image.BICUBIC, expand=True)
        ab = img.getchannel("A").getbbox()      # crop to real ink
        if ab:
            img = img.crop(ab)
        parts.append(img)
    gap = int(round(1 * k))
    overlap = int(round(2 * k))
    xs = []
    x = 0
    for p in parts:
        xs.append(x)
        x += p.width - overlap + gap
    total_w = x - gap
    total_h = max(p.height for p in parts)
    group = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
    for idx, p in enumerate(parts):
        y = (total_h - p.height) // 2 + int(round(CHAR_DY[idx] * k))
        group.alpha_composite(p, (xs[idx], y))
    max_w = int(round(206 * k))                 # safety: never wider than text zone
    if group.width > max_w:
        sc = max_w / float(group.width)
        group = group.resize((max_w, max(2, int(round(group.height * sc)))), Image.LANCZOS)
    # shadow pass (offset silhouette)
    group_sh = Image.new("RGBA", group.size, (0, 0, 0, 0))
    sh_col = Image.new("RGBA", group.size, SHADOW)
    group_sh.paste(sh_col, (0, 0), group)
    out = Image.new("RGBA", group.size, (0, 0, 0, 0))
    ofs = max(1, int(round(2.2 * k)))
    out.alpha_composite(group_sh, (ofs, ofs + int(round(0.8 * k))))
    out.alpha_composite(group, (0, 0))
    print("  [text] group=%s" % (out.size,))
    return out


def build(S):
    k = S / 240.0
    W = H = S
    src = Image.open(SRC).convert("RGBA")
    a = src.getchannel("A").point(lambda v: 255 if v > 8 else 0)
    bbox = a.getbbox()
    src = src.crop(bbox)
    target_h = int(round(192 * k))
    scale = target_h / float(src.height)
    new_w = int(round(src.width * scale))
    char = src.resize((new_w, target_h), Image.LANCZOS)
    print("  [base] bbox=%s scaled=%dx%d" % (bbox, new_w, target_h))
    if S == 240:
        print(alpha_grid(char))
    base_bottom = H - int(round(4 * k))

    text_img = build_text(k)
    tcx = int(round(16 * k)) + text_img.width / 2.0
    tcy = int(round(6 * k)) + text_img.height / 2.0

    frames = []
    for i in range(N):
        p = i / float(N)
        ph = 2 * math.pi * BOB_CYCLES * p
        s = math.sin(ph)
        canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))

        # 1) character: bottom-anchored bob + squash/stretch
        sy = 1.0 + 0.038 * s
        sx = 1.0 - 0.032 * s
        cw = max(2, int(round(new_w * sx)))
        chh = max(2, int(round(target_h * sy)))
        cf = char.resize((cw, chh), Image.LANCZOS)
        y_off = -(s + 1.0) * 3.4 * k
        px_ = int(round((W - cw) / 2.0))
        py_ = int(round(base_bottom + y_off - chh))
        canvas.alpha_composite(cf, (px_, py_))

        # 2) twinkling sparkles (2 pulses per loop, alternating)
        for (fx, fy, phs) in [(0.90, 0.10, 0.0), (0.075, 0.60, 0.5)]:
            u = (p + phs) % 1.0
            amp = max(0.0, math.sin(2 * math.pi * 2 * u))
            ssz = int(round((4 + 9 * amp) * k))
            if ssz >= int(4 * k):
                sp = draw_sparkle(max(5, ssz), lw=max(1, int(round(1.4 * k))))
                canvas.alpha_composite(sp, (int(round(W * fx - sp.width / 2)),
                                            int(round(H * fy - sp.height / 2))))

        # 3) text: pop-in with overshoot, then sway + float
        if p < POP:
            sc = 0.25 + 0.75 * ease_out_back(p / POP)
        else:
            sc = 1.0
        if abs(sc - 1.0) > 1e-3:
            tw_ = max(2, int(round(text_img.width * sc)))
            th_ = max(2, int(round(text_img.height * sc)))
            t_img = text_img.resize((tw_, th_), Image.LANCZOS)
        else:
            t_img = text_img
        ang = 1.6 * math.sin(2 * math.pi * p + 0.8)
        t_rot = t_img.rotate(ang, resample=Image.BICUBIC, expand=True)
        ffloat = 2.0 * k * math.sin(2 * math.pi * BOB_CYCLES * p + 2.2)
        canvas.alpha_composite(t_rot, (int(round(tcx - t_rot.width / 2.0)),
                                       int(round(tcy + ffloat - t_rot.height / 2.0))))
        frames.append(canvas)
    return frames


def frames_to_gif(frames, path, dur, colors=255, dither=Image.NONE):
    W, H = frames[0].size
    big = Image.new("RGB", (W, H * len(frames)))
    for idx, f in enumerate(frames):
        big.paste(f.convert("RGB"), (0, idx * H))
    master = big.quantize(colors=colors, method=Image.MEDIANCUT)
    p_frames = []
    for f in frames:
        alpha = f.getchannel("A")
        pf = f.convert("RGB").quantize(palette=master, dither=dither)
        mask = alpha.point(lambda v: 255 if v < 128 else 0)
        pf.paste(255, mask)
        p_frames.append(pf)
    p_frames[0].save(path, save_all=True, append_images=p_frames[1:],
                     duration=dur, loop=0, transparency=255, disposal=2, optimize=True)
    g = Image.open(path)
    n = getattr(g, "n_frames", 1)
    g.seek(0)
    r0 = g.convert("RGBA")
    print("  [gif] %s  frames=%d size=%s bytes=%d corner_a=%d mid_a=%d"
          % (os.path.basename(path), n, g.size, os.path.getsize(path),
             r0.getpixel((1, 1))[3], r0.getpixel((W // 2, H * 7 // 8))[3]))
    return n


def preview_strip(frames, path, cols=5, cell=150):
    rows = (len(frames) + cols - 1) // cols
    canvas = Image.new("RGB", (cols * cell, rows * (cell + 18)), (255, 255, 255))
    d = ImageDraw.Draw(canvas)
    for i, f in enumerate(frames):
        c = Image.new("RGBA", (cell, cell), (255, 255, 255, 255))
        c.alpha_composite(f.resize((cell, cell), Image.LANCZOS))
        x = (i % cols) * cell
        y = (i // cols) * (cell + 18)
        canvas.paste(c.convert("RGB"), (x, y))
        d.text((x + 4, y + cell + 4), "f%02d" % i, fill=(0, 0, 0))
    canvas.save(path)
    print("  [preview]", path)


def gif_check(path, out_png, frame_idx=8):
    """Render an actual frame of the saved GIF at 2x on light + dark bg."""
    g = Image.open(path)
    g.seek(frame_idx)
    fr = g.convert("RGBA")
    S = fr.size[0]
    up = fr.resize((S * 2, S * 2), Image.NEAREST)
    canvas = Image.new("RGB", (S * 4 + 12, S * 2), (255, 255, 255))
    c1 = Image.new("RGBA", (S * 2, S * 2), (237, 237, 237, 255))
    c1.alpha_composite(up)
    canvas.paste(c1.convert("RGB"), (0, 0))
    c2 = Image.new("RGBA", (S * 2, S * 2), (45, 45, 45, 255))
    c2.alpha_composite(up)
    canvas.paste(c2.convert("RGB"), (S * 2 + 12, 0))
    canvas.save(out_png)
    print("  [check]", out_png)


if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)

    print("=== final 240 (platform) ===")
    fr240 = build(240)
    out240 = os.path.join(OUT_DIR, "%s.gif" % NAME)
    frames_to_gif(fr240, out240, DUR, colors=160, dither=Image.NONE)
    sz = os.path.getsize(out240)
    print("  [platform] bytes=%d  under500KB=%s  frames=%d<=30 dur_total=%.2fs"
          % (sz, sz < 500000, len(fr240), len(fr240) * DUR / 1000.0))
    preview_strip(fr240, os.path.join(TMP, "final_strip.png"))
    gif_check(out240, os.path.join(TMP, "final_check.png"))

    print("=== final 480 (HD) ===")
    fr480 = build(480)
    out480 = os.path.join(OUT_DIR, "%s_480.gif" % NAME)
    frames_to_gif(fr480, out480, DUR, colors=255, dither=Image.FLOYDSTEINBERG)
    print("ALL DONE")
