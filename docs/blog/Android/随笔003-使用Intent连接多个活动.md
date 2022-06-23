### <center> <font size=34 face="STKaiti"> 使用Intent连接多个活动 </font>    <!-- {docsify-ignore} -->

`Intent` 是 `Android` 各组件之间进行交互的一种重要方式，一般被用于启动活动、启动服务以及发送广播等场景。

# 1. 显式 Intent

`Intent` 有多个构造函数重载，其中一个 `Intent(Context packageContext，Class cls)`。

第一个参数要求提供一个启动活动的上下文，第二个参数是指向想要启动的目标活动。创建好 `Intent` 后，用 `startActivity()` 方法启动即可。

如下，在 `MainActivity` 中的一个按钮的点击后，启动 `first_activity`

``` java
public void onClick(View v) {
     Intent intent = new Intent(MainActivity.this,first_activity.class);
     startActivity(intent);
}
```

# 2. 隐式 Intent

隐式 `Intent` 不像显式那样明确指出要启动哪一个活动，而是指定一系列更为抽象的 `action` 和 `category` 等信息，只有当 `action` 和 `category` 信息完全匹配时才能成功启动。

首先在 `AndroidManifest.xml` 中的 `<activity>` 标签下配置 `<intent-filter>` 内容，如下：

``` xml
<activity android:name=".second_activity" >
      <intent-filter>
           <action android:name="com.lodge.myapplication.ACTION_START" />
           <category android:name="android.intent.category.DEFAULT" />
      </intent-filter>
</activity>
```

其中 `<action>` 标签中指明活动可以响应 `com.lodge.myapplication.ACTION_START` 。

然后在另一个 `activity` 中按钮的点击事件添加如下代码

``` java
button_2.setOnClickListener(new View.OnClickListener() {
     @Override
     public void onClick(View v) {
         Intent intent = new Intent("com.lodge.myapplication.ACTION_START");     //隐式Intent;
         startActivity(intent);
     }
});
```

这里的 `intent` 是另一个构造函数，直接将 `action` 的字符串传了进去，表示想要启动能够响应 `com.lodge.myapplication.ACTION_START` 这个 `action` 的活动。

另外，因为 `category` 参数设置为 `android.intent.category.DEFAULT`，代表默认设置，所以在 `intent` 中未加入 `category`。

其实每个 `intent` 中只能指定一个 `action`，但却能指定多个 `category`。例如：

``` java
button_2.setOnClickListener(new View.OnClickListener() {
     @Override
     public void onClick(View v) {
        Intent intent = new Intent("com.lodge.myapplication.ACTION_START");     //隐式Intent;
        intent.addCategory("com.lodge.myapplication.MY_CATEGORY");
        startActivity(intent);
     }
});
```

当然，在 `AndroidManifest.xml` 中 `<activity>` 标签下的 `<intent-filter>` 里也要添加 `<category>` 内容，如下：

``` xml
<activity android:name=".second_activity" >
     <intent-filter>
         <action android:name="com.lodge.myapplication.ACTION_START" />
         <category android:name="android.intent.category.DEFAULT" />
         <category android:name="com.lodge.myapplication.MY_CATEGORY" />
     </intent-filter>
</activity>
```

# 3.更多隐式 intent

使用隐式 `intent` 启动其他程序的活动。例如打开系统浏览器，在按钮点击事件中添加如下代码：

``` java
button_3.setOnClickListener(new View.OnClickListener() {
       @Override
       public void onClick(View v) {
           Intent intent = new Intent(Intent.ACTION_VIEW);             //更多隐式Intent;
           intent.setData(Uri.parse("http://www.baidu.com"));
           startActivity(intent);
       }
});
```

这里的 `Intent.ACTION_VIEW` 是内置动作。

# 4. 向下一个活动传递数据

`Intent` 中的 `putExtra()` 方法可以把我们想要传递的数据保存在 `Intent` 中，启动另一个活动后，再把数据从 `Intent` 中取出即可。

``` java
//上一个活动传送数据;
button.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
          String data = "hello intent put_Extra";
          Intent intent = new Intent(MainActivity.this,first_activity.class);
          intent.putExtra("extra_data",data);     //传递数据,第一个参数是键值，后一个参数是要传递的数据;
         startActivity(intent);
     }
});

//下一个活动获取数据;
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_first);
 
    Intent intent = getIntent();        //获取用于启动本activity的intent;
    String data = intent.getStringExtra("extra_data");      //传入相应键值，获得数据;
    Log.d("first_activity",data);       //打印数据;
}
```

# 5. 返回数据给上一个活动

`Activity` 中有一个 `startActivityForResult()` 方法也是用于启动活动的，但是这个方法期望在活动销毁的时候能够返回一个结果给上一个活动。

``` java
//启动活动;
button.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
          Intent intent = new Intent(MainActivity.this,second_activity.class);
          startActivityForResult(intent,1);    //接收启动的下一个活动返回的数据,第二个参数是请求码，只要是唯一值就行，这里是 1 ;
      }
});
 
@Override
//重写onActivityResult()方法，用于响应startActivityForResult()方法启动的活动;
protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
    switch (requestCode)
    {
        case 1:
           if(resultCode == RESULT_OK)
           {
                String returnedData = data.getStringExtra("return_data");
                Log.d("main_activity",returnedData);
           }
           break;
    }
}

//子活动设置按钮销毁活动（return_button） ;
@Override
protected void onCreate(Bundle savedInstanceState) { 
   super.onCreate(savedInstanceState);
   setContentView(R.layout.activity_second);
 
   Button button = findViewById(R.id.return_button);
 
   button.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            Intent intent = new Intent();
            intent.putExtra("return_data","hello main_activity!");
            setResult(RESULT_OK,intent);
            finish();       //销毁当前活动;
        }
    });
}

@Override
//重写按下返回键的方法，实现与 return_button 相同的功能;
public void onBackPressed() {
    Intent intent = new Intent();
    intent.putExtra("return_data","hello back to main_activity!");
    setResult(RESULT_OK,intent)
    finish();       //销毁当前活动;
}
```
