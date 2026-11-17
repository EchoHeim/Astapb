import { TOTAL_SITES } from '../data/categories';
import type { Category, Engine, Site } from '../data/types';
import { fallbackColor, headerIcon, initialOf, searchIcon, siteIcon } from './icons';
import { h, highlight } from './dom';
import { countMatches, filterCategories, tokenize, type CategoryMatch } from './filter';

/** 外链统一走新窗口，noopener 防止被打开的页面反向操作本页。 */
const LINK_REL = 'noopener noreferrer';

/**
 * 第一列装到第几条为止，第 `COLUMN_SPLIT + 1` 条起进第二列。
 *
 * 15 条以内不拆列（一列就够）。拆开之后两列**各自**按 `visible` 折叠：
 * 第一列的是第 1–15 条、默认只露前 8 条，第 9–15 条悬停才展开；
 * 第二列从第 16 条起、同样默认露 8 条，第 24 条起收起（悬停展开）。
 * 两列高度因此完全相等 —— 折叠是裁切，不是把内容砍掉。
 */
const COLUMN_SPLIT = 15;

function externalLink(href: string, className: string, ...children: (Node | string)[]): HTMLAnchorElement {
  return h(
    'a',
    { class: className, href, target: '_blank', rel: LINK_REL },
    ...children,
  );
}

/**
 * 头部主链接：大圆图标 + 名称，整块是一个外链。
 * 分类的「推荐位」与续列的「第 16 条」共用这一种结构，所以两列头部天然等高 ——
 * 头部高度是 `.item` 高度公式里那个 `--item-head-h`，多一行少一行都会让列表错位。
 */
