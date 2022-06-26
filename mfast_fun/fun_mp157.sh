#!/bin/bash

function mp157_init_Env(){
    source ~/STM32MP157/SDK/environment-setup-cortexa7t2hf-neon-vfpv4-ostl-linux-gnueabi
}

function mp157_cpmpile_TF-a(){
    cd $PATH_SOURCE_5_4_TF_A
        
    echo -e "\n$purple Compile TF-A firmware? $red_flash(y/N)$clear \c"
    read Compile_TF_A_YN
    if [[ $Compile_TF_A_YN == "y" || $Compile_TF_A_YN == "Y" ]]; then
        echo -e "\n$green -------------------- $clear\n"

        make -f ../Makefile.sdk clean 
        make -f ../Makefile.sdk TFA_DEVICETREE=stm32mp157d-${CompanyLogo} TF_A_CONFIG=serialboot ELF_DEBUG_ENABLE='1' all
        cp ../build/serialboot/tf-a-stm32mp157d-${CompanyLogo}-serialboot.stm32 $PATH_UPDATE/STlinux5.4/tf-a/
        sync
        
        make -f ../Makefile.sdk clean
        make -f ../Makefile.sdk TFA_DEVICETREE=stm32mp157d-${CompanyLogo}-sr TF_A_CONFIG=serialboot ELF_DEBUG_ENABLE='1' all
        cp ../build/serialboot/tf-a-stm32mp157d-${CompanyLogo}-sr-serialboot.stm32 $PATH_UPDATE/STlinux5.4/tf-a/
        make -f ../Makefile.sdk clean
        sync

        make -f ../Makefile.sdk all

        echo -e "\n$green **** Copy file... ****$clear\n"

        cp ../build/trusted/tf-a-stm32mp157d-${CompanyLogo}-trusted.stm32 $PATH_UPDATE/STlinux5.4/tf-a/
        cp ../build/trusted/tf-a-stm32mp157d-${CompanyLogo}-sr-trusted.stm32 $PATH_UPDATE/STlinux5.4/tf-a/

        sync

        echo -e "\n$green **** Build TF-A complete! ****$clear\n"
    fi
}

function mp157_cpmpile_u-boot(){
 cd $PATH_SOURCE_5_4_U_BOOT
            
            echo -e "\n$purple Compile u-boot firmware? $red_flash(y/N)$clear \c"
            read Compile_u_boot_YN
            if [[ $Compile_u_boot_YN == "y" || $Compile_u_boot_YN == "Y" ]]; then
                echo -e "\n$green -------------------- $clear\n"

                # make V=1 ARCH=arm CROSS_COMPILE=arm-none-linux-gnueabihf- DEVICE_TREE=stm32mp157d-${CompanyLogo} all -j8
                make DEVICE_TREE=stm32mp157d-${CompanyLogo} all -j8
                
                #make DEVICE_TREE=stm32mp157d-${CompanyLogo} UBOOT_CONFIGS=stm32mp15_${CompanyLogo}_trusted_defconfig,trusted,u-boot.stm32 all

                echo -e "\n$green **** Copy file... ****$clear\n"

                # cp ./u-boot.stm32 $PATH_UPDATE/STlinux5.4/u-boot/
                cp ./u-boot.stm32 $PATH_UPDATE/STlinux5.4/u-boot/u-boot-stm32mp157d-${CompanyLogo}.stm32
                cp ./u-boot.stm32 $PATH_UPDATE/STlinux5.4/u-boot/u-boot-stm32mp157d-${CompanyLogo}-sr.stm32

                sync
                
                echo -e "\n$green **** Build u-boot complete! ****$clear\n"
            fi

}

