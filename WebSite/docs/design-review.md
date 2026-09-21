# 网站设计评审 · astapb-nav (AnywhereAnything 导航站)

- 评审时间：2026-09-21
- 评审范围：`index.html`、`src/**`（10 个 TS + 5 个 CSS）、`scripts/verify-icons.mjs`、`vite.config.ts`、`tsconfig.json`、`dist/` 实测产物
- 线上地址：<https://shilong.js.org/aa/>

> **后续变更（同日）**：搜索区已从左侧固定面板搬到顶部并居中，分类网格改为固定列宽。
> 本文中「P1 · 魔法数值残留（`20vh` / `18vh`）」与「P2 · 提示文案字号」两项已随此次改造一并处理，
> 详见 `README.md` 的「与旧版的行为对照：布局」。

---

## 一、结论摘要

| 维度 | 评价 |
| --- | --- |
| 架构分层 | **优**。data / lib / styles 三层职责干净，无循环依赖 |
| 技术选型 | **优**。零框架运行时，选型有书面论证而非默认跟随 |
| 工程化 | **优**。构建期硬校验把资源错配挡在 CI，同类项目罕见 |
| 可维护性 | **良**。数据与表现彻底解耦，加站点/加分类为纯数据操作 |
| 无障碍 | **良**。基础扎实，但折叠卡片的键盘路径有实缺陷 |
| 视觉设计 | **良**。克制、工具化，但存在低于可读下限的字号 |
| **性能** | **差**。图标资源 2.13 MB，占产物 96%，为 JS 的 99 倍 |

一句话：**工程骨架是样板级的，但资源管线缺了最后一道压缩工序。**

---

## 二、值得保留的设计决策

### 2.1 构建期硬校验（`scripts/verify-icons.mjs`）

挂在 `prebuild` 上，直接 `import` TS 数据模块（依赖 Node 22.18+ 内置类型擦除，无需 esbuild）。它拦截的问题：

- 站点 `icon` 键在 `icon/` 下不存在 → **中断构建**
- 分类推荐位图标在 `header/` 下不存在 → 中断构建
- 图标键跨目录冲突（同键互相覆盖，线上表现取决于扫描顺序）→ 中断构建
- 站点 URL 协议非 http/https 或无法解析 → 中断构建
- 分类 `id` 重复、`TOTAL_SITES` 与各分类条目数之和不一致 → 中断构建
- 未被任何条目引用的闲置图标 → 仅告警

实测输出：

```
  · 17 个分类 / 97 个站点（有图标 74，首字母兜底 23）
  · 图标库：header 12 · icon 69 · search 9
  · 搜索引擎 9 个，默认「bing」
  ! 有 15 个图标没被任何条目引用（不进产物，仅占仓库体积）
  ✓ 图标与数据一致
```

这是这个项目最有价值的一块。旧版用 `switch (分类中文名)` 现推图标目录，导致「分类改名」与「图标路径」被强行绑死，97 条里 24 条静默 404 空白且无人发现 —— 校验脚本正是把这个失效模式彻底关掉了。

### 2.2 扁平图标池替代目录推导

`src/lib/icons.ts` 用三个 `import.meta.glob` 分别扫 `icon/`、`header/`、`search/`，生成「键 → 带哈希 URL」的 Map。键名 = 文件名去扩展名。

收益：跨分类复用图标不再 404；Vite 按引用打包资源，闲置图标根本不进 `dist/`（实测磁盘 92 张 PNG，产物 75 张）。

三个来源分表的处理是对的 —— `header/Pinterest.png`（分类推荐位）与 `icon/pinterest.png`（站点图标）语义不同，混表会互相覆盖。

### 2.3 首屏主题防闪烁

`index.html` 里用内联**同步**脚本在首次绘制前把 `data-theme` 写到 `<html>`：

```js
var saved = localStorage.getItem(root.dataset.themeKey || 'nav-theme');
```

模块脚本（`type="module"`）是延迟执行的，来不及在首帧前跑完，会闪一下默认色。这里选择内联同步，是唯一正确的做法。同时用 `try/catch` 包住 `localStorage`（隐私模式下会抛异常）。

`data-theme-key` 从 HTML 属性上读，与博客的 BaseLayout 约定保持一致 —— 便于两站共用主题偏好。

