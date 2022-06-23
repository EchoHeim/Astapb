# 目录

- [目录](#目录)
- [1. jekyll 说明](#1-jekyll-说明)
- [2. jekyll 目录结构](#2-jekyll-目录结构)
- [3. jekyll 语法](#3-jekyll-语法)
- [4. 搭建过程](#4-搭建过程)
  - [4.1. 新建仓库](#41-新建仓库)
  - [4.2. 仓库clone](#42-仓库clone)
  - [4.3. 安装ruby环境](#43-安装ruby环境)
  - [4.4. 安装Jekyll环境](#44-安装jekyll环境)
- [5. 创建博客](#5-创建博客)
- [6. 添加文章](#6-添加文章)
- [7. 文章发布](#7-文章发布)

# 1. jekyll 说明

`jekyll` 是一个可以把你写的 `MarkDown` 转化成 `html` 的纯前端框架，为什么说它纯前端呢？因为你的文章都是以 `MarkDown` 文件的形式保存的，无需数据库。配合 `Liquid` 可以灵活自由的生成动态 `Html` 页面。`Github` 原生支持 `jekyll`，你不需要在本地 `build`，直接把项目 `push` 到 `Github`，`Github` 会自动帮你生成 `html`。

`Github Pages` + `jekyll` 是 `github` 官方推荐的，用来搭建静态网站的一种非常有效并且便捷的方式。我们可以很方便地将静态网站的所有代码托管到 `github` 的 `Repository` 中，这样就可以通过网络来访问我们的网站。同时 `jekyll` 支持在本地预览我们使用 `MarkDown` 编写的博客，我们可以在本地预览无误之后，再提交到 `github` 上，提升了博客的编写效率。

[官方入门文档](http://jekyllcn.com/docs/home/)

# 2. jekyll 目录结构

`jekyll` 目录结构主要包含如下文件：

| 目录或文件        | 说明        |
| :------     | :--         |
_posts        | 博客内容
_pages        | 其他需要生成的网页，如 `about` 页
_layouts      | 网页排版模板
_includes     | 被模板包含的 `HTML` 片段，可在 `_config.yml` 中修改位置
assets        | 辅助资源 `css` 布局、`js` 脚本、图片等
_data         | 动态数据
_sites        | 最终生成的静态网页
_config.yml   | 网站的一些配置信息
index.html    | 网站的入口


# 3. jekyll 语法

[官方链接](http://jekyllcn.com/docs/home/)

---
表示一个 `for` 循环,百分号之间的语句为要执行的语句，该段代码表示分页输出文章，分页数量在 `_config.yml` 中配置。

注意：分页只在根目录下的 `index.html` 中有效。
``` html
{% for post in paginator.posts %} 
···
{% endfor %}
```

---
表示获取 `_config.yml` 里面的自定义字段名称的值
``` html
{ site.自定义字段名称 } 
```

---
循环输出 2 篇文章
``` html
{% for post in site.posts limit:2 %} 
···
{% endfor %}
```

---
循环输出最新 2 篇文章
``` html
{% for post in site.posts offset:0 limit:2 %}
···
{% endfor %}
```

---
输出该篇文章里的 `tag`
``` html
{% for tag in post.tags %}
···
{% endfor %}
```

---
字符串比较
``` html
{% if link.type == site.blog_1 %} 
···
{% endfor %}
```

---
定义 `assign` 变量加 1 
``` html
{% assign count = 0 %}

{% assign count = count | plus: 1 %}
```

---
获取文章摘要，取前 100 个字符
``` html
{{post.content | strip_html | strip_newlines | truncate: 100 }}
```

---
文章命名格式，否则识别不了
``` html
2022-04-22-添加的描述.markdown
```

---
输出文章日期
``` html
{{ page.date | date: ‘%Y, %b %d’ }}
```

---
输出文章标题
``` html
{{page.title}}
```

---
判断文章里的 `jekyll` 字段是否为 `true`
``` html
{% if post.jekyll %}
```

---
是否有上一页
``` html
{% if paginator.previous_page %}
```

---
是否有下一页
``` html
{% if paginator.next_page %}
```
---
上一页 `url`
``` html
{{ paginator.previous_page_path }}
```

--- 
下一页 `url`
``` html
{{ paginator.next_page_path }}
```

---
要访问的文章的 `url` 
``` html
| {{ post.url | prepend: site.baseurl }}
```


# 4. 搭建过程

## 4.1. 新建仓库

首先在 `github` 上创建一个特殊的代码仓库，名字必须是`xxx.github.io`，`xxx`是你的`github`昵称。

![image](https://user-images.githubusercontent.com/26021085/163766697-d6371493-7de8-4151-b3a0-bdb39265a762.png)

## 4.2. 仓库clone

然后把仓库 clone 到本地

`这里是我自己的git，用来举例`
``` bash
git clone git@github.com:EchoHeim/EchoHeim.github.io.git
cd EchoHeim.github.io
```

## 4.3. 安装ruby环境

``` bash
sudo apt install ruby
sudo apt install bundler
```

## 4.4. 安装Jekyll环境

在项目根目录下新增文件 `Gemfile`，添加以下内容

``` text
source 'https://rubygems.org'
gem "github-pages", group: :jekyll_plugins
```

然后运行
``` bash
sudo bundle update
sudo bundle install
```

运行成功后，就可以使用`Jekyll`创建博客内容了。

# 5. 创建博客

删除你项目主目录下的`Gemfile`和`Gemfile.lock`文件，然后使用终端在该目录下运行`jekyll new ./`。成功后，直接运行`jekyll serve`就可以在本地预览效果了。在浏览器输入`http://127.0.0.1:4000/`，可以查看效果。

注：

开启服务报错的话，可以尝试执行 `bundle update`
然后再执行 `bundle exec jekyll serve` 或者 `jekyll serve` 就 OK 了。


打开项目目录下的`Gemfile`文件，为了兼容`Github`默认的`Jekyll`，需要把`gem "jekyll", "3.4.3"`替换成`gem "github-pages", group: :jekyll_plugins`。

# 6. 添加文章
在`_posts`目录下按照`年-月-日-名称.markdown`的文件名格式创建新文章。文章内容可以参考自带的文章示例。

# 7. 文章发布
最后我们把项目的内容都`push`到`Github`上，就可以访问你的个人博客啦。地址如下：

![image](https://user-images.githubusercontent.com/26021085/163786760-15bf650d-f76d-411d-bd7c-109f813fdc29.png)


