function backup_ui(){
    border "top"
    echo -e "|     ${cyan} "~~~~~~~~~~~~~~ [ Backup Menu ] ~~~~~~~~~~~~~~"     | "
    border "div_line"
    echo -e "|           ${yellow}Backup location: ~/kiauh-backups${clear}            | "
    border "div_line"
    echo -e "|  Configuration folder: |  Klipper Webinterface:       | "
    echo -e "|  0) [Klipper configs]  |  4) [Mainsail]               | "
    echo -e "|                        |  5) [Fluidd]                 | "
    echo -e "|  Firmware:             |                              | "
    echo -e "|  1) [Klipper]          |  HDMI Screen:                | "
    echo -e "|                        |  6) [KlipperScreen]          | "
    echo -e "|  Klipper API:          |                              | "
    echo -e "|  2) [Moonraker]        |  Other:                      | "
    echo -e "|  3) [Moonraker DB]     |  7) [Duet Web Control]       | "
    echo -e "|                        |  8) [OctoPrint]              | "
    echo -e "|                        |  9) [MoonrakerTelegramBot]   | "
    back_footer
}

function backup_menu(){
    do_action "" "backup_ui"
    while true; do
    choose "action"
    case "$action" in

        B|b)
        clear; main_menu; break;;
        *)
        Selection_invalid "backup_ui";;
    esac
    done
    backup_menu
}
