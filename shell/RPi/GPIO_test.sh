#!/bin/bash

# 作用
# 自动化测试树莓派 40pin 外接输出引脚，定时让所有 IO 自动输出高低电平;
# 测试 io 口输出是否正常;

# ![树莓派引脚图](https://user-images.githubusercontent.com/26021085/155838003-5542a8c4-f9a3-4975-9045-9dbd5e0a2f84.jpg)

cd /sys/class/gpio

flashTime=3     # 闪烁频率 秒
cycleNum=2      # 循环次数

echo "OPEN"

for item in $(seq 0 1 27)
do
        sudo echo $item > export
        
        cd gpio$item
        
        sudo echo out > direction
        cd ..
done

for count in $(seq 1 1 $cycleNum)
do
        echo 'ON'

        for item in $(seq 0 1 27)
        do
                sudo echo 0 > ./gpio$item/value
        done

        sleep $flashTime

        echo 'OFF'

        for item in $(seq 0 1 27)
        do
                sudo echo 1 > ./gpio$item/value
        done

        sleep $flashTime
done

echo "CLOSE"

for item in $(seq 0 1 27)
do
        sudo echo $item > unexport
done
