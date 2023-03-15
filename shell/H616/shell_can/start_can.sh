#!/bin/bash

# ********************** can ***************************** #

# 设定 波特率
sudo ip link set can0 type can bitrate 500000

# 设定缓冲区大小
sudo chmod 666 /sys/class/net/can0/tx_queue_len
sudo echo 1024 > /sys/class/net/can0/tx_queue_len

# 打开 can0
sudo ifconfig can0 up
