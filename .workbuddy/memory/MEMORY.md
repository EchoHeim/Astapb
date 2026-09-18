# Astapb 项目长期备忘

## 定位（2026-09-18 目录整合后）
个人知识分享库。**`docs/` 已整体并入 `WebBlog/`，仓库根不再有 `docs/` 目录。**
| 路径 | 职责 |
| --- | --- |
| `WebBlog/` | **博客站全部内容**：文章源 `docs/`、图片 `images/` `sponsor/images/`、站点代码 `src/`，发布在 `/`（根路径） |
| `WebSite/` | 网站导航资源区（纯静态，复刻 lackar.com/aa，标题 AnywhereAnything）→ `/aa/` |
| `CodeKey/` | 公众号「程序小猴」素材库（微信表情包 / AI 日报，图片为主） |
| `scripts/` | Python/shell 小工具（report_ip 自动上报本机 IP） |

### 内容目录路径（改路径时最容易踩的地方）
**内容目录 2026-09-18 一天内被挪过两次**：仓库根 `docs/blog/` → `WebBlog/blog/` → `WebBlog/docs/`。
注意现在的 `WebBlog/docs/` 与仓库根曾有的 `docs/` **完全是两回事**（后者已删）。
改目录名时这几处必须同源，漏一处就出问题：
| 位置 | 当前值 |
| --- | --- |
| `src/content.config.ts` 的 `loader.base` | `'./docs'` |
| `scripts/sync-content.mjs` 的 `BLOG` | `path.join(PROJECT, 'docs')` |
| `scripts/migrate-assets.mjs` 的 `BLOG` | `path.join(ASSET_ROOT, 'docs')` |
| `sync-content.mjs` 的 git 前缀剥离 | `/^(?:WebBlog\/blog\|WebBlog\/docs\|docs\/blog\|blog\|docs)\//` —— **必须枚举全部历史前缀**。git 里同时存在三种路径，只剥一两种的话，另一部分文章会取不到首次提交日期并**静默退化成文件 mtime**（不报错，只是日期全错） |
| `src/consts.ts` 的 `ASSETS_BASE` | `https://cdn.jsdelivr.net/gh/EchoHeim/Astapb@master/WebBlog`（图片在 `WebBlog/images`、`WebBlog/sponsor/images`，**不在内容目录里，所以目录改名不影响它**） |
| `.github/workflows/publish.yml` | 只构建 `WebBlog/`，无 `docs/` 引用 |
⚠️ `src/layouts/BaseLayout.astro` 里的 `p === 'blog/README'` **不能改** ——
它匹配的是旧 docsify 的 hash 路由 `/#/blog/...`，属于历史 URL。

### 博客站点（WebBlog/，2026-09-18 起接管根路径）
- Astro 7 + `@astrojs/rss` + `@astrojs/sitemap` + `@astrojs/markdown-remark`。
- **`BASE_PATH = ''`**（`src/consts.ts`）。想回子路径只改这一行，
  `astro.config.mjs` 会跟着走。改动前记得同步 `publish.yml` 的产物落点。
- **内容源 = 同目录下的 `docs/`**（`loader.base = './docs'`）。所有内容与代码同处一个工程。
  排除 `**/README.md` / `_sidebar.md` / `blog_start.md` / `Catalog/**` / 三个第三方目录。
  集合内 **104 篇**。排除规则里的 `_sidebar.md`/`Catalog` 已是历史名词（文件已删），保留仅为防御。
- 站点常量集中在 `src/consts.ts`。
- 页面：列表分页（10/页）、详情（目录+阅读进度+上下篇+相关阅读+JSON-LD）、
  标签总览（分「分类/细分标签」两组）与单标签列表、归档（按年）、
  关于、搜索页、RSS、sitemap、404、robots.txt。
- 交互：亮/暗主题（跟随系统+记忆）、搜索弹窗（`/` 或 `Ctrl/Cmd+K`，
  索引 `search-index.json` 按需加载）、代码复制、回到顶部。
