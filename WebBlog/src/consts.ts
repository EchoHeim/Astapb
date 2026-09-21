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

/** 报头右侧的小字，标注站点起始年份 */
export const SITE_SINCE = 'since 2022';

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
  // 本地开发走站内相对路径：`astro dev` 本来就把仓库根目录当静态资源目录
  // （实测 /images/xxx.png、/sponsor/images/xxx.png 都是 200），所以新加的图
  // 不用先 commit + push 就能在本地看到 —— 否则 jsDelivr 取不到未提交的文件，
  // 本地只会看到裂图，而且这个失败是静默的，很容易误判成样式问题。
  // 构建产物不受影响，仍走下面的 CDN。
  import.meta.env?.DEV
    ? ''
    : 'https://cdn.jsdelivr.net/gh/EchoHeim/Astapb@master/WebBlog';

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

/**
 * 报头右上角的图标入口 —— 排在搜索按钮左边，34px 见方，与搜索/主题按钮同一排。
 *
 * 和 EXTERNAL_LINKS 的分工：那边是文字链接，跟主导航排在一起；这边是图标按钮，
 * 适合放头像类的社交主页。图标走 ASSETS_BASE，与站内其它资源同一套分发方式。
 * `label` 同时用作 aria-label 和 title（图标按钮没有可见文字，必须给可读名称）。
 */
export const HEADER_ICONS = [
  {
    label: 'B 站主页',
    href: 'https://space.bilibili.com/97643323',
    icon: `${ASSETS_BASE}/images/2233.gif`,
  },
];

/** 主题：'auto' 跟随系统，其余为固定值。localStorage 键名 */
export const THEME_STORAGE_KEY = 'blog-theme';
