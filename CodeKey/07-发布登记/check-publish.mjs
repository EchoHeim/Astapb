#!/usr/bin/env node
/**
 * 发布前查重
 *
 * 目的：避免重复推送。2026-09-17 和 09-19 各出现过一次同主题重复推送，
 * 其中一次是「同标题推两遍」，另一次是「同主题、两个不同标题」——
 * 后者靠肉眼看不出来，所以需要工具按「主题标识 + 标题相似度」来判断。
 *
 * 用法：
 *   # 查一篇准备发的文章
 *   node CodeKey/07-发布登记/check-publish.mjs "树莓派根分区满了怎么扩容" --date=2026-09-21
 *
 *   # 同时给出栏目和主题标识（推荐，主题标识是最可靠的查重依据）
 *   node CodeKey/07-发布登记/check-publish.mjs "树莓派根分区满了怎么扩容" \
 *     --topic=code-扩展根分区 --date=2026-09-21 --platform=公众号
 *
 *   # 只看登记表摘要
 *   node CodeKey/07-发布登记/check-publish.mjs --list
 *
 * 退出码：发现高风险重复时返回 1，否则 0 —— 可以挂在发布流程里做闸门。
 */

import fs from 'node:fs';
import path from 'node:path';

const HERE = import.meta.dirname;
const ROOT = path.resolve(HERE, '..');            // CodeKey
const REPO = path.resolve(HERE, '..', '..');      // 仓库根
const REGISTRY = path.join(HERE, '发布登记表.csv');
const DRAFT_DIRS = [
  { label: 'AI 日报草稿', dir: path.join(ROOT, 'AI 日报') },
  { label: '博客文章', dir: path.join(REPO, 'WebBlog', 'docs') },
];

// ── CSV ────────────────────────────────────────────────────────────
function parseCsv(text) {
  const rows = []; let row = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); field = ''; rows.push(row); row = []; }
    else if (c !== '\r') field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length > 1);
}

function loadRegistry() {
  if (!fs.existsSync(REGISTRY)) {
    console.error('找不到登记表：' + REGISTRY);
    process.exit(1);
  }
  const raw = parseCsv(fs.readFileSync(REGISTRY, 'utf8'));
  const head = raw[0].map((h) => h.replace(/^\uFEFF/, ''));
  const idx = Object.fromEntries(head.map((h, i) => [h, i]));
  return raw.slice(1).map((r) => ({
    日期: (r[idx['发布日期']] || '').trim(),
    平台: (r[idx['平台']] || '').trim(),
    栏目: (r[idx['栏目']] || '').trim(),
    标题: (r[idx['标题']] || '').trim(),
    主题: (r[idx['主题标识']] || '').trim(),
    关键词: (r[idx['关键词']] || '').split('|').map((s) => s.trim()).filter(Boolean),
    备注: (r[idx['备注']] || '').trim(),
  }));
}

