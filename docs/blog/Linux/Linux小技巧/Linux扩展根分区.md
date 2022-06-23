### <center> <font size=34 face="STKaiti"> Linux 扩展根分区 </font>    <!-- {docsify-ignore} -->

# 1. 概述

## 1.1 MBR & GTP

`MBR`（Master Boot Record、主引导记录）和 `GPT`（GUID Partition Table、GUID意为全局唯一标识符）是在磁盘上存储分区信息的两种不同方式；

对于传统的 `MBR` 分区方式，有很多的限制：

* 最多4个主分区（3个主分区 + 1个扩展分区(扩展分区里面可以放多个逻辑分区)），无法创建大于 `2TB` 的分区，使用 `fdisk` 分区工具，而 `GPT` 分区方式不受这样的限制;

* GPT 分区方式将不会有这种限制，使用的工具是 `parted`;

## 1.2 LVM

逻辑卷管理 `(Logical Volume Manager)` 是卷的一种管理方式，并不是分区工具（也可不采用这种 LVM 管理方式）。

![image](https://user-images.githubusercontent.com/26021085/164176773-d30131d9-8ffd-41dc-8718-0d8e0d335961.png)
![image](https://user-images.githubusercontent.com/26021085/164176936-45e9a491-4c7d-4ca8-8834-bd61f3669726.png)
![image](https://user-images.githubusercontent.com/26021085/164177044-6e58faa5-ec06-4ba7-bf69-706d2d5600cc.png)

`LVM` 扩容思维流程：创建一个物理分区 --> 将这个物理分区转换为物理卷 --> 把这个物理卷添加到要扩展的卷组中 --> 然后才能用 `extend` 命令扩展此卷组中的逻辑卷;

## 1.3 如何查看是否使用了LVM管理

``` bash
pvdisplay #查看物理卷

vgdisplay #查看卷组

lvdisplay #查看逻辑卷
```

执行上面命令，如果没有采用 `LVM` 管理的话，是查看不到上面卷组、物理卷、逻辑卷的（也可执行 `fdisk -l` 查看）。 

逻辑卷即是挂载在目录上的卷。

![image](https://user-images.githubusercontent.com/26021085/164177979-b9d24741-7123-434d-bbb9-91779da8e42d.png)

# 2. LVM 根分区扩容

我本地机器没有使用 `LVM` 进行管理，具体操作可参考：

<https://blog.csdn.net/liu_shi_jun/article/details/116117891>

<https://www.jianshu.com/p/273daea17b2a>

# 3. 非 LVM 根分区扩容

## 3.1 查看现有分区的大小

``` bash
df -Th
```

![image](https://user-images.githubusercontent.com/26021085/164182437-83f4deed-b826-46e2-b815-347a1559baf3.png)

## 3.2 查看磁盘状态

``` bash
lsblk
```

![image](https://user-images.githubusercontent.com/26021085/164182735-ed924900-66b6-4d3e-aa32-912b09f97072.png)

可以看到还有 12.5G 的空间没有使用。

## 3.3 进行分区扩展

使用 `fdisk` 工具，记住根分区起始位置和结束位置，查看未分配磁盘的起始地址

![image](https://user-images.githubusercontent.com/26021085/164184064-1a50c17e-4f0d-4443-a76e-306faea5bcc3.png)

然后删除根分区，记住`不要保存`

![image](https://user-images.githubusercontent.com/26021085/164184944-36b26eb2-981d-4d99-a1c8-e831bb6607cb.png)

创建分区，设置分区起始地址，即上一步记住的根分区起始位置，结束位置自己设置，然后保存退出

![image](https://user-images.githubusercontent.com/26021085/164185567-edecce7a-c56b-4a55-8326-57d2cbd59a45.png)

刷新分区

``` bash
sudo partprobe /dev/mmcblk1
```

## 3.4 查看分区状态

``` bash
lsblk
```

![image](https://user-images.githubusercontent.com/26021085/164186260-480851e0-6fca-4887-bab9-f220caaed9fe.png)

## 3.5 使用 resize2fs 扩容

``` bash
sudo resize2fs /dev/mmcblk1p1
```

![image](https://user-images.githubusercontent.com/26021085/164186822-2dd4d57f-b14f-4e59-b5a6-76e31d300f3a.png)\

至此就可以看到根目录空间已经扩容成功。

