### <center> <font size=34 face="STKaiti"> Linux修改用户名 </font>    <!-- {docsify-ignore} -->

Linux将用户名修改后，还需要修改 组名+家目录+UID

这只会更改用户名，而其他的东西，比如用户组，家目录，UID 等都保持不变。

1、修改用户名

``` bash
$ usermod -l 新用户  旧用户 
```

这只会更改用户名，而其他的东西，比如用户组、家目录、ID 等都保持不变。

> 注意： 你需要从要改名的帐号中登出并杀掉该用户的所有进程，要杀掉该用户的所有进程可以执行下面命令

``` bash
$ sudo pkill -u 旧用户名
$ sudo pkill -9 -u 旧用户名
```

2、修改家目录

``` bash
$ sudo usermod -d /home/新用户名 -m 新用户名
```

3、修改组名

``` bash
$ groupmod -n 新用户名 旧用户名
```

4、修改UID

``` bash
$ sudo usermod -u 1000 新用户名
```

5、检查

``` bash
$ id 新用户名
```

6. 修改主机名

``` bash 
hostnamectl set-hostname 修改之后的主机名
```

