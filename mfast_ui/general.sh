#!/bin/bash

# ======== color ========
clear='\033[0m'

black='\033[30m'
gray=$(echo -en "\e[90m")
red=$(echo -en "\e[91m")
green=$(echo -en "\e[92m")
yellow=$(echo -en "\e[93m")
blue=$(echo -en "\e[94m")
purple=$(echo -en "\e[95m")
cyan=$(echo -en "\e[96m")
white=$(echo -en "\e[97m")

black_flash='\033[30;5m'
gray_flash=$(echo -en "\e[90;5m")
red_flash=$(echo -en "\e[91;5m")
green_flash=$(echo -en "\e[92;5m")
yellow_flash=$(echo -en "\e[93;5m")
blue_flash=$(echo -en "\e[94;5m")
purple_flash=$(echo -en "\e[95;5m")
cyan_flash=$(echo -en "\e[96;5m")
white_flash=$(echo -en "\e[97;5m")

# ui total
S_line="${blue}/${clear}"       # /
V_line="${blue}|${clear}"       # |
H_line="${blue}-${clear}"       # -
BS_line="${blue}\\\\${clear}"   # \

function top_border(){
    echo -e "${blue}/========================================================\\\\${clear}"
}

function bottom_border(){
    echo -e "${blue}\\========================================================/${clear}"
}

function blank_line(){
    echo -e "${blue}|${clear}                                                        ${blue}|${clear}"
}

function hr(){
    echo -e "${blue}|--------------------------------------------------------|${clear}"
}

function quit_msg(){
    top_border
    echo -e "$V_line ${green} ###### Good Job! ###### ${clear}                              $V_line"
    bottom_border
    exit 0
}

function quit_back_footer(){
    hr
    echo -e "$V_line                                   ${purple} Q/B: Quit or Back!${clear}  $V_line"
    bottom_border
}

function quit_backup_footer(){
    hr
    echo -e "$V_line                                 ${purple} Q/B: Quit or Backup!${clear}  $V_line"
    bottom_border
}

function print_header(){
    echo ""
    top_border
    echo -e "$V_line     $(title_msg "~~~~~~~~~~~~~~~~~~ ${yellow} MFAST ${cyan} ~~~~~~~~~~~~~~~~~~~")     $V_line"
    echo -e "$V_line     $(title_msg "   Multi-Functional Automatic Scripting Tool  ")     $V_line"
    echo -e "$V_line     $(title_msg "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")     $V_line"
    echo -e "$V_line                ${yellow_flash}***** Please choose *****${clear}               $V_line"
    bottom_border
}

### set some messages
function error_msg(){
    ERROR_MSG=$1
}

function status_msg(){
    STATUS_MSG=$1
}

function ok_msg(){
    OK_MSG=$1
}

function title_msg(){
    echo -e "${cyan}$1${clear}"
}

function get_date(){
    current_date=$(date +"%y%m%d-%H%M")
}

function print_msg(){
    if [[ "$ERROR_MSG" != "" ]]; then
        top_border
        echo -e "${red}"
        echo -e " $ERROR_MSG "
        echo -e "${clear}"
        bottom_border
    fi
    if [[ "$STATUS_MSG" != "" ]]; then
        echo -e "${yellow}"
        echo -e "#########################################################"
        echo -e " $STATUS_MSG "
        echo -e "#########################################################"
        echo -e "${clear}"
    fi
    if [ "$OK_MSG" != "" ]; then
        echo -e "${green}"
        echo -e "#########################################################"
        echo -e " $OK_MSG "
        echo -e "#########################################################"
        echo -e "${clear}"
    fi
    clear_msg
}

function clear_msg(){
    unset OK_MSG
    unset ERROR_MSG
    unset STATUS_MSG
}

################################################################################
### TODO: rework other menus to make use of the following functions too and make them more readable

function do_action(){
    clear && print_header
    if [ $# -eq 2 ]; then
        ### $1 is the action the user wants to fire
        $1
        print_msg
        ### $2 is the menu the user usually gets directed back to after an action is completed
        $2
    elif [ $# -eq 1 ]; then
        print_msg
        $1
    fi
}

function Selection_invalid(){
    clear && print_header
    error_msg "Invalid command!"
    print_msg
    $1
}
