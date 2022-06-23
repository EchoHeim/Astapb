
# MP157附加脚本

运行 `M4 klipper` 固件程序

---

## launch_M4.sh

### 1、文件说明

放在文件系统 /etc 目录下，然后修改系统开机自启脚本 /etc/rc.local，要是没有需要手动创建，并赋予可执行权限；

### 2、rc.local 内容

``` bash
#!/bin/bash

sudo chmod +x /etc/launch_M4.sh
/etc/launch_M4.sh &
```
---

## run_klipper_M4.sh

### 1. 文件说明

放在文件系统 home 目录下，使用时要添加参数，elf文件名

## web_camera.sh

### 1. usb摄像头服务

> 开机自启动

usb 摄像头

- 查看服务状态

systemctl status webcamd

- 开启服务

systemctl start webcamd

