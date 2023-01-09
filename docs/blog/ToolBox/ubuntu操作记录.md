### <center> <font size=34 face="STKaiti"> ubuntu 操作记录  </font>    <!-- {docsify-ignore} -->

# 0. 文档说明

记录 `Ubuntu` 系统从安装到配置开发环境的一些列操作，以及做一些自定义风格的修改。这里也[附带一下我在CSDN博客上的相关操作记录](https://blog.csdn.net/hsl416604093/article/details/80203638)。

系统版本：Ubuntu 20.04

系统镜像下载：

[阿里云镜像站](https://developer.aliyun.com/mirror/)  &emsp; [Ubuntu官网](https://cn.ubuntu.com/download)

系统安装时采用最小系统安装，并且安装时也没有下载更新。

# 1. 操作记录

## 1.1 设置root用户密码

``` bash
sudo passwd root
```

## 1.2 替换软件源

编辑文件

``` bash
sudo gedit /etc/apt/sources.list
```

源地址([阿里云](https://developer.aliyun.com/mirror/ubuntu?spm=a2c6h.13651102.0.0.3e221b11iQ5Gk9))

``` text
deb http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
```

## 1.3 安装软件

### 1.3.1 命令行自动安装

``` bash
sudo apt update

sudo apt install -y openssh-server git vim-gtk gdebi zsh autojump curl nfs-kernel-server rpcbind

sudo service ssh start
```

### 1.3.2 安装Chrome

卸载自带 Firefox 浏览器

``` bash
sudo apt purge firefox
```

下载安装 Chrome

``` bash
cd ~
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo gdebi google-chrome-stable_current_amd64.deb     # 自动下载安装依赖包;
```

也可以使用 `dpkg` 命令安装 `deb` 包

``` bash
sudo dpkg -i google-chrome-stable_current_amd64.deb
```

当出现缺少依赖错误时，使用

``` bash
sudo apt --fix-broken install
```

自动安装缺失的依赖，然后再重新安装 `deb` 软件包即可。

### 1.3.3 SSH 访问服务器

* 安装 `ssh-server`

``` bash
sudo apt-get install openssh-server
```

* 启动 `ssh` 服务

``` bash
sudo service ssh start
```

* 查看 `ssh` 服务是否启动

``` bash
sudo ps -e |grep ssh   
```

* 修改配置文件 `/etc/ssh/sshd_config`，配置文件中增加一句 `PermitRootLogin yes`，允许 `root` 用户登录。

* 通过 `ssh` 远程访问服务器

``` bash
ssh user@ip
```

> eg：ssh root@192.168.1.152 

* 从服务器上下载文件

``` bash
scp username@servername:/path/filename /var/www/local_dir（本地目录）
```
> 例：scp root@192.168.0.101:/var/www/test.txt  
> 把192.168.0.101上的/var/www/test.txt 的文件下载到/var/www/local_dir（本地目录）

* 上传本地文件到服务器 
  
``` bash
scp /path/filename username@servername:/path
``` 
> 例：scp /var/www/test.c root@192.168.0.101:/var/www/   
> 把本机/var/www/目录下test.c文件上传到192.168.0.101服务器上的/var/www/目录中

* 从服务器下载整个目录 

``` bash
scp -r username@servername:/var/www/remote_dir/  /var/www/local_dir 
```
> 例：scp -r root@192.168.0.101:/var/www/test /var/www/

* 上传目录到服务器 

``` bash
scp -r local_dir username@servername:remote_dir
```
> 例：scp -r test root@192.168.0.101:/var/www/   
> 把当前目录下的test目录上传到服务器的/var/www/ 目录

### 1.3.4 安装常用软件

主要是使用`wine`运行exe程序

参考：

https://github.com/zq1997/deepin-wine

https://www.daimajiaoliu.com/daima/7120ca2b18e5803


## 1.4 Vim 配置

修改文件

`sudo vim /etc/vim/vimrc`

添加以下内容：

``` bash
set nu        "显示行号
syntax on     "语法高亮  
set cursorline     "突出显示当前行
set ruler          "显示标尺
 
set tabstop=4      "tab键缩进
set expandtab
set shiftwidth=4   "空格代替tab
 
set smartindent    "设置缩进
set smartindent shiftwidth=4     "C语言自动缩进4个字符宽度
set ignorecase     "搜索忽略大小写
set hlsearch       "搜索逐字符高亮
 
set incsearch
set showmatch      "设置匹配模式，输入做括号会出现右括号  
set showcmd        "输入的命令显示出来，看的清楚些  
set scrolloff=3    "光标移动到buffer的顶部和底部时保持3行距离
set nocompatible   "去掉讨厌的有关vi一致性模式，避免以前版本的一些bug和局限
 
set completeopt=preview,menu     "代码补全
```

## 1.5 zsh 配置

``` bash
# 把默认的Shell改成zsh
chsh -s /bin/zsh

# 安装 oh-my-zsh
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
 
# 配置
sed -i 's/SH_THEME="robbyrussell"/SH_THEME="ys"/' ~/.zshrc

echo ". /usr/share/autojump/autojump.sh" >> ${ZDOTDIR:-$HOME}/.zshrc

# 安装 zsh-syntax-highlighting 语法高亮插件
mkdir ~/software/zsh -p
cd ~/software/zsh

git clone https://github.com/zsh-users/zsh-syntax-highlighting.git
echo "source ${(q-)PWD}/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ${ZDOTDIR:-$HOME}/.zshrc

# 生效
source ~/.zshrc 
```

# 2. 系统美化

## 2.1 必备软件

### 2.1.1 Tweak

这是一个美化工具，可以修改各种设置，外观、字体、工作区、扩展等；

``` bash
# Tweak安装
sudo apt install gnome-tweaks

# 让 gnome 支持插件扩展
sudo apt install gnome-shell-extensions

# chrome 浏览器扩展支持，可以使用浏览器安装插件
sudo apt install chrome-gnome-shell
```

### 2.1.2 GNOME Shell integration

使用 `Chrome`，在应用商店搜索 `GNOME Shell integration` 安装，这样就可以使用浏览器安装插件了。

### 2.1.3 ocs-url

打开 <https://www.linux-apps.com/p/1136805/> ，下载 `ocs-url` 的 `deb` 包并安装。这样就可以直接在浏览器中使用 `osc` 安装主题了。

## 2.3 安装扩展

扩展网址 <https://extensions.gnome.org>

在以上网站中可以搜索下载安装所需要的扩展插件，然后可以在 `Tweak` 里找到扩展插件，并进行设置。

我自己用的扩展有：

![image](https://user-images.githubusercontent.com/26021085/163124343-2640257c-eac0-4da6-9e1f-2c01aff0501d.png)

## 2.4 安装主题

主题地址：<https://www.pling.com/s/Gnome/browse/cat/135/order/latest/>

在以上的地址里面可以选择自己喜欢的主题，然后在右上角点击 `Install` ，选择一个安装即可。

或者点击下载，然后解压到主题目录 `/usr/share/themes` 下，鼠标指针图标路径 `/usr/share/icons`。

安装之后就可以在 `Tweak` 里面切换主题了。

类似的光标、图标也可以安装使用。

