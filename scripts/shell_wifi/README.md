# 0. 说明

编写工作中用到的小脚本

# 1. start_wifi.sh

## 1.1 文件说明

开机自启动，先断开 eth0，然后开启 wlan0，申请 IP 后再开启 eth0；

## 1.2 配置文件

文件路径：

``` text
/etc/wpa_supplicant.conf
```

文件内容：

``` text
ctrl_interface=/var/run/wpa_supplicant
ctrl_interface_group=0
update_config=1

network={
    ssid="biqu-m"
    psk="biqu2020"
}

network={
    ssid="BIQU"
    psk="BiQu_HW@8888"
}
```

# 2. reconnect_wifi.sh

## 2.1 文件说明

wifi 自动重连，放在开机运行脚本里

[参考](https://blog.csdn.net/JoeNahm/article/details/89224924)
