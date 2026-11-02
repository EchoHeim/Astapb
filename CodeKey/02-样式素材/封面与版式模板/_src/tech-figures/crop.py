# -*- coding: utf-8 -*-
"""裁掉卡片下方的空白，缩到 750 宽（2 倍渲染再降采样，字更锐）"""
import json, os, sys
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_out")
BG = (251, 246, 234)          # body 背景 #FBF6EA


def content_bottom(im, tol=3):
    w, h = im.size
    px = im.load()
    xs = range(0, w, 11)
    for y in range(h - 1, -1, -1):
        row_bg = True
        for x in xs:
            c = px[x, y]
            if abs(c[0] - BG[0]) > tol or abs(c[1] - BG[1]) > tol or abs(c[2] - BG[2]) > tol:
                row_bg = False
                break
        if not row_bg:
            return y + 1
    return h


def main():
    man = json.load(open(os.path.join(ROOT, "manifest.json"), encoding="utf-8"))
    total = 0
    for m in man:
        if not os.path.exists(m["raw"]):
            print("MISS", m["id"])
            continue
        im = Image.open(m["raw"]).convert("RGB")
        b = content_bottom(im)
        im = im.crop((0, 0, im.size[0], b))
        out_w = 750
        out_h = round(im.size[1] * out_w / im.size[0])
        im = im.resize((out_w, out_h), Image.LANCZOS)
        im.save(m["out"], optimize=True)
        kb = os.path.getsize(m["out"]) // 1024
        total += kb
        print(f'{m["id"]:6s} {im.size[0]}x{im.size[1]}  {kb}KB  {os.path.basename(m["out"])}')
    print(f"\n{len(man)} 张，合计 {total}KB")


if __name__ == "__main__":
    main()
