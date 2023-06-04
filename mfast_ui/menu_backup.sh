#!/bin/bash

function backup_ui() {
    border "top"
    echo -e "$V_line   ${green} ~~~~~~~~~~~~~~~ [ Backup Menu ] ~~~~~~~~~~~~~~~    $V_line"
    border "div_line"

    echo -e "$V_line $yellow 1)$clear Backup this script!                               $V_line "

    footer "quit_back"
}

function backup_menu() {
    do_action "" "backup_ui"
    while true; do
        choose "action"
        case "$action" in

        1) do_action "mfast_backup" "backup_ui" ;;

        B | b)
            clear
            main_menu
            break
            ;;
        Q | q) quit_msg ;;

        *)
            Selection_invalid "backup_ui"
            ;;
        esac
    done
    backup_menu
}
