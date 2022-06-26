### <center> <font size=28 face="STKaiti"> 申请js.org二级域名 </font>    <!-- {docsify-ignore} -->

# 1. js.org 简介

如何免费申请js.org二级域名？

> 本教程只注重于申请域名，而不是[如何使用 Github ](blog/ToolBox/Git使用.md "The greatest guide in the world")

看看我的成品：[https://shilong.js.org/](https://shilong.js.org/#/)

官网是这么介绍的：

> Are you a JavaScript developer looking for free webspace to host your project?
> Check out GitHub Pages.
> To make things perfect we provide you with a free and sleek URL as shown in the examples above.
> We don't mind whether it's a User-, Organization- or Project-Page - as long as you provide some reasonable content!
> Just follow these four steps to get your own free JS.ORG subdomain for your GitHub Page。

翻译：

> 您是JavaScript开发人员吗？，您是否正在寻找免费的网站空间来托管您的项目？
> 那就看看GitHub Pages吧。
> 为了使事情变得完美，我们为您提供了一个免费且时尚的域名，如上面的示例所示。
> 只要您提供一些合理的内容，我们都不介意是用户页面、组织页面还是项目页面。
> 您只需按照以下四个步骤为GitHub Pages获取自己的免费JS.ORG子域。

!> 并且js.org还有免费https证书和cdn加速，是不是很心动？

# 2. 申请流程

## 2.1 github 注册

先去注册一个Github的账号（这边不详细说明）

注册网址：[Github.com](https://www.github.com)，注册好后新建一个仓库。

## 2.2 上传文件

将你的网站`index.html`放入Github

关于Git上传Github的教程欢迎参考[如何使用 Github ](blog/ToolBox/Git使用.md "The greatest guide in the world")

之后到你自己仓库的Settings里找到GitHub Pages，选择你要部署的分区，可以看到一条

![image](https://user-images.githubusercontent.com/26021085/175777239-97a6f0af-4b9a-4f44-b973-53061c9894d0.png)

```
Your site is published at xxxxxxxxx
```

就表示部署成功了，可以访问以下确认部署正确

## 2.3 Fork仓库

先进入[https://github.com/js-org/js.org](https://github.com/js-org/js.org)

右上角fork仓库到你自己的仓库,然后在自己的仓库里打开cnames_active.js文件，可以看到里面有上千条别人的域名。

## 2.4 申请

首先想好你要申请的域名，如：shilong.js.org

然后进入cnames_active.js，修改

将你的域名按照首字母顺序（一定要按照字母顺序）放入相应的行数

eg:
>> "shilong": "echoheim.github.io/shilong",

那我们来解释一下：

- "shilong" 表示你要申请的域名，如你要申请xhemj.js.org就填入xhemj
- : 就是一个冒号+空格
- "echoheim.github.io/shilong" 表示你原来网站 GithubPages 的链接
- 一定要记得在后面加一个逗号! 

!> 注意：在后面不要加任何注释！（非常重要）

之后返回你的 js.org 仓库，创建 Pull requests，向js.org发送一个申请

## 添加 CNAME

最后记得回到要申请的仓库里新建CHAME文件，在里面输入你的.js.org域名

之后到[https://github.com/js-org/js.org](https://github.com/js-org/js.org)的Pull requests就可以看到你的申请

然后就可以等待审核人员审核，审核通过后就可以使用js.org域名了。

# 3. 注意

由于js.org 申请是面向JavaScript开发者的，所以申请时最好仓库内容要和JavaScript有点关系，这样比较容易通过。

