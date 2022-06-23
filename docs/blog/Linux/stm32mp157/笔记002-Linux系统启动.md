### <center> <font size=34 face="STKaiti"> Linux 系统启动 </font>    <!-- {docsify-ignore} -->

# 1. 软件架构

![image](https://user-images.githubusercontent.com/26021085/168005777-3330ee84-a605-445b-b889-6630ca81bb3d.png)

`STM32MPU` 嵌入式软件分布主要组件有

* 在 `Arm` `Cortex-A` 上运行的 `OpenSTLinux` 发行版，包括

  1. OpenSTLinux BSP，具有

     * 基于 TF-A 和 U-Boot 的引导链。
     * 在安全模式下在 Arm Cortex-A 上运行的 OP-TEE 安全操作系统。
     * 在非安全模式下在 Arm Cortex-A 上运行的 Linux 内核。

  2. 应用程序框架由依赖于 BSP 并在 Linux 端提供 API 的中间件组成，以运行通常通过显示器、触摸屏等与用户交互的应用程序。

  3. 在 OP-TEE 方面，可信应用程序 (TA) 依赖于 OP-TEE 内核进行秘密操作（在 Linux 和 STM32Cube MPU 包中不可见）

* STM32Cube MPU 包在 Arm Cortex-M 上运行：它基于 HAL 驱动程序和中间件，与其他 STM32 微控制器一样，完成协处理器管理。

# 2. 启动流程

`STM32MP1` 是面向 `Linux` 领域的，其启动 `Linux` 内核的流程如下：

![image](https://user-images.githubusercontent.com/26021085/168005902-4a03eb60-da07-4de8-929b-a4ff7ecce21b.png)

STM32MP1 启动 linux 内核一共分为 `5` 个步骤，我们依次来看一下这五个步骤的内容

## 2.1 ROM 代码

这是 ST 自己编写的代码，在 STM32MP1 出厂的时候就已经烧写进去的，不能被修改的。ROM 代码因为保存在 STM32 内部 ROM 里面，因此也就直接简单明了的叫做 `ROM 代码`了。

它是处理器上电以后首先执行的程序，ROM 代码的主要工作就是读取 STM32MP1 的 BOOT 引脚电平，然后根据电平判断当前启动设备，最后从选定的启动设备里面读取 FSBL 代码，并将 FSBL 代码放到对应的 RAM 空间。

现在很多产品对设备上运行的应用都提出了安全要求，STM32MP1 启动 Linux 内核的过程是一个链式结构：`ROM Code`→`FSBL`→`SSBL`→`Linux kernel`→`rootfs`，系统启动的过程中要保证整个链式结构都是安全的。

ROM 代码作为第一链，首先要对 FSBL 代码进行鉴权，同样的，FSBL 以及后面的每一链都要对下一个阶段的镜像进行鉴权，直到设备系统正确启动。

## 2.2 FSBL

FSBL 代码初始化时钟树、初始化外部 RAM 控制器，也就是 DDR。最终 FSBL 将 SSBL 加载到 DDR 里面并运行 SSBL 代码。

一般 FSBL 代码是 TF-A 或者 Uboot 的 SPL 代码，也可以将 FSBL 换成我们自己编写的 STM32MP1 A7 内核裸机代码。

## 2.3 SSBL

由于 SSBL 代码运行在 DDR 里面，无需担心空间不够，因此 SSBL 代码的功能就可以做的很全面，比如使能 USB、网络、显示等等。

这样我们就可以在 SSBL 中灵活的加载 linux 内核，比如从 Flash 设备上读取，或者通过网络下载下载等，用户使用起来也非常的友好。

SSBL 一般是 Uboot，用来启动 Linux 内核。

## 2.4 Linux 内核

SSBL 部分的 Uboot 就一个使命，启动 Linux 内核， Uboot 会将 Linux 内核加载到 DDR 上并运行。 

Linux 内核启动过程中会初始化板子上的各种外设。

## 2.5 Linux 用户空间

系统启动的时候会通过 init 进程切换到用户空间，在这个过程中会初始化根文件系统里面的各种框架以及服务。
