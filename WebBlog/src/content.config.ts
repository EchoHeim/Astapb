import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 文章内容源就是本项目的 `docs/` 目录。
 *
 * 注意这里的 `docs/` 是 **Astro 工程内部**的目录，与仓库根曾经存在的同名目录
 * 没有任何关系（那个已随 docsify 一起删除）。
 *
 * 2026-09-18 这一天它被连续挪过两次：仓库根 `docs/blog/` → `WebBlog/blog/`
 * → `WebBlog/docs/`。现在文章与站点代码同处一个工程，不再跨目录引用。
 *
 * 改目录名时**必须同步这几处**，漏一处就会出问题：
 *   - 本文件的 `base`
 *   - scripts/sync-content.mjs 的 BLOG 与其 git 前缀剥离规则
 *   - scripts/migrate-assets.mjs 的 BLOG
 *
 * 这里必须显式排除三类东西：
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
    base: './docs',
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
