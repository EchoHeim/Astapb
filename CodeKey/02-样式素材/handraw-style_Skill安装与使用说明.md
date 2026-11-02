# handraw-style Skill 安装与使用说明

> 日期：2026-10-24  
> 作者：yang0 ｜ 原仓库：[yang0/handraw-style](https://github.com/yang0/handraw-style)  
> 本文说明 Codex 本地安装方式与常用操作。资源数量以安装包中的 JSON 为准。

## 1. 它是什么

这是一个图片创作 Skill 包，入口名称为 `handdraw-style-prompter`。它把风格、版式、主题色和参考图组合起来，帮助 AI 编写提示词、设计封面、规划文章配图、制作海报及角色设定。

核心资料库包含 **366 种视觉风格、170 种版式、36 种主题色**。这些编号用于明确创作要求，最终效果仍取决于生成模型、参考图和具体主题，并不保证每次出图完全一致。

默认只输出提示词。明确说“生成图片”或“直接出图”，才会调用当前客户端可用的生图工具。Skill 不附带模型、账号、密钥或生图额度。

## 2. 安装位置与生效方式

全局安装目录：

```text
C:\Users\Lodge\.codex\skills\handdraw-style-prompter
```

安装保留根目录 `SKILL.md`、`skills/`、`images/` 和配套脚本。不要只移动内层 Skill 文件，否则参考图和画廊路径可能失效。

本次已完成本地校验：366 条风格、170 条版式、36 条主题色；风格单图、版式提示词及版式/颜色图片路径检查无缺失。提示词脚本和参考图规则查询已运行通过。尚未调用生图服务。

> 2026-10-24 已升到 **v1.9.6**（新增图型 `IG-038` 万能信息图，版式 169 → 170），两处副本同步：
> Codex 侧 `C:\Users\Lodge\.codex\skills\handdraw-style-prompter`（完整包，含 `claude-motion/`、`output/`、`work/`），
> WorkBuddy 侧 `C:\Users\Lodge\.workbuddy\skills\handdraw-style-prompter`（Junction → `CodeKey\02-样式素材\handraw-style`，已剔除上述三个目录）。

安装完成后，**下一轮对话即可使用**。可以直接发送：

```text
使用 handdraw-style-prompter，为“周末在窗边读书的猫”设计插画提示词。
请推荐风格和主题色，输出中英双语提示词，暂时不生图。
```

如果没有自动识别，明确指定已安装入口：

```text
请读取 C:\Users\Lodge\.codex\skills\handdraw-style-prompter\SKILL.md，
按这个 Skill 为“周末在窗边读书的猫”生成提示词。
```

## 3. 浏览画廊

最方便的方式是在对话里说：

```text
使用 handdraw-style-prompter，打开风格画廊。
```

也可以在 Windows 文件资源管理器中进入下列目录，双击对应 HTML：

```text
C:\Users\Lodge\.codex\skills\handdraw-style-prompter\skills\handdraw-style-prompter\gallery
```

| 文件 | 用途 |
| --- | --- |
| `index.html` | 风格筛选与预览 |
| `layouts.html` | 版式筛选与预览 |
| `colors.html` | 主题色预览与提示词 |
| `tutorials.html` | 组合指令与使用场景 |
| `assets.html` | 素材库界面 |

预设画廊可本地浏览；社区、同步和在线服务需要网络及对应账号配置。

## 4. 最常用的三种操作

### 4.1 让 AI 帮你选

```text
使用 handdraw-style-prompter。
主题：周五下班后的小确幸。
用途：朋友圈配图；比例：1:1；情绪：轻松幽默。
请推荐风格和配色，解释选择理由，给出中英双语提示词。
```

不需要先记编号。补充用途、比例、受众和情绪，能让选择更有依据。

### 4.2 自己指定编号

```text
使用 handdraw-style-prompter。
图型：SC-001；风格：FB-006；主题色：C-01。
主题：秋天的第一杯奶茶；比例：3:4。
输出中英双语提示词，暂时不生图。
```

| 参数 | 编号示例 | 含义 |
| --- | --- | --- |
| 风格 | `FA-018`、`FB-006` | 笔触、质感和视觉语言 |
| 版式 | `SC-001`、`IG-001`、`SB-001` | 社媒卡、信息图、漫画分镜 |
| 其他版式 | `IP-001`、`EC-001` | IP 设计、电商图片 |
| 主题色 | `C-01`～`C-36` | 主色或点缀色 |

支持旧数字风格编号，例如 `041` 对应 `FB-006`。建议优先使用分类编号，便于检索。输入“主题色：C-26 + C-03”可请求主色与点缀色组合。

### 4.3 直接生成图片

```text
使用 handdraw-style-prompter。
风格：FA-018；主题色：C-26。
主题：猫咪在窗边晒太阳；比例：3:4；纯图模式。
请直接生成图片。需要参考图时，使用安装包内对应图片。
```

当前环境有生图工具时可执行；若工具不可用，仍可拿到提示词，在自己的生图平台使用。第三方平台需要参考图时，还要按提示上传图片，单独粘贴本地文件路径不能代替上传。

## 5. 纯图模式与图文模式

**纯图模式**适合文章插画、装饰图，不需要画面中的文字：

```text
纯图模式，风格 FA-018，主题色 C-26，主题：窗边读书的猫。
画面中不要文字，生成一张 4:3 插画。
```

**图文模式**适合金句卡、活动海报和封面：

```text
图文模式，风格 FA-018，主题色 C-26。
主题文案：“今天也要慢慢来”。比例 3:4。
文字参与构图，请直接生成图片。
```

需要精确保留文字时，写明“标题逐字保留”。生成后仍需检查中文、数字和标点。部分版式工作流会自动采用图文模式，最终要求以具体指令为准。

## 6. 常见场景指令

### 文章封面

```text
使用 handdraw-style-prompter，为下面文章设计公众号封面。
比例：2.35:1；先提炼摘要和受众，再推荐风格及配色。
主标题明显，小字少，先输出方案和提示词。
文章：[粘贴全文，或提供可读取的本地 Markdown 路径]
```

### 文章批量配图与回填

```text
使用 handdraw-style-prompter，为下面 Markdown 文章规划 3 张插图。
全篇使用同一风格和主色，比例 4:3。
标明插入位置、视觉构思和提示词，先给方案。
文章路径：[填写实际路径]
```

方案满意后继续：

```text
按上述方案生成全部插图，插入对应位置。
保留原稿，另存为 article_illustrated.md，并检查图片链接。
```

### 海报设计

```text
使用 handdraw-style-prompter，设计一张“秋日读书会”海报。
受众：城市青年；比例：3:4；信息密度：低。
标题逐字保留：“秋日读书会”。
推荐风格、主色和点缀色，先提供提示词。
```

### 技术文章信息图

```text
使用 handdraw-style-prompter，为“UART、SPI、I2C 的区别”设计信息图。
受众：嵌入式初学者；比例：4:3；中文图文模式。
先核对我提供的技术内容，再选适合三项对比的版式。
不要自行编造参数，先给布局和提示词。
```

涉及精确引脚、公式、时序和数据时，先核对内容，再出图；需要严格尺寸或接线正确性的图，优先采用可编辑绘图工具。

### 风格融合与角色设计

```text
使用 handdraw-style-prompter 做风格融合。
角色风格：FA-018；场景风格：写实摄影。
主题：一只简笔画猫在真实咖啡馆里工作，先给提示词。
```

```text
使用 handdraw-style-prompter 设计咖啡店吉祥物。
先给角色定位、视觉特征和配色，再规划三视图与表情卡。
先输出设计方案，暂时不生成图片。
```

## 7. 命令行用法（可选）

日常直接对话即可。需要确定性拼接提示词时，在 PowerShell 中运行：

```powershell
Set-Location 'C:\Users\Lodge\.codex\skills\handdraw-style-prompter'
python skills/handdraw-style-prompter/scripts/prompt_style.py --style FB-006 --color C-01 --theme '秋天的第一杯奶茶' --ratio 3:4
```

检查某个风格是否需要参考图：

```powershell
python skills/handdraw-style-prompter/scripts/resolve_reference.py --style FA-018 --model gpt-image-2
```

`--model` 在这里用于查询包内能力规则，不会下载或启动模型。CLI 的 `--auto` 是关键词评分，与对话中由 AI 进行的推荐不同。组合版式 CLI 的参考图输出还有局限，日常优先使用对话工作流。

阅读画廊不需要安装 Python 包。执行图像处理、重建图库等维护脚本时，项目声明需要 Python 3.10+、Pillow 和 PyYAML；本次安装不额外安装这些第三方依赖。

## 8. 常见问题

| 情况 | 处理方法 |
| --- | --- |
| 只返回提示词 | 明确说“直接生成图片”，并确认客户端有可用生图工具 |
| 没找到 Skill | 下一轮明确提及 `handdraw-style-prompter`；必要时提供第 2 节入口路径 |
| 参考图找不到 | 检查安装包是否完整，保留根目录与子目录结构；不要使用 README 中过时的示例路径 |
| 出图混入参考图主体 | 强调参考图仅用于笔触、材质与色彩，主体完全以当前主题为准 |
| 画风不稳定 | 固定编号、模型、配色和参考图，再逐项调整；编号不能完全消除生成差异 |
| 中文有错字 | 减少文案，明确逐字保留要求；需要精确成品时后期排字 |
| 社区和同步不可用 | 这些是可选在线功能，需单独配置服务，不影响本地预设资料使用 |

## 9. 更新与署名

本次使用官方 skill-installer 辅助脚本安装仓库根路径：

```powershell
python 'C:\Users\Lodge\.codex\skills\.system\skill-installer\scripts\install-skill-from-github.py' --repo yang0/handraw-style --ref master --path . --name handdraw-style-prompter
```

已有同名目录时，安装器会停止，不覆盖现有文件。需要更新时可直接对 Codex 说“更新 handraw-style Skill，先保留我的自定义素材和配置”。

使用、分发或二次开发时，保留作者 **yang0** 和[原仓库链接](https://github.com/yang0/handraw-style)。完整条款见安装目录中的 `LICENSE`。

## 10. 一条通用模板

```text
使用 handdraw-style-prompter。
用途：[文章封面 / 正文插图 / 社媒卡 / 信息图 / 海报]
主题：[要表达的内容]
受众：[给谁看]
比例：[4:3 / 3:4 / 1:1 / 16:9 / 2.35:1]
风格：[指定编号，或让你推荐]
版式：[指定编号，或让你推荐]
主题色：[指定编号，或让你推荐]
模式：[纯图 / 图文]
文字：[无文字，或逐字保留的标题]
交付：[只给提示词 / 先方案后出图 / 直接生成图片]
```
