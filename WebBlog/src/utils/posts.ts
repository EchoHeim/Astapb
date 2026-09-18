import type { CollectionEntry } from 'astro:content';

/**
 * 文章排序：先按日期倒序，第二关键字按 id 升序。
 *
 * **第二关键字不是可有可无的。** 这批文章里有大量同一天发布的
 * （例如 `Python 数据分析` 那 14 章全部是 2022-06-23），
 * 只按日期排序时，同日期内部会保留集合的原始顺序，而那个顺序
 * 取决于文件系统枚举目录的顺序。
 *
 * 后果是：同一个仓库在不同机器上、甚至只是把内容目录挪个位置，
 * 构建出来的列表顺序就会变 —— 产物不可复现，diff 里也会出现
 * 一堆看不出原因的乱序。加一个与文件系统无关的第二关键字即可根治。
 *
 * 这里刻意用码点比较而不是 localeCompare：
 * 后者的结果依赖运行环境的 ICU 数据，跨 Node 版本可能不一样，
 * 那等于把不确定性从文件系统换到了运行时。
 */
export function sortPosts<T extends Pick<CollectionEntry<'posts'>, 'id' | 'data'>>(
  posts: T[]
): T[] {
  return [...posts].sort((a, b) => {
    const byDate = b.data.date.valueOf() - a.data.date.valueOf();
    if (byDate !== 0) return byDate;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
}

/**
 * 估算阅读时长（分钟）。
 *
 * 中文按字数、英文按词数折半计入（一个英文词的信息量大致相当于
 * 1.5 个汉字），再按每分钟 400 字折算。只用于列表和文章页展示，
 * 不需要精确 —— 但必须**在列表和详情页用同一套算法**，
 * 否则同一篇文章在两个页面上会显示不同的时长。
 */
export function readingMinutes(body = ''): number {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\s+/g, ' ');
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const words = (
    text.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[A-Za-z0-9]+/g) || []
  ).length;
  return Math.max(1, Math.round((cjk + words * 1.5) / 400));
}
