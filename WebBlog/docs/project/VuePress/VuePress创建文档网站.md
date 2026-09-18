---
title: VuePress 创建文档网站
date: 2022-06-23
tags: [建站]
summary: 简单介绍一下，VuePress 是尤雨溪 2018 年 04 月 12 日发布的 Vue 静态网站生成器，支持 Vue 语法，内置 webpack，每一个由 VuePress 生成的页面都是通过 SS…
---
## VuePress 介绍

简单介绍一下，[VuePress](https://vuepress.vuejs.org/zh/guide/) 是尤雨溪 2018 年 04 月 12 日发布的 Vue 静态网站生成器，支持 Vue 语法`，内置 `webpack`，每一个由 `VuePress` 生成的页面都是通过 SSR ` 预渲染的 HTML，也因此具有非常好的加载性能和搜索引擎优化。

个人觉得最大的亮点就是：

1. markdown 文件可以内嵌 Vue 组件
2. 借助 YAML 来作为驱动和配置文档



## 安装

> 在已有项目中安装

如果你想要在一个已有项目中维护文档，就应该将 VuePress 安装为本地依赖。此设置还允许你使用 CI 或 Netlify 服务，在推送时自动部署。

### 安装为本地依赖项

```sh
# 安装为本地依赖项
npm install -D vuepress
```

### 初始化项目

```sh
# 可以使用 npm 来初始化项目,会生成 package.json
npm init -y
```

然后在项目的根目录下新建一个 `docs` 文件夹，以后我们写的 `markdown` 文件都会放在 `docs` 文件夹下。

```sh
# 创建一个 docs 目录
mkdir docs
# 创建一个 markdown 文件
echo # Hello VuePress > docs/README.md
```

执行本地服务器启动命令：

```sh
vuepress dev docs
```

就可以看到启动了一个页面： 

![image-20200426193547122](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200426193548.png)

为了后续运行方便，我们可以把这些命令写在项目的 `package.json` 文件里面的 `scripts`：

```json
{
  "scripts": {
    "dev": "vuepress dev docs",
    "build": "vuepress build docs",
    "deploy": "npm run build && gh-pages -d docs/.vuepress/dist"
  }
}
```

然后你就可以开始编写文档了：

执行本地服务器启动命令：

```bash
yarn dev # 或者：npm run dev
```



要生成静态资源（HTML 文件），请运行：

```bash
yarn build # 或者：npm run build
```

默认情况下，构建的文件会位于 `.vuepress/dist` 中，该文件可以通过 `.vuepress/config.js` 中的 `dest` 字段进行配置。构建的文件可以部署到任何静态文件服务器。

## 目录结构

VuePress 遵循 **“约定优于配置”** 的原则，推荐的目录结构如下：

```bash
.
├── docs
│   ├── .vuepress (可选的)
│   │   ├── components (可选的)
│   │   ├── theme (可选的)
│   │   │   └── Layout.vue
│   │   ├── public (可选的)
│   │   ├── styles (可选的)
│   │   │   ├── index.styl
│   │   │   └── palette.styl
│   │   ├── templates (可选的, 谨慎配置)
│   │   │   ├── dev.html
│   │   │   └── ssr.html
│   │   ├── config.js (可选的)
│   │   └── enhanceApp.js (可选的)
│   │ 
│   ├── README.md
│   ├── guide
│   │   └── README.md
│   └── config.md
│ 
└── package.json
```

- `docs/.vuepress`: 用于存放全局的配置、组件、静态资源等。
- `docs/.vuepress/components`: 该目录中的 Vue 组件将会被自动注册为全局组件。
- `docs/.vuepress/theme`: 用于存放本地主题。
- `docs/.vuepress/styles`: 用于存放样式相关的文件。
- `docs/.vuepress/styles/index.styl`: 将会被自动应用的全局样式文件，会生成在最终的 CSS 文件结尾，具有比默认样式更高的优先级。
- `docs/.vuepress/styles/palette.styl`: 用于重写默认颜色常量，或者设置新的 stylus 颜色常量。
- `docs/.vuepress/public`: 静态资源目录。
- `docs/.vuepress/templates`: 存储 HTML 模板文件。
- `docs/.vuepress/templates/dev.html`: 用于开发环境的 HTML 模板文件。
- `docs/.vuepress/templates/ssr.html`: 构建时基于 Vue SSR 的 HTML 模板文件。
- `docs/.vuepress/config.js`: 配置文件的入口文件，也可以是 `YML` 或 `toml`。
- `docs/.vuepress/enhanceApp.js`: 客户端应用的增强。

## 基本配置

目前我们只写了一个 `markdown` 文档，所以只有一个页面，后续我们的博客会陆续加入很多内容，肯定需要做目录分级，配置导航栏，可以看[文档里的这部分](https://vuepress.vuejs.org/zh/theme/default-theme-config.html#首页)

官网说明的已经很详细，不妨直接看官网，走起：[默认主题设置](https://www.vuepress.cn/theme/default-theme-config.html)，如果后面针对于文档网站做个性化优化，会放在下面 "优化文档" 这一标题下说明。

## 部署

下述的指南基于以下条件：

- 文档放置在项目的 `docs` 目录中；
- 使用的是默认的构建输出位置；
- VuePress 以本地依赖的形式被安装到你的项目中，并且配置了如下的 npm scripts:

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d docs/.vuepress/dist"
  }
}
```

1. 在 `docs/.vuepress/config.js` 中设置正确的 `base`。

![image-20200426182800772](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200426182802.png)

```js
module.exports = {
  base: '/vuepress-demo/',
}
```



2. 在你的项目中，创建一个如下的 `deploy.sh` 文件（根据实际情况修改）:

```bash
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -
```

## GitHub Actions 自动构建/部署

大家有注意到 GitHub 悄悄上线了一个 Actions 功能吗？还不了解的同学可以看[这篇文章](https://zhuanlan.zhihu.com/p/77751445)，写的非常全面。

> GitHub Actions 是什么
>
> GitHub 官方号称 Actions 可以让你的**工作流自动化**：GitHub 监听某个事件（可能是某个分支的提交），然后触发你预定义的工作流，让大家在GitHub服务器上直接测试代码、部署代码。所以，我们可以利用这里特性来做 CI/CD，开发者只要写一下 workflow 脚本就可以了，不用费心思去想要用哪个第三方的 CI/CD 服务, 💯。

actions 其实就是由一些脚本组成，所以它们是可以复用的，GitHub 做了一个[官方市场](https://github.com/marketplace?type=actions)，可以搜索到他人提交的 actions。另外，还有一个 [awesome actions](https://github.com/sdras/awesome-actions) 的仓库，也可以找到不少 action。这样一来，你甚至都不用自己写具体的脚本，直接引用别人的脚本就行啦。

话不多说，赶紧用起来！

### 写 workflow 脚本

首先我们需要到项目仓库的页面上进入 Actions 这个 tab, 选择 Node 环境进入脚本的编辑页面

![image-20200426201144851](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200426201146.png)

这里我直接使用了 peaceiris 的 [`actions-gh-pages`](https://github.com/peaceiris/actions-gh-pages)，这个 `action` 可以帮你把打包好的静态文件部署到 `GitHub Pages` 上去。

最终我的 workflow 脚本如下： 

```bash
# This workflow will do a clean install of node dependencies, build the source code and run tests across different versions of node
# For more information see: https://help.github.com/actions/language-and-framework-guides/using-nodejs-with-github-actions

name: vuepress-demo
on:
  push:
    branches:
    - master

jobs:
  build-deploy:
    runs-on: ubuntu-18.04
    steps:
    - uses: actions/checkout@master

    # - name: Setup Node
    #   uses: actions/setup-node@v1
    #   with:
    #     node-version: '10.x'

    # - name: Cache dependencies
    #   uses: actions/cache@v1
    #   with:
    #     path: ~/.npm
    #     key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    #     restore-keys: |
    #       ${{ runner.os }}-node-

    - run: npm ci

    - run: npm run build

    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      env:
        ACTIONS_DEPLOY_KEY: ${{ secrets.ACCESS_TOKEN }}
        PUBLISH_BRANCH: gh-pages
        PUBLISH_DIR: docs/.vuepress/dist
```

注意

因为我用的 action 是第三方的，所以 action 可能会经常更改，如果你是过了一段时间才看到这篇文章，peaceiris 的 [`actions-gh-pages`](https://github.com/peaceiris/actions-gh-pages) 很可能已经发生了更新，所以脚本的内容建议直接参照它的官方文档来写。

更详细的语法可以去看 [GitHub Actions 的官方文档](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/events-that-trigger-workflows)

注意

### 设置 workflow 的环境变量

因为我们需要 GitHub Actions 把构建成果发到 GitHub 仓库，因此需要 GitHub 密钥，相当于是给 GitHub actions 授权。

首先运行下面的命令生成一对密钥：

```bash
ssh-keygen -t rsa -b 4096 -C "$(git config user.email)" -f gh-pages -N ""
# You will get 2 files:
#   gh-pages.pub (public key)
#   gh-pages     (private key)
```

像这样：

![image-20200426202933017](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200426202935.png)

密钥在这：

![image-20200426203943738](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200426203944.png)

然后：

1. 在博客项目的仓库的 Settings 栏下，找到 `Deploy keys`这一项，把你的公钥加进去，**注意勾选`Allow write access`**
2. 同样在博客项目的仓库的 Settings 栏下，找到 `Secrets`这一项，把你的私钥加进去

![image-20200426203453041](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200426203454.png)

![image-20200426203753813](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200426203755.png)

如图显示即成功：

![image-20200426203837992](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200426203839.png)

![image-20200426203823746](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200426203824.png)

## 优化文档

### 图片放大显示

1 安装插件

```bash
npm install -D @vuepress/plugin-medium-zoom
```

2 使用

```bash
module.exports = {
  plugins: ['@vuepress/medium-zoom']
}
```

3 效果图

![](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200427075157.gif)

### 配置 Google Analytics

网站搭建好了，也有人访问了，那我们要怎么统计用户的访问情况呢？可以使用谷歌出品的 Google Analytics （GA）。

Google Analytics （GA）是一个对用户活动进行追踪的工具，利用 GA 我们可以收集到博客当前有多少实时活跃用户，博客的总访问量，以及分析用户的一些访问行为，便于我们对博客网站做一些优化，而且它还是免费的！赶快用起来！

1 下载 google-analytics 插件

```bash
yarn add -D @vuepress/plugin-google-analytics
# OR npm install -D @vuepress/plugin-google-analytics
```

安装完在 config 配置文件里面配置一下 plugins

```js
module.exports = {
  plugins: [
    [
      '@vuepress/google-analytics',
      {
        'ga': '' // UA-00000000-0
      }
    ]
  ]
}
```

2 注册 GA，获取追踪 ID

上面那个 ga ID从哪里获取呢？别着急，我们需要到 [Google Analytics](https://analytics.google.com/) 的官网上去注册一下我们的博客应用：

![image-20200427080359014](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200427080400.png)

创建账号：

![image-20200427080425558](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200427080426.png)

![image-20200427080511842](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200427080513.png)

根据实际情况设置：

![image-20200427080634915](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200427080635.png)

然后就会获得追踪 ID，

![image-20200427080744798](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200427080745.png)

把获取到的跟踪ID 填到上面👆的`ga`这一项里面就好了。

### 插件-PWA

1 安装插件

```bash
yarn add -D @vuepress/plugin-pwa
# OR npm install -D @vuepress/plugin-pwa
```

2 添加插件信息

```js
//config,js
module.exports = {
// ...
 plugins: [
    ['@vuepress/pwa', {
        serviceWorker: true,
        //指向自定义组件
        popupComponent: 'MySWUpdatePopup',
        updatePopup: {
            message: "新的风暴已经出现",
            buttonText: "盘他"
        }
    }]
 ]
}
```

serviceWorker 的作用大致就页面首次加载时会请求本地的serviceWorker.js 去比对各个文件的版本号
如果不一致则提示用户拉取更新

### 评论系统-Valine

#### 方案一：valine 官方插件

参考：[valine 官方安装教程](https://valine.js.org/vuepress.html)

- 获取APP ID 和 APP Key,请先登录或注册 **LeanCloud**, 进入控制台后点击左下角创建应用
- 安装并使用 **Valine**

1 安装插件

```bash
npm install --save vuepress-plugin-comment
```

2 将 `vuepress-plugin-comment` 添加到vuepress项目的插件配置中：

```js
module.exports = {
  plugins: [
    [
      'vuepress-plugin-comment',
      {
        choosen: 'valine', 
        // options选项中的所有参数，会传给Valine的配置
        options: {
          el: '#valine-vuepress-comment',
          appId: 'Your own appId',
          appKey: 'Your own appKey'
        }
      }
    ]
  ]
}
```

3 效果

![image-20200427133728810](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200427133744.png)

4 修改样式

创建 .vuepress/styles/palette.styl

写入：

```css

#valine-vuepress-comment .veditor {
  min-height: 10rem;
  background-image: url(https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200425091751.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right;
  background-color: rgba(255,255,255,0);
  resize: none;
}

.vat {
  color: #49B1F5 !important;
  font-size: 14px !important;
}
.vpower.txt-right {
  display: none;
}


#valine-vuepress-comment {
  max-width 740px
  padding 10px
  display block;
  margin-left auto;
  margin-right auto;
}
```

config.js 中写入：

```js
const path = require('path')
palette: path.resolve(__dirname, 'palette.styl'),//样式修改
```



5 效果图

![image-20200428090051466](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200428090123.png)

> 建议使用方案一，方案二需要进行优化，因为 Valine 部分是被当作内容处理的，但是如果你非要使用方案二，可以把解决方案和我分享喔！

#### 方案二：配合插件手写全局组件

1 安装 Valine

```bash
//Install leancloud's js-sdk
npm install leancloud-storage --save

