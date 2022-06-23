function about_ui(){
    top_border
    echo -e "$V_line     $(title_msg "~~~~~~~~~~~~~~~ [ Information ] ~~~~~~~~~~~~~~")     $V_line"
    hr
    echo -e "$V_line $yellow 💗Slogan $clear                                             $V_line "
    blank_line
    echo -e "$V_line $green 🌱 互联网是有记忆的，我想留下一些成长的脚印！ $clear        $V_line "
    blank_line
    echo -e "$V_line $green 🍀 The Internet has a memory, and I want to leave     $V_line "
    echo -e "$V_line $green    some footprints of growing up! $clear                    $V_line "
    hr
    echo -e "$V_line $yellow 💗Contact $clear                                            $V_line "
    blank_line
    echo -e "$V_line $blue       Blog  ➡ $purple https://pwaga.js.org/ $clear                 $V_line "
    blank_line
    echo -e "$V_line $blue     GitHub  ➡ $purple https://github.com/EchoHeim $clear           $V_line "
    blank_line
    echo -e "$V_line $blue     E-mail  ➡ $purple shilong.native@foxmail.com $clear            $V_line "
    blank_line
    echo -e "$V_line $blue  QQ/WeChat  ➡ $purple 416604093 $clear                             $V_line "
    blank_line
    echo -e "$V_line $blue 微信公众号  ➡ $purple 程序小猴 $clear                              $V_line "
    blank_line
    quit_back_footer
    qrencode -m 2 -l L -t UTF8 -k "http://weixin.qq.com/r/vUMGHkXERxg4rQF99xav"
    echo
}

function about_menu(){
    clear_msg
    print_header
    do_action "" "about_ui"
    while true; do
        read -p "${cyan}Perform action:${red} " action; echo
        case "$action" in

            B|b) clear; main_menu; break;;
            Q|q) quit_msg;;
            *)  Selection_invalid "about_ui";;

        esac
    done
    about_menu
}
