#!/bin/bash

function H616_build(){
    
    cd $PATH_H616_WORKSPACE

    cp $PATH_H616_UBOOT/.config $PATH_H616_UBOOT/configs/orangepi_zero2_defconfig

    #=================================

    echo -e "\n ==== copy update script ====\n"
    cp $MFAST_ROOT_PATH/shell/H616/update_kernel.sh $PATH_H616_NFS/

    echo -e "\n ==== copy wifi files ====\n"

    #cd $PATH_H616_NFS/29_WIFI
    #cp regulatory.* $PATH_H616_NFS/
    # scp regulatory.db regulatory.db.p7s $Pi_user@$Pi_IP:/home/$Pi_user

    cd $PATH_H616_KERNEL/drivers/net/wireless/rtl8189fs
    #cp 8189fs.ko $PATH_H616_NFS/

    cd $PATH_H616_KERNEL/net/wireless/
    #cp cfg80211.ko $PATH_H616_NFS/

    cd $PATH_H616_WORKSPACE
    sudo ./build.sh

    echo -e "\n ==== copy images ====\n"

    cp output/debs/u-boot/linux-*.deb $PATH_H616_NFS/
    cp output/debs/linux-*.deb $PATH_H616_NFS/

    echo -e "\n ==== copy modules ====\n"
    rm -fr $PATH_H616_NFS/5.16.17-sun50iw9/

    cd $PATH_H616_KERNEL/debian/tmp/lib/modules
    cp -r ./* $PATH_H616_NFS/

    echo -e "\n **** build complete! ****\n"
}

function H616_updatefiles(){
    # Pi_user=orangepi
    Pi_user=biqu
    Pi_IP=192.168.0.42

    ssh-keygen -R $Pi_IP

    echo -e "\n ==== copy images ====\n"

    cd $PATH_H616_NFS
    
    #scp -r 5.13.0-sun50iw9 *.deb regulatory.* *.sh $Pi_user@$Pi_IP:/home/$Pi_user
    #scp -r 5.13.0-sun50iw9 *.ko *.deb regulatory.* *.sh $Pi_user@$Pi_IP:/home/$Pi_user
    scp -r  *.deb *.sh $Pi_user@$Pi_IP:/home/$Pi_user

    echo -e "\n **** copy complete! ****\n"
}
