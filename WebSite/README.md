# WebSite · 网站导航资源区

> 线上地址：<https://shilong.js.org/aa/>

一个**纯静态**的网站导航页：顶部是聚合搜索框，下方按分类平铺常用网站。

界面设计与交互灵感来自 [lackar.com/aa（AnywhereAnything）](http://lackar.com/aa/)——
喜欢那种"简约但不简单"的风格，原站又时常打不开，于是复刻了一份本地静态版。
感谢原作者的设计。

---

## 文件结构

| 路径 | 作用 |
| --- | --- |
| `index.html` | 页面骨架：搜索框 + 两个挂载点 `#searchItem`、`#content > div` |
| `main.js` | **站点数据**：搜索源 `SearchData` 与分类列表 `resource` |
| `create.js` | 渲染逻辑：把 `main.js` 的数据生成为 DOM |
| `style.css` / `mobile.css` | 桌面端 / 移动端样式 |
| `header/` | 每个分类的"推荐位"大图标 |
| `icon/<分类>/` | 分类下各站点的小图标 |
| `search/` | 搜索框那一排搜索引擎图标 |
| `img/` | 页面 Logo 等 |
| `LICENSE` | 本目录许可说明 |

数据与渲染是**分离**的：改内容只需要动 `main.js`，不用碰 `create.js`。

---

## 怎么加一个站点

1. 把图标放进**对应分类**的目录，例如加一个"知乎"到「知识」分类，
   图标就放 `icon/knowledge/zhihu.png`；
2. 在 `main.js` 的 `resource` 里找到那个分类，往 `content` 数组追加一条：

   ```js
   ["zhihu.png", "知乎", "https://www.zhihu.com/"],
   //   文件名      显示名       点击后打开的地址
   ```

3. 想加一个**新分类**，除了在 `resource` 里加一项，还要同步修改 `create.js` 里的
   `switch (obj.header)`，为新的分类名补一条 `case`，否则图标路径不会被拼出来。

想改搜索框里的搜索引擎，改 `main.js` 顶部的 `SearchData` 即可。

---

## ⚠️ 已知问题：部分分类图标会 404

图标路径是由**分类中文名**决定的（见 `create.js` 的 `switch`），
所以任何图标都必须放在与它所属分类同名的目录里。但 `main.js` 的数据当初是按
"图标可以跨分类复用"的思路写的，于是出现了不匹配：

| 分类 | 问题 |
| --- | --- |
| 数码 | `icon/digital/` 是**空目录**，引用的 `flickr.png` 不存在 |
| 网络 | `icon/net/` 是**空目录**，引用的 `openedv.png`、`fire.png` 不存在 |
| 其他 | `icon/others/` 是**空目录**，引用的 `openedv.png`、`MagoTV.png` 不存在 |
| 游戏 | `icon/game/` 只有 `epic.png`、`steam.png`，其余 13 条引用的图标都不在 |
| 旅行 | `icon/travel/` 只有 `googlemaps.png`，引用的 `bilibili.png` 不存在 |
| 工具 | `icon/tools/` 只有 `icon-icons.png`，引用的 `openedv.png` 不存在 |

结果就是这些条目只显示文字、不显示图标（不会报错中断）。
修复方式有两种：把缺的图标补进对应目录，或者把 `main.js` 里的文件名改成该目录中已有的图标。

---

## 部署

本目录**不是**独立站点 —— 它由 `.github/workflows/publish.yml` 复制到
Pages 产物的 `aa/` 子路径下，与博客共用同一个自定义域名。

因此页面内所有资源引用都是**相对路径**（`style.css`、`icon/...`），
迁移到子路径后依然可用；新增资源时也请保持相对路径。

> 历史：本目录原为独立仓库 `EchoHeim/AnywhereAnything`，
> 对应地址 `echoheim.github.io/AnywhereAnything/` 可能仍然在线。
> 若确认已合并，建议将旧仓库归档，避免两份拷贝各改各的。

---

## 许可

| 内容 | 许可证 |
| --- | --- |
| 代码（`*.html`、`*.js`、`*.css`） | MIT |
| `icon/`、`header/`、`search/`、`img/` 中的第三方 Logo 与商标 | 归各自权利人所有，此处仅作链接索引 |

详见 [LICENSE](LICENSE)。
