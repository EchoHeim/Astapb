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
 * 全程用文本节点拼装，关键词里含 HTML 特殊字符也不会出问题。
 */
export function highlight(text: string, keyword: string): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const needle = keyword.trim().toLowerCase();

  if (!needle) {
    fragment.appendChild(document.createTextNode(text));
    return fragment;
  }

  const haystack = text.toLowerCase();
  let cursor = 0;

  for (;;) {
    const at = haystack.indexOf(needle, cursor);
    if (at === -1) break;
    if (at > cursor) fragment.appendChild(document.createTextNode(text.slice(cursor, at)));
    const mark = document.createElement('mark');
    mark.textContent = text.slice(at, at + needle.length);
    fragment.appendChild(mark);
    cursor = at + needle.length;
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
