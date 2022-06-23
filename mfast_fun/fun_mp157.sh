function mp157_build(){
    CycleSelect=1

cd $SHELL_ROOT_PATH/stm32mp1

if [ $# == 0 ]; then
    Type_Chose=0
    if [ $linuxVersion == "5.10" ]; then
        source ~/STM32MP157/SDK/environment-setup-cortexa7t2hf-neon-vfpv4-ostl-linux-gnueabi
    fi

    tput reset      # clear screen;

    while [ $CycleSelect == 1 ]
    do
        echo -e "\n$blue/==================================================\\\\$clear"
        if [ $linuxVersion == "5.4" ]; then
            echo -e "$V_line $cyan         [ Build openSTLinux5.4 Menu ]          $clear $V_line"
        elif [ $linuxVersion == "5.10" ]; then
            echo -e "$V_line $cyan         [ Build openSTLinux5.10 Menu ]         $clear $V_line"
        fi
        echo -e "$blue|--------------------------------------------------|$clear"
        echo -e "$V_line            $yellow_flash***** Please choose *****$clear             $V_line"
        echo -e "$blue|--------------------------------------------------|$clear"
        echo -e "$V_line $yellow  1:$clear compile TF-A;     $V_line $yellow  5:$clear clear TF-A         $V_line"
        echo -e "$V_line $yellow  2:$clear compile u-boot    $V_line $yellow  6:$clear clear u-boot       $V_line"
        echo -e "$V_line $yellow  3:$clear compile kernel    $V_line $yellow  7:$clear clear kernel       $V_line"
        echo -e "$V_line $yellow  4:$clear compile rootfs    $V_line $yellow  8:$clear clear rootfs       $V_line"
        echo -e "$blue|--------------------------------------------------|$clear"
        echo -e "$blue|          $yellow Flash firmware to Core-Board $clear          $V_line"
        echo -e "$blue|------$blue_flash Atk-Model$clear $blue-------|-------$blue_flash Biqu-Model$clear $blue------|$clear"
        echo -e "$V_line $yellow  11:$clear flash bootfs     $V_line  $yellow 33:$clear flash bootfs      $V_line"
        echo -e "$V_line $yellow  22:$clear flash rootfs     $V_line  $yellow 44:$clear flash rootfs      $V_line"
        echo -e "$blue|--------------------------------------------------|$clear"
        echo -e "$V_line                            $purple Q/B: Quit or Back!$clear   $V_line"
        echo -e "$blue\\==================================================/$clear"
        echo -e "$yellow\n Your choice:$clear \c "
        
        read Type_Chose

        if [[ $Type_Chose == "q" || $Type_Chose == "Q" ]]; then
            exit 0
        fi

        if [[ $Type_Chose == "b" || $Type_Chose == "B" ]]; then
            . ../AutoBuildTool
        fi

        if [[ $Type_Chose -ge 1 && $Type_Chose -le 8 ]]; then
            CycleSelect=0
        fi

        if [[ $Type_Chose -lt 1 || $Type_Chose -gt 8 ]]; then
            if [[ $Type_Chose -eq 11 || $Type_Chose -eq 22 || $Type_Chose -eq 33 || $Type_Chose -eq 44 ]]; then
                CycleSelect=0
            else
                tput reset      # clear screen;
                echo -e "\n$blue/=================================================\\\\$clear"
                echo -e "$V_line $red_flash       Selection error,Please try again!       $clear $V_line"
                echo -e "$blue\\=================================================/$clear"
                Type_Chose=0
            fi
        fi
        
    done
else
    echo -e "\n$blue/==================================================\\\\$clear"
    echo -e "$V_line $red_flash    No parameters required,Please try again!    $clear $V_line"
    echo -e "$blue\\==================================================/$clear"
    exit 0
fi

cd $PATH_BUILD_SHELL

set | grep CROSS   # 筛选包含 CROSS 的环境变量;

if [[ $Type_Chose -le 4 && $Type_Chose -ge 1 ]]; then
    . ./compileFirmware.sh
elif [[ $Type_Chose -le 8 && $Type_Chose -ge 5 ]]; then
    . ./clearFirmware.sh
elif [[ $Type_Chose -eq 11 || $Type_Chose -eq 22 ]]; then
    CoreBoardModel="Atk"
    . ./flashFirmware.sh
elif [[ $Type_Chose -eq 33 || $Type_Chose -eq 44 ]]; then
    CoreBoardModel="${CompanyLogo}"
    . ./flashFirmware.sh
fi

}

function mp157_clear(){
    
if [ $linuxVersion == "5.4" ]; then
    case $Type_Chose in
        5)  cd $PATH_SOURCE_5_4_TF_A

            echo -e "\n Clean the TF-A? (y/N) \c"
            read Clean_TF_A_YN
            if [[ $Clean_TF_A_YN = "y" || $Clean_TF_A_YN = "Y" ]]
            then
                make -f $PWD/../Makefile.sdk clean
                echo -e "\n **** Clean TF-A complete! ****\n"
            fi
        ;;

        6)  cd $PATH_SOURCE_5_4_U_BOOT

            echo -e "\n Clean the u-boot? (y/N) \c"
            read Clean_u_boot_YN
            if [[ $Clean_u_boot_YN = "y" || $Clean_u_boot_YN = "Y" ]]
            then

                make distclean
                make ARCH=arm CROSS_COMPILE=arm-none-linux-gnueabihf- stm32mp157d_${CompanyLogo}_defconfig
                
                echo -e "\n **** Clean u-boot complete! ****\n"
            fi
        ;;

        7)  cd $PATH_SOURCE_5_4_KERNEL

            echo -e "\n Clean the kernel? (y/N) \c"
            read Clean_kernel_YN
            if [[ $Clean_kernel_YN = "y" || $Clean_kernel_YN = "Y" ]]
            then

                make ARCH=arm CROSS_COMPILE=arm-none-linux-gnueabihf- distclean
                make ARCH=arm CROSS_COMPILE=arm-none-linux-gnueabihf- stm32mp157d_${CompanyLogo}_defconfig

                echo -e "\n **** Clean kernel complete! ****\n"
            fi
        ;;
    esac
