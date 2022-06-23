### <center> <font size=34 face="STKaiti"> 使用 Menu </font>    <!-- {docsify-ignore} -->

`Android` 提供一种隐藏式的菜单栏，不占用显示空间又能实现菜单功能。

# 1. 菜单显示

首先在 `res` 目录下创建一个 `menu` 目录，在 `menu` 目录下新建一个菜单文件 (`menu resource file`)。 

在该文件中添加菜单代码

``` xml
<menu xmlns:android="http://schemas.android.com/apk/res/android">
 
    <item
        android:id="@+id/add_item"
        android:title="Add" />
 
    <item
        android:id="@+id/del_item"
        android:title="Del" />

</menu>
```

这里创建两个菜单选项，`<item>` 标签就是用来创建一个具体的菜单项，`id` 是唯一标识符，`title` 是名称。

然后在 `Activity` 中重写 `onCreateOptionsMenu()` 方法。(快捷键：`Ctrl + O`、Mac：`control + O`)

``` java
public boolean onCreateOptionsMenu(Menu menu) {
    getMenuInflater().inflate(R.menu.main,menu);
    return super.onCreateOptionsMenu(menu);
}
```

`getMenuInflater()` 方法能够获得 `MenuInflater` 对象，再调用 `inflate()` 方法就可以给当前活动创建菜单了。

`inflate()` 第一个参数指定用哪一个资源文件创建菜单，第二个参数指定菜单项将添加到哪一个 `Menu` 对象中，这里直接使用 `onCreateOptionsMenu()` 方法中的 `menu` 参数。

返回值要是返回 `false`，创建的菜单无法显示。


# 2. 菜单响应

重写 `onOptionsItemSelected()` 方法：

``` java 
public boolean onOptionsItemSelected(MenuItem item) {
    switch (item.getItemId()){
        case R.id.add_item:
            Toast.makeText(MainActivity.this,"add Menu!",Toast.LENGTH_SHORT).show();
            break;
        case R.id.del_item:
            Toast.makeText(MainActivity.this,"del Menu!",Toast.LENGTH_SHORT).show();
            break;
    }
    return super.onOptionsItemSelected(item);
}
```

这里就是给菜单添加逻辑处理，通过 `item.getItemId()` 判断点击哪一个菜单选项，然后执行相应的功能。

 