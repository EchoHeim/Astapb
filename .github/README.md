# .github · CI 配置

存放 GitHub Actions 工作流。目前只有一条：把博客与导航站构建成**单一产物**并发布到 GitHub Pages。

---

## ⚠️ 一条踩过的坑：文件名必须有扩展名

本目录原先的文件叫 `publish`（**没有扩展名**），GitHub Actions 只识别
`*.yml` / `*.yaml`，因此那个工作流**从未被触发过** —— 它在 Actions 页面上
完全不可见，也不报错，属于静默失效。现已更名为 `publish.yml`。

**结论：新增工作流的文件名一定要以 `.yml` 或 `.yaml` 结尾。**

---

## `workflows/publish.yml`

### 触发条件

| 触发方式 | 说明 |
| --- | --- |
| `push` 到 `master` | 自动部署 |
| `push` 到 `master` 但**只改了 `CodeKey/**`** | **跳过**（`paths-ignore`）—— 素材库与站点无关，没必要重新部署 |
| 手动触发 | Actions 页面 → 该工作流 → Run workflow（`workflow_dispatch`） |

> 注意 `WebBlog/docs/**`（文章源）**没有**被忽略 —— 改文章就是要重新部署。

### 构建流程

```
WebBlog/docs/*.md  ──┐
                     ├──►  astro build  ──►  WebBlog/dist/  ──┐
WebBlog/src/       ──┘                                        │
                                                              ├──►  _site/  ──►  Pages
WebSite/  ────────────────────────────────────────────────────┘
```

| 步骤 | 做什么 |
| --- | --- |
| `Setup Node` | Node 22，缓存 `WebBlog/package-lock.json` |
| `Build new blog (Astro)` | `npm ci && npm run build`（`prebuild` 会自动跑内容同步脚本），并**自检产物**里 `index.html` / `rss.xml` / `sitemap-index.xml` / `search-index.json` / `favicon.ico` 是否齐全 |
| `Assemble site` | `WebBlog/dist/` → 产物根；`WebSite/` → `aa/`；写入 `CNAME` 与 `.nojekyll` |
| `Setup Pages` / `Upload artifact` / `Deploy` | `configure-pages@v5` → `upload-pages-artifact@v3` → `deploy-pages@v4` |

两个作业：`build` 与 `deploy`（后者依赖前者，输出到 `github-pages` 环境）。

### 产物结构

```
_site/                              →  https://shilong.js.org/
├── index.html                          博客首页（Astro 产物）
├── tags/  archive/  search/  about/    各栏目
├── linux/  python/  notebook/ ...      文章页（按分类分目录）
├── page/                               列表分页
├── _astro/                             样式与脚本（带 contenthash）
├── rss.xml  sitemap-index.xml  search-index.json  robots.txt  favicon.ico
├── CNAME                               自定义域名（部署时写入）
├── .nojekyll                           关闭 Jekyll
└── aa/                             →  https://shilong.js.org/aa/
    ├── index.html                      导航站入口（来自 WebSite/）
    └── style.css  main.js  icon/ ...
```

**产物约 2 MB。** 原始 Markdown、图片源文件与 219 MB 第三方资料都不进产物 ——
图片由 `ASSETS_BASE` 走 jsDelivr 分发，内容源只在构建时被读取。

拼装 `aa/` 时会清理 `_site/aa/.workbuddy` 与 `_site/aa/README.md`，
避免把本地目录和维护文档一起发布出去。

---

## 使用前提（容易漏）

**必须在仓库 `Settings → Pages → Build and deployment → Source` 中选择
"GitHub Actions"**，否则 `deploy-pages` 会失败并提示 `Get Pages site failed`。

> 该设置已于 2026-09-18 切换完成，工作流运行 `#3` 起持续成功。

---

## 许可

**MIT**，正文见 [`../LICENSES/MIT.txt`](../LICENSES/MIT.txt)。
