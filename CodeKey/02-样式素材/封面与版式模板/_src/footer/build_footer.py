# -*- coding: utf-8 -*-
"""
程序小猴 · 公众号尾图生成器
=================================
底图 : AI 生成的 3D 小猴工作场景（只负责画面，不含任何文字）
叠加 : 公众号资料卡 / 底部双出口引导 —— 全部代码绘制，保证中文零错字

版式来源：参考《燕云十六声》尾图的双出口结构（左转化 / 右传播），
         视觉语言改为科技暗色系。

输出：1080 x 500 PNG
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

W, H = 1080, 500

BASE = r"d:\Personal\Astapb\generated-images\Transform_this_flat_cartoon_mo_2026-10-23T01-12-55.png"
SHOT = r"C:\Users\Lodge\.workbuddy\clipboard-images\clipboard-2026-10-23T01-11-39-313Z-4d1b81b1.png"
OUT = r"D:\Personal\Astapb\CodeKey\02-样式素材\封面与版式模板\_src\footer\_preview.png"

F_BOLD = r"C:\Windows\Fonts\msyhbd.ttc"
F_REG = r"C:\Windows\Fonts\msyh.ttc"

NAVY = (11, 16, 32)
CYAN = (0, 217, 255)
GOLD = (255, 200, 87)
WHITE = (255, 255, 255)
GREY = (154, 154, 162)
GREY2 = (142, 142, 148)
DIM = (6, 8, 16)

# ---------------------------------------------------------------- 底图
im = Image.open(BASE).convert("RGB").resize((W, H), Image.LANCZOS).convert("RGBA")

# 底部渐变压暗：给引导文字对比度，同时压掉生成图右下角的水印
grad = Image.new("L", (1, H), 0)
for y in range(H):
    t = max(0.0, min(1.0, (y - 312) / (H - 312)))
    grad.putpixel((0, y), int(248 * (t ** 1.15)))
grad = grad.resize((W, H))
im = Image.composite(Image.new("RGBA", (W, H), DIM + (255,)), im, grad)

# 左侧轻压暗：让资料卡落地
lg = Image.new("L", (W, 1), 0)
for x in range(W):
    t = max(0.0, min(1.0, (640 - x) / 640))
    lg.putpixel((x, 0), int(58 * t))
lg = lg.resize((W, H))
im = Image.composite(Image.new("RGBA", (W, H), DIM + (255,)), im, lg)

# 抹掉生成图右下角水印：邻近取样色整块替换 + 大羽化，收口交给底部渐变
_sample = im.crop((900, 452, 960, 496)).resize((1, 1), Image.LANCZOS).getpixel((0, 0))
_fill = Image.new("RGBA", (W, H), (int(_sample[0]), int(_sample[1]), int(_sample[2]), 255))
wm = Image.new("L", (W, H), 0)
ImageDraw.Draw(wm).rectangle([996, 440, W, H], fill=255)
wm = wm.filter(ImageFilter.GaussianBlur(22))
im.paste(_fill, (0, 0), wm)

# ---------------------------------------------------------------- 资料卡
CX, CY, CW, CH, CR = 52, 36, 556, 272, 26

# 外阴影
shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ImageDraw.Draw(shadow).rounded_rectangle(
    [CX - 10, CY + 2, CX + CW + 10, CY + CH + 22], CR + 10, fill=(0, 0, 0, 165))
shadow = shadow.filter(ImageFilter.GaussianBlur(20))
im = Image.alpha_composite(im, shadow)

# 毛玻璃底
region = im.crop((CX, CY, CX + CW, CY + CH)).filter(ImageFilter.GaussianBlur(16))
mask = Image.new("L", (CW, CH), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, CW - 1, CH - 1], CR, fill=255)
im.paste(region, (CX, CY), mask)

# 卡片本体
tint = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ImageDraw.Draw(tint).rounded_rectangle([CX, CY, CX + CW, CY + CH], CR, fill=(22, 23, 29, 208))
im = Image.alpha_composite(im, tint)

# 描边 + 顶部高光
line = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ld = ImageDraw.Draw(line)
ld.rounded_rectangle([CX, CY, CX + CW, CY + CH], CR, outline=(255, 255, 255, 34), width=2)
ld.rounded_rectangle([CX + 2, CY + 2, CX + CW - 2, CY + CH - 2], CR - 2, outline=(120, 200, 255, 14), width=1)
im = Image.alpha_composite(im, line)

# ---------------------------------------------------------------- 头像
AV = 80
AVX, AVY = 76, 62
av = Image.open(SHOT).convert("RGB").crop((48, 9, 96, 57)).resize((AV, AV), Image.LANCZOS)
av = av.filter(ImageFilter.UnsharpMask(radius=2, percent=95, threshold=1))
m = Image.new("L", (AV, AV), 0)
ImageDraw.Draw(m).ellipse([0, 0, AV - 1, AV - 1], fill=255)
# 头像外圈微光
ring = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ImageDraw.Draw(ring).ellipse([AVX - 3, AVY - 3, AVX + AV + 2, AVY + AV + 2],
                             outline=(0, 217, 255, 70), width=2)
im = Image.alpha_composite(im, ring)
im.paste(av, (AVX, AVY), m)

# ---------------------------------------------------------------- 文字层
# 先画发光层，模糊后合成，再画清晰文字
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)

f_name = ImageFont.truetype(F_BOLD, 34, index=0)
f_region = ImageFont.truetype(F_REG, 19, index=0)
f_bio = ImageFont.truetype(F_REG, 20, index=0)
f_meta = ImageFont.truetype(F_REG, 16, index=0)
f_small = ImageFont.truetype(F_REG, 19, index=0)
f_big = ImageFont.truetype(F_BOLD, 36, index=0)
f_star = ImageFont.truetype(F_REG, 25, index=0)

L_GUIDE, R_GUIDE = 62, 1018

# --- 底部引导（发光）
gd.text((L_GUIDE, 430), "发现更多实用工具", font=f_big, fill=GOLD + (170,), anchor="ls")
gd.text((R_GUIDE, 430), "觉得有用，点个在看", font=f_big, fill=GOLD + (170,), anchor="rs")
glow = glow.filter(ImageFilter.GaussianBlur(11))
im = Image.alpha_composite(im, glow)

d = ImageDraw.Draw(im)

# --- 资料卡文字
d.text((176, 104), "程序小猴", font=f_name, fill=WHITE + (255,), anchor="ls")
name_w = d.textlength("程序小猴", font=f_name)
d.text((176 + name_w + 12, 104), "★", font=f_star, fill=GOLD + (255,), anchor="ls")
d.text((176, 140), "广东 广州", font=f_region, fill=GREY + (255,), anchor="ls")

d.text((76, 184), "好软件，不私藏。认真折腾，快乐分享！", font=f_bio, fill=(230, 230, 236, 255), anchor="ls")
d.text((76, 218), "视频号：小猴随心记", font=f_meta, fill=GREY2 + (255,), anchor="ls")
d.text((76, 249), "78篇原创内容", font=f_meta, fill=GREY2 + (255,), anchor="ls")
d.text((76, 280), "11个朋友关注", font=f_meta, fill=GREY2 + (255,), anchor="ls")

# --- 底部引导（清晰）
d.text((L_GUIDE, 380), "点击下方 阅读原文", font=f_small, fill=CYAN + (255,), anchor="ls",
       stroke_width=2, stroke_fill=(8, 10, 18, 200))
d.text((L_GUIDE, 430), "发现更多实用工具", font=f_big, fill=GOLD + (255,), anchor="ls",
       stroke_width=3, stroke_fill=(8, 10, 18, 235))
d.text((R_GUIDE, 380), "代码不止，折腾不停", font=f_small, fill=CYAN + (255,), anchor="rs",
       stroke_width=2, stroke_fill=(8, 10, 18, 200))
d.text((R_GUIDE, 430), "觉得有用，点个在看", font=f_big, fill=GOLD + (255,), anchor="rs",
       stroke_width=3, stroke_fill=(8, 10, 18, 235))

# --- 引导区两侧的青色刻度线
d.rectangle([40, 366, 43, 438], fill=CYAN + (130,))
d.rectangle([1037, 366, 1040, 438], fill=CYAN + (130,))

# ---------------------------------------------------------------- 输出
im.convert("RGB").save(OUT, "PNG", optimize=True)
print("preview", OUT)

# 成品：3D 渲染属于照片类，JPG 比 PNG 小一个数量级；subsampling=0 保住文字边缘锐度
OUT_JPG = r"D://Personal//Astapb//CodeKey//02-样式素材//封面与版式模板//尾图_程序小猴_1080x500_20261023.jpg"
im.convert("RGB").save(OUT_JPG, "JPEG", quality=92, subsampling=0, optimize=True)
import os
print("final  ", OUT_JPG, "%.0f KB" % (os.path.getsize(OUT_JPG) / 1024))
