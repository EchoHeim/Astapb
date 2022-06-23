### <center> <font size=34 face="STKaiti"> Linux 自动挂载U盘 </font>    <!-- {docsify-ignore} -->

> Linux 自动挂载U盘 实现热插拔

# 1. 必备知识

- mount 命令
- udev 设备管理器

## 1.1 mount 命令

​mount 命令是用于挂载Linux系统外的文件，[具体参数](https://www.runoob.com/linux/linux-comm-mount.html)

## 1.2 udev 设备管理器

什么是 Udev？

Udev 是 Linux 2.6 内核的设备管理器，它动态地在 /dev 目录中创建/删除设备节点。它是 devfs 和 hotplug 的继承者。它在用户空间运行，用户可以使用 Udev 规则更改设备名称。

​Udev 依赖于 2.5 内核中引入的 sysfs 文件系统。sysfs 使设备在用户空间中可见。添加或删除设备时，会产生内核事件，通知用户空间中的 Udev。


参考：
[udev简介](https://www.linux.com/news/udev-introduction-device-management-modern-linux-system/)

[udev手册](https://linux.die.net/man/8/udev)

2、实操
​
进入/etc/udev/rules.d目录下，创建一个usb自动挂载的规则文件10-usb.rules

``` text
###########---USB---################
#----------------------------------#
KERNEL=="sd[a-z]*", SUBSYSTEM=="block", ACTION=="add", RUN+="/etc/udev/rules.d/usb_udev.sh usb %k"
KERNEL=="sd[a-z]*", SUBSYSTEM=="block", ACTION=="remove", RUN+="/etc/udev/rules.d/usb_udev.sh usb %k", OPTIONS="last_rule"
##########---CF card---#############
#----------------------------------#
KERNEL=="hd[a-z]*", SUBSYSTEM=="block", ACTION=="add", RUN+="/etc/udev/rules.d/usb_udev.sh cf %k"
KERNEL=="hd[a-z]*", SUBSYSTEM=="block", ACTION=="remove", RUN+="/etc/udev/rules.d/usb_udev.sh cf %k", OPTIONS="last_rule"
#########-----SD------##############
#----------------------------------#
KERNEL=="mmcblk[0-9]*", SUBSYSTEM=="block", ACTION=="add", RUN+="/etc/udev/rules.d/usb_udev.sh sd %k" 
KERNEL=="mmcblk[0-9]*", SUBSYSTEM=="block", ACTION=="remove", RUN+="/etc/udev/rules.d/usb_udev.sh sd %k", OPTIONS="last_rule"
```

规则文件写好后，我们这里进行挂载文件的脚本编写 usb_udev.sh

> 注意存放路径要和上面的 rules 文件里的路径对应

``` bash
#!/bin/bash

MNT_PATH=/media/        #挂载移动设备的目录
DEV_PRE=$1              #参数1：挂载点的前缀
DEV_NAME=$2             #参数2：设备在/dev下的名字

if [ $ACTION == "add" ]; then
    sudo mkdir -p $MNT_PATH$DEV_PRE-$DEV_NAME
    sudo mount /dev/$DEV_NAME $MNT_PATH$DEV_PRE-$DEV_NAME   # 这里可根据 which mount 来产看自己的mount在什么位置
    if [[ $? -ne 0 ]]; then
        sudo rmdir $MNT_PATH$DEV_PRE-$DEV_NAME
    fi
elif [ $ACTION == "remove" ]; then
    if [[ -e  $MNT_PATH$DEV_PRE-$DEV_NAME ]] ; then
        sudo umount $MNT_PATH$DEV_PRE-$DEV_NAME
        /usr/bin/rmdir  $MNT_PATH$DEV_PRE-$DEV_NAME
    fi
fi

exit 0
```

编写完成后，需要将脚本文件加上可执行权限，chmod +x usb_udev.sh。

其实编写到这里的时候已经完成了自动挂载功能，但是也有可能会出现挂载磁盘的 Udev 规则不起作用的情况。

解决方法：

在 /usr/lib/systemd/system/systemd-udevd.service 文件添加相关配置
``` text
[Service]
PrivateMounts=no
MountFlags=shared 
```

完事儿后保存配置并重启服务
``` bash
sudo systemctl daemon-reload
sudo service systemd-udevd --full-restart
```

到这里就能正常挂载了。

参考：

<https://zhuanlan.zhihu.com/p/357314668>

<https://newbedev.com/udev-rule-to-mount-disk-does-not-work>
