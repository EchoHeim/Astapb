#!/bin/bash

function about_ui(){
    border "top"
    echo -e "$V_line   ${cyan} ~~~~~~~~~~~~~~~ [ Information ] ~~~~~~~~~~~~~~~    $V_line"
    border "div_line"
    echo -e "$V_line $yellow 💗  Slogan $clear                                          $V_line "
    border "blank_line"
    echo -e "$V_line $green 🌱  互联网是有记忆的，我想留下一些成长的脚印！ $clear      $V_line "
    border "blank_line"
    echo -e "$V_line $green 🍀  The Internet has a memory, and I want to leave   $V_line "
    echo -e "$V_line $green    some footprints of growing up! $clear                   $V_line "
    border "div_line"
    echo -e "$V_line $yellow 💗  Contact $clear                                         $V_line "
    border "blank_line"
    echo -e "$V_line $blue      Blog  ➡ $purple https://shilong.js.org $clear                $V_line "
    border "blank_line"
    echo -e "$V_line $blue    GitHub  ➡ $purple https://github.com/EchoHeim $clear           $V_line "
    border "blank_line"
    echo -e "$V_line $blue    E-mail  ➡ $purple shilong.native@foxmail.com $clear            $V_line "
    border "blank_line"
    echo -e "$V_line $blue QQ/WeChat  ➡ $purple 416604093 $clear $V_line $blue 微信公众号  ➡ $purple 程序小猴 $clear $V_line "
    border "blank_line"
    footer "quit_back"
    qrencode -m 2 -l L -t UTF8 -k "http://weixin.qq.com/r/vUMGHkXERxg4rQF99xav"
    echo
}

function about_menu(){
    clear_msg
    print_header
    do_action "about_ui"
    while true; do
        choose "action"
        case "$action" in

            B|b) clear; main_menu; break;;
            Q|q) quit_msg;;
            *)  Selection_invalid "about_ui";;

        esac
    done
    about_menu
}
