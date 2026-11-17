import { defineConfig, type Plugin } from 'vite';
import { CATEGORIES, TOTAL_SITES } from './src/data/categories';

/**
 * 把分类数与站点总数注入 index.html。
 *
 * meta description 里的「N 个分类共 M 个站点」手写过三版，三个数字各不相同
 * （index.html 与 README 写 301，categories.ts 注释写 302，实际 296）。
 * 这类「同一个事实写在两个地方」的数字一律改成构建期注入 —— 数据一改，meta 自己跟上。
 *
 * 用 `{{NAME}}` 而不是 `%NAME%`：后者是 Vite 自己的环境变量占位语法，会先一步吃掉。
 */
function injectCounts(): Plugin {
  return {
    name: 'inject-site-counts',
    transformIndexHtml(html) {
      // 用正则而不是 replaceAll：tsconfig 的 lib 是 es2020，没有那个方法
      return html
        .replace(/\{\{SITE_COUNT\}\}/g, String(TOTAL_SITES))
        .replace(/\{\{CATEGORY_COUNT\}\}/g, String(CATEGORIES.length));
    },
  };
}

// 导航站被部署到 Pages 产物的 /aa/ 子路径下（见 .github/workflows/publish.yml）。
// base 必须是 '/aa/'，否则构建产物里的资源引用会指向站点根，博客会把它们吃掉。
export default defineConfig({
  base: '/aa/',
  plugins: [injectCounts()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    // 图标全部单独成文件、带内容哈希。
    // 默认的 4KB 内联会把近 30 张小图标塞进 JS 变成 base64（体积还涨三分之一），
    // 而它们本来就是长期不变的静态资源，指纹文件名 + 强缓存更划算。
    assetsInlineLimit: 0,
    reportCompressedSize: true,
  },
  server: {
    // 本地预览时同样走子路径，避免「本地好、线上坏」
    open: '/aa/',
  },
});
