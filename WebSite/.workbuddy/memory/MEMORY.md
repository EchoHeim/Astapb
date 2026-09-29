# 项目长期约定 · astapb-nav（网站导航站）

## 目录职责
- `src/data/` — 纯数据（分类、站点、搜索引擎、类型）。改内容只动这里。
- `src/lib/` — 能力模块，一个文件一件事。新增能力就新增文件，不要塞进 `main.ts`。
- `src/styles/` — 五层，级联顺序即依赖顺序：`tokens → base → layout → components → responsive`。
  新增样式文件要同步改 `main.ts` 的 import 顺序。
- `main.ts` 只做装配（挂载点、事件接线、首屏渲染），不含业务逻辑。

## 布局约定（2026-09-21 起）
- 搜索区在**顶部整宽居中**，桌面端 `position: sticky` 吸顶，≤650px 放开为静态流。
- 分类网格用 **CSS Grid 固定列宽**：`repeat(auto-fill, var(--col-w))` + `justify-content: center` + `gap`。
  - 列宽只通过 `--col-w`（tokens.css）调整，断点在 responsive.css 覆盖。
  - **不要给 `.item` 加 `margin`** —— 会吃进固定轨道，实际宽度就不等于 `--col-w` 了。列间距一律用 `gap`。
- 吸顶区高度**不要写死**：用 `lib/header.ts` 的 `observeHeaderHeight()` 量出来写进 `--header-h`。
  凡是要为吸顶区让位的地方（`scroll-margin-top`、滚动高亮判定线）都读它。
- `.item` 的高度是折叠机制本身（`12rem + var(--row-h) × visible`），依赖「一条占一行」。
  所以 `.site-name` 必须保持单行 + 省略号，**不能改成允许换行**。

## 主题约定
- 主题键名从 `<html data-theme-key>` 读，默认 `nav-theme`，与博客的 BaseLayout 保持一致。
- 首帧颜色由 `index.html` 的内联**同步**脚本决定（模块脚本来不及，会闪一下）。
- 两套主题的变量必须对称完整。新增变量时**两边都要给** ——
  `--border` 就是只在浅色里定义过，让深色下的 border 声明静默失效了很久。

## 资源与构建约定
- 图标键 = 文件名去扩展名，区分大小写。键写错**构建会失败**（`scripts/verify-icons.mjs`），
  这是刻意的：旧版静默 404 太多次了。
- 闲置图标不进产物（Vite 按引用打包），往 `icon/` 丢暂时不用的图是安全的。
- 字号基准是 `html { font-size: 14px }`，全站 rem。改它会动到所有间距，别动。
- 可读下限：辅助文字不要低于 `0.75rem`（10.5px）。

## 内容来源与数据规模（2026-09-22 起）
- 站点数据 = 原有 97 条 + aa 补录 162 条 + 手工补充 42 条 = **23 个分类 / 301 条**。
- **`TOTAL_SITES` 只统计各分类的 `sites`**，「推荐位」不计入。所以一个站点被放成
  推荐位后就不该在 `sites` 里再出现（否则同分类内重复）—— 目前这种情况有两个：
  财经的推荐位天天基金网、Git收藏的推荐位 Cemu。
- aa 原站已**整站下线**。补录数据来自 **Common Crawl `CC-MAIN-2019-18`（2019-04-22）快照**，
  取证方式、去重规则、跳过清单都在 `docs/aa-import.md` —— 再要补录先读它，别重新摸索。
- **原有条目一律不改**：后加条目追加在各分类 `sites` 末尾，并带分隔注释 ——
  `// ---- 以下为 aa 补录 ----` 与 `// ---- 以下为手工补录 ----`。以后改数据保持这条分界。
- 后建的分类（`电影` / `应用` / `搜索` / `财经` / `软件` / `Git收藏`）都排在锚点最后，
  **原有 17 个分类的顺序与位置一律不动**。
- **分类要按站点性质放，不能按"哪一批一起给的"放**。有过 10 个站点一起进「论坛」，
  其中 7 个其实是博客/资讯/教材/软件站，后来才拆到「知识 / 数码 / 工具」；
  树莓派给的官网地址也不该进「论坛」（要进也该用 `forums.raspberrypi.com`），
  已移到「数码」；异次元软件世界是软件站、不该在「数码」，已移到「软件」。
  拿不准时按「教程参考 → 知识，科技资讯 → 数码，可直接用的工具/软件 → 工具，
  桌面软件 → 软件」判。
- **用户偏好**：把站点给出时附带的类别只是"初步意向"，他很在意分类是否名副其实；
  拿不准就按性质放 + 在回复里点明，他会直接采纳（这三次都是这么处理的）。
- 新增条目大多没有图标（有图标 75 / 首字母兜底 226）。图标池里剩下的是别家 Logo，
  **不要为了填满而套用**。补图标 = 往 `icon/` 丢文件 + 在数据里填键名。
- `header/` 现在是 18 个，新增 `appstore.png`(180²)、`doubanmovie.png`(100²)、
  `google.png`(100²)、`tiantianjijin.png`(256²)、`xiaozhongruanjian.png`(192²)、
  `cemu.png`(200²)。
- 新分类的推荐位图标来源，按优先级：
  1. 站点 HTML 里的 `<link rel="icon">` —— 页面自己声明的那张往往最清晰
     （天天基金网就是 256×256 的 PNG）；
  2. **GitHub 组织头像就是项目标志**：`https://github.com/<org>.png?size=200`
     返回 200×200 的方形 PNG（Cemu 那张就是这么来的）；
  3. 只有 JPG 时用无头 Chrome 光栅化成 PNG（见下条）。
  另外很多站点的 `/apple-touch-icon.png` 实际返回的是 HTML 404 页，
  **要验 magic bytes**，不能只看 HTTP 200。
