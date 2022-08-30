#!/bin/bash

function h616_ui(){
    border "top"

    echo -e "$V_line    ${green}~~~~~~~~~~~~~~~~ [ H616 MENU ] ~~~~~~~~~~~~~~~~${clear}    $V_line"
    border "div_line"
    echo -e "$V_line ${yellow}  1)${clear} build u-boot         $V_line ${yellow}  ${clear}  Target_Board info     $V_line"
    border "space_blank_line" 25 25
    echo -e "$V_line ${yellow}  2)${clear} build kernel         $V_line   user:${red} $(tab_format ${username_H616} 16)  $V_line"
    border "space_blank_line" 25 25
    echo -e "$V_line ${yellow}                          $V_line   ip:${red} $(tab_format ${IP_H616} 18)  $V_line"
    border "div_line"
    echo -e "$V_line ${yellow}  t)${clear} Transferring files to the target board.          $V_line"
    border "div_line"
    echo -e "$V_line ${yellow}  w)${clear} Whether to configure the kernel manually:${red} $(tab_format ${manual_cfg_kernel} 4)   $V_line"
    border "div_line"
    echo -e "$V_line ${yellow}  u)${clear} Change username.     $V_line ${yellow}  i)${clear} Change IP.           $V_line"
    footer "quit_back"
}

function h616_menu(){
    do_action "h616_ui"

    while true; do
    
        choose "action"
        case "$action" in
            1) do_action "H616_build_uboot" "h616_ui";;
            2) do_action "H616_build_kernel" "h616_ui";;

            T|t) do_action "H616_File_Transfer" "h616_ui";;
            W|w) do_action "H616_compile_manual_cfg" "h616_ui";;

            U|u) do_action "H616_change_boardinfo user" "h616_ui";;
            I|i) do_action "H616_change_boardinfo ip" "h616_ui";;

            B|b) clear; main_menu; break;;
            Q|q) quit_msg;;
            *)  Selection_invalid "h616_ui";;
        esac
        
    done
}
