function main_ui(){
    border "top"
    echo -e "$V_line    ${cyan} ~~~~~~~~~~~~~~~~ [ Main Menu ] ~~~~~~~~~~~~~~~~    $V_line"
    border "div_line"
    echo -e "$V_line $green Basic $clear                       $V_line $green Extensions $clear           $V_line "
    border "main_blank_line"
    echo -e "$V_line $yellow 1)$clear [Build_Rootfs]            $V_line $yellow U)$clear [update_log]       $V_line "
    border "main_blank_line"
    echo -e "$V_line $yellow 2)$clear [H616]                    $V_line $yellow I)$clear [Info]             $V_line "
    border "main_blank_line"
    echo -e "$V_line $yellow 3)$clear [MP157]                   $V_line                        $V_line "
    border "main_blank_line"
    echo -e "$V_line $yellow 4)$clear [RaspBerryPi]             $V_line                        $V_line "
    echo -e "$V_line                               $V_line            Ver: 1.0.2  $V_line "
    footer "quit_backup"
}

function main_menu(){
    do_action "main_ui"
    while true; do
    
        choose "action"
        case "$action" in
            
            1) clear && rootfs_menu && break;;
            2) clear && h616_menu && break;;
            3) clear && mp157_menu && break;;
            4) clear && rpi_menu && break;;

            U|u) do_action "main_ui";;

            I|i) clear && about_menu && break;;
            B|b) clear && backup_menu && break;;
            Q|q) quit_msg;;
            *)  Selection_invalid "main_ui";;

        esac

    done
}
