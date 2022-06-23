## <center> 自动发送本机IP到邮箱 <!-- {docsify-ignore} -->

# 1. 前言

在使用 SSH 连接嵌入式 Linux 主板时，经常会遇到不知道板子 IP 的情况，这时就要通过串口登录或者其他方式查找 IP，然后再进行远程连接，很是繁琐。

如果能在 Linux 主板开机后，自动上报 IP，这样就方便很多了。

利用 Python 中的 yagmail 库，可以很简单的实现。

# 2. yagmail

在 Python 里发邮件，yagmail 应该是最简单的方式了。

[yagmail官网](https://github.com/kootenpv/yagmail) 已经有很详细的说明，这里只记录一下我的操作步骤。

## 2.1 安装 yagmail

* python2
``` bash
pip install yagmail
```

* python3
``` bash
pip3 install yagmail
```

## 2.2 配置账号

* 发件人信息

``` python
self_server = autosend_mail.SMTP(user="shilong_native@163.com", password="OPTZKTAEHISSYQOB", host="smtp.163.com")      
```

参数包括 邮箱、密码、服务器，这里以 `网易163` 邮箱为例，密码不是明文密码，要在邮箱设置里生成一个类似个人令牌的口令，不同邮箱的生成方式都差不多，具体方法可以登录自己的邮箱，在设置页查看，或者百度。

* 以 `QQ` 邮箱为例（其他邮箱类似）

> 【qq邮箱——设置——账户——POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务——IMAP/SMTP服务——开启】

> 公共邮箱：添加端口号与smtp的属性即可（详细请百度解决）。

## 2.3 发送邮件

收件人可以设置多个，可以对每个收件人设置昵称，可以发送 `html` 格式的邮件，发送其他附件，也可以使图片在邮件正文显示，关于上述这些，这里就不多说了，可参见 `yagmail` 的 [作者主页](https://github.com/kootenpv/yagmail) 。


完整代码如下 `auto_email.py`

``` python
#coding:utf-8

import yagmail as autosend_mail

from loguru import logger

# 读取文件到列表
with open("ip.txt","r") as ip_file:
    array = []
    content = ip_file.read().splitline()
    for line in ip_file:
        array.append(line)

# 邮件发送
# 发件人信息;(邮箱、密码、服务器)
self_server = autosend_mail.SMTP(user="shilong_native@163.com", password="OPTZKTAEHISSYQOB", host="smtp.163.com")      

email_Name = ["416604093@qq.com"]           # 收件人;
# email_Title = ["demo"]                    # 邮件标题;(非必需)
email_Title = content
email_Content = array                       # 邮件内容;(非必需)
email_Annexes = ["ip.txt"]                  # 邮件附件;(非必需)

self_server.send(to=email_Name, subject=email_Title, contents=email_Content, attachments=email_Annexes)
self_server.close()

logger.info("\n**** Email is sent! ****\n")
```

# 3. 获取 ip

这个就很简单了，通过 shell 脚本获取 ip 数据，然后保存到文件即可。

再调用 `auto_email.py` 文件，把获取到的 ip 当作邮件内容发送出去。

最后就是把 shell 脚本添加到 Linux 的开机启动项里，这样在板子开机后，如果有网络，就会自动获取 ip，然后发给指定的邮箱了。

``` bash
#/bin/bash

source_path = /home/pi/ip_report        # 开机脚本存放路径
sleep 15            # 延时等待系统开机并联网完成

cd $source_path
uname -n > ip.txt

echo "\r\n"
ifconfig >> ip.txt
python3 autoemail.py
```
