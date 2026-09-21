# 把 Windows 终端变得又好看又好用：Oh My Posh 推荐

> **还在面对 `PS C:\Users\xxx>` 这样朴素的命令行？**
>
> 今天分享一个非常适合 Windows 开发者的开源工具——**Oh My Posh**。
>
> 它不仅能让 PowerShell 变得更漂亮，还能直接在命令提示符里显示 **Git 分支、代码状态、当前目录、开发环境、命令执行结果、运行时间**等信息。
>
> 对经常使用 Windows Terminal、PowerShell、Git 和 VS Code 的开发者来说，它属于那种**装完以后很容易一直用下去**的小工具。

---

## ✨ 一、Oh My Posh 是什么？

Oh My Posh 是一个**开源、跨平台、跨 Shell 的命令行提示符主题引擎**。

简单来说，它负责改造我们每天都会看到的这一行：

```text
PS C:\Users\Lodge>
```

安装并配置 Oh My Posh 后，可以变成：

```text
 lodge  D:\Projects\GlueDetect   main +2 ~1 
❯
```

看起来只是“终端美化”，实际上它做的事情远比换个颜色复杂。

比如进入一个 Git 项目后，它可以自动显示：

- 📁 当前工作目录
- 🌿 当前 Git 分支
- 📝 文件修改状态
- ✔️ 上一条命令是否执行成功
- ⏱️ 命令执行耗时
- 🐍 Python 环境
- 🟢 Node.js 版本
- 🐹 Go 开发环境
- 🕐 当前时间
- 💻 用户及系统信息

所以与其把它叫作“终端皮肤”，不如把它理解成：

> **给命令行增加了一条动态的开发状态栏。**

---

## 🚀 二、它为什么值得推荐？

### 1. Windows 用户体验非常好

虽然名字里带有 `Posh`，而且最初与 PowerShell 有很深的关系，但现在的 Oh My Posh 已经是一个真正的跨平台工具。

在 Windows 下，一个非常舒服的组合就是：

```text
Windows Terminal
      +
PowerShell 7
      +
Oh My Posh
      +
Nerd Font
```

如果你平时经常使用 Windows Terminal、VS Code 终端、Git，那么这一套组合非常合适。

---

## 🎨 三、它不仅仅是“让终端变漂亮”

很多人第一次看到 Oh My Posh，注意到的都是它漂亮的 Powerline 风格：

```text
 Windows  lodge  D:\Code   main 
```

但真正使用一段时间以后，会发现它更有价值的是**信息展示能力**。

比如正在开发一个项目：

```text
D:\Projects\MyProject
```

普通 PowerShell 可能只是：

```text
PS D:\Projects\MyProject>
```

Oh My Posh 则可以直接告诉你：

```text
D:\Projects\MyProject   main +3 ~2  ✔  14:32
❯
```

不用额外输入命令，就已经知道当前分支、文件修改情况、上一条命令执行状态以及当前时间。

对于每天需要频繁操作 Git 的开发者来说，这种体验非常舒服。

---

## 🌿 四、Git 用户尤其值得安装

Oh My Posh 对 Git 的支持是它非常实用的一部分。

进入 Git 仓库后，它可以自动显示：

```text
main +2 ~3 ↑1
```

用来提示当前仓库的分支、修改以及远程同步状态。

这样在多个项目之间来回切换时，不需要频繁执行：

```bash
git status
```

就能快速判断当前仓库的大致状态。

如果你每天都在 VS Code、Git、GitHub、PowerShell 之间切换，这项功能非常实用。

---

## 🧩 五、它的核心设计：Segment

Oh My Posh 的一个重要概念叫做 **Segment（片段）**。

可以把整个命令提示符理解成一组小组件：

```text
[系统] [用户] [目录] [Git] [Python] [状态] [时间]
```

每一个组件都可以：

- 单独开启或关闭
- 设置颜色
- 修改图标
- 修改显示格式
- 根据条件决定是否出现

所以你完全可以做一个信息丰富的终端，也可以做成非常克制的：

```text
D:\Code\Project   main
❯
```

**终端首先是生产力工具，其次才是桌面装饰品。**

---

## 🖌️ 六、官方已经准备了大量主题

如果不想自己从零配置，也完全没问题。

Oh My Posh 仓库本身就带有大量现成主题，例如：

```text
tokyo
tokyonight_storm
unicorn
wholespace
ys
……
```

直接选择喜欢的主题，然后在此基础上修改即可。

官方主题数量已经非常丰富，项目贡献文档甚至明确表示暂时不再接受新的主题加入。

所以对于第一次使用的人，我不建议一开始就研究几十项配置。

最简单的方法就是：

```text
找一个喜欢的主题
        ↓
直接使用
        ↓
删除不需要的模块
        ↓
调整颜色和图标
```

十几分钟就可以得到一套属于自己的终端。

---

## 🔤 七、想获得完整效果，建议安装 Nerd Font

如果安装 Oh My Posh 后看到 `□`、`�` 之类的乱码，不一定是软件出了问题，很可能只是字体不支持相关图标。

Oh My Posh 大量使用 Nerd Font 中的特殊字符，例如：

```text



```

因此建议搭配 Nerd Font 使用。

比较常见的选择有：

- JetBrainsMono Nerd Font
- CaskaydiaCove Nerd Font
- MesloLGM Nerd Font

