#!/bin/bash

MFAST_ROOT_PATH="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"      # 取得当前执行的 shell 文件所在的绝对路径;

cd ${MFAST_ROOT_PATH} 

### sourcing all additional scripts
source ${MFAST_ROOT_PATH}/mfast.cfg
for script in "./mfast_ui/"*.sh; do . $script; done
for script in "./mfast_fun/"*.sh; do . $script; done

# -------------------------------------------------------------------------- #
function detect_pack() {
    for pkg in "${dep_pkg[@]}"
    do
        if [[ ! $(dpkg-query -f'${Status}' --show $pkg 2>/dev/null) = *\ installed ]]; then
            # echo "$pkg Uninstalled!"
            inst_pkg+=($pkg)
        fi
    done
}

function WhetherInstall(){
    if [ "${#inst_pkg[@]}" != "0" ]; then
        echo -e "\nChecking for the following dependencies:\n"
        for pkg in "${inst_pkg[@]}"
        do
            echo -e "${cyan}● $pkg ${clear}"
        done
        echo
        choose "yn"
        case "$yn" in
            Y|y|Yes|yes|"")
                echo
                sudo apt-get update --allow-releaseinfo-change && sudo apt install ${inst_pkg[@]} -y
                echo -e "\nDependencies installed!"
                unset inst_pkg
                ;;

            N|n|No|no)
                exit 0;;
        esac
    fi
}

#===================================================#

dep_pkg=(git tofrodos qrencode dialog)
detect_pack
WhetherInstall

#####################################################

if [ $# == 0 ]; then
    main_menu
else
    Selection_invalid
    exit 0
fi
