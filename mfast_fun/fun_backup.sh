#!/bin/bash

function mfast_backup(){

    cd $MFAST_ROOT_PATH

    git status
    echo -e "\n\n ${yellow}Please input commit message:\n -> ${red}\c"
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
