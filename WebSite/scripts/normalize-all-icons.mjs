#!/usr/bin/env node
/**
 * 批量归一化图标。
 * 只处理 brand logo：icon/、header/、search/。
 * img/ 里的 UI 装饰（logo、search）保持原样。
 *
 * 用法：node scripts/normalize-all-icons.mjs [style]
 * 默认风格：circle
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const PYTHON = 'C:/Users/Lodge/.workbuddy/binaries/python/envs/default/Scripts/python.exe';
const SCRIPT = join(__dirname, 'normalize-icon.py');
const STYLE = process.argv[2] ?? 'circle';

const TARGETS = ['icon', 'header', 'search'];

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(path);
    } else if (extname(entry.name).toLowerCase() === '.png') {
      yield path;
    }
  }
}

let count = 0;
for (const rel of TARGETS) {
  for (const file of walk(join(ROOT, rel))) {
    execFileSync(PYTHON, [SCRIPT, file, file, `--style=${STYLE}`], { stdio: 'pipe' });
    count += 1;
  }
}

console.log(`已归一化 ${count} 个图标，风格：${STYLE}`);
