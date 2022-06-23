#!/bin/bash

echo -e "\r\nhello stm32mp1_MCU!\r\n"

sudo chmod 666 /sys/class/remoteproc/remoteproc0/firmware
sudo chmod 666 /sys/class/remoteproc/remoteproc0/state 

sudo echo klipper.elf > /sys/class/remoteproc/remoteproc0/firmware

sudo echo start > /sys/class/remoteproc/remoteproc0/state

echo -e "\r\n Run . . . \r\n"

