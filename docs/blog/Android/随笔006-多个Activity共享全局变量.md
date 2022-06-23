### <center> <font size=34 face="STKaiti"> 多个Activity共享全局变量 </font>    <!-- {docsify-ignore} -->

首先新建一个 `activity` 用来存放需要共享的全局变量的成员和方法，比如这里我新建一个 `MyDataActivity`

``` java
package com.anwensoft.cardvr.activity;
import android.app.Application;

public class MyDataActivity extends Application {
    private static byte send_buf[] = {(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00};

//    private static byte[] send_buf = new byte[4];

//给数组中的某个元素赋值
    public void setBuf(byte data,byte location){
        this.send_buf[location] = data;
    }

//获取数组中的某个元素值
    public byte getBuf(byte location){
        return send_buf[location];
    }
 
//获取整个数组
    public byte[] getWholeBuf(){
        return send_buf;
    }
}
```

然后在 `AndroidManifest.xml` 中添加所新建的类 (在 `application` 里面)

``` xml
<application
    android:name=".MyDataActivity">
```

现在，就可以在多个 `Activity` 中访问同一个数据啦。

例如，我在 `MainActivity` 中如下设置

``` Java
public class MainActivity extends AppCompatActivity{
MyDataActivity Send_data;

protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    Send_data= (MyDataActivity)getApplicationContext();

    Send_data.setBuf((byte)0xA5,(byte)1);    //设置数组第二个元素值为 0xA5；
    }
}
```

在 `TestActivity` 中

``` Java
public class TestActivity extends AppCompatActivity {
 
MyDataActivity Send_data;
 
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_test);
 
    Send_data= (MyDataActivity)getApplicationContext();
 
    byte num = Send_data.getBuf((byte)1);    //获取数组中的第二个元素,并且值是 0xA5;
    }
}
```

这样就实现了同一数据在多个 `Activity` 中共享。

