#!/bin/bash

cd ~

url=https://issuepcdn.baidupcs.com/issue/netdisk/yunguanjia/BaiduNetdisk_7.19.0.18.exe

function test_download() {
    j=$1
    for ((i = 1; i <= j; i++)); do
        sudo nmcli dev wifi connect BIQU-F password 123456789 ifname wlan0
        [[ -f BaiduNetdisk_7.19.0.18.exe ]] && rm -f BaiduNetdisk_7.19.0.18.exe
        sync
        if wget "${url}"; then
            echo "Download complete!"
        else
            echo "Test failed!"
            exit 1
        fi
        sleep 3

        sudo nmcli dev wifi connect BIQU password BiQu_HW@8888 ifname wlan0
        [[ -f BaiduNetdisk_7.19.0.18.exe ]] && rm -f BaiduNetdisk_7.19.0.18.exe
        sync
        if wget "${url}"; then
            echo "Download complete!"
        else
            echo "Test failed!"
            exit 1
        fi
        sleep 3
    done
}

if [ $# == 0 ]; then
    test_download 3
elif [ $# == 1 ]; then
    test_download $1
fi