function mp157_cpmpile_kernel(){
 cd $PATH_SOURCE_5_4_KERNEL

            echo -e "\n$purple Compile kernel firmware? $red_flash(y/N)$clear \c"
            read Compile_kernel_YN
            
            if [[ $Compile_kernel_YN == "y" || $Compile_kernel_YN == "Y" ]]; then
                echo -e "\n$purple Install kernel driver modules? $red_flash(y/N)$clear \c"
                read ModuleInstall_YN

                echo -e "\n$green ------ make menuconfig ------ $clear\n"
                # make ARCH=arm CROSS_COMPILE=arm-none-linux-gnueabihf- stm32mp157d_${CompanyLogo}_defconfig
                
                make ARCH=arm CROSS_COMPILE=arm-none-linux-gnueabihf- menuconfig
                
                if [[ $ModuleInstall_YN == "y" || $ModuleInstall_YN == "Y" ]]; then
                    if [ -d "/media/$USERNAME/$MOUNT_DIR" ];then                                    # 判断文件夹是否存在;
                        echo -e "\n$green **** Compile module files... ****$clear\n"
                        make ARCH=arm CROSS_COMPILE=arm-none-linux-gnueabihf- dtbs          # 重新编译设备树;
                        make ARCH=arm CROSS_COMPILE=arm-none-linux-gnueabihf- modules -j12  # 编译驱动模块;

                        echo -e "\n$green **** Modules install... ****$clear\n"
                        sudo make ARCH=arm CROSS_COMPILE=arm-none-linux-gnueabihf- modules_install INSTALL_MOD_PATH=/media/$USERNAME/$MOUNT_DIR   # 安装模块;
                    else    # 文件夹不存在;
                        echo -e "\n$blue/==================================================\\\\$clear"
                        echo -e "$V_line $yellow                  [ Warning ]                   $clear $V_line"
                        echo -e "$V_line $yellow         **** No sd card inserted! ****         $clear $V_line"
                        echo -e "$blue\\==================================================/$clear"
                        exit 0
                    fi
                fi

                echo -e "\n$green **** Compile kernel... ****$clear\n"
                make ARCH=arm CROSS_COMPILE=arm-none-linux-gnueabihf- DEVICE_TREE=stm32mp157d-${CompanyLogo} uImage dtbs LOADADDR=0XC2000040 -j16

                echo -e "\n$green **** Copy file... ****$clear\n"

                cp $PWD/arch/arm/boot/uImage $PATH_UPDATE/tftpboot/
                cp $PWD/arch/arm/boot/dts/stm32mp157d-${CompanyLogo}.dtb $PATH_UPDATE/tftpboot/

                cp $PWD/arch/arm/boot/uImage $PATH_UPDATE/STlinux5.4/bootfs/
                cp $PWD/arch/arm/boot/dts/stm32mp157d-${CompanyLogo}.dtb $PATH_UPDATE/STlinux5.4/bootfs/

                echo -e "\n$green **** Packing bootfs... ****$clear\n"

                cd $PATH_UPDATE/STlinux5.4/bootfs/
                dd if=/dev/zero of=bootfs.ext4 bs=1M count=20
                mkfs.ext4 -L bootfs bootfs.ext4

                sudo mount bootfs.ext4 /mnt/bootfs/
                sudo cp uImage stm32mp157d-${CompanyLogo}.dtb /mnt/bootfs/
                sudo umount /mnt/bootfs
                mv bootfs.ext4 $PATH_UPDATE/STlinux5.4/${CompanyLogo}-image-bootfs.ext4
                
                sync

                echo -e "\n$blue/==================================================\\\\$clear"
                echo -e "$V_line $yellow                  [  Notice  ]                  $clear $V_line"
                echo -e "$V_line $yellow        **** Build kernel complete! ****        $clear $V_line"
                echo -e "$blue\\==================================================/$clear"
            fi

}

function mp157_cpmpile_rootfs(){
    cd $PATH_SOURCE_5_4_BUSYBOX

    echo -e "\n Compile busybox firmware? (y/N) \c"
    read Compile_busybox_YN
    if [[ $Compile_busybox_YN == "y" || $Compile_busybox_YN == "Y" ]]; then
        echo -e "\n$green -------------------- $clear\n"

        make 

        echo -e "\n$green **** Copy file... ****$clear\n"

        cp $PWD/arch/arm/boot/uImage $PATH_UPDATE/tftpboot/
        cp $PWD/arch/arm/boot/dts/stm32mp157d-${CompanyLogo}.dtb $PATH_UPDATE/tftpboot/

        cp $PWD/arch/arm/boot/uImage $PATH_UPDATE/STlinux5.4/bootfs/
        cp $PWD/arch/arm/boot/dts/stm32mp157d-${CompanyLogo}.dtb $PATH_UPDATE/STlinux5.4/bootfs/

        echo -e "\n$green **** Build busybox complete! ****$clear\n"
    fi
}

function mp157_clear_TF-a(){
    cd $PATH_SOURCE_5_4_TF_A

    echo -e "\n Clean the TF-A? (y/N) \c"
    read Clean_TF_A_YN
    if [[ $Clean_TF_A_YN = "y" || $Clean_TF_A_YN = "Y" ]]
    then
        make -f $PWD/../Makefile.sdk clean
        echo -e "\n **** Clean TF-A complete! ****\n"
    fi
}

