#!/usr/bin/env node
/**
 * 把 docs/ 里被文章引用的图片与附件，按原目录结构镜像到独立资源仓库目录，
 * 供推送后由 jsDelivr 提供加速分发。
 *
 * 用法：
 *   node scripts/migrate-assets.mjs                 # 预演，只打印计划
 *   node scripts/migrate-assets.mjs --yes           # 真正拷贝
 *   node scripts/migrate-assets.mjs --yes --target=../Astapb-assets
 *
 * 设计取舍：
 *   - 只搬「被文章引用到的」资源，不整目录搬 —— docs/ 里 219 MB 的
 *     第三方 PDF 不属于本站原创内容，不该出现在资源仓库里。
 *   - 不修改任何 Markdown 源文件。路径改写发生在渲染期（见
 *     src/plugins/rehype-assets.mjs），这样旧 docsify 站点仍然能正常显示图片。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(HERE, '..');
const REPO = path.resolve(PROJECT, '..');
const DOCS = path.join(REPO, 'docs');
const BLOG = path.join(DOCS, 'blog');

const args = process.argv.slice(2);
const APPLY = args.includes('--yes');
const targetArg = args.find((a) => a.startsWith('--target='));
const TARGET = path.resolve(
  REPO,
  targetArg ? targetArg.split('=')[1] : '../Astapb-assets'
);

/** 需要扫描的 Markdown 源（与 content.config.ts 的排除规则保持一致） */
const EXCLUDE_DIRS = ['尚德机构-考研', '尚德机构-考研-知识库', '港股打新', 'Catalog'];

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (EXCLUDE_DIRS.includes(name)) continue;
      walk(full, out);
    } else if (name.endsWith('.md') && name !== '_sidebar.md') {
      out.push(full);
    }
  }
  return out;
}

const IMG_RE = /!?\[[^\]]*\]\(\s*([^)\s]+)/g;
const HTML_SRC_RE = /<(?:img|source|video|audio)[^>]*\ssrc=["']([^"']+)["']/gi;
const SKIP = /^(https?:|\/\/|\/|#|mailto:|tel:|data:)/i;

const referenced = new Map(); // 绝对源路径 -> 引用它的 md

for (const md of walk(BLOG)) {
  const text = fs.readFileSync(md, 'utf8');
  for (const re of [IMG_RE, HTML_SRC_RE]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text))) {
      let p = m[1].split('#')[0].split('?')[0];
      if (!p || SKIP.test(p)) continue;
      try {
        p = decodeURIComponent(p);
      } catch {
        /* 保持原样 */
      }
      const abs = path.resolve(path.dirname(md), p);
      if (!abs.startsWith(DOCS)) continue;
      if (!fs.existsSync(abs)) continue;
      if (!referenced.has(abs)) referenced.set(abs, md);
    }
  }
}

// 站点级固定资源（favicon / 封面 / 二维码等），旧站点与新站点都要用
const STATIC = [
  'images',
  'sponsor/images',
];
for (const rel of STATIC) {
  const dir = path.join(DOCS, rel);
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    if (fs.statSync(abs).isFile() && !referenced.has(abs)) {
      referenced.set(abs, '(站点固定资源)');
    }
  }
}

let bytes = 0;
const plan = [];
for (const [abs, md] of referenced) {
  const rel = path.relative(DOCS, abs).split(path.sep).join('/');
  const size = fs.statSync(abs).size;
  bytes += size;
  plan.push({ rel, size, md: path.relative(REPO, md) });
}
plan.sort((a, b) => b.size - a.size);

console.log(`资源仓库目标目录: ${TARGET}`);
console.log(`命中 ${plan.length} 个被引用资源，合计 ${(bytes / 1024 / 1024).toFixed(2)} MB\n`);
for (const p of plan.slice(0, 25)) {
  console.log(`  ${(p.size / 1024).toFixed(0).padStart(7)} KB  ${p.rel}`);
}
if (plan.length > 25) console.log(`  ... 其余 ${plan.length - 25} 个`);

if (!APPLY) {
  console.log('\n这是预演。确认无误后加 --yes 真正拷贝。');
  process.exit(0);
}

let copied = 0;
for (const p of plan) {
  const src = path.join(DOCS, p.rel.split('/').join(path.sep));
  const dst = path.join(TARGET, p.rel.split('/').join(path.sep));
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
  copied++;
}

fs.writeFileSync(
  path.join(TARGET, 'README.md'),
  [
    '# Astapb-assets',
    '',
    '本仓库是 [Astapb](https://github.com/EchoHeim/Astapb) 博客的**资源仓库**，',
    '由 `WebBlog/scripts/migrate-assets.mjs` 生成，请勿手工编辑。',
    '',
    '目录结构与主仓库 `docs/` 保持一致，经 jsDelivr 提供加速：',
    '',
    '```',
    'https://cdn.jsdelivr.net/gh/EchoHeim/Astapb-assets@main/<相对 docs 的路径>',
    '```',
    '',
    '之所以拆成独立仓库：主仓库的 jsDelivr 包体积已远超 50 MB 的加速上限，',
    '继续把资源留在里面会让整个包都拿不到加速。',
    '',
  ].join('\n'),
  'utf8'
);

console.log(`\n完成：拷贝 ${copied} 个文件到 ${TARGET}`);
console.log('\n接下来：');
console.log('  1. cd ' + TARGET);
console.log('  2. git init && git add . && git commit -m "init assets"');
console.log('  3. gh repo create Astapb-assets --public --source=. --push   # 或手工建仓后 push');
console.log('  4. 确认 src/consts.ts 里的 ASSETS_BASE 指向该仓库');
