import { getCollection } from 'astro:content';
import { withBase } from '../utils/url';

/**
 * 搜索索引：构建时生成一份纯 JSON，由浏览器在打开搜索框时按需拉取。
 *
 * 为什么不用框架自带的搜索组件：它要么只索引标题，要么把索引塞进每个页面。
 * 这里一次性生成静态 JSON，代价是首屏零开销、搜索时一次请求。
 *
 * 正文只截取前 BODY_LIMIT 个字符 —— 全量正文会让索引膨胀到几百 KB，
 * 而实际搜索时命中的绝大多数是标题、标签与前段内容。
 */
const BODY_LIMIT = 1200;

function plain(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_>`~|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);

  const index = posts
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((post) => ({
      t: post.data.title,
      u: withBase(`${post.id}/`),
      d: post.data.date.toISOString().slice(0, 10),
      g: post.data.tags,
      s: post.data.summary || '',
      b: plain(post.body || '').slice(0, BODY_LIMIT),
    }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
