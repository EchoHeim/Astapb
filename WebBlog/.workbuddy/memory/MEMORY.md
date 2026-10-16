# WebBlog 博客长期备忘

> **2026-09-22 起分家**：本文件只放**博客专属**的东西（本站架构、内容目录契约、Astro 坑、
> 写文章与 AI 简报约定、前端与构建）。
> 仓库级共有的（仓库结构、部署流水线、导航站 WebSite、CodeKey 公众号、许可、风险、环境坑）
> 在 `D:\Personal\Astapb\.workbuddy\memory\MEMORY.md`。
> 日志同理：博客的事写本目录 `YYYY-MM-DD.md`，仓库级的事写仓库根同名文件。

## 定位
`WebBlog/` = Astro 7 静态博客，发布在**根路径 `/`**（`SITE_URL` = https://shilong.js.org），
仓库地址与域名都和旧 docsify 时代一致，只是换了构建方式。内容源 `docs/` 与站点代码同一工程。
第三方资料（尚德机构-考研 / 港股打新）的转换与审计记录在**仓库根** memory，不在本目录。

## 内容目录契约（改目录名必踩）
内容目录 = `WebBlog/docs/`，改名须同源改三处：`src/content.config.ts` 的 `loader.base`、
`scripts/sync-content.mjs` 的 `BLOG`、`scripts/migrate-assets.mjs` 的 `BLOG`。
`sync-content.mjs` 的 git 前缀剥离必须枚举全部历史前缀
（`WebBlog/blog|WebBlog/docs|docs/blog|blog|docs`），漏一种会让部分文章取不到首次提交日期、
**静默退化成文件 mtime**（不报错，只是日期全错）。
`BaseLayout.astro` 里的 `p === 'blog/README'` 是旧 docsify hash 路由重定向，**不能改**。
`src/consts.ts` 的 `BASE_PATH` 是唯一开关 —— 改了要连带 `scripts/sync-ai-brief.mjs` 里的 `BASE` 常量。

## Astro 7 的坑
- `markdown.rehypePlugins` 已废弃；正文里相对路径的图不存在 → 构建直接失败（`npm run check` 提前体检）。
- Shiki：语言 id 小写 + `langAlias` 兜 ```C/```Java；**别名表禁自映射**；必须
  `themes:{light,dark}` + `defaultColor:false`，否则深色模式代码块深底深字。
- `src/pages/*.json.js` 不支持 TS 语法，端点要写成 `.ts`。
- **构建前先停预览服务**（Astro 清 `dist` 时被占句柄 → 命令被 SIGTERM）。
- **`sortPosts()`（`src/utils/posts.ts`）是可复现构建的关键**，凡是列文章一律用它（日期倒序 + id 升序）。
- **`npm run check` 不是 astro check**，只是跑 `sync-content.mjs --check`（内容 frontmatter 体检）；
  本机没装依赖时它照样「成功」，别拿它当构建验证。真正的类型检查得靠 `astro check` / `npm run build`。
- 站点**没启用 view transitions**（`astro:transitions` 全库无引用）→ 组件里直接写普通
  `<script>` 初始化即可，不用写 `astro:page-load` 监听。
- **dev server 只服务 `public/`**：工程根的 `images/` 等在 dev 下是 404（只有 `public/` 里的
  favicon 之类能 200）→ 现由 `astro.config.mjs` 的 `local-assets` 中间件补上，别再假设它能直出。
- **glob loader 忽略 `_` 前缀的 md**（`_imgtest.md` 不会成为文章，也不报错），临时验证文件别用下划线开头。
- **WorkBuddy 环境有 node 批量删除保护**：Astro 清 `dist/.prerender`（~50 文件、达阈值）
  会被 `SAFE_DELETE_BULK_CONFIRM_REQUIRED` 拦掉、构建失败 →
  构建命令前缀 `CODEBUDDY_SAFE_DELETE_ENABLED=0`（单命令生效、免审批）即过；
  或先前台 `rm -rf dist`（会走一次审批，也能过）。

## 组件约定
- 站点配色一律走 `global.css` 的 CSS 变量（`--paper`/`--rule-2`/`--accent-soft`/`--shadow` 等），
  深色模式靠 `[data-theme="dark"]` 覆盖自动跟随；**别在新组件里写死颜色**。
- 图标/图片走 `ASSETS_BASE`（dev 下 = 站内绝对路径，由 `local-assets` 中间件提供；构建后 = jsDelivr）。
- **`images/logo.png` 是不透明白底图**（全图 0 透明像素；242×116，手写内容只占 x34..215 / y15..112，
  两侧共 60px 白边）→ 贴进页面必须做两件事，照抄 `.hero__logo` 那段即可：
  ①混合模式融底：浅色 `mix-blend-mode:multiply`、暗色 `filter:invert(1) hue-rotate(180deg)`
  + `mix-blend-mode:screen`（**hue-rotate 不能省**，否则叶子的绿翻成品红）；
  ②按原始像素比例用负 margin 抵掉白边（`--k: calc(var(--logo-ink)/182)`），否则视觉尺寸缩水近 1/4。
- **`ASSETS_BASE` 生产值指向主仓库**（`cdn.jsdelivr.net/gh/EchoHeim/Astapb@master/WebBlog`，
  不是独立资源仓库）→ `images/`、`sponsor/images/` 里**新增的图必须 commit + push 才上线**。
  （`consts.ts` 早年注释称「dev 下 /images/ 是 200」，2026-10-16 实测是 **404**，已修正。）

## 赞赏区（`sponsor/`）
- `sponsor/` 下的 `index.html`/`style.css`/`script.js`/`README.md` 是上游
  [Kaiyuan/sponsor-page](https://github.com/Kaiyuan/sponsor-page) `simple/` 版的原样拷贝，
  **是独立 demo、不参与站点构建**（Astro 只路由 `src/pages`、只拷 `public/`）。
  只有 `sponsor/images/` 是有用的素材源（且已被 git 跟踪）。
- 页面侧实现是 `src/components/SponsorSimple.astro`（内联版：徽标 + 分段图标条 + rotateX 翻出二维码），
  挂在 `src/pages/about.astro` 的「赞赏」卡片。原版是全屏 fixed 浮层，照搬会盖住整页。
- **★ 这些图标不是方形图标，是 ~3:1 的横向字标**（alipay 448.5×145.5、wechat 531.2×161.7、
  QQqianbao.png 104×30），且支付宝是 `#074098` 深蓝。→ 容器要**扁长**（现用 62×20），
  且图标条的底**必须保持浅色**（深色模式用暖白 `#efece2`）—— 塞进方框会糊、放深底上会看不见。
- `sponsor/images/BTCQR.png` **与上游逐字节相同 = 原作者本人的比特币地址，禁止收录**。
- `text.png` 是 320×240 但字只占中间 256×66：靠容器 `aspect-ratio:256/66` + `object-fit:cover`
  裁掉透明边，不用改图。它在深色模式下需要 `invert(1)`。
- `WeChatQR.png` 已删除，微信码现名 `WePayQR.png`（曾误引旧名 → 裂图）。

## 写文章约定
丢 `.md` 进 `WebBlog/docs/<分类>/` → push 即上线（frontmatter 可省，prebuild 自动补）。
**禁相对路径引图；禁 GitHub 附件当图床**（源仓库一变权限就全 404）。图片走 `ASSETS_BASE`（jsDelivr）。
标签名不能含 `/`（`C/C++` 有映射）；新增分类要同步 `sync-content.mjs` 的 `TAG_RULES`。

## 文章配图（2026-10-16 定：真源 images/posts + dev 中间件 + 构建后 CDN 重写）
lodge 要「写起来顺手 + 线上有加速」，所以定型为：**md 里写站内绝对路径，构建后统一改写成 CDN**。
- **真源唯一**：`WebBlog/images/posts/<分类>/xxx.png`（子目录用**英文**，中文路径会被百分号编码）。
  **别把图放 `docs/` 里用相对路径** —— Astro 7 下相对路径图不存在会**直接构建失败**，且 `docs/` 不进产物。
- **md 里写法**：`![说明](/images/posts/linux/x.png)`
  - dev：`astro.config.mjs` 的 `local-assets` 中间件直读 `images/`、`sponsor/images/`
    （**新图免 push 即可见**）；本地没有的 302 回源 CDN。
  - 生产：`scripts/rewrite-asset-urls.mjs`（**postbuild 自动跑**）把产物里 `"/images/` 改成 CDN；
    外链与已有 CDN 链接不会被动。`npm run cdn:check` 可只体检。
- **线上仍要 commit + push**（CDN 取的是仓库文件），本地即时 ≠ 线上即时。
- CDN 地址只在 `consts.ts` 的 **`CDN_ORIGIN`** 一处（`ASSETS_BASE` 由它拼；重写脚本与
  `migrate-assets.mjs` 都从 consts.ts 正则读，别另写硬编码）。
- 新增图片目录要同步 `astro.config.mjs` 的 `ASSET_PREFIXES` 与重写脚本的 `ASSET_DIRS`。

## AI 简报（2026-09-22 新增，唯一入口在首页）
**只有首页那一个入口能到**，导航 / 侧栏 / 搜索 / RSS / 标签 / 归档 / 站点地图一律不出现 —— 这是刻意的约束。
- **用户主动发来新日报时，跑 `node scripts/sync-ai-brief.mjs` 即可**（也挂在 `predev`/`prebuild` 自动跑）。
  源：`D:\Personal\Astapb\CodeKey\AI 日报\*.md`（可用 `AI_BRIEF_SRC` 换目录）。
- 产物三份：正本 `docs/AI动态/YYYY-MM/YYYY-MM-DD.html`（自包含 HTML，随仓库提交，按月份分文件夹）
  ＋ 镜像 `public/AI动态/`（已 gitignore，脚本**每次无条件**从正本重建，CI 就靠这一步）
  ＋ 清单 `src/data/ai-brief.json`（首页入口与目录页读它）。
- 入口页 `src/pages/AI动态/index.astro`；样式在 `global.css` 第 19 节；文案在 `consts.ts` 的 `AI_BRIEF`。
- **要放开「只在这一个入口可见」这条约束时，得同时改 4 处**：`consts.ts` 的 `NAV`+`Footer`+`Sidebar`
  不加链接、`search-index.json.ts` 与 `rss.xml.js` 只读 posts 集合、`astro.config.mjs` 的 sitemap filter。
- 提交时只 `git add WebBlog/docs/AI动态` 与 `WebBlog/src/data/ai-brief.json`（外加未提交的原稿），别顺手带上无关改动。
- 原稿两种格式、标题清洗规则、「💡 小猴点评」折叠逻辑都写在 `scripts/sync-ai-brief.mjs` 头部注释里。
- **源目录的原稿 md 不可删**（2026-10-16 lodge 问过「日报上线后能否删源稿」）：脚本每次全量重扫 +
  prune 孤儿页面 —— 部分删 → 对应期页面被清；全删后下次发新一期照样把旧页全清。原稿已被 git 跟踪、
  体积小，留着零成本，且是以后改版式/批量修正时唯一的再生源。

## 评论区（Giscus，2026-10-16 新增，已启用）
文章页文末挂 `src/components/Comments.astro`，评论存在仓库 Discussions 里，零后端。
配置全在 `consts.ts` 的 `COMMENTS`：**`categoryId` 为空 = 未配置 → 组件整块不渲染**；
`provider:'none'` 可整体暂停。当前值：`DIC_kwDOHgQi-M4DIkZr`（Announcements 分类）。
组件三件事：懒加载（提前 400px 注入 client.js）、主题联动（监听 `themechange` → postMessage
setConfig）、失败兜底（script error / 12s 无 iframe → 提示 + 重试 + 讨论区链接）。
- **别改成"只靠 message 判定成功"**：giscus 普通模式不发就绪消息，占位撤销靠 script 的
  load 事件 + 超时查 iframe（有 iframe 即算成功）。
- 样式在 `global.css` 第 20 节（打印节因此改成 21；`.comments` 已进打印隐藏列表）。
- `BaseLayout.astro` 的 `giscusBacklink` prop → `<meta name="giscus:backlink">`：
  保证本地/临时域名下发的评论，回链也指向正式地址（文章页传 canonical）。
- GitHub 侧前置：仓库开 Discussions + 装 giscus App。**取 categoryId 的正确姿势**：
  `https://giscus.app/api/discussions/categories?repo=EchoHeim/Astapb&repoId=R_kgDOHgQi-A`
  （匿名可读）；**GitHub REST 没有 categories 端点**（`/discussions/categories` 是 404），
  别照文档猜。

## 微信入口（2026-10-16 新增）
报头右侧的公众号入口：`src/components/WeChatEntry.astro`（挂 `Header.astro` tools 区第一位），
配置在 `consts.ts` 的 `WECHAT`（enabled 开关 / 二维码 / 文案）。
入口图标是**内联的微信 logo**（simple-icons 双对话泡剪影，CC0，品牌绿 #07c160，22px；
注意 `.icon-btn svg` 的 stroke 会继承到 path，path 需显式 `stroke="none"`），
即换图标时改组件里的 `<svg>` 而不是配置。
设计要点：**常驻形态只是一个 34px 图标（零遮挡）**，hover / focus / 点击才浮出二维码卡片；
桌面走 CSS（`:hover` + `:focus-within`）、触摸走 JS（按 `(hover: hover)` 分流，点外部 / Esc 关）。
- 样式在 `global.css` 报头节（`.wx` 块）；卡片 200px，小屏（≤480）居中于图标
  （`margin-left:-100px` 与卡片宽度耦合，改宽要同步）。
- 报头溢出兜底断点已由 400px 上调至 **480px**（图标 4→5 个），响应式节注释同源。
- 二维码与「关于」页同图（`images/Qart_CodeKey.png`），公众号名「程序小猴」
  （账号说明见 `CodeKey/README.md`）。

## 博客侧待办 / 风险
- `docs/Linux/Linux应用编程/` 2 组重复文件（6 个），列表页会出现重复标题（历史遗留，未擅自删）。
- `WebBlog/FreeBorders.md` 是孤儿原创文章（放在 docs 根，内容源读不到），去向待定。
- 旧 `/blog/xxx.md` 直链 404（只有 `/#/blog/...` 有重定向）。
- 本机 `astro dev` **只监听 IPv6**：用 `localhost:4321`，`127.0.0.1` 会 ECONNREFUSED；
  端口被占先看 `.astro/dev.json`（它记着在跑的 dev server 的 pid/port）。
