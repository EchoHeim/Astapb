#!/bin/bash

function rpi_ui(){
    ui_print_versions
    border "top"

    echo -e "$V_line $yellow  3:$clear compile image     $V_line $yellow  4:$clear install image      $V_line"
        
    echo -e "|     ${green}~~~~~~~~~~~~~~ [ Update Menu ] ~~~~~~~~~~~~~~${clear}     | "
    border "div_line"

    echo -e "|  8) [PrettyGCode]      |  $LOCAL_PGC_COMMIT | $REMOTE_PGC_COMMIT | "
    echo -e "|  9) [Telegram Bot]     |  $LOCAL_MOONRAKER_TELEGRAM_BOT_COMMIT | $REMOTE_MOONRAKER_TELEGRAM_BOT_COMMIT | "
    echo -e "|                        |------------------------------| "
    echo -e "|  10) [System]          |  $DISPLAY_SYS_UPDATE   | "
    back_footer
}

function rpi_menu(){
    do_action "" "rpi_ui"
    while true; do
        choose "action"
        case "$action" in

        10)
            do_action "update_system" "rpi_ui";;
        a)
            do_action "update_all" "rpi_ui";;
        B|b)
            clear; main_menu; break;;
        *)  Selection_invalid "rpi_ui";;
        esac
    done
    rpi_menu
}
