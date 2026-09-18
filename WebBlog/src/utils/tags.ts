/**
 * 标签 slug 工具。
 *
 * 为什么不能直接用标签名当 URL 段：`C/C++` 里带斜杠，
 * 直接当路径段会被当成目录分隔符，产出一个错误的三层目录。
 * 所以这里对少数含特殊符号的标签做手工映射，其余走通用规则。
 */
const MANUAL: Record<string, string> = {
  'C/C++': 'cpp',
  'C 语言技巧': 'c-language',
  'C++ 学习笔记': 'cpp-notes',
};

export function tagSlug(tag: string): string {
  if (MANUAL[tag]) return MANUAL[tag];
  return tag
    .trim()
    .toLowerCase()
    // `+` 不是 URL 友好字符；C++ 这类标签靠它兜底变成 cpp
    .replace(/\+\+/g, 'pp')
    .replace(/\+/g, 'p')
    .replace(/\s+/g, '-')
    // 只保留字母数字、下划线、连字符与中日韩汉字
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export interface TagInfo {
  /** 原始标签名 */
  name: string;
  /** URL 段 */
  slug: string;
  /** 文章数 */
  count: number;
}

/**
 * 由文章列表汇总标签，按文章数倒序、同数量按名称排序。
 * 一级分类用饱和色，细分标签用浅色，靠 count 大小自然分层。
 */
export function buildTagIndex(
  posts: { data: { tags: string[] } }[]
): TagInfo[] {
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.data.tags) {
      map.set(t, (map.get(t) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, slug: tagSlug(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh'));
}

export interface CatChild {
  name: string;
  slug: string;
  count: number;
}

export interface CatNode extends TagInfo {
  children: CatChild[];
}

/**
 * 由文章列表汇总成「一级分类 → 细分标签」的两层树。
 *
 * 依据是 frontmatter 的约定：tags 数组**第一项是栏目，其余是话题**
 * （见 sync-content.mjs 的 TAG_RULES）。所以这里先按第一项分桶，
 * 再把该项之后的标签挂到各自的分类下。
 *
 * 同一个细分标签理论上可以出现在多个分类下，因此按分类各自计数，
 * 不做全局去重 —— 侧栏的树要反映的是「这个栏目下面有什么」。
 */
export function buildCategoryTree(
  posts: { data: { tags: string[] } }[]
): CatNode[] {
  const map = new Map<string, { count: number; children: Map<string, number> }>();

  for (const p of posts) {
    const [cat, ...subs] = p.data.tags;
    if (!cat) continue;
    let node = map.get(cat);
    if (!node) {
      node = { count: 0, children: new Map() };
      map.set(cat, node);
    }
    node.count += 1;
    for (const s of subs) node.children.set(s, (node.children.get(s) ?? 0) + 1);
  }

  return [...map.entries()]
    .map(([name, v]) => ({
      name,
      slug: tagSlug(name),
      count: v.count,
      children: [...v.children.entries()]
        .map(([n, count]) => ({ name: n, slug: tagSlug(n), count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh')),
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh'));
}
