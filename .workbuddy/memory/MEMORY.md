# Astapb 项目长期备忘

## 定位
个人知识分享库：`WebBlog/` = Astro 博客（文章源 `docs/` + 代码，根路径 `/`）；`WebSite/` = 导航站（Vite+TS，`/aa/`）；`CodeKey/` = 公众号素材；`scripts/` = 小工具。

## 内容目录契约（改目录名必踩）
内容目录 = `WebBlog/docs/`，改名须同源改三处：`content.config.ts` 的 `loader.base`、`sync-content.mjs` 的 `BLOG`、`migrate-assets.mjs` 的 `BLOG`。
`sync-content.mjs` 的 git 前缀剥离必须枚举全部历史前缀（`WebBlog/blog|WebBlog/docs|docs/blog|blog|docs`），漏一种会让部分文章取不到首次提交日期并**静默退化成文件 mtime**（日期全错但不报错）。
`BaseLayout.astro` 里 `p==='blog/README'` 是旧 docsify hash 路由重定向，**不能改**。

## Astro 7 的坑（都实际踩过）
- `markdown.rehypePlugins` 废弃不生效；相对路径图片缺失 → 构建直接失败（`npm run check` 提前体检，已剔代码块）。
- Shiki：语言 id 小写 + `langAlias` 兜 ```C/```Java，**别名表禁自映射**（`xml:'xml'` 报 Circular）；必须 `themes:{light,dark}` + `defaultColor:false`，否则深色代码块深底深字。
- `src/pages/*.json.js` 不支持 TS，写 `.ts`。
- **构建前先停本地预览服务**，否则清 `dist` 被占句柄 → SIGTERM。
- **`sortPosts()`（src/utils/posts.ts）是可复现构建关键**：同日期文章极多，任何列文章的地方都要用它，别写裸 `sort`。

## 导航站 WebSite 要点
- 零 UI 框架；图标池 `src/lib/icons.ts` 用 `import.meta.glob('/icon/**/*.png')`，key=文件名。**别改回按分类中文名拼路径的旧思路**（曾 24/97 静默 404）。缺图标→首字母色块兜底，**不许用别家 logo 顶替**。
- `scripts/verify-icons.mjs`（prebuild）靠 Node 22.18+ 原生 TS type-stripping import `.ts` 数据模块，坏图标 exit 1。
- 主题契约：`data-theme` + `data-theme-key="nav-theme"` + 内联防闪脚本；`tokens.css` 的 dark 值是旧站原始值，**改它就是改视觉保真**。锚点高亮用整行（多列换行时单锚点会亮错行）。
- 图标归一化：`scripts/normalize-icon.py` + `scripts/normalize-icons-batch.py` 把 `icon/`、`header/`、`search/` 的品牌 logo 批量处理成 256×256 统一圆形色板风格，保留原 logo 图形与颜色，仅统一画布/背景板。处理前先备份到 `.workbuddy/_backup/original-icons/`。

## 部署
- 正式：GitHub Pages，域名 `shilong.js.org`。`publish.yml` 构建单一产物：`WebBlog/dist/.`→根 + `WebSite/dist/.`→`/aa/`；Node 22，缓存两个 package-lock；前提 **Settings→Pages→Source = "GitHub Actions"**。
- 遗留：Vercel 项目 `astapb` 持续失败（后台 Node 写死 16.x），待决：删除（推荐）或改 22.x + Root=WebBlog。

## 写文章约定
- 丢 `.md` 进 `WebBlog/docs/<分类>/` → push 即上线。不写 frontmatter 也行（prebuild 自动补 title/date/tags/summary）。
- **禁相对路径引图；禁 GitHub 附件当图床**（源仓库一变全 404 且救不回）。图片放仓库走 jsDelivr。
- 标签名不能含 `/`（`C/C++` 有映射）。新增分类要同步 `sync-content.mjs` 的 `TAG_RULES`。

## 待处理风险
- **凭据泄漏（必须轮换，改文件无效）**：`scripts/report_ip/autoemail.py` SMTP 授权码、`scripts/test.sh` WiFi 密码，均已进 git 历史。
- `Linux/Linux应用编程/` 下 2 组完全重复文件（6 个），历史遗留，未擅自处理。
- `WebBlog/FreeBorders.md` 孤儿文章待确认去向；第三方资料（考研/港股）仍公开；`.git/` 约 357 MB 未清理；旧 docsify 遗留图约 1 MB 未删。
- `/blog/xxx.md` 直链 404（`/#/blog/...` 已有重定向）。

## 许可
scripts/.github/站点代码 = MIT；`docs/**/*.md` + 原创图 = CC BY-NC-SA 4.0；CodeKey = 保留所有权利；icon/header = 第三方商标仅作索引。GPL-3.0 已废弃。

## 环境坑
本机 bash 无 coreutils（`ls/mkdir/dirname` 不可用），PowerShell 工具不回显 stdout → **文件操作与读输出一律走 node**；`git config core.quotepath false`；无头 Chrome 截图路径见 skill `local-html-visual-verify`。
