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
 *   export const CDN_ORIGIN =
 *     'https://cdn.jsdelivr.net/gh/EchoHeim/Astapb-assets@main';
 */
export const CDN_ORIGIN =
  'https://cdn.jsdelivr.net/gh/EchoHeim/Astapb@master/WebBlog';

/**
 * 资源基址 —— 图片与附件统一由这里提供。
 *
 * 2026-10-16 修正：原先注释称「astro dev 把仓库根当静态资源目录，/images/ 是 200」，
 * 实测是 **404**（dev 只服务 public/）。所以本地预览下站点 logo、头像全是裂图，
 * 而这个失败是静默的，很容易误判成样式问题。现在由 astro.config.mjs 里的
 * `local-assets` 中间件补上：dev 下直接从 `images/` 读文件，本地没有的（还没加进
 * 来的图）再 302 回源 CDN。
 */
export const ASSETS_BASE =
  // 本地开发走站内绝对路径：dev 由中间件提供，不用先 commit + push 就能看到新图。
  // 构建产物里的站内路径，则由 scripts/rewrite-asset-urls.mjs 在 build 之后
  // 统一改写成 CDN_ORIGIN —— 两条路走同一个真源 `images/`，线上仍然走 CDN 加速。
  import.meta.env?.DEV
    ? ''
    : CDN_ORIGIN;

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

/**
 * 微信公众号入口 —— 报头右侧的「图标 + 悬浮二维码」。
 *
 * 常驻状态只是一个 34px 图标（不遮挡页面任何内容）；鼠标悬停、键盘聚焦
 * 或触摸点击时才浮出二维码卡片，移开 / 点外部即收起。
 * 二维码与「关于」页用的是同一张图（Qart_CodeKey.png）。
 */
export const WECHAT = {
  /** 总开关：false 时报头不渲染微信入口 */
  enabled: true,
  /** 公众号二维码（入口图标是内联的微信 logo，见 WeChatEntry.astro） */
  qr: `${ASSETS_BASE}/images/Qart_CodeKey.png`,
  /** 图标按钮的无障碍名称 */
  label: '微信公众号：程序小猴（查看二维码）',
  /** 卡片标题与副文案 */
  cardTitle: '微信公众号「程序小猴」',
  cardHint: '编码技术 · 学习经验 · 生活感悟',
  /** 二维码图片的 alt（与「关于」页同一份描述） */
  qrAlt: '微信公众号二维码：程序小猴',
};

/**
 * AI 简报 —— 唯一入口在首页，其它位置（导航 / 侧栏 / 搜索 / RSS / 站点地图）
 * 一律不出现，这是刻意的：简报内容只从那一个入口进。
 *
 * 内容由 `scripts/sync-ai-brief.mjs` 从仓库里的 `CodeKey/AI 日报/*.md`
 * 生成到 `docs/AI动态/YYYY-MM/`，清单落在 `src/data/ai-brief.json`。
 * 这里只放展示文案，改文案不用动页面代码。
 */
export const AI_BRIEF = {
  title: 'AI 简报',
  /** 入口与目录页的说明文字 */
  description:
    'AI 简报 —— 把 AI 圈每天的新工具和新动静，压缩成 5 分钟的读量。',
  lede:
    '把 AI 圈每天的新工具和新动静，压缩成 5 分钟的读量：值得关注的模型与算力动向、能下载能上手的开源项目，以及每条的实用判断。',
  /** 入口区块上的一句短语 */
  tagline: '每日更新 · 5 分钟读完一圈 AI 动态',
  /** 目录页页脚的小字说明 */
  note: '简报按月份归档，随日报同步更新（工作日 08:00 前后）。',
};

/**
 * 评论区 —— Giscus（评论存在 GitHub Discussions 里，零后端、零维护）。
 *
 * 启用前在 GitHub 上做两步（各一分钟，不用改代码）：
 *   1. 仓库 Settings → General → Features → 勾选 Discussions；
 *   2. 安装 giscus App（https://github.com/apps/giscus）并授权本仓库。
 * 随后到 https://giscus.app/zh-CN 输入仓库名并选择分类，
 * 把生成的 categoryId 填到下面对应位置即可。
 *
 * categoryId 留空时视为「还没配好」：文章页不渲染评论区，不输出半成品组件；
 * 想整体暂停评论区，把 provider 改成 'none'（配置原样保留）。
 */
export const COMMENTS = {
  provider: 'giscus' as 'giscus' | 'none',
  giscus: {
    /** 存放评论的仓库（owner/repo） */
    repo: 'EchoHeim/Astapb',
    /** 仓库 ID（R_ 开头）；仓库迁移/重建后需要更新 */
    repoId: 'R_kgDOHgQi-A',
    /**
     * Discussion 分类：用 Announcements —— 只有仓库维护者能发起新讨论、
     * 访客只能评论和回复，天然防止有人乱开讨论。开启 Discussions 时自动创建。
     */
    category: 'Announcements',
    /** 分类 ID（DIC_ 开头），在 giscus.app 上选好分类即可看到 */
    categoryId: 'DIC_kwDOHgQi-M4DIkZr',
    /** 页面与讨论的映射方式：链接结构不变时用 pathname 最稳 */
    mapping: 'pathname',
    /** 评论区界面语言 */
    lang: 'zh-CN',
  },
};

/** 主题：'auto' 跟随系统，其余为固定值。localStorage 键名 */
export const THEME_STORAGE_KEY = 'blog-theme';