### 2.4 语义与无障碍基线

- 站点条目是真实 `<a>` 而非 `<li onclick>` → 中键、右键「复制链接」、Tab 遍历全部可用
- `:focus-visible` 画焦点环，而不是旧版的 `outline: 0` 一把抹掉
- 图标 `alt=""`、首字母色块 `aria-hidden="true"`（站点名就在旁边，再念一遍是噪音）
- `<section aria-labelledby="cat-{id}-title">` 与 `<h2>` 正确关联
- 搜索框支持 `Escape` 清空、`/` 聚焦（且只在非输入态接管，避免打不出斜杠）
- `anchors` 用真实 `#cat-xxx` 链接 → 地址栏带锚点、可分享、可新窗口打开
- 无 `innerHTML`：`h()` 助手全走 `createTextNode`，站点名含 HTML 字符也不会注入

### 2.5 修掉的旧版缺陷（README 有记录，代码已核实）

| 缺陷 | 修法 |
| --- | --- |
| 回车搜索依赖隐式全局 `event`，Firefox 抛 `TypeError` | 改用回调参数 `event.key` |
| 界面写「按回车搜索 Google」，实际跳 `cn.bing.com` | 文案由 `DEFAULT_ENGINE_ID` 数据推导 |
| 输入框聚焦 `background: #444` 简写把背景图标一起重置 | 改为只改 `background-color` |
| 折叠遮罩挡住最后一条可见项的点击 | 遮罩加 `pointer-events: none` |
| 移动端用 `margin: 21rem` 顶开固定面板 | 改静态流式排布，去掉魔法数字 |
| 卡片高度由 JS 内联计算 | 交给 CSS 变量 `--visible` |

### 2.6 两个交互判断做得很准

**锚点同行整体高亮**（`anchors.ts`）：卡片多列换行时一行通常有 2~4 个分类，「当前分类」本身是伪概念。只高亮一个的话，点「游戏」却亮起同行左侧的「网络」，看着像 bug。所以整行统一标记，`aria-current` 只落在行首保持语义单值。

**过滤时整体重渲染而非 DOM diff**（`render.ts`）：97 个条目的重建成本可忽略，换来一份「不可能有状态残留」的实现。这是正确的取舍。

---

## 三、问题清单

### P0 · 图标资源体积（影响最大）

实测 `dist/` 构成：

| 资源 | 体积 | 占比 |
| --- | --- | --- |
| 图标 PNG × 75 | 2,179 KB | 96.7% |
| JS bundle | 22 KB | 1.0% |
| CSS | 5 KB | 0.2% |
| HTML | 4 KB | 0.2% |
| favicon | 1 KB | 0.05% |
| **合计** | **2,116 KB** | |

逐张解析 PNG 头得到的事实：

- **75 张全部是 256×256**，而页面上以 `2rem = 28px` 渲染（DPR 2 下 56px）。边长冗余 9.1 倍，面积冗余 84 倍。
- 未做任何压缩处理。最大的几张：`steam.png` 75 KB、`smzdm.png` 67 KB、`apisio.png` 49 KB、`openedv.png` 49 KB、`appledev.png` 49 KB。
- 单张 `steam.png` 比整个业务 JS 还大 3.4 倍。

首屏要并发拉取 75 个图标文件，在弱网/移动端这是灾难性的 —— 至少 75 个 RTT，总下载 2 MB。

**建议（按投入产出排序）：**

1. 加一个构建期图片处理插件（`vite-plugin-image-optimizer` 或直接用 `sharp` 写个 prebuild 脚本），把图标转成 **64×64 WebP**（DPR 2 下 128px 足矣）。预计 `2,179 KB → 约 100~150 KB`，降幅 93%+。
2. 若不想引入原生依赖，退一步用 `pngquant`（有 wasm 版）做量化，也能砍掉 60~70%。
3. 图标是长期不变的静态资源，配合已有的内容哈希文件名 + 强缓存，二次访问成本可贵忽略 —— 但首次访问必须优化。

**顺带一处反向优化**：`vite.config.ts` 设了 `assetsInlineLimit: 0`。这个决定的理由是充分的（避免 30 张小图标被 base64 塞进 JS 反而涨体积），但 `search.png`（578 B）和 `logo.png`（1.1 KB）两个文件被一并拆成独立请求，纯亏 2 个 RTT。建议改为 `assetsInlineLimit: 2048`，只让这两个内联。

