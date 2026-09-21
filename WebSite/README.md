# WebSite · 网站导航资源区

> 线上地址：<https://shilong.js.org/aa/>

一个**纯静态**的网站导航页，由 Vite + TypeScript 构建：顶部是吸顶的聚合搜索区
（搜索框 + 9 个外部搜索引擎 + 分类锚点），下方按分类以**固定列宽**平铺常用网站。

界面设计与交互灵感来自 [lackar.com/aa（AnywhereAnything）](http://lackar.com/aa/)——
喜欢那种"简约但不简单"的风格，原站又时常打不开，于是复刻了一份本地静态版。
感谢原作者的设计。（原站目前返回 DreamHost 的 Site not found，视觉基准以本目录为准。）

---

## 技术栈

**Vite + TypeScript，不引入 UI 框架。**

这个页面要渲染的是 97 条静态数据，客户端状态只有"一个输入框"和"悬停展开"。
React（约 45 KB gzip）或 Vue（约 34 KB）在这里没有可换来的东西，
而 Vite 恰好补上了旧版真正缺的部分：类型检查、构建期校验、资源指纹、子路径处理。

| 顾虑 | 结论 |
| --- | --- |
| 首屏 SEO | 不需要。这是挂在 `/aa/` 下的工具页，不做搜索排名 |
| 运行时体积 | 0 KB 框架运行时，只有业务代码 |
| 依赖数量 | `vite` + `typescript` 两个 devDependency |

---

## 目录结构

| 路径 | 作用 |
| --- | --- |
| `index.html` | Vite 入口：静态骨架（搜索框、锚点容器、挂载点）+ 防主题闪烁的内联脚本 |
| `src/data/categories.ts` | **站点数据**：17 个分类、97 个条目 |
| `src/data/engines.ts` | 搜索框上方的 9 个外部搜索引擎 |
| `src/data/types.ts` | 数据模型 |
| `src/lib/icons.ts` | 图标清单（构建期扫描生成）+ 首字母色块兜底 |
| `src/lib/render.ts` | 渲染分类网格与搜索引擎列 |
| `src/lib/filter.ts` | 站内过滤 |
| `src/lib/anchors.ts` | 分类锚点与滚动高亮 |
| `src/lib/header.ts` | 吸顶搜索区的高度测量（锚点避让与滚动高亮共用） |
| `src/lib/theme.ts` | 深浅色主题切换 |
| `src/lib/dom.ts` | 建 DOM 助手、高亮、外链打开 |
| `src/styles/` | `tokens` / `base` / `layout` / `components` / `responsive` |
| `scripts/verify-icons.mjs` | 构建期图标校验 |
| `header/` `icon/` `search/` `img/` | 图标资产（未被 Vite 加工，直接由构建期 glob 收录） |
| `public/favicon.png` | 站点图标 |

---

## 常用命令

```bash
npm install
npm run dev       # 本地开发，地址是 /aa/ 而不是 /
npm run check     # 只跑图标校验
npm run build     # 校验 -> tsc --noEmit -> vite build，产物在 dist/
npm run preview   # 预览构建产物
```

---

## 怎么加一个站点

1. 把图标放进 `icon/` 下**任意**子目录（目录名不再有含义，只是归类用），
   例如 `icon/misc/zhihu.png`；
2. 在 `src/data/categories.ts` 里找到对应分类，往 `sites` 追加一条：

   ```ts
   { icon: 'zhihu', name: '知乎', url: 'https://www.zhihu.com/' },
   //   图标键           显示名         点击后打开的地址
   ```

3. 图标键就是**文件名去掉扩展名**，区分大小写（`MagoTV`、`JD`、`Khan` 都按原样写）。
   暂时没有图标就省略 `icon` 字段，会自动渲染成首字母色块。

跑一次 `npm run build` 即可。**图标键写错会构建失败**，不会像以前那样静默留白。

构建前那次校验会打印三行摘要，并对两类问题给出提示（提示不中断构建）：

```
  · 17 个分类 / 97 个站点（有图标 74，首字母兜底 23）
  · 图标库：header 12 · icon 69 · search 9
  · 搜索引擎 9 个，默认「bing」

  ! 有 15 个图标没被任何条目引用（不进产物，仅占仓库体积）：icon/bing.png、…
```

闲置图标只是仓库卫生问题，**不影响线上**：Vite 只打包被引用到的资源，
这些文件根本不会进 `dist/`（实测磁盘上 92 张 PNG，产物里 75 张）。
同理，往 `icon/` 里丢一张暂时不用的图标是安全的。

想加一个**新分类**，只需在 `CATEGORIES` 里加一项 —— 锚点导航会自动多出一项，
不再需要同步修改渲染代码里的 `switch`（旧版正是卡在这里）。

想改搜索框那一排搜索引擎，编辑 `src/data/engines.ts`。

### 与旧版的行为对照：图标

旧实现用 `switch (对象分类的中文名)` 现推图标目录，跨分类复用图标必然 404，
97 条里有 24 条是空白。现在改成扁平图标池 + 构建期硬校验，并做了如下处理：

| 情况 | 数量 | 处理 |
| --- | --- | --- |
| 原本能正确取到图标 | 74 | 图标键原样保留，视觉与旧版一致 |
| 原本取不到、但图标确实属于该站 | 1 | 「旅行 → Bilibili」恢复为真实的 bilibili 图标 |
| 原本取不到、且没有合适图标 | 22 | 首字母色块 |

"没有合适图标"的一类**刻意不套用别家 Logo**：扁平池里虽然有 `flickr`、`openedv`、
`MagoTV` 等键，但把 Flickr 的标套到 36kr、彼岸图、游戏星辰上，比留白更容易误导。
想补真实图标时，把文件丢进 `icon/` 并填上键名即可。

### 与旧版的行为对照：布局

面板从左侧搬到了顶部，分类网格从「按内容宽度自排」改成固定列宽：

| 项 | 旧 | 现 |
| --- | --- | --- |
| 搜索区位置 | 左栏 20%，内部 `position: fixed` | 顶部整宽居中，桌面端 `position: sticky` 吸顶 |
| 搜索引擎图标列 | 纵向一列，靠 `margin-top: 20vh` 顶位 | 横向一排，居中换行 |
| 分类列宽 | flex `row wrap`，各卡片按内容宽度伸缩，宽窄不一 | CSS Grid `repeat(auto-fill, var(--col-w))`，每列恒为 `--col-w` |
| 列间距 | `.item` 的 `margin: 0 1rem` | `#grid` 的 `gap`（margin 会吃进固定轨道，已移除） |
| 顶距 | `#content { margin-top: 18vh }` 等魔法数 | 由吸顶区高度 + `padding` 决定，无 vh 常量 |

两处连带处理：

- **长站名会被省略号截断**。列宽固定后 `TheNounProject`、`黑神话·悟空Wiki` 这类名字
  可能超出卡片，`.site-name` 用 `nowrap + ellipsis` 裁掉。这里刻意不给它换行 ——
  `.item` 的高度是按「一条占一行」算的（`12rem + 2.6rem × visible`），
  某条折成两行就会让可见条数对不上。完整站名仍可从 `<li title>` 的悬浮提示看到。
- **吸顶区会遮住锚点跳转目标**，所以 `lib/header.ts` 用 `ResizeObserver` 量出真实高度
  写进 `--header-h`，供 `scroll-margin-top` 使用；锚点的滚动高亮判定线也改用它，
  不再用固定比例的 `innerHeight`。高度不是常量 —— 视口变窄会让锚点换行。

移动端（≤650px）搜索区不吸顶，主题按钮移到右下角悬浮。这与旧版
「桌面 fixed 左栏 / 移动改流式」是同一个思路：手机上顶部区域占视口比例大，常年钉住不划算。

### 与旧版的行为对照：其他

重构中顺手修掉的几处（都不影响整体观感）：

- 回车搜索原来依赖隐式全局 `event`，Firefox 下直接抛 `TypeError`；改用回调参数。
- 界面写"按回车搜索 **Google**"，代码实际跳 `cn.bing.com`；默认引擎改为从数据推导。
- 站点条目原来是 `<li>` + `onclick`，改为真实 `<a>`，于是中键、右键复制链接、
  键盘 Tab 都能用了。
- 输入框聚焦时的高亮规则用了 `background` 简写，会把搜索图标一起重置掉；改为只改背景色。
- 折叠卡片的渐变遮罩会给最后一条可见项挡住点击；加了 `pointer-events: none`。
- 移动端不再用 `margin: 21rem` 去顶开固定面板，改为流式排布，面板加内容不会错位。
- 提示文案从 `0.6rem`（根字号 14px → 8.4px，已低于可读下限）提到 `0.75rem`。
- 暗色主题补上了缺失的 `--border`，此前 `border: 0.5px solid var(--border)` 整条声明
  在深色下是失效的（右上角主题按钮的圆形描边就受此影响）。

## ⚠️ 仍存在的已知问题

这些是**内容**问题，不是实现问题，本次刻意没有改动：

| 分类 | 问题 |
| --- | --- |
| 图片 | `wallhaven`、`彼岸图` 均使用 flickr 图标 |
| 社交 | `小红书`、`百度贴吧`、`知乎` 均使用新浪微博图标 |
| 知识 | `51自学网` 使用 TED 图标 |
| 编程 | `W3Schools`、`菜鸟教程`、`Android Dev` 均使用 CodePen 图标 |
| 书籍 | `Z-library` 使用淘宝图标（推荐位） |
| 数码 | `果壳网` 使用 Pinterest 图标（推荐位） |
| 搜索 | `Google 图片` 指向普通搜索而非图片搜索 |
| 论坛 / 工具 / 其他 | 分类推荐位都用了 `linux`（Linux kernel）图标，与分类内容无关 |

改法都是把 `icon` 换成正确的键名，或补一张图后填上键名。

---

## 部署

本目录**不是**独立站点 —— 它由 `.github/workflows/publish.yml` 构建后复制到
Pages 产物的 `aa/` 子路径下，与博客共用同一个自定义域名。

因此 `vite.config.ts` 的 `base` 必须保持 `'/aa/'`，页面内所有资源引用都由 Vite
按 `base` 重写，不要手写绝对路径。

---

## 许可

| 内容 | 许可证 |
| --- | --- |
| 代码（`index.html`、`src/`、`scripts/`、配置文件） | MIT |
| `icon/`、`header/`、`search/`、`img/` 中的第三方 Logo 与商标 | 归各自权利人所有，此处仅作链接索引 |

详见 [LICENSE](LICENSE)。
