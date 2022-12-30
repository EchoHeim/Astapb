# 0. 说明

在 orangepi 官方编译脚本生成的 buster 系统之上修改,kernel Ver5.13.0

官网：<http://www.orangepi.cn/>

资源下载：<http://www.orangepi.cn/downloadresourcescn/>

![资源下载页](https://user-images.githubusercontent.com/26021085/155490550-e6313fc0-dd3f-400d-9d35-14f9ca777399.png)

#  1. 内核修改

##  1.1 mcp2515驱动移植

主要功能：spi转can

设备树修改：`arch\arm64\boot\dts\allwinner\sun50i-h616-orangepi-zero2.dts`
``` makefile
mcp2515_clock: mcp2515_clock {
		compatible = "fixed-clock";
		#clock-cells = <0>;
		clock-frequency  = <12000000>;          //对应模块上晶振的频率，我的是12MHz的
	};

&spi1 {
    #address-cells = <1>;
    #size-cells = <0>;
    pinctrl-names = "default";
    // pinctrl-0 = <&spi1_pins &spi1_cs_pin>;
    pinctrl-0 = <&spi1_pins>;
    cs-gpios = <&pio 7 9 GPIO_ACTIVE_HIGH>;		/* PH9 */

    status = "okay";

    can: mcp2515@0 {
        compatible = "microchip,mcp2515";
        clocks = <&mcp2515_clock>; 				//使用刚刚自己写的时钟
        status = "okay";
        
        reg = <0>;
        spi-max-frequency = <5000000>;

        interrupt-parent = <&pio>;
        interrupts = <2  6  IRQ_TYPE_EDGE_FALLING>;			/* PC6 */
        
        vdd-supply = <&reg_vcc33_wifi>;
        xceiver-supply = <&reg_vcc33_wifi>;
    };

    spidev@1 {
        compatible = "spidev";
        status = "okay";
        reg = <1>;
        spi-max-frequency = <1000000>;
    };
};
```

内核配置修改：

![image](https://user-images.githubusercontent.com/26021085/155493684-0df86a91-d072-4ec2-9f3b-27d3a1b1c455.png)

![image](https://user-images.githubusercontent.com/26021085/155493871-830f2dba-0466-4bff-9f83-e8c7370e810e.png)

参考：

<https://blog.csdn.net/peixiuhui/article/details/72528512>

<https://blog.csdn.net/jklinux/article/details/78709793>

<https://blog.csdn.net/lbaihao/article/details/53193053>

<https://blog.csdn.net/a13698709128/article/details/104484467/>

## 1.2 wifi驱动移植(TL8189FCB)

### 1.2.1 概述

TL8189FCB 模组采用了 Realtek RTL8189FTV-VC-CG 芯片设计, 具有 802.11n 无线局域网(WLAN)网络和 SDIO 接口(兼容 SDIO 1.1/ 2.0)控制器。

引脚定义：

![TL8189FCB](https://user-images.githubusercontent.com/26021085/162897932-29ca1cf4-951e-412b-acb2-54fb59a1f09f.png)

注意：引脚电压保证稳定`3.3v`。

### 1.2.2 驱动源码下载

``` bash
git clone https://github.com/jwrdegoede/rtl8189ES_linux.git
cd rtl8189ES_linux
git checkout -B rtl8189fs origin/rtl8189fs
```

### 1.2.3 驱动移植

将源码拷贝到 `\drivers\net\wireless\`，`rtl8189ES_linux` 文件夹重命名为 `rtl8189fs`

修改文件 `\drivers\net\wireless\Makefile`，添加
```
obj-$(CONFIG_RTL8189FS) += rtl8189fs/
```

修改文件 `\drivers\net\wireless\Kconfig`，添加
```
source "drivers/net/wireless/rtl8189fs/Kconfig"
```

设备树修改：`arch\arm64\boot\dts\allwinner\sun50i-h616-orangepi-zero2.dts`
``` makefile
wifi_pwrseq: wifi-pwrseq {
		compatible = "mmc-pwrseq-simple";
		// clocks = <&rtc 1>;
		// clock-names = "osc32k-out";
		reset-gpios = <&pio 6 18 GPIO_ACTIVE_LOW>; /* PG18 */
		post-power-on-delay-ms = <400>;
	};
    
&mmc1 {
	vmmc-supply = <&reg_dldo1>;
	vqmmc-supply = <&reg_dldo1>;
	mmc-pwrseq = <&wifi_pwrseq>;

	max-frequency = <400000>;
	// max-frequency = <120000000>;

	reset-gpios = <&pio 5 6 GPIO_ACTIVE_HIGH>; /* PF6 */

	bus-width = <4>;
	non-removable;
	keep-power-in-suspend;

	status = "okay";
};
```

内核配置上勾选 (M)rtl8189fs，编译生成模块。

关闭驱动打印调试信息

修改文件 `\drivers\net\wireless\rtl8189fs\include\autoconf.h`，屏蔽 `CONFIG_DEBUG` 宏

### 1.2.4 模块加载测试

系统开机，判断 `sdio-wifi` 是否识别

``` bash
cat /sys/bus/sdio/devices/mmc0:0001:1/uevent        //可查看SDIO设备ID
mount -t debugfs none /sys/kernel/debug
cat /sys/kernel/debug/mmcx/ios                      //可查看WIFI_sdio 相关信息
```

示例如下

![image](https://user-images.githubusercontent.com/26021085/162905658-4984744e-8e19-4551-a3e7-3c9d2e27b52c.png)


将编译好的 `8189fs.ko` 拷贝到文件系统，然后加载驱动模块

``` bash
sudo depmod             // 第一次加载驱动的时候需要运行此命令
sudo modprobe cfg80211  // 先加载 cfg80211.ko， IEEE 协议
sudo modprobe 8189fs    // RTL8189FTV 模块加载 8189fs.ko 模块
```

然后可以使用 `ifconfig -a` 查看到 `wlan0` 设备

参考：
[全志A40i移植 RTL8188FTV/RTL8188FU USB-WiFi](https://xiaohuisuper.blog.csdn.net/article/details/121113707?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2.pc_relevant_antiscanv2&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2.pc_relevant_antiscanv2&utm_relevant_index=5)

[H5上rtl8189ftv wifi驱动移植](https://blog.csdn.net/jklinux/article/details/78737691)

[I.MX6 AW-NB177NF wifi HAL 调试修改](https://www.shuzhiduo.com/A/8Bz8R9ro5x/)

[Linux SD卡/SDIO驱动开发](https://blog.csdn.net/h_8410435/article/details/105427238)

#  2. 软件安装

##  2.1 can 工具

``` bash
sudo apt install can-utils iproute2
```

##  2.2 wifi 工具

``` bash
sudo apt install wireless-tools udhcpc wpasupplicant
```

# 3. 开机后初始化操作

## 3.1 首次开机初始化

扩容根分区、创建 `fat` 分区，便于 windows 系统能修改镜像配置。  
具体执行脚本为 `expand_rootfs.sh` ，可以在 `/etc/rc.local` 脚本中添加开机自运行。

例如:
> 将 `expand_rootfs.sh` 脚本放在用户主目录 `/home/orangepi` 下,并赋予可执行权限，然后在 `/etc/rc.local` 中添加 `/home/orangepi/expand_rootfs.sh &` 

准备工作：

* 安装 `lvm` 磁盘分区工具

``` bash
sudo apt install lvm2
```

* 安装磁盘格式化工具

``` bash
sudo apt install mtd-utils
```

## 3.2 正常开机初始化

具体可以查看 `work_shell` 文件夹

# 4. 基于香橙派 kernel_5.13 修改记录

0. update-motd.d 和 sys_cfg 文件夹，整个放在 /etc 目录下，终端登陆后的显示信息

    /ete/issue 和 /ete/issue.net 文件

1. 修改主机名、用户名
   
    root用户登录，运行 `biqu_user.sh`

2. 修改密码 biqu、biqu
    
    root 用户登录
    ``` bash
    passwd biqu
    ```

3. 修改sudoers文件，取消sudo输入密码

    ``` bash
    sudo chmod +w /etc/sudoers
    sudo vim /etc/sudoers
    ```

    添加 
    ``` 
    %biqu   ALL=(ALL:ALL)   NOPASSWD:ALL
    ```

4. 添加环境变量到/etc/profile
    
    ``` bash
    sudo vim /etc/profile
    ```

    添加
    ```
    export PATH="$PATH:/usr/sbin:/sbin"
    ```

5. u盘自动挂载，支持热插拔
   
    把规则文件 12-usb.rules 放入 /etc/udev/rules.d/ 目录下;

    把脚本文件 usb_udev.sh 放在 /etc/scripts/ 目录下;

6. usb摄像头实现即插即用
    
    在 sync.sh 中开启服务

7. 定时自动同步文件
    
    把 sync.sh 文件放在 ~/scripts/ 目录下

    运行 `crontab -e` 添加一项定时任务，每分钟执行一次

    ``` bash
    */1 * * * * /home/biqu/scripts/sync.sh
    ```

8. 修改hosts文件
    
    ``` bash
    sudo vim /etc/hosts
    ```
    
    修改 orangepizero2 为新主机名 Hurakan
    
9. klipper修改
    
    make menuconfig

10. host_mcu
    gpioinfo

    make menuconfig
    make flash

    <https://github.com/Klipper3d/klipper/blob/master/docs/RPi_microcontroller.md>

11. fluidd 界面
    打印机名称修改

12. 开机自启动 can 

    <https://www.klipper3d.org/CANBUS.html?h=can#host-hardware>

13. 取消 git 代理

14. klipper log删除

15. SSH 取消超时断开连接

    <https://blog.csdn.net/weixin_39534395/article/details/119229057>

    <https://blog.csdn.net/bandaoyu/article/details/116999236>

16. MDNS

Many people prefer to access their machines using the name.local addressing scheme available via mDNS (zeroconf, bonjour) instead of an IP address. This is simple to enable on the hurakan but requires the installation of the following packages which should be installed from the factory:

sudo apt install avahi-daemon bind9-host geoip-database libavahi-common-data libavahi-common3 libavahi-core7 libdaemon0 libgeoip1 libnss-mdns libnss-mymachines

# 5.其他功能测试

## 红外接收

安装红外测试软件
sudo apt-get install -y ir-keytable

查看红外ir设备
ir-keytable

查看红外接收键值
ir-keytable -t

## 3.5mm 音频输出

查看声卡
aplay -l

播放音乐
aplay -D hw:2,0 /usr/share/sounds/alsa/audio.wav

# 6.附加

## 6.1 打印日志级别修改

``` bash
echo 7 4 1 7 > /proc/sys/kernel/printk
```

## 6.2 apt源

deb https://mirrors.tuna.tsinghua.edu.cn/debian bullseye main
deb http://deb.debian.org/debian bullseye main contrib

## 6.3 禁用无关服务

``` bash
sudo systemctl disable bluetooth.service
sudo systemctl disable hostapd.service
sudo systemctl disable armbian-firstrun-config.service
sudo systemctl disable e2scrub_all.timer
sudo systemctl disable e2scrub_reap.service
```

# 7. HDMI 显示

## 7.1 显示旋转

DISPLAY=:0 xrandr --output HDMI-1 --rotate normal
DISPLAY=:0 xrandr --output HDMI-1 --rotate left
DISPLAY=:0 xrandr --output HDMI-1 --rotate right
DISPLAY=:0 xrandr --output HDMI-1 --rotate inverted

## 7.2 触摸旋转

> 列出所有输入设备

DISPLAY=:0 xinput --list

> 旋转

DISPLAY=:0 xinput --set-prop 'WaveShare WS170120' 'Coordinate Transformation Matrix' 1 0 0 0 1 0 0 0 1
DISPLAY=:0 xinput --set-prop 'WaveShare WS170120' 'Coordinate Transformation Matrix' 0 -1 1 1 0 0 0 0 1
DISPLAY=:0 xinput --set-prop 'WaveShare WS170120' 'Coordinate Transformation Matrix' 0 1 0 -1 0 1 0 0 1
DISPLAY=:0 xinput --set-prop ${input_id} 'Coordinate Transformation Matrix' -1 0 1 0 -1 1 0 0 1

HDMI_Vendor="WaveShare"
string=`DISPLAY=:0 xinput --list | grep ${HDMI_Vendor}`
string=${string#*id=}
input_id=${string%[*}
echo ${input_id}


## 7.3 设置分辨率

extraargs=video=HDMI-A-1:1024x600-24@60


## 8 设置静态IP

sudo nmcli con mod "Wired connection 1" ipv4.addresses "192.168.0.110" ipv4.gateway "192.168.0.1" ipv4.dns "8.8.8.8" ipv4.method "manual"

sudo nmcli con mod "biqu-m" ipv4.addresses "192.168.1.110" ipv4.gateway "192.168.1.1" ipv4.dns "8.8.8.8" ipv4.method "manual"

sudo nmcli con mod "biqu-m" ipv4.addresses "" ipv4.gateway "" ipv4.dns "" ipv4.method "auto"

sudo nmcli con up biqu-m

sudo systemctl restart NetworkManager


## 9 sox音频播放

安装
sudo apt-get install sox libsox-fmt-all

指定音频驱动
export AUDIODRIVER=alsa

播放
play *.mp3

======================================================
_IP=$(hostname -I) || true
if [ "$(hostname -I)" ]; then
    printf "My IP: %s\n" "$(hostname -I)"
fi


======================================================
命令行播放视频（需要安装mplayer播放器）
mplayer -vo fbdev2 /home/biqu/video.mp4 -vf scale=1024:600


echo 0 > /sys/class/graphics/fbcon/cursor_blink #光标不闪烁

======================================================
1.先将系统烧到sd卡上
2.插入sd卡，启动香蕉派
3.检查容量并dd进镜像：
sudo fdisk -l
sudo dd if=/dev/mmcblk1 of=/dev/mmcblk2 bs=512 count=5038080

#count的计算方法：sudo fdisk -l /dev/mmcblk0 查看最后一个sector值，转换单位（512byte->1M Byte）

(15409151+1)*512/1024/1024=15409152/2048=7524

(/dev/mmcblk0 729088 15409151 14680064 7G 83 Linux)

=======================================================

查看 chipid

cat /sys/class/sunxi_info/sys_info | grep "chipid"

