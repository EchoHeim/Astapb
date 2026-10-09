# Astapb 仓库级备忘

> 分家：本文件只放**全仓库共有**的东西。博客专属（Astro 坑、内容目录、AI 简报、前端）在
> `WebBlog/.workbuddy/memory/MEMORY.md`，日志同理写 `WebBlog/.workbuddy/memory/YYYY-MM-DD.md`。

## 定位与部署
`WebBlog/`=Astro 博客（源 `docs/`，根路径 `/`）；`WebSite/`=导航站（Vite+TS，`/aa/`）；
`CodeKey/`=公众号「程序小猴」资产库；`scripts/`=小工具。
GitHub Pages + `shilong.js.org`。`publish.yml`：`WebBlog/dist/.`→根、`WebSite/dist/.`→`/aa/`，Node 22，
前提 Pages Source="GitHub Actions"。**`paths-ignore` 不能写 `CodeKey/**`**（否则日报不触发构建）；
现在逐个列 `CodeKey/01~05`，**故意不含 `CodeKey/AI 日报/**`**。

## 导航站 WebSite
零 UI 框架。图标池 `import.meta.glob('/icon/**/*.png')`，key=文件名；缺图标→首字母色块，
**不许用别家 logo 顶替**。`scripts/verify-icons.mjs`（prebuild）坏图标 exit 1。
主题契约 `data-theme` + `data-theme-key="nav-theme"` + 内联防闪脚本；`tokens.css` dark 值是旧站原值。

## CodeKey 结构（2026-10-09 重整，编号 01–05）
```
01-IP形象/      品牌资产（微信表情包三套 + _专辑封面与感谢图/）
02-视觉素材/    封面与版式模板/ + 正文插图/（原 02+03 合并，都是图）
03-选题与成稿/  ★ 根层=方法论（选题池/标题库/金句库/固定模块），子目录=成稿（实用软件分享/、技术干货/）
04-运营方案/    当前有效：运营方案_v2 + 数据诊断_v4 + 后台数据速读；_归档/=已取代；tools/改名脚本
05-发布登记/    ★ 发布登记表.csv + 往期数据.csv(发布总结) + check-publish/check-style
AI 日报/        ⚠️ 刻意留在编号外：sync-ai-brief.mjs 读它生成博客简报，挪进 03 会被 paths-ignore 吞掉→静默停更
```
**规则不凭记忆：后台操作与文案看 `03-选题与成稿/固定模块.md`；板块架构与选题标准看 `选题池.md` 顶部。**

### 已验证的结论
- **搜索型账号**：搜一搜占阅读 72%，粉丝推送 9%；227 粉×0.44% 打开≈每篇推送只换 1 个阅读。
  选题与**标题**的第一标准都是「有人会去搜吗」（同模板同时段，带热门实体的 19 vs 冷门 2~4）。
- **只跑 2 个板块**：主力「实用软件分享」（群发）+「AI 日报」（只发布不群发，搜一搜照常收录）。
  工具文**爬坡型**→14 天回填；日报**脉冲型**（当天占 73%）→7 天回填。改看**平均停留时长**，不看完读率。
- **同实体连着写必扑**（图吧 264→4、真武V900 4→3），**同品类也不行**（决策模型连做两期）。
- 09-25 双发对照：工具文 51 vs 日报 3（17 倍），工具文还带来新增关注 2 人。
- **已撤回**：「带版本号标题赢 63 倍」「新格式赢 73%」「完成率 57~75% 是健康线」——都是小分母/混淆产物。
- **权威数据是后台导出，不是仓库台账**（09-20 有幽灵记录）。两份 CSV 均 UTF-8 BOM + CRLF。
- **★ 登记标题必须抄后台「已发表文章」列表，别抄本地文件 H1**（10-09 实证：lodge 发布时常精简标题，
  10/1、9/28、9/29 三处本地标题与后台都对不上；9/30 登记过的那篇后台发表数=0，疑似没发出去）。
- **稿子文件名日期 ≠ 发布日**：比对要拿 H1 标题日期对登记表 `发布日期`；发布后把文件名改回真实日期。

