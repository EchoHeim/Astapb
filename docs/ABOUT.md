# docs/ 工作区说明

> 本目录是 **MacLodge's Blog** 的源目录，线上地址 <https://shilong.js.org/>。

## 为什么这里叫 ABOUT.md 而不是 README.md

docsify 会把 **`README.md` 当作站点首页**渲染，所以 `docs/README.md` 已经被占用
（内容是个人简介、公众号二维码、赞赏码），它属于**站点内容**而不是维护说明。

因此本目录的维护说明单独放在 `ABOUT.md`，不参与站点渲染。

---

## 站点是怎么工作的

| 文件 / 目录 | 作用 |
| --- | --- |
| `index.html` | docsify 入口，所有插件与站点配置都在这里（`window.$docsify`） |
| `_coverpage.md` | 封面页 |
| `_navbar.md` | 顶部导航栏 |
| `.nojekyll` | 关闭 GitHub Pages 的 Jekyll 处理，否则 `_` 开头的文件会被过滤 |
| `CNAME` | 自定义域名 `shilong.js.org`（部署时由 workflow 在产物根重新写入） |
| `favicon.ico` | 站点图标 |
| `pwa.js` | 离线化支持（当前在 `index.html` 中被注释，未启用） |
| `README.md` | 站点首页（个人简介 / 公众号 / 赞赏） |
| `LICENSE` | 本目录的许可说明 |

启用的 docsify 能力：侧边栏、导航栏、封面、分页导航、字数统计、全文搜索、
页脚、emoji、图片缩放、代码复制、回到顶部、Live2D 看板娘、访问量统计。

**侧边栏与导航栏的规则**：docsify 会去**当前路径下**找 `_sidebar.md` / `_navbar.md`。
根目录没有 `_sidebar.md`，所以首页不显示侧边栏；进入 `blog/` 后会加载 `blog/_sidebar.md`，
再进入子分类又会加载该子目录自己的 `_sidebar.md`。

---

## 内容分区（`blog/`）

| 目录 | 内容 |
| --- | --- |
| `Catalog/` | 各分类的集中索引页（C++、Python、ToolBox、Android） |
| `Android/` | Android 开发随笔 |
| `C_C++/` | C++ 学习笔记、C 语言实用技巧 |
| `FPGA/` | Verilog 基础知识（环境、语法、状态机、编程规范） |
| `Linux/` | Linux 应用编程、小技巧、驱动调试、raspberryPi、stm32mp157 |
| `LVGL/` | LVGL 图形库笔记 |
| `NoteBook/` | Python 体系（入门 / 数据分析 / 数据结构）、Shell、正则、工具 |
| `Python/` | 实用脚本笔记（如自动上报本机 IP） |
| `ToolBox/` | Git、Klipper、Markdown、Shell 语法、域名与网络工具 |
| `project/` | 静态站生成器对比（Docsify / Docute / Hexo / Jekyll / VuePress） |
| `尚德机构-考研/` | ⚠️ **第三方付费课程资料**，未授权，见该目录 `LICENSE` |
| `港股打新/` | ⚠️ **第三方资料**，未授权，见该目录 `LICENSE` |

站点资源目录：`css/`（样式）、`js/`（脚本）、`plugin/`（本地插件）、
`images/`（图片）、`sponsor/`（赞赏页）。

---

## 新增一篇文章

1. 在对应分类目录下新建 `.md` 文件（例如 `blog/Linux/Linux小技巧/xxx.md`）；
2. 在**该分类的** `_sidebar.md` 里加一条链接 —— 不加链接文章不会被导航到，
   但全文搜索仍可能命中；
3. 提交并推送，workflow 会自动重新部署；
4. 注意：文章默认按 **CC BY-NC-SA 4.0** 授权，转载时请保留原文链接与出处。

`index.html` 里引用站点自身资源时请使用**相对路径**（如 `css/custom.css`），
不要用 `../` —— 一旦站点被移动到子路径，`../` 会立刻失效。

---

## 许可

| 内容 | 许可证 |
| --- | --- |
| 文章 `**/*.md`、原创图片 | CC BY-NC-SA 4.0 |
| 站点代码 `index.html`、`pwa.js`、`css/`、`js/`、`plugin/` | MIT |
| 第三方资料目录 | 未授权，不适用任何开放许可 |

许可正文见 [`../LICENSES/`](../LICENSES/) 与 [LICENSE](LICENSE)。

---

## 部署关系

本目录的内容会被 `.github/workflows/publish.yml` **整体复制到产物根目录**，
因此 `docs/index.html` 就是 <https://shilong.js.org/> 的入口页面。
修改目录结构时请同步检查 workflow 中的复制逻辑。
