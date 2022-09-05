#!/bin/bash

new_username=biqu
old_username=kandy

hostname=Hurakan

sudo pkill -u $old_username
sudo pkill -9 -u $old_username

usermod -l $new_username $old_username
usermod -d /home/$new_username -m $new_username
groupmod -n $new_username $old_username
usermod -u 1000 $new_username

hostnamectl set-hostname $hostname

id $new_username        # check log
