#!/bin/bash

function backup_ui(){
    border "top"
    echo -e "|     ${cyan} "~~~~~~~~~~~~~~ [ Backup Menu ] ~~~~~~~~~~~~~~"     | "
    border "div_line"
    echo -e "|           ${yellow}Backup location: ~/kiauh-backups${clear}            | "
    border "div_line"

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
