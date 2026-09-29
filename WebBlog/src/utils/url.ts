/** 把站内路径拼上 base（本博客发布在 /posts/ 下） */
export function withBase(p = '') {
  const base = import.meta.env.BASE_URL || '/';
  const b = base.endsWith('/') ? base : base + '/';
  return b + String(p).replace(/^\/+/, '');
}

/** 站内绝对 URL（用于 canonical / RSS / sitemap） */
export function absoluteUrl(p = '') {
  const origin = import.meta.env.SITE || 'https://shilong.js.org';
  return new URL(withBase(p), origin).href;
}

/** 把 ISO 日期格式化为 YYYY-MM-DD */
export function formatDate(d) {
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return '';
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${dt.getFullYear()}-${m}-${day}`;
}

/** 中文日期：2023 年 7 月 14 日（文章页页眉用，比数字串更像刊物） */
export function formatDateZh(d) {
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return '';
  return `${dt.getFullYear()} 年 ${dt.getMonth() + 1} 月 ${dt.getDate()} 日`;
}

/** 归档列表用的短日期：MM / DD */
export function formatMonthDay(d) {
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return '';
  return `${String(dt.getMonth() + 1).padStart(2, '0')} / ${String(
    dt.getDate()
  ).padStart(2, '0')}`;
}
