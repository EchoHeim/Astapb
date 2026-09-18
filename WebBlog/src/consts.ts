/**
 * 站点级常量。改这里的值即可，不用翻页面代码。
 */

/** 站点主域名（不含子路径） */
export const SITE_URL = 'https://shilong.js.org';

/**
 * 本博客发布在站点下的子路径。
 *
 * 2026-09-18：由 '/posts' 改为 '' —— 博客**接管根路径**，取代原来的
 * docsify 站点。原来那套 docsify 机制已删除，文章内容与图片资源
 * 现在都在本工程目录内（`docs/`、`images/`、`sponsor/`）。
 *
 * 这个值同时驱动 astro.config.mjs 的 base 与页面里的所有站内链接，
 * 想让博客回到子路径只改这一行即可。
 */
export const BASE_PATH = '';

/** 博客标题与描述 */
export const SITE_TITLE = "MacLodge's Blog";
export const SITE_DESCRIPTION =
  '嵌入式工程师的学习笔记 —— Linux、C/C++、Python、FPGA、ToolBox。互联网是有记忆的，我想留下一些成长的脚印。';

/** 作者信息 */
export const AUTHOR = {
  name: 'MacLodge',
  email: 'shilong.native@foxmail.com',
  github: 'https://github.com/EchoHeim',
  site: SITE_URL,
};

/**
 * 资源基址 —— 图片与附件统一由这里提供。
 *
 * 指向本仓库 `WebBlog/` 目录的 jsDelivr 地址：图片文件放在
 * `WebBlog/images/` 与 `WebBlog/sponsor/images/`，**不进构建产物**，
 * 由 jsDelivr 直接分发。好处是立刻可用，缺点是主仓库包体积远超
 * jsDelivr 的 50 MB 加速上限，长期不可靠。
 *
 * 正式做法是建一个独立的资源仓库（附件占 219 MB，不该和代码混在一个包里），
 * 跑 `npm run migrate-assets -- --yes` 把被引用的资源镜像过去，然后只改这一行：
 *
 *   export const ASSETS_BASE =
 *     'https://cdn.jsdelivr.net/gh/EchoHeim/Astapb-assets@main';
 */
export const ASSETS_BASE =
  'https://cdn.jsdelivr.net/gh/EchoHeim/Astapb@master/WebBlog';

/** 首页每页文章数 */
export const PAGE_SIZE = 10;

/** 导航栏 */
export const NAV = [
  { label: '首页', href: '' },
  { label: '标签', href: 'tags/' },
  { label: '归档', href: 'archive/' },
  { label: '关于', href: 'about/' },
];

/** 外部链接（主导航右侧） */
export const EXTERNAL_LINKS = [
  { label: '导航站', href: 'https://shilong.js.org/aa/' },
  { label: 'GitHub', href: 'https://github.com/EchoHeim/Astapb' },
];

/** 主题：'auto' 跟随系统，其余为固定值。localStorage 键名 */
export const THEME_STORAGE_KEY = 'blog-theme';
