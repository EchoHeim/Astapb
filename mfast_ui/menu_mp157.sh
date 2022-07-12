#!/bin/bash

function mp157_ui(){
    border "top"
    echo -e "$V_line    ${green}~~~~~~~~~~~~~ [ STM32MP157 MENU ] ~~~~~~~~~~~~~${clear}    $V_line"
    border "div_line"
    echo -e "$V_line ${green} [ compile ] ${clear}                                         $V_line"
    border "blank_line"
    echo -e "$V_line $yellow  1:$clear TF-A        $V_line $yellow  2:$clear u-boot     $V_line $yellow  3:$clear kernel      $V_line"
    border "div_line"
    echo -e "$V_line ${green} [ clear ] ${clear}                                           $V_line"
    border "blank_line"
    echo -e "$V_line $yellow  4:$clear TF-A        $V_line $yellow  5:$clear u-boot     $V_line $yellow  6:$clear kernel      $V_line"
    border "div_line"
    echo -e "$V_line $yellow  7:$clear compile rootfs       $V_line $yellow  8:$clear clear rootfs         $V_line"
    border "div_line"
    echo -e "$V_line $yellow  9:$clear Restore Factory Image                            $V_line"
    border "div_line"
    echo -e "$V_line $yellow  b:$clear flash-bootfs         $V_line $yellow  r:$clear flash-rootfs         $V_line"
    footer "quit_back"
}

function mp157_menu(){
    do_action "mp157_ui"
    while true; do
        choose "action"
        case "$action" in

            1) do_action "mp157_cpmpile_TF-a" "mp157_ui";;
            2) do_action "mp157_cpmpile_u-boot" "mp157_ui";;
            3) do_action "mp157_cpmpile_kernel" "mp157_ui";;
            4) do_action "mp157_clear TF-a" "mp157_ui";;
            5) do_action "mp157_clear u-boot" "mp157_ui";;
            6) do_action "mp157_clear kernel" "mp157_ui";;

            B|b) clear; main_menu; break;;
            Q|q) quit_msg;;
            *)  Selection_invalid "mp157_ui";;

        esac
    done
    mp157_menu
}