### P1 · 高亮与过滤的匹配规则不一致

`filter.ts` 按空白切词、多词取「与」：

```ts
return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
```

但 `dom.ts` 的 `highlight()` 把整个查询串当成**单一 needle**：

```ts
const needle = keyword.trim().toLowerCase();
```

后果：搜「知识 图」能正确筛出结果，却没有任何关键词被 `<mark>` 高亮（因为没有 `"知识 图"` 这个连续子串）。用户会以为高亮坏了。

**修法**：`highlight()` 改为接收 `string[]`，逐个 token 找所有命中区间、排序合并后一次性切分。顺便解决重叠命中。

### P1 · 键盘无法展开折叠卡片（真实的 a11y 缺陷）

`.item` 在折叠态是 `height: calc(...)` + `overflow: hidden`，被裁掉的 `<li><a>` 仍留在 tab 序里，且**只在 `mouseenter` 折叠标记时才加 `.change`**：

```ts
clampEnd.addEventListener('mouseenter', () => section.classList.add('change'));
```

所以：

- 键盘用户 Tab 到被裁掉的条目 → 焦点进入一个不可见区域，`overflow: hidden` 容器会被浏览器强行滚动，页面跳动
- 没有任何键盘途径能展开卡片（`focusout` 只会收起）

**修法（二选一）**：
- 折叠态给超出的 `<li>` 加 `inert`（或 `tabindex="-1"` + `aria-hidden="true"`），展开时移除；
- 或把展开触发从 `mouseenter` 换成 `.item:hover, .item:focus-within`（纯 CSS），键盘 Tab 进入即展开。

推荐第二种，改动更小且语义更自然。

### P1 · 魔法数值残留

`layout.css`：

```css
#searchItem { margin-top: 20vh; }
#content    { margin-top: 18vh; }
```

README 刚刚批判过旧版移动端的 `margin: 21rem`，但桌面端这两个 `vh` 是同类问题：横屏手机、超宽屏、或比正常更长的提示文案下，左右两栏的视觉基线会错位。建议用 grid 的行基线对齐，或至少提取成 `--col-top-offset` 变量并在注释里写明推导依据。

### P1 · `theme-color` 与手动主题不联动

`index.html` 声明了两个 `prefers-color-scheme` 媒体查询版本的 `theme-color`：

```html
<meta name="theme-color" content="#2b2b2b" media="(prefers-color-scheme: dark)" />
<meta name="theme-color" content="#fbfaf6" media="(prefers-color-scheme: light)" />
```

但页面主题是**用户可手动切换**的（localStorage 持久化）。当系统为深色、用户手动选了浅色时，移动端浏览器地址栏仍会渲染成 `#2b2b2b`，与页面 `#fbfaf6` 撞色。

**修法**：在 `theme.ts` 的 `applyTheme()` 里同步更新一个无 `media` 属性的 `theme-color` meta：

```ts
document.querySelector('meta[name="theme-color"]')?.setAttribute(
  'content', theme === 'dark' ? '#2b2b2b' : '#fbfaf6',
);
```

并把 HTML 里两个带 media 的 meta 合成一个（初始值仍由内联脚本按同一逻辑算好）。

### P2 · 提示文案字号低于可读下限

```css
#searchHint { font-size: 0.6rem; }   /* 根字号 14px → 实际 8.4px */
```

`html { font-size: 14px }` 是全局基准，`0.6rem` 落地只有 **8.4px**。这已经低于 WCAG 及各平台可读下限（一般建议正文 ≥ 12px、辅助文字 ≥ 11px）。而且这里承载的是「输入关键词，然后点网站，即在那个网站里搜索」这条**核心用法说明** —— 最该看清的文案用了最小的字。

**建议**：提到 `0.75rem`（10.5px）以上，核心说明改用 `0.85rem`（11.9px，与锚点字号一致）。

### P2 · 断点单一，平板区间偏挤

只有 `max-width: 650px` 一个断点。651~960px 区间仍保持「20% 固定左栏 + 多列卡片」布局，卡片被挤到只剩窄列。建议补一个中间断点（约 900px），或让 `#search` 的 `flex-basis` 随视口在两档之间切换。