elif [ $linuxVersion == "5.10" ]; then
    case $Type_Chose in
        5)  cd $PATH_SOURCE_5_10_TF_A

            echo -e "\n Clean the TF-A? (y/N) \c"
            read Clean_TF_A_YN
            if [[ $Clean_TF_A_YN = "y" || $Clean_TF_A_YN = "Y" ]]
            then
                export FIP_DEPLOYDIR_ROOT=$PWD/../../FIP_artifacts
                make -f $PWD/../Makefile.sdk clean
                echo -e "\n **** Clean TF-A complete! ****\n"
            fi
        ;;

        6)  cd $PATH_SOURCE_5_10_U_BOOT

            echo -e "\n Clean the u-boot? (y/N) \c"
            read Clean_u_boot_YN
            if [[ $Clean_u_boot_YN = "y" || $Clean_u_boot_YN = "Y" ]]
            then
                export FIP_DEPLOYDIR_ROOT=$PWD/../../FIP_artifacts
                make -f $PWD/../Makefile.sdk clean
                echo -e "\n **** Clean u-boot complete! ****\n"
            fi
        ;;

        7)  cd $PATH_SOURCE_5_10_KERNEL

            echo -e "\n Clean the kernel? (y/N) \c"
            read Clean_kernel_YN
            if [[ $Clean_kernel_YN = "y" || $Clean_kernel_YN = "Y" ]]
            then
                echo -e "\n **** Clean kernel complete! ****\n"
            fi
        ;;
    esac
fi
}

function mp157_compile() {
    
if [ $linuxVersion == "5.4" ]; then
    case $Type_Chose in
        1)  cd $PATH_SOURCE_5_4_TF_A
        
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
        ;;

        2)  cd $PATH_SOURCE_5_4_U_BOOT
            
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
        ;;

        3)  cd $PATH_SOURCE_5_4_KERNEL

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
        ;;

        4)  cd $PATH_SOURCE_5_4_BUSYBOX

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
        ;;
    esac
