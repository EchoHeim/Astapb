---
title: Jupyter添加目录toc
date: 2022-06-23
tags: [Python, Anaconda]
summary: 最近在使用Jupyter notebook的时候感觉到，没有个目录真心难受，当想查找需要的函数的时候，不能很快速的找到，这个时候，要是有个目录就好很多了，很不幸的是，默认Jupyter noteboo…
---
最近在使用Jupyter notebook的时候感觉到，没有个目录真心难受，当想查找需要的函数的时候，不能很快速的找到，这个时候，要是有个目录就好很多了，很不幸的是，默认Jupyter notebook事没有生成目录这个功能的，但很巧的是，有人已经开发了Jupyter插件，里面包含toc目录功能，开森 🦞

效果图如下：

![](https://gitee.com/wugenqiang/images/raw/master/image/1642479837612.png)

同时toc目录的大小和位置可以随意改变，也支持对每个标题自动编号，默认的就挺好哈哈哈。

> 如何安装呢？

第一步：安装Jupyter notebook

这个不用说应该都安装了吧，数据分析特别好用的工具，没有之一。

第二步：安装Jupyter notebook extensions

```shell
conda install -c conda-forge jupyter_contrib_nbextensions
```

第三步：开启toc插件

重新运行Jupyter notebook，会发现，多了Nbextensions按钮，点击这个tab，按照下图操作：

![](/Users/wugenqiang/Downloads/images/002.png)

注意：旧版本可能不支持，试试把disable configuration那行前面的✅取消掉再试试，我就是遇到这个问题。

第四步：生成目录

创建或者打开一个Jupyter notebook，会发现，多了一个生成目录图标，同时左侧已经支持了目录显示。

![](/Users/wugenqiang/Downloads/images/003.png)



📚 Reference

[1] https://zhuanlan.zhihu.com/p/24029578/

[2] https://github.com/ipython-contrib/jupyter_contrib_nbextensions

[3] https://jupyter-contrib-nbextensions.readthedocs.io/en/latest/install.html