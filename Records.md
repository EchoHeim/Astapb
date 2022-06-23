# git 代理

* 设置代理

    git config --global http.proxy http://192.168.0.203:7890/

    git config --global https.proxy https://192.168.0.203:7890/

* 取消代理

    git config --global --unset http.proxy

    git config --global --unset https.proxy

# klipper

git clone https://github.com/th33xitus/kiauh.git

# Linux 操作

setenv ipaddr 192.168.0.216 		//开发板 IP 地址
setenv ethaddr 00:04:9f:04:d2:35 	//开发板网卡 MAC 地址
setenv gatewayip 192.168.0.1 		//开发板默认网关
setenv netmask 255.255.255.0 		//开发板子网掩码
setenv serverip 192.168.0.168 		//服务器地址，也就是 Ubuntu 地址
saveenv

ifconfig eth0 up  	//启用网卡
ifconfig -a 		//查看IP
dhclient eth0  		//分配IP

SD卡启动：
setenv bootcmd "load mmc 0:4  0xc4000000 stm32mp157d-biqu.dtb && load mmc 0:4  0xc2000000 uImage && bootm 0xc2000000 - 0xc4000000"

eMMC启动:
setenv bootcmd 'ext4load mmc 1:2 c2000000 uImage;ext4load mmc 1:2 c4000000 stm32mp157d-biqu.dtb;bootm c2000000 - c4000000'

网络启动:
setenv bootcmd 'tftp c2000000 uImage;tftp c4000000 stm32mp157d-biqu.dtb;bootm c2000000 - c4000000'

--------------------------------------------------------------

SD卡挂载文件系统：
setenv bootargs "console=ttySTM0,115200 root=/dev/mmcblk0p5 rootwait rw"
setenv bootargs "console=ttySTM0,115200 root=/dev/mmcblk1p5 rootwait rw"

扩展系统未使用空间：sudo resize2fs /dev/mmcblk2p3
同步：sync
查看系统空间：df -h

eMMC挂载文件系统:
setenv bootargs 'console=ttySTM0,115200 root=/dev/mmcblk1p3 rootwait rw'
setenv bootargs 'console=ttySTM0,115200 root=/dev/mmcblk2p3 rootwait rw'		# 使能 SDIO wifi 时使用的文件系统位置

网络挂载nfs文件系统:
setenv bootargs 'console=ttySTM0,115200 root=/dev/nfs nfsroot=192.168.0.156:/home/lodge/STM32MP157/install/nfs/rootfs,proto=tcp rw ip=192.168.0.217:192.168.0.156:192.168.0.1:255.255.255.0::eth0:off'

=========================================================


bootcmd_stm32mp=echo "Boot over ${boot_device}${boot_instance}!";if test ${boot_device} = serial || test ${boot_device} = usb;then stm32prog ${boot_device} ${boot_instance}; else run env_check;if test ${boot_device} = mmc;then env set boot_targets "mmc${boot_instance}"; fi;if test ${boot_device} = nand || test ${boot_device} = spi-nand ;then env set boot_targets ubifs0; fi;if test ${boot_device} = nor;then env set boot_targets mmc0; fi;run distro_bootcmd;fi;



console=tty1 console=serial0,115200 root=PARTUUID=6093ee4a-02 rootfstype=ext4 fsck.repair=yes rootwait splash plymouth.ignore-serial-consoles


console=serial0,115200 console=tty3 loglevel=3 root=PARTUUID=f2cdde4f-02 rootfstype=ext4 elevator=deadline fsck.repair=yes rootwait
logo.nologo consoleblank=0 quiet

console=serial0,115200 console=tty1 root=PARTUUID=6c74a671-02 rootfstype=ext4 fsck.repair=yes rootwait quiet init=/usr/lib/raspi-config/init_resize.sh splash plymouth.ignore-serial-consoles


//----------开启串口调试-----------------------------------------\\

dtoverlay=pi3-miniuart-bt

dwc_otg.lpm_enable=0 console=tty1 console=serial0,115200 root=/dev/mmcblk0p2 rootfstype=ext4 elevator=deadline fsck.repair=yes rootwait

\\---------------------------------------------------------------//


-------------------------------------------------discord-------------------------------------------------------------------

Jordan — 2021/01/27
can you post the command output of ls /home/pi/.KlipperScreen-env/bin ?

rcfishhunt — 2021/01/27
yep ill grab it

Jordan — 2021/01/27
It looks like something is weird with your venv since your output had Invalid path for option '/home/pi/.KlipperScreen-env/bin/python': env (已编辑)

