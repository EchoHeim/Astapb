function mp157_ui(){
    ui_print_versions
    top_border

    echo -e "$V_line $yellow  1:$clear STlinux 5.4       $V_line $yellow  2:$clear STlinux 5.10       $V_line"
    echo -e "$V_line $yellow  9:$clear Restore Factory Image                       $V_line"

    echo -e "|     ${green}~~~~~~~~~~~~~~ [ Update Menu ] ~~~~~~~~~~~~~~${clear}     | "
    hr
    echo -e "|  0) $BB4U_STATUS| "
    hr
    echo -e "|  a) [Update all]       |               |              | "
    echo -e "|                        |  Local Vers:  | Remote Vers: | "
    echo -e "|  Klipper/Klipper API:  |---------------|--------------| "
    echo -e "|  1) [Klipper]          |  $LOCAL_COMMIT | $REMOTE_COMMIT | "
    echo -e "|  2) [Moonraker]        |  $LOCAL_MOONRAKER_COMMIT | $REMOTE_MOONRAKER_COMMIT | "
    echo -e "|                        |               |              | "
    echo -e "|  Klipper Webinterface: |---------------|--------------| "
    echo -e "|  3) [Mainsail]         |  $MAINSAIL_LOCAL_VER | $MAINSAIL_REMOTE_VER | "
    echo -e "|  4) [Fluidd]           |  $FLUIDD_LOCAL_VER | $FLUIDD_REMOTE_VER | "
    echo -e "|                        |               |              | "
    echo -e "|  Touchscreen GUI:      |---------------|--------------| "
    echo -e "|  5) [KlipperScreen]    |  $LOCAL_KLIPPERSCREEN_COMMIT | $REMOTE_KLIPPERSCREEN_COMMIT | "
    echo -e "|                        |               |              | "
    echo -e "|  Other:                |---------------|--------------| "
    echo -e "|  6) [DWC2-for-Klipper] |  $LOCAL_DWC2FK_COMMIT | $REMOTE_DWC2FK_COMMIT | "
    echo -e "|  7) [DWC2 Web UI]      |  $DWC2_LOCAL_VER | $DWC2_REMOTE_VER | "
    echo -e "|  8) [PrettyGCode]      |  $LOCAL_PGC_COMMIT | $REMOTE_PGC_COMMIT | "
    echo -e "|  9) [Telegram Bot]     |  $LOCAL_MOONRAKER_TELEGRAM_BOT_COMMIT | $REMOTE_MOONRAKER_TELEGRAM_BOT_COMMIT | "
    echo -e "|                        |------------------------------| "
    echo -e "|  10) [System]          |  $DISPLAY_SYS_UPDATE   | "
    back_footer
}

function mp157_menu(){

    do_action "" "mp157_ui"
    while true; do
        read -p "${cyan}Perform action:${red} " action; echo
        case "$action" in

        10)
            do_action "update_system" "mp157_ui";;
        a)
            do_action "update_all" "mp157_ui";;
        B|b)
            clear; main_menu; break;;
        *)
            Selection_invalid "mp157_ui";;
        esac
    done
    mp157_menu
}
