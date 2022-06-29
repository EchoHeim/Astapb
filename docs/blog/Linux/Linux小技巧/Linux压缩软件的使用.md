### <center> <font size=34 face="STKaiti"> Linux 压缩软件的使用 </font>    <!-- {docsify-ignore} -->

# 1. 文件后缀名含义

文件名 | 描述
:---  | :---
*.Z     |   compress 程序压缩的档案
*.bz2   |   bzip2 程序压缩的档案
*.gz    |   gzip 程序压缩的档案
*.tar   |  tar 程序打包的数据，并没有压缩过
*.tar.gz   | tar 程序打包的档案，其中并且经过 gzip 的压缩

# tar压缩

## 1、压缩命令

命令示例 | 描述
:---  | :---
tar	      |      解/压缩 (x:解压， c:创建解压文件， v：打印提示信息， f:接文件)
tar -cvf /home/***.tar /etc	   | 打包，不压缩
tar -cvf ***.tar.gz xxx 文件	| 将 ***文件压缩为 ***.tar.gz
tar -xvf ***.tar	| 解开包
tar -xvf ***.tar.gz 	 | 解压
tar -zxvf /home/***.tar.gz  |	以 gzip 解压
tar -jxvf /home/***.tar.bz2 |	以 bzip2 解压
tar -ztvf /tmp/***.tar.gz   |	查看 tar 内容

命令示例 | 描述
:---  | :---
cpio -covB > [file \| device]	    | 备份
cpio -icduv < [file \| device]     |	还原
文件归档： tar cf	              | 归档文件名.tar 备份目录、文件
文件压缩归档： tar czf          |	归档文件名.tar.gz 备份目录、文件
查看归档文件： tar tf           | 	归档文件名.tar
查看压缩归档文件： tar tzf       | 	归档文件名.tar.gz
恢复归档文件： tar xf           |	归档文件名.tar –C 指定目录
恢复压缩归档文件： tar xzf      | 	归档文件名.tar.gz –C 指定目录
解压 bz2 文件： tar jxf 文件名.bz2 -v   |	显示归档进度

## .tar

> 注：tar是打包，不是压缩！

解包 |	tar xvf FileName.tar
:-- | :--
打包 |	tar cvf FileName.tar DirName

## .gz

压缩 |	gzip FileName
:-- | :--
解压1	| gunzip FileName.gz
解压2	| gzip -d FileName.gz

## .tar.gz、.tgz

压缩 |	tar zcvf FileName.tar.gz DirName
:-- | :--
解压 |	tar zxvf FileName.tar.gz

## .bz2、.bz

压缩 |	bzip2 -z FileName
:-- | :--
解压1 |	bzip2 -d FileName.bz2
解压2 |	bunzip2 FileName.bz2

## .tar.bz2、.tar.bz

压缩 |	tar jcvf FileName.tar.bz2 DirName
:-- | :--
解压 |	tar jxvf FileName.tar.bz2

## .Z

压缩 |	compress FileName
:-- | :--
解压 |	uncompress FileName.Z

## .tar.Z

压缩 |	tar Zcvf FileName.tar.Z DirName
:-- | :--
解压 |	tar Zxvf FileName.tar.Z

# 2、其他命令

命令示例 | 描述
:---  | :---
compress filename |	压缩文件 加[-d]解压
gzip filename	| 压缩 加[-d]解压
bzip2 -z filename |	压缩 加[-d]解压
bzcat filename.bz2 |	查看压缩文件内容


# 三、rar压缩
 ## 1、rar安装与卸载

> 一般来说，默认Linux是不能解压rar文件的，需要安装rar解压工具。

``` bash
sudo apt-get install rar unrar
``` 

## 2、解压缩命令

压缩 |	rar a FileName.rar DirName
 :---  | :---
解压 |	rar x FileName.rar

# 四、zip压缩


压缩 |	zip -r FileName.rar DirName
 :---  | :---
 解压 |	unzip FileName.zip