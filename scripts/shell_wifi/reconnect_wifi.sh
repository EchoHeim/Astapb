#!/bin/bash    

source /etc/system.cfg     # 加载配置文件

exec 1> /dev/null
# without check_interval set, we risk a 0 sleep = busy loop
if [ ! "$check_interval" ]; then
    echo $(date)" ===> No check interval set!" >> /home/biqu/scripts/wifi.log
    exit 1
fi

sudo kill -9 `pidof wpa_supplicant`
sleep 2
systemctl restart NetworkManager

startWifi () {
    if ! ifconfig | grep $wlan;then         # 确保wlan连接启动了
        sudo ifconfig $wlan up
    fi

    nmcli device connect $wlan              # 连接wifi
    sleep 6

    ping -c 1 $router_ip & wait $!
    if [ $? != 0 ]; then        # 没有网络连接
        echo $(date)" connecting..."
        sudo nmcli dev wifi connect $WIFI_SSID password $WIFI_PASSWD ifname $wlan
        # sudo nmcli dev wifi connect $WIFI_SSID password $WIFI_PASSWD wep-key-type key ifname $wlan
    fi
}

while [ 1 ]; do
    ping -c 1 $router_ip & wait $!
    if [ $? != 0 ]; then        # 没有网络连接
        echo $(date)" attempting restart..."
        startWifi
        sleep 10    # 更改间隔时间，因为有些服务启动较慢，试验后，改的间隔长一点有用
    else
        ping -c 1 $router_ip -I eth0 & wait $!  
        if [ $? == 0 ]; then            # 以太网连接
            nmcli device disconnect $wlan
            echo "==== wlan disconnect! ====="
        fi
        sleep $check_interval
    fi
done
