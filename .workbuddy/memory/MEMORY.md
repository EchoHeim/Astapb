# Astapb 项目长期备忘

## 定位
个人知识分享库：`WebBlog/` = Astro 博客（文章源 `docs/` + 代码，根路径 `/`）；`WebSite/` = 导航站（Vite+TS，`/aa/`）；`CodeKey/` = 公众号「程序小猴」素材（63 张表情包 + AI日报，运营方案在 `运营方案/`）；`scripts/` = 小工具。

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

## 公众号「程序小猴」
素材库 `CodeKey/`，结构 01-IP形象/02-封面模板/03-正文插图/**04-选题与文案库（唯一复利资产）**/05-栏目素材/06-运营方案/**07-发布登记（发文前跑 check-publish.mjs 查重）**。
**★ 板块架构（26-09-21 定案，写在 `选题池.md` 顶部）：只跑 2 个板块 —— 主力「实用软件分享」（群发，吃大部分产能）+ 维持「AI 日报」（只发布不群发）；储备「技术干货」**（分界：具体问题实操文如树莓派扩容/udev/Samba 属主力，纯知识体系类才归储备）。
已否决：**历史人物志、音乐演唱会现场、小说读后感悟随笔**——核心机制是**搜一搜「账号权威度」（约占排序 25%）含内容垂直度，跨领域会让每个领域排名都上不去**。兴趣走「**交叉不要平行**」：历史人物→「用 Obsidian 建三国人物关系图谱」；音乐现场→「Audacity 降噪实测 / ffmpeg 剪辑」；小说随笔→「Calibre 管理电子书」。演出/历史/随笔改由**视频号「小猴随心记」**承接。
**★ 账号定性（26-09-21，30 天全量数据）：这是一条「搜索型账号」，不是推送型。全站阅读 69.6% 来自搜一搜，粉丝推送仅 11.9%；227 粉 × 打开率 0.44% ≈ 每篇推送只换 1 个阅读。**
→ 因此选题第一标准是「有人会去搜吗」（无搜索需求的内容天花板＝打开率），而不是「今天什么热」。方案见 `06-运营方案/运营方案_v2_搜索优先_2026-09-21.html`（结论以 v2 为准，旧的两份 HTML 已被覆盖）。
实测（22 条）：工具实测 7 篇=378 阅读（83%，篇均54，完成率57~75%）；AI日报 13 篇=68 阅读（15%，篇均5.2，完成率25~33%）→ 产能产出倒挂。
**发布轨道已解耦（26-09-21 决定）：工具实测=群发（决定量级）；AI日报=每周5~6篇但「只发布不群发」（不占群发位，只剩搜一搜一个入口）→ 日报标题必须去掉「AI日报｜X月X日：」前缀占位、把可搜实体前置。** 该玩法属假设，需先做 7 天小规模验证（看阅读来源有无「搜一搜」）。
爆款＝图吧工具箱 WinUI3 v1.6.1（259，占全站44%）；带版本号的标题赢 63 倍。2020/2022 的老文仍在吃搜索流量。
**数据口径：回填窗口是 7 天，不是 24 小时**（工具文 24h 后还能涨 3 倍以上，日报 24h 定型）——`往期数据表说明.md` 已改。
**平台规则要点（26-09-21 核实，操作细节都记在 `固定模块.md` 九~十一节）：**
- **合集创建 ≠ 主页显示**，必须去 `合集页 → 账号主页合集配置 → 编辑 → 勾选`，否则主页一个合集都不显示；只能电脑端操作，最多挂 10 个（建议 3~4）；建议开「连续阅读」。
- **原创声明影响搜一搜权重**（官方：内容相同时优先展示原创）——但本号主页只显示 56 篇原创 vs 177 篇已发表，只有 1/3 开了声明，属纯损失。
- **后台「数据分析 → 搜索分析」能看 TOP 查询词 + 曝光 + 点击 + 排名**，是唯一能直接看到「读者搜什么、我排第几」的地方；**优先优化排名 5~15 的潜力词**（改旧文标题/补段落），性价比高于新写。
- 摘要留空会被系统随机截取、核心词易断 → 摘要必须手填；标题核心词放前半段、总长 22~26 字内。
表情包**已上架微信表情开放平台**（26-09-21），下一步是双向导流 + 下载/发送量台账；日报「小猴点评」是护城河，属二次创作需留来源声明。

## 待处理风险
- **凭据泄漏（必须轮换，改文件无效）**：`scripts/report_ip/autoemail.py` SMTP 授权码、`scripts/test.sh` WiFi 密码，均已进 git 历史。
- `Linux/Linux应用编程/` 下 2 组完全重复文件（6 个），历史遗留，未擅自处理。
- `WebBlog/FreeBorders.md` 孤儿文章待确认去向；第三方资料（考研/港股）仍公开；`.git/` 约 357 MB 未清理；旧 docsify 遗留图约 1 MB 未删。
- `/blog/xxx.md` 直链 404（`/#/blog/...` 已有重定向）。

## 许可
scripts/.github/站点代码 = MIT；`docs/**/*.md` + 原创图 = CC BY-NC-SA 4.0；CodeKey = 保留所有权利；icon/header = 第三方商标仅作索引。GPL-3.0 已废弃。

## 环境坑
本机 bash 无 coreutils（`ls/mkdir/dirname` 不可用），PowerShell 工具不回显 stdout → **文件操作与读输出一律走 node**；`git config core.quotepath false`；无头 Chrome 截图路径见 skill `local-html-visual-verify`。
