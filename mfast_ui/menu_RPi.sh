#!/bin/bash

function rpi_ui() {
    border "top"
    echo -e "$V_line      ${green}~~~~~~~~~~~~~ [ RaspBerryPi ] ~~~~~~~~~~~~~${clear}      $V_line"
    border "div_line"
    echo -e "$V_line ${cyan} [ WorkPath ]                                ${magenta}C${yellow}hange   $V_line"
    border "blank_line"
    echo -e "$V_line ${green}  $(tab_format $PATH_PI_WORKSPACE 49)   $V_line"
    border "div_line"
    echo -e "$V_line ${cyan} [ Compile ]                                          $V_line"
    border "div_line"
    echo -e "$V_line        ${cyan} ✿        $V_line $yellow       PI3      $V_line $yellow       PI4       $V_line"
    border "div_line"
    echo -e "$V_line $yellow     32 bit      $V_line $magenta      < 1 >     $V_line $magenta      < 2 >      $V_line"
    border "div_line"
    echo -e "$V_line $yellow     64 bit      $V_line $magenta      < 3 >     $V_line $magenta      < 4 >      $V_line"
    border "div_line"
    echo -e "$V_line ${cyan} [ Update ]                                           $V_line"
    border "div_line"
    echo -e "$V_line $yellow  ${magenta}U${clear}pdate kernel driver files!                         $V_line"
    footer "quit_back"
    unset PI_PATH
}

function rpi_menu() {
    do_action "" "rpi_ui"
    while true; do
        choose "action"
        case "$action" in
        1) do_action "install_modules" "rpi_ui" ;;
        2) do_action "H616_build_kernel" "rpi_ui" ;;
        3) do_action "H616_build_uboot" "rpi_ui" ;;
        4) do_action "H616_build_kernel" "rpi_ui" ;;
        5)
            do_action "install_modules" ""
            ;;

        C | c)
            read -p "${yellow} Please input the pi-kernel path: ${red}" pi_work_path
            change_path ${pi_work_path}
            unset pi_work_path
            break
            ;;

        B | b)
            clear
            main_menu
            break
            ;;
        Q | q) quit_msg ;;
        *) Selection_invalid "rpi_ui" ;;
        esac
    done
    rpi_menu
}

function change_path() {
    sed -i "s/^PI_KERNEL_Folder=.*$/PI_KERNEL_Folder=$1/" ${MFAST_ROOT_PATH}/mfast_fun/path.sh
    source ${MFAST_ROOT_PATH}/mfast_fun/path.sh
    do_action
}