- **只有 JPG 图标时，用无头 Chrome 光栅化成 PNG**：写一张只放该图的极小页面
  （`html,body{margin:0}` + 图片按原尺寸），再让 `cdp-shot.mjs` 以原始像素尺寸截一张
  —— 比手写 JPEG 解码器省事得多。小众软件那张 192×192 就是这么来的。
- 判定一个站点是否还活着，**不要只看 HTTP 状态码**：`403`/`405`/`202` 都是反爬或
  Cloudflare 挑战（站是活的），而 TLS 握手失败 + 主域无解析 + 最新 Common Crawl
  快照返回 404 才是真失效（`www.qcgzxw.cn` 就是后者）。查失败原因时先跑
  DNS/证书探测，再看 CC 最新索引，比猜可靠。
- **别把"我的 HTTP 客户端失败"当成"站点挂了"**：`waitsun.com` 对 urllib 会无限
  重定向（每次追加一层 `/ccp/`），但真实 Chrome 打开完全正常。拿不准时用
  `chrome --headless=new --dump-dom <url>` 过一遍真浏览器再下结论。

## 命令
- `npm run dev` → `http://localhost:5173/aa/`（**必须带 `/aa/`**，根路径 404）
- `npm run preview` → `http://localhost:4173/aa/`（需先 build）
- `npm run check` → 只跑图标校验
- `npm run build` → 校验 → `tsc --noEmit` → `vite build`

## 已知待办（来自 2026-09-21 设计评审，`docs/design-review.md`）
1. **图标 2.13 MB 占产物 96%**：75 张 256×256 PNG 实际只以 28px 渲染，应转 64px WebP
2. 折叠卡片键盘无法展开（只绑了 `mouseenter`），且被裁的 `li` 仍在 tab 序里
3. `dom.ts` 的 `highlight()` 把整串当单一 needle，多词搜索不出高亮
4. `theme-color` meta 未随手动主题切换
5. `engines.ts` 的 Google 图片 query 缺 `&tbm=isch`
6. 仓库里没有 `.github/`，但 README 与 vite.config 都引用了它

## 本机环境坑
- **`bash` 工具不可用**（缺 `ls` / `dirname` / `grep` / `head` 等 coreutils），改用 PowerShell 工具
- **PowerShell 工具不回显 stdout**，要读输出必须重定向到文件再用 Read
- **一次性 node 脚本要用 `.cjs` 后缀**：本项目 `package.json` 里有 `"type": "module"`，
  放 `.js` 会被当 ESM 解析，写 `require` 直接 `ReferenceError` 静默失败（脚本没跑，
  后续步骤却照常执行，很容易误判）。
- **`vite preview` 有 SPA 回退**：请求 dist 下不存在的路径会返回 `index.html` 而不是 404。
  所以"注入脚本的测试页"没生成时，页面看起来完全正常，会误判成注入生效 ——
  用注入的方式验证交互态时，**先确认那个 html 文件真的写出来了**。
- **`vite preview` 的后台进程会在会话之间消失**：截图前先 ping 一下
  `http://localhost:4173/aa/`，挂了就重启。否则无头 Chrome 截到的是
  `ERR_CONNECTION_REFUSED` 错误页，看图时容易误判成"页面样式崩了"。
- **`npm run build` 偶发 exit 1**：输出停在 `✓ N modules transformed` 之后就没了。
  隔一会儿重跑一次即通过（像是 outDir 清理时的文件锁竞态）。
  **不要据此判断代码有错、更不要去改代码。**
- 注入脚本要放在 `</body>` 前且用 `type="module"`：应用脚本是 `<head>` 里的
  `type="module"`（defer），两者同为 defer 时按文档顺序执行，放后面才保证跑在渲染之后。
- **仓库根目录（`D:\Personal\Astapb`）在会话工作区之外**，删除那里的文件会被
  safe-delete 拦下（`SAFE_DELETE_FAIL_CLOSED`）；`WebSite/` 内的删除正常。
  往仓库根写临时文件要慎重。
- 无头 Chrome 的 `--window-size` 有约 500px 最小宽度，验移动端必须走 CDP `Emulation.setDeviceMetricsOverride`
- **删大批碎文件先 rename 再 robocopy**。Chrome `--user-data-dir` 这类几万文件的目录，
  `fs.rmSync` 实测约 2 分钟/目录；同批文件 `renameSync` 只要 0.1s。
  做法：先 rename 聚拢到单个 `_trash/`（项目立刻干净），再
  `robocopy <空目录> <_trash> /MIR` 批量删，并**放后台执行**
  （前台约 120s 超时会打断，且 node 输出到文件是缓冲的，中断即丢输出，
  表现为「无输出 + 退出码 1」，极易误判成脚本报错）

## 仓库边界（重要）
git 仓库根是 **`D:\Personal\Astapb`**，不是本项目目录。根下有三个独立项目：
`WebSite`（本项目）、`WebBlog`（Astro 博客）、`CodeKey`，外加根级 `.workbuddy/`。
在 WebSite 里执行 git 命令会看到兄弟项目的文件，**改文件、加 .gitignore 规则前先确认作用域**。

根级 `.gitignore` 的约定：忽略 `.workbuddy/_*` 与 `_review/`，但
**`.workbuddy/memory/` 要留档进版本库**。`WebSite/.gitignore` 已对齐这条约定
（````.workbuddy/*```` + ````!.workbuddy/memory/````），不要再改回 `.workbuddy/`。
