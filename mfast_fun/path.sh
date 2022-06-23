#!/bin/bash

linuxVersion="5.4"
CoreBoardModel="Atk"

# 用作备份标识
CompanyLogo=biqu

USERNAME=lodge
MOUNT_DIR=rootfs

WindowsIP=192.168.0.203

# ======== PATH ========

# ORANGEPI_PATH=/home/lodge/Allwinner/orangepi-build
ORANGEPI_PATH=/home/lodge/Allwinner/kernel4.9/orangepi-build


SHELL_ROOT_PATH="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"      # 取得当前执行的 shell 文件所在的绝对路径;

WINDOWS_SHARE_DIR=/run/user/1000/gvfs/smb-share:server=$WindowsIP,share=code         # windows 共享文件夹;
WINDOWS_BACKUP_DIR=/run/user/1000/gvfs/smb-share:server=$WindowsIP,share=backup

#--------------------------- ArmDebian --------------------------------
ARM_DEBIAN_ROOTFS_PATH=/home/lodge/ArmDebian

OS_Choose=0
ARM_QT=0

Qt_dir=/home/lodge/Qt-Arm/qt-everywhere-src-5.12.11

#--------------------------- STM32MP157 -------------------------------
PATH_ST_WORKSPACE=/home/lodge/STM32MP157
PATH_UPDATE=$PATH_ST_WORKSPACE/flash_Image

PATH_FACTORY_IMAGE=$PATH_ST_WORKSPACE/flash_Image/DefaultImage
PATH_BUILD_SHELL=$SHELL_ROOT_PATH/stm32mp1

PATH_ST_SOURCE_5_4=$PATH_ST_WORKSPACE/openSTLinux-5.4
PATH_ST_SOURCE_5_10=$PATH_ST_WORKSPACE/openSTLinux-5.10

PATH_SOURCE_5_4_TF_A=$PATH_ST_SOURCE_5_4/tf-a-2.2/tf-a-stm32mp
PATH_SOURCE_5_4_U_BOOT=$PATH_ST_SOURCE_5_4/u-boot
PATH_SOURCE_5_4_KERNEL=$PATH_ST_SOURCE_5_4/linux-5.4
PATH_SOURCE_5_4_BUSYBOX=$PATH_ST_SOURCE_5_4/busybox
PATH_SOURCE_5_4_BUILDROOT=$PATH_ST_SOURCE_5_4/buildroot

PATH_SOURCE_5_10_TF_A=$PATH_ST_SOURCE_5_10/tf-a/tf-a-stm32mp
PATH_SOURCE_5_10_U_BOOT=$PATH_ST_SOURCE_5_10/u-boot/u-boot-stm32mp
PATH_SOURCE_5_10_KERNEL=$PATH_ST_SOURCE_5_10/linux/linux-5.10
PATH_SOURCE_5_10_OPTEE=$PATH_ST_SOURCE_5_10/optee/optee-os-stm32mp
PATH_SOURCE_5_10_BUSYBOX=$PATH_ST_SOURCE_5_10/busybox
PATH_SOURCE_5_10_BUILDROOT=$PATH_ST_SOURCE_5_10/buildroot

#--------------------------- RaspBerry --------------------------------
PATH_PI_WORKSPACE=/home/lodge/raspberrypi

PATH_PI_SOURCE_pi3=$PATH_PI_WORKSPACE/linux/Pi3
PATH_PI_SOURCE_pi4=$PATH_PI_WORKSPACE/linux/Pi4


# backup

INI_FILE=${HOME}/.kiauh.ini
BACKUP_DIR=${HOME}/kiauh-backups

### set github repos

#branches
BRANCH_SCURVE_SMOOTHING=dmbutyugin/scurve-smoothing
BRANCH_SCURVE_SHAPING=dmbutyugin/scurve-shaping