function featuredLink(href: string, icon: HTMLElement, name: string): HTMLAnchorElement {
  return externalLink(href, 'recommend', icon, h('p', null, name));
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

function siteNode(site: Site, needles: string[]): HTMLLIElement {
  const label = h('span', { class: 'site-name' });
  label.appendChild(highlight(site.name, needles));

  return h(
    'li',
    { title: site.name },
    externalLink(site.url, 'site', iconNode(site), label),
  );
}

/**
 * 一个分类渲染成 1～2 个**等宽列**，列宽始终是 --col-w，不会因为条目多就把
 * 卡片拉宽。
 *
 * 超过 COLUMN_SPLIT 条时并排出两列：第一列是标题 + 推荐位 + 第 1–15 条，
 * 第二列顶部留出与标题区同高的空白、从第 16 条接着排。
 *
 * 两列被一个 `.item-pair`（`grid-column: span 2`）包着，只为了**保证它们并排**：
 * 若让两列各自当网格项，主列一旦落在行尾，续列就会被挤到下一行，两列错开一整行。
 * 包裹层本身没有背景、没有内边距，视觉上仍是两张独立的卡片、中间一道正常的网格缝。
 *
 * 判定用**分类自身的总条数**而不是过滤后的条数：布局不能随搜索框里敲字而跳动。
 * 过滤态一律不拆：搜索结果是「看命中项」，拆开反而让每列只剩两三条。
 */
function categoryColumns(
  match: CategoryMatch,
  filtering: boolean,
  needles: string[],
): HTMLElement[] {
  const { category, sites } = match;
  const split = !filtering && category.sites.length > COLUMN_SPLIT;

  if (!split) return [columnNode(category, sites, needles, 0, filtering)];

  const first = columnNode(category, sites.slice(0, COLUMN_SPLIT), needles, 0, filtering);
  const rest = columnNode(category, sites.slice(COLUMN_SPLIT), needles, 1, filtering);

  return [h('div', { class: 'item-pair' }, first, rest)];
}

/**
 * 单个格子。`index > 0` 表示这是同一分类的续列：头部结构与主列一致
 * （同样的 `h2` 与 `.recommend`），只是主链接换成**自己这一列的第 1 条**
 * （也就是分类的第 16 条），而不是沿用分类的推荐位 —— 同一分类推荐两次没意义。
 * 第 16 条被提到头部当主链接，就不再在列表里重复出现，列表从第 17 条起。
 */
function columnNode(
  category: Category,
  items: Site[],
  needles: string[],
  index: number,
  filtering: boolean,
): HTMLElement {
  const continuation = index > 0;
  const feature = continuation ? items[0] : undefined;
  const rows = feature ? items.slice(1) : items;
  // 折叠容量是**每列** visible 条，两列各自算：主列 15 条里露 8 条、悬停才展开
  // 第 9–15 条；续列露 8 条（第 17–24 条），第 25 条起收起。
  const clamped = !filtering && rows.length > category.visible;
  const hidden = rows.length - category.visible;

  const list = h('ul', null);

  rows.forEach((site, i) => {
    const node = siteNode(site, needles);
    // 折叠态给这一格最后一条可见项打标记：渐变淡出 + 悬停展开
    if (clamped && i === category.visible - 1) node.classList.add('clamp-end');
    list.appendChild(node);
  });

  const wrap = h('div', { class: 'wrap' });

  if (continuation) {
    wrap.appendChild(h('h2', null, category.name));
    if (feature) wrap.appendChild(featuredLink(feature.url, iconNode(feature), feature.name));
  } else {
    wrap.appendChild(h('h2', { id: `cat-${category.id}-title` }, category.name));

    const recUrl = headerIcon(category.recommend.icon);
    if (recUrl) {
      wrap.appendChild(
        featuredLink(
          category.recommend.url,
          h('img', { src: recUrl, alt: '', decoding: 'async' }),
          category.recommend.name,
        ),
      );
    }
  }

  wrap.appendChild(list);

  // 「还有 N 条」徽标。旧版只靠一层渐变暗示下面还有内容：既看不出还剩几条，
  // 键盘和触屏也没有任何途径展开。徽标本身做成按钮，点开点关，Tab 也能到。
  //
  // 注意它挂在 section 上而不是 wrap 里：展开时 `.wrap` 会变成定位元素
  // （z-index 需要），徽标若在里面就会跟着跑到展开列表的末尾、掉出视口。
  const more = clamped
    ? h('button', { class: 'more', type: 'button', 'aria-expanded': 'false' }, `还有 ${hidden} 条`)
    : null;

  const section = h(
    'section',
    {
      class: continuation ? 'item item-cont' : 'item',
      // 续列刻意不用 `cat-` 前缀：lib/anchors.ts 是拿 `.item[id^="cat-"]` 认分类的，
      // 叫 `cat-xxx-cont` 会被它当成第 24 个分类，混进滚动高亮的整行判断里。
      id: continuation ? `cont-${category.id}` : `cat-${category.id}`,
      'aria-labelledby': continuation ? null : `cat-${category.id}-title`,
      'aria-label': continuation ? `${category.name}（续）` : null,
    },
    wrap,
    more,
  );
  section.style.setProperty('--visible', String(category.visible));

  // 折叠时高度由 --visible 决定，超出部分裁掉。三种展开途径：
  // 悬停到折叠标记（老路径）、点「还有 N 条」、键盘 Tab 到按钮后回车。
  // 被裁掉的条目在折叠态打 `inert`：既进不了 Tab 序，也不会被读屏器念出来 ——
  // 旧版这些链接还在 tab 序里，键盘用户会一路 Tab 进看不见的区域，页面跟着乱跳。
  const overflow = clamped
    ? ([...list.children].slice(category.visible) as HTMLElement[])
    : [];

  const apply = (open: boolean): void => {
    section.classList.toggle('change', open);
    for (const li of overflow) li.toggleAttribute('inert', !open);

    if (more) {
      more.textContent = open ? '收起' : `还有 ${hidden} 条`;
      more.setAttribute('aria-expanded', String(open));
    }
  };

  overflow.forEach((li) => li.toggleAttribute('inert', true));

  for (const end of list.querySelectorAll('.clamp-end')) {
    end.addEventListener('mouseenter', () => apply(true));
  }

  more?.addEventListener('click', () => {
    const open = !section.classList.contains('change');
    // pinned：点开的卡片不随鼠标移开而收起，否则键盘用户刚展开就被收回去
    if (open) section.dataset.pinned = '1';
    else delete section.dataset.pinned;
    apply(open);
  });

  wrap.addEventListener('mouseleave', () => {
    if (!section.dataset.pinned) apply(false);
  });
  wrap.addEventListener('focusout', (event) => {
    if (section.dataset.pinned) return;
    if (!wrap.contains(event.relatedTarget as Node | null)) apply(false);
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
    const needles = tokenize(keyword);
    const matches = filterCategories(keyword);

    container.classList.toggle('is-filtering', filtering);

    const batch = document.createDocumentFragment();
    for (const match of matches) {
      batch.append(...categoryColumns(match, filtering, needles));
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
