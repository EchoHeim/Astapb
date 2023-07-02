## 1. 开发环境

[Quartus II 官方下载](https://www.intel.com/content/www/us/en/software-kit/711920/intel-quartus-ii-subscription-edition-design-software-version-13-0sp1-for-windows.html?)

## 2. Verilog基础知识

### 2.1 Verilog的逻辑值

    我们先看下逻辑电路中有四种值，即四种状态：

    - 逻辑 0：表示低电平，也就是对应我们电路的 GND
    - 逻辑 1：表示高电平，也就是对应我们电路的 VCC
    - 逻辑 X：表示未知，有可能是高电平，也有可能是低电平
    - 逻辑 Z：表示高阻态，外部没有激励信号是一个悬空状态

![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/c8cfb7e0-5b0d-4b37-8517-174188fa5b9c)

### 2.2 Verilog的数字进制格式
   
Verilog 数字进制格式包括二进制、 八进制、 十进制和十六进制，一般常用的为二进制、 十进制和十六进制。

- 二进制
   4‘b0101 表示 4 位二进制数字 0101；
- 十进制
   4‘d2 表示 4 位十进制数字 2（二进制 0010）；
- 十六进制 
   4‘ha 表示 4 位十六进制数字 a（二进制 1010），十六进制的计数方式为 0， 1， 2…9，a， b， c， d， e， f， 最大计数为 f（ f：十进制表示为 15）。

> 当代码中没有指定数字的位宽与进制时，默认为 32 位的十进制，比如 100，实际上表示的值为 32‘d100

### 2.3 Verilog的数据类型

在 Verilog 语法中，主要有三大类数据类型，即寄存器类型、线网类型和参数类型。

1. 寄存器类型
  
    寄存器类型表示一个抽象的数据存储单元，它只能在 always 语句和 initial 语句中被赋值，并且它的值从一个赋值到另一个赋值过程中被保存下来。如果该过程语句描述的是时序逻辑， 即 always 语句带有时钟信号，则该寄存器变量对应为寄存器；如果该过程语句描述的是组合逻辑， 即 always 语句不带有时钟信号，则该寄存器变量对应为硬件连线；寄存器类型的缺省值是 x（未知状态）。寄存器数据类型有很多种，如 reg、 integer、 real 等，其中最常用的就是 reg 类型，它的使用方法如下：

    ``` verilog
    reg [31:0] delay_cnt; //延时计数器
    reg key_flag ; //按键标志
    ```

2. 线网类型
  
    线网表示 Verilog 结构化元件间的物理连线。它的值由驱动元件的值决定，例如连续赋值或门的输出。如果没有驱动元件连接到线网，线网的缺省值为 z（高阻态）。线网类型同寄存器类型一样也是有很多种，如 tri 和 wire 等，其中最常用的就是 wire 类型，它的使用方法如下：

    ``` verilog
    wire data_en; //数据使能信号
    wire [7:0] data ; //数据
    ```

3. 参数类型
  
    我们再来看下参数类型，参数其实就是一个常量，常被用于定义状态机的状态、数据位宽和延迟大小等，由于它可以在编译时修改参数的值，因此它又常被用于一些参数可调的模块中，使用户在实例化模块时，可以根据需要配置参数。在定义参数时，我们可以一次定义多个参数，参数与参数之间需要用逗号隔开。这里我们需要注意的是参数的定义是局部的，只在当前模块中有效。它的使用方法如下：

    ``` verilog
    parameter DATA_WIDTH = 8; //数据位宽为 8 位
    ```

### 2.4 Verilog的运算符
   
1. 算术运算符
  
    就是数学运算里面的加减乘除，数字逻辑处理有时候也需要进行数字运算，所以需要算术运算符。常用的算术运算符主要包括加减乘除和模除（模除运算也叫取余运算） 如下表所示：
    
    ![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/58a5c82a-2074-4f28-8818-2b588d6afe21)

    > Verilog 实现乘除比较浪费组合逻辑资源，尤其是除法。一般 2 的指数次幂的乘除法使用移位运算来完成运算，详情可以看移位运算符章节。 非 2 的指数次幂的乘除法一般是调用现成的 IP，Quartus/Vivado 等工具软件会有提供， 不过这些工具软件提供的 IP 也是由最底层的组合逻辑(与或非门等)搭建而成的。

2. 关系运算符
    
    关系运算符主要是用来做一些条件判断用的，在进行关系运算符时，如果声明的关系是假的，则返回值是 0，如果声明的关系是真的，则返回值是 1；所有的关系运算符有着相同的优先级别，关系运算符的优先级别低于算术运算符的优先级别如下表所示

    ![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/dc2590d8-c1e0-4379-85fd-8a2449528b62)

3. 逻辑运算符
   
    逻辑运算符是连接多个关系表达式用的，可实现更加复杂的判断，一般不单独使用，都需要配合具体语句来实现完整的意思，如下表所示

    ![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/dad32d5d-c5ae-4a9e-979d-e74fc47a1e74)

4. 条件运算符

    条件操作符一般来构建从两个输入中选择一个作为输出的条件选择结构，功能等同于 always 中的if-else 语句，如下表所示

    ![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/491d2e5d-6fc1-4344-9f0c-9a96a85a3a05)

5. 位运算符
   
   位运算符是一类最基本的运算符，可以认为它们直接对应数字逻辑中的与、或、非门等逻辑门。 常用的位运算符如下表所示

   ![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/8cb9d7c5-53c4-4d32-a630-f028d6752373)

    > 位运算符的与、或、非与逻辑运算符逻辑与、逻辑或、逻辑非使用时候容易混淆，逻辑运算符一般用在条件判断上，位运算符一般用在信号赋值上。

6. 移位运算符
   
   移位运算符包括左移位运算符和右移位运算符，这两种移位运算符都用 0 来填补移出的空位。如下表所示

   ![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/cc1ff434-838d-41c9-bb4b-fae4aa8bf030)

7. 拼接运算符

    Verilog 中有一个特殊的运算符是 C 语言中没有的，就是位拼接运算符。用这个运算符可以把两个或多个信号的某些位拼接起来进行运算操作。如下表所示。

    ![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/859832b2-10ac-467c-beb8-75583f72b85b)

#### 2.4.1 运算符优先级

    ![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/a2c7428f-3a8b-46fe-83ae-92dd7d1a3435)

### 2.5 Verilog关键字

1. 所有关键字
   
   ![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/b9d4a5ca-29e3-4987-b0f5-b49176dd3dc9)

2. 常用关键字
   
   ![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/7f45a336-ffc8-4859-bfc3-0c2df0143acf)

   ![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/ef8f1740-306f-42f4-be8b-43b93f8e9e13)

## 3. Verilog高级知识

### 3.1 阻塞赋值（Blocking）

即在一个 always 块中，后面的语句会受到前语句的影响，具体来说就是在同一个 always 中，一条阻塞赋值语句如果没有执行结束，那么该语句后面的语句就不能被执行，即被阻塞。也就是说 always 块内的语句是一种顺序关系，这里和 C 语言很类似。符号“=”用于阻塞的赋值（如:b = a;），阻塞赋值“=”在 begin 和 end 之间的语句是顺序执行，属于串行语句。

### 3.2 非阻塞赋值（Non-Blocking）

符号“<=”用于非阻塞赋值（如:b <= a;），非阻塞赋值是由时钟节拍决定，在时钟上升到来时，执行赋值语句右边，然后将 begin-end 之间的所有赋值语句同时赋值到赋值语句的左边，注意：是 begin—end 之间的所有语句，一起执行，且一个时钟只执行一次，属于并行执行语句。这个是和 C 语言最大的一个差异点。

### 3.3 阻塞与非阻塞的区别和用法

在描述组合逻辑电路的时候，使用阻塞赋值，比如 assign 赋值语句和不带时钟的 always 赋值语句，这种电路结构只与输入电平的变化有关系，
示例代码如下：
 
``` verilog 
//assign 赋值语句
assign data = (data_en == 1'b1) ? 8'd255 : 8'd0;
```

``` verilog
//不带时钟的 always 语句
always @(*) begin
    if (en) begin
        a = a0;
        b = b0;
    end
    else begin
        a = a1;
        b = b1;
    end
end
```

在描述时序逻辑的时候，使用非阻塞赋值，综合成时序逻辑的电路结构，比如带时钟的 always 语句；这种电路结构往往与触发沿有关系，只有在触发沿时才可能发生赋值的变化。
代码如下：

``` verilog
always @(posedge sys_clk or negedge sys_rst_n) begin
    if (!sys_rst_n) begin
        a <= 1'b0;
        b <= 1'b0;
    end
    else begin
        a <= c;
        b <= d;
    end
end 
```

### 3.4 assign 和 always 区别

assign 语句使用时不能带时钟。always 语句可以带时钟，也可以不带时钟。

在 always 不带时钟时，逻辑功能和 assign 完全一致，都是只产生组合逻辑。比较简单的组合逻辑推荐使用 assign 语句，比较复杂的组合逻辑推荐使用 always 语句。
示例如下

``` verilog
assign counter_en = (counter == (COUNT_MAX - 1'b1)) ? 1'b1 : 1'b0;

always @(*) begin
    case (led_ctrl_cnt)
        2'd0 : led = 4'b0001;
        2'd1 : led = 4'b0010;
        2'd2 : led = 4'b0100;
        2'd3 : led = 4'b1000;
        default : led = 4'b0000;
    endcase
end
```

### 3.5 带时钟和不带时钟的 always

- 在 always 不带时钟时，逻辑功能和 assign 完全一致，虽然产生的信号定义还是 reg 类型，但是该语句产生的还是组合逻辑。

``` verilog
reg [3:0] led；

always @(*) begin
    case (led_ctrl_cnt)
        2'd0 : led = 4'b0001;
        2'd1 : led = 4'b0010;
        2'd2 : led = 4'b0100;
        2'd3 : led = 4'b1000;
        default : led = 4'b0000;
    endcase
end
```

- 在 always 带时钟信号时，这个逻辑语句才能产生真正的寄存器，如下示例 counter 就是真正的寄存器。

``` verilog
//用于产生 0.5 秒使能信号的计数器
always @(posedge sys_clk or negedge sys_rst_n) begin
    if (sys_rst_n == 1'b0)
        counter <= 1'b0;
    else if (counter_en)
        counter <= 1'b0;
    else
        counter <= counter + 1'b1;
end
```

### 3.6 什么是 latch

latch 是指锁存器，是一种对脉冲电平敏感的存储单元电路。锁存器和寄存器都是基本存储单元，锁存器是电平触发的存储器，寄存器是边沿触发的存储器。两者的基本功能是一样的，都可以存储数据。锁存器是组合逻辑产生的，而寄存器是在时序电路中使用，由时钟触发产生的。

latch 的主要危害是会产生毛刺（ glitch），这种毛刺对下一级电路是很危险的。并且其隐蔽性很强，不易查出。因此，在设计中，应尽量避免 latch 的使用。

代码里面出现 latch 的两个原因是在组合逻辑中， if 或者 case 语句不完整的描述， 比如 if 缺少 else 分支，case 缺少 default 分支，导致代码在综合过程中出现了 latch。解决办法就是 if 必须带 else 分支，case 必须带 default 分支。

> 只有不带时钟的 always 语句 if 或者 case 语句不完整才会产生 latch， 带时钟的语句 if 或者 case 语句不完整描述不会产生 latch。

下面为缺少 else 分支的带时钟的 always 语句和不带时钟的 always 语句， 通过实际产生的电路图可以看到第二个是有一个 latch 的，第一个仍然是普通的带有时钟的寄存器。

![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/abc6f819-46e4-4490-95fc-9524676a93eb)

![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/28202a54-4776-44a8-bb0a-76a4e32a86fa)

### 3.7 状态机

Verilog 是硬件描述语言，硬件电路是并行执行的，当需要按照流程或者步骤来完成某个功能时，代码中通常会使用很多个 if 嵌套语句来实现，这样就增加了代码的复杂度，以及降低了代码的可读性，这个时候就可以使用状态机来编写代码。 状态机相当于一个控制器，它将一项功能的完成分解为若干步，每一步对应于二进制的一个状态，通过预先设计的顺序在各状态之间进行转换，状态转换的过程就是实现逻辑功能的过程。

状态机，全称是有限状态机（ Finite State Machine，缩写为 FSM），是一种在有限个状态之间按一定规律转换的时序电路，可以认为是组合逻辑和时序逻辑的一种组合。 状态机通过控制各个状态的跳转来控制流程，使得整个代码看上去更加清晰易懂，在控制复杂流程的时候，状态机优势明显，因此基本上都会用到状态机，如 SDRAM 控制器等。

根据状态机的输出是否与输入条件相关，可将状态机分为两大类，即摩尔(Moore)型状态机和米勒(Mealy)型状态机。

Mealy 状态机：组合逻辑的输出不仅取决于当前状态，还取决于输入状态。
Moore 状态机：组合逻辑的输出只取决于当前状态。.

1. Mealy 状态机
   
米勒状态机的模型如下图所示，模型中第一个方框是指产生下一状态的组合逻辑 F， F 是当前状态和输入信号的函数，状态是否改变、如何改变，取决于组合逻辑 F 的输出；第二框图是指状态寄存器，其由一组触发器组成，用来记忆状态机当前所处的状态，状态的改变只发生在时钟的跳边沿；第三个框图是指产生输出的组合逻辑 G，状态机的输出是由输出组合逻辑 G 提供的， G 也是当前状态和输入信号的函数。

![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/c52af699-e598-49f8-9788-c81f2213d428)

2. Moore 状态机

摩尔状态机的模型如下图所示，对比米勒状态机的模型可以发现，其区别在于米勒状态机的输出由当前状态和输入条件决定的，而摩尔状态机的输出只取决于当前状态。

![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/bd97e1a5-4135-4320-a453-ae2a09e3e8d1)

3. 三段式状态机
   
根据状态机的实际写法，状态机还可以分为一段式、二段式和三段式状态机。

一段式：整个状态机写到一个 always 模块里面，在该模块中既描述状态转移，又描述状态的输入和输出。不推荐采用这种状态机，因为从代码风格方面来讲，一般都会要求把组合逻辑和时序逻辑分开；从代码维护和升级来说，组合逻辑和时序逻辑混合在一起不利于代码维护和修改，也不利于约束。

二段式： 用两个 always 模块来描述状态机，其中一个 always 模块采用同步时序描述状态转移；另一个模块采用组合逻辑判断状态转移条件，描述状态转移规律以及输出。 不同于一段式状态机的是， 它需要定义两个状态， 现态和次态，然后通过现态和次态的转换来实现时序逻辑。

三段式：在两个 always 模块描述方法基础上，使用三个 always 模块，一个 always 模块采用同步时序描述状态转移，一个 always 采用组合逻辑判断状态转移条件，描述状态转移规律，另一个 always 模块描述状态输出(可以用组合电路输出，也可以时序电路输出)。

> 实际应用中三段式状态机使用最多，因为三段式状态机将组合逻辑和时序分开，有利于综合器分析优化以及程序的维护；并且三段式状态机将状态转移与状态输出分开，使代码看上去更加清晰易懂，提高了代码的可读性，推荐大家使用三段式状态机。

三段式状态机的基本格式是：
- 第一个 always 语句实现同步状态跳转；
- 第二个 always 语句采用组合逻辑判断状态转移条件；
- 第三个 always 语句描述状态输出(可以用组合电路输出，也可以时序电路输出)。

在开始编写状态机代码之前，一般先画出状态跳转图，这样在编写代码时思路会比较清晰，下面以一个 7 分频为例（对于分频等较简单的功能，可以不使用状态机，这里只是演示状态机编写的方法），状态跳转图如下图所示：

![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/92dcfb3d-5900-4054-af01-a356c63eade5)

状态跳转图画完之后，接下来通过 parameter 来定义各个不同状态的参数，如下代码所示：

``` verilog
parameter S0 = 7'b0000001; //独热码定义方式
parameter S1 = 7'b0000010;
parameter S2 = 7'b0000100;
parameter S3 = 7'b0001000;
parameter S4 = 7'b0010000;
parameter S5 = 7'b0100000;
parameter S6 = 7'b1000000; 
```

这里是使用独热码的方式来定义状态机，每个状态只有一位为 1，当然也可以直接定义成十进制的 0，1， 2……7。
因为我们定义成独热码的方式，每一个状态的位宽为 7 位，接下来还需要定义两个 7 位的寄存器，一个用来表示当前状态，另一个用来表示下一个状态，如下所示

``` verilog
reg [6:0] curr_st ; //当前状态
reg [6:0] next_st ; //下一个状态 
```

接下来就可以使用三个 always 语句来开始编写状态机的代码，

第一个 always 采用同步时序描述状态转移，

第二个 always 采用组合逻辑判断状态转移条件，

第三个 always 是描述状态输出，一个完整的三段式状态机的例子如下代码所示：

``` c {.line-numbers}
module divider7_fsm (
    //系统时钟与复位
    input sys_clk ,
    input sys_rst_n ,

    //输出时钟
    output reg clk_divide_7
    );
    
    //parameter define
    parameter S0 = 7'b0000001; //独热码定义方式
    parameter S1 = 7'b0000010;
    parameter S2 = 7'b0000100;
    parameter S3 = 7'b0001000;
    parameter S4 = 7'b0010000;
    parameter S5 = 7'b0100000;
    parameter S6 = 7'b1000000;

    //reg define
    reg [6:0] curr_st ; //当前状态
    reg [6:0] next_st ; //下一个状态

    //*****************************************************
    //** main code
    //*****************************************************

    //状态机的第一段采用同步时序描述状态转移
    always @(posedge sys_clk or negedge sys_rst_n) begin
        if (!sys_rst_n)
            curr_st <= S0;
        else
            curr_st <= next_st;
    end

    //状态机的第二段采用组合逻辑判断状态转移条件
    always @(*) begin
        case (curr_st)
            S0: next_st = S1;
            S1: next_st = S2;
            S2: next_st = S3;
            S3: next_st = S4;
            S4: next_st = S5;
            S5: next_st = S6;
            S6: next_st = S0;
            default: next_st = S0;
        endcase
    end

    //状态机的第三段描述状态输出（这里采用时序电路输出）
    always @(posedge sys_clk or negedge sys_rst_n) begin
        if (!sys_rst_n)
            clk_divide_7 <= 1'b0;
        else if ((curr_st == S0) | (curr_st == S1) | (curr_st == S2) | (curr_st == S3))
            clk_divide_7 <= 1'b0;
        else if ((curr_st == S4) | (curr_st == S5) | (curr_st == S6))
            clk_divide_7 <= 1'b1;
        else
        ;
    end

 endmodule
```

在编写状态机代码时首先要定义状态变量（代码中的参数 S0~S6）与状态寄存器（ curr_st、 next_st），如代码中第 10 行至第 21 行所示；

接下来使用三个 always 语句来实现三段状态机: 

第一个 always 语句实现同步状态跳转（如代码的第 27 至第 33 行所示），在复位的时候，当前状态处在 S0 状态，否则将下一个状态赋值给当前状态；

第二个 always 采用组合逻辑判断状态转移条件（如代码的第 35 行至第 47 行代码所示），这里每一个状态只保持一个时钟周期，也就是直接跳转到下一个状态，在实际应用中，一般根据输入的条件来判断是否跳转到其它状态或者停留在当前转态，最后在 case 语句后面增加一个 default 语句，来防止状态机处在异常的状态；

第三个 always 输出分频后的时钟（如代码的第 49 至第 59 行代码所示），状态机的第三段可以使用组合逻辑电路输出，也可以使用时序逻辑电路输出，一般推荐使用时序电路输出，因为状态机的设计和其它设计一样，最好使用同步时序方式设计，以提高设计的稳定性，消除毛刺。

从代码中可以看出，输出的分频时钟 clk_divide_7 只与当前状态（ curr_st）有关，而与输入状态无关，所以属于摩尔型状态机。

状态机的第一段对应摩尔状态机模型的状态寄存器，用来记忆状态机当前所处的状态；

状态机的第二段对应摩尔状态机模型产生下一状态的组合逻辑 F；

状态机的第三段对应摩尔状态机产生输出的组合逻辑 G，因为采用时序电路输出有很大的优势，所以这里第三段状态机是由时序电路输出的。

状态机采用时序逻辑输出的状态机模型如下图所示：

![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/de1d8e7f-a435-4ac7-bfe3-0084e0f54c14)

采用这种描述方法虽然代码结构复杂了一些，但是这样做的好处是可以有效地滤去组合逻辑输出的毛刺，同时也可以更好的进行时序计算与约束；

另外对于总线形式的输出信号来说，容易使总线数据对齐，减小总线数据间的偏移，从而降低接收端数据采样出错的频率。

### 3.8 模块化设计

模块化设计是 FPGA 设计中一个很重要的技巧，它能够使一个大型设计的分工协作、仿真测试更加容易，代码维护或升级更加便利，当更改某个子模块时，不会影响其它模块的实现结果。

进行模块化、标准化设计的最终目的就是提高设计的通用性，减少不同项目中同一功能设计和验证引入的工作量。划分模块的基本原则是子模块功能相对独立、模块内部联系尽量紧密、模块间的连接尽量简单。

在进行模块化设计中，对于复杂的数字系统，我们一般采用自顶向下的设计方式。可以把系统划分成几个功能模块，每个功能模块再划分成下一层的子模块；每个模块的设计对应一个 module，一个 module 设计成一个 Verilog 程序文件。因此，对一个系统的顶层模块，我们采用结构化的设计，即顶层模块分别调用了各个功能模块。

下图是模块化设计的功能框图，一般整个设计的顶层模块只做例化（调用其它模块），不做逻辑。顶层下面会有模块 A、模块 B、模块 C 等，模块 A/B/C 又可以分多个子模块实现。

![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/be2ffb91-8213-4d41-8777-a066b189c622)

在这里我们补充一个概念，就是 Verilog 语法中的模块例化。 FPGA 逻辑设计中通常是一个大的模块中包含了一个或多个功能子模块， Verilog 通过模块调用或称为模块实例化的方式来实现这些子模块与高层模块的连接， 有利于简化每一个模块的代码，易于维护和修改。

下面以一个实例(静态数码管显示实验)来说明模块和模块之间的例化方法。

在静态数码管显示实验中，我们根据功能将 FPGA 顶层例化了以下两个模块：计时模块（ time_count）

和数码管静态显示模块（ seg_led_static），如下图所示：

![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/7d66b4d4-8eb1-4ad0-95f2-7ef414140594)

计时模块部分代码如下所示：

``` verilog
module time_count(
    input clk , // 时钟信号
    input rst_n , // 复位信号
    output reg flag // 一个时钟周期的脉冲信号
    );

    //parameter define
    parameter MAX_NUM = 25000_000; // 计数器最大计数值
    ......

endmodule
```

数码管静态显示模块部分代码如下所示：

``` verilog
module seg_led_static (
    input clk , // 时钟信号
    input rst_n , // 复位信号（低有效）

    input add_flag, // 数码管变化的通知信号
    output reg [5:0] sel , // 数码管位选
    output reg [7:0] seg_led // 数码管段选
    );

    ......

endmodule
```

顶层模块代码如下所示：

``` verilog
module seg_led_static_top (
    input sys_clk , // 系统时钟
    input sys_rst_n, // 系统复位信号（低有效）

    output [5:0] sel , // 数码管位选
    output [7:0] seg_led // 数码管段选
    );

    //parameter define
    parameter TIME_SHOW = 25'd25000_000; // 数码管变化的时间间隔 0.5s

    //wire define
    wire add_flag; // 数码管变化的通知信号

    //*****************************************************
    //** main code
    //*****************************************************

    //例化计时模块
    time_count #(
        .MAX_NUM (TIME_SHOW)
    ) u_time_count(
        .clk (sys_clk ),
        .rst_n (sys_rst_n),

        .flag (add_flag )
    );
    //例化数码管静态显示模块
    seg_led_static u_seg_led_static (
        .clk (sys_clk ),
        .rst_n (sys_rst_n),

        .add_flag (add_flag ),
        .sel (sel ),
        .seg_led (seg_led )
    );

endmodule
```

我们上面贴出了顶层模块的完整代码，子模块只贴出了模块的端口和参数定义的代码。这是因为顶层模块对子模块做例化时，只需要知道子模块的端口信号名，而不用关心子模块内部具体是如何实现的。

如果子模块内部使用 parameter 定义了一些参数， Verilog 也支持对参数的例化（也叫参数的传递），即顶层模块可以通过例化参数来修改子模块内定义的参数。

顶层模块例化子模块，例化方法如下图所示：

![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/673ecf1b-6a03-4206-a7ee-f6462f1da852)

上图右侧是例化的数码管静态显示模块，子模块名是指被例化模块的模块名，而例化模块名相当于标识，当例化多个相同模块时，可以通过例化名来识别哪一个例化，我们一般命名为“u” + “子模块名”。

信号列表中 “.” 之后的信号是数码管静态显示模块定义的端口信号，括号内的信号则是顶层模块声明的信号，这样就将顶层模块的信号与子模块的信号一一对应起来，同时需要注意信号的位宽要保持一致。

接下来再来介绍参数的例化，参数的例化是在模块例化的基础上，增加了对参数的信号定义，如下图所示：

![image](https://github.com/EchoHeim/KQ-Glue/assets/26021085/ebaed8e7-f1c0-4cb6-8f2e-2dba488b45df)

在对参数进行例化时，在模块名的后面加上“#”，表示后面跟着的是参数列表。计时模块定义的MAX_NUM 和顶层模块的 TIME_SHOW 都是等于 25000_000，当在顶层模块定义 TIME_SHOW=12500_000 时，那么子模块的 MAX_NUM 的值实际上也等于 12500_000。当然即使子模块包含参数，在做模块的例化时也可以不添加对参数的例化，这样的话，子模块的参数值等于该模块内部实际定义的值。

值得一提的是， Verilog 语法中的 localparam 代表的意思同样是参数定义，用法和 parameter 基本一致，区别在于 parameter 定义的参数可以做例化，而 localparam 定义的参数是指本地参数，上层模块不可以对 localparam 定义的参数做例化。

## 4. Verilog编程规范

### 4.1 工程组织形式

工程的组织形式一般包括如下几个部分，分别是 doc、 par、 rtl 和 sim 四个部分。

- doc：一般存放工程相关的文档，包括该项目用到的 datasheet（数据手册）、设计方案等。不过为了便于大家查看， 我们开发板文档是统一汇总存放在资料盘下的；
- par：主要存放工程文件和使用到的一些 IP 文件；
- rtl：主要存放工程的 rtl 代码，这是工程的核心，文件名与 module 名称应当一致，建议按照模块的层次分开存放；
- sim：主要存放工程的仿真代码， 复杂的工程里面，仿真也是不可或缺的部分， 可以极大减少调试的工作量。

### 4.2 输入输出定义

端口的输入输出有 Verilog 95 和 2001 两种格式，推荐大家采用 Verilog 2001 语法格式。下面是 Verilog2001 语法的一个例子，包括 module 名字、输入输出、信号名字、输出类型、注释。

``` verilog
module led(
    input sys_clk , //系统时钟
    input sys_rst_n, //系统复位，低电平有效
    output reg [3:0] led //4 位 LED 灯
);
```

建议如下几点：
1. 一行只定义一个信号；
2. 信号全部对齐；
3. 同一组的信号放在一起。

### 4.3 parameter 定义

建议如下几点：
1. module 中的 parameter 声明，不建议随处乱放；
2. 将 parameter 定义放在紧跟着 module 的输入输出定义之后；
3. parameter 等常量命名全部使用大写。
   
``` verilog
 //parameter define
 parameter WIDTH = 25 ;
 parameter COUNT_MAX = 25_000_000; //板载 50M 时钟=20ns， 0.5s/20ns=25000000，需要 25bit位宽
```

### 4.4 wire/reg 定义

一个 module 中的 wire/reg 变量声明需要集中放在一起，不建议随处乱放。建议如下：

1. 将 reg 与 wire 的定义放在紧跟着 parameter 之后；
2. 建议具有相同功能的信号集中放在一起；
3. 信号需要对齐， reg 和位宽需要空 2 格，位宽和信号名字至少空四格；
4. 位宽使用降序描述， [6:0]；
5. 时钟使用前缀 clk，复位使用后缀 rst；
6. 不能使用 Verilog 关键字作为信号名字；
7. 一行只定义一个信号。

``` verilog
//reg define
reg [WIDTH-1:0] counter ;
reg [1:0] led_ctrl_cnt;

//wire define
wire counter_en ; 
```

### 4.5 信号命名

建议如下：

1. 信号命名需要体现其意义，比如 fifo_wr 代表 FIFO 读写使能；
2. 可以使用“ _”隔开信号，比如 sys_clk；
3. 内部信号不要使用大写，也不要使用大小写混合，建议全部使用小写；
4. 模块名字使用小写；
5. 低电平有效的信号，使用_n 作为信号后缀；
6. 异步信号，使用_a 作为信号后缀；
7. 纯延迟打拍信号使用_dly 作为后缀。

### 4.6 always 块描述方式

always 块的编程规范，建议如下：

1. if 需要空四格；
2. 一个 always 需要配一个 begin 和 end；
3. always 前面需要有注释；
4. beign 建议和 always 放在同一行；
5. 一个 always 和下一个 always 空一行即可，不要空多行；
6. 时钟复位触发描述使用 posedge sys_clk 和 negedge sys_rst_n
7. 一个 always 块只包含一个时钟和复位；
8. 时序逻辑使用非阻塞赋值。

``` verilog
//用于产生 0.5 秒使能信号的计数器
always @(posedge sys_clk or negedge sys_rst_n) begin
    if (sys_rst_n == 1'b0)
        counter <= 1'b0;
    else if (counter_en)
        counter <= 1'b0;
    else
        counter <= counter + 1'b1;
end 
```

### 4.7 assign 块描述方式

assign 块的编程规范， 建议如下：

1. assign 的逻辑不能太复杂，否则易读性不好；
2. assign 前面需要有注释；
3. 组合逻辑使用阻塞赋值。

``` verilog
//计数到最大值时产生高电平使能信号
assign counter_en = (counter == (COUNT_MAX - 1'b1)) ? 1'b1 : 1'b0;
```

### 4.8 模块例化

moudle 模块例化使用 u_xx 表示。

``` verilog
//例化计时模块
time_count #(
    .MAX_NUM (TIME_SHOW)
) u_time_count(
    .clk (sys_clk ),
    .rst_n (sys_rst_n),

    .flag (add_flag )
);

//例化数码管静态显示模块
seg_led_static u_seg_led_static (
    .clk (sys_clk ),
    .rst_n (sys_rst_n),

    .add_flag (add_flag ),
    .sel (sel ),
    .seg_led (seg_led )
);
```

### 4.9 其他注意事项

1. 不使用 repeat 等循环语句；
2. RTL 级别代码里面不使用 initial 语句，仿真代码除外；
3. 避免产生 Latch 锁存器， 比如组合逻辑里面的 if 不带 else 分支、 case 缺少 default 语句；
4. 避免使用太复杂和少见的语法，可能造成语法综合器优化力度较低。

