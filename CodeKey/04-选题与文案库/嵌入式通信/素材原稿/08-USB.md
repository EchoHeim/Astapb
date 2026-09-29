# USB 详解：为什么插个 U 盘这么简单，自己写 USB 却这么复杂？

> 🐵 程序小猴 · 嵌入式通信协议系列 Vol.08

---

普通用户使用 USB：

``` text
插进去 → 能用了
```

嵌入式工程师实现 USB：

``` text
时钟
PHY
枚举
描述符
Endpoint
Transfer
Class
Host
Device
……
```

第一次写 USB Host 时，很容易产生一个疑问：

> 我只是想读个 U 盘，为什么事情突然这么多？

## 一、USB 首先要分 Host 和 Device

这是理解 USB 的第一步。

例如：

``` text
PC = Host
鼠标 = Device
```

如果 MCU 插到电脑上模拟串口：

``` text
PC = Host
MCU = Device
```

如果 MCU 要读取 U 盘：

``` text
MCU = Host
U盘 = Device
```

角色一换，软件复杂度完全不同。

## 二、USB 不是简单的 TX/RX

UART 可以：

``` text
我想发 → 我就发
```

USB 总线由 Host 主导调度。

Device 不能像 UART 节点一样随意抢总线发送。

所以 USB 更像一个由 Host 组织起来的通信系统。

## 三、插入设备以后发生了什么？

你把 USB 设备插进电脑，看起来一瞬间就识别了。

背后却发生了枚举。

大致过程：

``` text
设备接入
 ↓
检测速度
 ↓
复位设备
 ↓
获取描述符
 ↓
分配地址
 ↓
获取配置
 ↓
选择配置
 ↓
加载对应Class驱动
```

这就是 Enumeration。

## 四、描述符是什么？

设备需要告诉 Host：

> 我是谁，我有什么能力。

常见描述符包括：

-   Device Descriptor；
-   Configuration Descriptor；
-   Interface Descriptor；
-   Endpoint Descriptor；
-   String Descriptor。

Host 正是通过这些信息理解设备结构。

## 五、Endpoint 可以理解成什么？

可以把 Endpoint 想象成设备内部不同的"数据窗口"。

例如：

``` text
EP0：控制
EP1 IN：发送数据给Host
EP2 OUT：接收Host数据
```

其中 EP0 特别重要，因为枚举和标准控制请求离不开它。

## 六、Control、Bulk、Interrupt、Isochronous

USB 定义了不同传输类型。

### Control

配置和管理设备。

### Bulk

大量数据，强调可靠性，例如存储设备。

### Interrupt

适合键盘、鼠标这类周期性小数据。

### Isochronous

强调实时连续传输，允许一定数据损失，常见于音视频。

## 七、USB CDC 为什么很受 MCU 欢迎？

CDC 可以让 MCU 在电脑上表现得像一个虚拟串口。

于是 PC 端仍然可以：

``` text
COM5
115200
```

这种使用体验。

对开发者来说，可以保留很多传统串口软件的工作方式。

## 八、U盘为什么更复杂？

U盘通常涉及：

``` text
USB Host
 ↓
Mass Storage Class
 ↓
Bulk-Only Transport
 ↓
SCSI Command
 ↓
Block Device
 ↓
FAT/exFAT等文件系统
 ↓
文件
```

所以"读取一个 txt 文件"背后实际上跨了很多层。

任何一层出错，都可能表现成：

> U盘识别失败。

这就是 USB Host 调试比较痛苦的原因。

## 九、USB 时钟为什么很重要？

USB 对时序要求比普通低速 UART 严格得多。

MCU USB 外设通常需要满足特定工作时钟，例如很多 USB FS 控制器需要准确的
48MHz 时钟域。

因此 USB 初始化失败时，除了代码，还要检查：

-   PLL；
-   时钟源；
-   PHY；
-   VBUS；
-   DP/DM；
-   中断；
-   内存；
-   Cache/DMA；
-   描述符。

## 十、USB 调试要分层

建议日志至少能看出：

``` text
检测到设备
↓
Reset完成
↓
读取Device Descriptor
↓
Set Address
↓
读取Configuration
↓
Class匹配
↓
Class初始化
↓
设备可用
```

不要只输出：

``` text
USB Error!
```

那几乎没有调试价值。

---

## 以 MCU 读 U 盘为例

插入 U 盘后，不是直接读取扇区：Host 先检测连接、复位与枚举，获取描述符并配置设备，再通过 Mass Storage 类传输块命令，最后由文件系统定位目录和文件。任一层失败，表现都可能是“读不到 U 盘”。日志最好分别标出连接、电源、地址分配、描述符、配置、类初始化、块设备识别和文件系统挂载。

对于 USB FS，12 Mbps 是信令速率，不是文件读取吞吐量；协议开销、端点轮询、存储介质和 MCU 缓冲区都会影响实测速度。调试先确认 VBUS 供电及设备枚举，再检查端点与传输状态，最后排查 FAT 等文件系统。缓存描述符表与 DMA 缓冲区的对齐要求，要以具体控制器手册为准。

## 写在最后

USB 难，不是因为它故意复杂。

它要解决的是：

**让大量不同厂商、不同类型、不同速度的设备真正做到即插即用。**

这件事本身就不简单。

下一篇继续升级：

**Ethernet------当嵌入式设备真正进入网络世界以后，会发生什么？**


---

**封面标题**：USB：MCU 读 U 盘之前发生了什么

**摘要**：从一个真实工程问题切入，解释关键电气与帧时序，给出接线、抓波形和故障排查的方法。

**话题标签**：#嵌入式开发 #通信协议 #USB #单片机 #FPGA #工程调试


---