function mp157_clear_u-boot(){
    cd $PATH_SOURCE_5_4_U_BOOT

    echo -e "\n Clean the u-boot? (y/N) \c"
    read Clean_u_boot_YN
    if [[ $Clean_u_boot_YN = "y" || $Clean_u_boot_YN = "Y" ]]
    then

        make distclean
        make ARCH=arm CROSS_COMPILE=arm-none-linux-gnueabihf- stm32mp157d_${CompanyLogo}_defconfig
        
        echo -e "\n **** Clean u-boot complete! ****\n"
    fi
}

function mp157_clear_kernel(){
    cd $PATH_SOURCE_5_4_KERNEL

    echo -e "\n Clean the kernel? (y/N) \c"
    read Clean_kernel_YN
    if [[ $Clean_kernel_YN = "y" || $Clean_kernel_YN = "Y" ]]
    then

        make ARCH=arm CROSS_COMPILE=arm-none-linux-gnueabihf- distclean
        make ARCH=arm CROSS_COMPILE=arm-none-linux-gnueabihf- stm32mp157d_${CompanyLogo}_defconfig

        echo -e "\n **** Clean kernel complete! ****\n"
    fi
}


function mp157_flash_factory() {
    STM32_Programmer_CLI -l usb

    cd $PATH_FACTORY_IMAGE
    echo -e "\n$purple Restore factory image via usb1? $red_flash(y/N)$clear \c"
    read update_YN

    if [[ $update_YN == "y" || $update_YN == "Y" ]]; then
        SD_or_eMMC=0
        echo -e "\n$purple Revert to SD card or eMMC? (Please Choose)"
        echo -e " $red_flash( 1:SD card / 2:eMMC )$clear \c"
        read SD_or_eMMC
        if [[ $SD_or_eMMC == 2 ]]; then
            echo -e "\n$green Restore factory image to eMMC...$clear\n"
            STM32_Programmer_CLI -c port=usb1 -w atk_emmc-stm32mp157d-atk-qt.tsv -tm 20000
        elif [[ $SD_or_eMMC == 1 ]]; then
            echo -e "\n$green Restore factory image to SD card...$clear\n"
            STM32_Programmer_CLI -c port=usb1 -w atk_sdcard-stm32mp157d-atk-qt.tsv -tm 20000
        else
            echo -e "\n$blue/==================================================\\\\$clear"
            echo -e "$V_line $yellow                  [ Warning ]                   $clear $V_line"
            echo -e "$V_line $yellow              **** No Choose! ****              $clear $V_line"
            echo -e "$blue\\==================================================/$clear"
        fi
    fi
    exit 0
}

function mp157_flash_bootfs() {
    STM32_Programmer_CLI -l usb
    echo -e "\n$purple Update the bootfs via usb1? $red_flash(y/N)$clear \c"
    read update_YN

    if [[ $update_YN == "y" || $update_YN == "Y" ]]; then
        SD_or_eMMC=0
        echo -e "\n$purple Revert to SD card or eMMC? (Please Choose)"
        echo -e " $red_flash( 1:SD card / 2:eMMC )$clear \c"
        read SD_or_eMMC

        if [[ $SD_or_eMMC == 2 ]]; then
            echo -e "\n$green Update rootfs image to eMMC...$clear\n"

            if [ $CoreBoardModel == "Atk" ]; then
                if [ $linuxVersion == "5.4" ]; then
                    STM32_Programmer_CLI -c port=usb1 -w ${CompanyLogo}_emmc_bootfs-stm32mp157d_STlinux5.4.tsv -tm 20000
                elif [ $linuxVersion == "5.10" ]; then
                    STM32_Programmer_CLI -c port=usb1 -w ${CompanyLogo}_emmc_bootfs-stm32mp157d_STlinux5.10.tsv -tm 20000
                fi
            elif [ $CoreBoardModel == "${CompanyLogo}" ]; then
                if [ $linuxVersion == "5.4" ]; then
                    STM32_Programmer_CLI -c port=usb1 -w ${CompanyLogo}_emmc_bootfs-stm32mp157d-sr_STlinux5.4.tsv -tm 20000
                elif [ $linuxVersion == "5.10" ]; then
                    STM32_Programmer_CLI -c port=usb1 -w ${CompanyLogo}_emmc_bootfs-stm32mp157d-sr_STlinux5.10.tsv -tm 20000
                fi
            fi
            
        elif [[ $SD_or_eMMC == 1 ]]; then
            echo -e "\n$green Update rootfs image to SD card...$clear\n"

            if [ $CoreBoardModel == "Atk" ]; then
                if [ $linuxVersion == "5.4" ]; then
                    STM32_Programmer_CLI -c port=usb1 -w ${CompanyLogo}_sdcard_bootfs-stm32mp157d_STlinux5.4.tsv -tm 20000
                elif [ $linuxVersion == "5.10" ]; then
                    STM32_Programmer_CLI -c port=usb1 -w ${CompanyLogo}_sdcard_bootfs-stm32mp157d_STlinux5.10.tsv -tm 20000
                fi
            elif [ $CoreBoardModel == "${CompanyLogo}" ]; then
                if [ $linuxVersion == "5.4" ]; then
                    STM32_Programmer_CLI -c port=usb1 -w ${CompanyLogo}_sdcard_bootfs-stm32mp157d-sr_STlinux5.4.tsv -tm 20000
                elif [ $linuxVersion == "5.10" ]; then
                    STM32_Programmer_CLI -c port=usb1 -w ${CompanyLogo}_sdcard_bootfs-stm32mp157d-sr_STlinux5.10.tsv -tm 20000
                fi
            fi
            
        else
            echo -e "\n$blue/==================================================\\\\$clear"
            echo -e "$V_line $yellow                  [ Warning ]                   $clear $V_line"
            echo -e "$V_line $yellow              **** No Choose! ****              $clear $V_line"
            echo -e "$blue\\==================================================/$clear"
        fi
    fi

}

