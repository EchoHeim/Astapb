#!/bin/bash

ls_date=`date +%Y-%m-%d`        # 获取当前日期;
CycleSelect=1

#---------------------------------------------------------------

function mfast_backup(){

    cd $MFAST_ROOT_PATH

    echo -e "\n Please input commit message:"
    echo -e "\n -> \c"
    read git_MSG

    git add .
    git commit -m "$git_MSG"
    git push origin master

    if [ $? == 0 ]; then        # 判断上一条命令是否成功执行;
        ok_msg "Backup Successful!"
    else
        warn_msg "Backup failed!"
    fi
}


function backups(){
    
if [ $# == 0 ]; then

    Type_Chose=0
    tput reset      # clear screen;

    while [ $CycleSelect == 1 ]
    do
        echo -e "\n$blue/==================================================\\\\$clear"
        echo -e "$V_line $cyan                [ BackUp Menu ]                 $clear $V_line"
        echo -e "$V_line $cyan     Which document needs to be backed up?      $clear $V_line"
        echo -e "$blue|--------------------------------------------------|$clear"
        echo -e "$V_line            $yellow_flash***** Please choose *****$clear             $V_line"
        echo -e "$blue|--------------------------------------------------|$clear"
        echo -e "$V_line $yellow  [5]:$clear Backup all files to Baidu Cloud Drive!    $clear$V_line"
        echo -e "$blue|--------------------------------------------------|$clear"
        echo -e "$V_line $yellow  [9]:$clear Backup or Recovery this script!           $V_line"
        echo -e "$blue|--------------------------------------------------|$clear"
        echo -e "$V_line                             $purple Q/B: Quit or Back!$clear  $V_line"
        echo -e "$blue\\==================================================/$clear"
        echo -e "$yellow\n Your choice:$clear \c "
        
        read Type_Chose

        if [[ $Type_Chose == "q" || $Type_Chose == "Q" ]]; then
            exit 0
        fi

        if [[ $Type_Chose == "b" || $Type_Chose == "B" ]]; then
            . ./AutoBuildTool
        fi

        if [[ $Type_Chose -eq 5 ]]; then
            . ./BackupToCloud.sh
            exit 0
        fi

        if [[ $Type_Chose -eq 9 ]]; then
            break
        fi

        if [[ $Type_Chose -ge 1 || $Type_Chose -le 6 ]]; then
            CycleSelect=0
        fi

        if [[ $Type_Chose -lt 1 || $Type_Chose -gt 6 ]]; then
            tput reset      # clear screen;
            echo -e "\n$blue/==================================================\\\\$clear"
            echo -e "$V_line $red_flash        Selection error,Please try again!       $clear $V_line"
            echo -e "$blue\\==================================================/$clear"
            Type_Chose=0
        fi

    done
else
    echo -e "\n$blue/==================================================\\\\$clear"
    echo -e "$V_line $red_flash    No parameters required,Please try again!    $clear $V_line"
    echo -e "$blue\\==================================================/$clear"
    exit 0
fi

#----------------------------------------------------------------------------------
if [[ $Type_Chose -eq 9 ]]; then            # This script;

    echo -e "\n$purple Backup$yellow(B)$purple or Recovery$yellow(R)$purple this script? $red_flash(B/R)$clear \c"
    read B_or_R
    
    if [[ $B_or_R == "B" || $B_or_R == "b" ]]; then
        
    fi

    if [[ $B_or_R == "R" || $B_or_R == "r" ]]; then
        cd $MFAST_ROOT_PATH/..
        rm $MFAST_ROOT_PATH -fr

        git clone --depth 1 https://github.com/EchoHeim/Astapb.git

        if [ $? == 0 ]; then        # 判断上一条命令是否成功执行;
            echo -e "\n$blue/==================================================\\\\$clear"
            echo -e "$V_line $green                  [  Notice  ]                  $clear $V_line"
            echo -e "$V_line $green         **** Recovery Successful! ****         $clear $V_line"
            echo -e "$blue\\==================================================/$clear"
        else
            echo -e "\n$blue/==================================================\\\\$clear"
            echo -e "$V_line $red                  [  Warning  ]                 $clear $V_line"
            echo -e "$V_line $red           **** Recovery failed! ****           $clear $V_line"
            echo -e "$blue\\==================================================/$clear"
        fi
    fi

    exit 0
fi

}

function BackupToCloud () {

if [ $# == 0 ]; then

    Type_Chose=0
    tput reset      # clear screen;

    while [ $CycleSelect == 1 ]
    do
        echo -e "\n$blue/==================================================\\\\$clear"
        echo -e "$V_line $cyan                [ BackUp Menu ]                 $clear $V_line"
        echo -e "$V_line $cyan     Which document needs to be backed up?      $clear $V_line"
        echo -e "$blue|--------------------------------------------------|$clear"
        echo -e "$V_line            $yellow_flash***** Please choose *****$clear             $V_line"
        echo -e "$blue|--------------------------------------------------|$clear"
        echo -e "$V_line $yellow  [99]:$clear$blue Back up all files to Baidu Cloud Drive!  $clear$V_line"
        echo -e "$blue|--------------------------------------------------|$clear"
        echo -e "$V_line$green_flash  ** STM32MP157 **                                $clear$V_line"
        echo -e "$blue|--------------------------------------------------|$clear"
        echo -e "$V_line $yellow  1:$clear Kernel image      $V_line $yellow  2:$clear uboot image        $V_line"
        echo -e "$blue|--------------------------------------------------|$clear"
        echo -e "$V_line                             $purple Q/B: Quit or Back!$clear  $V_line"
        echo -e "$blue\\==================================================/$clear"
        echo -e "$yellow\n Your choice:$clear \c "
        
        read Type_Chose

        if [[ $Type_Chose == "q" || $Type_Chose == "Q" ]]; then
            exit 0
        fi

        if [[ $Type_Chose == "b" || $Type_Chose == "B" ]]; then
            . ./AutoBuildTool
        fi

        if [[ $Type_Chose -eq 9 || $Type_Chose -eq 6 || $Type_Chose -eq 99 ]]; then
            break
        fi

        if [[ $Type_Chose -ge 1 || $Type_Chose -le 2 ]]; then
            CycleSelect=0
        fi

        if [[ $Type_Chose -lt 1 || $Type_Chose -gt 2 ]]; then
            tput reset      # clear screen;
            echo -e "\n$blue/==================================================\\\\$clear"
            echo -e "$V_line $red_flash        Selection error,Please try again!       $clear $V_line"
            echo -e "$blue\\==================================================/$clear"
            Type_Chose=0
        fi

    done
else
    echo -e "\n$blue/==================================================\\\\$clear"
    echo -e "$V_line $red_flash    No parameters required,Please try again!    $clear $V_line"
    echo -e "$blue\\==================================================/$clear"
    exit 0
fi



}
