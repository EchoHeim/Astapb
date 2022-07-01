#!/bin/bash

Pi_Ver=0

echo -e "\n$blue/==================================================\\\\$clear"
echo -e "$V_line $green         *****  $pi_str for $pi_ver_str  *****          $clear $V_line"
echo -e "$blue\\==================================================/$clear"

cd $KERNEL_PATH
echo -e "$yellow\n The work path is:$clear \c"
pwd

if [ $pi_str == 'install' ]; then
    if [ -d "/media/$USERNAME/rootfs" ];then                                    # 判断文件夹是否存在;
        echo -e "$green\n**** modules install... ****\n$clear"
        sudo env PATH=$PATH make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- INSTALL_MOD_PATH=/media/$USERNAME/$MOUNT_DIR modules_install

        echo -e "$green\n**** kernel backup... ****\n$clear"
        sudo cp /media/$USERNAME/boot/$KERNEL.img /media/$USERNAME/boot/$KERNEL-backup.img

        echo -e "$green\n**** copy Kernel.img... ****\n$clear"
        sudo cp $KERNEL_PATH/arch/arm/boot/zImage /media/$USERNAME/boot/$KERNEL.img

        echo -e "$green\n**** copy dtb... ****\n$clear"
        sudo cp $KERNEL_PATH/arch/arm/boot/dts/*.dtb /media/$USERNAME/boot

        echo -e "$green\n**** copy overlays/dtb... ****\n$clear"
        sudo cp $KERNEL_PATH/arch/arm/boot/dts/overlays/*.dtb* /media/$USERNAME/boot/overlays/

        echo -e "$green\n**** copy overlays/README... ****\n$clear"
        sudo cp $KERNEL_PATH/arch/arm/boot/dts/overlays/README /media/$USERNAME/boot/overlays/
        
        sync
    else    # 文件夹不存在;
        echo -e "\n$blue/==================================================\\\\$clear"
        echo -e "$V_line $yellow                  [ Warning ]                   $clear $V_line"
        echo -e "$V_line $yellow         **** No sd card inserted! ****         $clear $V_line"
        echo -e "$blue\\==================================================/$clear"
        exit 0
    fi

    echo -e "\n$blue/==================================================\\\\$clear"
    echo -e "$V_line $yellow                  [  Notice  ]                  $clear $V_line"
    echo -e "$V_line $yellow       **** install kernel complete! ****       $clear $V_line"
    echo -e "$blue\\==================================================/$clear"
    exit 0
fi

config="N"
Manual_config="N"

echo -e "\n$purple Need to configure the kernel?$red_flash (y/N)$clear \c"
read config

if [[ $config = "y" || $config = "Y" ]]
then
    echo -e "\n$purple Need to configure it manually? $red_flash(y/N)$clear \c"
    read Manual_config
    
    if [[ $Manual_config = "y" || $Manual_config = "Y" ]]; then
        make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- menuconfig
    else
        if [ $pi_ver_str == "Pi3" ]; then
            make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- bcm2709_defconfig
        elif [ $pi_ver_str == "Pi4" ]; then
            make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- bcm2711_defconfig
        else
            echo -e "\n $blue/==================================================\\\\$clear"
            echo -e " $V_line $red_flash     Compile kernel error,Pi type was wrong!    $clear $V_line"
            echo -e " $blue\\==================================================/$clear"
        fi
    fi
fi

echo -e "\n$green**** compile kernel... ****$clear\n"

make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- zImage modules dtbs

echo -e "\n$blue/==================================================\\\\$clear"
echo -e "$V_line $yellow                  [  Notice  ]                  $clear $V_line"
echo -e "$V_line $yellow       **** compile kernel complete! ****       $clear $V_line"
echo -e "$blue\\==================================================/$clear"
