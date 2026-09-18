# .github · CI 配置

存放 GitHub Actions 工作流。目前只有一条：把两个站点构建成单一产物并发布到 GitHub Pages。

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
| `push` 到 `master` 但**只改了 `CodeKey/**`** | **跳过**（`paths-ignore`）—— 产物 400+ MB，更新素材没必要重新部署 |
| 手动触发 | Actions 页面 → 该工作流 → Run workflow（`workflow_dispatch`） |

### 产物结构

```
_site/                        →  https://shilong.js.org/
├── index.html                    博客入口（来自 docs/）
├── blog/  css/  js/  images/ ... 博客内容
├── CNAME                         自定义域名（部署时写入）
├── .nojekyll                     关闭 Jekyll
└── aa/                        →  https://shilong.js.org/aa/
    ├── index.html                导航站入口（来自 WebSite/）
    └── style.css  main.js  icon/ ...
```

复制过程中会清理 `_site/aa/.workbuddy` 与 `_site/aa/README.md`，避免把本地目录
和维护文档一起发布出去。

### 两个作业

| 作业 | 步骤 |
| --- | --- |
| `build` | 检出（`fetch-depth: 1`，不拉完整历史）→ 拼装 `_site` → `configure-pages@v5` → `upload-pages-artifact@v3` |
| `deploy` | 依赖 `build` → `deploy-pages@v4`，输出到 `github-pages` 环境 |

---

## 使用前提（容易漏）

**必须在仓库 `Settings → Pages → Build and deployment → Source` 中选择
"GitHub Actions"**，否则 `deploy-pages` 会失败并提示
`Get Pages site failed`。

页面当前若仍是"从分支 `master` 的 `/docs` 目录发布"，切到 Actions 之前站点正常，
切换后旧方式立即失效 —— 需要一次成功的部署才能恢复访问。

推荐的切换顺序：

1. 提交并推送（此时 `build` 成功、`deploy` 失败，属预期）；
2. 到 Settings 把 Source 改成 **GitHub Actions**；
3. 在 Actions 页面手动 **Run workflow**；
4. 确认 <https://shilong.js.org/> 与 <https://shilong.js.org/aa/> 均可访问，
   并检查自定义域名与 Enforce HTTPS 仍正常。

---

## 可选优化

工作流的拼装步骤里留了一行被注释的脚本：

```bash
# rm -rf "_site/blog/尚德机构-考研" "_site/blog/港股打新"
```

取消注释即可把两个第三方资料目录排除出产物，部署体积约减少 **400 MB**，
构建与上传速度会显著提升。前提是接受这两个目录的线上链接失效。

---

## 许可

**MIT**，正文见 [`../LICENSES/MIT.txt`](../LICENSES/MIT.txt)。
