import { CATEGORIES } from '../data/categories';
import type { Category, Site } from '../data/types';
import { hostOf } from './dom';

export interface CategoryMatch {
  category: Category;
  /** 命中后要展示的条目；分类名本身命中时为该分类全部条目 */
  sites: Site[];
}

function tokens(query: string): string[] {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function matchesAll(haystack: string, needles: string[]): boolean {
  return needles.every((needle) => haystack.includes(needle));
}

/**
 * 站内过滤。
 *
 * 匹配站点的显示名与主机名（`zhihu.com` 这种也搜得到），多个关键词按「与」组合，
 * 所以「知识 图」能收窄到同时沾这两个词的条目。
 * 分类名整体命中时，把该分类下所有站点都放出来。
 */
export function filterCategories(query: string): CategoryMatch[] {
  const needles = tokens(query);

  if (needles.length === 0) {
    return CATEGORIES.map((category) => ({ category, sites: category.sites }));
  }

  const result: CategoryMatch[] = [];

  for (const category of CATEGORIES) {
    const categoryHaystack = category.name.toLowerCase();

    if (matchesAll(categoryHaystack, needles)) {
      result.push({ category, sites: category.sites });
      continue;
    }

    const sites = category.sites.filter((site) => {
      const haystack = `${site.name}\n${hostOf(site.url)}`.toLowerCase();
      return matchesAll(haystack, needles);
    });

    if (sites.length > 0) result.push({ category, sites });
  }

  return result;
}

/** 命中总数，用于搜索框下方的计数提示。 */
export function countMatches(matches: CategoryMatch[]): number {
  return matches.reduce((n, m) => n + m.sites.length, 0);
}
