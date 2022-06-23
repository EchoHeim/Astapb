### <center> <font size=14 face="STKaiti"> Github快速访问 </font>    <!-- {docsify-ignore} -->

# 1. 登录 DNS 解析网站

<http://tool.chinaz.com/dns>
或
<https://www.ipaddress.com>

输入github域名，查找自己访问的域名ip地址，找TTL值最小的IP

![image](https://user-images.githubusercontent.com/26021085/170409952-62649c0e-83d7-475c-a976-c9672b47bad5.png)

# 2. 修改 hosts 文件

将上一步找到的IP地址添加到hosts文件里

``` 
127.0.0.1	localhost
::1             localhost

20.205.243.166 github.com
```

* hosts 路径
    
    1. Linux
        
        ?> /etc/hosts

    1. Windows
        
        ?> C:\Windows\System32\drivers\etc\hosts
