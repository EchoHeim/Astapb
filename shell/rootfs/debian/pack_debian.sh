#!/bin/bash

if [ $OS_Choose -eq 1 ]; then
    Work_Dir=debian_buster
    OS_Ver=buster
elif [ $OS_Choose -eq 2 ]; then
    Work_Dir=debian_bullseye
    OS_Ver=bullseye
fi

cd $PATH_UPDATE/STlinux5.4/rootfs/
dd if=/dev/zero of=rootfs.ext4 bs=1M count=2048
mkfs.ext4 -L rootfs rootfs.ext4

sudo mount rootfs.ext4 /mnt/rootfs/

cd $ARM_DEBIAN_ROOTFS_PATH/$Work_Dir
sudo cp ./* /mnt/rootfs/ -drf

sync

sudo umount /mnt/rootfs

cd $PATH_UPDATE/STlinux5.4/rootfs/
mv rootfs.ext4 $PATH_UPDATE/STlinux5.4/rootfs_$Work_Dir.ext4
