import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION, BASE_PATH } from '../consts';

export async function GET(context) {
  const all = await getCollection('posts', ({ data }) => !data.draft);
  const sorted = all.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const base = (BASE_PATH || '').replace(/\/+$/, '');

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site ?? 'https://shilong.js.org',
    items: sorted.map((post) => ({
      title: post.data.title,
      description: post.data.summary ?? '',
      pubDate: post.data.date,
      categories: post.data.tags,
      // 详情页挂在 base 之下
      link: `${base}/${post.id}/`,
    })),
    customData: '<language>zh-cn</language>',
  });
}
