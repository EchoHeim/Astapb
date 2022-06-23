# Armdebian 系统构建

## 流程说明

文件系统构建完成之后，终端会打印输出
    
    Base system installed successfully.

然后切换到 qemu

```bash
sudo chroot debian_bullseye
```

这时会进入到虚拟的 arm 文件系统，在这里操作的内容在移植到嵌入式板卡中也一样会存在。

---

## 在 qemu 中进行操作

### 1、更新软件源
``` bash
vi /etc/apt/source.list
```

打开源文件，替换为以下内容
```
deb http://mirrors.ustc.edu.cn/debian stable main contrib non-free
 
# deb-src http://mirrors.ustc.edu.cn/debian stable main contrib non-free
 
deb http://mirrors.ustc.edu.cn/debian stable-updates main contrib non-free
 
# deb-src http://mirrors.ustc.edu.cn/debian stable-updates main contrib non-free
 
# deb http://mirrors.ustc.edu.cn/debian stable-proposed-updates main contrib non-free
 
# deb-src http://mirrors.ustc.edu.cn/debian stable-proposed-updates main contrib non-free
```

### 2、root 用户登录

执行脚本 initOS.sh
``` bash
cd ~
./initOS.sh
```

### 3、配置完成
``` bash
exit
```
退出 qemu

## 重新执行脚本，选择打包 rootfs

---

打包完成后烧写进emmc或SD卡，首次开机需要以root用户登录，然后执行用户根目录下的 init.sh 脚本；  
接着 exit 注销用户，以普通用户（就是在 qemu 中执行 initOS.sh 脚本时创建的用户）登录，然后执行用户根目录下的 init_lodge.sh 脚本;

---