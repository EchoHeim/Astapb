#!/bin/bash

function h616_ui(){
    border "top"

    echo -e "$V_line    ${green}~~~~~~~~~~~~~~~~ [ H616 MENU ] ~~~~~~~~~~~~~~~~${clear}    $V_line"
    border "div_line"
    echo -e "$V_line ${yellow}  1)${clear} build u-boot         $V_line ${yellow}  2)${clear} build kernel         $V_line"
    border "div_line"
    echo -e "$V_line ${yellow}  u)${clear} update files                                     $V_line"
    border "div_line"
    echo -e "$V_line                           $V_line  user:${yellow} $(tab_format ${username_H616} 16) ${clear}  $V_line"
    echo -e "$V_line ${cyan}  Target_Board >> ${yellow}e${cyan}dit >> $V_line                           $V_line"
    echo -e "$V_line                           $V_line    ip:${yellow} $(tab_format ${IP_H616} 16) ${clear}  $V_line"

    footer "quit_back"
}

function h616_menu(){
    do_action "h616_ui"

    while true; do
    
        choose "action"
        case "$action" in
            1) do_action "H616_build_uboot" "h616_ui";;
            2) do_action "H616_build_kernel" "h616_ui";;

            U|u) do_action "H616_updatefiles" "h616_ui";;
            E|e) do_action "H616_change_boardinfo" "h616_ui";;

            B|b) clear; main_menu; break;;
            Q|q) quit_msg;;
            *)  Selection_invalid "h616_ui";;
        esac
        
    done
}
