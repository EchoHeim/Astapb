# WebBlog · MacLodge's Blog

> 线上地址 <https://shilong.js.org/> —— 2026-09-18 起接管根路径，取代原 docsify 站点。

## 一句话说清它是什么

Astro 构建的静态博客。**文章源是 `../docs/blog/` 下的 Markdown** ——
那个目录现在唯一的职责就是内容源，docsify 那一套已经删掉了。
往 `docs/blog/<分类>/` 丢一个 `.md`，提交后站点自动更新。

---

## 为什么换掉 docsify

下表是切换时的对比。**2026-09-18 那套 docsify 机制已从 `docs/` 删除**
（105 个文件 / 约 14 MB），现在 `docs/` 只留文章源与站点图片资源，
细节见 [docs/ABOUT.md](../docs/ABOUT.md)。

| 问题 | docsify（旧） | Astro（现） |
| --- | --- | --- |
| 元数据 | 无 frontmatter，`tags` 覆盖率为 0 | 原生 frontmatter，标签/日期/摘要可索引 |
| 搜索 | 只索引侧边栏出现过的链接，40 篇文章搜不到 | 构建时生成全量索引，标题+标签+正文一起搜 |
| URL | hash 路由 `/#/blog/…`，搜索引擎基本不收录 | 真实路径 `/linux/linux小技巧/xxx/`，可收录 |
| SEO | `<meta name="description">` 是模板占位符，`<title>` 全站同名 | 每页独立 title/description/canonical/OG/JSON-LD |
| 订阅 | 无 | RSS + sitemap |
| 首屏 | 十几个外网 CDN 脚本，其中一个已停止维护 | 首屏只下载 HTML + CSS + JS，合计约 **11.7 KB**（gzip） |
| 部署产物 | 约 247 MB/次 | 约 1.55 MB（gzip）/ 11 MB（原始） |
| 深色模式 | 无 | 亮/暗双主题，跟随系统并记忆选择 |

---

## 目录结构

| 路径 | 作用 |
| --- | --- |
| `astro.config.mjs` | base、代码高亮双主题、sitemap |
| `src/consts.ts` | **最常改的文件** —— 站点标题、作者、导航、资源基址、分页大小 |
| `src/content.config.ts` | 内容集合：读哪、排除什么、URL slug 怎么生成 |
| `src/layouts/BaseLayout.astro` | HTML 骨架、SEO、主题引导脚本、旧链接重定向、全站交互脚本 |
| `src/components/Header.astro` | 头部导航：响应式抽屉、搜索入口、主题切换 |
| `src/components/SearchDialog.astro` | 搜索弹窗（`/` 或 `Ctrl/Cmd+K` 唤起） |
| `src/components/PostCard.astro` `PostList.astro` `Pager.astro` | 列表卡片与分页 |
| `src/components/Footer.astro` | 页脚 |
| `src/pages/index.astro` | 文章列表第 1 页 |
| `src/pages/page/[page].astro` | 列表第 2 页起 |
| `src/pages/[...slug].astro` | 文章详情：目录、阅读进度、上下篇、相关阅读、JSON-LD |
| `src/pages/tags/index.astro` `tags/[tag].astro` | 标签总览与单标签列表 |
| `src/pages/archive.astro` | 按年份归档 |
| `src/pages/search.astro` | 独立搜索页（不依赖 JS 也能到达） |
| `src/pages/about.astro` | 关于页 |
| `src/pages/rss.xml.js` | RSS 订阅源 |
| `src/pages/search-index.json.ts` | 搜索索引端点（构建时生成） |
| `src/styles/global.css` | 全站样式与主题变量 |
| `src/scripts/search.ts` | 搜索打分与渲染，弹窗与搜索页共用 |
| `src/utils/` | URL 拼接、标签 slug |
| `scripts/sync-content.mjs` | **构建前自动跑**：补全 frontmatter + 体检 |
| `scripts/migrate-assets.mjs` | 把被引用的图片/附件镜像到独立资源仓库 |
| `public/` | `favicon.ico`、`robots.txt` |

