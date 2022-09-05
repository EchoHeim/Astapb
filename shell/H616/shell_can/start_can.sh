#!/bin/bash

# ********************** can ***************************** #

# 设定 波特率
sudo ip link set can0 type can bitrate 250000

# 设定缓冲区大小
sudo chmod 666 /sys/class/net/can0/tx_queue_len
sudo echo 1024 > /sys/class/net/can0/tx_queue_len

# 打开 can0
sudo ifconfig can0 up

![image](https://user-images.githubusercontent.com/26021085/177245475-4bbc506d-6064-404d-a469-8d415cbec2f6.png)
