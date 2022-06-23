## <center> 什么是 Gitter?   <!-- {docsify-ignore} -->

# 1. 前言

基于 Bootstrap4 搭了个前端的架子，大部分个性化 css 都是自己手写的，于是也就有了现在的个人网站：https://xiaozhu2007.github.io/
， 网站的目的，旨在写出一些高质量的系列教程，帮助大家在工作中速查、学习啥的。但是，就目前来说，文章的数量还是不够，我在后续的日子里，会一点点补全的，有兴趣的不妨收藏一下。

好了，说了这么多废话，开始进入正题，由于网站没有留言，聊天的功能，导致与很多读者 0 沟通，粘性也就比较差。那么，要如何在网站中快速的集成 IM 即时通讯功能呢？


# 2. 什么是 Gitter？

什么是 Gitter 呢？听名字貌似和 GitHub 有点关系呢？

以下来之维基百科的解释：

Gitter 是 GitHub 存储库的开发人员和用户的即时通讯聊天室系统。 Gitter 作为软件即服务提供商，提供包括免费选项和所有基本功能，以及创建单个私人聊天室的能力，和个人和组织的付费订阅选项，允许他们创建任意数量的私人聊天室。

该服务可以为 GitHub 上的各个 Git 存储库创建个人聊天室。聊天室隐私遵循关联 GitHub 存储库的隐私设置：因此，私有的 GitHub 存储库的聊天室对于访问存储库的人员也是私有的。

它还可以将连接到聊天室的地址信息放置在 git 存储库的 README 文件中，以引起项目所有用户和开发人员的注意。用户也可以通过 GitHub 登录 Gitter 访问他们访问的存储库的私人聊天室。（注意： GitHub 密码是不与 Gitter 共享）

Gitter 类似于 IRC 和 Slack。但与 IRC 不同的是，它像Slack一样，会将所有聊天记录存档至云端。


# 3. 访问 Gitter 官网，并注册用户

访问 [Gitter 官方网站](https://gitter.im)


![image](https://user-images.githubusercontent.com/26021085/168950015-4665abc9-6bf5-4db3-a767-fda637542794.png)

* 注册用户

这里支持 GitLab，GitHub, Twitter 三种方式来授权登录，我选的是 GitHub:

# 4. 创建自己的 Gitter 聊天室

![image](https://user-images.githubusercontent.com/26021085/168950170-9717316a-72df-4505-a368-4bfecef2bcf4.png)

点击 `ADD A ROOM` 按钮:

添加一些朋友加入到你创建的聊天室吧，接下来，让我看下刚刚创建的聊天室：

![image](https://user-images.githubusercontent.com/26021085/168950865-ab6edc5a-4a9d-44de-ad1e-494e96e63280.png)

聊天室唯一域名（域名要记住，等下我们集成到个人网站需要）；

# 5. 借助 Sidecar 集成 gitter 到个人网站

好了，聊天室你也创建好了，怎么集成到自己的网站咧？为了开箱即用式的集成到个人网站，我们还需要借助一下 Sidecar, 等等！什么是 Sidecar?

Sidecar 能够帮助你快速便捷的集成 gitter, 仅仅需要添加几行 javascript 代码即可，开箱即用，你还可以通过一些配置来自定义它。


Sidecar 官方网站为： https://sidecar.gitter.im

将 javascript 代码，集成到个人网站中：

``` js
<script>
    ((window.gitter = {}).chat = {}).options = {
        room: 'EchoHeim/EnjoyShare'
    };
</script>
<script src="./js/sidecar.v1.js" async defer></script>
```

最后就可以登录网站查看最终效果了

![image](https://user-images.githubusercontent.com/26021085/168951624-c44cbcba-64bf-4212-bd78-d03bce265b07.png)

