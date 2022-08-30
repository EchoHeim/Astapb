#!/bin/bash

function main_ui(){
    border "top"
    echo -e "$V_line   ${green} ~~~~~~~~~~~~~~~~ [ MAIN MENU ] ~~~~~~~~~~~~~~~~    $V_line"
    border "div_line"
    echo -e "$V_line $green Basic $clear                      $V_line $green Extensions $clear           $V_line "
    border "space_blank_line" 28 22
    echo -e "$V_line $yellow 1)$clear [Armbian]                $V_line $yellow S)$clear [Settings]         $V_line "
    border "space_blank_line" 28 22
    echo -e "$V_line $yellow 2)$clear [H616]                   $V_line $yellow I)$clear [Info]             $V_line "
    border "space_blank_line" 28 22
    echo -e "$V_line $yellow 3)$clear [MP157]                  $V_line                        $V_line "
    border "space_blank_line" 28 22
    echo -e "$V_line $yellow 4)$clear [RaspBerryPi]            $V_line                        $V_line "
    echo -e "$V_line                              $V_line           Ver: $(tab_format ${MFAST_VER} 6)  $V_line "
    footer "quit_backup"
}

function main_menu(){
    do_action "main_ui"
    while true; do
    
        choose "action"
        case "$action" in
            
            1) clear && rootfs_menu && break;;
            2) clear && H616_sync_version_value && h616_menu && break;;
            3) clear && mp157_menu && break;;
            4) clear && rpi_menu && break;;

            S|s) clear && settings_menu && break;;
            I|i) clear && about_menu && break;;

            B|b) clear && backup_menu && break;;
            Q|q) quit_msg;;
            *)  Selection_invalid "main_ui";;

        esac

    done
}
