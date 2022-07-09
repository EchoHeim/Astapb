#!/bin/bash

username=biqu

c=0
cd /dev
for file in `ls mmcblk*`
do
  filelist[$c]=$file
  ((c++))
done

cd /

ROOT_DEV=/dev/${filelist[0]}

ROOT_NUM=1
UDISK_TEMP=2
UDISK_NUM=3

PART_SIZE=`cat /sys/block/${filelist[0]}/size`

UDISK_START=`expr $PART_SIZE - 614400`

ROOTFS_START=8192
ROOTFS_END=`expr $UDISK_START - 1`

# 使用 fdisk 工具进行磁盘分区;
sudo fdisk "$ROOT_DEV" << EOF
p
n
p
$UDISK_NUM
$UDISK_START

t
$UDISK_NUM
b
w
EOF

sudo mkdir /udisk
sudo mkdir /udisk_temp

unset filelist

c=0
cd /dev
for file in `ls mmcblk*`
do
    filelist[$c]=$file
    ((c++))
done

if [[ ${filelist[3]} == mmcblk1p3 ]]; then
    sudo mkfs.vfat /dev/mmcblk1p3            # 格式化分区为 FAT 格式;
    sudo mount /dev/mmcblk1p3 /udisk/
    sudo mount /dev/mmcblk1p2 /udisk_temp/
fi

if [[ ${filelist[3]} == mmcblk0p3 ]]; then
    sudo mkfs.vfat /dev/mmcblk0p3            # 格式化分区为 FAT 格式;
    sudo mount /dev/mmcblk0p3 /udisk/
    sudo mount /dev/mmcblk0p2 /udisk_temp/
fi

#------------------------
sudo rm /udisk/* -fr
cd /udisk_temp
sudo cp ./* /udisk/ -fr

cd /udisk
if [ ! -d "gcode" ]; then
    sudo mkdir gcode
fi

cd /
sudo umount /udisk
sudo umount /udisk_temp
sudo rm /udisk /udisk_temp -fr
#------------------------

# 使用 fdisk 工具进行磁盘分区;
sudo fdisk "$ROOT_DEV" << EOF
p
d
$UDISK_TEMP
d
$ROOT_NUM
n
p
$ROOT_NUM
$ROOTFS_START
$ROOTFS_END
y

w
EOF

sudo resize2fs /dev/${filelist[1]}           # 扩展分区;

cd /home/$username/scripts

sudo rm init.sh -fr
touch init.sh
chmod +x init.sh

cat >> init.sh << EOF
#!/bin/bash

c=0
cd /dev
for file in \`ls mmcblk*\`
do
    filelist[\$c]=\$file
    ((c++))
done

cd /home/$username/scripts
if [ -e "expand_rootfs.sh" ];then
    sudo rm ./expand_rootfs.sh -fr
fi

sudo chown $username:$username /home/$username/ -R

sudo mkdir /udisk
if [[ \${filelist[2]} == mmcblk0p2 ]]; then
    sudo mount /dev/mmcblk0p2 /udisk/
fi

if [[ \${filelist[2]} == mmcblk1p2 ]]; then
    sudo mount /dev/mmcblk1p2 /udisk/
fi

if [[ \${filelist[2]} == mmcblk0p3 ]]; then
    sudo mount /dev/mmcblk0p3 /udisk/
fi

if [[ \${filelist[2]} == mmcblk1p3 ]]; then
    sudo mount /dev/mmcblk1p3 /udisk/
fi

cd /udisk/gcode
if ls *.gcode > /dev/null 2>&1;then
    sudo cp ./*.gcode /home/$username/gcode_files -fr
    sync
    sudo rm ./*.gcode -fr
fi

cd /udisk
if [ -e "system.cfg" ];then
    sudo cp ./system.cfg /etc/
fi

cd /
sudo umount /udisk
sudo rm /udisk -fr
sync

sudo ethtool -s eth0 autoneg on speed 100 duplex full      # 限制以太网使用百兆带宽

cd /home/$username/scripts
./reconnect_wifi.sh

EOF

# trap "sudo rm ~/expand_rootfs.sh -f" EXIT		#脚本退出执行trap后面双引号中的命令
# sudo sed -i 's/\/home\/$username\/expand_rootfs.sh/sudo rm \/home\/$username\/expand_rootfs.sh/' /etc/rc.local

cd /home/$username/klipper_logs
rm ./* -fr
cd /home/$username/gcode_files
rm ./* -fr

git config --global --unset http.proxy      # 取消代理
git config --global --unset https.proxy

history -c          # 清除历史shell记录
history -w
cd /home/$username/
sudo rm ./.bash_history -fr

sudo sed -i 's/expand_rootfs.sh/init.sh \&/' /etc/rc.local

sudo reboot