- **`src/utils/posts.ts` 的 `sortPosts()` 是构建可复现的关键**：这批文章有大量
  同一天发布的（Python 数据分析 14 章全是 2022-06-23），只按日期排序时同日期内部
  会保留文件系统枚举顺序 —— 换机器或挪目录就会让产物顺序变化。加了 id 作第二排序键后
  **连续两次构建产物逐字节一致**。新增任何"列出文章"的地方都要用它，别再写裸 `sort`。
  （踩过的坑：批量替换时把 `search-index.json.ts` 的 `.sort(...)` 直接删掉了，
  等于丢排序，已改回 `sortPosts(posts)`。）
- `docs/` 那套 docsify 机制（105 文件 / 14 MB）已随目录整合一并删除，
  连同 `docs/index.html` 里的 frontmatter 剥离钩子 —— 该文件已不存在。
- Astro 7 的坑（都实际踩过）：
  `markdown.rehypePlugins` 已废弃不生效；相对路径图片缺失会直接构建失败；
  Shiki 语言 id 必须小写（靠 `langAlias` 兜住 ```C / ```Java），
  **且别名表里不能写自映射**（`xml: 'xml'` 会报 Circular alias）；
  **Shiki 必须配 `themes:{light,dark}` + `defaultColor:false`**，
  否则深色模式代码块是深底深字；`src/pages/*.json.js` 不支持 TS，要用 `.ts`。
- **构建前要先停掉本地预览服务**，否则 Astro 清 `dist` 时被占用的句柄会让命令被 SIGTERM。

- 远程 `EchoHeim/Astapb`，GPL-3.0，主分支 `master`，作者别名 MacLodge。
- 博客线上域名 `shilong.js.org`（**docs/CNAME 的存在说明 Pages 发布源 = master 的 /docs 目录**）。
- 导航站旧地址 `echoheim.github.io/AnywhereAnything/` 实测仍存活 → 独立仓库可能仍在，存在两份拷贝漂移风险。
- `.github/workflows/publish.yml`：Actions 构建**单一产物**并发布 ——
  `WebBlog/dist/.` 放产物根（博客），`WebSite/` 放 `/aa/`（导航），
  **不再复制 `docs/`**。构建前先 `npm ci && npm run build`（Node 22，缓存
  `WebBlog/package-lock.json`），并自检产物里 `index.html` / `rss.xml` /
  `sitemap-index.xml` / `search-index.json` / `favicon.ico` 是否齐全。
  **产物体积约 2 MB**（旧 docsify 产物是 247 MB）。
  **前提：仓库 Settings → Pages → Source 必须选 "GitHub Actions"**，否则 deploy-pages 报错。
  CNAME 由 workflow 写入产物根。
- `docs/index.html` 的样式引用已由 `../css/custom.css` 修正为 `css/custom.css`。

## 已废弃内容（历史，勿再引用）
2026-09-18 提交 `39bbf28` 把旧的 `mfast` 构建工具链整体删除：
`mfast` / `mfast.cfg` / `mfast_ui/`(8) / `mfast_fun/`(7) / `shell/`(36) / `src/`(6 个 C 驱动样例) / `Records.md`。
这些文件仍在 git 历史中，可 `git show 39bbf28 --stat` 找回。根 `README.md` 尚未更新，仍写着 MFAST 简介。

## 体积（关键约束，2026-09-18 实测）
| 项 | 大小 |
| --- | --- |
| `docs/` | **247.6 MB / 746 文件**（其中 PDF/PPTX/DOCX 170 个 = 219.5 MB，占 89%；图片仅 4.3 MB / 35 个） |
| `WebBlog/dist/` | 约 1 MB（139 个页面） |
| `.git/` | 356.8 MB（历史大文件不可回收，删文件不减仓库） |
| `CodeKey/` | 17.1 MB / 65 个文件 |
| `WebSite/` | 0.6 MB |

⚠️ 早前记录的 `docs/` = 415.5 MB 是删除行动**之前**的旧值，已过时。
**体积大头是 PDF 附件，不是图片** —— 所以「图片走云存储」几乎无收益，
「附件外置」才是重点。

