# aa（AnywhereAnything）站点补录说明

2026-09-22 从 [lackar.com/aa](http://lackar.com/aa/) 补录站点数据到本项目。本文记录
**数据从哪来、怎么去重、哪些没要、为什么**，方便日后核对或补做。

---

## 1. 数据来源

**原站已经下线了**，`lackar.com` 现在整站返回 DreamHost 的 `Site not found`，
连首页也一样。Wayback Machine 在本机网络下不可达（代理 502）。最终走通的是
**Common Crawl**：

| 项 | 值 |
| --- | --- |
| 索引 | `CC-MAIN-2019-18` |
| 抓取时间 | 2019-04-22 |
| 抓到的 URL | `http://lackar.com/aa/?utm_source=mindstore.io` |
| WARC | `crawl-data/CC-MAIN-2019-18/segments/1555578551739.43/warc/CC-MAIN-20190422095521-20190422121521-00281.warc.gz` |
| 记录偏移 | `offset=101864860`，`length=13557` |

复现方式（HTTP Range 只取那一条记录，不用下整个 WARC）：

```bash
# 1. 查索引
https://index.commoncrawl.org/CC-MAIN-2019-18-index?url=lackar.com&matchType=domain&output=json
# 2. 按 offset/length 取字节区间，再 zlib 解 gzip
https://data.commoncrawl.org/<上一步的 filename>   # 请求头加 Range: bytes=<offset>-<offset+60000>
```

拿到的是完整 HTML，`<div class='catalog'>` 一个分类一块，分类名在
`<p class='catalogname'>`，站点在带 `id` 属性的 `<img class=subicon>` 里。
共 **17 个分类、约 250 个条目**。

> 原站的数据模型是「**在这个站里搜**」——每个条目存的是站内搜索模板（`id` 只是
> 查 URL 表的键，真正的地址在 `open_link.js`）。本项目要的是「跳转到站点首页」，
> 所以补录的是**首页地址**，而不是原站那套搜索模板。`open_link.js` 没有进
> Common Crawl（只抓到了 HTML），但首页地址本来就不需要它。

---

## 2. 去重规则

按**域名**去重（忽略 `www.` 前缀），而不是严格按 URL 字符串：

- `https://www.wikihow.com/` 与原数据的 `https://www.wikihow.com/Main-Page` 视为同一站，
  不新增；
- 子域算不同站，`movie.douban.com` 与 `www.douban.com` 互不冲突。

结果：

| | 数量 |
| --- | --- |
| 原有条目 | 97 |
| aa 条目里判定为重复、未新增 | 3（Kindle 书店、豆瓣相册、Fast Company 与已收录站点同域） |
| 实际新增 | **162** |
| 补录后总计 | **259**（20 个分类） |

**原有 97 条一条都没改**：分类、顺序、名称、URL、图标键全部原地保留。
这一点有脚本兜底 —— 见 `src/data/categories.ts` 的注释。

---

## 3. 分类映射

aa 有 17 个分类，和本项目不完全对得上，按下面的规则落位：

| aa 分类 | 落到本项目 |
| --- | --- |
| 知识 / 社交网络 / 新闻 / 购物 / 编程 / 书籍 / 音乐 / 视频 / 游戏 / 图片 / 旅行 / 科技数码 / 其他 | 各自的同名分类（科技数码 → **数码**，设计艺术 → **设计**） |
| 电影 / APP / 传统搜索 | **新建**为 `电影` / `应用` / `搜索` 三个分类 |

新分类的推荐位图标：

| 分类 | 推荐位 | 图标来源 |
| --- | --- | --- |
| 电影 | 豆瓣电影 | 豆瓣电影的 favicon 与豆瓣主站是同一个文件，直接复用项目已有的 100×100 豆瓣图标 |
| 应用 | App Store | `apps.apple.com/apple-touch-icon.png`（180×180） |
| 搜索 | Google | 复用项目已有的 100×100 Google 图标 |

三个新分类排在锚点导航最后，**原有 17 个分类的顺序没动**。

---

## 4. 图标策略

新增的 162 条里，**只有 CocoaChina 用上了真实图标**（项目图标池里本来就有
`cocoachina`）。其余一律**不写 `icon`**，渲染成首字母色块。

这是刻意的：项目图标池里剩下的公司 Logo 大多是别家的，把它们套到新站点上比留白
更糟（这正是 `README` 里「已知问题」在反省的事）。想补真实图标时，把文件丢进
`icon/<任意目录>/`，再在数据里填上键名即可 —— 键名写错构建会失败，不会静默留白。

补录后：有图标 75 条，首字母兜底 184 条。

---

## 5. 刻意跳过的条目

| 分类 | 条目 | 原因 |
| --- | --- | --- |
| 知识 | Wikia | 已并入 Fandom，与 Fandom 同域 |
| 知识 | Lynda | 品牌停用，并入 LinkedIn Learning |
| 设计 | ArtStack | 站点已关闭 |
| 设计 | Designer News | 实测返回 402，站点已停 |
| 设计 | Co.DESIGN | 与「数码 / Fast Company」同域，只保留后者 |
| 社交 | Google+ | 已关停 |
| 社交 | 微信公众号文章、豆瓣(Google) | 原站是用 Google 搜某站的**模板**，不是站点 |
| 新闻 | 端 | 内容取向原因，不收录 |
| 购物 | 一号店 / Tictail / VeryGoods / Thngs | 已关停（一号店实测仍可访问，但因为已并入京东，一并跳过） |
| 编程 | Alexa | alexa.com 已于 2022 年关停 |
| 应用 | App Annie / Windows Phone 应用 / KNICKET | 已改名停服 / 平台停止支持 / 站点关闭 |
| 书籍 | Kindle 书店 / 爱看豆 / 微盘 | 与亚马逊同域 / 已关闭 / 新浪微盘个人服务关停 |
| 音乐 | Grooveshark / 虾米音乐 | 已关停（虾米原本是 aa 的推荐位） |
| 图片 | 新浪微博图片 / Corbis | 是微博图片搜索模板 / 已被视觉中国收购关闭 |
| 旅行 | Panoramio / 面包旅行 / 蝉游记 | 已关停 / 已停服 / 已停服 |
| 搜索 | AviraSearch / Thinga / Google 2 / Gmail | 已下线 / 已关闭 / 与 Google 重复 / 不是搜索引擎 |
| 数码 | gdgt / AllThingsD | 已关停 / 已停刊 |
| 其他 | StumbleUpon / 糗事百科 | 已关停 |

判定方式：对全部候选 URL 发 HTTP 请求，`404`（下厨房是反爬，非真 404）、
`402`、DNS 失败等视为可疑；`403` / `405` / `202` 属于反爬或 Cloudflare 挑战，
站点是活的，保留。

---

## 6. 与原有数据的关系

- 原有 97 条：**未改动**。
- 新增 162 条：全部追加在各分类 `sites` 数组末尾，并在前面加一行
  `// ---- 以下为 aa 补录 ----` 分隔，方便日后辨认与回滚。
- 新增条目**不再引入重复 URL**。补录后文件里剩余的 5 处重复 URL 全部是原有数据
  自带的（知乎跨「知识/社交」、Pinterest 推荐位与「设计」、Bilibili 跨「视频/旅行」、
  `kernel.org` 被三个分类当推荐位），本次没有动它们。
