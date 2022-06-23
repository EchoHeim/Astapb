### <center> <font size=34 face="STKaiti"> string 类 </font>    <!-- {docsify-ignore} -->

# 1. 引言

在 `C++` 中，大大加强了对字符串的支持和处理，除了兼容 `C` 语言的字符串，还内置了完全可以替换 `C` 语言中的字符数组和字符串指针的 `string` 类。

# 2. string使用

使用 `string` 类需要包含头文件 `<string>`。

简单例子：
``` C++
#include <iostream>
#include <string>
using namespace std;
 
int main(){
    string s1;
    string s2 = "c plus plus";
    string s3 = s2;
    string s4 (5, 'c');
    return 0;
}
```

> 变量 `s1` 只是定义但没有初始化，编译器会将默认值赋给 `s1`，默认值是 `""`，也即空字符串。
> 
> 变量 `s2` 在定义的同时被初始化为 `c plus plus`。与C风格的字符串不同，`string` 的结尾没有结束标志 `\0`。
> 
> 变量 `s3` 在定义的时候直接用 `s2` 进行初始化，因此 `s3` 的内容也是 `c plus plus`。
> 
> 变量 `s4` 被初始化为由 `5` 个 `c` 字符组成的字符串，也就是 `ccccc`。

`string` 类提供字符串长度函数 `length()`，如：

``` C++
string s = "hello C++!";
int len = s.length();
cout<<len<<endl;
```

> 输出结果 `10`，因为没有结尾的 `\0` 字符

转换为 `C` 语言风格的函数 `c_str()`，如：

``` C++
string path = "D:\\ceshi.txt";
FILE *fp = fopen(path.c_str(), "rt");
//使用 C语言的 fopen() 函数打开文件，所以要将 string 字符串转换为 C语言风格的字符串。
```

`string` 类的读写或其中字符的访问都可以看作变量或数组，如：

``` C++
#include <iostream>
#include <string>
using namespace std;
 
int main(){
    string s;
    cin>>s;  //输入字符串
    cout<<s<<endl;  //输出字符串
 
    s[5] = '5';   //修改字符串中的第六个字符;
    for(int i=0,len=s.length(); i<len; i++){
        cout<<s[i]<<" ";
    }

    return 0;
}
```

# 2. string类字符串拼接

可以直接使用 + 或 += 运算符，而不需要使用 C语言里的 strcat()、strcpy()、malloc() 等函数，也不用担心空间溢出。例：

``` C++
#include <iostream>
#include <string>
using namespace std;

int main(){
    string s1 = "first ";
    string s2 = "second ";
    char *s3 = "third ";
    char s4[] = "fourth ";
    char ch = '@';
 
    string s5 = s1 + s2;
    string s6 = s1 + s3;
    string s7 = s1 + s4;
    string s8 = s1 + ch;
    
    cout<<s5<<endl<<s6<<endl<<s7<<endl<<s8<<endl;
 
    return 0;
}

//运行结果：
first second
first third
first fourth
first @
```

# 3. 字符串的增删改查

## 3.1 插入函数 insert();

``` C++
string& insert (size_t pos, const string& str);
//pos 表示要插入的位置(下标)；str 表示要插入的字符串;
```

## 3.2 删除函数 erase();

``` C++
string& erase (size_t pos = 0, size_t len = npos);
//pos 表示要删除的子字符串的起始下标，len 表示要删除子字符串的长度。如果不指明 len 的话，那么直接删除从 pos 到字符串结束处的所有字符。
```

## 3.3 提取函数 substr();

``` C++
string substr (size_t pos = 0, size_t len = npos) const;
//pos 为要提取的子字符串的起始下标，len 为要提取的子字符串的长度。
```

## 3.4 字符串查找函数

1. find()

    ``` C++
    size_t find (const string& str, size_t pos = 0) const;
    size_t find (const char* s, size_t pos = 0) const;
    
    //第一个参数为待查找的子字符串，它可以是 string 字符串，也可以是C风格的字符串。
    //第二个参数为开始查找的位置（下标）；如果不指明，则从第0个字符开始查找。
    ```

2. rfind()

    和 find() 函数相似，只不过第二个参数代表最大的查找范围，即该位置以后的就不在查找范围内。

3. finf_first_of()

    用于查找子字符串和字符串共同具有的字符在字符串中首次出现的位置。

   * 示例：

    ``` C++
    #include <iostream>
    #include <string>
    using namespace std;
    
    int main(){
        string s1, s2, s3;
        s1 = s2 = "1234567890";
        s3 = "aaa";
        s1.insert(5, s3);
        cout<< s1 <<endl;      //12345aaa67890
        s2.insert(5, "bbb");
        cout<< s2 <<endl;      //12345bbb67890
    
        s1 = s2 = s3 = "1234567890";
        s2.erase(5);
        s3.erase(5, 3);
        cout<< s1 <<endl;    //1234567890
        cout<< s2 <<endl;    //12345
        cout<< s3 <<endl;    //1234590
    
        s1 = "first second third";
        s2 = s1.substr(6, 6);
        cout<< s1 <<endl;    //first second third
        cout<< s2 <<endl;    //second
    
        s1 = "first second third";
        s2 = "second";
        int index = s1.find(s2,5);       //Found at index : 6
        if(index < s1.length())
            cout<<"Found at index : "<< index <<endl;
        else
            cout<<"Not found"<<endl;
    
        s1 = "first second third";
        s2 = "second";
        index = s1.rfind(s2,6);          //Found at index : 6
        if(index < s1.length())
            cout<<"Found at index : "<< index <<endl;
        else
            cout<<"Not found"<<endl;
    
        s1 = "first second second third";
        s2 = "asecond";
        index = s1.find_first_of(s2);    //Found at index : 3
        if(index < s1.length())
            cout<<"Found at index : "<< index <<endl;
        else
            cout<<"Not found"<<endl;
        return 0;
    }
    ```