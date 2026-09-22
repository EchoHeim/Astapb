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

## 写文章约定
丢 `.md` 进 `WebBlog/docs/<分类>/` → push 即上线（frontmatter 可省，prebuild 自动补）。
**禁相对路径引图；禁 GitHub 附件当图床**（源仓库一变权限就全 404）。图片走 `ASSETS_BASE`（jsDelivr）。
标签名不能含 `/`（`C/C++` 有映射）；新增分类要同步 `sync-content.mjs` 的 `TAG_RULES`。

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

## 博客侧待办 / 风险
- `docs/Linux/Linux应用编程/` 2 组重复文件（6 个），列表页会出现重复标题（历史遗留，未擅自删）。
- `WebBlog/FreeBorders.md` 是孤儿原创文章（放在 docs 根，内容源读不到），去向待定。
- 旧 `/blog/xxx.md` 直链 404（只有 `/#/blog/...` 有重定向）。
- 本机 `astro dev` **只监听 IPv6**：用 `localhost:4321`，`127.0.0.1` 会 ECONNREFUSED；
  端口被占先看 `.astro/dev.json`（它记着在跑的 dev server 的 pid/port）。
