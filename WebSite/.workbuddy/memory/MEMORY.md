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
- 站点数据 = 原有 97 条 + 从 aa（lackar.com/aa）补录的 162 条 = **20 个分类 / 259 条**。
- aa 原站已**整站下线**。补录数据来自 **Common Crawl `CC-MAIN-2019-18`（2019-04-22）快照**，
  取证方式、去重规则、跳过清单都在 `docs/aa-import.md` —— 再要补录先读它，别重新摸索。
- **原有条目一律不改**：新增条目追加在各分类 `sites` 末尾，并带
  `// ---- 以下为 aa 补录 ----` 分隔注释。以后改数据保持这条分界。
- 新增的 `电影` / `应用` / `搜索` 三个分类排在锚点最后，原有 17 个分类顺序不动。
- 新增条目大多没有图标（有图标 75 / 首字母兜底 184）。图标池里剩下的是别家 Logo，
  **不要为了填满而套用**。补图标 = 往 `icon/` 丢文件 + 在数据里填键名。
- `header/` 现在是 15 个，新增 `appstore.png`(180²)、`doubanmovie.png`(100²)、`google.png`(100²)。

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
