# 项目长期约定 · astapb-nav（网址导航站）

## 结构与分层
- `src/data/` 纯数据（分类/站点/搜索引擎/类型），改内容只动这里。
- `src/lib/` 一文件一件事；新增能力开新文件，不要塞进 `main.ts`。
- `src/styles/` 五层，级联顺序即依赖顺序：`tokens → base → layout → components → responsive`，新增样式要同步改 `main.ts` 的 import 顺序。
- `main.ts` 只做装配（挂载、事件接线、首屏渲染）。
- 字号基准 `html{font-size:14px}`，全站 rem，**别动**。辅助文字不低于 `0.75rem`。

## 布局机制（改前必读，试过三版）
- 搜索区顶部整宽居中，桌面 `position:sticky` 吸顶，≤650px 放开为静态流。
- 网格 `repeat(auto-fill, var(--col-w))` + `justify-content:center` + `gap`。列宽只改 `--col-w`，**不要给 `.item` 加 margin**（会吃进轨道），列间距一律用 `gap`。
- 吸顶高度不写死：`lib/header.ts` 的 `observeHeaderHeight()` 量出来写 `--header-h`，让位（`scroll-margin-top`、滚动高亮判定线）都读它。
- `.item` 高度公式（`12rem + var(--row-h) × visible`）就是折叠机制，依赖「一条一行」，所以 `.site-name` 必须单行 + 省略号。
- 折叠条数数据驱动：改 `src/data/categories.ts` 的 `visible` 即可（2026-10-01 全站 6→8，卡片 355→459px）。链条：`visible` → `render.ts` 写 `--visible` → `components.css` 算高 + 第 N 条打 `.clamp-end`。**不要**去改 `--col-w` / `--row-h`。
- 条目 >15 条的起第二列：`.item-pair{grid-column:span 2}` 内并排两个 `.item`（各 13rem）。
  - 主列 = `h2` + `.recommend` + 第 1–15 条（`COLUMN_SPLIT`）；续列 `cont-<id>` 头部结构与主列相同，主链接用第 16 条（不再进列表），列表从第 17 条起。
  - 折叠仍是每列各 8 条，靠 `height` + `overflow:hidden` 裁，条目不从 DOM 砍；`.item.change` 只放开 overflow。
  - `.recommend p` 必须单行，`.site-name` 同理 —— 折行会让两列起点错开。
  - 不能拆成两个独立网格项（主列落行尾会把续列挤下一行，差 477px）；不用 `dense`。
  - 续列 id 不能叫 `cat-xxx-cont`：`anchors.ts` 用 `.item[id^="cat-"]` 认分类会数成 24 个。
  - ≤325px 退单列只剩「包裹层 display:block」一条规则；过滤态不拆列。
  - 副作用：16–20 条的分类（新闻 16/数码 19/编程 20）续列只有 0/3/4 条列表，lodge 已知未要求改，嫌空就调 `COLUMN_SPLIT`。
  - 废弃方案：「卡片跨两列 + 内部 `columns:2`」（拉宽 + 依赖 dense 打乱顺序 + Chrome 列平衡坑）。

## 主题
- 键名读 `<html data-theme-key>`，默认 `nav-theme`（与博客 BaseLayout 一致）。首帧颜色由 `index.html` 内联同步脚本决定。
- 两套主题变量必须对称完整（`--border` 曾在深色缺失导致静默失效）。决定根元素外观的变量不要在深色块里改根背景，基础规则写 `background-color:var(--bg)` 即可。

## 数据与内容
- 站点 = 原有 97 + aa 补录 162 + 手工 43 = 302，减 6 个失效站、再把 3 个提成推荐位 → **2026-11-16 实测 293**。数字别手写：meta 由 `vite.config.ts` 构建期注入，README 由 `npm run check` 校验。
- `TOTAL_SITES` 只统计 `sites`，推荐位不计；同一站点被提成推荐位后不要再留在 `sites`（现有五个：天天基金网、Cemu、吾爱破解、iconfont、天眼查）。
- **推荐位按「这一格最该被点的是谁」选，不按「谁的 logo 好拿」选**（旧版四个分类的推荐位都是 Linux 企鹅，就是被素材绑架的结果）。
- **搜索是三层匹配**：`Category.aliases`（整格命中，仅单字词）/ 站名 / 主机名 + `Site.tags`。新增站点**要写 tags**（英文名、常用叫法、类别词），否则「电子书」「下载」这类意图搜不到。
- **原有条目一律不改**，新增追加到各分类末尾并带分隔注释 `// ---- 以下为 aa 补录 ----` / `// ---- 以下为手工补录 ----`。
- 后建分类（电影/应用/搜索/财经/软件/Git收藏）排在最后，原有 17 个分类顺序位置不动。
- 分类按站点**性质**放，不按批次放。判据：教程参考→知识，科技资讯→数码，可直接用的工具→工具，桌面软件→软件。拿不准按性质放并在回复里点明，lodge 会直接采纳。
- aa 原站已下线，补录来自 Common Crawl `CC-MAIN-2019-18`（2019-04-22）快照，取证/去重/跳过清单见 `docs/aa-import.md`，再补录先读它。
- 图标：有 76 / 首字母兜底 226，缺图很常见且可接受，**不要拿别家 Logo 凑**。`icon/` 现有图标都是 100×100，小图用 Pillow LANCZOS 上采样。`header/` 18 个。
- 取图标优先级：站点 `<link rel="icon">` → GitHub 组织头像 `github.com/<org>.png?size=200` → 只有 JPG 时用无头 Chrome 光栅化成 PNG。`/apple-touch-icon.png` 常返回 HTML 404 页，要验 magic bytes。
- ICO 用 Pillow：`im.size = max(im.ico.sizes())`。venv `C:\Users\Lodge\.workbuddy\binaries\python\envs\default\Scripts\python.exe` 已装 Pillow 12.3.0。
- 判站点存活别只看状态码：403/405/202 多为反爬；真要判定看 DNS + TLS + 最新 CC 快照。**别把 HTTP 客户端失败当站点挂了**（waitsun 对 urllib 无限重定向，真 Chrome 正常）。

