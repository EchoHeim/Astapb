#!/usr/bin/env python3
"""批量归一化目录下所有 PNG 图标。用法见 normalize-icon.py --help。"""
from __future__ import annotations

import argparse
import importlib.util
import os

spec = importlib.util.spec_from_file_location("normalize_icon", "scripts/normalize-icon.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
normalize = mod.normalize


def walk_pngs(root: str):
    for dirpath, _, filenames in os.walk(root):
        for name in filenames:
            if name.lower().endswith(".png"):
                yield os.path.join(dirpath, name)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("dirs", nargs="+", help="要处理的目录")
    parser.add_argument("--style", choices=["circle", "rounded", "ring"], default="circle")
    args = parser.parse_args()

    count = 0
    for d in args.dirs:
        for path in walk_pngs(d):
            normalize(path, path, args.style)
            count += 1
    print(f"已归一化 {count} 个图标，风格：{args.style}")
