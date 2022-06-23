#!/bin/bash    

# 确保本脚本没有重复运行

# what=`basename $0`
# for p in `ps h -o pid -C $what`; do
#     if [ $p != $$ ]; then
#         sleep 5
#         echo "Error"
#         exit 0
#     else
#         echo "Success"
#     fi
# done

# source configuration
# 本来他是通过一个配置文件导入信息的，我直接把信息写在这了
#. /etc/wifi.conf

check_interval=60
wlan=wlan0
router_ip=8.8.8.8

# 从这往上没变化

exec 1> /dev/null
# without check_interval set, we risk a 0 sleep = busy loop
if [ ! "$check_interval" ]; then
    echo "No check interval set!" >> $log
    exit 1
fi

# ./start_wifi.sh
sleep 30

startWifi () {
    if ! ifconfig | grep $wlan;then
        sudo ifconfig $wlan up
    fi
	# 确保wlan连接启动了
	
    if ps -ef | grep wpa_supplicant | grep -v grep;then
        sudo kill -9 `pidof wpa_supplicant`
        sudo killall wpa_supplicant
    fi

    # 连接wifi 注意配置文件的路径
    sudo wpa_supplicant -Dnl80211 -c /etc/wpa_supplicant.conf -i $wlan &

    if ifconfig | grep $wlan | grep -v grep;then
        if ps -ef | grep dhcpcd | grep -v grep;then
            sudo kill -9 `pidof dhcpcd`
        fi
        echo "udhcpc"
        sudo udhcpc -i $wlan
    fi
    # 获取ip地址
    sleep 20
}

# startWifi

while [ 1 ]; do
    ping -c 1 $router_ip & wait $!
    if [ $? != 0 ]; then
        echo $(date)" attempting restart..."
        startWifi
        sleep 10
        # 更改间隔时间，因为有些服务启动较慢，试验后，改的间隔长一点有用
    else 
        ping -c 1 $router_ip -I eth0 & wait $!
        if [ $? == 0 ]; then
            sudo ifconfig $wlan down
            echo "wlan down"
        fi
        sleep $check_interval
    fi
done
