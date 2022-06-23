function main_ui(){
    top_border
    echo -e "$V_line     $(title_msg "~~~~~~~~~~~~~~~~ [ Main Menu ] ~~~~~~~~~~~~~~~")     $V_line"
    hr
    echo -e "$V_line $green Basic $clear                       $V_line $green Extensions $clear           $V_line "
    main_blank_line
    echo -e "$V_line $yellow 1)$clear [Build_Rootfs]            $V_line $yellow U)$clear [update_log]       $V_line "
    main_blank_line
    echo -e "$V_line $yellow 2)$clear [H616]                    $V_line $yellow I)$clear [Info]             $V_line "
    main_blank_line
    echo -e "$V_line $yellow 3)$clear [MP157]                   $V_line                        $V_line "
    main_blank_line
    echo -e "$V_line $yellow 4)$clear [RaspBerryPi]             $V_line                        $V_line "
    echo -e "$V_line                               $V_line            Ver: 1.0.1  $V_line "

    quit_backup_footer
}

function main_menu(){
    clear_msg
    print_header
    main_ui

    while true; do

        read -p "${yellow} Your choice: ${red}" action; echo

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

    clear; main_menu
}

function main_blank_line() {
    title_name=""
    title=$(tab_format_title $title_name 25)
    title_2=$(tab_format_title $title_name 22)
    echo -e "$V_line $yellow   $clear $title $clear$V_line $title_2 $V_line "
    unset title title_name title_2
}
