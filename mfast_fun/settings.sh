#!/bin/bash

function settings_ui(){
    border "top"
    echo -e "$V_line    ${green}~~~~~~~~~~~~~~~~~ [ Settings ] ~~~~~~~~~~~~~~~~${clear}    $V_line"
    border "div_line"
    echo -e "$V_line ${green} [ Themes ] ${clear}                                          $V_line"
    border "blank_line"
    echo -e "$V_line ${red}  1:${clear} red          $V_line ${yellow}  2:${clear} yellow     $V_line ${green}  3:${clear} green      $V_line"
    echo -e "$V_line ${blue}  4:${clear} blue         $V_line ${purple}  5:${clear} purple     $V_line ${gray}  6:${clear} gray       $V_line"

    footer "quit_back"
}

function settings_menu(){
    do_action "settings_ui"
    while true; do
        choose "action"
        case "$action" in

            1) do_action "theme_ui red" "settings_ui";;
            2) do_action "theme_ui yellow" "settings_ui";;
            3) do_action "theme_ui green" "settings_ui";;
            4) do_action "theme_ui blue" "settings_ui";;
            5) do_action "theme_ui purple" "settings_ui";;
            6) do_action "theme_ui gray" "settings_ui";;

            B|b) clear; main_menu; break;;
            Q|q) quit_msg;;
            *)  Selection_invalid "settings_ui";;

        esac
    done
    settings_menu
}

function theme_ui(){
    sed -i "s/^themes_color=.*$/themes_color=\$$1/" ${MFAST_ROOT_PATH}/mfast.cfg
    source ${MFAST_ROOT_PATH}/mfast.cfg
    do_action
}