---

## 内容是怎么同步进来的（重要）

**会自动同步，但不是"零条件"。** 完整链路：

```
docs/blog/*.md
   │
   ├─ ① npm run build 之前自动执行 scripts/sync-content.mjs
   │      · 缺 frontmatter 的自动补上（标题取首个标题行、日期取 git 首次提交时间、
   │        标签按目录推断、摘要取首段）
   │      · 体检：正文里相对路径的图片是否存在（不存在会让构建直接失败）
   │
   ├─ ② Astro 读取内容集合（排除 README.md / 第三方资料等）
   │
   └─ ③ 生成列表、标签页、归档、RSS、sitemap、搜索索引
```

所以新增一篇文章只需要两步：

1. 把 `.md` 放进 `docs/blog/<分类>/`（**不写 frontmatter 也可以**，构建时会自动补）
2. `git commit && git push`

不想用自动补的值，就自己写：

```yaml
---
title: 文章标题
date: 2026-09-18
tags: [Linux, Linux 小技巧]   # 第一项当分类，其余当细分标签
summary: 一句话摘要，用于列表、RSS 和搜索引擎描述
---
```

想把某篇先藏起来：加 `draft: true`。

### 不会同步的情况

| 情况 | 说明 |
| --- | --- |
| 放在被排除的目录 | `README.md`、`尚德机构-考研/`、`尚德机构-考研-知识库/`、`港股打新/` 都不进站点。另外 `docs/` 根目录下的文件（如 `FreeBorders.md`）也不在内容源内 —— 内容源只认 `docs/blog/` |
| 只改了文件没提交 | 构建发生在 GitHub Actions 上，本地改动不推上去不会生效 |
| 正文里有相对路径的图片且文件不存在 | 构建会失败并打印是哪一篇哪一行 —— 用 `npm run check` 可以提前发现 |

---

## 本地开发

```bash
cd WebBlog
npm install

npm run sync      # 只跑内容同步与体检（会写文件）
npm run check     # 只体检，不写文件
npm run dev       # 开发服务器
npm run build     # prebuild 会自动跑 sync，然后产出 dist/
npm run preview   # 预览构建结果
```

---

## 部署到 GitHub Pages

**仓库地址和访问地址都不变** —— 只是构建方式从"docsify 在浏览器里渲染"
换成了"Astro 在 CI 里预渲染"。`git remote` 不用动，`shilong.js.org` 也不用动。

### 一次性配置（只需做一次）

1. 打开仓库 **Settings → Pages**
2. **Build and deployment → Source** 选择 **GitHub Actions**
   > 这是最容易漏的一步。如果这里还是 "Deploy from a branch"，
   部署会报 `Get Pages site failed`。
3. **Custom domain** 保持 `shilong.js.org`，DNS 记录不用改
   （域名早已解析到 GitHub Pages，站点现在是通的）

### 每次发布

```bash
git add -A
git commit -m "切换到 Astro 博客"
git push origin master
```

推送后自动触发 [`.github/workflows/publish.yml`](../.github/workflows/publish.yml)：

```
Checkout → Setup Node 22 → Build new blog (Astro) → Assemble site → Setup Pages → Upload → Deploy
```

- `Build new blog (Astro)` 会跑 `npm ci && npm run build`，
  并自检产物里 `index.html` / `rss.xml` / `sitemap-index.xml` /
  `search-index.json` / `favicon.ico` 是否齐全，缺了就直接失败
- `Assemble site` 把 `WebBlog/dist/` 放到产物根，`WebSite/` 放到 `aa/`，
  写入 `CNAME` 与 `.nojekyll`
- 整条流水线约 1–2 分钟

### 怎么确认成功

1. 仓库 **Actions** 标签页，看到 `Deploy sites to GitHub Pages` 变成绿色
2. 访问 <https://shilong.js.org/> —— 应该是新样式（有搜索按钮和主题切换）
3. 顺手验证这三个地址：
   - <https://shilong.js.org/tags/> 标签页
   - <https://shilong.js.org/rss.xml> 订阅源
   - <https://shilong.js.org/aa/> 导航站（应仍是旧样子）