//Install valine
npm install valine --save
```

2 注册 vuepress 全局组件

创建 .vuepress/components/Valine.vue

(在components下注册的 vue 可供全局使用，文件名为组件名）

```vue
<template>
    <div>
        <div id="vcomments"></div>
    </div>

</template>

<script>
    export default {
        name: 'Valine',
        mounted: function(){
            // require window
            const Valine = require('valine');
            if (typeof window !== 'undefined') {
                this.window = window
                window.AV = require('leancloud-storage')

            }

            new Valine({
                el: '#vcomments' ,
                appId: "KIlqXsCmzBUnovnvh5ih8mk9-gzGzoHsz",
                appKey: "e0v6zIg2NGg44PM6MVLa7voo",
                notify:false,
                verify:false,
                avatar: 'monsterid',
                placeholder: "你是我一生只会遇见一次的惊喜 ...",
                path:window.location.pathname,//配置path地址，否则评论混乱
            });
        },
    }
</script>
<style>
    #vcomments{
        margin-top:100px;
    }
</style>
```

3 使用 Valine

只需要在 markdown 中调用即可

```
<Valine></Valine>
```



4 效果

![image-20200427134948583](https://gitee.com/wugenqiang/PictureBed/raw/master/CS-Notes/20200427134950.png)

也不错，只是评论被当作内容处理了……

### 不蒜子访问量统计功能

1 安装插件

```bash
yarn add busuanzi.pure.js
# or
npm install busuanzi.pure.js --save
```



> 还未实现，待完善

## 集成 UI 组件

vuepress 支持扩展，支持引入第三方组件，在 .vuepress/ 下创建 enhanceApp.js 文件，这里展示的是引入 vue 生态圈比较知名的ui库 [Element](https://element.eleme.cn/#/zh-CN), 来自于饿了么。

```js
/**
 * 扩展 VuePress 应用
 */
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

export default ({
  Vue, 
}) => {
  // ...做一些其他的应用级别的优化
  Vue.use(Element)
}
```

当然，在这之前，需要先安装 element。

```bash
yarn add element-ui
# or 
npm install element-ui --save
```

在扩展之后，就可以在自定义的组件或者 md 文件中，使用 element 的组件了。

## 