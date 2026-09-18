import { CATEGORIES } from '../data/categories';
import { h } from './dom';

export interface AnchorsHandle {
  /** 网格重渲染后调用：同步存在性并重新绑定滚动高亮。 */
  refresh(): void;
}

/**
 * 左侧固定面板里的分类锚点。
 *
 * 用真实的 `#cat-xxx` 链接而不是按钮，这样地址栏会带上锚点、可以直接分享，
 * 中键与新窗口打开也都成立。
 */
export function createAnchors(container: HTMLElement): AnchorsHandle {
  const links = new Map<string, HTMLAnchorElement>();

  const batch = document.createDocumentFragment();
  for (const category of CATEGORIES) {
    const anchor = h('a', { class: 'anchor', href: `#cat-${category.id}` }, category.name);
    links.set(category.id, anchor);
    batch.appendChild(anchor);
  }
  container.replaceChildren(batch);

  let activeIds: string[] = [];
  let activeKey = '';

  /**
   * 标记当前行。
   *
   * 卡片是多列换行排布的，一行里通常有 2～4 个分类。这种情况下"当前分类"本就是
   * 个伪概念 —— 只高亮一个的话，点「游戏」却会亮起同一行左侧的「网络」，看着像 bug。
   * 所以整行一起标记：`aria-current` 只落在行首（保持语义单值），
   * 视觉上整行用同一个强调色。
   */
  function setActive(ids: string[]): void {
    const key = ids.join(',');
    if (key === activeKey) return;
    activeKey = key;
    activeIds = ids;

    let first = true;
    for (const [id, anchor] of links) {
      const inRow = activeIds.includes(id);
      anchor.classList.toggle('is-current', inRow);
      if (inRow && first) {
        anchor.setAttribute('aria-current', 'true');
        first = false;
      } else {
        anchor.removeAttribute('aria-current');
      }
    }
  }

  function sections(): HTMLElement[] {
    return [...document.querySelectorAll<HTMLElement>('.item[id^="cat-"]')];
  }

  function sync(): void {
    const present = new Set(sections().map((section) => section.id.slice(4)));
    for (const [id, anchor] of links) {
      // 过滤后消失的分类，锚点一并藏掉，避免点了没反应
      anchor.hidden = !present.has(id);
    }
    if (activeIds.some((id) => !present.has(id))) setActive([]);
  }

  let frame = 0;

  function update(): void {
    frame = 0;
    const items = sections();
    if (items.length === 0) {
      setActive([]);
      return;
    }

    const line = window.innerHeight * 0.25;

    // 当前行 = 第一条尚未滚过该线的卡片所在的整行。
    // 不能只看 top：同一行内所有卡片的 top 完全相同。
    const startIndex = items.findIndex((item) => item.getBoundingClientRect().bottom > line);
    const start = startIndex === -1 ? items.length - 1 : startIndex;
    const rowTop = items[start]!.getBoundingClientRect().top;

    const row: string[] = [];
    for (let i = start; i < items.length; i++) {
      // 同一 flex 行的卡片 top 一致，差一点点就算换行了
      if (i > start && Math.abs(items[i]!.getBoundingClientRect().top - rowTop) > 1) break;
      row.push(items[i]!.id.slice(4));
    }

    setActive(row);
  }

  function onScroll(): void {
    if (frame) return;
    frame = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  return {
    refresh(): void {
      sync();
      update();
    },
  };
}
