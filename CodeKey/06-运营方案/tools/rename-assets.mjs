#!/usr/bin/env node
/**
 * CodeKey 表情包素材批量重命名工具
 *
 * 解决 README 里记录的问题：`001-ced5-46c5-bbc2-a017ae152f74.png` 这种
 * `序号-uuid` 命名不可读、不可检索、上架表情平台时还要手工改名。
 *
 * 三阶段用法（每阶段都可反悔）：
 *
 *   1) 预览（默认，不改任何文件）
 *      node CodeKey/06-运营方案/tools/rename-assets.mjs
 *
 *   2) 去 uuid，改成纯序号         → 001.png 002.png ...
 *      node CodeKey/06-运营方案/tools/rename-assets.mjs --apply
 *      同时生成 rename-map.json 和 命名对照表.md
 *
 *   3) 填好语义名后落地            → 001-摸鱼.png 002-加班.png ...
 *      编辑 rename-map.json 里每条的 "semantic" 字段，然后：
 *      node CodeKey/06-运营方案/tools/rename-assets.mjs --apply --semantic
 *
 * 安全约定：
 *   - 目标文件已存在时跳过，绝不覆盖
 *   - 默认 dry-run，必须显式 --apply 才动文件
 *   - 只处理 01-IP形象 下的表情包目录，散落文件只报告不移动
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const STICKER_ROOT = path.join(ROOT, '微信表情包');
const OUT_DIR = path.join(ROOT, '06-运营方案');
const MAP_FILE = path.join(OUT_DIR, 'rename-map.json');
const TABLE_FILE = path.join(OUT_DIR, '命名对照表.md');

const argv = process.argv.slice(2);
const APPLY = argv.includes('--apply');
const SEMANTIC = argv.includes('--semantic');
const pad = (n, w = 3) => String(n).padStart(w, '0');

function readMap() {
  if (!fs.existsSync(MAP_FILE)) return null;
  return JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'));
}

function writeMap(map) {
  fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2) + '\n', 'utf8');
}

function writeTable(map) {
  const lines = [
    '# 表情包命名对照表',
    '',
    '> 在「语义名」一列填上每张表情的含义（如 `摸鱼`、`加班`、`点赞`），',
    '> 填完后运行 `node CodeKey/06-运营方案/tools/rename-assets.mjs --apply --semantic` 落地。',
    '> 语义名只填中文/英文/数字，不要带 `-`、`/`、空格。',
    '',
    '| 序号 | 当前文件名 | 语义名（待填） |',
    '| --- | --- | --- |',
  ];
  for (const it of map.items) {
    lines.push(`| ${pad(it.index)} | \`${it.original}\` | ${it.semantic || ''} |`);
  }
  lines.push('');
  fs.writeFileSync(TABLE_FILE, lines.join('\n'), 'utf8');
}

/**
 * 取「纯数字序号前缀」— 仅当数字后面紧跟 - 或 . 时才算。
 * 这样 `001-xxx.png` 有前缀，而 `2c607d37-xxx.png`、`06de1695qq5d7c-xxx.png`
 * 这类 uuid 文件名不会被误判出序号。
 */
function numericPrefix(f) {
  const m = /^(\d{1,4})[-.]/.exec(f);
  return m ? parseInt(m[1], 10) : null;
}

function sortFiles(files) {
  return [...files].sort((a, b) => {
    const na = numericPrefix(a);
    const nb = numericPrefix(b);
    if (na !== null && nb !== null) return na - nb || a.localeCompare(b, 'zh');
    if (na !== null) return -1;
    if (nb !== null) return 1;
    return a.localeCompare(b, 'zh');
  });
}