// ── 文本相似度 ──────────────────────────────────────────────────────
function normalize(s) {
  return String(s)
    .toLowerCase()
    .replace(/[\s\u3000]/g, '')
    .replace(/[!-/:-@\[-`{-~]/g, '')
    .replace(/[\u3000-\u303f\uff00-\uffef]/g, '');
}

function bigrams(s) {
  const t = normalize(s);
  const set = new Set();
  if (t.length === 1) set.add(t);
  for (let i = 0; i < t.length - 1; i++) set.add(t.slice(i, i + 2));
  return set;
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

// ── 扫描草稿 / 博客 ─────────────────────────────────────────────────
function collectTitles() {
  const out = [];
  for (const { label, dir } of DRAFT_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const walk = (d, rel) => {
      for (const it of fs.readdirSync(d, { withFileTypes: true })) {
        const r = rel ? rel + '/' + it.name : it.name;
        if (/尚德机构|港股打新/.test(r)) continue;
        const fp = path.join(d, it.name);
        if (it.isDirectory()) walk(fp, r);
        else if (it.name.endsWith('.md')) {
          const s = fs.readFileSync(fp, 'utf8');
          const fm = /^---\r?\n[\s\S]*?\r?\n---/.exec(s);
          let title = '';
          if (fm) {
            const t = /^title:[ \t]*(.+)$/m.exec(fm[0]);
            if (t) title = t[1].trim().replace(/^["']|["']$/g, '');
          }
          if (!title) {
            const h = /^#{1,3}[ \t]+(.+)$/m.exec(s.slice(0, 4000));
            title = h ? h[1].trim() : it.name.replace(/\.md$/, '');
          }
          out.push({ label, title, path: path.relative(REPO, fp).replace(/\\/g, '/') });
        }
      }
    };
    walk(dir, '');
  }
  return out;
}

// ── 主流程 ──────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const opt = (name, def = '') => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : def;
};
const positional = argv.filter((a) => !a.startsWith('--'));
const registry = loadRegistry();

if (argv.includes('--list')) {
  console.log(`\n发布登记表 · 共 ${registry.length} 条\n`);
  const byMonth = {};
  for (const r of registry) (byMonth[r.日期.slice(0, 7)] = byMonth[r.日期.slice(0, 7)] || []).push(r);
  for (const m of Object.keys(byMonth).sort().reverse()) {
    console.log(`  ${m}`);
    for (const r of byMonth[m]) {
      console.log(`    ${r.日期}  [${r.栏目}]  ${r.标题}`);
      if (r.备注) console.log(`              ${r.备注}`);
    }
  }
  const dup = new Map();
  for (const r of registry) dup.set(r.主题, (dup.get(r.主题) || 0) + 1);
  const bad = [...dup.entries()].filter(([, n]) => n > 1);
  if (bad.length) {
    console.log('\n  ⚠️ 主题标识重复（历史重复推送）：');
    for (const [t, n] of bad) console.log(`    ${t} → ${n} 次`);
  }
  console.log('');
  process.exit(0);
}

if (!positional.length) {
  console.log(`
发布前查重 · 用法

  node CodeKey/07-发布登记/check-publish.mjs "候选标题" [选项]

选项
  --date=YYYY-MM-DD     计划发布日期（默认今天）
  --topic=<标识>        主题标识，如 code-扩展根分区、tool-office-tool-plus
  --platform=公众号     发布平台（默认 公众号）
  --list                只看登记表摘要
`);
  process.exit(0);
}

const title = positional.join(' ');
const today = new Date().toISOString().slice(0, 10);
const date = opt('date', today);
const topic = opt('topic', '');
const platform = opt('platform', '公众号');

console.log(`\n发布前查重`);
console.log(`  标题    ${title}`);
console.log(`  主题    ${topic || '(未提供 —— 建议给一个，这是最可靠的查重依据)'}`);
console.log(`  日期    ${date}   平台  ${platform}\n`);

const findings = [];
const add = (level, what, detail) => findings.push({ level, what, detail });

const candTitle = bigrams(title);

// 1) 同日同平台已发（合并为一条，避免同一主题有多条记录时重复刷屏）
const sameDay = registry.filter((r) => r.日期 === date && r.平台 === platform);
if (sameDay.length) {
  add(
    '高',
    `同日同平台已经发过 ${sameDay.length} 篇`,
    sameDay.map((r) => `${r.日期}「${r.标题}」（${r.栏目}）`).join('\n      ') +
      `\n      → 一天只发一篇。改到其他日期再发；若这是替换而非新增，请先在登记表里改掉旧行`
  );
}

// 2) 主题标识重复
if (topic) {
  const sameTopic = registry.filter((r) => r.主题 === topic);
  if (sameTopic.length) {
    add(
      '高',
      `主题标识 ${topic} 已经用过 ${sameTopic.length} 次`,
      sameTopic.map((r) => `${r.日期}「${r.标题}」`).join('\n      ') +
        `\n      → 同一主题不要做第二篇。若确实要补充内容，标题加「续」并换一个新标识`
    );
  }
}

// 3) 标题相似度（最多列 3 条，按相似度倒序）
const titleHits = [];
for (const r of registry) {
  const exact = normalize(r.标题) === normalize(title);
  const sim = jaccard(candTitle, bigrams(r.标题));
  if (exact) titleHits.push({ level: '高', sim: 1, text: `${r.日期}「${r.标题}」`, exact });
  else if (sim >= 0.45) titleHits.push({ level: sim >= 0.75 ? '高' : '中', sim, text: `${r.日期}「${r.标题}」`, exact });
}
titleHits.sort((a, b) => b.sim - a.sim);
for (const h of titleHits.slice(0, 3)) {
  add(
    h.level,
    h.exact ? '标题完全相同' : `标题${h.level === '高' ? '高度' : '部分'}相似（${(h.sim * 100).toFixed(0)}%）`,
    h.text
  );
}
if (titleHits.length > 3) add('低', `另有 ${titleHits.length - 3} 条标题有部分相似`, '从 --list 里翻一下登记表');

// 4) 关键词重合（最多列 2 条）
const candKw = opt('keywords', '').split('|').map((s) => s.trim()).filter(Boolean);
if (candKw.length) {
  const kwHits = [];
  for (const r of registry) {
    const shared = candKw.filter((k) => r.关键词.some((x) => x.toLowerCase() === k.toLowerCase()));
    if (shared.length >= 2) kwHits.push({ n: shared.length, shared, r });
  }
  kwHits.sort((a, b) => b.n - a.n);
  for (const h of kwHits.slice(0, 2)) {
    add('中', `关键词重合 ${h.n} 个（${h.shared.join('、')}）`, `${h.r.日期}「${h.r.标题}」`);
  }
}

// 5) 与草稿 / 博客撞车（最多列 4 条）
const candidates = collectTitles();
let scanned = 0;
const draftHits = [];
for (const c of candidates) {
  scanned++;
  const exact = normalize(c.title) === normalize(title);
  const sim = jaccard(candTitle, bigrams(c.title));
  if (exact || sim >= 0.75) draftHits.push({ level: '中', sim: exact ? 1 : sim, c, exact });
  else if (sim >= 0.6) draftHits.push({ level: '低', sim, c, exact: false });
}
draftHits.sort((a, b) => b.sim - a.sim);
for (const h of draftHits.slice(0, 4)) {
  add(
    h.level,
    h.exact ? `${h.c.label}里已有同题` : `${h.c.label}里可能有同题（${(h.sim * 100).toFixed(0)}%）`,
    `${h.c.title}\n      ${h.c.path}`
  );
}
if (draftHits.length > 4) add('低', `另有 ${draftHits.length - 4} 篇草稿/博客部分相似`, '可按需自行检索');

// ── 输出 ────────────────────────────────────────────────────────────
const order = { 高: 0, 中: 1, 低: 2 };
findings.sort((a, b) => order[a.level] - order[b.level]);

if (!findings.length) {
  console.log(`  ✅ 未发现重复风险（比对 ${registry.length} 条登记 + ${scanned} 篇草稿/博客）`);
  console.log(`\n  可以发。发完后记得往 发布登记表.csv 补一行。\n`);
  process.exit(0);
}

const high = findings.filter((f) => f.level === '高');
for (const f of findings) {
  const mark = f.level === '高' ? '❌' : f.level === '中' ? '⚠️ ' : '·';
  console.log(`  ${mark} [${f.level}] ${f.what}`);
  console.log(`      ${f.detail}`);
}

console.log(`\n  共比对 ${registry.length} 条登记 + ${scanned} 篇草稿/博客，发现 ${findings.length} 处风险。`);
if (high.length) {
  console.log(`\n  ❌ 有 ${high.length} 处高风险 —— 先别发，处理完再跑一次。\n`);
  process.exit(1);
}
console.log(`\n  ⚠️ 未发现高风险，但上面几条建议人工确认一遍。\n`);
