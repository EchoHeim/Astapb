function rootfs_ui(){
    border "top"

    echo -e "$V_line $yellow  101:$clear buster          $V_line $yellow  102:$clear bullseye         $V_line"

    echo -e "|     ${green}~~~~~~~~~~~~~~ [ Update Menu ] ~~~~~~~~~~~~~~${clear}     | "
    border "div_line"
    echo -e "|  0) $BB4U_STATUS| "
    border "div_line"

    echo -e "|  10) [System]          |  $DISPLAY_SYS_UPDATE   | "
    back_footer
}

function rootfs_menu(){

    do_action "" "update_ui"
    while true; do
        choose "action"
        case "$action" in

        B|b)
            clear; main_menu; break;;
        *)
            Selection_invalid "rootfs_ui";;
        esac
    done
    rootfs_menu
}
