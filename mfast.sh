#!/bin/bash

cd $(dirname "$(realpath "${BASH_SOURCE[0]}")")     # 取得当前执行的 shell 文件所在的绝对路径;

### sourcing all additional scripts
# pwd
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

#================================================================

dep_pkg=(git tofrodos qrencode dialog)
detect_pack
WhetherInstall

###########################

if [ $# == 0 ]; then
    main_menu
else
    Selection_invalid
    exit 0
fi

#--------------------- Processing -------------------
if [[ $Type_Chose -eq 1 ]]; then
    linuxVersion="5.4"
    . ./stm32mp1/build_ST.sh
elif [[ $Type_Chose -eq 2 ]]; then
    linuxVersion="5.10"
    . ./stm32mp1/build_ST.sh

#----------------------------------------------------
elif [[ $Type_Chose -eq 5 ]]; then
    . ./H616/All_build.sh
    exit 0

#----------------------------------------------------
elif [[ $Type_Chose -eq 6 ]]; then
    . ./H616/move_files.sh
    exit 0

#----------------------------------------------------
elif [[ $Type_Chose -eq 3 || $Type_Chose -eq 4 ]]; then
    if [[ $Type_Chose -eq 3 ]]; then
        echo -e "\n$purple Compile kernel for Pi3$yellow(T)$purple or Pi4$yellow(F)$purple? $red_flash(T/F)$clear \c"
        pi_str="compile"
    elif [[ $Type_Chose -eq 4 ]]; then
        echo -e "\n$purple Install kernel for Pi3$yellow(T)$purple or Pi4$yellow(F)$purple? $red_flash(T/F)$clear \c"
        pi_str="install"
    fi
    read PiType

    if [[ $PiType == "t" || $PiType == "T" ]]; then
        pi_ver_str="Pi3"
        KERNEL=kernel7
        KERNEL_PATH=$PATH_PI_SOURCE_pi3
    elif [[ $PiType == "f" || $PiType == "F" ]]; then
        pi_ver_str="Pi4"
        KERNEL=kernel7l
        KERNEL_PATH=$PATH_PI_SOURCE_pi4
    else
        echo -e "\n $blue/================================================\\\\$clear"
        echo -e " $V_line $red_flash         Input error,Please try again!        $clear $V_line"
        echo -e " $V_line $red_flash                Choose T or F!                $clear $V_line"
        echo -e " $blue\\================================================/$clear"
        exit 0
    fi

    . ./RaspBerry/build_RPi.sh

#----------------------------------------------------
elif [[ $Type_Chose -eq 9 ]]; then      # 恢复出厂镜像;
    upload_mode="factory"       
    . ./stm32mp1/flashFirmware.sh

#----------------------------------------------------
elif [[ $Type_Chose -eq 101 || $Type_Chose -eq 102 ]]; then
    if [[ $Type_Chose -eq 101 ]]; then
        echo -e "\n$purple Rebuilding$yellow(R)$purple or Packing$yellow(P)$purple an armBuster file system? $red_flash(R/P)$clear \c"
        OS_Choose=1
    elif [[ $Type_Chose -eq 102 ]]; then
        echo -e "\n$purple Rebuilding$yellow(R)$purple or Packing$yellow(P)$purple an armBullseye file system? $red_flash(R/P)$clear \c"
        OS_Choose=2
    fi
    read buildArmDebian_YN
    
    if [[ $buildArmDebian_YN == "r" || $buildArmDebian_YN == "R" ]]; then   
        . ./ArmDebian/build_debian.sh
    elif [[ $buildArmDebian_YN == "p" || $buildArmDebian_YN == "P" ]]; then
        . ./ArmDebian/pack_debian.sh
    else
        echo -e "\n $blue/================================================\\\\$clear"
        echo -e " $V_line $red_flash         Input error,Please try again!        $clear $V_line"
        echo -e " $V_line $red_flash                Choose R or P!                $clear $V_line"
        echo -e " $blue\\================================================/$clear"
    fi
fi


