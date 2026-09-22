#!/usr/bin/env node
/**
 * 「AI 简报」生成器 —— 把公众号日报的 Markdown 原稿转成可直接访问的静态页。
 *
 * 源：  ../CodeKey/AI 日报/AI日报_9月22日.md   （与博客分属两个目录，跨目录读取）
 * 出：
 *   docs/AI动态/YYYY-MM/YYYY-MM-DD.html   ← 正本，随仓库提交
 *   public/AI动态/YYYY-MM/YYYY-MM-DD.html ← 构建镜像，已写进 .gitignore
 *   src/data/ai-brief.json                ← 目录页用的清单
 *
 * 为什么产物要落两处：Astro 只把 `public/` 复制进构建产物，不会去 `docs/` 里
 * 捞静态文件（那里是内容集合的 Markdown 源）。而按约定，正本必须放在
 * `docs/AI动态/`，所以由本脚本额外镜像一份到 `public/`。**改动只改 docs/ 那份，
 * public/ 里的会在下次运行时被覆盖**，不要手改。
 *
 * 镜像这一步是**无条件**执行的：即使源目录不存在（比如换台机器构建），
 * 也要从 docs/ 里已提交的产物把 public/ 重建出来。CI 检出的仓库里
 * public/AI动态 是空的（已 gitignore），少了这一步，简报链接会全部 404。
 *
 * 两个目录名（docs、public）与 src/consts.ts 里的 BASE_PATH 是耦合的：
 * 如果以后把博客挪回子路径，本文件的 BASE 要跟着改。
 *
 * 脚本是幂等的，可以反复跑；每次构建前由 predev / prebuild 自动触发。
 * 源目录不存在时只告警、不报错 —— 这样在没放素材库的机器上也能构建，
 * 沿用上一次的清单，不会把站点打挂。
 *
 * 用法：
 *   node scripts/sync-ai-brief.mjs
 *   AI_BRIEF_SRC=/path/to/AI日报 node scripts/sync-ai-brief.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(HERE, '..');
const REPO = path.resolve(PROJECT, '..');

const SRC_DIR = process.env.AI_BRIEF_SRC
  ? path.resolve(process.env.AI_BRIEF_SRC)
  : path.join(REPO, 'CodeKey', 'AI 日报');

const OUT_DIR = path.join(PROJECT, 'docs', 'AI动态');
const MIRROR_DIR = path.join(PROJECT, 'public', 'AI动态');
const MANIFEST = path.join(PROJECT, 'src', 'data', 'ai-brief.json');

/** 与 src/consts.ts 保持一致（生成的是自包含 HTML，取不到那里导出的常量） */
const BASE = '';
const SITE_TITLE = "MacLodge's Blog";
const SITE_URL = 'https://shilong.js.org';
const AUTHOR = { name: 'MacLodge', github: 'https://github.com/EchoHeim' };

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

/** 站内链接：与 src/utils/url.ts 的 withBase 同语义 */
function u(p = '') {
  const b = BASE.endsWith('/') ? BASE : BASE + '/';
  return b + String(p).replace(/^\/+/, '');
}

// ------------------------------------------------------------------ Markdown

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ESC[ch]);

/** 行内标记 → HTML。顺序有讲究：先抽走行内代码，再让它躲过其余规则的改写。 */
function inline(src) {
  const codes = [];
  let s = esc(src);
  s = s.replace(/`([^`]+)`/g, (_, code) => {
    codes.push(code);
    return `\u0000${codes.length - 1}\u0000`;
  });
  s = s.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
    (_, alt, url) => `<img src="${url}" alt="${alt}" loading="lazy" decoding="async">`
  );
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, text, url) => {
    const ext = /^https?:/i.test(url);
    const attrs = ext ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${url}"${attrs}>${text}</a>`;
  });
  s = s.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
  s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[Number(i)]}</code>`);
}

function renderTable(rows) {
  const cells = (row) =>
    row
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((cell) => cell.trim());
  const head = cells(rows[0]);
  const body = rows.slice(2).map(cells);
  const th = head.map((cell) => `<th>${inline(cell)}</th>`).join('');
  const tb = body
    .map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`)
    .join('');
  return `<table><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table>`;
}

