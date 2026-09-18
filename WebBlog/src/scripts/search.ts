/**
 * 前端搜索：取静态索引 + 本地打分。
 *
 * 弹窗（SearchDialog）与独立搜索页（/search/）共用这一份实现，
 * 免得两处逻辑各写一遍、行为随后漂移。
 */

export type SearchDoc = {
  t: string; // 标题
  u: string; // 链接
  d: string; // 日期
  g: string[]; // 标签
  s: string; // 摘要
  b: string; // 正文片段，仅参与匹配不展示
};

export type SearchHit = { doc: SearchDoc; score: number };

export function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!
  );
}

export function highlight(text: string, terms: string[]): string {
  let out = escapeHtml(text);
  for (const t of terms) {
    if (!t) continue;
    const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    out = out.replace(re, '<mark>$1</mark>');
  }
  return out;
}

/** 打分：标题命中权重最高，其次标签、摘要，正文最低 */
export function scoreDocs(docs: SearchDoc[], query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = Array.from(new Set([q, ...q.split(/[\s,，、/]+/).filter(Boolean)]));
  const hits: SearchHit[] = [];

  for (const doc of docs) {
    const title = doc.t.toLowerCase();
    const tags = doc.g.join(' ').toLowerCase();
    const summary = doc.s.toLowerCase();
    const body = doc.b.toLowerCase();

    let score = 0;
    for (const t of terms) {
      if (title.includes(t)) score += title === t ? 12 : 8;
      if (tags.includes(t)) score += 5;
      if (summary.includes(t)) score += 3;
      if (body.includes(t)) score += 1;
    }
    if (score > 0) hits.push({ doc, score });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 40);
}

export function renderHits(
  listEl: HTMLElement,
  hits: SearchHit[],
  query: string,
  activeIndex: number
): void {
  const terms = query.trim() ? [query.trim()] : [];
  if (!hits.length) {
    listEl.innerHTML = `<li class="search-empty">${
      query.trim() ? '没有找到匹配的文章' : '输入关键词开始搜索'
    }</li>`;
    return;
  }
  listEl.innerHTML = hits
    .map(
      ({ doc }, i) => `
      <li role="option" aria-selected="${i === activeIndex}">
        <a href="${doc.u}" data-index="${i}"${i === activeIndex ? ' data-active="true"' : ''}>
          <div class="r-title">${highlight(doc.t, terms)}</div>
          <div class="r-meta">${doc.d}${doc.g.length ? ' · ' + escapeHtml(doc.g.join(' / ')) : ''}</div>
          ${doc.s ? `<div class="r-summary">${highlight(doc.s, terms)}</div>` : ''}
        </a>
      </li>`
    )
    .join('');
}

export function indexUrl(): string {
  const base = import.meta.env.BASE_URL || '/';
  return base.replace(/\/?$/, '/') + 'search-index.json';
}

export function loadIndex(): Promise<SearchDoc[]> {
  return fetch(indexUrl())
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => []);
}
