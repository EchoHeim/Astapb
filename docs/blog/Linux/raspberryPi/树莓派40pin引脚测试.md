### <center> <font size=34 face="STKaiti"> 树莓派 40pin 引脚测试 </font>    <!-- {docsify-ignore} -->

> 参考

[Linux下用文件IO的方式操作GPIO](https://blog.csdn.net/lu_embedded/article/details/53061901)

[确定正确的gpiochip](https://github.com/Klipper3d/klipper/blob/master/docs/RPi_microcontroller.md#optional-identify-the-correct-gpiochip)

shell 直接操作 IO 应该是最方便的一种方式了。

硬件连接

![8f65198d199243ad99f461ab9550bcf8](https://user-images.githubusercontent.com/26021085/165071067-b2722343-1178-49fa-ad0a-adf28ef0f173.png)

测试过程

进入 /sys/class/gpio/ 目录并查看文件

``` bash
cd /sys/class/gpio/
```

![9cc1d5d3ea1d4ff6ab4a1c69e18f36b9](https://user-images.githubusercontent.com/26021085/165071172-e996880b-1241-4585-8c73-e8d7b1c05b77.png)

文件 export 可以理解为创建，文件 unexport 为删除；

例如，将 gpio4 引脚重定义为设备，生成 gpio4 目录
``` bash
sudo echo 4 > export
```

![9ac75320fcc84105ac39b31e9c5fd768](https://user-images.githubusercontent.com/26021085/165071264-9678a18f-ef40-4afc-8e84-50f3353f85a1.png)


 进入到 gpio4 目录，可以看到两个比较重要的文件

direction 设置引脚方向，输入还是输出；

value 设置引脚状态，高电平还是低电平；

设置引脚状态为输入状态
``` bash
sudo echo in > direction
```

查看引脚高低电平
``` bash
cat value
```

设置引脚状态为输出状态
``` bash
sudo echo out > direction
```
设置输出高电平
``` bash
sudo echo 1 > value
```

设置输出低电平
``` bash
sudo echo 0 > value
``` 

注销

测试完毕之后返回 /sys/class/gpio/ 目录，并将 gpio 注销。

``` bash
sudo echo 4 > unexport
```

![29cbf368c57b446f9640d836bacf1996](https://user-images.githubusercontent.com/26021085/165071498-ed7620ef-90eb-4a6a-832c-97a79ee82ebe.png)


附上我自己测试用的脚本：

<https://github.com/EchoHeim/Astapb/blob/master/RaspBerry/GPIO_test.sh>