## 平台事实（已实测）
- jsDelivr 当前**正常服务**本仓库：`docs/css/custom.css`、`docs/images/logo.png`、`docs/js/search.js` 均 200。
  官方限制：单文件 >20 MB 不加速、包 >50 MB 不支持 —— 大文件勿放被 CDN 引用的目录。
- GitHub：单文件 >100 MB 直接拒绝；仓库建议 <1 GB。当前最大单文件 81.46 MB，已很接近。
- GitHub Pages：**一个仓库只能发布 1 个站点**（分支目录或 Actions 产物其一），且只能绑 1 个自定义域名。

## 文档落点约定
| 文件 | 内容 |
| --- | --- |
| `README.md` | 根总览：定位 / 两站点 / 工作区导航表 / 部署 / 联系 / 历史 |
| `docs/ABOUT.md` | docs 工作区说明 —— **不能叫 README.md**，该名被 docsify 占用为站点首页 |
| `WebSite/README.md`、`CodeKey/README.md`、`scripts/README.md`、`LICENSES/README.md`、`.github/README.md` | 各工作区说明 |

注意：`WebBlog/docs/README.md`、`WebBlog/sponsor/README.md`、`WebBlog/docs/project/README.md`、
`WebBlog/docs/NoteBook/Python/README.md`、`scripts/report_ip/README.md` 是**站点内容/子说明**，不是工作区 README。

## 待处理风险（尚未修复）
- **凭据泄漏**：`scripts/report_ip/autoemail.py` 含明文 SMTP 授权码、`scripts/test.sh` 含明文 WiFi 密码，
  均已在 git 历史 → 需轮换凭据。**改文件无效。**
- `git` 不跟踪空目录：`CodeKey/AI 日报/`、`WebSite/icon/{digital,net,others}` 克隆后不存在。
- WebSite 图标 404 根因：`create.js` 按分类中文名拼路径，与 `main.js` 数据不匹配。
- 考研/港股第三方资料仍公开在仓库；git 历史体积未清理。
- **`WebBlog/docs/Linux/Linux应用编程/` 内容重复（2026-09-18 实测）**：该目录 5 个文件里只有
  `Linux系统简介.md` 是原创。`Linux基本工具.md` ≡ `Linux驱动调试相关/Linux使用adb抓取Android日志.md`；
  `Linux系统管理.md` ≡ `Linux网络编程.md` ≡ `Linux进程与线程.md`
  ≡ `Linux驱动调试相关/Linux访问PHY芯片寄存器.md`。
  全库共 **2 组完全重复 / 6 个文件**。历史遗留（复制后忘替换内容），**未擅自处理**。
  影响新博客列表出现重复标题；可加 `draft: true` 先隐藏，或确认后删除。
- **docsify 机制已于 2026-09-18 全部删除**（105 文件 / 14.19 MB）：
  原先发现的那批问题（`blog/LVGL/_sidebar.md` 与 `blog/Python/_sidebar.md` 挂错成
  Android 链接、`blog/NoteBook/Python/` 下 13+ 条 `Python/...` 前缀断链、
  `prismjs` 重复引入 4 次、`docs/plugin/` 备好自托管资源却全走外网 CDN）
  **随文件一起消失，无需再修**。同批删除的还有 `sponsor/src/`（2.28 MB artitalk/jquery）。
- **`docs/FreeBorders.md` 是孤儿文章**：一篇原创的 Clash 客户端用法（3824 字符），
  因为放在 `docs/` 根而不是 `docs/blog/` 下，内容源读不到它。
  未删除也未搬动（搬进 `docs/ToolBox/` 属编辑决策），待用户确认。
- `docs/images/` 里仍有约 1 MB 只服务旧站点的图（`2233.gif` 角标、
  `avatar_fuki/koko.jpeg` 聊天头像、`cute_01.gif` 复制弹窗配图），未删。
- 文章 URL 与旧 docsify 的 hash 地址不同；`/#/blog/...` 形式已加重定向脚本，
  但 `/blog/xxx.md` 这类直接指向原始文件的地址会 404（`docs/` 已不发布）。

