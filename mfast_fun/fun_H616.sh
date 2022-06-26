#!/bin/bash

function H616_build(){
    cd $ORANGEPI_PATH

    cp ./u-boot/v2021.07-sunxi/.config ./u-boot/v2021.07-sunxi/configs/orangepi_zero2_defconfig

    #=================================

    echo -e "\n ==== copy update script ====\n"
    cp $MFAST_ROOT_PATH/H616/update_kernel.sh $ORANGEPI_PATH/nfs_folder/

    echo -e "\n ==== copy wifi files ====\n"

    #cd $ORANGEPI_PATH/nfs_folder/29_WIFI
    #cp regulatory.* $ORANGEPI_PATH/nfs_folder/
    # scp regulatory.db regulatory.db.p7s $Pi_user@$Pi_IP:/home/$Pi_user

    cd $ORANGEPI_PATH/kernel/orange-pi-5.13-sunxi64/drivers/net/wireless/rtl8189fs
    #cp 8189fs.ko $ORANGEPI_PATH/nfs_folder/

    cd $ORANGEPI_PATH/kernel/orange-pi-5.13-sunxi64/net/wireless/
    #cp cfg80211.ko $ORANGEPI_PATH/nfs_folder/

    cd $ORANGEPI_PATH
    sudo ./build.sh

    echo -e "\n ==== copy images ====\n"

    cp output/debs/u-boot/linux-*.deb $ORANGEPI_PATH/nfs_folder/
    cp output/debs/linux-*.deb $ORANGEPI_PATH/nfs_folder/

    echo -e "\n ==== copy modules ====\n"
    cd $ORANGEPI_PATH/nfs_folder/

    rm -fr 5.13.0-sun50iw9/

    cd $ORANGEPI_PATH/kernel/orange-pi-5.13-sunxi64/debian/tmp/lib/modules
    cp -r 5.13.0-sun50iw9/ $ORANGEPI_PATH/nfs_folder/

    echo -e "\n **** build complete! ****\n"
}

function H616_updatefiles(){
    Pi_user=biqu
    Pi_IP=192.168.0.248

    ORANGEPI_PATH=/home/lodge/Allwinner/orangepi-build
    # ORANGEPI_PATH=/home/lodge/Allwinner/kernel4.9/orangepi-build

    echo -e "\n ==== copy images ====\n"

    cd $ORANGEPI_PATH/nfs_folder/
    scp -r 5.13.0-sun50iw9 *.deb regulatory.* *.sh $Pi_user@$Pi_IP:/home/$Pi_user

    #scp -r 5.13.0-sun50iw9 *.ko *.deb regulatory.* *.sh $Pi_user@$Pi_IP:/home/$Pi_user

    echo -e "\n **** copy complete! ****\n"

}