### 需要知道的两个变化

| 变化 | 说明 |
| --- | --- |
| 文章 URL 变了 | 旧的是 `/#/blog/Linux/xxx`，新的是 `/linux/xxx/`。旧形式的链接会**自动重定向**（`BaseLayout.astro` 里的脚本），但原本直接访问 `/blog/xxx.md` 原始文件的地址会 404 —— 因为 `docs/` 不再发布 |
| 部署产物小了 100 倍 | 247 MB → 约 2 MB，因为原始 Markdown 和 219 MB 第三方资料都不再进产物 |

### 想手工触发一次

Actions → `Deploy sites to GitHub Pages` → **Run workflow**。
workflow 里配了 `workflow_dispatch`，不需要额外提交。

### 回退到 docsify

`docs/` 下的 docsify 机制文件已在 2026-09-18 删除，但都还在 git 里：

```bash
git restore docs/plugin docs/css docs/js docs/index.html   # 恢复
```

然后在 workflow 里把"复制 `docs/.` 到产物根"那一步加回来即可。

---

## 图片与附件

`src/consts.ts` 的 `ASSETS_BASE` 决定图片从哪里加载，目前指向主仓库的
jsDelivr 地址 —— 立刻可用，但主仓库的包体积远超 jsDelivr 的 50 MB 加速上限，
长期不可靠。

**切到独立资源仓库：**

```bash
npm run migrate-assets            # 预演，列出会被搬运的文件
npm run migrate-assets -- --yes   # 拷贝到 ../Astapb-assets/
```

脚本只搬**被文章引用到的**资源，不会把 219 MB 的第三方 PDF 一起搬走，
而且**不修改任何 Markdown 源文件**。推送后把 `ASSETS_BASE` 改成新仓库地址即可。

---

## 交互与无障碍

- **主题**：亮/暗切换，首次访问跟随系统，之后记住选择；首屏内联脚本消除闪烁
- **搜索**：`/` 或 `Ctrl/Cmd+K` 唤起弹窗，↑↓ 选择、回车打开、Esc 关闭
- **目录**：宽屏（≥1200px）右侧固定目录并高亮当前章节；窄屏折叠在正文上方
- **阅读进度**：文章页顶部 2px 进度条
- **代码复制**：悬停代码块出现复制按钮，移动端常驻
- **回到顶部**：滚动超过 600px 后出现
- **键盘可达**：跳转主内容的 skip link、可见的焦点样式、语义化标签与 aria
- **动效**：尊重 `prefers-reduced-motion`
- **旧链接兼容**：访问 `/#/blog/…` 形式的旧 docsify 地址会就地重定向到新地址

---

## 已知问题

- **`docs/blog/Linux/Linux应用编程/` 有 4 个文件是重复内容**：
  `Linux基本工具.md` 与 `Linux驱动调试相关/Linux使用adb抓取Android日志.md` 完全相同；
  `Linux系统管理.md`、`Linux网络编程.md`、`Linux进程与线程.md` 三份与
  `Linux驱动调试相关/Linux访问PHY芯片寄存器.md` 完全相同。
  这是历史遗留（复制文件后忘了替换内容），所以列表与归档里会出现重复标题。
  确认后可加 `draft: true` 隐藏，或直接删除文件。
- 文章 URL 会做小写化与符号清洗，与旧 docsify 的原始路径不一致 ——
  旧地址靠 `BaseLayout.astro` 里的 hash 重定向兜底，但只在分享的是
  `/#/...` 形式时有效。若分享的是 `/blog/xxx.md` 这种原始文件路径，无法自动映射。

---

## 许可

站点代码 MIT；`docs/blog/` 下的文章为 CC BY-NC-SA 4.0。
详见仓库根 [LICENSE](../LICENSE) 与 [LICENSES/README](../LICENSES/README.md)。
