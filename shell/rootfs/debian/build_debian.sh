#!/bin/bash

cd $ARM_DEBIAN_ROOTFS_PATH

if [ $OS_Choose -eq 1 ]; then
    Work_Dir=debian_buster
    OS_Ver=buster
    sudo rm ./debian_buster/ -fr
    mkdir debian_buster
elif [ $OS_Choose -eq 2 ]; then
    Work_Dir=debian_bullseye
    OS_Ver=bullseye
    sudo rm ./debian_bullseye/ -fr
    mkdir debian_bullseye
fi

echo -e " $green\n***** Build $OS_Ver system! *****\n $clear"

echo -e " $green\n***** apt update! *****\n $clear"
sudo apt update

echo -e " $green\n***** debootstrap from tsinghua/aliyun! *****\n $clear"
sudo debootstrap --arch=armhf --foreign $OS_Ver $Work_Dir https://mirrors.tuna.tsinghua.edu.cn/debian/    # 清华镜像源
# sudo debootstrap --arch=armhf --foreign $OS_Ver $Work_Dir https://mirrors.aliyun.com/debian/                # 阿里镜像源

sudo cp /usr/bin/qemu-arm-static  $Work_Dir/usr/bin

echo -e " $green\n***** chroot debootstrap! *****\n $clear"
sudo DEBIAN_FRONTEND=noninteractive DEBCONF_NONINTERACTIVE_SEEN=true LC_ALL=C LANGUAGE=C chroot $Work_Dir debootstrap/debootstrap --second-stage 

if [ $? != 0 ]; then        # 判断上一条命令是否成功执行;
    echo -e "\n$blue/==================================================\\\\$clear"
    echo -e "$V_line $yellow                  [ Warning ]                   $clear $V_line"
    echo -e "$V_line $red_flash          **** Build debian fail! ****          $clear $V_line"
    echo -e "$blue\\==================================================/$clear"

    exit 0
fi

if [[ $OS_Ver == buster ]]; then
    sudo chmod 666 $Work_Dir/etc/securetty
    sudo echo "ttySTM0" >> $Work_Dir/etc/securetty          # 允许 root 用户登录 ttySTM0;
fi

sudo cp $SHELL_ROOT_PATH/ArmDebian/initOS.sh $Work_Dir/root
sudo cp $SHELL_ROOT_PATH/stm32mp1/others/launch_M4.sh $Work_Dir/etc/         # MP157 M4核启动脚本;

cd $ARM_DEBIAN_ROOTFS_PATH/$Work_Dir

sudo mkdir -p usr/share/man/man1/
sudo mknod dev/console c 5 1        # 创建设备节点;

sudo mkdir lib64
sudo cp /lib64/ld-linux-x86-64.so.2 ./lib64/
sudo mkdir ./lib/x86_64-linux-gnu
sudo cp /lib/x86_64-linux-gnu/libcap.so.2 ./lib/x86_64-linux-gnu/
sudo cp /lib/x86_64-linux-gnu/libtinfo.so.6 ./lib/x86_64-linux-gnu/
sudo cp /lib/x86_64-linux-gnu/libdl.so.2 ./lib/x86_64-linux-gnu/
sudo cp /lib/x86_64-linux-gnu/libc.so.6 ./lib/x86_64-linux-gnu/
sudo cp /lib/x86_64-linux-gnu/libm.so.6 ./lib/x86_64-linux-gnu/

sudo cp /usr/lib/x86_64-linux-gnu/zsh ./lib/x86_64-linux-gnu/ -r
sudo cp /bin/zsh ./bin

sync

#################### wifi module ########################
cd $ARM_DEBIAN_ROOTFS_PATH/$Work_Dir

# sudo mkdir ./lib/modules/5.4.31 -p

# sudo cp $PATH_SOURCE_5_4_KERNEL/drivers/staging/rtl8188eu/r8188eu.ko $Work_Dir/lib/modules/5.4.31/
# sudo cp $PATH_SOURCE_5_4_KERNEL/net/wireless/cfg80211.ko $Work_Dir/lib/modules/5.4.31/
# sudo cp $PATH_SOURCE_5_4_KERNEL/drivers/net/wireless/realtek/rtl8723ds/8723ds.ko $Work_Dir/lib/modules/5.4.31/

sudo mkdir ./lib/firmware/rtlwifi -p
sudo cp $PATH_ST_WORKSPACE/bin/rtl_wifi/regulatory.db* ./lib/firmware/
sudo cp $PATH_ST_WORKSPACE/bin/rtl_wifi/rtl8188eufw.bin ./lib/firmware/rtlwifi/

sync

#======================= QT =============================
if [ $ARM_QT -eq 1 ]; then

    cd $Qt_dir

    tar jcf arm-qt.tar.bz2 arm-qt

    cd /home/lodge/ArmDebian
    sudo mv $Qt_dir/arm-qt.tar.bz2 ./$Work_Dir/usr/lib
    sudo cp $Qt_dir/../tslib.tar.bz2 ./$Work_Dir/usr/lib

    sync
fi

echo -e "\n$blue/==================================================\\\\$clear"
echo -e "$V_line $yellow                  [  Notice  ]                  $clear $V_line"
echo -e "$V_line $yellow        **** Build debian complete! ****        $clear $V_line"
echo -e "$blue\\==================================================/$clear"

