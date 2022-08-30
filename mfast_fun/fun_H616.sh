#!/bin/bash

function H616_build_uboot()
{
    cp $PATH_H616_UBOOT/.config $PATH_H616_UBOOT/configs/h616_defconfig

    cd $PATH_H616_WORKSPACE
    sudo ./build.sh BUILD_OPT=u-boot

    echo -e "\n ==== copy images ====\n"
    cp output/debs/u-boot/linux-*.deb $PATH_H616_NFS/

    echo -e "\n **** build complete! ****\n"
}

function H616_build_kernel()
{
    cd $PATH_H616_WORKSPACE

    if [[ $manual_cfg_kernel == "YES" ]];then
        sudo ./build.sh BUILD_OPT=kernel MANUAL_KERNEL_CONFIGURE=yes
    elif [[ $manual_cfg_kernel == "NO" ]];then
        sudo ./build.sh BUILD_OPT=kernel MANUAL_KERNEL_CONFIGURE=no
    fi

    echo -e "\n ==== copy images ====\n"
    cp output/debs/linux-*.deb $PATH_H616_NFS/

    echo -e "\n ==== copy modules ====\n"
    rm -fr $PATH_H616_NFS/5.16.17-sun50iw9/

    cd $PATH_H616_KERNEL/debian/tmp/lib/modules
    cp -r ./* $PATH_H616_NFS/

    echo -e "\n **** build complete! ****\n"
}

function H616_File_Transfer()
{
    Pi_user=${username_H616}
    Pi_IP=${IP_H616}

    ssh-keygen -R $Pi_IP

    echo -e "\n ==== copy images ====\n"
    cd $PATH_H616_NFS
    
    #scp -r 5.13.0-sun50iw9 *.deb regulatory.* *.sh $Pi_user@$Pi_IP:/home/$Pi_user
    #scp -r 5.13.0-sun50iw9 *.ko *.deb regulatory.* *.sh $Pi_user@$Pi_IP:/home/$Pi_user
    scp -r  5.16.17-sun50iw9 *.deb *.sh $Pi_user@$Pi_IP:/home/$Pi_user

    echo -e "\n **** copy complete! ****\n"
}

function H616_change_boardinfo()
{
    case $1 in
        user) read -p "${yellow} Please enter a new user name: ${red}" board_user; echo -e "${clear}"
            sed -i "s/^username_H616=.*$/username_H616=${board_user}/" ${MFAST_ROOT_PATH}/mfast.cfg
            ;;

        ip) read -p "${yellow} Please enter the new board ip: ${red}" board_ip; echo -e "${clear}"
            sed -i "s/^IP_H616=.*$/IP_H616=${board_ip}/" ${MFAST_ROOT_PATH}/mfast.cfg
            ;;
    esac

    source ${MFAST_ROOT_PATH}/mfast.cfg
    unset board_user board_ip
}

function H616_sync_version_value()
{
    src_FILE="$PATH_H616_WORKSPACE/scripts/main.sh"
    update_FILE="$PATH_H616_WORKSPACE/nfs_folder/update_kernel.sh"

    # str=$(sed -n '/REVISION=/p' $src_FILE)      # 此时得到的是一整行
    
    # .*"\(.*\)".* 正则匹配双引号中的值， 要加上前后两个(), \1表示第一个()中匹配的值
    REVISION=$( sed -n '/REVISION=/p' $src_FILE | sed 's/.*"\(.*\)".*/\1/g')

    sed -i "s/^version=.*$/version="${REVISION}"/" $update_FILE
}

function H616_compile_manual_cfg()
{
    source ${MFAST_ROOT_PATH}/mfast.cfg
    if [[ $manual_cfg_kernel == "YES" ]];then
        sed -i "s/^manual_cfg_kernel=.*$/manual_cfg_kernel="NO"/" ${MFAST_ROOT_PATH}/mfast.cfg
    elif [[ $manual_cfg_kernel == "NO" ]];then
        sed -i "s/^manual_cfg_kernel=.*$/manual_cfg_kernel="YES"/" ${MFAST_ROOT_PATH}/mfast.cfg
    fi
    source ${MFAST_ROOT_PATH}/mfast.cfg
}
