#!/usr/bin/env node
/**
 * 图标与数据一致性校验，挂在 `prebuild` 上。
 *
 * 存在的理由：旧实现把「图标路径」交给 create.js 里一个 switch(中文分类名) 现算，
 * 目录名对不上就只是渲染出一个 404 空白 —— 不报错、不中断，97 条里坏了 24 条
 * 也没人发现。现在改成构建前硬校验，坏一条就退出，问题在 CI 就拦住。
 *
 * 直接 import .ts 数据模块，靠的是 Node 22.18+ 内置的类型擦除；数据文件只用
 * `export const x: T = ...` 与 `import type`，都是可擦除语法，所以无需 esbuild 之类。
 */

import { readdirSync, statSync } from 'node:fs';
import { join, dirname, basename, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const errors = [];
const warnings = [];
const notes = [];

/** 递归收集某个目录下的所有 PNG，返回 `键名 -> 相对路径`。 */
function collectPngs(relDir) {
  const absDir = join(ROOT, relDir);

  let entries;
  try {
    entries = readdirSync(absDir, { withFileTypes: true });
  } catch {
    errors.push(`资源目录不存在：${relDir}/`);
    return new Map();
  }

  const map = new Map();
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(abs);
      } else if (extname(entry.name).toLowerCase() === '.png') {
        const key = basename(entry.name, extname(entry.name));
        const rel = abs.slice(ROOT.length + 1).split('\\').join('/');

        if (map.has(key)) {
          // 同键会互相覆盖，构建期必须拦下，否则线上表现取决于扫描顺序
          errors.push(`图标键冲突：\`${key}\` 同时存在于 ${map.get(key)} 与 ${rel}`);
        } else {
          map.set(key, rel);
        }
      }
    }
  };

  walk(absDir);
  return map;
}

async function loadData() {
  const categoriesUrl = pathToFileURL(join(ROOT, 'src/data/categories.ts')).href;
  const enginesUrl = pathToFileURL(join(ROOT, 'src/data/engines.ts')).href;

  try {
    return {
      ...(await import(categoriesUrl)),
      ...(await import(enginesUrl)),
    };
  } catch (error) {
    console.error('\n无法加载 TS 数据模块。');
    console.error('本脚本依赖 Node 22.18+ 的内置类型擦除，请确认 node -v 不低于该版本。\n');
    throw error;
  }
}

function main() {
  const headerIcons = collectPngs('header');
  const siteIcons = collectPngs('icon');
  const searchIcons = collectPngs('search');
  const imageFiles = collectPngs('img');

  return { headerIcons, siteIcons, searchIcons, imageFiles };
}

const { CATEGORIES, TOTAL_SITES, ENGINES, DEFAULT_ENGINE_ID } = await loadData();
const { headerIcons, siteIcons, searchIcons, imageFiles } = main();

/** 数据里真正被引用到的「池:键」集合，用于反查闲置图标。 */
const referenced = new Set();

// ---- img/ 里被样式与脚本直接引用的两个文件 ----
for (const required of ['logo', 'search']) {
  if (!imageFiles.has(required)) errors.push(`img/${required}.png 缺失，页面会少一块`);
  referenced.add(`img:${required}`);
}

// ---- 分类与站点 ----
const seenCategoryIds = new Set();
let fallbackCount = 0;
let iconCount = 0;

for (const category of CATEGORIES) {
  if (seenCategoryIds.has(category.id)) {
    errors.push(`分类 id 重复：\`${category.id}\``);
  }
  seenCategoryIds.add(category.id);

  if (!headerIcons.has(category.recommend.icon)) {
    errors.push(
      `分类「${category.name}」的推荐位图标 \`${category.recommend.icon}\` 在 header/ 下不存在`,
    );
  }
  referenced.add(`header:${category.recommend.icon}`);

  const seenNames = new Set();
  for (const site of category.sites) {
    if (seenNames.has(site.name)) {
      warnings.push(`分类「${category.name}」下「${site.name}」重复出现`);
    }
    seenNames.add(site.name);

    try {
      const url = new URL(site.url);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        errors.push(`「${site.name}」的地址协议异常：${site.url}`);
      }
    } catch {
      errors.push(`「${site.name}」的地址无法解析：${site.url}`);
    }

    if (site.icon === undefined) {
      fallbackCount += 1;
    } else if (siteIcons.has(site.icon)) {
      iconCount += 1;
      referenced.add(`icon:${site.icon}`);
    } else {
      errors.push(`站点「${site.name}」（${category.name}）的图标键 \`${site.icon}\` 不存在`);
    }
  }
}

// ---- 搜索引擎 ----
for (const engine of ENGINES) {
  if (!searchIcons.has(engine.icon)) {
    errors.push(`搜索引擎「${engine.name}」的图标 \`${engine.icon}\` 在 search/ 下不存在`);
  }
  referenced.add(`search:${engine.icon}`);
  try {
    new URL(engine.query);
  } catch {
    errors.push(`搜索引擎「${engine.name}」的查询地址无法解析：${engine.query}`);
  }
}

if (!ENGINES.some((engine) => engine.icon === DEFAULT_ENGINE_ID)) {
  errors.push(`DEFAULT_ENGINE_ID = \`${DEFAULT_ENGINE_ID}\` 没有对应的搜索引擎`);
}

// ---- 闲置图标：不算错，但值得提醒 ----
// 注意这纯粹是仓库卫生问题，不影响线上：Vite 只打包被引用到的资源，
// 闲置图标根本不会进 dist（实测 dist 里 75 张 PNG，磁盘上 92 张）。
const idle = [];
for (const [pool, map] of [
  ['header', headerIcons],
  ['icon', siteIcons],
  ['search', searchIcons],
  ['img', imageFiles],
]) {
  for (const [key, rel] of map.entries()) {
    if (!referenced.has(`${pool}:${key}`)) idle.push(rel);
  }
}

if (idle.length > 0) {
  const shown = idle.slice(0, 8).join('、');
  warnings.push(
    `有 ${idle.length} 个图标没被任何条目引用（不进产物，仅占仓库体积）：` +
      `${shown}${idle.length > 8 ? ' 等' : ''}`,
  );
}

// ---- 报告 ----
if (TOTAL_SITES !== CATEGORIES.reduce((n, c) => n + c.sites.length, 0)) {
  errors.push('TOTAL_SITES 与各分类条目数之和不一致');
}

if (iconCount + fallbackCount !== TOTAL_SITES) {
  errors.push(`条目统计对不上：${iconCount} + ${fallbackCount} ≠ ${TOTAL_SITES}`);
}

notes.push(
  `${CATEGORIES.length} 个分类 / ${TOTAL_SITES} 个站点` +
    `（有图标 ${iconCount}，首字母兜底 ${fallbackCount}）`,
);
notes.push(
  `图标库：header ${headerIcons.size} · icon ${siteIcons.size} · search ${searchIcons.size}`,
);
notes.push(`搜索引擎 ${ENGINES.length} 个，默认「${DEFAULT_ENGINE_ID}」`);

for (const note of notes) console.log(`  · ${note}`);

if (warnings.length > 0) {
  console.log('');
  for (const warning of warnings) console.log(`  ! ${warning}`);
}

if (errors.length > 0) {
  console.error('');
  for (const error of errors) console.error(`  x ${error}`);
  console.error(`\n校验未通过：${errors.length} 个问题。\n`);
  process.exit(1);
}

console.log('  ✓ 图标与数据一致\n');