const isHr = (t) => /^(-{3,}|\*{3,}|_{3,})$/.test(t);
const isHeading = (t) => /^#{1,6}\s+/.test(t);
const isListItem = (t) => /^([-*+]|\d+[.)])\s+/.test(t);
const isQuote = (t) => t.startsWith('>');
const isFence = (t) => /^(```|~~~)/.test(t);
const isTableRow = (t) => t.startsWith('|');

/**
 * 极简 Markdown → HTML。只覆盖这批日报真实用到的写法：
 * 标题、段落、粗体、行内代码、引用、列表、表格、分隔线、围栏代码块。
 *
 * 额外做一件事：把「💡 小猴点评」领起的那几段整体折进一个 <aside class="callout">，
 * 它是日报的招牌结构，散在正文里读起来就没有节奏了。
 *
 * `nested` 供递归调用使用 —— 渲染点评块内部时必须关掉这层识别，
 * 否则同一段内容会再次被判为点评块，无限递归把栈打爆。
 */
function renderMarkdown(md, nested = false) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  let callout = null;

  const flush = () => {
    if (callout) {
      out.push(
        `<aside class="callout">${renderMarkdown(callout.join('\n'), true)}</aside>`
      );
      callout = null;
    }
  };

  while (i < lines.length) {
    const t = lines[i].trim();
    if (t === '') {
      i++;
      continue;
    }

    if (isFence(t)) {
      const fence = t.slice(0, 3);
      const lang = t.slice(3).trim();
      const buf = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith(fence)) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      flush();
      const cls = lang ? ` class="language-${esc(lang)}"` : '';
      out.push(`<pre><code${cls}>${esc(buf.join('\n'))}</code></pre>`);
      continue;
    }

    if (isHr(t)) {
      flush();
      out.push('<hr>');
      i++;
      continue;
    }

    if (isHeading(t)) {
      flush();
      const m = t.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
      const depth = Math.min(4, Math.max(2, m[1].length));
      out.push(`<h${depth}>${inline(m[2])}</h${depth}>`);
      i++;
      continue;
    }

    if (
      isTableRow(t) &&
      lines[i + 1] !== undefined &&
      /^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/.test(lines[i + 1])
    ) {
      flush();
      const rows = [];
      while (i < lines.length && isTableRow(lines[i].trim())) {
        rows.push(lines[i].trim());
        i++;
      }
      out.push(renderTable(rows));
      continue;
    }

    if (isQuote(t)) {
      flush();
      const buf = [];
      while (i < lines.length && isQuote(lines[i].trim())) {
        buf.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      const inner = buf
        .map((line) => (line.trim() ? `<p>${inline(line)}</p>` : ''))
        .join('');
      out.push(`<blockquote>${inner}</blockquote>`);
      continue;
    }

    if (isListItem(t)) {
      flush();
      const ordered = /^\d+[.)]\s+/.test(t);
      const items = [];
      while (i < lines.length && isListItem(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^([-*+]|\d+[.)])\s+/, ''));
        i++;
      }
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</${tag}>`);
      continue;
    }

    // 段落：连续非空、非块级起始的行合成一段
    const buf = [];
    while (i < lines.length) {
      const s = lines[i].trim();
      if (
        s === '' ||
        isHr(s) ||
        isHeading(s) ||
        isQuote(s) ||
        isFence(s) ||
        isTableRow(s) ||
        isListItem(s)
      ) {
        break;
      }
      buf.push(s);
      i++;
    }

    if (!nested && /^💡/.test(buf[0])) {
      callout = buf.slice();
      continue;
    }
    if (callout) {
      callout.push('', ...buf);
      continue;
    }
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }

  flush();
  return out.join('\n');
}

// --------------------------------------------------------------- 原稿解析