安装完成以后，再到 Windows Terminal 中把终端字体修改为对应字体即可。

---

## ⚡ 八、它为什么不会把终端搞得特别卡？

命令提示符每执行一次命令，都需要重新生成。如果一个 Prompt 每次都执行大量 Shell 脚本，终端很容易变得迟钝。

Oh My Posh 的核心程序主要使用 **Go** 编写，并编译为原生程序。

整体架构更接近：

```text
Shell
  ↓
Oh My Posh
  ↓
读取配置
  ↓
获取 Git / 系统 / 开发环境信息
  ↓
Segment 渲染
  ↓
输出 Prompt
```

项目内部还专门实现了 Git 状态、缓存、颜色、配置和 Prompt 等模块。

所以它不是一个简单堆砌 Shell 脚本的“美化插件”，而是一套比较完整的 **Prompt Engine**。

当然，如果自己配置几十个需要访问网络或者扫描文件系统的 Segment，依然可能影响速度。

> **够用就好，不要为了炫技把所有功能全部打开。**

---

## 💻 九、PowerShell 不是唯一选择

Oh My Posh 现在并不局限于 PowerShell。

它支持包括：

```text
PowerShell
Bash
Zsh
Fish
……
```

这意味着同一套 Prompt 思路可以跨 Windows、Linux、macOS 使用。

对于同时使用 Windows + WSL + Linux 服务器的开发者来说尤其方便。

---

## 🛠️ 十、这个开源项目本身也很值得学习

如果你不仅想使用软件，还喜欢研究优秀开源项目，那么 Oh My Posh 的源码同样值得看看。

目前它的核心主要采用 Go 开发，项目中可以看到：

```text
src/
├── cache/
├── cli/
├── color/
├── config/
├── gitstatus/
├── prompt/
└── ...
```

同时项目还有：

```text
website/
themes/
e2e/
.github/
.devcontainer/
```

它拥有 CI/CD、自动测试、E2E 测试、代码检查、自动发布、Dev Container、完整文档、主题系统和 Web 工具。

项目中还加入了 `.agents/`、`AGENTS.md`、`apm.yml` 等内容，开始将 AI Agent 和开发技能管理纳入项目协作流程。

从软件工程角度来看也很有参考价值。

---

## 📜 十一、开源，而且是 MIT License

Oh My Posh 使用非常宽松的 **MIT License**。

对于普通用户来说意味着：**免费、开源，可以自由使用。**

对于开发者来说，也可以阅读源码、修改源码、二次开发、学习架构以及用于商业项目。

因此它不仅是一款实用工具，也是一个不错的 Go 开源项目学习案例。

---

## 🆚 十二、Oh My Posh 和 Starship 怎么选？

如果研究过终端美化，可能还听说过另一个非常著名的项目：**Starship**。

| 特点 | Oh My Posh | Starship |
|---|---|---|
| 跨平台 | ✅ | ✅ |
| 跨 Shell | ✅ | ✅ |
| Windows | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Git 信息 | ✅ | ✅ |
| 高度自定义 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 主题丰富度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 配置难度 | 稍高 | 相对简单 |
| Powerline 风格 | 非常丰富 | 丰富 |

如果希望简单、快速、少折腾，可以看看 Starship。

如果更在意高度自定义、丰富主题、Powerline 视觉效果以及 Windows + PowerShell 体验，那么 Oh My Posh 非常值得尝试。

---

## 🎯 十三、推荐一个比较实用的搭配

对于 Windows 开发环境，我比较推荐：

```text
Windows 11
      ↓
Windows Terminal
      ↓
PowerShell 7
      ↓
Oh My Posh
      ↓
JetBrainsMono Nerd Font
```

Prompt 不需要搞得特别复杂。

例如：

```text
lodge  D:\FPGA\GlueDetect   main +2 ~1
❯
```

保留几个真正有用的信息就够了：

- 📁 当前目录
- 🌿 Git 分支
- 📝 Git 修改状态
- ✔️ 命令执行状态
- ⏱️ 执行耗时
- 🕐 当前时间

干净、清晰，又能提高开发效率。

---

# 最后

Oh My Posh 给人的第一印象通常是：

> **“这个终端真好看。”**

但真正使用之后，会发现它最大的价值其实不是“好看”，而是：

> **把开发过程中经常需要查看的信息，直接放到了命令提示符上。**

Git 分支、文件状态、目录、运行环境、执行结果……

这些原本需要输入额外命令才能获得的信息，现在抬眼就能看到。

对于每天都要和 Windows Terminal、PowerShell、Git、VS Code 打交道的人来说，确实值得折腾一次。

如果你觉得 Windows 默认的：

```text
PS C:\Users\xxx>
```

已经看腻了，不妨试试 Oh My Posh。

可能只需要十几分钟，就能让每天都要面对的命令行焕然一新。🚀

---

## 🔗 项目信息

- **项目名称：** Oh My Posh
- **GitHub：** https://github.com/JanDeDobbeleer/oh-my-posh
- **官方文档：** https://ohmyposh.dev/
- **开源协议：** MIT
- **主要开发语言：** Go
- **支持平台：** Windows / Linux / macOS
- **适合人群：** 程序员、运维、Git 用户、PowerShell 用户、终端重度用户
