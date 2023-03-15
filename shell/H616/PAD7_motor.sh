#!/bin/bash

cd /sys/class/gpio/gpio79

sudo echo 1 > value 
sleep 0.05
sudo echo 0 > value
