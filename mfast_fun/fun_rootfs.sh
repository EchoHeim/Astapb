function rootfs_ui(){
    top_border

    echo -e "$V_line     ${green}~~~~~~~~~~~~~~ [ H616 Menu ] ~~~~~~~~~~~~~~${clear}        $V_line"
    hr
    echo -e "$V_line $yellow  1)$clear all build            $V_line $yellow  2)$clear update files          $V_line"

    quit_back_footer
}

function rootfs_menu(){
    do_action "" "rootfs_ui"
    while true; do
        read -p "${cyan}Perform action:${red} " action; echo
        case "$action" in

        1)
            do_action "H616_build" "rootfs_ui";;
        2)
            do_action "update_all" "rootfs_ui";;

        B|b) clear; main_menu; break;;
        Q|q) quit_msg;;
        *)  Selection_invalid "rootfs_ui";;
        esac
    done
    rootfs_menu
}
