---
title: 6 小时 Python 入门
date: 2022-06-23
tags: [Python]
summary: 以下操作均在 Windows 环境下进行操作，先说明一下哈
---
> 以下操作均在 Windows 环境下进行操作，先说明一下哈

## 一、安装 Python

1、官网下载 Python

进入官网（[https://www.python.org](https://www.python.org/)），点击 Downloads，选择要下载的版本：

![image-20200517223148826](https://gitee.com/wugenqiang/PictureBed/raw/master/NoteBook/20200517223149.png)

2、安装 Python

安装时注意下图勾选部分一定要勾选：

![image-20200517223527044](https://gitee.com/wugenqiang/PictureBed/raw/master/NoteBook/20200517223528.png)



## 二、安装代码编辑器 PyCharm

1、官网下载 PyCharm

进入官网（[https://www.jetbrains.com/pycharm](https://www.jetbrains.com/pycharm/)），点击 Downloads，选择要下载的版本：

![image-20200517223348661](https://gitee.com/wugenqiang/PictureBed/raw/master/NoteBook/20200517223349.png)

2、安装 PyCharm

设置安装路径之后，一直点 next 即可。

![image-20200517224622654](https://gitee.com/wugenqiang/PictureBed/raw/master/NoteBook/20200517224624.png)

3、优化 PyCharm 使用

* [PyCharm 优化使用](Python/PyCharm优化使用.md)

## 三、HelloWorld

创建第一个项目 HelloWorld --> 创建文件 app.py --> 写入代码：

```python
print("HelloWorld")
```



效果图：

![image-20200517225658342](https://gitee.com/wugenqiang/PictureBed/raw/master/NoteBook/20200517225659.png)

## 四、Python 语法

看语法部分之前，推荐直接看下面入门练习题，潜移默化中对 Python 基本语法会有一定了解之后，再回来看这一部分，会更加熟悉 Python 的使用！

* [Python 语法使用要熟记于心](Python/Python语法.md)



## 五、入门练习题

### 1.打印 10 个 *

> 使用到表达式

```python
print('*' * 10)
```

### 2.打印价格

> 使用到变量

```python
price = 10
print(price)
```

### 3.描述医院病人的信息

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
@Time        : 2020/5/18
@Author      : WuGenQiang
@File        : hospital
@Description : 描述医院病人的信息
"""
full_name = 'John Smith'
age = 20
is_new = True
```

### 4.接收用户输入，打印问候信息

> 使用输入函数 input() 进行输入

```python
name = input('what is your name?')
print('Hi ' + name)
```

测试：

![image-20200518092805760](https://gitee.com/wugenqiang/PictureBed/raw/master/NoteBook/20200518092806.png)

### 5.打印年龄

> 使用到强制类型转换

```python
birth_year = input('Birth year: ')
age = 2019 - int(birth_year)
print(age)
```

使用 type() 打印数据类型：

```python
print(type(birth_year))
```

### 6.字符串打印

> 三种字符串表达形式

```python
course_1 = 'Python for "Beginners"'
print(course_1)
course_2 = "Python is my 'love'"
print(course_2)
course_3 = '''
Hi John
welcome to python world!
'''
print(course_3)
```

效果呈现：

![image-20200518100439122](https://gitee.com/wugenqiang/PictureBed/raw/master/NoteBook/20200518100440.png)

获取 course_1 的第一个索引值：

```python
print(course_1[0])
```

获取 course_1 的最后一个索引值：

```python
print(course_1[-1])
```

那么获取倒数第二个索引值呢：

```python
print(course_1[-2])
```

返回索引为 0 - 2 的值：

```python
print(course_1[0:3])
```

返回索引 0 以及 0 之后的所有字符：

```python
print(course_1[0:])
```

返回索引小于 5 的所有字符：

```python
print(course_1[:5])
```

返回所有字符：

```python
print(course_1[:])
```

返回从第 2 位开始，不包括最后一位字符的字符串：

```python
print(course_1[1:-1])
```

### 7.格式化字符串

```python
first = 'WuGenQiang'
last = 'happy'
# 字符串拼接
message = first + ' [' + last + '] is a coder'
# 格式化字符串
msg = f'{first} [{last}] is a coder'
print(message)
print(msg)
```

### 8.字符串方法使用

（1）len() 函数：求字符串长度

```python
course = 'Python for Beginners'
# 字符串长度
print(len(course))
```

（2）upper() 函数：转换成大写字母

```python
# 转换成大写字母
print(course.upper())
```

（3）lower() 函数：转换成小写字母

```python
# 转换成小写字母
print(course.lower())
```

（4）find() 函数

```python
# 找字符返回第一个匹配的索引值
print(course.find('n'))
```

找不到返回 -1，并且区分大小写

（5）replace() 函数

```python
# 替换字符
print(course.replace('Beginners', 'Absolute Beginners'))
```

（6）in 使用：产生布尔值 False or True

```python
# 判断字符串是否在字符串里
print('Python' in course)
```

### 9.算术运算符

举例：

```python
print(10 / 3)
print(10 % 3)
print(10 * 3)
# 10 的 3 次方
print(10 ** 3)

x = 10
x = x + 3
x += 3
print(x)
```

思索下面 x 为多少：

```python
x = 10 + 3 * 2 ** 2
```

答案是 22，因为取幂运算符是优先的，所以先算 2 的 2 次方

* 取绝对值

```python
print(abs(-2.9))
```

### 10.引入数学模块

```python
import math
print(math.floor(2.9))
```

### 11.条件语句的使用

> 使用 if - elif - else

```python
is_hot = False
is_cold = True
if is_hot:
    print("It's a hot day")
elif is_cold:
    print("It's a cold day")
else:
    print("It's a lovely day")
print("Enjoy your day")
```

当条件多个并且是 "and" 的关系时，使用：

```python
has_high_income = True
has_good_credit = True
if has_good_credit and has_high_income:
    print("Eligible for loan")
```

若当条件多个并且是 "or" 的关系时，使用：

```python
has_high_income = False
has_good_credit = True
if has_good_credit or has_high_income:
    print("Eligible for loan")
```

如何使用 "not"，看下面：(not 相当于取反)

```python
has_good_credit = True
has_criminal_record = False
if has_good_credit and not has_criminal_record:
    print("Eligible for loan")
```

### 12.打印天气

> 使用比较运算符

```python
temperature = 30
if temperature > 30:
    print("It's a hot day")
else:
    print("It's a cold day")
```

### 13.打印名字是否符合要求

> 使用比较运算符

```python
name = "James"
if len(name) < 3:
    print("Name must be at least 3 character")
elif len(name) > 50:
    print("Name must be a maximum of 50 character")
else:
    print("Name looks good")
```

### 14.判断体重

```python
weight = int(input('weight: '))
unit = input('(L)bs or (K)g: ')
if unit.upper() == "L":
    converted = weight * 0.45
    print(f"You are {converted} kilos")
else:
    converted = weight / 0.45
    print(f"You are {converted} pounds")
```

### 15.打印 1 - 5

> 使用到 while 循环语句或者 for 循环语句

```python
i = 1
while i <= 5:
    print(i)
    i = i + 1
print("Done")
```

### 16.猜数（秘密号码）

```python
secret_number = 9
guess_count = 0
guess_limit = 3
while guess_count < guess_limit:
    guess = int(input('Guess: '))
    guess_count += 1
    if guess == secret_number:
        print('You won!')
        break
else:
    print('Sorry, you failed')
```



### 17.Car game

```python
command = ""
started = False

while True:
    command = input("> ").lower()
    if command == "start":
        if started:
            print("Car is already started!")
        else:
            started = True
            print("Car started...")
    elif command == "stop":
        if not started:
            print("Car is already stopped!")
        else:
            started = False
            print("Car stopped.")
    elif command == "help":
        print("""
        start - to start the car
        stop - to stop the car
        quit - to quit
        """)
    elif command == "quit":
        break
    else:
        print("Sorry, I don't understand that!")
```

### 18.for 循环使用

```python
# 打印 Python
for item in 'Python':
    print(item)

for item in ['Mosh', 'John', 'Sarah']:
    print(item)

for item in [1, 2, 3, 4]:
    print(item)

# 使用范围函数 range, range(10) 表示 0 - 9
for item in range(10):
    print(item)
# range(5, 10) 表示 5 - 9
for item in range(5, 10):
    print(item)
# range(5, 10, 2) 表示 5 - 9, 但是 step = 2
for item in range(5, 10, 2):
    print(item)
```

### 19.计算价格总量

> 使用到 for 循环

```python
prices = [10, 20, 30]
total = 0
for price in prices:
    total += price
print(f"Total: {total}")
```

### 20.嵌套循环

```python
for x in range(4):
    for y in range(3):
        print(f'({x}, {y})')
```

**画个大大的 "F"**

* 方式一：

```python
numbers = [5, 2, 5, 2, 2]
for x_count in numbers:
    print('x' * x_count)
```

* 方式二：

```python
numbers = [5, 2, 5, 2, 2]
for x_count in numbers:
    output = ''
    for count in range(x_count):
        output += 'x'
    print(output)
```

### 21.List

```python
names = ['John', 'Bob', 'Mosh', 'Sarah', 'Mary']
print(names)
print(names[:])
print(names[2:])
# 输出第一个索引值
print(names[0])
# 输出最后一个索引值
print(names[-1])
```

### 22.List 中找最大值

```python
numbers = [3, 6, 2, 8, 4, 10]
max = numbers[0]
for number in numbers:
    if number > max:
        max = number
print(max)
```

### 23.访问矩阵中的各项

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
matrix[0][1] = 20
print(matrix[0][1])
for row in matrix:
    for item in row:
        print(item)
```

### 24.数组中常用函数调用

```python
numbers = [5, 2, 1, 7, 4]
# 排序(升序)
numbers.sort()
# 逆序
numbers.reverse()
print(numbers)
# 复制拷贝
numbers2 = numbers.copy()
print(numbers2)
# 移除 1
numbers.remove(1)
# 清空
numbers.clear()
# 末尾加入 20
numbers.append(20)
# 在特定位置插入 12
numbers.insert(0, 12)
# 末尾删除
numbers.pop()
# 返回 5 的索引地址
print(numbers.index(12))
print(numbers)
# 输出 50 是否在 numbers 中
print(50 in numbers)
# 输出数字的数量
print(numbers.count(12))
```

* 末尾加入数据

```python
numbers = [2, 2, 4, 6, 3, 4, 6, 1]
uniques = []
for number in numbers:
    if number not in uniques:
        uniques.append(number)
print(uniques)
```

### 25.元组

```python
numbers = (1, 2, 3)
print(numbers[0])
```

注意：

```python
coordinates = (1, 2, 3)
# x = coordinates[0]
# y = coordinates[1]
# z = coordinates[2]
# 与上面相同结果
x, y, z = coordinates
print(x)
```

### 26.使用字典

* 案例

```python
customer = {
    "name": "John Smith",
    "age": 30,
    "is_verified": True
}
customer["name"] = "Jack Smith"
print(customer["name"])
print(customer.get("name"))
print(customer.get("host", "123.12.1.1"))
```

* 读号码

```python
phone = input("Phone: ")
digits_mapping = {
    "1": "One",
    "2": "Two",
    "3": "Three",
    "4": "Four",
    "5": "Five"
}
output = ""
for ch in phone:
    output += digits_mapping.get(ch, "!") + " "
print(output)
```

### 27.输出表情符号

```python
message = input("> ")
words = message.split(' ')
# 调用表情符号
emojis = {
    ":)": "😄",
    ":(": "😣"
}
output = ""
for word in words:
    output += emojis.get(word, word) + " "
print(output)
```

使用函数：

```python
# !/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
@Time        : 2020/5/20
@Author      : WuGenQiang
@File        : testList
@Description : 
"""
def emoji_converter(message):
    words = message.split(' ')
    # 调用表情符号
    emojis = {
        ":)": "😄",
        ":(": "😣"
    }
    output = ""
    for word in words:
        output += emojis.get(word, word) + " "
    return output
message = input("> ")
result = emoji_converter(message)
print(result)
```



### 28.函数

* 先定义函数，然后才能使用：

```python
def greet_user():
    print('Hi, function!')

print("Start")
greet_user()
print("Finished")
```

* 传参：

```python
def greet_user(name):
    print(f'Hi, {name}')

print("Start")
greet_user("John")
print("Finished")
```

* 打印数的平方

```python
def square(number):
    return number * number

result = square(3)
print(result)
```



### 29.异常处理

* 出现异常，打印错误信息

```python
try:
    age = int(input('Age: '))
    income = 20000
    risk = income / age
    print(age)
except ZeroDivisionError:
    print('Age cannot be 0.')
except ValueError:
    print('Invalid value')
```

### 30.注释

```python
# 这是注释：print Sky is blue
print('Sky is blue')

# 计算和返回数的平方
def square(number):
    return number * number
```

### 31.类的使用

* 示例 1：

```python
class Point:
    # 初始化
    def __init__(self, x, y):
        self.x = x
        self.y = y
    def move(self):
        print("move")
    def draw(self):
        print("draw")
# point1 = Point()
# point1.draw()
point2 = Point(10, 20)
# point2.x = 20
print(point2.x)
```

* 示例 2：

```python
class Person:
    def __init__(self, name):
        self.name = name
    def talk(self):
        print(f"Hi, I am {self.name}")

# john = Person()
# john.talk()
john = Person("John Smith")
john.talk()

bob = Person("Bob Smith")
bob.talk()
```

### 32.继承的使用

```python
# 继承性讲解
class Mammal:
    # Mammal: 哺乳动物
    def walk(self):
        print("walk")


class Dog(Mammal):
    def bark(self):
        print("bark")

class Cat(Mammal):
    pass

dog1 = Dog()
dog1.walk()
dog1.bark()
```

### 33.调用模块使用

先创建 converters.py：

```python
def lbs_to_kg(weight):
    return weight * 0.45
def kg_to_lbs(weight):
    return weight / 0.45
```

然后在需要调用的 py 文件中这样写：

```python
import converters
print(converters.kg_to_lbs(70))
```

初步实现，然后根据需求完成自己的项目吧！

### 34.从整个模块中导入特定的函数

不需要模块名作为前缀

```python
# import converters
from converters import kg_to_lbs
print(kg_to_lbs(100))
```

由此，我们可以为之前写的一些功能实现写一个工具文件，包含着各种要实现的功能函数：

比如这样：

举例：实现求最大数

* （1）创建 utils.py 工具文件，写入：

```python
def find_max(numbers):
    max = numbers[0]
    for number in numbers:
        if number > max:
            max = number
    return max
```

* （2）调用使用：

```python
# import utils
from utils import find_max
numbers = [10, 3, 6, 2]
print(find_max(numbers))
```

### 35.从包中导入特定的函数

举例：

创建 Python 包 ecommerce，包中创建文件 shhipping.py，如下：

```python
def calc_shipping():
    print("calc shipping")
```

调用：

* 第一种方式：

```python
import ecommerce.shipping
ecommerce.shipping.calc_shipping()
```

* 第二种方式：

```python
from ecommerce.shipping import calc_shipping
calc_shipping()
```

* 第三种方式：

```python
from ecommerce import shipping
shipping.calc_shipping()
```

### 36.生成随机值

* 举例 1：

```python
import random
for i in range(3):
    #打印随机值
    print(random.random())
    #指定范围的随机数
    print(random.randint(10, 20))
```

* 举例 2：

```python
import random

members = ['John', 'Mary', 'Mosh']
leader = random.choice(members)
print(leader)
```

* 举例 3：1 - 6 间自动生成 2 个随机值

```python
import random

class Dice:
    def roll(self):
        first = random.randint(1, 6)
        second = random.randint(1, 6)
        return first, second

dice = Dice()
print(dice.roll())
```

### 37.寻找目录路径

```python
from pathlib import Path

path = Path("ecommerce")
print(path.exists())
```

如果有会输出 True，没有的话就会输出 False，那就使用下面命令创建一个新的目录

```python
path.mkdir()
```

删除目录

```python
path.rmdir
```

搜索文件，打印生成器对象

```python
from pathlib import Path

path = Path()
print(path.glob('*.*'))
```

实例：

```python
from pathlib import Path

path = Path()
for file in path.glob('*.py'):
    print(file)
```

显示目录下所有文件

```python
from pathlib import Path

path = Path()
for file in path.glob('*'):
    print(file)
```



### 38.表格中读取信息

```python
import openpyxl as xl
wb = xl.load_workbook('transactions.xlsx')
sheet = wb['Sheet1']
cell = sheet['A1']
cell = sheet.cell(1, 1)
print(cell.value)
```

查看数据有多少行：

```python
print(sheet.max_row)
```

实现图表显示：

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
@Time        : 2020/5/18
@Author      : WuGenQiang
@File        : app
@Description : 
"""
import openpyxl as xl
wb = xl.load_workbook('test.xlsx')
sheet = wb['Sheet1']
#cell = sheet['A1']
#cell = sheet.cell(1, 1)
#print(cell.value)
print(sheet.max_row)
from openpyxl.chart import BarChart, Reference
for row in range(1, sheet.max_row + 1):
    cell = sheet.cell(row, 3)
    print(cell.value)
    corrected_price = cell.value * 0.9 + 2
    corrected_price_cell = sheet.cell(row, 4)
    corrected_price_cell.value = corrected_price
values = Reference(sheet,
          min_row=1,
          max_row=sheet.max_row,
          min_col=4,
          max_col=4)
chart = BarChart()
chart.add_data(values)
sheet.add_chart(chart, 'E2')
wb.save('test2.xlsx')
```

效果图：

![image-20200526165657549](https://gitee.com/wugenqiang/PictureBed/raw/master/NoteBook/20200526165658.png)



优化：子函数调用版

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
@Time        : 2020/5/18
@Author      : WuGenQiang
@File        : app
@Description : 
"""
import openpyxl as xl
from openpyxl.chart import BarChart, Reference

def process_workbook(filename):
    wb = xl.load_workbook(filename)
    sheet = wb['Sheet1']
    # cell = sheet['A1']
    # cell = sheet.cell(1, 1)
    # print(cell.value)
    print(sheet.max_row)

    for row in range(1, sheet.max_row + 1):
        cell = sheet.cell(row, 3)
        print(cell.value)
        corrected_price = cell.value * 0.9 + 2
        corrected_price_cell = sheet.cell(row, 4)
        corrected_price_cell.value = corrected_price
    values = Reference(sheet,
                       min_row=1,
                       max_row=sheet.max_row,
                       min_col=4,
                       max_col=4)
    chart = BarChart()
    chart.add_data(values)
    sheet.add_chart(chart, 'E2')
    wb.save(filename)

process_workbook('test.xlsx')
```

### 39.CSV 文件导入数据

> 数据集下载：[vgsales.csv](https://wugenqiang.github.io/NoteBook/Python/6小时Python入门/vgsales.csv)

#### 整体输出数据

```python
import pandas as pd
#从CSV文件导入数据，存储在df中
df = pd.read_csv('vgsales.csv')
df
```

效果：

![image-20200531195556447](https://gitee.com/wugenqiang/PictureBed/raw/master/NoteBook/20200531195557.png)

#### 获取数据集的形状

```python
#获取数据集的形状
df.shape
```

效果：

![image-20200531200756673](https://gitee.com/wugenqiang/PictureBed/raw/master/NoteBook/20200531200757.png)

#### 分段输出数据

```python
#描述方法
df.describe()
```

效果：

![image-20200531201607125](https://gitee.com/wugenqiang/PictureBed/raw/master/NoteBook/20200531201608.png)

#### 获取值

```python
df.values
```

效果：

![image-20200531202108365](https://gitee.com/wugenqiang/PictureBed/raw/master/NoteBook/20200531202109.png)



![image-20200531204830570](https://gitee.com/wugenqiang/PictureBed/raw/master/NoteBook/20200531204832.png)



#### 清洁数据

删除数据举例：

```python
import pandas as pd
#从CSV文件导入数据，存储在df中
df = pd.read_csv('vgsales.csv')
x = df.drop(columns=['JP_Sales'])
x
```

获取某一列数据：

```python
import pandas as pd
#从CSV文件导入数据，存储在df中
df = pd.read_csv('vgsales.csv')
y = df['JP_Sales']
y
```

### 40.决策树

```python
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
#从CSV文件导入数据，存储在df中
df = pd.read_csv('vgsales.csv')
x = df.drop(columns=['JP_Sales'])
y = df['JP_Sales']
#树分类器
model = DecisionTreeClassifier()
model.fit(x, y)
#调用模型预测
predictions = model.predict([[41.49, 29.02], [29.08, 3.58]])
predictions
```

可能数据不对，可以使用其他测试数据

#### 测量数据精确度

数据被分为两组：训练和测试

```python
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
#从CSV文件导入数据，存储在df中
df = pd.read_csv('vgsales.csv')
x = df.drop(columns=['JP_Sales'])
y = df['JP_Sales']
#培训和测试数据输入输出集
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)
#树分类器
model = DecisionTreeClassifier()
model.fit(x_train, y_train)
#调用模型预测
predictions = model.predict(x_test)
score = accuracy_score(y_test, predictions)
score
```



## 六、参考资料

[[1] 2020 最新 Python 教程 6 小时入门](https://www.bilibili.com/video/BV1h64y1M7UC)