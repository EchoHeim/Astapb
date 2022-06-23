#!/bin/bash

# 用途
# 树莓派磁盘空间扩展

# 使用方式
# 将 Rpi_expand_rootfs.sh 脚本放入 home 目录;
# 然后在开机自启动脚本里（一般是 ~/.bashrc 文件）添加以下 5 行内容(去掉 # 号)：

# cd ~
# chmod +x resize2fs.sh
# ./resize2fs.sh
# chmod +x Rpi_expand_rootfs.sh
# ./Rpi_expand_rootfs.sh

cd ~

PART_NUM=2
ROOT_DEV=/dev/mmcblk0
PART_START=`cat /sys/block/mmcblk0/mmcblk0p2/start`

sudo fdisk "$ROOT_DEV" << EOF
p
d
$PART_NUM
n
p
$PART_NUM
$PART_START

p
w
EOF

# cd ~
# chmod +x resize2fs.sh
# ./resize2fs.sh
# chmod +x Rpi_expand_rootfs.sh
# ./Rpi_expand_rootfs.sh

touch resize2fs.sh

cat >> resize2fs.sh << EOF
sudo resize2fs /dev/mmcblk0p2
rm ~/Rpi_expand_rootfs.sh -f

sed -i '\$d' ~/.bashrc
sed -i '\$d' ~/.bashrc 
sed -i '\$d' ~/.bashrc
sed -i '\$d' ~/.bashrc
sed -i '\$d' ~/.bashrc

rm ~/resize2fs.sh -f
EOF

sudo chmod +x ~/resize2fs.sh

sudo reboot
