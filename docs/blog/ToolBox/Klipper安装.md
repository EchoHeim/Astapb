### <center> <font size=34 face="STKaiti"> Klipper安装 </font>    <!-- {docsify-ignore} -->

# 1. git 下载kiauh脚本

!> 国内网络访问 `github` 有时会很慢，可以参考 [这篇文章](./blog/Github快速访问.md) 改善一下

``` bash
git clone -b lodge --depth 1 https://github.com/EchoHeim/kiauh.git
```

* 运行环境
    > 基于 `debian` 系的 `Linux` 操作系统， 如 `debian10(buster)`；  
    > 不能以 `root` 用户登录；  

# 2. 运行脚本

!> 切换到用户主目录

``` bash
cd ~
./kiauh/kiauh.sh
```
![image](https://user-images.githubusercontent.com/26021085/171108682-d5bc93d1-8dea-4118-9a4c-35b9876fcd6f.png)

菜单左边可进行安装、卸载、更新等操作，右边显示各个模块的安装状态；

可以选择 `1` 安装所需要的内容：

![image](https://user-images.githubusercontent.com/26021085/171108779-2c187516-78b3-4a20-bed6-83303b1d10e5.png)

> 一般安装 `klipper`、`Moonraker`和`Fluidd`就可以正常使用打印机了，如果有显示屏的话，还可以选择安装`KlipperScreen`；
> 
> `Mainsail`和`Fluidd`是两种 web 控制终端，二选一即可，如果同时安装，需要指定访问端口号；
> 
> 安装过程中需要获取 `root` 权限，需要输入用户登录密码；
> 
> 安装提示确认时，按默认选择就行；

!> 安装完成后，回到脚本首页，保证所安装项目都是 `Installed` 状态。

![image](https://user-images.githubusercontent.com/26021085/171113696-ad96a0db-0855-411f-bd34-1d1f3b0b7de9.png)

正常情况下，安装完成后显示屏会显示 `klipper` 主界面；浏览器访问 `IP`，会进入 `fluidd` 主页。

![image](https://user-images.githubusercontent.com/26021085/165012239-3c9b5917-f503-4ca1-be42-982107827430.png)

# 3. 异常情况解决

一般来说，只要保证安装过程中网络通畅，成功安装 `klipper`、`moonraker`、`fluidd` 是没有问题的，若出现安装失败，运行 `kiauh` 脚本卸载对应模块，重新安装即可。

对于 `klipperscreen`，若显示屏没有出现 `klipper` 界面，可以运行以下命令查看 `klipperscreen` 服务状态

``` bash
journalctl -xe -u KlipperScreen.service
```

## 3.1 出现 Permission denied 错误

> err: xf86OpenConsole: Cannot open virtual console 2 (Permission denied)

可以在 kiauh 脚本首页，选择 `F` 进入自定义功能界面

![image](https://user-images.githubusercontent.com/26021085/170648362-bc009d06-9882-457b-bc67-03dc7031e64c.png)

选择 `2`，等待修复完成即可。

## 3.2 安装 libgl1-mesa-dri

``` bash
sudo apt install libgl1-mesa-dri
```

## 3.3 klipperscreen 重新安装

?> 使用 lodge Custom 的 kiauh 脚本安装，一般不会用到此小节的安装方法

具体操作步骤

1. 修改 `~/kiauh/scripts/install_klipperscreen.sh` 文件

``` text
cd ${HOME} && git clone $KLIPPERSCREEN_REPO
```
替换为：
``` text
cd ${HOME} && cp -r ${GITHUB_SRC}/KlipperScreen .
```

2. 新建文件夹

``` bash
mkdir ~/kiauh/github_src
```

3. 下载源码

``` bash
cd ~/kiauh/github_src
git clone https://github.com/jordanruthe/KlipperScreen.git
```

4. 修改 `~/kiauh/github_src/KlipperScreen/scripts/KlipperScreen-install.sh` 文件

``` text
FBTURBO="xserver-xorg-video-fbturbo"
```
替换为：
``` text
FBTURBO="xserver-xorg"
```

5. 添加 `~/kiauh/kiauh.sh` 文件

添加以下内容
``` text
### set important directories
# Code cached from Github
GITHUB_SRC=${SRCDIR}/kiauh/github_src
```

6. 运行 `kiauh` 脚本，卸载 `KlipperScreen`，重新安装

---

参考：<https://user-images.githubusercontent.com/26021085/167590452-d8d5d043-f6f8-4f78-8905-c4a38b4441e0.png>

# 4. kiauh 自定义功能

!> 持续更新

[3.1 小节](#31-出现-permission-denied-错误)中的修复 klipperscreen 只是`lodge`定制版的kiauh脚本中的一个功能；

- 目前更新的功能有
  
  - 支持usb设备热插拔，U盘自动挂载、usb摄像头即插即用；
  - 修复 KlipperScreen 


## 4.1 切换 klipper 分支

如果想自定义klipper的功能，但是官方并没有支持，可以将klipper仓库fork到自己的仓库，完成功能修改后，使用 kiauh 脚本更新。

具体操作如下：

1. 在 kiauh 脚本首页 选择 `f` 进入功能扩展页面

    ![image](https://user-images.githubusercontent.com/26021085/171110451-01c89a5d-64fd-4505-a1fa-a4ebef8fea52.png)

2. 然后选择 `0`，自动添加自定义文本，提示成功后，选择 `b` 返回到 kiauh 脚本首页

3. 选择 `6` 进入设置页，然后选择 `2` 进入切换 klipper 仓库页面

    ![image](https://user-images.githubusercontent.com/26021085/171114055-5cffab91-ed50-4e05-9887-3ac02d8cacef.png)

> 这里 `0` 是klipper官方的仓库，建议不要修改，可以用作还原仓库； 
> `1` 就是我们添加的自己修改功能后的klipper仓库。

- 具体添加方法
  
    修改 `~/kiauh/klipper_repos.txt` 文件

    ![image](https://user-images.githubusercontent.com/26021085/171114123-901b38a9-916a-4a6e-a417-ac1cdceba90e.png)

    在文件后添加自己的仓库名和分支名，中间用英文逗号 `,` 隔开，不指定分支名的话，默认是master分支。

    可以添加多个仓库，添加完成后就可以在kiauh脚本里查看了。

4. 选择自己想要切换的 klipper 分支，会出现切换确认提示，确认切换即可。

    ![image](https://user-images.githubusercontent.com/26021085/171114213-28abdbd5-2ded-472c-8ac5-ef4aa1b5dd2a.png)

