# Astapb 项目长期备忘

## 定位（2026-09-18 重组后）
个人知识分享库，一个仓库承载三类内容：
| 路径 | 职责 |
| --- | --- |
| `docs/` | 个人知识博客（docsify，hash 路由，_sidebar/_navbar/_coverpage） |
| `WebSite/` | 网站导航资源区（纯静态，复刻 lackar.com/aa，标题 AnywhereAnything） |
| `CodeKey/` | 公众号「程序小猴」素材库（微信表情包 / AI 日报，图片为主） |
| `scripts/` | Python/shell 小工具（report_ip 自动上报本机 IP） |

- 远程 `EchoHeim/Astapb`，GPL-3.0，主分支 `master`，作者别名 MacLodge。
- 博客线上域名 `shilong.js.org`（**docs/CNAME 的存在说明 Pages 发布源 = master 的 /docs 目录**）。
- 导航站旧地址 `echoheim.github.io/AnywhereAnything/` 实测仍存活 → 独立仓库可能仍在，存在两份拷贝漂移风险。
- `.github/workflows/publish.yml`：Actions 构建**单一产物**并发布 —— 博客 `docs/` 放产物根，
  导航 `WebSite/` 放 `/aa/`。旧的同名无扩展名文件已删除。
  **前提：仓库 Settings → Pages → Source 必须选 "GitHub Actions"**，否则 deploy-pages 报错。
  CNAME 由 workflow 写入产物根（`echo shilong.js.org > _site/CNAME`），不再依赖 `docs/CNAME`。
- `docs/index.html` 的样式引用已由 `../css/custom.css` 修正为 `css/custom.css`。

## 已废弃内容（历史，勿再引用）
2026-09-18 提交 `39bbf28` 把旧的 `mfast` 构建工具链整体删除：
`mfast` / `mfast.cfg` / `mfast_ui/`(8) / `mfast_fun/`(7) / `shell/`(36) / `src/`(6 个 C 驱动样例) / `Records.md`。
这些文件仍在 git 历史中，可 `git show 39bbf28 --stat` 找回。根 `README.md` 尚未更新，仍写着 MFAST 简介。

## 体积（关键约束）
| 项 | 大小 |
| --- | --- |
| `docs/` | 415.5 MB（134 个考研资料 + 28 个港股打新 PDF/PPTX） |
| `.git/` | 356.8 MB（历史大文件不可回收，删文件不减仓库） |
| `CodeKey/` | 17.1 MB / 65 个文件 |
| `WebSite/` | 0.6 MB |

## 平台事实（已实测）
- jsDelivr 当前**正常服务**本仓库：`docs/css/custom.css`、`docs/images/logo.png`、`docs/js/search.js` 均 200。
  官方限制：单文件 >20 MB 不加速、包 >50 MB 不支持 —— 大文件勿放被 CDN 引用的目录。
- GitHub：单文件 >100 MB 直接拒绝；仓库建议 <1 GB。当前最大单文件 81.46 MB，已很接近。
- GitHub Pages：**一个仓库只能发布 1 个站点**（分支目录或 Actions 产物其一），且只能绑 1 个自定义域名。

## 约定
- 中文目录/文件名 → 建议 `git config core.quotepath false`。
- `.gitignore` 已加 `.workbuddy/_*`，避免本地扫描临时文件被误提交（`.workbuddy/memory/` 仍需跟踪）。
- **许可分层（根 LICENSE 为总览，区域 LICENSE 优先）**：
  | 区域 | 许可证 |
  | --- | --- |
  | `scripts/`、`.github/`、站点代码 | MIT（`LICENSES/MIT.txt`） |
  | `docs/**/*.md`、原创图片 | CC BY-NC-SA 4.0（`LICENSES/CC-BY-NC-SA-4.0.md`） |
  | `CodeKey/` | 保留所有权利 |
  | `WebSite/icon|header|search/` | 第三方商标，仅作链接索引 |
  | `docs/blog/尚德机构-考研/`、`港股打新/` | 第三方资料，未授权，不适用任何开放许可 |
  GPL-3.0 已废弃（原属已删除的 mfast 工具链，其历史不受影响）。
- 部署/许可相关文件改动后，仍需用户在 GitHub 侧手动切换 Pages Source 与完成 `git push`。
