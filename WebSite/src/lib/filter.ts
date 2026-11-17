import { CATEGORIES } from '../data/categories';
import type { Category, Site } from '../data/types';
import { hostOf } from './dom';

export interface CategoryMatch {
  category: Category;
  /** 命中后要展示的条目；分类名本身命中时为该分类全部条目 */
  sites: Site[];
}

/**
 * 把查询串切成词。站内过滤与高亮共用同一个切法 ——
 * 两边规则一旦分叉，就会出现「筛出了结果却一个关键词都没高亮」的怪现象
 * （2026-09-21 评审记录的 P1，根因就是 filter 按词切、highlight 却把整串当一个 needle）。
 */
export function tokenize(query: string): string[] {
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function haystack(...parts: (string | string[] | undefined)[]): string {
  return parts
    .flatMap((part) => (Array.isArray(part) ? part : [part ?? '']))
    .join('\n')
    .toLowerCase();
}

/**
 * 站内过滤。
 *
 * 匹配三层，全部按「与」组合：
 *   1. 分类名 + 分类别名（`aliases`）—— 全部命中时整格放出来；
 *   2. 站点显示名；
 *   3. 主机名与站点的 `tags`（英文名、常用叫法、类别词）。
 *
 * 第 1 层是「我要找电子书 → 把书籍整格给我」，第 2、3 层是「我知道个大概」。
 * 每个站点的干草堆里也叠了分类名与别名，所以「设计 字体」能收窄到设计分类里
 * 带字体标签的那几条，而不是像旧版那样直接零命中。
 */
export function filterCategories(query: string): CategoryMatch[] {
  const needles = tokenize(query);

  if (needles.length === 0) {
    return CATEGORIES.map((category) => ({ category, sites: category.sites }));
  }

  const result: CategoryMatch[] = [];

  for (const category of CATEGORIES) {
    const categoryHaystack = haystack(category.name, category.aliases);

    // 单字词命中分类名/别名 → 整格放出来（「电子书」→ 书籍）。多字词不要走这条路：
    // 「设计 字体」两个词都在分类的干草堆里，整格放出来会丢掉「收窄」的语义。
    if (needles.length === 1 && categoryHaystack.includes(needles[0]!)) {
      result.push({ category, sites: category.sites });
      continue;
    }

    const sites = category.sites.filter((site) =>
      // 这里只叠分类**名**，不叠别名：别名是给「整格命中」用的，
      // 混进来会让「设计 字体」里的「字体」把 28 条设计站全命中，收窄就失效了。
      needles.every((needle) =>
        haystack(category.name, site.name, hostOf(site.url), site.tags).includes(needle),
      ),
    );

    if (sites.length > 0) result.push({ category, sites });
  }

  return result;
}

/** 命中总数，用于搜索框下方的计数提示。 */
export function countMatches(matches: CategoryMatch[]): number {
  return matches.reduce((n, m) => n + m.sites.length, 0);
}
