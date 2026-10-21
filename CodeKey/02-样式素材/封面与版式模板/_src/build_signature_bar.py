# -*- coding: utf-8 -*-
"""生成公众号文首署名条（宽 750 @2x，正文铺满不留白）

- 有 SLOGAN_TEXT：750x150，两行（号名/定位 + 价值主张）
- 无 SLOGAN_TEXT：750x120，单行（号名/定位），高度自适应收紧

用法：
    python build_signature_bar.py                # 输出 文首署名条.png
    python build_signature_bar.py out.png        # 指定输出

改文案直接调下面的文案区。字体走 Windows 自带微软雅黑。
"""
from pathlib import Path
import sys

from PIL import Image, ImageDraw, ImageFont

W = 750
GREEN = (6, 135, 45)          # 主色 #06872D，与封面模板一致
DARK = (30, 42, 35)
GREY = (88, 100, 92)
GREY_LT = (168, 178, 171)
SLOGAN = (112, 124, 116)
WHITE = (255, 255, 255)
RULE_GREEN = (122, 192, 147)

# ---- 文案 ----
NAME = "程序小猴"
TAGLINE = "AI 工具与实用软件"
SLOGAN_TEXT = ""              # 留空 = 单行版（750x120）
CTA = "关注不迷路"
# ------------

FONT_BD = "C:/Windows/Fonts/msyhbd.ttc"
FONT_RG = "C:/Windows/Fonts/msyh.ttc"

ROOT = Path(__file__).resolve().parents[4]
AVATAR = ROOT / "CodeKey/01-IP形象/微信表情包/打工小猴/001-ced5-46c5-bbc2-a017ae152f74.png"
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1] / "文首署名条.png"

TWO_LINE = bool(SLOGAN_TEXT.strip())
H = 150 if TWO_LINE else 120
AV_H = 84 if TWO_LINE else 80
CENTER = (H + 8 - 5) / 2      # 上下绿线之间（8 ~ H-5）的中心

f_name = ImageFont.truetype(FONT_BD, 34, index=0)
f_tag = ImageFont.truetype(FONT_RG, 22, index=0)
f_slogan = ImageFont.truetype(FONT_RG, 22, index=0)
f_cta = ImageFont.truetype(FONT_BD, 20, index=0)

img = Image.new("RGB", (W, H), WHITE)
d = ImageDraw.Draw(img)

# 上下细绿线（原版 540x70 上 6px / 下 4px 的等比放大）
d.rectangle([0, 0, W, 8], fill=GREEN)
d.rectangle([0, H - 5, W, H], fill=GREEN)

# 头像：表情包 001，按内容 bbox 裁掉透明边再等比缩放
av = Image.open(AVATAR).convert("RGBA")
av = av.crop(av.getbbox())
AV_W = round(av.width * AV_H / av.height)
av = av.resize((AV_W, AV_H), Image.LANCZOS)
AV_X = 32
img.paste(av, (AV_X, round(CENTER - AV_H / 2)), av)

x0 = AV_X + AV_W + 24

# 主行：号名 · 定位
base1 = round(CENTER + 12) if not TWO_LINE else 67
d.text((x0, base1), NAME, font=f_name, fill=DARK, anchor="ls")
name_w = d.textlength(NAME, font=f_name)
dot_x = x0 + name_w + 13
d.ellipse([dot_x, base1 - 12, dot_x + 6, base1 - 6], fill=GREY_LT)
tag_x = dot_x + 17
d.text((tag_x, base1), TAGLINE, font=f_tag, fill=GREY, anchor="ls")

# 第二行：价值主张（前面一小截绿条当视觉锚点）
if TWO_LINE:
    base2 = 106
    d.rectangle([x0, base2 - 18, x0 + 3, base2 + 3], fill=RULE_GREEN)
    d.text((x0 + 15, base2), SLOGAN_TEXT, font=f_slogan, fill=SLOGAN, anchor="ls")

# 右侧关注引导
cta_w = d.textlength(CTA, font=f_cta)
pill_h = 40
pill_w = round(cta_w) + 44
pill_x = W - 32 - pill_w
pill_y = round(CENTER - pill_h / 2)
d.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h],
                    radius=pill_h // 2, fill=GREEN)
d.text((pill_x + pill_w / 2, pill_y + pill_h / 2 - 1), CTA,
       font=f_cta, fill=WHITE, anchor="mm")

img.save(OUT, optimize=True)
print(f"saved {OUT} {img.size} {OUT.stat().st_size} bytes")
tag_end = tag_x + d.textlength(TAGLINE, font=f_tag)
print(f"tagline ends at {round(tag_end)}, pill starts at {pill_x}, gap {round(pill_x - tag_end)}")
