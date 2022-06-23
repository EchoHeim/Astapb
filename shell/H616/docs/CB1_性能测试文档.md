首先硬件连接正确后，打开串口终端工具，连接上主板，开机后会在终端显示登录界面

![image](https://user-images.githubusercontent.com/26021085/173798047-a40f1da0-be94-4c0a-ac99-d7e8cbb973f4.png)

输入用户名和密码，都是 biqu，注意输入密码时，终端上不会显示

登录后的界面如下

![image](https://user-images.githubusercontent.com/26021085/173798115-18c09bd1-8cbd-4b06-a02d-7050193a0613.png)

1、CPU测试

输入以下命令进行CPU测试

``` bash
stress -c 4 --timeout 300s &
```

这时cpu会新增4个进程，提高CPU负荷，运行时间300秒，时间可以自己修改

2、内存测试

输入以下命令

``` bash
stress -i 4 --vm 10 --vm-bytes 10M --vm-hang 100 --timeout 300s &
```

新增4个io进程，10个内存分配进程，每次分配大小10M，分配后不释放，测试时间300秒，时间可以自己修改

输入以下命令查看CPU温度

``` bash
echo $[$(cat /sys/class/thermal/thermal_zone0/temp)/1000]°C
```

测试过程中如果想要停止测试，输入以下命令结束测试

```bash
sudo kill -9 $(pidof stress)
```