### P2 · 搜索区缺语义容器

`#searchBox` 有 `aria-label` 但无 `<label>` 元素，外层也没有 `<form role="search">`（或原生 `<search>` 元素）。读屏用户无法通过「跳转到搜索」这类地标导航快速定位。补一层 `<search>` 容器即可，零成本。

### P3 · 内容层问题（README 已自陈，未改动）

| 分类 | 问题 |
| --- | --- |
| 图片 | `wallhaven`、`彼岸图` 使用 flickr 图标 |
| 社交 | `小红书`、`百度贴吧`、`知乎` 均使用新浪微博图标 |
| 知识 | `51自学网` 使用 TED 图标 |
| 编程 | `W3Schools`、`菜鸟教程`、`Android Dev` 均使用 CodePen 图标 |
| 书籍 | `Z-library` 使用淘宝图标（推荐位） |
| 数码 | `果壳网` 使用 Pinterest 图标（推荐位） |
| 论坛 / 工具 / 其他 | 分类推荐位都用 `linux` 图标，与分类内容无关 |
| 搜索 | `Google 图片` 的 query 是 `https://google.com/search?q=`，**指向普通搜索而非图片搜索**（应为 `&tbm=isch`） |

前 7 项是「没有合适图标」的妥协，README 里解释了刻意不套别家 Logo 的理由（比留白更误导）—— 这个判断我认同，但**社交/编程/论坛三处是同一张图标复用 3~9 次**，比留白更影响辨识度。建议至少给高频复用项补真实图标，或统一退回首字母色块。

最后一条（Google 图片）是**功能性 bug**，不是内容问题，改 `engines.ts` 一行即可。

### P3 · 部署链路在当前工作区不可见

`README.md` 和 `vite.config.ts` 注释都引用了 `.github/workflows/publish.yml`，但仓库里**没有 `.github` 目录**。这导致 `base: '/aa/'` 这个关键配置的正确性在本工作区无法自证 —— 一旦 workflow 侧的路径约定变了，只有线上才能发现。建议把 workflow 一并纳入版本管理。

---

## 四、改进优先级

| 优先级 | 事项 | 预期收益 | 改动量 |
| --- | --- | --- | --- |
| 1 | 图标转 64px WebP | 产物 2.1 MB → ~150 KB | 加 1 个 prebuild 脚本 |
| 2 | 折叠卡片键盘可达 | 修掉真实 a11y 缺陷 | 改 2 行 CSS 或 1 处 JS |
| 3 | `highlight` 按 token 匹配 | 修掉多词搜索不高亮 | 改 1 个函数 |
| 4 | 提示文案字号 | 核心说明从 8.4px 提到可读 | 改 1 行 CSS |
| 5 | `theme-color` 随手动主题 | 修掉地址栏撞色 | 改 3 行 |
| 6 | `assetsInlineLimit: 2048` | 省 2 个 RTT | 改 1 个数字 |
| 7 | Google 图片 query 补 `&tbm=isch` | 修复功能性错误 | 改 1 行数据 |
| 8 | 消除 `20vh / 18vh` 魔法数 | 布局鲁棒性 | 小重构 |
| 9 | 补中间断点 + `<search>` 容器 | 平板体验与地标导航 | 小改动 |
| 10 | 补齐复用过多的图标 | 辨识度 | 需要素材 |

前 3 项做完，这个项目的质量会从「工程优秀但资源失控」变成「各方面都在水准线之上」。

---

## 五、可复用的方法

这个项目里有三套做法值得直接搬到其他前端项目：

1. **把「资源键名」当成受校验的类型**。构建期扫盘 + 数据引用双向核对，让错配在 CI 阶段失败而非线上静默 404。适用于图标、字体、i18n 词条、CMS 图片等一切「字符串键指向文件」的场景。
2. **构建产物体积纳入可观测范围**。本次评审靠的是逐文件字节数 + 解析 PNG 头拿像素尺寸，才知道冗余 84 倍。这类检查应该固化成脚本，而不是等到评审时才做。
3. **设计令牌双主题 + 逐条标注来源**。`tokens.css` 里深色栏逐条照搬旧值（保证换主题不动观感）、浅色栏新增并注明对比度考量 —— 这让「主题改造」变成可验证的、胆大的重构，而不是靠肉眼比对。
