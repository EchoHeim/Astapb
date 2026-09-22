# Astapb 项目长期备忘（仓库级）

> **2026-09-22 起分家**：本文件只放**整个仓库共有**的东西（定位、部署、导航站、CodeKey、许可、风险、环境坑）。
> 博客专属的约定（Astro 坑、内容目录、写文章、AI 简报、前端）在
> `WebBlog/.workbuddy/memory/MEMORY.md`；日志同理，博客的事写 `WebBlog/.workbuddy/memory/YYYY-MM-DD.md`。

## 定位
`WebBlog/` = Astro 博客（内容源 `docs/`，根路径 `/`）；`WebSite/` = 导航站（Vite+TS，`/aa/`）；`CodeKey/` = 公众号「程序小猴」资产库；`scripts/` = 小工具。

## 部署
GitHub Pages，域名 `shilong.js.org`。`publish.yml` 构建单一产物：`WebBlog/dist/.`→根 + `WebSite/dist/.`→`/aa/`，Node 22。前提 **Settings→Pages→Source = "GitHub Actions"**。
`paths-ignore` 只逐个忽略 `CodeKey/01-IP形象/**`…`07-发布登记/**` 等素材目录 —— **不能写 `CodeKey/**`**，否则新丢进 `AI 日报/` 的稿子不触发部署（目录级匹配必须带 `/**`）。
各站点的构建细节见其工作区记忆。

## 导航站 WebSite
- 零 UI 框架。图标池 `src/lib/icons.ts` 用 `import.meta.glob('/icon/**/*.png')`，key=文件名；**别改回按分类中文名拼路径**（曾 24/97 静默 404）。缺图标→首字母色块兜底，**不许用别家 logo 顶替**。
- `scripts/verify-icons.mjs`（prebuild）坏图标 exit 1。`scripts/normalize-icon*.py` 把 `icon/`、`header/`、`search/` 的 logo 归一化为 256×256 圆形色板，改前备份到 `.workbuddy/_backup/original-icons/`。
- 主题契约 `data-theme` + `data-theme-key="nav-theme"` + 内联防闪脚本；`tokens.css` dark 值是旧站原始值，**改它就是改视觉保真**。锚点高亮用整行。

## 公众号「程序小猴」
`CodeKey/` 结构：01-IP形象/02-封面模板/03-正文插图/**04-选题与文案库（唯一复利资产）**/05-栏目素材/06-运营方案/**07-发布登记**。
**规则不凭记忆：后台操作与文案看 `固定模块.md`（九~十一节）；板块架构与选题标准看 `选题池.md` 顶部。**
- **★ 账号定性（26-09-21，30 天全量）：这是「搜索型账号」不是推送型——全站阅读 69.6% 来自搜一搜，粉丝推送仅 11.9%；227 粉 × 打开率 0.44% ≈ 每篇推送只换 1 个阅读。** 选题第一标准＝「有人会去搜吗」。
- **只跑 2 个板块**：主力「实用软件分享」（群发）＋「AI 日报」（**只发布不群发**）；技术干货为储备（具体问题实操文归主力，纯知识体系类才归储备）。已否决历史人物志/音乐现场/小说随笔（跨领域稀释垂直度）；兴趣改「交叉不平行」，演出等转视频号。
- 实测 22 条：工具实测篇均 54 阅读/完成率 57~75%；日报篇均 5.2/25~33%。爆款＝图吧工具箱 WinUI3 v1.6.1（259，占全站 44%），**带版本号标题赢 63 倍**。
- 日报排版＝**摸鱼绿**（gzh-design）；标题去「AI日报｜X月X日：」前缀、实体前置、22~26 字；骨架见 `AI 日报/AI日报_9月21日.md`。**日报润色固定产出三样：① 只含正文的 `_正文.md` ② 一句话总结 ③ 3~5 个话题标签**，完整规范在 `固定模块.md` 〇节。
- **数据回填窗口 7 天不是 24 小时**。日报「小猴点评」是护城河，属二次创作需留来源声明。方案以 `运营方案_v2_搜索优先_2026-09-21.html` 为准。
- 发布前必跑 `07-发布登记/check-publish.mjs`；靠**主题标识**（`ai-daily-YYYYMMDD` / `tool-<名>`）查重，不靠标题。

## 待处理风险
- **凭据泄漏（必须轮换，改文件无效）**：`scripts/report_ip/autoemail.py` SMTP 授权码、`scripts/test.sh` WiFi 密码，均已进 git 历史。
- 考研/港股第三方资料仍公开托管（侵权风险）；`.git/` 约 357 MB 未清理（**删文件不减体积**，要瘦身只能 `git filter-repo` 重写历史）。

## 许可
站点代码/`.github` = MIT；`WebBlog/docs/**/*.md` 与原创图 = CC BY-NC-SA 4.0；`CodeKey/` = 保留所有权利；`WebSite/icon|header|search/` = 第三方商标仅作索引。

## 环境坑
本机 bash 无 coreutils **且无 `grep`/`cat`**，管道过滤一律 `command not found`；PowerShell 不回显 stdout，重定向还会把 UTF-8 按 GBK 解码 → **文件操作与读输出一律走 node 写文件 + Read 工具**；命令行里写正则会**被 shell 吃掉反斜杠**，一律写成 `.mjs` 文件再跑。`git config core.quotepath false`；无头 Chrome 截图见 skill `local-html-visual-verify`。
