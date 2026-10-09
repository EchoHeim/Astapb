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
- **折叠展开的默认条数是数据驱动的**：改各分类默认展示多少条 = 改 `src/data/categories.ts`
  里该分类的 `visible`，**只动这一个文件**。
  链条：`visible` → `render.ts` 内联写 `--visible` → `components.css` 算卡片高，
  同时 `render.ts` 给第 `visible` 条打 `.clamp-end`（渐变遮罩 + `mouseenter` 展开整块）。
  条目数少于 `visible` 的分类会自动全显示，不用特殊处理。
  **不要**去改 `--col-w` 或 `--row-h` —— 那是列宽和行高，跟要显示几条无关。
  （2026-10-01：23 个分类统一从 6 提到 8，卡片高 355px → 459px。）

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
- 站点数据 = 原有 97 条 + aa 补录 162 条 + 手工补充 43 条 = **23 个分类 / 302 条**。
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
- 新增条目大多没有图标（有图标 76 / 首字母兜底 226）。图标池里剩下的是别家 Logo，
  **不要为了填满而套用**。补图标 = 往 `icon/` 丢文件 + 在数据里填键名。
- **`icon/` 里现有图标都是 100×100**（`epic` / `steam` 等 `icon/game/` 下的是 100²），
  源图小于 100² 就用 Pillow `LANCZOS` 上采样过去，别直接扔小图进去。
- **`/favicon.ico` 与 WordPress 上传目录的 `<link rel="icon">` 常常是同一个文件**
  （ns211 就是这样）。取 ICO 用 Pillow：
  `im = Image.open(p); im.size = max(im.ico.sizes()); im.convert('RGBA')`。
  托管 venv `C:\Users\Lodge\.workbuddy\binaries\python\envs\default\Scripts\python.exe`
  已装 Pillow 12.3.0，直接可用，不用装包。
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
- **`node_modules` 可能不存在**：`npm run build` 里 `tsc` 报「不是内部或外部命令」先怀疑这个，
  跑一次 `npm install` 即可；之后用 `./node_modules/.bin/tsc` / `vite` 直调绕开 PATH 问题。
- **`http_proxy` / `HTTP_PROXY`（大小写两套）会劫持 localhost**：
  curl 打本机服务回 **502**（不是 404 也不是 connection refused，特征很容易误判成"服务挂了"）。
  无头 Chrome 直接访问本机地址也会落到错误页。
  - curl 调试：加 `--noproxy '*'`
  - Chrome：加 `--proxy-server=direct:// --proxy-bypass-list=*`，
    并把 spawn 子进程 env 里的 `HTTP_PROXY`/`HTTPS_PROXY`/`http_proxy`/`https_proxy` 全部清空。
- **后台起的静态服务会跨命令消失**：`curl` 前一刻 200、下一刻 000。
  验证页面时**把静态服务写在同一个 node 进程里**（起服务 → 拉 Chrome → 量 → 关），不要跨命令复用。
- **自建静态服务不要给所有 404 兜底回 index.html**：资源缺失时模块脚本拿到 `text/html`
  会被 MIME 校验拦掉，表现为**白屏且几乎无报错**（只有一条 MIME console error）。
  只有根路径/无扩展名路径才回退，带扩展名的真 404。
  另外 dist 产物里的资源引用带 `/aa/` 前缀（vite base），服务端要剥掉再找文件。
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

## 静态页面视觉验证（2026-10-01 补，做交付型单文件 HTML 时用）
仓库里已有 `local-html-visual-verify` 技能，**先加载它再动手**。以下是踩过的具体坑：
- **截图前先把 HTML `cp` 到截图脚本所在目录**。`file://` URL 指向写文件的位置，
  脚本在 `.workbuddy/_ref/` 却在项目根写 HTML，Chrome 报
  `net::ERR_FILE_NOT_FOUND`（且**退出码仍是 0**，不看 stderr 会以为成功）。
- **每个截图任务换一个 `--user-data-dir`**。复用同一目录时 Chrome 会连到上一个
  还活着的实例，`--screenshot` **静默不生效**——表现为「图片没生成」而不是报错。
- **`--window-size` 只能截首屏**，长内容会被裁掉。要截某个 section 全高得走 CDP：
  `Page.captureScreenshot` + `captureBeyondViewport:true` + `clip`（坐标从
  `getBoundingClientRect()` + `scrollX/Y` 取）。Node 22 自带 `WebSocket` 全局对象，
  CDP 客户端不用装 `ws` 包，`http.get` 拿 `/json/list` 里的 `webSocketDebuggerUrl` 即可。
- **`--force-prefers-color-scheme` 在无头模式下不一定生效**；CDP 的
  `Emulation.setEmulatedMedia` 更可靠。验主题时最稳的是直接
  `Runtime.evaluate('document.documentElement.setAttribute("data-theme","dark")')`。
- **验窄屏溢出要同时看 `scrollWidth` 和逐个元素**：`documentElement.scrollWidth === clientWidth`
  说明页面本身不横滚；此时 `table` 报 `right > clientWidth` 是**正常的**——只要它被
  `overflow-x:auto` 的容器包着就行。只看元素列表会误判成溢出。
- 无头截图存下来的图**必须自己 Read 看一眼**。这次的「半应用主题」（浅色面板 +
  深色文字，标题几乎不可读）在日志里毫无异常，只有看图才发现。

## 主题变量声明（2026-10-01）
- **`--bg` 之类决定根元素外观的变量，不要在 `[data-theme="dark"]` 里改根元素背景**。
  正确做法是在基础 `html{...}` 规则上写 `background-color:var(--bg)`，深色块只override变量。
  原因见 2026-10-01 日志：否则深色下会闪白，且样式快照缺块时会出现不可读的
  「浅色底 + 深色字」半应用状态。

## 仓库边界（重要）
git 仓库根是 **`D:\Personal\Astapb`**，不是本项目目录。根下有三个独立项目：
`WebSite`（本项目）、`WebBlog`（Astro 博客）、`CodeKey`，外加根级 `.workbuddy/`。
在 WebSite 里执行 git 命令会看到兄弟项目的文件，**改文件、加 .gitignore 规则前先确认作用域**。

根级 `.gitignore` 的约定：忽略 `.workbuddy/_*` 与 `_review/`，但
**`.workbuddy/memory/` 要留档进版本库**。`WebSite/.gitignore` 已对齐这条约定
（````.workbuddy/*```` + ````!.workbuddy/memory/````），不要再改回 `.workbuddy/`。
