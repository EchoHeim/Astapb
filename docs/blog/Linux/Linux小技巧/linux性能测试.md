### <center> <font size=34 face="STKaiti"> Linux性能测试 </font>    <!-- {docsify-ignore} -->

# 1. linux查看CPU温度

- 无需安装工具即可查看：

``` bash
cat /sys/class/thermal/thermal_zone0/temp
```

- 或者直接以度为单位显示

``` bash
echo $[$(cat /sys/class/thermal/thermal_zone0/temp)/1000]
```

> 显示数字为千分之一度。所以说，除以1000就是当前温度值。

- 可以设置watch实时观看

``` bash
watch -n 0.1 echo CPU: $[$(cat /sys/class/thermal/thermal_zone0/temp)/1000]°
```

# 2. linux压力测试工具

stress是一个linux下的压力测试工具，专门为那些想要测试自己的系统，完全高负荷和监督这些设备运行的用户。

## 2.1 安装

``` bash
sudo apt install stress
```

## 2.2 使用

- 测试CPU负荷

``` bash
stress --cpu 2 --timeout 60
```

开启4个CPU进程执行sqrt计算，提高系统CPU负荷，60秒后结束。


　　2、内存测试

　　　　输入命令：stress –i 4 –vm 10 –vm-bytes 1G –vm-hang 100 –timeout 100s

　　　　新增4个io进程，10个内存分配进程，每次分配大小1G，分配后不释放，测试100S

　　3、磁盘I/O测试

　　　　输入命令：stress –d 1 --hdd-bytes 3G

　　　　新增1个写进程，每次写3G文件块

　　4、硬盘测试（不删除）

　　　　输入命令：stress –i 1 –d 10 --hdd-bytes 3G –hdd-noclean

　　　　新增1个IO进程，10个写进程，每次写入3G文件块，且不清除，会逐步将硬盘耗尽。



参考：

<https://blog.csdn.net/A642960662/article/details/123030151#t4>