/** 第 1 阶段：把 序号-uuid.png 收集成计划（编号每套独立，便于分套上架表情平台） */
function planFromRaw() {
  const sets = fs
    .readdirSync(STICKER_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const groups = [];
  const loose = [];

  for (const set of sets) {
    const dir = path.join(STICKER_ROOT, set);
    const files = sortFiles(
      fs.readdirSync(dir).filter((f) => /\.(png|jpg|jpeg|gif|webp)$/i.test(f))
    );
    const items = files.map((f, i) => ({ index: i + 1, set, original: f, semantic: '' }));
    groups.push({ set, items });
  }

  for (const f of fs.readdirSync(STICKER_ROOT)) {
    if (/\.(png|jpg|jpeg|gif|webp)$/i.test(f)) loose.push(f);
  }

  return { groups, loose };
}

/** 第 2 阶段：把 序号-语义名.png 还原成 序号.png，便于应用新语义名 */
function planFromMap(map) {
  const groups = fs
    .readdirSync(STICKER_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .map((set) => ({ set, items: [] }));

  for (const it of map.items) {
    const g = groups.find((x) => x.set === it.set);
    if (!g) continue;
    g.items.push({ ...it, current: it.semantic ? `${pad(it.index)}-${it.semantic}.png` : `${pad(it.index)}.png` });
  }
  return { groups, loose: [] };
}

function report(groups, loose, mode) {
  console.log(`\nCodeKey 表情包重命名 · 模式：${mode}`);
  console.log(APPLY ? '  实际写入：是（--apply）\n' : '  实际写入：否（dry-run，加 --apply 才动文件）\n');
  let count = 0;
  for (const g of groups) {
    console.log(`  ${g.set}/  (${g.items.length} 个)`);
    for (const it of g.items) {
      count += 1;
      console.log(`    ${it.original}  ->  ${it.target}`);
    }
  }
  if (loose.length) {
    console.log(`\n  散落在 微信表情包/ 根目录（未归入任何子目录，脚本不动它们）：`);
    for (const f of loose) console.log(`    ${f}`);
    console.log('  → 建议手工归入对应子目录后再跑一次。');
  }
  console.log(`\n  共 ${count} 个文件待处理。`);
  if (!APPLY) console.log('  预览结束，未做任何修改。');
}

function apply(groups, map) {
  let done = 0;
  const conflicts = [];
  for (const g of groups) {
    const dir = path.join(STICKER_ROOT, g.set);
    for (const it of g.items) {
      const from = path.join(dir, it.original);
      const to = path.join(dir, it.target);
      if (from === to) continue;
      if (!fs.existsSync(from)) {
        conflicts.push(`${g.set}/${it.original} 不存在（可能已重命名过）`);
        continue;
      }
      if (fs.existsSync(to)) {
        conflicts.push(`${g.set}/${it.target} 已存在，跳过以避免覆盖`);
        continue;
      }
      fs.renameSync(from, to);
      it.original = it.target;
      done += 1;
    }
  }
  if (map) writeMap(map);
  console.log(`\n  完成：重命名 ${done} 个文件。`);
  if (conflicts.length) {
    console.log(`  跳过 ${conflicts.length} 个：`);
    for (const c of conflicts) console.log(`    - ${c}`);
  }
}

function main() {
  if (!fs.existsSync(STICKER_ROOT)) {
    console.error(`找不到表情包目录：${STICKER_ROOT}`);
    process.exit(1);
  }

  if (SEMANTIC) {
    const map = readMap();
    if (!map) {
      console.error(`缺少 ${MAP_FILE}，请先执行一次 node rename-assets.mjs --apply`);
      process.exit(1);
    }
    const filled = map.items.filter((it) => it.semantic).length;
    if (!filled) {
      console.error('rename-map.json 里的 semantic 字段还都是空的，先在「命名对照表.md」里填好再跑。');
      process.exit(1);
    }
    const sanitize = (s) => String(s).trim().replace(/[\\/:*?"<>|\s]+/g, '');
    for (const it of map.items) it.semantic = it.semantic ? sanitize(it.semantic) : '';
    const built = planFromMap(map);
    for (const g of built.groups) {
      for (const it of g.items) {
        it.original = it.current;
        it.target = it.semantic ? `${pad(it.index)}-${it.semantic}.png` : `${pad(it.index)}.png`;
      }
    }
    report(built.groups, [], `语义名落地（已填 ${filled}/${map.items.length}）`);
    if (APPLY) apply(built.groups, map);
    return;
  }

  const { groups, loose } = planFromRaw();
  const map = { generatedAt: new Date().toISOString(), items: [] };
  for (const g of groups) {
    for (const it of g.items) {
      map.items.push({ index: it.index, set: it.set, original: it.original, semantic: '' });
      it.target = `${pad(it.index)}.png`;
    }
  }
  report(groups, loose, '去 uuid 改序号');
  if (APPLY) {
    apply(groups, map);
    writeTable(map);
    console.log(`\n  已写出：\n    ${MAP_FILE}\n    ${TABLE_FILE}`);
    console.log('  下一步：在「命名对照表.md」里填语义名，然后跑 --apply --semantic');
  }
}

main();
