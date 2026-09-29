import { defineConfig } from 'vite';

// 导航站被部署到 Pages 产物的 /aa/ 子路径下（见 .github/workflows/publish.yml）。
// base 必须是 '/aa/'，否则构建产物里的资源引用会指向站点根，博客会把它们吃掉。
export default defineConfig({
  base: '/aa/',
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
