type Child = Node | string | null | undefined | false;

type Props = Record<string, string | number | boolean | EventListener | null | undefined>;

function appendAll(parent: Node, children: Child[]): void {
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    parent.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
}

/**
 * 极简建 DOM 助手。
 * 刻意不支持 innerHTML —— 站点名和数据都从这里过，避免任何注入面。
 */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: Props | null,
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);

  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value === null || value === undefined || value === false) continue;

      if (key.startsWith('on') && typeof value === 'function') {
        node.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
      } else if (key === 'text') {
        node.textContent = String(value);
      } else {
        node.setAttribute(key, value === true ? '' : String(value));
      }
    }
  }

  appendAll(node, children);
  return node;
}

/** 取一个已存在的挂载点，缺失时直接抛错而不是留下半个页面。 */
export function mount(selector: string): HTMLElement {
  const node = document.querySelector<HTMLElement>(selector);
  if (!node) throw new Error(`挂载点不存在：${selector}`);
  return node;
}

/**
 * 把文本按关键词切成分片，命中的片段包在 <mark> 里。
 *
 * 关键词是**多个词**（与过滤同一套切法）：每个词各自找全部命中位置，
 * 排序后合并重叠区间再一次性切分。旧版把整串当成一个 needle，
 * 于是「知识 图」这种多词查询能筛出结果却零高亮。
 * 全程用文本节点拼装，关键词里含 HTML 特殊字符也不会出问题。
 */
export function highlight(text: string, needles: string[]): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const haystack = text.toLowerCase();
  const ranges: [number, number][] = [];

  for (const needle of needles) {
    const word = needle.trim().toLowerCase();
    if (!word) continue;

    let cursor = 0;
    for (;;) {
      const at = haystack.indexOf(word, cursor);
      if (at === -1) break;
      ranges.push([at, at + word.length]);
      cursor = at + word.length;
    }
  }

  if (ranges.length === 0) {
    fragment.appendChild(document.createTextNode(text));
    return fragment;
  }

  // 相邻或重叠的区间合并，避免嵌套 <mark>
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const [start, end] of ranges) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }

  let cursor = 0;
  for (const [start, end] of merged) {
    if (start > cursor) fragment.appendChild(document.createTextNode(text.slice(cursor, start)));
    const mark = document.createElement('mark');
    mark.textContent = text.slice(start, end);
    fragment.appendChild(mark);
    cursor = end;
  }

  if (cursor < text.length) fragment.appendChild(document.createTextNode(text.slice(cursor)));
  return fragment;
}

/** 取出用于展示与匹配的站点主机名，去掉 www. 前缀。 */
export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * 以新窗口打开一个地址。
 *
 * 用临时 `<a>` 而不是 `window.open(url, '_blank', ...)`：后者只要带了 features
 * 参数就可能被浏览器当成弹窗拦截，语义也和页面里的普通链接不一致。
 */
export function openExternal(url: string): void {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.click();
}