## 部署拓扑（2026-09-18 实测）
- **正式目标：GitHub Pages**。域名 `shilong.js.org` 由它提供
  （响应头 `server: cloudflare` + `x-github-request-id` + `via: varnish`）。
  推送 `868723d` 后 Actions 运行 `#3` **success**，线上 HTML 与本地构建产物
  **字节数一致（13078）**，新站已生效。
  Actions 编号可在 `https://api.github.com/repos/EchoHeim/Astapb/actions/runs` 查（仓库公开，无需 token）。
- **另有一个 Vercel 项目 `astapb`（账号 `echoheim-projects`）**，
  连接了同一个仓库并在每次 push 时自动构建，**当前持续失败**：
  项目设置里 Node.js Version 写死为 `16.x`，Vercel 已停止支持 →
  报 `Found invalid or discontinued Node.js Version: '16.x'`，23 秒即失败。
  仓库里**没有 `vercel.json`**，说明是在 Vercel 网页后台配置的，
  与 Astro 迁移无关，是历史遗留的第二个部署目标。
  待用户决定：删除该项目（推荐，避免重复内容与失败通知），
  或修好它当预览环境（Settings → Node.js Version 改 22.x，
  并把 Root Directory 指向 `WebBlog`、Output 设为 `dist`）。

## 写文章的约定（2026-09-18 起）
`WebBlog/docs/**` 下的文章由新博客站点消费，**新增文章会自动同步**：

- 往 `WebBlog/docs/<分类>/` 丢 `.md` → commit → push，站点自动更新。
- **不写 frontmatter 也能发**：`WebBlog/scripts/sync-content.mjs` 挂在 npm 的
  `prebuild` / `predev` 上，会自动补 title（首个标题行）、date（git 首次提交时间，
  浅克隆时回退文件时间）、tags（按目录推断）、summary（首段）。
- 手写 frontmatter 时：
```yaml
---
title: 文章标题
date: 2026-09-18
tags: [Linux, Linux 小技巧]   # 第一项当一级分类，其余为细分标签
summary: 一句话摘要             # 用于列表、RSS 与 SEO description
draft: false                  # 设 true 则不出现在列表/标签/RSS
---
```
- **不要在文章里用相对路径引用图片** —— 文件不存在会让构建直接失败。
  `npm run check` 能提前体检出来（它会剔除代码块，所以语法示例不会误报）。
- **更不要把 GitHub 附件当图床**（`github.com/<owner>/<repo>/assets/<id>/<uuid>`
  或 `user-images.githubusercontent.com/...`）：这类地址的可用性取决于源仓库的
  可访问性，仓库一改权限或删除，文章配图会立即全部 404，且无法通过改 URL 救回。
  `FPGA/verilog.md` 的 22 张图就是这么丢的（源仓库 `EchoHeim/KQ-Glue` 匿名 404）。
  图片应放进仓库或独立资源仓库（jsDelivr 分发）。
- 标签 slug 由 `WebBlog/src/utils/tags.ts` 生成，**标签名不能含 `/`**（`C/C++` 有专门映射）。

## 约定
- 中文目录/文件名 → 建议 `git config core.quotepath false`。
- `.gitignore` 已加 `.workbuddy/_*`，避免本地扫描临时文件被误提交（`.workbuddy/memory/` 仍需跟踪）。
- **许可分层（根 LICENSE 为总览，区域 LICENSE 优先）**：
  | 区域 | 许可证 |
  | --- | --- |
  | `scripts/`、`.github/`、站点代码 | MIT（`LICENSES/MIT.txt`） |
  | `docs/**/*.md`、原创图片 | CC BY-NC-SA 4.0（`LICENSES/CC-BY-NC-SA-4.0.md`） |
  | `CodeKey/` | 保留所有权利 |
  | `WebSite/icon|header|search/` | 第三方商标，仅作链接索引 |
  | `WebBlog/docs/尚德机构-考研/`、`港股打新/` | 第三方资料，未授权，不适用任何开放许可 |
  GPL-3.0 已废弃（原属已删除的 mfast 工具链，其历史不受影响）。
- 部署/许可相关文件改动后，仍需用户在 GitHub 侧手动切换 Pages Source 与完成 `git push`。
