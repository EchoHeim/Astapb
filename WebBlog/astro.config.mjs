// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL, BASE_PATH } from './src/consts.ts';

/**
 * 关于几件事的说明，避免以后回来看不懂：
 *
 * 1. base 现在为空 —— 博客接管根路径，取代原 docsify 站点。
 *    改动只需调整 src/consts.ts 的 BASE_PATH，这里跟着走。
 *
 * 2. 为什么没有用 rehype 插件在渲染期改写图片路径
 *    Astro 7 起 `markdown.rehypePlugins` 已废弃且不再生效，新写法要求用
 *    @astrojs/markdown-remark 的 unified() 整体替换 Markdown 处理器，
 *    代价是会丢掉 Astro 内置的标题锚点与代码高亮。而当前语料里
 *    相对路径的图片引用实测为 0 条，收益抵不上风险，因此不走这条路。
 *    图片外置改由 scripts/migrate-assets.mjs + consts.ts 的 ASSETS_BASE 承担。
 *
 * 3. 为什么显式配 langAlias
 *    这批笔记大量使用 ```C / ```Java / ```Python 这类首字母大写的
 *    语言标记，而 Shiki 的语言 id 是小写的，不映射就会整块退化成
 *    无高亮的纯文本。
 */
export default defineConfig({
  site: SITE_URL,
  ...(BASE_PATH ? { base: BASE_PATH } : {}),
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  markdown: {
    shikiConfig: {
      // 必须给亮/暗两套主题：如果只配一套，Shiki 会把颜色写死成行内样式，
      // 切到深色模式后就变成"深底深字"，代码块完全读不出来。
      // defaultColor: false 让它输出 --shiki-light / --shiki-dark 两个
      // 自定义属性，由 global.css 按 [data-theme] 挑选，不再写死颜色。
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
      wrap: true,
      langAlias: {
        C: 'c',
        CPP: 'cpp',
        'C++': 'cpp',
        Java: 'java',
        Python: 'python',
        PYTHON: 'python',
        pythoon: 'python',
        Bash: 'bash',
        Shell: 'shellscript',
        shell: 'shellscript',
        Json: 'json',
        YAML: 'yaml',
        Yaml: 'yaml',
        Config: 'ini',
        config: 'ini',
        conf: 'ini',
        ASCII: 'ansi',
        ascii: 'ansi',
        Markdown: 'markdown',
        MD: 'markdown',
        SQL: 'sql',
        Docker: 'docker',
        dockerfile: 'docker',
        Nginx: 'nginx',
        LaTeX: 'latex',
        tex: 'latex',
        // 注意：不要写 `xml: 'xml'` 这类自映射，Shiki 会判定为循环别名并报错。
        // 本身就是小写且正确的语言标记无需出现在这张表里。
      },
    },
  },
  integrations: [
    sitemap({
      // 搜索页与 404 不需要被收录
      filter: (page) => !page.includes('/search') && !page.includes('/404'),
    }),
  ],
});
