# 脚本说明

## Rpi_expand_rootfs.sh

### 1、用途
 
树莓派磁盘空间扩展

### 2、使用方式
将 Rpi_expand_rootfs.sh 脚本放入 home 目录;

然后在开机自启动脚本里（一般是 ~/.bashrc 文件）添加以下 5 行内容：

``` bash
cd ~
chmod +x resize2fs.sh
./resize2fs.sh
chmod +x Rpi_expand_rootfs.sh
./Rpi_expand_rootfs.sh
```

## GPIO_test.sh

### 1、作用

自动化测试树莓派 40pin 外接输出引脚，定时让所有 IO 自动输出高低电平;

### 2、树莓派引脚图

![rpi_pinout](https://user-images.githubusercontent.com/26021085/155838003-5542a8c4-f9a3-4975-9045-9dbd5e0a2f84.jpg)
