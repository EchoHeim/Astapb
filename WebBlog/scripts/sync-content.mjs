#!/usr/bin/env node
/**
 * 内容同步与体检 —— 在每次构建前自动运行（npm run build 会先触发 prebuild）。
 *
 * 它解决的是一个很实际的问题：
 *   docs/blog 下的 Markdown 是**手工维护**的，而新博客的文章列表、标签页、
 *   RSS 全部依赖 frontmatter。如果新加一篇没有 frontmatter 的文章，
 *   Astro 的内容集合会直接校验失败、整个站点构建不出来。
 *
 * 所以这里在构建前把缺的补齐，让「往 docs/blog 丢一个 .md 就自动上线」
 * 这件事真正成立。脚本只补不删，可以反复运行。
 *
 * 用法：
 *   node scripts/sync-content.mjs           # 补全 + 体检
 *   node scripts/sync-content.mjs --check   # 只体检，不写文件
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(HERE, '..');
const REPO = path.resolve(PROJECT, '..');
const DOCS = path.join(REPO, 'docs');
const BLOG = path.join(DOCS, 'blog');

const CHECK_ONLY = process.argv.includes('--check');

/** 与 src/content.config.ts 的排除规则必须保持一致 */
const EXCLUDE_DIRS = new Set([
  '尚德机构-考研',
  '尚德机构-考研-知识库',
  '港股打新',
  'Catalog',
]);
const EXCLUDE_FILES = new Set(['_sidebar.md', 'README.md', 'blog_start.md']);

/** 与 src/content.config.ts 的 TAG_RULES 保持一致 */
const TAG_RULES = [
  ['C_C++/C++学习笔记/', 'C/C++', 'C++ 学习笔记'],
  ['C_C++/C语言实用技巧/', 'C/C++', 'C 语言技巧'],
  ['C_C++/', 'C/C++', null],
  ['Linux/Linux小技巧/', 'Linux', 'Linux 小技巧'],
  ['Linux/Linux应用编程/', 'Linux', 'Linux 应用编程'],
  ['Linux/Linux驱动调试相关/', 'Linux', 'Linux 驱动调试'],
  ['Linux/raspberryPi/', 'Linux', '树莓派'],
  ['Linux/stm32mp157/', 'Linux', 'STM32MP157'],
  ['Linux/', 'Linux', null],
  ['NoteBook/Python/Python数据分析/', 'Python', 'Python 数据分析'],
  ['NoteBook/Python/Python数据结构/', 'Python', 'Python 数据结构'],
  ['NoteBook/Python/Python入门学习笔记/', 'Python', 'Python 入门'],
  ['NoteBook/Python/Anaconda/', 'Python', 'Anaconda'],
  ['NoteBook/Python/Matplotlib/', 'Python', 'Matplotlib'],
  ['NoteBook/Python/', 'Python', null],
  ['NoteBook/', 'NoteBook', null],
  ['Python/', 'Python', null],
  ['Android/', 'Android', null],
  ['FPGA/', 'FPGA', null],
  ['LVGL/', 'LVGL', null],
  ['ToolBox/', 'ToolBox', null],
  ['project/', '建站', null],
];

// ---------------------------------------------------------------- 工具函数

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      if (EXCLUDE_DIRS.has(name)) continue;
      walk(full, out);
    } else if (name.endsWith('.md') && !EXCLUDE_FILES.has(name)) {
      out.push(full);
    }
  }
  return out;
}