elif [ $linuxVersion == "5.10" ]; then
    case $Type_Chose in
        1)  cd $PATH_SOURCE_5_10_TF_A
        
            echo -e "\n Compile TF-A firmware? (y/N) \c"
            read Compile_TF_A_YN
            if [[ $Compile_TF_A_YN == "y" || $Compile_TF_A_YN == "Y" ]]; then
                echo -e "\n$green -------------------- $clear\n"

                export FIP_DEPLOYDIR_ROOT=$PWD/../../FIP_artifacts
                make -f $PWD/../Makefile.sdk all
                # make -f $PWD/../Makefile.sdk TFA_DEVICETREE=stm32mp157a-dk1 TF_A_CONFIG=trusted ELF_DEBUG_ENABLE='1' all

                echo -e "\n$green **** Copy file... ****$clear\n"

                cp ../../FIP_artifacts/fip/fip-stm32mp157d-${CompanyLogo}-trusted.bin ~/STM32MP157/install
                cp ../build/usb/tf-a-stm32mp157d-${CompanyLogo}.stm32 ~/STM32MP157/install/tf-a-stm32mp157d-${CompanyLogo}-usb.stm32
                
                cp ../build/emmc/tf-a-stm32mp157d-${CompanyLogo}.stm32 ~/STM32MP157/install/tf-a-stm32mp157d-${CompanyLogo}-emmc.stm32
                cp ../build/sdcard/tf-a-stm32mp157d-${CompanyLogo}.stm32 ~/STM32MP157/install/tf-a-stm32mp157d-${CompanyLogo}-sdcard.stm32
 
                echo -e "\n$green **** Build TF-A complete! ****$clear\n"
            fi
        ;;

        2)  cd $PATH_SOURCE_5_10_U_BOOT
            
            echo -e "\n$green Compile u-boot firmware? (y/N) \c"
            read Compile_u_boot_YN
            if [[ $Compile_u_boot_YN == "y" || $Compile_u_boot_YN == "Y" ]]; then
                echo -e "\n$green -------------------- $clear\n"

                export FIP_DEPLOYDIR_ROOT=$PWD/../../FIP_artifacts
                #make -f $PWD/../Makefile.sdk all
                # make -f $PWD/../Makefile.sdk all UBOOT_CONFIG=trusted UBOOT_DEFCONFIG=stm32mp15_trusted_defconfig UBOOT_BINARY=u-boot.dtb DEVICETREE=stm32mp157d-ev1
                
                make stm32mp15_${CompanyLogo}_trusted_defconfig
                make DEVICE_TREE=stm32mp157d-${CompanyLogo} UBOOT_CONFIGS=stm32mp15_${CompanyLogo}_trusted_defconfig,trusted,u-boot.stm32 all

                echo -e "\n **** Copy file... ****\n"

                cp ../../FIP_artifacts/fip/fip-stm32mp157d-${CompanyLogo}-trusted.bin ~/STM32MP157/install/u-boot-stm32mp157d-${CompanyLogo}-trusted.bin
                echo -e "\n **** Build u-boot complete! ****\n"
            fi
        ;;

        3)  cd $PATH_SOURCE_5_10_KERNEL

            echo -e "\n Compile kernel firmware? (y/N) \c"
            read Compile_kernel_YN
            if [[ $Compile_kernel_YN == "y" || $Compile_kernel_YN == "Y" ]]; then
                echo -e "\n$green -------------------- $clear\n"

                make ARCH=arm uImage vmlinux dtbs LOADADDR=0xC2000040 O="$PWD/../build"
                make ARCH=arm modules O="$PWD/../build"
                make ARCH=arm INSTALL_MOD_PATH="$PWD/../build/install_artifact" modules_install O="$PWD/../build"
                mkdir -p $PWD/../build/install_artifact/boot/

                echo -e "\n **** Copy file... ****\n"

                cp $PWD/../build/arch/arm/boot/uImage $PWD/../build/install_artifact/boot/
                cp $PWD/../build/arch/arm/boot/dts/st*.dtb $PWD/../build/install_artifact/boot/

                echo -e "\n **** Build kernel complete! ****\n"
            fi
        ;;
    esac
fi

}

function mp157_flash() {
    STM32_Programmer_CLI -l usb

if [[ $upload_mode == "factory" ]]; then
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
fi

#------------------------------------------------------

if [ $linuxVersion == "5.4" ]; then
    cd $PATH_UPDATE/STlinux5.4
elif [ $linuxVersion == "5.10" ]; then
    cd $PATH_UPDATE/STlinux5.10
fi

if [[ $Type_Chose -eq 11 || $Type_Chose -eq 33 ]]; then

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

elif [[ $Type_Chose -eq 22 || $Type_Chose -eq 44 ]]; then

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
fi

}

