#!/bin/bash

CoreBoardModel="Atk"

# 用作备份标识
CompanyLogo=biqu

MOUNT_DIR=rootfs

WindowsIP=192.168.0.203

# ======================== PATH ======================== #

# ======== H616
PATH_H616_WORKSPACE=$HOME/Allwinner-H616

PATH_H616_NFS=$PATH_H616_WORKSPACE/nfs_folder
PATH_H616_UBOOT=$PATH_H616_WORKSPACE/u-boot/v2021.10-sunxi
PATH_H616_KERNEL=$PATH_H616_WORKSPACE/kernel/orange-pi-5.16-sunxi64

WINDOWS_SHARE_DIR=/run/user/1000/gvfs/smb-share:server=$WindowsIP,share=code         # windows 共享文件夹;
WINDOWS_BACKUP_DIR=/run/user/1000/gvfs/smb-share:server=$WindowsIP,share=backup

# ======== Armbian
ARM_DEBIAN_ROOTFS_PATH=$HOME/ArmDebian

OS_Choose=0
ARM_QT=0

Qt_dir=$HOME/Qt-Arm/qt-everywhere-src-5.12.11

# ======== STM32MP157
PATH_ST_WORKSPACE=$HOME/STM32MP157

PATH_UPDATE=$PATH_ST_WORKSPACE/flash_image
PATH_FACTORY_IMAGE=$PATH_UPDATE/factory_image

PATH_ST_TF_A=$PATH_ST_WORKSPACE/tf-a/tf-a-stm32mp
PATH_ST_UBOOT=$PATH_ST_WORKSPACE/uboot
PATH_ST_KERNEL=$PATH_ST_WORKSPACE/kernel
PATH_ST_BUSYBOX=$PATH_ST_WORKSPACE/busybox
PATH_ST_BUILDROOT=$PATH_ST_WORKSPACE/buildroot

# ======== RaspBerryPi

PATH_PI_WORKSPACE=$HOME/raspberrypi

PATH_PI_SOURCE_pi3=$PATH_PI_WORKSPACE/linux/Pi3
PATH_PI_SOURCE_pi4=$PATH_PI_WORKSPACE/linux/Pi4


# ======== backup

INI_FILE=${HOME}/.kiauh.ini
BACKUP_DIR=${HOME}/kiauh-backups

### set github repos

