### <center> <font size=28 face="STKaiti"> 网址收藏 </font>    <!-- {docsify-ignore} -->


https://xhemj.js.org/#/p/How-to-Use-Js-org-Domain?id=%e5%a6%82%e4%bd%95%e5%85%8d%e8%b4%b9%e7%94%b3%e8%af%b7jsorg%e4%ba%8c%e7%ba%a7%e5%9f%9f%e5%90%8d


如何免费申请js.org二级域名
作者：xhemj


最近看到很多人都去申请了js.org的域名，我就来写个教程吧！
（本教程只注重于申请域名，而不是如何使用Github）
看看我的成品：https://xhemj.js.org/
官网是这么写的：

Are you a JavaScript developer looking for free webspace to host your project?
Check out GitHub Pages. 
To make things perfect we provide you with a free and sleek URL as shown in the examples above.
We don't mind whether it's a User-, Organization- or Project-Page - as long as you provide some reasonable content! 
Just follow these four steps to get your own free JS.ORG subdomain for your GitHub Page:
Copy to clipboardErrorCopied
您是JavaScript开发人员吗？，您是否正在寻找免费的网站空间来托管您的项目？
那就看看GitHub Pages吧。
为了使事情变得完美，我们为您提供了一个免费且时尚的域名，如上面的示例所示。
只要您提供一些合理的内容，
我们都不介意是用户页面、组织页面还是项目页面。
您只需按照以下四个步骤为GitHub Pages获取自己的免费JS.ORG子域。
并且js.org还有免费https证书和cdn加速
是不是很心动？

第一步：注册
先去注册一个Github的账号（这边不详细说明）
注册网址：Github.com
注册好后在Repositories旁点击new
信息随便填写（前提你能记住）

第二步：上传
将你的网站(index.html)放入Github
关于Git上传Github的教程欢迎参考https://gitee.com/progit/或https://www.progit.cn/
之后到你自己仓库的Settings里找到GitHub Pages，选择你要部署的分区，可以看到一条

Your site is published at https://xhemj.github.io/
Copy to clipboardErrorCopied
就表示部署成功了，可以访问以下确认部署正确

第三部：Fork仓库
先进入https://github.com/js-org/js.org
点击右上角Fork，fork仓库到你自己的仓库
稍等一会儿刷新就可以看到仓库由js-org/js.org变成了USERNAME/js.org
在自己的仓库里打开cnames_active.js
可以看到里面有上千条别人的域名

第三部：申请
现在先想好你要申请的域名
如：xhemj.js.org
现在浏览器中先访问以下，看看有没有被占用 还好我的还在~
进入cnames_active.js，修改，
将你的域名按照如下格式按照首字母顺序（一定要按照字母顺序）放入相应的行数
比如说我的xhemj.js.org就可以放入第2176行：

"xhemj": "xhemj.github.io/books",
Copy to clipboardErrorCopied
那我们来解释一下：
1."xhemj"表示你要申请的域名，如你要申请xhemj.js.org就填入xhemj
2.:就是一个冒号+空格
3."xhemj.github.io/books"表示你原来网站GithubPages的链接
4.,一定要记得在后面加一个逗号！ 注意：在后面不要加任何注释！（非常重要）
之后返回你的USERNAME/js.org，点击Pull requests，向js.org发送一个申请
内容如下：
标题：你要申请的域名，如：xhemj.js.org
内容：会自动帮你写好，不用更改
内容翻译过来就是：

页面上有合理的内容（请参阅：无内容）
我已阅读并接受条款和条件
Copy to clipboardErrorCopied
肯定接受啊！！
记得回到要申请的仓库里新建CHAME文件，在里面输入你的.js.org域名
之后到https://github.com/js-org/js.org的Pull requests就可以看到你的申请
如下：

一个小建议：因为时差，最好在晚上12点前提交，这样审核人员刚好起床，可以进行审核
之后等待过关后：


就成功啦！！
要是没通过，要注意的是网站不能太简单太难看，最好和js沾点边
一半做博客的都可以过的
没过也必要气馁，继续努力吧

结尾
基本上配置就是这样了！本文当基于官网书写
要是有什么说不到位的欢迎私信我或者发邮件到xhemj2680@163.com哦！
好看就分享一下吧！