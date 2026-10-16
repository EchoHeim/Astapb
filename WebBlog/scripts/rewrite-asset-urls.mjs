#!/usr/bin/env node
/**
 * 构建之后，把产物里的站内资源路径改写成 jsDelivr CDN 地址。
 *
 * 为什么需要这一步：
 *   图片真源在 `WebBlog/images/` 与 `WebBlog/sponsor/images/`，它们**不在
 *   public/ 里，因此不进构建产物**。所以页面里统一写站内绝对路径
 *   （如 `/images/posts/linux/x.png`）：
 *     - dev     → 由 astro.config.mjs 的 local-assets 中间件直接读本地文件，
 *                 新图不用 push 就能看到；
 *     - 生产    → 本脚本把 `/images/...` 批量替换成 CDN_ORIGIN，线上走加速。
 *   真源只有一份，两条路共用它，不存在"两份图要同步"的问题。
 *
 * 用法：
 *   node scripts/rewrite-asset-urls.mjs            # 改写 dist/
 *   node scripts/rewrite-asset-urls.mjs --check    # 只体检，不改文件
 *
 * 注意：
 *   - CDN 地址与 BASE_PATH 都从 src/consts.ts 读取，改 CDN 只需改那一处。
 *   - 只匹配紧跟在引号或括号后的站内绝对路径，已经是 http(s) 的不会被二次改写。
 *   - 由 package.json 的 postbuild 自动调用，一般不用手动跑。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(HERE, '..');
const DIST = path.join(PROJECT, 'dist');

const args = process.argv.slice(2);
const CHECK = args.includes('--check');

/** 资源目录前缀；新增图片目录时同步 astro.config.mjs 的 ASSET_PREFIXES */
const ASSET_DIRS = ['images', 'sponsor/images'];

/** 只处理文本类产物，二进制（favicon.ico 等）跳过 */
const TEXT_EXT = new Set([
  '.html',
  '.xml',
  '.json',
  '.css',
  '.js',
  '.mjs',
  '.txt',
  '.svg',
  '.webmanifest',
]);

/** 从 consts.ts 抓唯一真源，避免两处硬编码走偏 */
function readConsts() {
  const src = fs.readFileSync(path.join(PROJECT, 'src', 'consts.ts'), 'utf8');
  const cdn = src.match(
    /export\s+const\s+CDN_ORIGIN\s*=\s*['"]([^'"]+)['"]/
  );
  const base = src.match(/export\s+const\s+BASE_PATH\s*=\s*['"]([^'"]*)['"]/);
  if (!cdn) {
    console.error('✗ 读不到 CDN_ORIGIN：src/consts.ts 里的常量名可能改过了');
    process.exit(1);
  }
  return { cdn: cdn[1].replace(/\/+$/, ''), base: base ? base[1] : '' };
}

const { cdn: CDN, base: BASE } = readConsts();

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const dirs = ASSET_DIRS.map((d) => esc(d)).join('|');
/** 形如 `/images/`、`/base/images/`，且前面必须是引号或括号（排除已带域名的 URL） */
const RE = BASE
  ? new RegExp(`(["'(])${esc('/' + BASE.replace(/^\/|\/$/g, ''))}\\/(${dirs})\\/`, 'g')
  : new RegExp(`(["'(])\\/(${dirs})\\/`, 'g');

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, out);
    else if (TEXT_EXT.has(path.extname(name).toLowerCase())) out.push(full);
  }
  return out;
}

if (!fs.existsSync(DIST)) {
  console.error(`✗ 找不到 ${DIST}：请先跑 npm run build`);
  process.exit(1);
}

const files = walk(DIST);
let changedFiles = 0;
let changedHits = 0;
const sample = [];

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  if (!RE.test(text)) continue;
  RE.lastIndex = 0;
  let hits = 0;
  const out = text.replace(RE, (m, quote, dir) => {
    hits += 1;
    const url = `${CDN}/${dir}/`;
    if (sample.length < 3) sample.push(url + '…');
    return quote + url;
  });
  if (hits === 0) continue;
  changedFiles += 1;
  changedHits += hits;
  if (!CHECK) fs.writeFileSync(file, out);
}

if (changedHits === 0) {
  console.log('· 没有需要改写的站内资源路径');
} else if (CHECK) {
  console.log(
    `· 体检：${changedFiles} 个文件、${changedHits} 处待改写（未修改）`
  );
} else {
  console.log(
    `✓ 已改写：${changedFiles} 个文件、${changedHits} 处 → ${CDN}`
  );
  for (const s of sample) console.log(`    ${s}`);
}
