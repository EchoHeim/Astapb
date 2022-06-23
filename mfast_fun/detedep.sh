#!/bin/bash

# for type in ANSI ANSI256 ASCII ASCIIi UTF8 ANSIUTF8;do echo $type ;qrencode -t $type "a";done

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
        echo -e "\n"

        read -p "${cyan}###### Installing the above packages? (Y/n):${clear} " yn
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

# for type in ANSI ANSI256 ASCII ASCIIi UTF8 ANSIUTF8;do echo $type ;qrencode -t $type "a";done

function armbian_status() {
    echo "================================"
}

function stm32mp157_status() {
    echo "================================"
}

function raspberrypi_status() {
    echo "================================"
}

function orangepi_status() {
    echo "================================"
}


