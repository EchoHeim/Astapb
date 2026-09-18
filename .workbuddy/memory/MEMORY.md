# Astapb 项目长期备忘

## 定位
个人嵌入式工程工具箱 + docsify 知识博客。GPL-3.0，远程 `EchoHeim/Astapb`，
部署域名 `shilong.js.org`（docs/CNAME）。作者别名 MacLodge，公众号「程序小猴」。

## 目录职责
| 路径 | 职责 |
| --- | --- |
| `mfast` | 主程序入口（bash），MFAST_VER 版本号在此 |
| `mfast.cfg` | 运行期可变配置：主题色、板卡型号、H616 用户名/IP |
| `mfast_ui/` | 纯界面层：border/footer/choose/do_action 等通用件 + 各菜单 |
| `mfast_fun/` | 功能层：各平台的编译/烧录/清理实现 + path.sh 路径常量 |
| `shell/` | 各平台实战脚本：H616 / mp157 / RPi / rootfs(debian) |
| `docs/` | docsify 博客站（侧边栏 _sidebar.md、导航 _navbar.md、封面 _coverpage.md） |
| `src/` | Linux 用户态 C 驱动样例：mdio(PHY)、iic_bh1750(光照)、pwm_sysfs、ws2812 |
| `scripts/` | Python/shell 小工具，含 report_ip 自动上报本机 IP |
| `Records.md` | 零散操作备忘（uboot 环境变量、Qt 交叉编译、LVGL、git 代理等） |

## 约定
- 主程序通过 `for script in ./mfast_ui/*.sh` + `./mfast_fun/*.sh` 全量 source，
  依靠函数名 dispatch；因此**新增菜单/功能只需放对目录，不需显式注册**。
- 命名约定：H616 用 `H616_` 前缀，mp157 用 `mp157_`，备份用 `mfast_backup`。
- UI 显示能力与实际实现存在多处脱节（详见 2026-09-18 日志），改动前先核对函数是否真的存在。
- 目标硬件生态：BIGTREETECH / Klipper / KlipperScreen / fluidd，板卡 H616(香橙派)、
  STM32MP157、树莓派。