### 写稿与发布纪律
- 发布前必跑 `check-publish.mjs`（五道检查：同日同平台/主题标识/标题 bigram/关键词/**实体重合 lcs**）。
  **润色第一步就跑它**，别先改字。盲区：lcs<4 的短实体（骁龙/千问）不报；**登记表漏登=闸门失效**；
  发文前仍要手动 Read 最近 3 天日报逐条对实体。
- 日报骨架：三条主稿 + **📰 一句话快讯**（被刷掉的条目降级，不删）+ 往期精选 + 固定模块。
  字数两套口径：正文+快讯 1000~1200；`_正文.md` 全文 1300~1500；工具文 1600 上下。别目测，跑 `check-style.mjs`
  （**参数要带子目录**：`"2026.10/AI日报_10月1日_正文.md"`）。
- 点评默认**精简犀利**：100~140 字，第一句直接给判断。合辑先按事件去重再选稿。
- **去 AI 味只对散文正文生效**，固定模块是免检区。技术文的 AI 味在句式（冒号式下定义、每节结尾升华句、
  通篇第三人称），**扫描 0 命中 ≠ 没 AI 味**。标题里的冒号也算违规（用 `|` 或逗号）。
- 润色必须同步排版 HTML：用「替换数组 + 命中计数」脚本，结果写 `_tmp/` 再 Read（本机 stdout 不回显）。
- 工具实测稿要附**事实核证表**；三件套 = 存档 `.md` + `_正文.md` + `_排版.html`。
  HTML 交付后用无头 Chrome 注入探针量 `scrollWidth` 查横向溢出。

## 风险
- **凭据泄漏（必须轮换）**：`scripts/report_ip/autoemail.py` SMTP 授权码、`scripts/test.sh` WiFi 密码，已进 git 历史。
- 考研/港股第三方资料公开托管（侵权风险）；`.git` 约 357 MB（删文件不减体积，只能 `filter-repo`）。

## 许可
站点代码/`.github`=MIT；`WebBlog/docs/**/*.md` 与原创图=CC BY-NC-SA 4.0；`CodeKey/`=保留所有权利；
`WebSite/icon|header|search/`=第三方商标仅作索引。

## 环境坑
本机 bash 无 coreutils、**无 `grep`/`cat`**；PowerShell 不回显 stdout 且会把 UTF-8 按 GBK 解码
→ **文件操作与读输出一律走 node 写文件 + Read 工具**；命令行正则会被 shell 吃掉反斜杠，一律写成 `.mjs`。
`git config core.quotepath false`。无头 Chrome 截图见 skill `local-html-visual-verify`。
**本机无 `gh` CLI**，取仓库数据用 `curl -s https://api.github.com/repos/<owner>/<repo>` 喂 node。
**核 GitHub 项目**：README 之外必须再拉 `docs/`、`LICENSE*`、release notes——README 标题里的数字
经常只对子功能成立；「文档自带的性能表是空的」也是一等事实。
**同一文件禁止并行 Edit**（会互相覆盖且都报成功）；多处修改要么串行要么 Write 整份重写，改完做 diff 校验。
读后台 .xls 用 `xlrd`（venv：`C:\Users\Lodge\.workbuddy\binaries\python\envs\default\Scripts\python.exe`，
`sh._cell_values` 参差不齐，取值要包安全层）。**微信导出的两个 xls 格式居然不一样**：
`tendency_*.xls` 是**真 BIFF8**（OLE2 魔数 d0cf11e0，xlrd 可读），`user_analysis.xls` 是 **HTML 伪装的**
（要吃 HTMLParser 解析）。趋势表同一 sheet 里并排三块（渠道趋势/每日互动/单篇来源），
**块之间有空分隔列，所以列索引要 +1**：块1=1,2,3 块2=5,6,7,8,9 块3=11,12,13,14,15；
且第三块是「文章×渠道×天」长表，同一标题跨天多行，**聚合必须累加不能覆盖**。
**sheet MCP 工具的文件根在 D: 盘，读不了 C:\Users\...\Downloads 下的文件**，先 cp 到工作区再处理。

### npm / 构建
1. esbuild 的 postinstall 被沙箱拦 → **`--ignore-scripts`** 绕过（平台二进制随包发，不依赖 postinstall）。
2. 中断过的 install 会写坏 `_cacache`，之后 `--prefer-offline/online` 都静默复用坏条目。
   修法：按 lock 的 `resolved` 直下 tarball，校验 `integrity`（是 tarball 的 sha512，非单文件）后自己解包。
3. **safe-delete guard 拦 >50 文件的批量删除**：`astro build` 报 `.prerender` 清理失败时页面其实已生成完
   （本博客 139 张 `index.html`+404）；**别用 `npm ci`**，改「删单个坏包 + 重装那一个」。

### git push
沙箱会拦 `C:\Users\Lodge\.ssh\*` 读取。先试前台放行；被常驻规则拒了就**别重试**，让用户自己 push。
`https` 远端无凭据；GitHub 连接器是**只读**（403）。→ **本机推不了，交给 lodge 跑 `git push origin master`。**
