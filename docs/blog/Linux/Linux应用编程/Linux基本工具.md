### <center> <font size=34 face="STKaiti"> Linux 使用 adb 抓取 Android 日志 </font>    <!-- {docsify-ignore} -->

# 1. adb 安装

``` bash
sudo add-apt-repository ppa:nilarimogard/webupd8
sudo apt-get update
sudo apt-get install android-tools-adb
```

``` bash
adb -v 
```

> 有信息表示成功

# 插入 USB，查看 adb 是否识别安卓设备 

``` bash

adb devices
```

若发现 `List of devices attached` 为空，说明 `adb` 还不能识别该设备，但是 `usb` 还是能够识别的。 

# 查看 usb 信息

``` bash
lsusb
```

比较插入和拔出时打印信息的异同，找到当前设备的信息，如：

> Bus 001 Device 094: ID 1f3a:1007 Onda (unverified)   
> 
> 其中 1f3a 就是设备的 idVendor， 1007 是 idProduct 


# 配置 adb

创建并编辑一个 `51-android.rules` 配置文件。

``` bash
sudo vim /etc/udev/rules.d/51-android.rules
sudo chmod a+rx /etc/udev/rules.d/51-android.rules
```

加入以下信息

> SUBSYSTEM=="usb", ATTR{idVendor}=="1f3a", ATTR{idProduct}=="1007", MODE="0666" , OWNER=="lodge"
> #要根据实际填写，`OWNER` 是当前系统登录用户名

增加 adb_usb.ini 文件并编辑使 adb 识别到当前设备 

``` bash
vim ~/.android/adb_usb.ini
```

在中间加入厂商 id 即 idVendor 的值：0x1f3a，注意需要加上0x的前缀 。

# 重启 adb

``` bash

adb kill-server
adb start-server
```

# 查看设备

adb devices

成功如下

![image](https://user-images.githubusercontent.com/26021085/164889288-fd320009-06dd-4f44-8342-a4389b7943df.png)

注意：若是出现设备名称是：？？？？？？？？，则重新编辑 51-android.rules 配置文件；

删除上文所有的文本，正确的配置文件如下！！

``` bash

SUBSYSTEM=="usb", ENV{DEVTYPE}=="usb_device", MODE="0666"

```

# 使用adb

``` bash

adb shell
#可以登录进入开发板
```

# 抓取日志

建议抓取日志之前先清除缓存的log数据：

``` bash
adb logcat -c

```

使用V、D、I、W、E、F、S优先级标记进行过滤

V —— Verbose 明细（最低优先级）
D —— Debug 调试
I —— Info 信息
W —— Warn 警告
E —— Error 错误
F —— Fatal 严重错误
S —— Silent 无记载（最高优先级，没有什么会被记载）

例：
> adb logcat *:E

打印有时间戳的 log

``` bash
adb logcat -v time
```

日志保存到文件

``` bash
adb logcat -v time > ./Log_test.log
#保存到当前路径下的 Log_test.log 文件里；
```

参考：

<https://blog.csdn.net/ktigerhero3/article/details/72356253>

<https://www.cnblogs.com/mgzc-1508873480/p/7116207.html>

<https://www.cnblogs.com/samgxw/p/9425196.html>