## 构建与命令
- 图标键 = 文件名去扩展名，区分大小写，写错**构建失败**（`scripts/verify-icons.mjs`，刻意如此）。闲置图标不进产物。
- `npm run dev` → `http://localhost:5173/aa/`（**必须带 `/aa/`**）；`preview` → 4173/aa/；`check` 只验图标；`build` = 校验 → `tsc --noEmit` → `vite build`。

## 已知待办（`docs/design-review.md`，2026-09-21）
1. 图标 2.13 MB 占产物 96% —— 现已降到 dist 总计 863K，此项可关闭
2. ~~折叠卡片键盘无法展开、被裁 `li` 仍在 tab 序~~ → 2026-11-16 已修：`.more` 按钮 + `inert`
3. ~~`dom.ts` `highlight()` 多词不高亮~~ → 2026-11-16 已修：按 token 匹配、合并重叠区间
4. `theme-color` 未随手动主题切换
5. `engines.ts` Google 图片 query 缺 `&tbm=isch`
6. 无 `.github/`，但 README 与 vite.config 引用
7. 卡片等高 459px → 不足 8 条的分类底部空转；新闻 16 条拆列后续列是「0 条列表」的空卡（`COLUMN_SPLIT`）
8. 书籍推荐位仍是淘宝图标配 Z-library

## 本机环境坑
- `bash` 工具缺 coreutils（ls/grep/head 都没有），改用 PowerShell 工具；**它不回显 stdout**，要读输出重定向到文件再 Read。
- `node_modules` 可能不存在（`tsc` 报「不是内部或外部命令」）；之后用 `./node_modules/.bin/*` 直调。
- `http_proxy`/`HTTP_PROXY` 会劫持 localhost（curl 回 **502**）：curl 加 `--noproxy '*'`，Chrome 加 `--proxy-server=direct:// --proxy-bypass-list=*` 并清空子进程 env 里的代理变量。
- 后台起的静态服务会跨命令消失：验证页面把「起服务→拉 Chrome→量→关」写在同一个 node 进程里。
- 自建静态服务**不要给所有 404 兜底 index.html**（模块脚本拿到 `text/html` 会白屏且几乎无报错）；只有无扩展名路径回退。dist 引用带 `/aa/` 前缀要剥掉。
- 一次性 node 脚本必须 `.cjs`（`package.json` 有 `"type":"module"`，`.js` 写 require 会静默失败）。
- `vite preview` 有 SPA 回退，不存在的路径返 `index.html`：注入式验证前先确认那个 html 真写出来了。后台 preview 进程会跨会话消失，截图前先 ping 4173。
- `npm run build` 偶发 exit 1（停在 `modules transformed` 后），隔会儿重跑即可，**不要改代码**。
- 注入脚本放 `</body>` 前且 `type="module"`，才保证跑在渲染之后。
- 无头 Chrome `--window-size` 最小约 500px，验移动端走 CDP `Emulation.setDeviceMetricsOverride`。
- 删大批碎文件先 `renameSync` 聚拢再 `robocopy /MIR`，放后台跑（前台 120s 超时会打断且丢输出）。

## 静态页面视觉验证
用仓库里的 `local-html-visual-verify` 技能，先加载再动手。要点：HTML 要 `cp` 到截图脚本同目录（否则 `ERR_FILE_NOT_FOUND` 但退出码仍 0）；每个任务换 `--user-data-dir`（复用会让 `--screenshot` 静默失效）；长内容用 CDP `captureScreenshot` + `captureBeyondViewport` + `clip`；验主题用 `setAttribute('data-theme')` 比 `--force-prefers-color-scheme` 可靠；验窄屏同时看 `documentElement.scrollWidth === clientWidth`；**截图必须自己 Read 看一眼**（半应用主题在日志里毫无异常）。

## 仓库边界
git 根是 `D:\Personal\Astapb`（含 `WebSite`/`WebBlog`/`CodeKey`）。在 WebSite 里跑 git 会看到兄弟项目文件，改文件或 .gitignore 前先确认作用域。根级 `.gitignore` 忽略 `.workbuddy/_*` 与 `_review/`，但 **`.workbuddy/memory/` 要留档**（`WebSite/.gitignore` 已是 `.workbuddy/*` + `!.workbuddy/memory/`）。仓库根在会话工作区外，删除那里的文件会被 safe-delete 拦下。
