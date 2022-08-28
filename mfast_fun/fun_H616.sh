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
    sudo ./build.sh BUILD_OPT=kernel KERNEL_CONFIGURE=yes

    echo -e "\n ==== copy images ====\n"

    cp output/debs/linux-*.deb $PATH_H616_NFS/

    echo -e "\n ==== copy modules ====\n"
    rm -fr $PATH_H616_NFS/5.16.17-sun50iw9/

    cd $PATH_H616_KERNEL/debian/tmp/lib/modules
    cp -r ./* $PATH_H616_NFS/

    echo -e "\n **** build complete! ****\n"
}

function H616_updatefiles()
{
    H616_sync_version_value
    
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
    read -p "${yellow} Which information to modify? (${green}U${yellow}ser/${green}I${yellow}p) ${red}" choose_info; echo -e "${clear}"

    case "$choose_info" in
        U|u) read -p "${yellow} Please enter a new user name: ${red}" board_user; echo -e "${clear}"
            sed -i "s/^username_H616=.*$/username_H616=${board_user}/" ${MFAST_ROOT_PATH}/mfast.cfg
            ;;

        I|i) read -p "${yellow} Please enter the new board ip: ${red}" board_ip; echo -e "${clear}"
            sed -i "s/^IP_H616=.*$/IP_H616=${board_ip}/" ${MFAST_ROOT_PATH}/mfast.cfg
            ;;

        *)  error_msg "Input error!" ;;
    esac

    source ${MFAST_ROOT_PATH}/mfast.cfg

    unset choose_info board_user board_ip
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

