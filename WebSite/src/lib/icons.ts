/**
 * 图标清单。
 *
 * Vite 在**构建期**扫描磁盘，把每个 PNG 变成一个带哈希的 URL 并写进这张表。
 * 因此「数据里写了键名，磁盘上没有对应文件」这件事在构建阶段就暴露了，
 * 不会再像旧实现那样静默渲染一个 404 空白。
 *
 * 键名 = 文件名去掉扩展名，保留原始大小写（`MagoTV`、`JD`、`Khan` 都按原样）。
 * 三个来源分表存放，因为同一份文件名在 header/ 与 icon/ 下含义不同
 * （例如 `Pinterest.png` 是分类推荐位，`pinterest.png` 是站点图标）。
 */

const siteModules = import.meta.glob('/icon/**/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const headerModules = import.meta.glob('/header/**/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const searchModules = import.meta.glob('/search/**/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

/** `/icon/code/github.png` → `github` */
function toKey(path: string): string {
  const file = path.slice(path.lastIndexOf('/') + 1);
  const dot = file.lastIndexOf('.');
  return dot === -1 ? file : file.slice(0, dot);
}

function index(mods: Record<string, string>): Map<string, string> {
  const map = new Map<string, string>();
  for (const [path, url] of Object.entries(mods)) {
    // 同键冲突时保留先出现的，并在构建期由 scripts/verify-icons.mjs 报出来。
    if (!map.has(toKey(path))) map.set(toKey(path), url);
  }
  return map;
}

const SITE_ICONS = index(siteModules);
const HEADER_ICONS = index(headerModules);
const SEARCH_ICONS = index(searchModules);

/** 取站点图标；键不存在或数据没写图标时返回 undefined，交由首字母色块兜底。 */
export function siteIcon(key: string | undefined): string | undefined {
  return key ? SITE_ICONS.get(key) : undefined;
}

/** 取分类推荐位图标；这是占位内容，缺失时应当由构建期拦截。 */
export function headerIcon(key: string): string | undefined {
  return HEADER_ICONS.get(key);
}

/** 取搜索引擎图标。 */
export function searchIcon(key: string): string | undefined {
  return SEARCH_ICONS.get(key);
}

/** 全部已登记的站点图标键，仅供调试用。 */
export function siteIconKeys(): string[] {
  return [...SITE_ICONS.keys()].sort();
}

/**
 * 首字母色块的配色。
 * 都是在深色底与浅色底上都能和白色文字拉开对比的中低亮度色。
 */
const FALLBACK_COLORS = [
  '#4a6fa5',
  '#2f8f6b',
  '#a05a7a',
  '#8a6a3f',
  '#5f6ba8',
  '#8f5a4a',
  '#4a8a94',
  '#7a5a9e',
];

/** 由站点名稳定地推导出一个配色，保证同名站点每次刷新颜色一致。 */
export function fallbackColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length]!;
}

/** 取用于色块的首字符，正确处理代理对（emoji 等）与空白。 */
export function initialOf(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  return [...trimmed][0]!.toUpperCase();
}
