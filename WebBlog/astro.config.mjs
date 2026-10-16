// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL, BASE_PATH, CDN_ORIGIN } from './src/consts.ts';

const PROJECT_ROOT = path.dirname(fileURLToPath(import.meta.url));

/**
 * 站点资源的真源目录（相对工程根）。它们**不进构建产物**：
 * dev 由下面的中间件直接读文件，生产由 scripts/rewrite-asset-urls.mjs
 * 把产物里的站内路径改写成 CDN_ORIGIN。新增图片目录时同步这里与重写脚本。
 */
const ASSET_PREFIXES = ['/images/', '/sponsor/images/'].map(
  (p) => BASE_PATH + p
);

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.txt': 'text/plain',
};

/**
 * dev 下把 `images/`、`sponsor/images/` 当静态目录服务。
 *
 * Astro 的 dev server 只服务 public/，而这两个目录在工程根 —— 结果就是
 * 本地预览时站点 logo、头像全部裂图（404，静默失败）。这里补上：
 * 本地文件存在就直接读，不存在则 302 回源 jsDelivr（跟线上行为一致）。
 * 只在 dev 生效（apply: 'serve'），构建产物走 CDN 重写，不受影响。
 */
function localAssets() {
  return {
    name: 'local-assets',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent((req.url || '').split('?')[0]);
        if (!ASSET_PREFIXES.some((p) => url.startsWith(p))) return next();

        const rel = url.slice(BASE_PATH.length);
        const file = path.resolve(PROJECT_ROOT, '.' + rel);
        // 防目录穿越：解码后的 ../ 也必须落在工程根之内
        if (!file.startsWith(PROJECT_ROOT + path.sep)) return next();

        if (fs.existsSync(file) && fs.statSync(file).isFile()) {
          res.setHeader(
            'Content-Type',
            MIME[path.extname(file).toLowerCase()] || 'application/octet-stream'
          );
          res.setHeader('Cache-Control', 'no-cache');
          fs.createReadStream(file).pipe(res);
          return;
        }
        res.writeHead(302, { Location: CDN_ORIGIN + rel });
        res.end();
      });
    },
  };
}

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
  vite: {
    plugins: [localAssets()],
  },
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
      /**
       * 搜索页与 404 不需要被收录。
       *
       * AI 简报也一并排除：按约定它只从首页那一个入口进入，
       * 导航 / 侧栏 / 搜索 / RSS / 站点地图里都不该出现它。
       * 想让它被搜索引擎收录，删掉下面两行判断即可。
       *
       * 中文路径在 sitemap 里可能是百分号编码的，两种写法都要判。
       */
      filter: (page) =>
        !page.includes('/search') &&
        !page.includes('/404') &&
        !page.includes('AI动态') &&
        !page.includes(encodeURIComponent('AI动态')),
    }),
  ],
});
