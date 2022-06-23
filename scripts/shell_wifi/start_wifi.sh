#!/bin/bash

# ********************** wifi ***************************** #
# sudo ifconfig eth0 down

sudo ifconfig wlan0 up

sudo killall wpa_supplicant

sudo wpa_supplicant -Dnl80211 -c /etc/wpa_supplicant.conf -i wlan0 &

sudo udhcpc -i wlan0

# sudo ifconfig eth0 up

# 扫描 wifi
# sudo iwlist wlan0 scanning

# 查询网络连接质量
# sudo iwconfig wlan0 | grep -i --color quality

# 查询信号强度
# sudo iwconfig wlan0 | grep -i --color signal

# 查看扫描网络信号强度
# sudo wpa_cli scan_results
