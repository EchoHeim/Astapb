# docs/ 工作区说明

> ⚠️ **本目录不对外发布，也不再有任何站点代码。**
> 线上站点由 `WebBlog/`（Astro）构建并部署到 <https://shilong.js.org/>。
>
> 本目录现在只有一个职责：**博客的文章内容源**。
> `blog/**/*.md` 被 `WebBlog/src/content.config.ts` 读取，
> 文章列表、标签页、归档、RSS、搜索索引全部由它们生成。

## 2026-09-18 清理了什么

docsify 那一整套已经删除，共 105 个文件 / 约 14 MB：

| 已删 | 说明 |
| --- | --- |
| `index.html`、`_coverpage.md`、`_navbar.md`、`README.md` | docsify 入口与站点配置 |
| `css/`、`js/` | 站点样式与脚本（search.js、jquery、goup、click_heart…） |
| `plugin/` | 58 个自托管资源（docsify 本体、Prism、KaTeX、Mermaid…） |
| `pwa.js`、`CNAME`、`.nojekyll` | 离线化与发布相关文件；域名现在由 workflow 写入产物根 |
| `sponsor/{README.md,drinks,simple,src}` | 赞赏页的 docsify 实现 + 2 MB 的 artitalk / jquery |
| `blog/**/_sidebar.md`（14 个）、`blog/Catalog/`（5 个）、`blog/blog_start.md` | 手写导航与索引页，新站点全部自动生成 |

如果想恢复其中某一部分，它们都还在 git 里：

```bash
git restore docs/plugin            # 恢复整个目录
git restore docs/blog/_sidebar.md  # 恢复单个文件
```

## 保留了什么，为什么

| 保留 | 原因 |
| --- | --- |
| `blog/**/*.md` | 文章内容源，**动它就是改线上文章** |
| `blog/NoteBook/Python/vgsales.csv` | 被 `6小时Python入门.md` 引用的数据文件 |
| `images/` | 新站点通过 jsDelivr 依赖：`Qart_CodeMonkey.gif`、`logo.png`、`coverpage.png` |
| `sponsor/images/` | 新站点关于页依赖：`AliPayQR.png`、`WeChatQR.png` |
| `ABOUT.md`、`LICENSE` | 本说明与许可声明 |
| `favicon.ico` | 站点图标的原始文件（已复制到 `WebBlog/public/`） |
| `FreeBorders.md` | **一篇原创文章**（Clash 客户端用法），但它不在 `blog/` 下，所以新站点读不到 —— 待决定是搬进 `blog/ToolBox/` 还是删除 |

> 注意：`images/` 里还有几个只服务于旧站点的文件（`2233.gif` 是 docsify 角标、
> `avatar_fuki/koko.jpeg` 是聊天插件头像、`cute_01.gif` 是复制弹窗配图），
> 合计约 1 MB。没有删是因为它们无害，且可能被你后续复用。

## 改文章的约定

**改 `blog/**/*.md` 就是在改线上内容。** 具体流程见 [WebBlog/README](../WebBlog/README.md)，
要点：

1. 新文章放 `docs/blog/<分类>/`，**不写 frontmatter 也能发** ——
   构建前的 `sync-content.mjs` 会自动补全标题、日期、标签、摘要；
2. `git commit && git push`，GitHub Actions 自动构建发布；
3. **不要用相对路径引用图片** —— 文件不存在会让构建直接失败。
   不确定就先跑 `cd WebBlog && npm run check`；
4. 想先不发：frontmatter 里加 `draft: true`。

## 与线上站点的关系

| 你改的东西 | 会影响线上吗 |
| --- | --- |
| `blog/**/*.md` | ✅ 会（内容源） |
| `images/`、`sponsor/images/` | ✅ 会（jsDelivr 直接分发，注意有缓存延迟） |
| `ABOUT.md`、`LICENSE` | ❌ 不会，只是仓库内的说明 |
| 其它任何文件 | ❌ 不会，本目录已无站点代码 |
