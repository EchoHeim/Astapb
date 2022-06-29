### <center> <font size=34 face="STKaiti"> 设置静态IP </font>    <!-- {docsify-ignore} -->

编译配置文件
``` bash
sudo vim /etc/network/interfaces
```

打开后里面可设置DHCP或手动设置静态ip，前面`auto eth0`，是让网卡开机自动挂载。

> 以DHCP方式配置网卡

用以下内容替换有关eth0的配置

``` config
#The primary network interface - use DHCP to find our address
auto eth0
iface eth0 inet dhcp
```

可以在命令行下直接输入下面的命令来获取地址

``` bash
sudo dhclient eth0
```

> 例如想要设置eth0为静态IP，可以添加以下内容

``` config
auto eth0
iface eth0 inet static
address 192.168.1.90            # IP地址
gateway 192.168.1 .1            # 网关
netmask 255.255.255.0           # 子网掩码
#network 192.168.3.0
#broadcast 192.168.3.255
```

用下面的命令使网络设置生效

``` bash
sudo /etc/init.d/networking restart
```