/** 把仓库相对路径（git 输出，如 docs/blog/a.md）映射成 blog 相对路径 */
function buildDateMap() {
  const map = new Map();
  try {
    const out = execFileSync(
      'git',
      [
        '-c',
        'core.quotepath=false',
        'log',
        '--reverse',
        '--diff-filter=A',
        '--name-only',
        '--format=@@%aI',
      ],
      { cwd: REPO, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] }
    );
    let cur = null;
    for (const line of out.split('\n')) {
      if (line.startsWith('@@')) {
        cur = line.slice(2).trim();
        continue;
      }
      const p = line.trim();
      if (!p || !cur) continue;
      const rel = p.startsWith('docs/') ? p.slice(5) : p;
      if (!map.has(rel)) map.set(rel, cur.slice(0, 10));
    }
  } catch {
    // CI 上常见：浅克隆（fetch-depth: 1）导致取不到历史。
    // 此时新文章回退到文件时间，恰好就是它的新增日期，可以接受。
  }
  return map;
}

function stripMd(s) {
  return s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[*_>#~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitFrontmatter(text) {
  const s = text.replace(/^\uFEFF/, '');
  if (!s.startsWith('---')) return { fm: null, body: s };
  const end = s.indexOf('\n---', 3);
  if (end < 0) return { fm: null, body: s };
  return { fm: s.slice(3, end), body: s.slice(end + 4).replace(/^\r?\n/, '') };
}

function parseFm(block) {
  const data = {};
  for (const raw of block.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const i = line.indexOf(':');
    if (i < 0) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim();
    // 去掉包裹引号
    const m = val.match(/^(['"])([\s\S]*)\1$/);
    if (m) val = m[2];
    if (val.startsWith('[') && val.endsWith(']')) {
      data[key] = val
        .slice(1, -1)
        .split(',')
        .map((x) => x.trim().replace(/^(['"])([\s\S]*)\1$/, '$2'))
        .filter(Boolean);
    } else {
      data[key] = val;
    }
  }
  return data;
}

function yamlStr(s) {
  if (s == null) return '""';
  if (/[:#[\]{}&*!|>'"%@`]/.test(s) || /^[-\s]|\s$/.test(s)) {
    return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  }
  return String(s);
}

function extractTitle(body, stem) {
  let n = 0;
  for (const line of body.split('\n')) {
    const s = line.trim();
    if (!s) continue;
    if (++n > 10) break;
    if (s.startsWith('<!--')) continue;
    const m = s.match(/^#{1,6}\s+(.+?)\s*$/);
    if (m) {
      const t = stripMd(m[1]);
      // 纯编号小节（如「1. 环境准备」）不作为文章标题
      if (t && !/^\d+[.、]?\s*\S*$/.test(t)) return t;
      if (t && !/^\d+\s*[.、]/.test(t)) return t;
    }
  }
  const fb = stem.replace(/^\d+\s*[-_.、]\s*/, '').trim() || stem;
  return /^[a-z]+$/.test(fb) ? fb[0].toUpperCase() + fb.slice(1) : fb;
}

function extractSummary(body) {
  const buf = [];
  let started = false;
  let inCode = false;
  for (const line of body.split('\n')) {
    const s = line.trim();
    if (s.startsWith('```')) {
      inCode = !inCode;
      if (started) break;
      continue;
    }
    if (inCode) continue;
    if (!started) {
      if (!s || s.startsWith('#') || s.startsWith('<!--')) continue;
      started = true;
    }
    if (!s) {
      if (buf.length) break;
      continue;
    }
    if (s.startsWith('#') || s.startsWith('<!--')) break;
    buf.push(s);
  }
  const t = stripMd(buf.join(' '));
  return t.length > 100 ? t.slice(0, 100).trimEnd() + '…' : t;
}

function tagsFor(rel) {
  for (const [prefix, a, b] of TAG_RULES) {
    if (rel.startsWith(prefix)) return b ? [a, b] : [a];
  }
  return null;
}

/**
 * 剔除代码块，只留下会真正被解析的正文。
 * 覆盖两种形态：围栏代码块（``` / ~~~）与四空格缩进代码块。
 */
function stripCode(md) {
  return md
    .replace(/^([ \t]*)(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1?\2[^\n]*$/gm, '')
    .replace(/^(?: {4}|\t)[^\n]*$/gm, '');
}

// ---------------------------------------------------------------- 主流程

const dateMap = buildDateMap();
const files = walk(BLOG);
const stats = { total: files.length, added: 0, patched: 0, ok: 0, noTag: [], badImg: [] };

for (const file of files) {
  const rel = path.relative(BLOG, file).split(path.sep).join('/');
  const stem = path.basename(file, '.md');
  const raw = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const { fm, body } = splitFrontmatter(raw);
  const data = fm ? parseFm(fm) : {};

  const missing = [];
  if (!data.title) missing.push('title');
  if (!data.date) missing.push('date');
  if (!data.tags || !data.tags.length) missing.push('tags');

  if (missing.length) {
    const title = data.title || extractTitle(body, stem);
    let date = data.date;
    if (!date) {
      // git 历史优先；取不到（浅克隆 / 新文件）就用文件时间，对新增文章恰好正确
      date =
        dateMap.get('blog/' + rel) ||
        new Date(fs.statSync(file).mtime).toISOString().slice(0, 10);
    }
    let tags = data.tags;
    if (!tags || !tags.length) {
      tags = tagsFor(rel);
      if (!tags) {
        tags = ['未分类'];
        stats.noTag.push(rel);
      }
    }
    const summary = data.summary || extractSummary(body);

    const lines = [
      '---',
      `title: ${yamlStr(title)}`,
      `date: ${date}`,
      `tags: [${tags.map(yamlStr).join(', ')}]`,
    ];
    if (summary) lines.push(`summary: ${yamlStr(summary)}`);
    lines.push('---', '');

    if (!CHECK_ONLY) {
      fs.writeFileSync(file, lines.join('\n') + body.replace(/^\n+/, ''), 'utf8');
    }
    if (fm) stats.patched++;
    else stats.added++;
    console.log(
      `${c.yellow(fm ? '补全' : '新增')} ${c.cyan(rel)}  ${c.dim('缺 ' + missing.join('/'))}`
    );
  } else {
    stats.ok++;
  }

  // 体检：正文里相对路径的图片若不存在，Astro 构建会直接失败。
  // 必须先剔除代码块 —— 笔记里大量出现「![](...)」的语法示例，
  // 不排除就会一直报误警，报到最后没人再看这个检查。
  const scan = stripCode(fm ? body : raw);
  const re = /!\[[^\]]*\]\(\s*([^)\s]+)/g;
  let m;
  while ((m = re.exec(scan))) {
    const target = m[1];
    if (/^(https?:|\/\/|\/|#|data:)/i.test(target)) continue;
    let decoded = target;
    try {
      decoded = decodeURIComponent(target);
    } catch {
      /* 保持原样 */
    }
    const abs = path.resolve(path.dirname(file), decoded.split('#')[0]);
    if (!fs.existsSync(abs)) {
      stats.badImg.push(`${rel}  ->  ${target}`);
    }
  }
}

// ---------------------------------------------------------------- 报告

console.log('');
console.log(c.dim('─'.repeat(56)));
console.log(
  `内容同步：共 ${stats.total} 篇 ｜ 新增 frontmatter ${stats.added} ｜ 补全 ${stats.patched} ｜ 已完整 ${stats.ok}`
);

if (stats.noTag.length) {
  console.log(c.yellow(`\n未匹配到分类规则 ${stats.noTag.length} 篇（已标为「未分类」）：`));
  for (const f of stats.noTag) console.log('  ' + f);
}

if (stats.badImg.length) {
  console.log(
    c.red(`\n相对路径图片找不到文件 ${stats.badImg.length} 处 —— 会导致构建失败，请修正：`)
  );
  for (const f of stats.badImg) console.log('  ' + f);
}

if (CHECK_ONLY) {
  console.log(c.dim('\n（--check 模式，未写入任何文件）'));
}
console.log(c.dim('─'.repeat(56)));
