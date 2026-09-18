import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 文章内容源指向 ../docs/blog —— 与现有 docsify 站点**共用同一份 Markdown**，
 * 不复制、不搬家，避免两处内容漂移。
 *
 * 因此这里必须显式排除三类东西：
 *   1. 站点维护文件   _sidebar.md / blog_start.md / 各级 README.md
 *   2. 索引页         Catalog/**（是导航页，不是文章）
 *   3. 第三方资料      尚德机构-考研 / 尚德机构-考研-知识库 / 港股打新
 *                      它们不是本站原创内容，且占了 219 MB
 */

/** 单段路径的 slug 规则：小写、去符号、保留汉字 */
function slugSegment(s: string): string {
  return s
    .toLowerCase()
    .replace(/\+\+/g, 'pp') // C++ -> cpp
    .replace(/\+/g, 'p')
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const posts = defineCollection({
  loader: glob({
    base: '../docs/blog',
    pattern: [
      '**/*.md',
      '!**/_sidebar.md',
      '!**/README.md',
      '!blog_start.md',
      '!Catalog/**',
      '!尚德机构-考研/**',
      '!尚德机构-考研-知识库/**',
      '!港股打新/**',
    ],
    /**
     * 自定义 id 生成：默认规则会把 `C_C++` 压成 `c_c`（`+` 被丢弃），
     * 产出的 URL 难看且难以辨认，所以这里显式接管。
     */
    generateId: ({ entry }) =>
      entry
        .replace(/\.md$/i, '')
        .split('/')
        .map(slugSegment)
        .join('/'),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    summary: z.string().optional(),
    /** 设为 true 则不出现在列表、标签页与 RSS 中 */
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
