### <center> <font size=34 face="STKaiti"> Debian 文件系统移植 </font>    <!-- {docsify-ignore} -->

# 1. 构建 Debian for ARM

* `Linux` 主机环境

``` bash
$ uname -a
Linux lodge-ubuntu 5.11.0-35-generic #37~20.04.1-Ubuntu SMP Mon Sep 13 13:30:34 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux
```

## 1.1 安装构建工具

``` bash
sudo apt-get install binfmt-support qemu qemu-user-static debootstrap multistrap
```

## 1.2 用 debootstrap 抽取系统

详见 [官方文档](https://wiki.debian.org/EmDebian/CrossDebootstrap)

抽取文件系统我们使用的是 `debootstrap` 命令，我们执行以下命令即可从 `debian` 下载源中获取到文件系统：

``` bash
cd ~ && mkdir debian_bullseye           # 在用户目录下创建存放根文件系统的文件夹;
sudo debootstrap --arch=armhf --foreign bullseye debian_bullseye https://mirrors.tuna.tsinghua.edu.cn/debian/
```

* 命令参数

`arch`：指定了 `CPU` 架构；

`bullseye`：`debian` 版本号，[最新版本](https://www.debian.org/releases/index.zh-cn.html)查看；

`foreign`：在与主机架构不相同时需要指定此参数，仅做初始化的解包；

`debian_bullseye`：要存放文件系统的文件夹；

`https://mirrors.tuna.tsinghua.edu.cn/debian/`: 下载源；

抽取成功后会在文件系统文件夹下看到 `linux` 的目录树：

![image](https://user-images.githubusercontent.com/26021085/168011490-88f720da-93a7-4c56-8079-de8b6f454305.png)

## 1.3 完善文件系统

完善文件系统要使用到 `qemu` 来模拟 `arm` 的环境

1. 复制命令

``` bash
sudo cp /usr/bin/qemu-arm-static  debian_bullseye/usr/bin 
```

2. 初始化文件系统

``` bash
sudo DEBIAN_FRONTEND=noninteractive DEBCONF_NONINTERACTIVE_SEEN=true LC_ALL=C LANGUAGE=C chroot debian_bullseye debootstrap/debootstrap --second-stage 
```

完成后终端会打印

``` text
Base system installed successfully.
```

## 1.4 修改部分文件和目录

``` bash
$ cd debian_bullseye
 
$ sudo echo "proc /proc proc defaults 0 0" >> etc/fstab
 
$ sudo mkdir -p usr/share/man/man1/
 
$ sudo mknod dev/console c 5 1        # 创建设备节点;
```

## 1.5 切换到 qemu

> 可能会遇到缺少 bash的错误 ([参考](https://blog.csdn.net/geniusle201/article/details/115245073))

``` bash
$ sudo chroot debian_bullseye
```

这时会进入到虚拟的 `arm` 文件系统，在这里操作的内容在移植到嵌入式板卡中也一样会存在。

1. 更新软件源

``` bash
vi /etc/apt/source.list         
```

* 打开源文件，替换为以下内容

``` text
deb http://mirrors.ustc.edu.cn/debian stable main contrib non-free
 
# deb-src http://mirrors.ustc.edu.cn/debian stable main contrib non-free
 
deb http://mirrors.ustc.edu.cn/debian stable-updates main contrib non-free
 
# deb-src http://mirrors.ustc.edu.cn/debian stable-updates main contrib non-free
 
# deb http://mirrors.ustc.edu.cn/debian stable-proposed-updates main contrib non-free
 
# deb-src http://mirrors.ustc.edu.cn/debian stable-proposed-updates main contrib non-free
```

2. 设置 `root` 密码

``` bash
passwd root
```

3. 创建用户

``` bash
adduser user   # user 用户名，然后输入密码;
```

4. 设置以太网

``` bash
echo "auto eth0" > /etc/network/interfaces.d/eth0
echo "iface eth0 inet dhcp" >> /etc/network/interfaces.d/eth0
```

## 1.6 退出 qemu

``` bash
exit
```

至此，`debian` 基本文件系统构建完成

# 2. 拷贝文件系统

准备一个成功烧写 `Linux` 系统镜像的 `SD` 卡，因为这里只是移植文件系统，并不涉及 `uboot` 和 `kernel`，所以得保证系统能运行起来。

将 `SD` 卡插入 `Linux` 主机，一般会出现两个盘符，我们需要做的就是先删除 `sd` 卡 `rootfs` 分区下的全部文件，然后把 `debian_bullseye` 目录下的 `Linux` 文件树全部拷贝到 `sd` 卡的 `rootfs` 分区。

最后把 `sd` 卡插入嵌入式板卡，从 `sd` 卡启动，不出意外的话就会进入到我们移植的 `debian` 文件系统了。

# 3. 文件权限问题

`arm` 的文件系统是在电脑上构建的，让开发板运行该文件系统的方法，是把该文件系统复制到 `SD` 卡的 `rootfs` 根目录下，设置内核从 `sd` 卡引导文件系统。

因为在复制的时候用的是 `sudo`，所以复制到 `sd` 上的文件和文件夹的拥有者就是 `root`。

而 `sd` 卡挂载在电脑上的，所以 `sd` 卡的根目录拥有者是电脑当前登录用户 `uid=1000`；这样的话在使用过程中会出现各种权限的问题。

* 解决办法

首先是 `root` 用户登录开发板

``` bash
cd /
chown root:root ./
chmod +r ./
chmod +x ./
chmod 1777 /tmp
```

解决普通用户 `home` 目录权限，同样是 `root` 用户登录

``` bash
cd /home
chown myuser:myuser myuser -R    # myuser 用户名
```

## 3.1 其他一些问题

1. 出现 sudo: /usr/bin/sudo must be owned by uid 0 and have the setuid bit set

root 用户登录

``` bash
chown root:root /usr/bin/sudo
chmod 4755 /usr/bin/sudo
```

2. 出现 xxx is not in the sudoers file.This incident will be reported

切换到 `root` 用户，添加 `sudo` 文件的写权限

``` bash
chmod u+w /etc/sudoers
```

编辑 `sudoers` 文件

``` bash
vi /etc/sudoers
```

找到 `root  ALL=(ALL) ALL` 这一行，在下面添加下面四行中任意一条

``` text
youuser            ALL=(ALL)                ALL
%youuser           ALL=(ALL)                ALL
youuser            ALL=(ALL)                NOPASSWD: ALL
%youuser           ALL=(ALL)                NOPASSWD: ALL
```

第一行:允许用户 `youuser` 执行 `sudo` 命令(需要输入密码).
第二行:允许用户组 `youuser` 里面的用户执行 `sudo` 命令(需要输入密码).
第三行:允许用户 `youuser` 执行 `sudo` 命令,并且在执行的时候不输入密码.
第四行:允许用户组 `youuser` 里面的用户执行 `sudo` 命令,并且在执行的时候不输入密码.

然后撤销 `sudoers` 文件写权限

``` bash
chmod u-w /etc/sudoers
```

这样普通用户就可以使用 `sudo` 了。

3. 更改主机名

在终端输入 `hostname` 指令可查看当前主机名

``` bash
hostname
```

然后 `root` 用户修改 `/etc/hosts`、`/etc/hostname` 文件，将该文件内容里出现的主机名改成你想要修改的名称，保存即可。

下次重启系统则生效。

4. 出现 warning: Setting locale failed.

原因是本地语言配置缺失。

首先安装 `locales`，然后按需进行配置，选择语言种类。

``` bash
sudo apt install locales
sudo dpkg-reconfigure locales
```

5. 出现 unable to resolve host MP157-Buster: Name or service not known.

一般是 `/etc/hosts` 文件中未配置相应的 `host` 名字（`MP157-Buster`）。配置一下即可解决问题。

``` text
127.0.0.1       localhost MP157-Buster
::1             localhost ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters
```

# 4. 国内镜像源

一般情况下，将 `/etc/apt/sources.list` 文件中 `Debian` 默认的软件仓库地址和安全更新仓库地址修改为国内的镜像地址即可。

附：`Debian` 国际镜像站：<https://www.debian.org/mirror/list>

1. 阿里云镜像站

``` bash
deb https://mirrors.aliyun.com/debian/ bullseye main non-free contrib
deb-src https://mirrors.aliyun.com/debian/ bullseye main non-free contrib
 
deb https://mirrors.aliyun.com/debian-security/ bullseye-security main
deb-src https://mirrors.aliyun.com/debian-security/ bullseye-security main
 
deb https://mirrors.aliyun.com/debian/ bullseye-updates main non-free contrib
deb-src https://mirrors.aliyun.com/debian/ bullseye-updates main non-free contrib
 
deb https://mirrors.aliyun.com/debian/ bullseye-backports main non-free contrib
deb-src https://mirrors.aliyun.com/debian/ bullseye-backports main non-free contrib
```

2. 腾讯云镜像站

``` bash
deb https://mirrors.tencent.com/debian/ bullseye main non-free contrib
deb-src https://mirrors.tencent.com/debian/ bullseye main non-free contrib
 
deb https://mirrors.tencent.com/debian-security/ bullseye-security main
deb-src https://mirrors.tencent.com/debian-security/ bullseye-security main
 
deb https://mirrors.tencent.com/debian/ bullseye-updates main non-free contrib
deb-src https://mirrors.tencent.com/debian/ bullseye-updates main non-free contrib
 
deb https://mirrors.tencent.com/debian/ bullseye-backports main non-free contrib
deb-src https://mirrors.tencent.com/debian/ bullseye-backports main non-free contrib
```

3. 网易云镜像站

``` bash
deb https://mirrors.163.com/debian/ bullseye main non-free contrib
deb-src https://mirrors.163.com/debian/ bullseye main non-free contrib
 
deb https://mirrors.163.com/debian-security/ bullseye-security main
deb-src https://mirrors.163.com/debian-security/ bullseye-security main
 
deb https://mirrors.163.com/debian/ bullseye-updates main non-free contrib
deb-src https://mirrors.163.com/debian/ bullseye-updates main non-free contrib
 
deb https://mirrors.163.com/debian/ bullseye-backports main non-free contrib
deb-src https://mirrors.163.com/debian/ bullseye-backports main non-free contrib
```

4. 华为镜像站

``` bash
deb https://mirrors.huaweicloud.com/debian/ bullseye main non-free contrib
deb-src https://mirrors.huaweicloud.com/debian/ bullseye main non-free contrib
 
deb https://mirrors.huaweicloud.com/debian-security/ bullseye-security main
deb-src https://mirrors.huaweicloud.com/debian-security/ bullseye-security main
 
deb https://mirrors.huaweicloud.com/debian/ bullseye-updates main non-free contrib
deb-src https://mirrors.huaweicloud.com/debian/ bullseye-updates main non-free contrib
 
deb https://mirrors.huaweicloud.com/debian/ bullseye-backports main non-free contrib
deb-src https://mirrors.huaweicloud.com/debian/ bullseye-backports main non-free contrib
```

5. 清华镜像站

``` bash
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye main contrib non-free
deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye main contrib non-free
 
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye-updates main contrib non-free
deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye-updates main contrib non-free
 
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye-backports main contrib non-free
deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye-backports main contrib non-free
 
deb https://mirrors.tuna.tsinghua.edu.cn/debian-security bullseye-security main contrib non-free
deb-src https://mirrors.tuna.tsinghua.edu.cn/debian-security bullseye-security main contrib non-free
```

6. 中科大镜像站

``` bash
deb https://mirrors.ustc.edu.cn/debian/ bullseye main contrib non-free
deb-src https://mirrors.ustc.edu.cn/debian/ bullseye main contrib non-free
 
deb https://mirrors.ustc.edu.cn/debian/ bullseye-updates main contrib non-free
deb-src https://mirrors.ustc.edu.cn/debian/ bullseye-updates main contrib non-free
 
deb https://mirrors.ustc.edu.cn/debian/ bullseye-backports main contrib non-free
deb-src https://mirrors.ustc.edu.cn/debian/ bullseye-backports main contrib non-free
 
deb https://mirrors.ustc.edu.cn/debian-security/ bullseye-security main contrib non-free
deb-src https://mirrors.ustc.edu.cn/debian-security/ bullseye-security main contrib non-free
```

# 5. 参考

<https://www.cirmall.com/bbs/thread-168333-1-1.html>

<https://blog.csdn.net/sinat_37141443/article/details/80882219>