function mp157_flash_rootfs() {
    STM32_Programmer_CLI -l usb
    echo -e "\n$purple Update the rootfs via usb1? $red_flash(y/N)$clear \c"
    read update_YN

    if [[ $update_YN == "y" || $update_YN == "Y" ]]; then
        SD_or_eMMC=0
        echo -e "\n$purple Revert to SD card or eMMC? (Please Choose)"
        echo -e " $red_flash( 1:SD card / 2:eMMC )$clear \c"
        read SD_or_eMMC

        if [[ $SD_or_eMMC == 2 ]]; then
            echo -e "\n$green Update rootfs image to eMMC...$clear\n"

            if [ $CoreBoardModel == "Atk" ]; then
                if [ $linuxVersion == "5.4" ]; then
                    STM32_Programmer_CLI -c port=usb1 -w ${CompanyLogo}_emmc_rootfs-stm32mp157d_STlinux5.4.tsv -tm 20000
                elif [ $linuxVersion == "5.10" ]; then
                    STM32_Programmer_CLI -c port=usb1 -w ${CompanyLogo}_emmc_rootfs-stm32mp157d_STlinux5.10.tsv -tm 20000
                fi
            elif [ $CoreBoardModel == "${CompanyLogo}" ]; then
                if [ $linuxVersion == "5.4" ]; then
                    STM32_Programmer_CLI -c port=usb1 -w ${CompanyLogo}_emmc_rootfs-stm32mp157d-sr_STlinux5.4.tsv -tm 20000
                elif [ $linuxVersion == "5.10" ]; then
                    STM32_Programmer_CLI -c port=usb1 -w ${CompanyLogo}_emmc_rootfs-stm32mp157d-sr_STlinux5.10.tsv -tm 20000
                fi
            fi
            
        elif [[ $SD_or_eMMC == 1 ]]; then
            echo -e "\n$green Update rootfs image to SD card...$clear\n"

            if [ $CoreBoardModel == "Atk" ]; then
                if [ $linuxVersion == "5.4" ]; then
                    STM32_Programmer_CLI -c port=usb1 -w ${CompanyLogo}_sdcard_rootfs-stm32mp157d_STlinux5.4.tsv -tm 20000
                elif [ $linuxVersion == "5.10" ]; then
                    STM32_Programmer_CLI -c port=usb1 -w ${CompanyLogo}_sdcard_rootfs-stm32mp157d_STlinux5.10.tsv -tm 20000
                fi
            elif [ $CoreBoardModel == "${CompanyLogo}" ]; then
                if [ $linuxVersion == "5.4" ]; then
                    STM32_Programmer_CLI -c port=usb1 -w ${CompanyLogo}_sdcard_rootfs-stm32mp157d-sr_STlinux5.4.tsv -tm 20000
                elif [ $linuxVersion == "5.10" ]; then
                    STM32_Programmer_CLI -c port=usb1 -w ${CompanyLogo}_sdcard_rootfs-stm32mp157d-sr_STlinux5.10.tsv -tm 20000
                fi
            fi
            
        else
            echo -e "\n$blue/==================================================\\\\$clear"
            echo -e "$V_line $yellow                  [ Warning ]                   $clear $V_line"
            echo -e "$V_line $yellow              **** No Choose! ****              $clear $V_line"
            echo -e "$blue\\==================================================/$clear"
        fi
    fi
}

