#!/bin/bash

MAC_NAME=STM32MP157
GIT_Proxy_IP=192.168.0.203

ARM_QT=0

echo "proc /proc proc defaults 0 0" >> /etc/fstab

cd /
chown root:root ./
chmod +r ./
chmod +x ./
chmod 1777 /tmp

echo "auto eth0" > /etc/network/interfaces.d/eth0 
echo "iface eth0 inet dhcp" >> /etc/network/interfaces.d/eth0

echo -e "\r\n**** Change root user password! ****\r\n"
passwd root 

echo -e "\r\n**** Create lodge user! ****\r\n"
adduser lodge

echo -e "\r\n**** Update software source! ****\r\n"
apt update

apt install sudo locales -y

sudo dpkg-reconfigure locales

cd /home
chown lodge:lodge lodge -R

chown root:root /usr/bin/sudo
chmod 4755 /usr/bin/sudo

chmod u+w /etc/sudoers

echo "%lodge  ALL=(ALL:ALL) NOPASSWD:ALL" >> /etc/sudoers

sed -i '1d' /etc/hostname
echo "$MAC_NAME" >> /etc/hostname
sed -i 's/127.0.0.1\tlocalhost/& '$MAC_NAME'/g' /etc/hosts

apt install vim ssh git net-tools bzip2 zip nginx -y

sudo mkdir /lib/firmware                # M4启动文件存放位置;

# 端口权限
sudo touch /etc/udev/rules.d/70-ttyusb.rules
sudo chmod 666 /etc/udev/rules.d/70-ttyusb.rules
sudo echo 'KERNEL=="ttyUSB[0-9]*", MODE="0666"' >> /etc/udev/rules.d/70-ttyusb.rules
sudo echo 'KERNEL=="ttySTM[0-9]*", MODE="0666"' >> /etc/udev/rules.d/70-ttyusb.rules
sudo echo 'KERNEL=="ttyACM[0-9]*", MODE="0666"' >> /etc/udev/rules.d/70-ttyusb.rules

# 开机自启动脚本
sudo touch /etc/rc.local
sudo chmod 666 /etc/rc.local
sudo chmod a+x /etc/rc.local

sudo echo '#!/bin/sh -e' >> /etc/rc.local
sudo echo 'sudo dhclient eth0' >> /etc/rc.local

sudo echo 'sudo chmod 666 /etc/launch_M4.sh' >> /etc/rc.local
sudo echo 'sudo chmod a+x /etc/launch_M4.sh' >> /etc/rc.local

sudo echo 'bash /etc/launch_M4.sh &' >> /etc/rc.local

#-----------------  Qt  ------------------

if [ $ARM_QT -eq 1 ]; then

apt install --reinstall libqt5widgets5 libqt5gui5 libqt5dbus5 libqt5network5 libqt5core5a libqt5quick5 -y

cd /usr/lib

tar xvf arm-qt.tar.bz2
tar xvf tslib.tar.bz2

rm tslib.tar.bz2 arm-qt.tar.bz2

echo "
export TSLIB_ROOT=/usr/lib/tslib
export TSLIB_CONSOLEDEVICE=none
export TSLIB_FBDEVICE=/dev/fb0
export TSLIB_TSDEVICE=/dev/input/event0
export TSLIB_CONFFILE=\$TSLIB_ROOT/etc/ts.conf
export TSLIB_PLUGINDIR=\$TSLIB_ROOT/lib/ts
export TSLIB_CALIBFILE=/etc/pointercal
export LD_PRELOAD=\$TSLIB_ROOT/lib/libts.so

export LD_LIBRARY_PATH=\$TSLIB_ROOT/lib:/lib:/usr/lib

export QT_ROOT=/usr/lib/arm-qt
export QT_QPA_GENERIC_PLUGINS=tslib:/dev/input/event0
export QT_QPA_FONTDIR=/usr/share/fonts
export QT_QPA_PLATFORM_PLUGIN_PATH=\$QT_ROOT/plugins
export QT_QPA_PLATFORM=linuxfb:fb=/dev/fb0
export QT_PLUGIN_PATH=\$QT_ROOT/plugins
export LD_LIBRARY_PATH=\$LD_LIBRARY_PATH:\$QT_ROOT/lib:\$QT_ROOT/plugins/platforms
export QML2_IMPORT_PATH=\$QT_ROOT/qml
export QT_QPA_FB_TSLIB=1

#export QT_DEBUG_PLUGINS=1

" >> /etc/profile

fi

#----------------- root ------------------
cd ~
touch init.sh

echo "cd /
chown root:root ./
chmod +r ./
chmod +x ./
chmod 1777 /tmp
cd /home
chown lodge:lodge lodge -R

chown root:root /usr/bin/sudo
chmod 4755 /usr/bin/sudo

git config --global http.proxy http://$GIT_Proxy_IP:7890/
git config --global https.proxy https://$GIT_Proxy_IP:7890/

rm ~/init.sh -f
" >> init.sh

chmod +x init.sh

#------------------ lodge -----------------
cd /home/lodge

touch init_lodge.sh

echo "cd 

sudo apt update

# sudo apt install nginx -y

sudo apt install usbutils -y

echo "export PATH=\$PATH:/usr/sbin" >> ~/.bashrc
source ~/.bashrc

ifconfig

git config --global http.proxy http://$GIT_Proxy_IP:7890/
git config --global https.proxy https://$GIT_Proxy_IP:7890/

cd

sudo resize2fs /dev/mmcblk0p5
sudo resize2fs /dev/mmcblk2p3

sudo chmod u+s /bin/ping
git clone https://github.com/th33xitus/kiauh.git

sudo rm ~/init_lodge.sh -f

sudo reboot

" >> init_lodge.sh

chmod +x init_lodge.sh

echo -e "\r\n\r\n**** Initialization completed! ****\r\n"

rm ~/initOS.sh

exit

