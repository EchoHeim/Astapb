import { TOTAL_SITES } from '../data/categories';
import type { Engine, Site } from '../data/types';
import { fallbackColor, headerIcon, initialOf, searchIcon, siteIcon } from './icons';
import { h, highlight } from './dom';
import { countMatches, filterCategories, type CategoryMatch } from './filter';

/** 外链统一走新窗口，noopener 防止被打开的页面反向操作本页。 */
const LINK_REL = 'noopener noreferrer';

function externalLink(href: string, className: string, ...children: (Node | string)[]): HTMLAnchorElement {
  return h(
    'a',
    { class: className, href, target: '_blank', rel: LINK_REL },
    ...children,
  );
}

/**
 * 站点图标。有真实图标就用图标，没有就用首字母色块。
 *
 * 图片的 alt 留空是刻意的：站点名就在旁边，读屏器再念一遍图标名只是噪音。
 */
function iconNode(site: Site): HTMLElement {
  const url = siteIcon(site.icon);

  if (url) {
    return h('img', { src: url, alt: '', loading: 'lazy', decoding: 'async' });
  }

  const chip = h('span', { class: 'icon-fallback', 'aria-hidden': 'true' }, initialOf(site.name));
  chip.style.background = fallbackColor(site.name);
  return chip;
}

function siteNode(site: Site, keyword: string): HTMLLIElement {
  const label = h('span', { class: 'site-name' });
  label.appendChild(highlight(site.name, keyword));

  return h(
    'li',
    { title: site.name },
    externalLink(site.url, 'site', iconNode(site), label),
  );
}

function categoryNode(match: CategoryMatch, filtering: boolean, keyword: string): HTMLElement {
  const { category, sites } = match;

  const title = h('h2', { id: `cat-${category.id}-title` }, category.name);

  const recUrl = headerIcon(category.recommend.icon);
  const recommend = recUrl
    ? externalLink(
        category.recommend.url,
        'recommend',
        h('img', { src: recUrl, alt: '', decoding: 'async' }),
        h('p', null, category.recommend.name),
      )
    : null;

  const list = h('ul', null);
  const clamped = !filtering && sites.length > category.visible;

  sites.forEach((site, index) => {
    const node = siteNode(site, keyword);
    // 折叠状态下给最后一条可见项打标记，用渐变把它淡出，悬停整块展开
    if (clamped && index === category.visible - 1) node.classList.add('clamp-end');
    list.appendChild(node);
  });

  const wrap = h('div', { class: 'wrap' }, title, recommend, list);

  const section = h(
    'section',
    {
      class: 'item',
      id: `cat-${category.id}`,
      'aria-labelledby': `cat-${category.id}-title`,
    },
    wrap,
  );
  section.style.setProperty('--visible', String(category.visible));

  // 折叠时卡片高度由 --visible 决定，超出部分裁掉；悬停/聚焦到折叠标记时放开裁切
  const clampEnd = list.querySelector('.clamp-end');
  if (clampEnd) {
    clampEnd.addEventListener('mouseenter', () => section.classList.add('change'));
  }
  wrap.addEventListener('mouseleave', () => section.classList.remove('change'));
  wrap.addEventListener('focusout', (event) => {
    if (!wrap.contains(event.relatedTarget as Node | null)) section.classList.remove('change');
  });

  return section;
}

export interface GridHandle {
  /** 重新渲染以反映过滤词；空字符串表示不过滤。 */
  setQuery(query: string): void;
}

/**
 * 分类网格。259 个条目的重建成本可以忽略，所以过滤时直接整体重渲染，
 * 不做 DOM diff —— 换来的是一份没有「状态残留」可能的简单实现。
 */
export function createGrid(
  container: HTMLElement,
  onCount?: (shown: number, total: number, filtering: boolean) => void,
): GridHandle {
  function setQuery(query: string): void {
    const keyword = query.trim();
    const filtering = keyword.length > 0;
    const matches = filterCategories(keyword);

    container.classList.toggle('is-filtering', filtering);

    const batch = document.createDocumentFragment();
    for (const match of matches) {
      batch.appendChild(categoryNode(match, filtering, keyword));
    }

    container.replaceChildren();

    if (matches.length === 0) {
      container.appendChild(
        h('p', { class: 'empty' }, `没有匹配「${keyword}」的站点`),
      );
    } else {
      container.appendChild(batch);
    }

    onCount?.(countMatches(matches), TOTAL_SITES, filtering);
  }

  return { setQuery };
}

/** 搜索引擎那一列。href 随输入框内容更新，因此中键、右键「复制链接」都能正常工作。 */
export function renderEngines(container: HTMLElement, engines: Engine[]): (keyword: string) => void {
  const links: { anchor: HTMLAnchorElement; query: string }[] = [];

  const batch = document.createDocumentFragment();
  for (const engine of engines) {
    const icon = searchIcon(engine.icon);
    const anchor = externalLink(
      engine.query,
      'engine',
      icon ? h('img', { src: icon, alt: '', decoding: 'async' }) : initialOf(engine.name),
    );
    anchor.title = `用${engine.name}搜索`;
    anchor.setAttribute('aria-label', `用${engine.name}搜索`);
    batch.appendChild(h('li', null, anchor));
    links.push({ anchor, query: engine.query });
  }

  container.replaceChildren(batch);

  return (keyword: string) => {
    for (const { anchor, query } of links) {
      anchor.href = keyword ? query + encodeURIComponent(keyword) : query;
    }
  };
}
