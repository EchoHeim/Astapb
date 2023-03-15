# 0. 说明

# 1. reconnect_wifi.sh

## 1.1 文件说明

wifi 自动重连，放在开机运行脚本里

[参考](https://blog.csdn.net/JoeNahm/article/details/89224924)

## 1.2 wifi_AP 模式

参考文件夹 soft_ap

# 2. 常用网络相关命令

## 2.1 扫描 wifi
sudo iwlist wlan0 scanning

## 2.2 查询网络连接质量
sudo iwconfig wlan0 | grep -i --color quality

## 2.3 查询信号强度
sudo iwconfig wlan0 | grep -i --color signal

## 2.4 查看扫描网络信号强度
sudo wpa_cli scan_results

## 2.5 获取动态IP
sudo udhcpc -i wlan0


## 2.6 wpa工具
sudo killall wpa_supplicant
sudo wpa_supplicant -Dnl80211 -c /etc/wpa_supplicant.conf -i wlan0 &

## 2.7 nmcli工具
sudo systemctl restart NetworkManager
sudo nmcli dev wifi connect biqu-m password biqu2020 ifname wlan0



使用create_ap开启热点，关闭后，无法连接wifi.

使用sudo rfkill list all发现wifi没有被锁住，使用 sudo service network-manager start也无法解决问题

后来使用create_ap -h查看此软件的相关帮助，其中有

```
--fix-unmanaged If NetworkManager shows your interface as unmanaged after you
close create_ap, then use this option to switch your interface
back to managed
```

然后使用`sudo create_ap --fix-unmanaged`，解决了此问题



# 开启 wifi 热点
sudo systemctl start create_ap
# 关闭 wifi 热点
sudo systemctl stop create_ap


sudo systemctl stop create_ap
sleep 2
sudo create_ap --fix-unmanaged
sleep 4
sudo systemctl restart NetworkManager
sleep 2
sudo nmcli dev wifi connect biqu-m password biqu2020 ifname wlan0

sudo nmcli dev wifi connect CB1\ Tester password 12345678 ifname wlan0

sudo nmcli dev wifi connect BIQU password BiQu_HW@8888 ifname wlan0


sudo nmcli dev wifi connect Verizon-MiFi8800L-FECO password password ifname wlan0

sudo nmcli dev wifi connect IPhoneX password msq123321 ifname wlan0
sudo nmcli dev wifi connect BIQU-F password 123456789 ifname wlan0

sudo nmcli c modify BIQU-F wifi-sec.key-mgmt wpa-psk

添加隐藏网络：
nmcli c add type wifi con-name IPhoneX ifname wlan0 ssid IPhoneX

设置wifi的连接加密方式及密码：
nmcli c modify IPhoneX wifi-sec.key-mgmt wpa-psk wifi-sec.psk msq123321

启动wifi：
nmcli c up IPhoneX

关闭wifi：
nmcli c down IPhoneX
