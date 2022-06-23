CB1 开机自检测试脚本

首先用读卡器将系统卡接入电脑，用记事本打开wpa_supplicant.conf文件，将wifi名称和密码改成可正常连接使用的wifi，保存文件。

![image](https://user-images.githubusercontent.com/26021085/173799225-f3808198-fa6d-43c4-8f4f-e1e3aaf2b04d.png)

将系统卡插进主板，机器上电开机后会自动运行检测脚本，运行时间一般在两分钟，自检完成后在显示器上会看到如下结果

![image](https://user-images.githubusercontent.com/26021085/173799418-971774ef-a30d-4cba-b17a-37a3a0da2ad2.png)

DDR内存为512M，显示在500左右均正常；

下面是各个项目的自检结果，全部通过后会显示 OK！，其中usb会显示接入的设备个数，建议所有的usb口都插入设备测试，如键盘、鼠标、U盘等

如果自检不通过

示例如下

![image](https://user-images.githubusercontent.com/26021085/173799480-24e4ee3d-b22e-42fb-bb21-d71e360c21fc.png)
