# 1. start_can.sh

## 1.1 文件说明

开机自启动，打开 can 通信；

## 1.2 信息查看

查看 can0 加载 信息

``` bash
dmesg | grep -i '\(can\|spi\)'
```

查看 can0 信息

``` bash
sudo ip -details link show can0
```

![image](https://user-images.githubusercontent.com/26021085/177245475-4bbc506d-6064-404d-a469-8d415cbec2f6.png)


## 1.3 klipper操作

连接can设备

``` bash
~/klippy-env/bin/python ~/klipper/scripts/canbus_query.py can0
```

若出现错误：

``` text
mcu 'mcu': Unable to open CAN port: Failed to transmit: [Errno 100] Network is down
```

运行以下命令，然后重启

``` bash
~/moonraker/scripts/set-policykit-rules.sh
```
