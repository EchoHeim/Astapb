### <center> <font size=34 face="STKaiti"> Markdown语法 </font>    <!-- {docsify-ignore} -->

Markdown 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档。

# 1. 标题

示例：

``` text
# 这是一级标题              //一级标题 对应 <h1> </h1>
## 这是二级标题             //二级标题 对应 <h2> </h2>
### 这是三级标题            //三级标题 对应 <h3> </h3>
#### 这是四级标题           //四级标题 对应 <h4> </h4>
##### 这是五级标题          //五级标题 对应 <h5> </h5>
###### 这是六级标题         //六级标题 对应 <h6> </h6>
```

效果：

![image](https://user-images.githubusercontent.com/26021085/163097197-2fcc035c-21ad-4272-bebe-66f33328a04e.png)

# 2. 格式

段落没有特殊的格式，直接编写文字就好，段落的换行是使用两个以上空格加上回车。

## 2.1 字体

示例：

``` text
**这是加粗的文字**
*这是倾斜的文字*
***这是斜体加粗的文字***
~~这是加删除线的文字~~
```

效果：

**这是加粗的文字**

*这是倾斜的文字*

***这是斜体加粗的文字***

~~这是加删除线的文字~~

## 2.2 引用

在引用的文字前加 `>` 即可。引用也可以嵌套，如加两个 `>>` 三个 `>>>`

示例：

``` text
>这是引用的内容
>>这是引用的内容
>>>>>>>>>>这是引用的内容
```

效果：

>这是引用的内容
>>这是引用的内容
>>>>>>>>>>这是引用的内容

## 2.3 分割线

有时候，为了排版漂亮，可能会加入分隔线。

Markdown加入分隔线非常简单，使用三个或者三个以上的 `-` 或者 `*` 都可以。

示例：

``` text
---
----
***
*****
```

效果：

---
----

***

*****

## 2.4 下划线

- 可以通过 HTML 的 `<u>` 标签来实现

示例：

``` text
<u>带下划线文本</u>
```

效果：

<u>带下划线文本</u>


- 也可以使用 `<span>` 标签完成

> 推荐这种方式

示例：下划线为绿色，并且高度为 1px，并且下划线为虚线。

```
<span style="border-bottom:1px dashed green;">所添加的需要加下划线的行内文字</span>
```

效果如下：

<span style="border-bottom:1px dashed green;">所添加的需要加下划线的行内文字</span>

**注意，要实现下划线为实线的话，请把`dashed`修改为`solid`**

效果如下：

<span style="border-bottom:1px solid green;">所添加的需要加下划线的行内文字</span>

## 2.5 高亮显示

```
使用<code>\`</code>来强调字符   //想打出 ` (反引号)需要转义，加<code></code>标签强调
比如`突出背景色`来显示强调效果
```

以上标记显示效果如下：

使用<code>\`</code>来强调字符
比如 `突出背景色` 来显示强调效果

## 2.6 缩进

示例：

``` text
半角空格: &ensp;或 &#8194;
全角空格: &emsp;或 &#8195;
不换行空格: &nbsp;或 &#160;
```

效果：

&nbsp;枯藤老树昏鸦

&ensp;小桥流水人家

&emsp;古道西风瘦马

# 3. 超链接

语法：

``` text
[超链接名](超链接地址 "超链接title")
title是链接的标题，当鼠标移到链接上时显示的内容。title可加可不加。
```

示例：

``` text
[github](https://github.com/ "同性交友网站")

[百度](http://baidu.com)
```

效果：

[github](https://github.com/ "同性交友网站")

[百度](http://baidu.com)

# 4. 图片

语法：

``` text
![图片alt](图片地址 "图片title")

图片alt就是显示在图片下面的文字，相当于对图片内容的解释。
图片title是图片的标题，当鼠标移到图片上时显示的内容。title可加可不加
```

示例：

``` text
![Markdown](https://user-images.githubusercontent.com/26021085/163098139-dc4396fc-92ac-4be2-b74b-ad73f7ef6c39.png)
```

效果：

![Markdown](https://user-images.githubusercontent.com/26021085/163098139-dc4396fc-92ac-4be2-b74b-ad73f7ef6c39.png "Markdown语法")

!> 注： 引用图片和链接的唯一区别就是在最前方添加一个感叹号。

# 5. 视频

* 示例：

```
<video poster="https://notebook.js.org/images/video-poster.png" src="https://cdn.jsdelivr.net/gh/EchoHeim/media/videos/chinaking.mp4" controls width="75%"></video>
```

* 效果：

<video poster="https://notebook.js.org/images/video-poster.png" src="https://cdn.jsdelivr.net/gh/EchoHeim/media/videos/chinaking.mp4" controls width="75%"></video>

另外还可以用iframe的方式嵌入视频

例如

```
<iframe src="//player.bilibili.com/player.html?aid=769494642&bvid=BV1Tr4y1x7SN&cid=731957046&page=1" 
    style="overflow-x:hidden;overflow-y:hidden; border:2xp none #333fff; min-height:270px; min-width:480px; background-color: green;"
    position=center;
    allowTransparency="true" 
    scrolling="no" 
    frameborder="no" 
    framespacing="0" 
    allowfullscreen="true">
</iframe>
```

其中的链接地址是B站视频

获取方式：可以在视频分享按钮中获取链接

效果：

<iframe src="//player.bilibili.com/player.html?aid=769494642&bvid=BV1Tr4y1x7SN&cid=731957046&page=1" 
    style="overflow-x:hidden;overflow-y:hidden; border:2xp none #333fff; min-height:270px; min-width:480px; background-color: green;"
    position=center;
    allowTransparency="true" 
    scrolling="no" 
    frameborder="no" 
    framespacing="0" 
    allowfullscreen="true">
</iframe>

# 6. 列表

## 6.1 无序列表

语法：

无序列表用 `-` `+` `*` 任何一种都可以

示例：

``` text
- 列表内容
+ 列表内容
* 列表内容

注意：- + * 跟内容之间都要有一个空格
```

效果：

- 列表内容

- 列表内容

- 列表内容

## 6.2 有序列表

语法：

数字加点

示例：

``` text
1. 列表内容
2. 列表内容
3. 列表内容

注意：序号跟内容之间要有空格
```

效果：

1. 列表内容
2. 列表内容
3. 列表内容

## 6.3 列表嵌套

语法：

上一级末尾和下一级开头 敲三个空格即可

示例：

``` text
1. 列表内容   
   1. 列表内容   
   2. 列表内容   
2. 列表内容   
   1. 列表内容

注意：序号跟内容之间要有空格
```

效果：

1. 列表内容
   1. 列表内容
   2. 列表内容
2. 列表内容
   1. 列表内容

# 7. 展开列表

您需要在 html 和 markdown 内容之间插入一个空格。这对于在 details 元素中呈现 markdown 内容很有用。

```
<details>
<summary>Self-assessment (Click to expand)</summary>

- Abc
- Abc
</details>
```

<details>
    <summary>Self-assessment (Click to expand)</summary>

- Abc
- Abc
</details>

或者降价内容可以包装在html标记中。

```
<details>
<summary style='color: green'>Self-assessment (Click to expand)</summary>
<div style='color: red'>

- Abc
- Abc
</div>
</details>
```

<details>
    <summary style='color: green'>Self-assessment (Click to expand)</summary>
<div style='color: red'>

- Abc
- Abc
</div>
</details>


# 8. 表格

语法：

制作表格使用 `|` 来分隔不同的单元格，使用 `-` 来分隔表头和其他行，单元格文字默认左对齐，`-` 两边加 `:` 表示文字居中，`-` 右边加 `:` 表示右对齐。

``` text
|  表头   | 表头  | 表头  |
| :-----| ----: | :----: |
| 单元格 | 单元格 | 单元格 |
| 单元格 | 单元格 | 单元格 |

注：`|` 与文字之间要有空格。
```

示例：

``` text
| 姓名 | 武力 | 智力 | 排行 |
| :-:  | :-: | :-:  | :-: | 
| 刘备 | 88 | 92 | 大哥 | 
| 关羽 | 96 | 90 | 二哥 | 
| 张飞 | 98 | 68 | 三弟 | 
```

效果：

| 姓名 | 武力 | 智力 | 排行 |
| :-:  | :-: | :-:  | :-: |
| 刘备 | 88 | 92 | 大哥 |
| 关羽 | 96 | 90 | 二哥 |
| 张飞 | 98 | 68 | 三弟 |

# 9. 代码

Markdown在IT圈子里面比较流行的一个重要原因是，它能够轻松漂亮地插入代码。

语法：

``` text
单行代码：代码之间分别用一个反引号包起来；
代码块：代码之间分别用三个反引号包起来，且两边的反引号单独占一行；可以在前三个反引号后面加上语言种类；
```

效果：

`echo "hello world!";`

``` bash
    function fun(){
         echo "hello world!";
    }
    fun();
```

!> 注：反引号键是在英文模式下，键盘最左侧esc键下面的第一个按键。


> 如何在代码块中打出 \`\`\` ?
> 
> 实际上是使用 4个\` 包含 3个\` 就可以了，想表示更多，最外层+1就好了。 

\`\`\`\` 
\`\`\` 
\`\`\` 
\`\`\`\`


# 10. 高级用法

## 10.1 支持 HTML 元素

支持的 `HTML` 元素有：`<kbd>` `<b>` `<i>` `<em>` `<sup>` `<sub>` `<br>` 等。

示例效果：

使用 <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Del</kbd> 重启电脑

## 10.2 修改图片

1. 设置图片尺寸

在 markdown 直接使用提供的语法引入图片是无法设置大小的，所以我们需要用到 html 的 `img` 标签。

```
<img width="  " alt="描述" src="url"/>
```

2. 设置图片居中

在 markdown 设置图片居中是需要通过 `div` 来控制的。

3. 在 Docsify 中调整图片大小

```
![logo](https://docsify.js.org/_media/icon.svg ':size=WIDTHxHEIGHT')
![logo](https://docsify.js.org/_media/icon.svg ':size=50x100')
![logo](https://docsify.js.org/_media/icon.svg ':size=100')

<!-- Support percentage -->

![logo](https://docsify.js.org/_media/icon.svg ':size=10%')
```

![logo](https://docsify.js.org/_media/icon.svg ':size=WIDTHxHEIGHT')
![logo](https://docsify.js.org/_media/icon.svg ':size=50x100')
![logo](https://docsify.js.org/_media/icon.svg ':size=100')

<!-- Support percentage -->

![logo](https://docsify.js.org/_media/icon.svg ':size=10%')

## 10.3 特殊符号处理

Markdown使用反斜杠\插入语法中用到的特殊符号。在Markdown中，主要有以下几种特殊符号需要处理：

```
\   反斜线
`   反引号
*   星号
_   底线
{}  花括号
[]  方括号
()  括弧
#   井字号
+   加号
-   减号
.   英文句点
!   惊叹号
```

例如，如果你需要插入反斜杠，就连续输入两个反斜杠即可：\ \ => \ 。

注：在内容中输入以上特殊符号的时候一定要注意转义，否则将导致内容显示不全，甚至排版混乱。

重要：MarkDown表格中使用竖线，如何做？

表格中使用竖线	竖线数目

|	一个竖线: & # 1 2 4 ;

||	两个竖线: & # 1 2 4 ; & # 1 2 4 ;


## 10.4 使用 Emoji 表情

举例：

```
Hello EnjoyToShare :smile:
```

效果：

Hello EnjoyToShare  :smile:

> 更多可用 Emoji 代码参见 [emoji-cheat-sheet](https://www.webfx.com/tools/emoji-cheat-sheet/) 和 [emojicopy](https://www.emojicopy.com/)

## 10.5 复选框列表

在列表符号后面加上 `[x]` 或者 `[ ]` 代表`选中`或者`未选中`情况

```
- [ ] content 
-空格[空格]空格content 
解释: [ ]括号里面的空格可以换成[x],代表选中对话框
```

- [x] C
- [x] C++
- [x] Java
- [x] Qt
- [x] Android
- [ ] C#
- [ ] .NET


## 10.6 重要提示

```markdown
!> Time is money, my friend!
```

!> Time is money, my friend!

```markdown
?> Time is money, my friend!
```

?> Time is money, my friend!


## 10.7 支持公式

Markdown Preview Enhanced 使用 KaTeX 或者 MathJax 来渲染数学表达式。

``` text
$...$ 或者 \(...\) 中的数学表达式将会在行内显示。
$$...$$ 或者 \[...\] 或者 ```math 中的数学表达式将会在块内显示。
```

示例效果：

$f(x)=sin(x)+34$

$$
\begin{Bmatrix}
   a & b \\
   c & d
\end{Bmatrix}
$$


<!-- ![video](https://v.qq.com/x/cover/mzc00200cdwdvzc.html ':include') -->




## 11 使用 LaTeX 写矩阵

### 11.1 简单的 Matrix

使用 `\begin{matrix}…\end{matrix}` 来生成矩阵，其中`...` 表示的是 *LaTeX*  的矩阵命令，矩阵命令中每一行以 `\\` 结束，矩阵的元素之间用`&`来分隔开。

* Example 01：

```js
  \begin{matrix}
   1 & 2 & 3 \\
   4 & 5 & 6 \\
   7 & 8 & 9
  \end{matrix} \tag{1}
```

### 11.2 带括号的 Matrix

感觉 11.1 中的矩阵不是很美观，可以给矩阵加上括号，加括号的方式有很多，大致可分为两种：使用 `\left ... \right`  或者把公式命令中的 `matrix`  改成  `pmatrix`、`bmatrix`、`Bmatrix`、`vmatrix`、`Vmatrix `等。

* 使用 `\left ... \right` 

  * { ... }

    * Example 02：

    * ```js
       \left\{
       \begin{matrix}
         1 & 2 & 3 \\
         4 & 5 & 6 \\
         7 & 8 & 9
        \end{matrix}
        \right\} \tag{2}
      ```
    
  * [ ... ]

    * Example 03：

    * ```js
     \left[
       \begin{matrix}
         1 & 2 & 3 \\
         4 & 5 & 6 \\
         7 & 8 & 9
        \end{matrix}
        \right] \tag{3}
      ```
  
* 替换 `matrix` 

  * [ ... ]

    * Example 04：

    * ```js
       \begin{bmatrix}
         1 & 2 & 3 \\
         4 & 5 & 6 \\
         7 & 8 & 9
        \end{bmatrix} \tag{4}
      ```
    
  * { ... }

    * Example 05：

    * ```js
      \begin{Bmatrix}
         1 & 2 & 3 \\
           4 & 5 & 6 \\
           7 & 8 & 9
          \end{Bmatrix} \tag{5}
      ```

### 11.3 带省略号的Matrix

如果矩阵元素太多，可以使用 `\cdots` ⋯⋯ `\ddots` ⋱⋱ `\vdots` ⋮⋮  等省略符号来定义矩阵。

* Example 06：

* ```js
  \left[
  \begin{matrix}
   1      & 2      & \cdots & 4      \\
   7      & 6      & \cdots & 5      \\
   \vdots & \vdots & \ddots & \vdots \\
   8      & 9      & \cdots & 0      \\
  \end{matrix}
  \right]
  ```


### 11.4 带参数的 Matrix

比如写增广矩阵，可能需要最右边一列单独考虑。可以用`array`命令来处理：

* Example 07：

* ```js
  \left[
      \begin{array}{cc|c}
        1 & 2 & 3 \\
        4 & 5 & 6
      \end{array}
  \right] \tag{7}
  ```


其中`\begin{array}{cc|c}`中的 c 表示居中对齐元素,`|` 用来作为分割列的符号。

### 11.5 行间矩阵

可以使用`\bigl(\begin{smallmatrix} ... \end{smallmatrix}\bigr)`，

* Example 08：

* ```js
  \bigl(
  \begin{smallmatrix} 
  a & b \\ 
  c & d 
  \end{smallmatrix} 
  \bigr)
  ```
  