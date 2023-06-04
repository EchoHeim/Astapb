#!/bin/bash

function build_rpi() {
    [[ "$1" == "pi3" && "$2" == "32" ]] && read -p "${yellow} Please choose: ${red}" action && echo -e "${clear}"
    [[ "$1" == "pi4" ]] && echo "${yellow} Revert to SD card or eMMC? (Please Choose)" && read -p " 1:SD card / 2:eMMC ${red}" SD_or_eMMC && echo -e "${clear}"

    cd $PATH_PI_WORKSPACE
    echo -e "$yellow\n The work path is:$clear \c"
    pwd

    config="N"
    Manual_config="N"

    echo -e "\n$purple Need to configure the kernel?$red_flash (y/N)$clear \c"
    read config

    if [[ $config = "y" || $config = "Y" ]]; then
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

}

function build_pi3_32bit() {
    KERNEL=kernel7
    [[ $Manual_config = "y" || $Manual_config = "Y" ]] && CFG="menuconfig" || CFG="bcm2709_defconfig"
    make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- $CFG
    make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- zImage modules dtbs
}

function build_pi3_64bit() {
    KERNEL=kernel8
    make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- bcm2711_defconfig
    make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- Image modules dtbs
}

function build_pi4_32bit() {
    KERNEL=kernel7l
    make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- bcm2711_defconfig
    make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- zImage modules dtbs
}

function build_pi4_64bit() {
    KERNEL=kernel8
    make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- bcm2711_defconfig
    make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- Image modules dtbs
}

function install_modules() {
    [ -d "/media/$USERNAME/rootfs" ] || return 0

    if [ -d "/media/$USERNAME/rootfs" ]; then # 判断文件夹是否存在;
        status_msg "modules install..."
        sudo env PATH=$PATH make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- INSTALL_MOD_PATH=/media/$USERNAME/$MOUNT_DIR modules_install
        status_msg "kernel backup..."
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
    else # 文件夹不存在;
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
}
