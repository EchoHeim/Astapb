# Astapb · 个人知识分享库

> 互联网是有记忆的，我想留下一些成长的脚印。

一个仓库，三类内容：**知识博客**、**网站导航**、**公众号素材库**。

代码、原创图文、第三方资料在仓库内**分区域授权**，不存在单一的许可证 ——
判定规则见 [LICENSE](LICENSE)。

---

## 站点

| 站点 | 地址 | 源 | 说明 |
| --- | --- | --- | --- |
| MacLodge's Blog | <https://shilong.js.org/> | `WebBlog/` | Astro 构建，2026-09-18 起接管根路径 |
| 网站导航 AnywhereAnything | <https://shilong.js.org/aa/> | `WebSite/` | 纯静态 |

两个站点由**同一个 GitHub Pages 产物**提供 —— 因为一个仓库只能发布一个 Pages 站点，
所以这里用 Actions 把两部分拼进同一产物，靠子路径区分。

博客的文章源是 `docs/blog/` 下的 Markdown。**`docs/` 目录仍然保留在仓库里，
但不再对外发布** —— 它同时充当文章内容源与旧 docsify 站点的历史存档。
详见 [WebBlog/README](WebBlog/README.md)。

---

## 工作区

| 目录 | 内容 | 许可证 | 详细说明 |
| --- | --- | --- | --- |
| `WebBlog/` | 博客站（Astro，构建式）→ `/` | 代码 MIT<br>文章 CC BY-NC-SA 4.0 | [README](WebBlog/README.md) |
| `docs/` | 博客的**文章内容源**（`blog/**/*.md`）与站点图片资源；docsify 机制已于 2026-09-18 删除 | 文章 CC BY-NC-SA 4.0<br>站点代码 MIT | [ABOUT](docs/ABOUT.md) |
| `WebSite/` | 网站导航站（纯静态）→ `/aa/` | 代码 MIT<br>图标归原权利人 | [README](WebSite/README.md) |
| `CodeKey/` | 公众号「程序小猴」素材库 | **保留所有权利** | [README](CodeKey/README.md) |
| `scripts/` | 实用小工具（Python / Shell） | MIT | [README](scripts/README.md) |
| `LICENSES/` | 各许可证正文 | —— | [README](LICENSES/README.md) |
| `.github/` | CI 配置 | MIT | [README](.github/README.md) |

---

## 部署

推送到 `master` 后由 [`.github/workflows/publish.yml`](.github/workflows/publish.yml) 自动构建并发布：

```
docs/blog/  ──►  (内容源，不直接发布)
                    │
WebBlog/    ──►  astro build  ──►  WebBlog/dist/  ──┐
                                                     ├──►  _site/  ──►  GitHub Pages
WebSite/   ──────────────────────────────────────────┘

_site/      = 博客  →  https://shilong.js.org/
_site/aa/   = 导航  →  https://shilong.js.org/aa/
```

产物约 2 MB —— 过去的 docsify 产物的 1% 不到。原始 Markdown、
第三方考研资料与前端源码都不再进入发布产物。

**前置条件**：仓库 `Settings → Pages → Build and deployment → Source` 必须选择
**GitHub Actions**，否则 `deploy-pages` 会报 `Get Pages site failed`。

---

## 联系

| 渠道 | 地址 |
| --- | --- |
| 博客 | <https://shilong.js.org> |
| GitHub | <https://github.com/EchoHeim> |
| 邮箱 | shilong.native@foxmail.com |
| 微信公众号 | 程序小猴 |

---

## 历史

本仓库原本是一个嵌入式工程工具箱（`mfast` 交互式构建工具链，用于 H616 / STM32MP157 /
树莓派的编译与烧录），2026-09-18 提交 `39bbf28` 将其整体移除，转型为知识分享库。

那段代码仍保留在 git 历史中，可用 `git show 39bbf28` 找回；
它当时采用 GPL-3.0，其历史授权不受本次许可调整影响。
