#!/bin/bash

function tab_format_title(){
    f_name=$1
    [ $# == 1 ] && echo "$(printf "%-$1s" "")"
    [ $# == 2 ] && echo "$(printf "%-$2s" "$f_name")"
    unset f_name
}

function border(){
    color=${themes_color}

    if [[ "$ERROR_MSG" != "" ]]; then
        color=${red}
    fi
    if [[ "$STATUS_MSG" != "" ]]; then
        color=${yellow}
    fi
    if [ "$OK_MSG" != "" ]; then
        color=${green}
    fi

    if [ "$1" == "top" ]; then
        echo -e "${color}/=======================================================\\\\${clear}"
    elif [ "$1" == "bottom" ]; then
        echo -e "${color}\\=======================================================/${clear}"
    elif [ "$1" == "div_line" ]; then
        echo -e "${color}|-------------------------------------------------------|${clear}"
    elif [ "$1" == "blank_line" ]; then
        echo -e "${color}|${clear}                                                       ${color}|${clear}"
    elif [ "$1" == "main_blank_line" ]; then
        title_name=""
        title=$(tab_format_title $title_name 24)
        title_2=$(tab_format_title $title_name 22)
        echo -e "${color}|${clear} $yellow   $clear $title $clear$V_line $title_2 ${color}|${clear}"
        unset title title_name title_2
    fi
    unset color
}

function footer(){
    border "div_line"
    if [ "$1" == "quit_back" ]; then
        echo -e "$V_line                                  ${purple} Q/B: Quit or Back!${clear}  $V_line"
    elif [ "$1" == "quit_backup" ]; then
        echo -e "$V_line                                ${purple} Q/B: Quit or Backup!${clear}  $V_line"
    fi
    border "bottom"
}

function print_header(){
    echo
    get_date
    border "top"
    echo -e "$V_line   ${cyan} ~~~~~~~~~~~~~~~~~~~ ${yellow} MFAST ${cyan} ~~~~~~~~~~~~~~~~~~~    $V_line"
    echo -e "$V_line   ${cyan}    Multi-Functional Automatic Scripting Tool       $V_line"
    echo -e "$V_line   ${cyan} ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    $V_line"
    echo -e "$V_line  ${gray}$current_date${clear}   ${yellow_flash}***** Please choose *****${clear}        ${gray}$current_time${clear}  $V_line"
    unset current_date
    unset current_time
    border "bottom"
}

function get_date(){
    current_date=$(date +"20%y-%m-%d")
    current_time=$(date +"%H:%M")
}

function choose(){
    if [ $# == 1 ]; then
        [[ "$1" == "action" ]] && read -p "${yellow} Please choose: ${red}" action && echo -e "${clear}"
        [[ "$1" == "SD_or_eMMC" ]] && echo "${yellow} Revert to SD card or eMMC? (Please Choose)" && read -p " 1:SD card / 2:eMMC ${red}" SD_or_eMMC && echo -e "${clear}"
    elif [ $# == 2 ]; then
        [[ "$1" == "yn" ]] && read -p "${yellow} $2 ${red}" yn && echo -e "${clear}"
    fi
}

### set some messages
function select_msg() {
    echo -e "${green}🔹🔹🔹 ${1}${clear}\n"
}
function status_msg() {
    echo -e "\n${magenta}🔸🔸🔸 ${1}🔸🔸🔸${clear}\n"
}
function ok_msg() {
    echo -e "\n${green}[🔥 O.K.] ${1}${clear}\n"
}
function warn_msg() {
    echo -e "\n${yellow}[🟡 WARN] ${1}${clear}\n"
}
function error_msg() {
    echo -e "\n${red}[❌ ERROR] ${1}${clear}\n"
}
function abort_msg() {
    echo -e "\n${cyan}<<<<<< ${1}${clear}\n"
}

function quit_msg(){
    ok_msg "###### Good Job! ######"
    exit 0
}

function print_msg(){
    if [[ "$ERROR_MSG" != "" ]]; then
        border "top"
        echo -e "${red}"
        echo -e " $ERROR_MSG "
        echo -e "${clear}"
        border "bottom"
    fi
    if [[ "$STATUS_MSG" != "" ]]; then
        border "top"
        echo -e "${yellow}"
        echo -e " $STATUS_MSG "
        echo -e "${clear}"
        border "bottom"
    fi
    if [ "$OK_MSG" != "" ]; then
        border "top"
        echo -e "${green}"
        echo -e " $OK_MSG "
        echo -e "${clear}"
        border "bottom"
    fi
    clear_msg
}

function clear_msg(){
    unset OK_MSG
    unset ERROR_MSG
    unset STATUS_MSG
}

### TODO: rework other menus to make use of the following functions too and make them more readable

function do_action(){
    clear && print_header
    if [ $# -eq 2 ]; then
        $1
        print_msg
        $2
    elif [ $# -eq 1 ]; then
        print_msg
        $1
    fi
}

function Selection_invalid(){
    clear && print_header
    if [ $# -eq 1 ]; then
        error_msg "Invalid input, Please reselect!"
    elif [ $# -eq 0 ]; then
        status_msg "Parameter error, Please retype!"
    fi
    print_msg
    [ $# -eq 1 ] && $1
}

function armbian_status() {
    echo "================================"
}

function stm32mp157_status() {
    echo "================================"
}

function raspberrypi_status() {
    echo "================================"
}

function orangepi_status() {
    echo "================================"
}