rcfishhunt — 2021/01/27
pi@mainsailos:~ $ ls /home/pi/.KlipperScreen-env/bin
ls: cannot access '/home/pi/.KlipperScreen-env/bin': No such file or directory
pi@mainsailos:~ $



--------------

ExecStart=-/sbin/agetty -8 -L %I 115200 $TERM –autologin root



export QT_QPA_EGLFS_INTEGRATION=none


# 树莓派

******* 扩展树莓派镜像空间 * 开机脚本 *************
cmdline.txt

console=serial0,115200 console=tty1 root=PARTUUID=b2500274-02 rootfstype=ext4 elevator=deadline fsck.repair=yes rootwait quiet init=/usr/lib/raspi-config/init_resize.sh

shell:

sudo resize2fs /dev/mmcblk0p2
sudo sed -i '/sudo \/bin\/sh \/fixsize.sh/ d' /etc/rc.local
sudo rm /fixsize.sh
sudo reboot



chmod +x resize2fs.sh
./resize2fs.sh

chmod +x Rpi_expand_rootfs.sh
./Rpi_expand_rootfs.sh



# QT-arm

================================================================================================
Project ERROR: Unknown module(s) in QT: openglextensions
make[2]: *** [Makefile:96: sub-render-make_first-ordered] Error 3
make[2]: Leaving directory '/home/lodge/Qt-Arm/qt-everywhere-src-5.14.2/qtquick3d/src'
make[1]: *** [Makefile:50: sub-src-make_first] Error 2
make[1]: Leaving directory '/home/lodge/Qt-Arm/qt-everywhere-src-5.14.2/qtquick3d'
make: *** [Makefile:365: module-qtquick3d-make_first] Error 2
make: *** Waiting for unfinished jobs....


https://github.com/libts/tslib


./configure --host=arm-none-linux-gnueabihf ac_cv_func_malloc_0_nonnull=yes --cache-file=arm-linux.cache -prefix=/home/lodge/Qt-Arm/tslib-1.22/arm-tslib

./configure CC=arm-none-linux-gnueabihf-gcc CXX=arm-none-linux-gnueabihf-g++ --prefix=/home/lodge/Qt-Arm/tslib-1.22/tslib --host=arm-none-linux-gnueabihf ac_cv_func_malloc_0_nonnull=yes


./configure \
        -prefix /home/lodge/Qt-Arm/qt5.14.2-arm \
        -confirm-license \
        -opensource \
        -release  \
        -make libs \
        -xplatform linux-arm-gnueabi-g++ \
        -optimized-qmake \
        -pch \
        -skip qt3d \
        -qt-libjpeg \
        -qt-libpng \
        -qt-zlib \
        -no-opengl \
        -no-sse2 \
        -no-openssl \
        -no-cups \
        -no-glib \
        -no-dbus \
        -no-xcb \
        -no-separate-debug-info \
        -nomake examples -nomake tools -nomake tests -no-iconv \
        -tslib \
        -I/home/lodge/Qt-Arm/tslib/include \
        -L/home/lodge/Qt-Arm/tslib/lib


./configure -release -opensource -tslib -xplatform linux-arm-gnueabi-g++ -prefix /home/lodge/Qt-Arm/qt5.14.2-arm -no-c++11 -no-opengl -I /home/lodge/Qt-Arm/tslib/include -L /home/lodge/Qt-Arm/tslib/lib

./configure \
        -prefix /home/lodge/Qt-Arm/qt5.14.2-arm \
        -I /home/lodge/Qt-Arm/tslib/include \
        -L /home/lodge/Qt-Arm/tslib/lib

./configure -platform linux-arm-gnueabi-g++ -prefix /home/lodge/Qt-Arm/qt5.14.2-arm -v -opengl es2 -eglfs -no-gtk -opensource -confirm-license -release -reduce-exports -force-pkg-config -nomake examples -no-compile-examples -skip qtwayland -skip qtwebengine -no-feature-geoservices_mapboxgl -qt-pcre -no-pch -ssl -evdev -system-freetype -fontconfig -glib -prefix /opt/Qt5.14 -qpa eglfs -qt-xcb -I /home/lodge/Qt-Arm/tslib/include -L /home/lodge/Qt-Arm/tslib/lib

# LVGL

git clone -b release/v8.2 --depth 1 https://github.com/lvgl/lvgl.git
git clone -b release/v8.2 --depth 1 https://github.com/lvgl/lv_drivers.git


git submodule add -b release/v8.2 https://github.com/lvgl/lv_drivers.git lv_drivers




====
sudo ethtool -s eth0 autoneg off speed 1000 duplex full

sudo ethtool -s eth0 autoneg on speed 100 duplex full