const stripMd = (s) =>
  s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[*_>#~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** 文件名里的日期。日报用「AI日报_9月22日.md」，也兼容带年份与 ISO 的写法。 */
function dateFromName(stem, fallback) {
  let m = stem.match(/(\d{4})\s*[-年./]\s*(\d{1,2})\s*[-月./]\s*(\d{1,2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  m = stem.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  if (!m) return fallback;
  const month = Number(m[1]);
  const day = Number(m[2]);
  const now = new Date();
  // 文件名不带年份：12 月里的稿子在次年 1 月看时不能算成今年
  const year = month > now.getMonth() + 1 ? now.getFullYear() - 1 : now.getFullYear();
  return new Date(year, month - 1, day);
}

/** 第一个「不在代码围栏里」的一级标题，它就是正文的起点 */
function findBodyTitle(lines) {
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (isFence(t)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = t.match(/^#\s+(.+?)\s*$/);
    if (m) return { index: i, text: m[1].trim() };
  }
  return null;
}

/** 「发布配置」块里某个字段后面跟的第一个围栏块内容 */
function configField(lines, markerRe) {
  for (let i = 0; i < lines.length; i++) {
    if (!markerRe.test(lines[i].trim())) continue;
    for (let j = i + 1; j < Math.min(lines.length, i + 14); j++) {
      if (!isFence(lines[j].trim())) continue;
      const buf = [];
      for (let k = j + 1; k < lines.length; k++) {
        if (isFence(lines[k].trim())) return buf.join('\n').trim();
        buf.push(lines[k]);
      }
      return null;
    }
    return null;
  }
  return null;
}

/**
 * 标题清洗。日报的标题带两种体裁标记：
 *   前缀  `AI日报｜9月19日：`      后缀  `｜9.21 AI日报`
 * 页面已经把日期单独排版了，留着只是重复，去掉后标题更像一条正经的新闻标题。
 */
function cleanTitle(raw) {
  let s = stripMd(raw);
  s = s.replace(/^AI\s*日报\s*[｜|:：\-—]\s*/, '');
  s = s.replace(/^\d{1,2}\s*月\s*\d{1,2}\s*日\s*[：:]\s*/, '');
  s = s.replace(/\s*[｜|]\s*\d{1,2}[.\-/月]\d{1,2}[日]?\s*AI\s*日报\s*$/i, '');
  s = s.replace(/\s*[｜|]\s*AI\s*日报\s*$/i, '');
  s = s.replace(/\s*[-—·]\s*AI\s*日报\s*$/i, '');
  return s.trim();
}

/** 正文：从一级标题之后开始，去掉内部留档段落与结尾的话题标签行 */
function extractBody(lines, titleIndex) {
  let body = lines.slice(titleIndex + 1);

  // 「本期未采用」是编辑留档（写明了砍稿理由），不该进读者页面
  const cut = body.findIndex((l) => /^##\s*本期未采用/.test(l.trim()));
  if (cut >= 0) body = body.slice(0, cut);

  // 结尾的话题标签行 + 它上面的分隔线 + 空行
  while (body.length) {
    const last = body[body.length - 1].trim();
    const isTagLine = /^#[^\s#]+(\s+#[^\s#]+)*$/.test(last);
    if (last === '' || last === '---' || last === '***' || isTagLine) body.pop();
    else break;
  }

  body = body.filter((l) => !/^\s*<!--/.test(l));
  return body;
}

/** 署名条（🐵 那一行）单独抽出来放到标题下方，正文里就不重复了 */
function takeByline(body) {
  for (let i = 0; i < body.length; i++) {
    const t = body[i].trim();
    if (!t) continue;
    if (/^🐵/.test(t)) {
      const byline = stripMd(t);
      const rest = body.slice(i + 1);
      while (rest.length && (rest[0].trim() === '' || isHr(rest[0].trim()))) rest.shift();
      return { byline, body: rest };
    }
    break;
  }
  return { byline: '', body };
}

function readingMinutes(text) {
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const words = (text.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[A-Za-z0-9]+/g) || [])
    .length;
  return Math.max(1, Math.round((cjk + words * 1.5) / 400));
}

/** 摘要兜底：跳过标题/分隔线，取第一段真正文 */
function firstParagraph(md) {
  for (const block of md.split(/\n{2,}/)) {
    const t = block.trim();
    if (!t || isHeading(t) || isHr(t) || isQuote(t) || isListItem(t) || isTableRow(t)) {
      continue;
    }
    return stripMd(t);
  }
  return '';
}

/** 解析一份原稿 */
function parseBrief(file) {
  const stem = path.basename(file, path.extname(file));
  const raw = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  const lines = raw.replace(/\r\n/g, '\n').split('\n');

  const anchor = findBodyTitle(lines);
  if (!anchor) return null;

  const stat = fs.statSync(file);
  const date = dateFromName(stem, stat.mtime);

  const configTitle = configField(lines, /^\*\*标题\*\*/);
  const title = cleanTitle(configTitle || anchor.text);
  if (!title) return null;

  const { byline, body } = takeByline(extractBody(lines, anchor.index));
  const md = body.join('\n').replace(/^\n+/, '').replace(/\n{3,}/g, '\n\n').trim();
  if (!md) return null;

  const html = renderMarkdown(md);

  const summaryRaw =
    configField(lines, /^\*\*(一句话总结|摘要|导语)/) || firstParagraph(md);
  const summary =
    summaryRaw.length > 130 ? summaryRaw.slice(0, 130).trimEnd() + '…' : summaryRaw;

  const tagSource =
    configField(lines, /^\*\*(话题标签|文末标签|标签|话题)\*\*/) ||
    (lines.slice().reverse().find((l) => /^#[^\s#]+(\s+#[^\s#]+)*$/.test(l.trim())) ||
      '');
  const tags = [
    ...new Set(
      tagSource
        .split(/[\s#]+/)
        .map((t) => t.trim())
        .filter(Boolean)
    ),
  ];

  const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  const stamp = `${key}-${String(date.getDate()).padStart(2, '0')}`;

  return {
    date,
    key,
    stamp,
    title,
    summary,
    tags,
    byline,
    html,
    text: stripMd(md),
    minutes: readingMinutes(md),
    rel: `AI动态/${key}/${stamp}.html`,
    source: path.basename(file),
  };
}

// --------------------------------------------------------------- 页面模板

const WEEK = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

const dateZh = (d) => `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
const dateSlash = (d) =>
  `${d.getFullYear()} / ${String(d.getMonth() + 1).padStart(2, '0')} / ${String(
    d.getDate()
  ).padStart(2, '0')}`;

const PAGE_CSS = `
:root{--paper:#fbfaf6;--paper-2:#f4f2eb;--ink:#17150f;--ink-2:#3d382e;--sub:#7a7466;--faint:#a9a296;--rule:#e4e0d4;--rule-2:#cfc9b8;--accent:#b04a2f;--accent-ink:#8e3a23;--accent-soft:#f3e6e0;--code-bg:#f6f4ee;--bg-mark:#f7e9c8;--shadow:0 1px 0 rgba(23,21,15,.04),0 10px 30px -18px rgba(23,21,15,.28);--serif:Georgia,"Times New Roman","Songti SC","Noto Serif SC","Source Han Serif SC",STSong,SimSun,serif;--sans:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC",system-ui,sans-serif;--mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Cascadia Mono","Courier New",monospace;--measure:40rem;--pad:28px;--nav-h:56px;color-scheme:light}
[data-theme="dark"]{--paper:#131210;--paper-2:#1b1a15;--ink:#f0ede5;--ink-2:#cdc8bb;--sub:#948d7e;--faint:#6c6558;--rule:#2c2a21;--rule-2:#3e3b2f;--accent:#e28a61;--accent-ink:#f0a882;--accent-soft:#2b1f18;--code-bg:#1a1914;--bg-mark:#47391a;--shadow:0 1px 0 rgba(0,0,0,.3),0 10px 30px -18px rgba(0,0,0,.7);color-scheme:dark}
*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.8;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-wrap:break-word}
img{max-width:100%;height:auto}
a{color:inherit;text-decoration:none}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
::selection{background:var(--accent-soft);color:var(--accent-ink)}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:2px}
.sr-only{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.top{position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--paper) 88%,transparent);backdrop-filter:saturate(160%) blur(12px);-webkit-backdrop-filter:saturate(160%) blur(12px);border-top:3px solid var(--ink);border-bottom:1px solid var(--rule)}
.top__in{max-width:1000px;margin:0 auto;padding:0 var(--pad);height:var(--nav-h);display:flex;align-items:center;gap:20px}
.brand{display:flex;align-items:center;gap:10px;font-family:var(--serif);font-size:16px;font-weight:600;white-space:nowrap}
.brand__mark{width:24px;height:24px;flex:0 0 24px;border-radius:3px;background:var(--ink);color:var(--paper);display:grid;place-items:center;font-size:14px;font-weight:700;line-height:1}
.brand:hover{color:var(--accent-ink)}
.top__nav{display:flex;align-items:center;gap:6px;margin-left:auto}
.top__nav a,.icon-btn{font-size:12.5px;letter-spacing:.11em;color:var(--sub);padding:7px 12px;border-radius:4px;transition:color .18s,background .18s;white-space:nowrap}
.top__nav a:hover,.icon-btn:hover{color:var(--ink);background:var(--paper-2)}
.icon-btn{width:34px;height:34px;padding:0;display:grid;place-items:center}
.icon-btn svg{width:17px;height:17px;display:block;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
[data-theme="dark"] .theme-toggle__light{display:none}
.icon-btn .theme-toggle__dark{display:none}
[data-theme="dark"] .theme-toggle__dark{display:block}
main{display:block;min-height:60vh}
.wrap{max-width:1000px;margin:0 auto;padding:0 var(--pad)}
.brief{padding:52px 0 0}
.kicker{font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);font-weight:600;margin-bottom:16px}
.brief h1{font-family:var(--serif);font-size:clamp(27px,3.9vw,41px);font-weight:600;line-height:1.28;letter-spacing:-.024em;margin:0 0 20px;max-width:22em;text-wrap:balance}
.meta{display:flex;align-items:center;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--sub);padding-bottom:20px;border-bottom:1px solid var(--rule)}
.meta .dot{width:3px;height:3px;flex:0 0 3px;border-radius:50%;background:var(--faint)}
.lede{font-size:17px;line-height:1.8;color:var(--ink-2);max-width:var(--measure);margin:26px 0 0}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin:20px 0 0}
.tag{font-size:11px;letter-spacing:.04em;color:var(--sub);border:1px solid var(--rule-2);border-radius:2px;padding:2px 8px}
.prose{font-size:16.5px;line-height:1.85;color:var(--ink-2);max-width:var(--measure);padding:34px 0 0}
.prose>*:first-child{margin-top:0}
.prose>*+*{margin-top:1.15em}
.prose h2,.prose h3,.prose h4{color:var(--ink);text-wrap:balance}
.prose h2{font-family:var(--serif);font-size:25px;font-weight:600;letter-spacing:-.02em;line-height:1.36;margin:2.3em 0 0;padding-top:1.1em;border-top:1px solid var(--rule)}
.prose>h2:first-child{border-top:0;padding-top:0}
.prose h3{font-family:var(--serif);font-size:19px;font-weight:600;margin:1.9em 0 0}
.prose h4{font-size:15.5px;font-weight:650;margin:1.7em 0 0}
.prose p{margin:1.15em 0 0}
.prose a{color:var(--accent-ink);border-bottom:1px solid color-mix(in srgb,var(--accent) 40%,transparent);transition:border-color .18s,background .18s}
.prose a:hover{border-bottom-color:var(--accent);background:var(--accent-soft)}
.prose strong{color:var(--ink);font-weight:650}
.prose ul,.prose ol{margin:1.1em 0 0;padding-left:1.5em}
.prose li{margin:.42em 0}
.prose li::marker{color:var(--accent);font-family:var(--serif)}
.prose hr{margin:2.6em auto;width:56px;height:0;border-top:1px solid var(--rule-2);position:relative}
.prose hr::after{content:"✳";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:var(--paper);color:var(--faint);font-size:11px;padding:0 8px}
.prose blockquote{margin:1.6em 0 0;padding:2px 0 2px 20px;border-left:2px solid var(--accent);font-family:var(--serif);font-size:17px;line-height:1.72;color:var(--ink)}
.prose blockquote p{margin:.5em 0 0}
.prose blockquote p:first-child{margin-top:0}
.prose code{font-family:var(--mono);font-size:.86em;background:var(--code-bg);border:1px solid var(--rule);border-radius:3px;padding:2px 6px;color:var(--accent-ink);word-break:break-word}
.prose pre{margin:1.6em 0 0;background:var(--code-bg);border:1px solid var(--rule);border-left:2px solid var(--accent);border-radius:4px;padding:16px 18px;overflow-x:auto;font-size:13px;line-height:1.75}
.prose pre code{background:none;border:0;padding:0;color:inherit;font-size:inherit;white-space:pre}
.prose table{width:100%;border-collapse:collapse;margin:1.7em 0 0;font-size:14px;display:block;overflow-x:auto}
.prose th{text-align:left;font-size:11.5px;letter-spacing:.11em;text-transform:uppercase;color:var(--sub);font-weight:600;padding:0 14px 9px 0;border-bottom:2px solid var(--ink);white-space:nowrap}
.prose td{padding:11px 14px 11px 0;border-bottom:1px solid var(--rule);vertical-align:top}
.prose img{display:block;margin:1.8em 0 0;border:1px solid var(--rule);border-radius:4px;background:var(--paper-2)}
.prose .callout{margin:1.9em 0 0;padding:20px 22px;background:var(--paper-2);border-left:2px solid var(--accent);border-radius:0 4px 4px 0}
.prose .callout>*:first-child{margin-top:0}
.prose .callout p{margin:.85em 0 0;font-size:15.5px;line-height:1.82}
.prose .callout strong{color:var(--accent-ink)}
.foot{margin:52px 0 0;padding-top:24px;border-top:1px solid var(--rule)}
.note{font-size:12.5px;color:var(--sub);line-height:1.75;background:var(--paper-2);border-radius:4px;padding:15px 17px}
.note b{color:var(--ink);font-weight:600}
.nav{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:22px}
.nav a,.nav span{display:block;padding:16px 18px;border:1px solid var(--rule);border-radius:4px;transition:border-color .2s,background .2s,transform .2s}
.nav a:hover{border-color:var(--rule-2);background:var(--paper-2);transform:translateY(-1px)}
.nav span{color:var(--faint);font-size:12.5px;display:flex;align-items:center;justify-content:center;border-style:dashed}
.nav__lab{font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;color:var(--sub);margin-bottom:6px}
.nav__t{font-family:var(--serif);font-size:15px;font-weight:600;color:var(--ink);line-height:1.45}
.nav .next{text-align:right}
.back{margin:26px 0 0;font-size:13.5px}
.back a{color:var(--sub)}
.back a:hover{color:var(--accent)}
.site-foot{border-top:1px solid var(--rule);margin-top:56px;padding:30px 0 44px;font-size:12.5px;color:var(--faint)}
.site-foot__in{max-width:1000px;margin:0 auto;padding:0 var(--pad);display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
.site-foot a{color:var(--faint)}
.site-foot a:hover{color:var(--accent)}
@media (max-width:760px){:root{--pad:18px}.brief{padding:36px 0 0}.nav{grid-template-columns:1fr}.nav .next{text-align:left}.prose{font-size:16px}.top__nav a.hide-sm{display:none}}
@media print{.top,.nav,.back{display:none!important}body{background:#fff;font-size:11pt}.prose .callout{background:none;border-left-width:2px}}
`.trim();

function renderPage(brief, newer, older) {
  const canonical = `${SITE_URL}${u(brief.rel)}`;
  const desc = esc(brief.summary || brief.title);
  const tagHtml = brief.tags
    .slice(0, 8)
    .map((t) => `<span class="tag">#${esc(t)}</span>`)
    .join('');

  /** 左右两侧沿用文章页的约定：左边是更早的一期，右边是更新的一期 */
  const linkCard = (target, dir) => {
    if (!target) {
      return `<span>${dir === 'older' ? '已经是最早一期' : '已经是最新一期'}</span>`;
    }
    const lab = dir === 'older' ? '← 上一期' : '下一期 →';
    const cls = dir === 'older' ? 'prev' : 'next';
    const rel = dir === 'older' ? 'prev' : 'next';
    return `<a class="${cls}" href="${u(target.rel)}" rel="${rel}"><div class="nav__lab">${lab}</div><div class="nav__t">${esc(
      target.title
    )}</div></a>`;
  };

  return `<!doctype html>
<html lang="zh-CN" data-theme="light" data-theme-key="blog-theme">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(brief.title)} · AI 简报</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#fbfaf6" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#131210" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(brief.title)}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta name="author" content="${AUTHOR.name}">
<style>${PAGE_CSS}</style>
<script>
/* 主题在首屏绘制前定下来，避免闪一下默认色。localStorage 键与主站同名，
   从博客点进来时能延续访客已经选好的亮/暗设置。 */
(function(){try{var r=document.documentElement;var s=localStorage.getItem(r.dataset.themeKey||'blog-theme');var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');r.setAttribute('data-theme',t);}catch(e){}})();
</script>
</head>
<body>
<a class="sr-only" href="#main">跳到主要内容</a>

<header class="top">
  <div class="top__in">
    <a class="brand" href="${u('')}"><span class="brand__mark" aria-hidden="true">M</span>${SITE_TITLE}</a>
    <nav class="top__nav" aria-label="页内导航">
      <a href="${u('AI动态/')}">简报目录</a>
      <a class="hide-sm" href="${u('')}">首页</a>
      <button class="icon-btn theme-toggle" type="button" data-theme-toggle aria-label="切换深色 / 浅色主题" title="切换主题">
        <svg class="theme-toggle__light" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
        <svg class="theme-toggle__dark" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>
      </button>
    </nav>
  </div>
</header>

<main id="main">
  <article class="brief">
    <div class="wrap">
      <div class="kicker">AI 简报 · ${dateZh(brief.date)}</div>
      <h1>${esc(brief.title)}</h1>
      <div class="meta">
        <time datetime="${brief.stamp}">${dateSlash(brief.date)}</time>
        <span class="dot" aria-hidden="true"></span>
        <span>${WEEK[brief.date.getDay()]}</span>
        ${brief.byline ? `<span class="dot" aria-hidden="true"></span><span>${esc(brief.byline)}</span>` : ''}
        <span class="dot" aria-hidden="true"></span>
        <span>约 ${brief.minutes} 分钟读完</span>
      </div>
      ${brief.summary ? `<p class="lede">${esc(brief.summary)}</p>` : ''}
      ${tagHtml ? `<div class="tags">${tagHtml}</div>` : ''}

      <div class="prose">
${brief.html}
      </div>

      <div class="foot">
        <div class="note">
          <b>关于这份简报</b><br>
          内容由公众号日报整理而来，代表原文作者观点，不构成任何投资建议。
          信息以公开发布时的报道为准，时效性内容请以最新消息为参考。
        </div>

        <nav class="nav" aria-label="上一期 / 下一期">
          ${linkCard(older, 'older')}
          ${linkCard(newer, 'newer')}
        </nav>

        <p class="back"><a href="${u('AI动态/')}">← 返回简报目录</a></p>
      </div>
    </div>
  </article>
</main>

<footer class="site-foot">
  <div class="site-foot__in">
    <span>&copy; ${brief.date.getFullYear()} ${AUTHOR.name} · 简报内容整理自公开报道</span>
    <span><a href="${u('')}">${SITE_TITLE}</a> · <a href="${u('AI动态/')}">AI 简报</a></span>
  </div>
</footer>

<script>
(function(){
  var key=document.documentElement.dataset.themeKey||'blog-theme';
  var cur=function(){return document.documentElement.getAttribute('data-theme')==='dark'?'dark':'light';};
  document.querySelectorAll('[data-theme-toggle]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var t=cur()==='dark'?'light':'dark';
      document.documentElement.setAttribute('data-theme',t);
      try{localStorage.setItem(key,t);}catch(e){}
    });
  });
})();
</script>
</body>
</html>
`;
}

// ------------------------------------------------------------------- 主流程

function walkHtml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walkHtml(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

/**
 * 把 docs/AI动态 整棵镜像到 public/AI动态。
 *
 * 这一步**必须无条件执行**，不能只在「重新生成成功」时做：
 * public/ 下的镜像是 gitignore 的，CI 检出的是干净的仓库，指过来时那里什么都没有。
 * 只依赖 docs/ 里已提交的产物重建镜像，链接才不会 404。
 */
function mirror() {
  if (!fs.existsSync(OUT_DIR)) return { copied: 0, pruned: 0 };
  const sources = walkHtml(OUT_DIR);
  const live = new Set();
  let copied = 0;

  for (const src of sources) {
    const rel = path.relative(OUT_DIR, src);
    const target = path.join(MIRROR_DIR, rel);
    live.add(path.resolve(target));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const same =
      fs.existsSync(target) && fs.readFileSync(target).equals(fs.readFileSync(src));
    if (same) continue;
    fs.copyFileSync(src, target);
    copied++;
  }

  // 源里已经没有的镜像文件要清掉（只认脚本自己的命名，不碰手工文件）
  let pruned = 0;
  for (const file of walkHtml(MIRROR_DIR)) {
    if (live.has(path.resolve(file))) continue;
    if (!/[/\\]\d{4}-\d{2}[/\\]\d{4}-\d{2}-\d{2}\.html$/.test(file)) continue;
    fs.unlinkSync(file);
    pruned++;
  }
  return { copied, pruned };
}

function main() {
  const result = generate();
  const mirrorStats = mirror();

  if (!result.regenerated) {
    console.log(
      c.dim(
        `AI 简报：沿用已有产物 ${result.existing} 期（未从源目录重新生成）`
      )
    );
    if (result.skipped.length) {
      for (const s of result.skipped) console.log(c.dim(`  跳过 ${s}`));
    }
  }
  console.log(
    c.dim(
      `  镜像 → public/AI动态：同步 ${mirrorStats.copied} 个文件` +
        (mirrorStats.pruned ? ` · 清理 ${mirrorStats.pruned} 个` : '')
    )
  );
}

function generate() {
  const out = { regenerated: false, existing: 0, skipped: [] };

  if (!fs.existsSync(SRC_DIR)) {
    console.log(c.yellow('AI 简报：源目录不存在，跳过生成'));
    console.log(c.dim(`  ${SRC_DIR}`));
    out.existing = walkHtml(OUT_DIR).length;
    return out;
  }

  const files = fs
    .readdirSync(SRC_DIR)
    .filter((f) => f.toLowerCase().endsWith('.md'))
    .map((f) => path.join(SRC_DIR, f))
    .sort();

  const briefs = [];
  const skipped = [];
  for (const file of files) {
    try {
      const brief = parseBrief(file);
      if (brief) briefs.push(brief);
      else skipped.push(path.basename(file));
    } catch (err) {
      skipped.push(`${path.basename(file)}（${err.message}）`);
    }
  }
  out.skipped = skipped;

  if (!briefs.length) {
    console.log(c.yellow('AI 简报：源目录里没有可解析的日报，保留上一次的产物'));
    out.existing = walkHtml(OUT_DIR).length;
    return out;
  }

  // 新的在前：列表、上一期/下一期都按这个顺序取邻居
  briefs.sort((a, b) => b.date - a.date || (a.stamp < b.stamp ? 1 : -1));

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });

  const written = new Set();
  briefs.forEach((brief, i) => {
    const page = renderPage(brief, briefs[i - 1], briefs[i + 1]);
    const target = path.join(OUT_DIR, brief.key, `${brief.stamp}.html`);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, page, 'utf8');
    written.add(path.resolve(target));
  });

  // 源稿被删掉／改期后，对应的旧页面也要跟着消失（只认脚本自己的命名）
  let pruned = 0;
  for (const file of walkHtml(OUT_DIR)) {
    if (written.has(path.resolve(file))) continue;
    if (!/[/\\]\d{4}-\d{2}[/\\]\d{4}-\d{2}-\d{2}\.html$/.test(file)) continue;
    fs.unlinkSync(file);
    pruned++;
  }

  const monthMap = new Map();
  for (const brief of briefs) {
    if (!monthMap.has(brief.key)) monthMap.set(brief.key, []);
    monthMap.get(brief.key).push(brief);
  }
  const months = [...monthMap.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, items]) => ({
      key,
      label: `${key.slice(0, 4)} 年 ${Number(key.slice(5, 7))} 月`,
      count: items.length,
      items: items.map((brief) => ({
        date: brief.stamp,
        day: brief.stamp.slice(8),
        title: brief.title,
        summary: brief.summary,
        tags: brief.tags,
        url: brief.rel,
        minutes: brief.minutes,
      })),
    }));

  const manifest = {
    generatedAt: new Date().toISOString(),
    total: briefs.length,
    latest: months[0]?.items[0]?.date || '',
    months,
  };
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  out.regenerated = true;
  out.existing = briefs.length;

  console.log(
    `AI 简报：生成 ${briefs.length} 期 ${c.dim(
      `（${months.length} 个月份目录）`
    )}${pruned ? ` · 清理 ${pruned} 个过期页面` : ''}`
  );
  for (const brief of briefs) {
    console.log(
      `  ${c.green('✓')} ${brief.stamp}  ${c.cyan(brief.title)}  ${c.dim(
        `${brief.minutes} 分钟 · ${brief.tags.length} 个标签`
      )}`
    );
  }
  if (skipped.length) {
    console.log(c.yellow(`  跳过 ${skipped.length} 个文件：${skipped.join('、')}`));
  }
  console.log(
    c.dim(
      `  正本 docs/AI动态 · 清单 ${path
        .relative(PROJECT, MANIFEST)
        .replace(/\\/g, '/')}`
    )
  );

  return out;
}

main();
