#!/bin/bash

sleep 5

CHECK_CFG=/mnt/udisk/check_wifi.cfg

gpio_root=/sys/class/gpio

source $CHECK_CFG

cd /sys/class/gpio
echo 229 > export
cd /sys/class/gpio/gpio229
echo out > direction

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

function check_wifi() {
    echo ""
    echo -e " ==== Checking wifi... ===="
    echo ""

    ping -c 1 $(IP_GATEWAY) -I wlan0 & wait $!
    if [ $? == 0 ]; then        # wifi ok
        success_num=`expr $success_num + 1`
        reboot_count=`expr $reboot_count + 1`
        sed -i "s/^success_num=.*$/success_num=$success_num/" $CHECK_CFG
        sed -i "s/^reboot_count=.*$/reboot_count=$reboot_count/" $CHECK_CFG
    else
        reboot_count=`expr $reboot_count + 1`
        sed -i "s/^reboot_count=.*$/reboot_count=$reboot_count/" $CHECK_CFG
    fi
    sudo reboot
}

while [[ $reboot_count -lt $test_num ]]
do
    for i in {1..60};
    do
        echo $i;
        echo 1 > value
        sleep 0.5
        echo 0 > value
        sleep 0.5
    done

    check_wifi
done

if [[ $success_num -lt $reboot_count ]]; then
    echo "***** test error! *****"
    echo 1 > value
else
    echo "===== test ok! ====="
    while true
    do
        sleep 0.1
        echo 0 > value
        sleep 0.1
        echo 1 > value
    done
fi
