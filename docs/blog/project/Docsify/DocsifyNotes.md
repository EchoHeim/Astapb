### <center> <font size=34 face="STKaiti"> Docsify 使用手册 </font>    <!-- {docsify-ignore} -->

# 0. 引言

在软件开发过程中，编程人员经常需要写文档，如开发文档、接口 `API` 文档、软件使用手册等，也会编写 `Blog` 记录开发过程，技术感悟（比如我的博客：[MacLodge's Blog](https://pwaga.js.org/) ）。

对于这些文档，一般情况下编写人员有以下几种需求：编写简单、对外发布、格式友好、形式专业。

而编写的工具则有好多，包括以下几类：

> 文档编写工具 

* word工具类：如 office word，wps，txt 等

* 平台博客类：csdn，简书，oschina 等

* 自建网站类：github，hexo，gitbook，markdown 等

* 知识工具类：confluence，语雀，看云等

当然，各种工具有各自的优缺点，简单一点的话，使用语雀、看云来写长系列文章或者书籍也比较适合，但作为一个开发人员，希望找一个能属于自己的，简单的，有点逼格的文档工具，特别是针对开源软件文档编写，放个 `pdf` 或者 `doc` 文档，不便于维护，最好能跟 `github` 关联，即时可看，又方便维护，如此，则非 `docsify` 莫属了（当然 `gitbook` 也行）。如下可以截图看一下基于 `docsify` 构建的文档。本文针对如何使用 `docsify` 实现文档构建进行讲解，希望能帮助到想构建自己的文档网站的同仁。


# 1. Docsify 简介

按 [Docsify](https://docsify.js.org) 官网的介绍，docsify 是一个神奇的文档网站生成器。使用它，可以通过简单的方式快速帮你构建一个专业的文档网站。不同于 `GitBook`、`Hexo` 的地方是它不会生成静态的 `.html` 文件，所有转换工作都是在运行时。如果你想要开始使用它，只需要创建一个 `index.html` 就可以开始编写文档。而且可以直接部署在 `GitHub Pages` 进行发布，方便、快捷、格式友好，样式不错。

[官方入门文档](https://docsify.js.org/#/zh-cn/)

> 此 [网站源码](https://github.com/EchoHeim/Astapb/tree/master/docs) 全部开源。&emsp; 附上 [效果预览](https://echoheim.github.io/Astapb/)

## 1.1 Docsify 特性

- 无需构建，写完文档直接发布
- 容易使用并且轻量 (压缩后 ~21kB)
- 智能的全文搜索
- 提供多套主题
- 丰富的 API
- 支持 Emoji
- 兼容 IE11
- 支持服务端渲染 SSR (示例)

## 1.2 Docsify 模板

模板源码：<https://github.com/YSGStudyHards/Docsify-Guide>

模板预览：<https://ysgstudyhards.github.io/Docsify-Guide/#/>

# 2. Node.js 安装配置

[Nodejs下载地址](http://nodejs.cn/download/)

![image](https://user-images.githubusercontent.com/26021085/163298955-4ba7fd85-343d-40c6-b78f-40a1110df031.png)

Linux系统直接下载二进制文件包，解压，然后添加路径到环境变量即可。

``` bash
PATH=$PATH:/home/lodge/nodejs/bin
```

最后在终端能查看版本号，说明安装成功

![image](https://user-images.githubusercontent.com/26021085/163299161-c36a5831-65e2-44d0-afe8-79d636a5c4d2.png)

# 3. docsify-cli 工具安装

推荐全局安装 `docsify-cli` 工具，可以方便地创建、以及在本地预览生成的文档。

``` bash
npm i docsify-cli -g
```

成功安装后显示如下：

![image](https://user-images.githubusercontent.com/26021085/163303235-948e7101-25c3-426b-b191-c260f4519afb.png)

# 3. 项目初始化

在项目的文档目录里可以直接通过 `init` 初始化项目。

``` bash
docsify init ./Docsify-Guide
```

- 更多功能查看 [docsify命令行工具](https://github.com/docsifyjs/docsify-cli)

初始化成功后，可以看到目录中自动创建了以下几个文件

- `index.html` 文档主页入口文件
- `README.md` 主页内容渲染文件
- `.nojekyll` 阻止 GitHub Pages 忽略下划线开头的文件

直接编辑 `README.md` 就能更新文档内容，当然也可以[添加更多页面](https://docsify.js.org/#/zh-cn/more-pages)。

# 4. 本地运行 docsify 项目

在项目根目录，可以运行 `docsify serve` 启动一个本地服务器；如果在上级目录，可示通过运行 `docsify serve 项目名称` 启动，然后就可以方便地实时预览效果。

默认本地访问地址 <http://localhost:3000>

# 5. 配置文件介绍

  | 文件作用 | 文件 |
  | :------: | :--: |
基础配置项（入口文件）| index.html
封面配置文件         | _coverpage.md
侧边栏配置文件       |  _sidebar.md
导航栏配置文件       |  _navbar.md
主页内容渲染文件     | README.md
浏览器图标           | favicon.ico


# 6. 实用插件

详见 [Docsify插件](blog/project/Docsify/DocsifyPlugin.md)

----------------------------------------------------------------

# Docsify 文档构建说明书

## 3 使用 docsify 构建文档

> 本章节将对如何使用 `docsify` 构建文档进行详细描述。

### 3.1 构建 docsify 目录结构

> (1) 安装 `npm`  

* git：[http://git-scm.com/](http://git-scm.com/)   安装 git 即可

> (2) 安装 `nodejs`

* node.js：[http://nodejs.org/](https://nodejs.org/en/docs/)

> (3) 安装 `docsify`

* 安装 `docsify-cli` 工具，方便创建及本地预览文档网站。

```
npm i docsify-cli -g
```

> (4) 初始化项目

* 进入指定文件目录，进行初始化操作

``` 
docsify init ./docs
```

`docsify` 有其规范的目录结构,初始化成功后，可以看到 `./docs` 目录下最基本的结构如下：

* `index.html`  # 入口文件
* `README.md`   # 会做为主页内容渲染
* `.nojekyll`   # 用于阻止 GitHub Pages 会忽略掉下划线开头的文件

![目录结构](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200427103944.jpg)


> (5) 本地预览网站

* 运行一个本地服务器通过 `docsify serve` 可以方便的预览效果，而且提供 LiveReload 功能，可以让实时的预览。默认访问 http://localhost:3000/#/ 和 http://127.0.0.1:3000/#/

```
docsify serve docs
```

* 预览图：(由于 README.md 文件被我增加了内容，故显示修改后的内容)

![本地预览](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200427103953.jpg)

一个基本的文档网站就搭建好了，`docsify` 还可以自定义导航栏，自定义侧边栏以及背景图和一些开发插件等等。更多配置请参考官方文档 https://docsify.js.org

> 期待继续优化，，，go on

### 3.2 添加文档标题名

* 在页面左上角添加文档标题名(自定义)，显示如下图所示：

![添加文档标题名](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200427104001.jpg)

* 操作如下：在 index.html 文件里添加 name 字段：

```html
<script>
    window.$docsify = {
      name: 'EnjoyToShare',
    }
  </script>
```

> 若想在点击文档标题的时候链接到想要的地址，可进行如下操作：

* 操作如下：在 index.html 文件里添加 nameLink 字段：

```html
<script>
    window.$docsify = {
      nameLink: 'https://wugenqiang.gitee.io',
    }
  </script>
```
