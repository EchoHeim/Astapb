#!/bin/bash

sudo dd if=/dev/zero of=/swap-file bs=1M count=512
sync
sudo mkswap /swap-file

sudo sed -i '1a /swap-file  none    swap    sw  0   0' /etc/fstab
sync

reboot
