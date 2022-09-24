### <center> <font size=34 face="STKaiti"> Nginx搭建静态网站服务器 </font>    <!-- {docsify-ignore} -->

# 1. 简介

Nginx `("engine x")` 是一个高性能的 HTTP 和 反向代理服务器，这里介绍如何在Debian系统安装nginx并搭建一个最简单的静态网站服务器。

# 2. 安装配置

1. 安装nginx

``` bash
sudo apt install nginx
```

2. 创建Web目录

> 这里只是举例，路径可以自己更改。

> 所有的网站将会存放到 /var/www 下， onceai网站将会存放到 /var/www/onceai下面。

``` bash
mkdir /var/www
mkdir /var/www/onceai
```

3. 修改nginx服务器配置文件

``` bash
sudo vim /etc/nginx/nginx.conf
```

4. 将文件原内容删除，替换为以下内容

``` bash
# user www-data;
worker_processes 4;
pid /run/nginx.pid;

events {
        worker_connections 768;
        # multi_accept on;
}

http {

    ##
    # Basic Settings
    ##
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    # server_tokens off;

    # server_names_hash_bucket_size 64;
    # server_name_in_redirect off;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    ##
    # SSL Settings
    ##
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
    ssl_prefer_server_ciphers on;

    ##
    # Logging Settings: nginx访问日志存放地址
    ##
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    ##
    # Gzip Settings: 开启gip压缩
    ##
    gzip on;
    gzip_disable "msie6";

    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    ##
    # Virtual Host Configs
    ##

    #注释掉默认的引用文件
    #include /etc/nginx/conf.d/*.conf;
    #include /etc/nginx/sites-enabled/*;


    #****************************OnceAI***************************
    # default_server 代表默认服务器
    # 比如从IP访问时，并没有匹配 onceai.com 的域名，但也会代理到 /var/www/onceai 网站目录
    # 如果去掉 default_server，此服务器将只会处理onceai.com域名的请求，
    # 请将onceai.com换成你自己的域名。
    #**************************************************************
    server {
        listen  80 default_server;
        server_name onceai.com;
        location / {
            root   /var/www/onceai;
            index  index.html;
        }
    }

    # 将 http://www.onceai.com 的请求转向到 http://onceai.com 提高权重
    server {
        listen 80;
        server_name www.onceai.com;
        rewrite ^ http://onceai.com$request_uri? permanent;
    }
}
```

5. 测试nginx配置文件

``` bash
nginx -t -c /etc/nginx/nginx.conf
```

6. 测试通过，重启nginx服务器

``` bash
/etc/init.d/nginx restart
```

7. 创建默认 index.html 网页，随便写些网页内容

``` bash
nano /var/www/onceai/index.html
```

8. 使用公网IP域域名访问测试你的服务器，查看 index.html 是否显示
