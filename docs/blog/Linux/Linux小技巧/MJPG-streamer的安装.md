### <center> <font size=34 face="STKaiti"> MJPG-streamer的安装 </font>    <!-- {docsify-ignore} -->

# 1. 简介

MJPG-streamer 是一个优秀的开源project，它可以通过HTTP的方式访问linux上面的兼容摄像头，本地获取摄像头的数据，再通过http通讯发出来，最终通过浏览器来访问IP地址对应的端口号就能够看到视频。

- 优点
    * 程序简单，所有源码一目了然，便与学习；
    * 对ARM板的性能要求不高，主频200MHZ的ARM芯片也能实现；

- 缺点
    * 只能实现局域网内的视频监控，若想要通过互联网实现视频监控，则需要另外实现内网渗透功能；
    * mjpg-streamer没有实现声音传输；
    * mjpg-streamer项目已经不再维护，仅仅建议用来学习；

# 2. 安装

## 2.1 首先安装必要的依赖库

``` bash
sudo apt update
sudo apt install subversion libjpeg8-dev imagemagick libv4l-dev cmake
```

## 2.2 下载开源代码并编译

``` bash
git clone https://github.com/jacksonliam/mjpg-streamer.git
cd mjpg-streamer/mjpg-streamer-experimental
make all
sudo make install
```

## 2.3 使用

> 如果是普通的USB摄像头，这个时候应该可以使用了

* 启动

    ``` bash
    ./mjpg_streamer -i "./input_uvc.so" -o "./output_http.so -w ./www"
    ```

> 如果是Raspberry Pi Camera，会报错，这是因为V4L driver 不支持raspberry pi的camera，所以初始化失败。

# 3. 解决不支持RaspberryPi的问题

1. 安装必要的依赖库

    ``` bash
    sudo wget http://www.linux-projects.org/listing/uv4l_repo/lrkey.asc && sudo apt-key add ./lrkey.asc
    ```

2. 修改sources list

    ``` bash
    sudo vim /etc/apt/sources.list
    ```

    > 在最后加上一行

    ``` bash
    deb http://www.linux-projects.org/listing/uv4l_repo/raspbian/ wheezy main
    ```

3. 安装uv4l并重启

    ``` bash 
    sudo apt-get update
    sudo apt-get install uv4l uv4l-raspicam
    sudo reboot
    ```

4. 再次安装重启

    ``` bash
    sudo pkill uv4l
    sudo apt-get update
    sudo apt-get install uv4l-uvc
    sudo apt-get install uv4l-xscreen
    sudo apt-get install uv4l-mjpegstream
    sudo reboot
    ```

5. 二次重启之后

    ``` bash
    sudo modprobe bcm2835-v4l2
    ./mjpg_streamer -i "./input_uvc.so -d /dev/video0 -n -y -f 25 -r 640x480" -o "./output_http.so -n -w /usr/local/www"
    ```

然后打开浏览器输入

``` text
http://raspberry-ip-address:8080/?action=stream
```

应该就可以看到Raspberry Pi Camera采集的动态视频了，延迟大概不超过0.8秒吧。

> 注意

``` bash
sudo modprobe bcm2835-v4l2
```

这条命令是每一次都要先执行然后才可以打开摄像头，不妨把它设为开机启动执行吧。


# 4. 参考文献
https://dotblogs.com.tw/bowwowxx/2015/06/08/151511
https://github.com/jacksonliam/mjpg-streamer
http://blog.csdn.net/blueslime/article/details/12429411
http://blog.csdn.net/zhaole20094463/article/details/7026252
https://www.jianshu.com/p/069c61315e8a?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation
