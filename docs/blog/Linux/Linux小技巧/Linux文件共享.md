### <center> <font size=34 face="STKaiti"> Linux 文件共享 </font>    <!-- {docsify-ignore} -->

# 1. NFS服务

> `Linux` 主机与嵌入式开发板文件共享

* 功能

在嵌入式开发板无法通过 `SSH` 访问时，可以通过 `nfs` 挂载目录到 `Linux` 主机，实现文件共享。

## 1.1 安装与配置

1. 首先要在 `Linux` 主机上安装 `nfs` 服务

``` bash
sudo apt install nfs-kernel-server
```

2. 创建共享文件夹

> 这里以 `VMC` 文件夹为例

``` bash
mkdir /home/lodge/VMC          # 创建一个用于共享的文件夹
chomd 777 /home/lodge/VMC      # 设置该文件夹的权限使其让所有用户可读可写可运行
```

3. 修改配置文件

``` bash
sudo vim /etc/exports
```

添加共享文件夹的路径，以及设定参数

``` text
/home/lodge/VMC *(rw,sync,no_root_squash,no_subtree_check)
```

4. 重启 `NFS` 服务

``` bash
sudo /etc/init.d/nfs-kernel-server restart
```

## 1.2 使用

首先保证 `Linux` 主机和嵌入式设备 `IP` 能够互相 `ping` 通。

登录嵌入式设备，使用 `mount` 命令挂载文件夹，这里是把 `Linux` 主机的 `VMC` 目录挂载到嵌入式设备的 `/mnt` 目录下，这样就可以在 `/mnt` 目录下实现和主机的文件共享。

``` bash
sudo mount -t nfs -o nolock 10.64.12.54:/home/lodge/VMC /mnt
```

如果挂载失败，可以尝试加一个 `busybox` 

``` bash
sudo busybox mount -t nfs -o nolock 10.64.12.54:/home/lodge/VMC /mnt
```

# 2. Samba服务

* 功能

方便用于 `windows` 和 `Linux` 系统间文件共享。

## 2.1 安装与配置

1. 安装 Samba

``` bash
sudo apt install samba smbclient
```

2. 创建共享文件夹

> 这里以 `VMC` 文件夹为例

``` bash
mkdir /home/lodge/VMC          # 创建一个用于共享的文件夹
chomd 777 /home/lodge/VMC      # 设置该文件夹的权限使其让所有用户可读可写可运行
```

3. 修改配置文件 

``` bash
sudo vim /etc/samba/smb.conf
```

在文件最后添加想要共享的目录信息

``` text
[VMC]
comment = share folder
browseable = yes
path = /home/lodge/VMC
create mask = 0777
directory mask= 0777
force user = lodge
public = yes
available = yes
writable = yes
```

`[VMC]` 是共享目录的显示名称，可以自定义；`path` 是共享目录绝对路径；然后确定目录访问权限和指定用户访问，可以根据需要设置。

* 其他参数描述如下

参数    | 描述
:---    | :---
comment | 备注描述
path    |  共享文件夹的路径
valid users | 可访问的用户，多个用户用,隔开（使用上面步骤创建的 Samba用户名）
public  | 访问是否不需要密码
read only   | 是否只读
create mask | 文件权限设置
directory mask  | 文件权限设置
available   | 是否有效
browseable  | 是否可浏览，no表示隐藏，需要通过 IP+共享名称 进行访问
display charset、unix charset、dos charset  | 防止出现中文目录乱码的情况

4. 启动 Samba 服务

``` bash
sudo service smbd restart       # 重启服务
```

``` bash
testparm        # Samba 服务重启后，可以使用下面命令检查 smb.conf 配置文件是否有语法错误
```

* 其他控制命令

``` bash
sudo service smbd start                 # 启动
sudo service smbd stop                  # 关闭 Samba 服务器：
sudo service smbd restart               # 重新启动 Samba 服务器：
sudo service smbd status                # 查看 Samba 服务状态
ps -aux | grep smbd                     # 查看 samba 是否正在运行
```

## 2.2 连接共享文件夹

首先确保两台设备的 `IP` 能够互相 `ping` 通

在 `Windows` 系统的文件管理器导航栏上反斜杠输入 `Linux` 设备 `IP` 后回车

![image](https://user-images.githubusercontent.com/26021085/167988577-01f309b9-f689-4e5d-8c84-7d8a48cd5d38.png)

然后在弹出的对话框输入 `Samba` 配置的用户和密码，如果用户名和登录 `Linux` 的用户名一样，则需要输入登录 `Linux` 设备的密码，验证正确后即可看到共享的文件夹，然后就可以进行文件传输读写操作。

![image](https://user-images.githubusercontent.com/26021085/167988624-13c03576-5717-461a-a9ae-870af69171fa.png)

# 3. FTP服务

* 功能

方便用于 `windows` 和 `Linux` 系统间文件传输共享。

## 2.1 安装与配置

1. 安装 FTP

``` bash
sudo apt install vsftpd
```

2. 修改配置文件

``` bash
sudo vim /etc/vsftpd.conf
```

找到如下两行, 去掉注释
``` text
local_enable=YES
write_enable=YES
```

![image](https://user-images.githubusercontent.com/26021085/167988951-4ba7639f-b5a9-4503-8286-7d634d7dbad7.png)

3. 重启 FTP 服务

``` bash
sudo /etc/init.d/vsftpd restart
```

## 2.2 Windows文件共享

`windows` 上安装 `FTP` 客户端

[下载](https://www.filezilla.cn/download) 安装对应的系统版本软件。  

* FileZilla 设置

`Linux` 作为 `FTP` 服务器， `FileZilla` 作为 `FTP` 客户端。

点击 “文件” → “站点管理器”，“新站点”，创建站点，例如我这里创建名为 “Ubuntu” 的站点。

![image](https://user-images.githubusercontent.com/26021085/167989505-0f883913-07c7-45ad-bbce-760ac388d282.png)

然后连接就行，这时右侧就显示 `Ubuntu` 系统上的文件，如果有乱码，就断开连接，在站点设置的字符集选项中设置 强制 `UTF-8`。

如果需要复制文件，直接左右窗口拖动即可。

# 4. ubuntu访问windows共享文件夹

参考：[https://www.cnblogs.com/smartjourneys/articles/7992298.html](https://www.cnblogs.com/smartjourneys/articles/7992298.html)