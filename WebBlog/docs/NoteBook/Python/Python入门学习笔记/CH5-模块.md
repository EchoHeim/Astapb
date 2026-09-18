---
title: 第五章 模块
date: 2022-06-23
tags: [Python, Python 入门]
summary: 我们知道，一个文件里代码越来越长的时候，就会越来越不容易维护。
---
我们知道，一个文件里代码越来越长的时候，就会越来越不容易维护。

为了编写可维护的代码，我们把很多函数分组，分别放到不同的文件里，这样，每个文件包含的代码就相对较少，很多编程语言都采用这种组织代码的方式。在 Python 中，一个 .py 文件就称之为一个模块（Module）。

> 🎉 使用模块有什么好处？

* （1）最大的好处是大大提高了代码的可维护性。
* （2）其次，编写代码不必从零开始。当一个模块编写完毕，就可以被其他地方引用。我们在编写程序的时候，也经常引用其他模块，包括 Python 内置的模块和来自第三方的模块。

* （3）使用模块还可以避免函数名和变量名冲突。相同名字的函数和变量完全可以分别存在不同的模块中，
* （4）因此，我们自己在编写模块时，不必考虑名字会与其他模块冲突。但是也要注意，尽量不要与内置函数名字冲突。点[这里](http://docs.python.org/3/library/functions.html)查看Python的所有内置函数。

你也许还想到，如果不同的人编写的模块名相同怎么办？为了避免模块名冲突，Python 又引入了按目录来组织模块的方法，称为包（Package）。

举个例子，一个`abc.py`的文件就是一个名字叫`abc`的模块，一个`xyz.py`的文件就是一个名字叫`xyz`的模块。

现在，假设我们的`abc`和`xyz`这两个模块名字与其他模块冲突了，于是我们可以通过包来组织模块，避免冲突。方法是选择一个顶层包名，比如`mycompany`，按照如下目录存放：

```python
mycompany
├─ __init__.py
├─ abc.py
└─ xyz.py
```

引入了包以后，只要顶层的包名不与别人冲突，那所有模块都不会与别人冲突。现在，`abc.py`模块的名字就变成了`mycompany.abc`，类似的，`xyz.py`的模块名变成了`mycompany.xyz`。

请注意，每一个包目录下面都会有一个`__init__.py`的文件，这个文件是必须存在的，否则，Python 就把这个目录当成普通目录，而不是一个包。`__init__.py`可以是空文件，也可以有 Python 代码，因为`__init__.py`本身就是一个模块，而它的模块名就是`mycompany`。

类似的，可以有多级目录，组成多级层次的包结构。比如如下的目录结构：

```python
mycompany
 ├─ web
 │  ├─ __init__.py
 │  ├─ utils.py
 │  └─ www.py
 ├─ __init__.py
 ├─ abc.py
 └─ utils.py
```

文件`www.py`的模块名就是`mycompany.web.www`，两个文件`utils.py`的模块名分别是`mycompany.utils`和`mycompany.web.utils`。

!> 自己创建模块时要注意命名，不能和 Python 自带的模块名称冲突。例如，系统自带了 sys 模块，自己的模块就不可命名为 sys.py，否则将无法导入系统自带的 sys 模块。

> 总结：

模块是一组 Python 代码的集合，可以使用其他模块，也可以被其他模块使用。

创建自己的模块时，要注意：

- 模块名要遵循 Python 变量命名规范，不要使用中文、特殊字符；
- 模块名不要和系统模块名冲突，最好先查看系统是否已存在该模块，检查方法是在 Python 交互环境执行`import abc`，若成功则说明系统存在此模块。

## 5.1 使用模块

Python 本身就内置了很多非常有用的模块，只要安装完毕，这些模块就可以立刻使用。

我们以内建的`sys`模块为例，编写一个`hello`的模块：

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

' a test module '

__author__ = 'WuGenQiang'

import sys

def test():
    args = sys.argv
    if len(args)==1:
        print('Hello, world!')
    elif len(args)==2:
        print('Hello, %s!' % args[1])
    else:
        print('Too many arguments!')

if __name__=='__main__':
    test()
```

第 1 行和第 2 行是标准注释，第 1 行注释可以让这个`hello.py`文件直接在 Unix/Linux/Mac 上运行，第 2 行注释表示 .py 文件本身使用标准 UTF-8 编码；

第 4 行是一个字符串，表示模块的文档注释，任何模块代码的第一个字符串都被视为模块的文档注释；

第 6 行使用`__author__`变量把作者写进去，这样当你公开源代码后别人就可以瞻仰你的大名；

以上就是 Python 模块的标准文件模板，当然也可以全部删掉不写，但是，按标准办事肯定没错。

后面开始就是真正的代码部分。

你可能注意到了，使用`sys`模块的第一步，就是导入该模块：

```python
import sys
```

导入`sys`模块后，我们就有了变量`sys`指向该模块，利用`sys`这个变量，就可以访问`sys`模块的所有功能。

`sys`模块有一个`argv`变量，用 list 存储了命令行的所有参数。`argv`至少有一个元素，因为第一个参数永远是该 .py 文件的名称，例如：

运行`python3 hello.py`获得的`sys.argv`就是`['hello.py']`；

运行`python3 hello.py WuGenQiang`获得的`sys.argv`就是`['hello.py', 'WuGenQiang']`。

最后，注意到这两行代码：

```python
if __name__=='__main__':
    test()
```

当我们在命令行运行`hello`模块文件时，Python 解释器把一个特殊变量`__name__`置为`__main__`，而如果在其他地方导入该`hello`模块时，`if`判断将失败，因此，这种`if`测试可以让一个模块通过命令行运行时执行一些额外的代码，最常见的就是运行测试。

我们可以用命令行运行`hello.py`看看效果：

```python
$ python3 hello.py
Hello, world!
$ python hello.py WuGenQiang
Hello, WuGenQiang!
```

如果启动 Python 交互环境，再导入`hello`模块：

```pythoon
$ python3
Python 3.4.3 (v3.4.3:9b73f1c3e601, Feb 23 2015, 02:52:03) 
[GCC 4.2.1 (Apple Inc. build 5666) (dot 3)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> import hello
>>>
```

导入时，没有打印`Hello, word!`，因为没有执行`test()`函数。

调用`hello.test()`时，才能打印出`Hello, word!`：

```python
>>> hello.test()
Hello, world!
```

### 5.1.1 作用域

在一个模块中，我们可能会定义很多函数和变量，但有的函数和变量我们希望给别人使用，有的函数和变量我们希望仅仅在模块内部使用。在 Python 中，是通过`_`前缀来实现的。

正常的函数和变量名是公开的（public），可以被直接引用，比如：`abc`，`x123`，`PI`等；

类似`__xxx__`这样的变量是特殊变量，可以被直接引用，但是有特殊用途，比如上面的`__author__`，`__name__`就是特殊变量，`hello`模块定义的文档注释也可以用特殊变量`__doc__`访问，我们自己的变量一般不要用这种变量名；

类似`_xxx`和`__xxx`这样的函数或变量就是非公开的（private），不应该被直接引用，比如`_abc`，`__abc`等；

之所以我们说，private 函数和变量“不应该”被直接引用，而不是“不能”被直接引用，是因为 Python 并没有一种方法可以完全限制访问 private 函数或变量，但是，从编程习惯上不应该引用 private 函数或变量。

private 函数或变量不应该被别人引用，那它们有什么用呢？请看例子：

```python
def _private_1(name):
    return 'Hello, %s' % name

def _private_2(name):
    return 'Hi, %s' % name

def greeting(name):
    if len(name) > 3:
        return _private_1(name)
    else:
        return _private_2(name)
```

我们在模块里公开`greeting()`函数，而把内部逻辑用 private 函数隐藏起来了，这样，调用`greeting()`函数不用关心内部的 private 函数细节，这也是一种非常有用的代码封装和抽象的方法，即：

外部不需要引用的函数全部定义成 private，只有外部需要引用的函数才定义为 public。

## 5.2 安装第三方模块

在 Python 中，安装第三方模块，是通过包管理工具 pip 完成的。

在命令提示符窗口下尝试运行`pip`，如果 Windows 提示未找到命令，可以重新运行安装程序添加`pip`。

注意：Mac 或 Linux上有可能并存 Python 3.x 和 Python 2.x，因此对应的 pip 命令是`pip3`。

例如，我们要安装一个第三方库——Python Imaging Library，这是 Python 下非常强大的处理图像的工具库。不过，PIL 目前只支持到 Python 2.7，并且有年头没有更新了，因此，基于 PIL 的 Pillow 项目开发非常活跃，并且支持最新的 Python 3。

一般来说，第三方库都会在 Python 官方的[pypi.python.org](https://pypi.python.org/)网站注册，要安装一个第三方库，必须先知道该库的名称，可以在官网或者 pypi 上搜索，比如 Pillow 的名称叫[Pillow](https://pypi.python.org/pypi/Pillow/)，因此，安装 Pillow 的命令就是：

```python
pip install Pillow
```

耐心等待下载并安装后，就可以使用 Pillow 了。

![image-20200720224346246](https://gitee.com/wugenqiang/PictureBed/raw/master/images01/20200720224716.png)

### 5.2.1 安装常用模块

在使用 Python 时，我们经常需要用到很多第三方库，例如，上面提到的 Pillow，以及 MySQL 驱动程序，Web 框架 Flask，科学计算 Numpy 等。用 pip 一个一个安装费时费力，还需要考虑兼容性。我们推荐直接使用[Anaconda](https://www.anaconda.com/)，这是一个基于 Python 的数据处理和科学计算平台，它已经内置了许多非常有用的第三方库，我们装上 Anaconda，就相当于把数十个第三方模块自动安装好了，非常简单易用。

可以从[Anaconda官网](https://www.anaconda.com/download/)下载GUI安装包，安装包有 500~600M，所以需要耐心等待下载。下载后直接安装，Anaconda 会把系统 Path 中的 python 指向自己自带的 Python，并且，Anaconda 安装的第三方模块会安装在 Anaconda 自己的路径下，不影响系统已安装的 Python 目录。

安装好 Anaconda 后，重新打开命令行窗口，输入 python，可以看到 Anaconda 的信息：

![image-20200720225025797](https://gitee.com/wugenqiang/PictureBed/raw/master/images01/20200720225032.png)

可以尝试直接`import numpy`等已安装的第三方模块。

### 5.2.2 模块搜索路径

当我们试图加载一个模块时，Python 会在指定的路径下搜索对应的 .py 文件，如果找不到，就会报错：

```python
>>> import mymodule
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ImportError: No module named mymodule
```

默认情况下，Python 解释器会搜索当前目录、所有已安装的内置模块和第三方模块，搜索路径存放在`sys`模块的`path`变量中：

```python
>>> import sys
>>> sys.path
['', '/Library/Frameworks/Python.framework/Versions/3.6/lib/python36.zip', '/Library/Frameworks/Python.framework/Versions/3.6/lib/python3.6', ..., '/Library/Frameworks/Python.framework/Versions/3.6/lib/python3.6/site-packages']
```

如果我们要添加自己的搜索目录，有两种方法：

一是直接修改`sys.path`，添加要搜索的目录：

```python
>>> import sys
>>> sys.path.append('/Users/michael/my_py_scripts')
```

这种方法是在运行时修改，运行结束后失效。

第二种方法是设置环境变量`PYTHONPATH`，该环境变量的内容会被自动添加到模块搜索路径中。设置方式与设置Path 环境变量类似。注意只需要添加你自己的搜索路径，Python 自己本身的搜索路径不受影响。

## 5.3 标准库的使用

**Python 计算生态 = 标准库 + 第三方库**

* 标准库：随解释器直接安装到操作系统中的功能模块。
* 第三方库：需要经过安装才能使用的功能模块。
* 库 Library、包 Package、模块 Module，统称模块



### 5.3.1 turtle 库

####  ① 实例：Python 蟒蛇绘制

> 用程序绘制一条蟒蛇。

```python
#PythonDraw.py
import turtle
turtle.setup(650,350,200,200)
turtle.penup()
turtle.fd(-250)
turtle.pendown()
turtle.pensize(25)
turtle.pencolor("purple")
turtle.seth(-40)
for i in range(4):
    turtle.circle(40,80)
    turtle.circle(-40,80)
turtle.circle(40,80/2)
turtle.fd(40)
turtle.circle(16,180)
turtle.fd(40*2/3)
turtle.done()
```

效果：

![Sep-122-2020 09-31-22](https://gitee.com/wugenqiang/images/raw/master/01/Sep-122-2020%2009-31-22.gif)

> ☎️ 拓展：

`import turtle` 是程序的关键，import 保留字引入了一个绘图库：turtle（海龟库）

#### ② turtle 库基本介绍

turtle 库是 turtle 绘图体系的 Python 实现。

* turtle 绘图体系：1969 年诞生，主要用于程序设计
* Python 语言的标准库之一
* 入门级的图形绘制函数库



#### ③ turtle 绘图窗体布局

Turtle 的绘图窗体，是 turtle 的一个画布空间，最小单位是像素。

`setup()`设置窗体的大小及位置。

```python
turtle.setup(width,height,startx,starty)
```

其中，4 个参数中后两个可选。



![窗体](https://gitee.com/wugenqiang/images/raw/master/01/image-20200922105804423.png)





#### ④ turtle 空间坐标体系

![坐标系](https://gitee.com/wugenqiang/images/raw/master/01/image-20200922105911223.png)



![image-20200922110047817](https://gitee.com/wugenqiang/images/raw/master/01/image-20200922110047817.png)



![这个好](https://gitee.com/wugenqiang/images/raw/master/01/image-20200922110214059.png)

#### ⑤ turtle 角度坐标体系

![image-20200922110403533](https://gitee.com/wugenqiang/images/raw/master/01/image-20200922110403533.png)

改变运行角度：

![image-20200922110505608](https://gitee.com/wugenqiang/images/raw/master/01/image-20200922110505608.png)

> 小例子：

![image-20200922110548219](https://gitee.com/wugenqiang/images/raw/master/01/image-20200922110548219.png)



#### ⑥ RGB 色彩体系

由三种颜色构成的万物色

* RGB 指`红蓝绿`三个通道的颜色组合
* 覆盖视力所能感知的所有颜色
* RGB 每色取值范围 0～255 整数或 0-1 小数

![image-20200922111016351](https://gitee.com/wugenqiang/images/raw/master/01/image-20200922111016351.png)

![image-20200922125919301](https://gitee.com/wugenqiang/images/raw/master/01/image-20200922125919301.png)

**默认采用小数值，可切换为整数值**

```python
turtle.colormode(mode)
```

* 1.0：RGB 小数值模式
* 255：RGB 整数值模式

#### ⑦ turtle 程序语法元素分析

（1）库引用和 import

**库引用**：扩充 Python 程序功能的方式

使用 import 保留字完成，采用 `<a>.<b>()` 编码风格

使用方法：

```python
import <库名>
<库名>.<函数名>(<函数参数>)
```

> 其他 import 用法：

使用 from 和 import 保留字共同完成：

```python
from <库名> import <函数名>
from <库名> import *
<函数名>(<函数参数>)
```

🐹 两种方法比较：

![比较](https://gitee.com/wugenqiang/images/raw/master/01/image-20200922131657337.png)

所以，推荐使用下面的 import 用法：

**使用 import 和 as 保留字共同完成**

```python
import <库名> as <库别名>
<库别名>.<函数名>(<函数参数>)
```

> 好处：

* 给调用的外部库关联一个更短、更适合自己的名字。

（2）画笔控制函数

**画笔操作后一直有效，一般成对出现**

`turtle.penup()` 别名 `turtle.pu()`

抬起画笔，海龟在飞行

`turtle.pendown()` 别名 `turtle.pd()`



**画笔设置后一直有效，直至下次重新设置**

`turtle.pensize()` 别名 `turtle.width(width)`

画笔宽度，海龟的腰围。

`turtle.pencolor(color)` color 为颜色字符串或 r,g,b 值

画笔颜色，海龟在涂装

（3）运动控制函数

**控制海龟行进：走直线 & 走曲线**

`turtle.forward(d)` 别名 `turtle.fd(d)`

向前行进，海龟走直线

`d`：行进距离，可以为负数

`turtle.circle(r,extent=None)`

根据半径 r 绘制 extent 角度的弧形

`r`：默认圆心在海龟左侧 r 距离的位置

`extent`：绘制角度，默认是 360 度整圆

> 举例：

![image-20200923112538907](https://gitee.com/wugenqiang/images/raw/master/01/image-20200923112538907.png)

（4）方向控制函数

**控制海龟面对方向：绝对角度 & 海龟角度**

`turtle.setheading(angle)` 别名 `turtle.seth(angle)`

改变行进方向，海龟走角度

`angle`：改变行进方向，海龟走角度



## 5.4 参考资料

* [廖雪峰 - Python 3.x - 模块](https://www.liaoxuefeng.com/wiki/1016959663602400/1017454145014176)
* [Python 语言程序设计 - 北京理工大学](https://www.icourse163.org/learn/BIT-268001?tid=1460270441#/learn/content)