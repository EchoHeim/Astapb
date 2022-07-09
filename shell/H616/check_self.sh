#!/bin/bash

sleep 14
clear='\033[0m'
red='\033[31m'
green='\033[32m'
yellow='\033[33m'

usb_status="$red ERROR! $clear"
hdmi_status="$red ERROR! $clear"
wifi_status="$red ERROR! $clear"
phy_status="$red ERROR! $clear"
usb_device_mount=0

function tab_format(){
    f_name=$1
    [ $# == 1 ] && echo "$(printf "%-$1s" "")"
    [ $# == 2 ] && echo "$(printf "%-$2s" "$f_name")"
    unset f_name
}

function IP_GATEWAY(){
    local_ip=`ifconfig -a|grep inet|grep -v 127.0.0.1|grep -v inet6|awk '{print $2}'|tr -d "addr:"`

    IP_ADDR="${local_ip%.*}.1"
    echo $IP_ADDR
}

function check_hdmi() {
    echo -e "\n $yellow Checking hdmi... $clear\n"

    if [ -e "/dev/fb0" ]; then
        hdmi_status="$green OK! $clear"
    fi
    echo ""
    echo -e "hdmi is $hdmi_status "
}

function check_usb() {
    echo -e "\n $yellow Checking usb... $clear\n"

    if [ -d "/dev/serial/by-id/" ]; then
        m4p_id=`ls /dev/serial/by-id/`
        echo -e "m4p_id is $m4p_id\n"

        c=0
        cd /dev/bus/usb/001
        for file in `ls`
        do
            filelist[$c]=$file
            ((c++))
        done
        usb_device_mount=`expr $c - 3`

        echo -e "There is $green $usb_device_mount $clear usb devices\n"

        if [ $usb_device_mount -ge 1 ]; then
            usb_status="$green OK! $clear"
        fi
        echo ""

        unset c
        unset filelist
    fi
    echo ""
    echo -e "usb is $usb_status"
}

function check_wifi() {
    echo ""
    echo -e " $yellow ==== Checking wifi... ====$clear"
    echo ""

    sudo ifconfig wlan0 up
    sudo killall wpa_supplicant
    sudo wpa_supplicant -Dnl80211 -c /etc/wpa_supplicant.conf -i wlan0 &
    sudo udhcpc -i wlan0
    sleep 6

    ping -c 1 $(IP_GATEWAY) -I wlan0 & wait $!
    if [ $? == 0 ]; then
        wifi_status="$green OK! $clear"
    fi
    echo ""
    echo -e "wifi is $wifi_status"
}

function check_phy() {
    echo ""
    echo -e " $yellow ==== Checking phy... ==== $clear"
    echo ""

    ping -c 1 $(IP_GATEWAY) -I eth0 & wait $!
    if [ $? == 0 ]; then
        phy_status="$green OK! $clear"
    fi
    echo -e "phy is $phy_status"
}

check_hdmi
check_usb
check_wifi
check_phy

free -h --si

echo ""

echo -e "/============ Self-check results ==============\\"
echo -e "       HDMI ---> $hdmi_status                  "
echo -e "        USB ---> $usb_status      USB_device : $green $usb_device_mount $clear             "
echo -e "       WIFI ---> $wifi_status                  "
echo -e "        PHY ---> $phy_status                   "
echo -e "\==============================================/"
