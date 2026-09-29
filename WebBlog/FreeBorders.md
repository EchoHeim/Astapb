# 像风一样自由

## 1. 下载客户端软件

> 软件是 [github] 上一位大神开源的一款代理软件：[Clash](https://github.com/Fndroid/clash_for_windows_pkg/releases)

按照系统平台可以自行下载!

![image](https://github.com/EchoHeim/EchoHeim/assets/26021085/a0bbf7c1-edbb-4ef0-8cec-592868437aeb)

由于 github 在境内访问有时会不那么顺畅，这里我已经下载好(部分)放在网盘里

- [Android](https://416604093.lanzoue.com/ivqrC10zifmh)      
- [Windows-x64](https://416604093.lanzoue.com/iVbvw10zi9ba)        
- [Windows-x32](https://416604093.lanzoue.com/ikZtT10zj76j)   
- [Windows-arm64](https://416604093.lanzoue.com/iG5yU10zjtgb)


## 2. 获取订阅链接

1. 关注微信公众号
   
    `程序小猴`

    ![image](https://github.com/EchoHeim/EchoHeim/assets/26021085/a41c8b31-1850-4414-8235-d0a6de43399f)

2. 查看底部菜单栏
   
    ![image](https://github.com/EchoHeim/EchoHeim/assets/26021085/18255a19-a7a8-4abd-a905-0dd348ad1d53)

> 有问题可以 公众号 聊天窗口发消息留言!

## 3. 客户端软件使用

### 3.1 windows 系统

1. 下载客户端软件。
   
2. 打开软件后，在客户端软件侧边栏的 `配置` 页面，复制 `订阅链接` 到顶部的输入栏，然后点击 `Download`；

    ![image](https://github.com/EchoHeim/EchoHeim/assets/26021085/48c02c37-24c9-412c-aef3-0b97caeab487)

3. 下载完成后会在下方出现刚刚导入的 配置文件，然后点击客户端的侧边栏的`常规设置`，打开`系统代理(System Proxy)`开关 即可启用代理。
   
    > 最下面的是开机自启动开关。如果需要开启局域网代理，还要打开最上面的局域网开关。

    ![image](https://github.com/EchoHeim/EchoHeim/assets/26021085/a9c74869-7a8e-4be4-9a0f-ed52b17e823c)

4. 选择侧边栏里的 代理设置，最上方一般选择 `规则(Rule)` 就行，选择 `🔰 选择节点` 分组下的节点即可切换节点。

    ![image](https://github.com/EchoHeim/EchoHeim/assets/26021085/e9ea85cc-2773-4c48-a187-bced2069acd2)

> 其他系统平台软件使用，参照 windows 版本。

### 3.2 MacOS 系统

1. 下载客户端软件并 安装 & 打开；
   
2. 点击屏幕右上角 ClashX 图标，选择 “配置” > “托管配置” > “管理”，点击 “添加”，粘贴 `订阅链接` 到 Url，Config Name 可留空。

3. 点击 ClashX 图标，勾选 “设置为系统代理” 即可启用。

4. 点击 ClashX 图标，选择“配置” > “托管配置” > “更新”，即可更新节点。

5. 点击 ClashX 图标，选择 Proxy 分组下的节点即可切换节点。

### 3.3 Linux 系统

1. 创建 clash 文件夹
   
    `cd && mkdir clash`

    下载适合的 Clash 二进制文件并解压重命名为 clash。

    一般个人的64位电脑下载 clash-linux-amd64.tar.gz 即可。[下载链接](https://github.com/Dreamacro/clash/releases)

2. 下载配置文件
   
    ``` shell
    cd clash
    wget -O config.yaml "https://api.ikuuu.science/link/IaWLj1JMtAdw5v2w?clash=3"
    ```

    > 注：这里命令只是示例，引号中的链接就是订阅链接，需要手动修改。

3. 启动 Clash
   
    `./clash -d .`

    同时启动 HTTP 代理和 Socks5 代理。

    如提示权限不足，请执行 

    `chmod +x clash`

4. 访问 [Clash Dashboard](http://clash.razord.top/#/proxies) 可以进行切换节点、测延迟等操作。
   
    Host: 127.0.0.1                 端口: 9090

5. 启用系统代理
   
    以 Ubuntu 20.04 为例，打开系统设置，选择网络，点击网络代理右边的 ⚙ 按钮，选择手动；
    - 填写 HTTP 和 HTTPS 代理为 127.0.0.1:7890；
    - 填写 Socks 主机为 127.0.0.1:7891；

### 3.4 Android 系统

1. 下载软件并安装；
   
2. 打开客户端，点击 配置，点击 + 新配置，选择 URL，将托管配置链接粘贴到 URL 的框内，点击右上角 💾 按钮即可。

3. 回到主界面，点击顶部灰色卡片，卡片颜色变成蓝色即代表代理已开启。

4. 开启后，可在第二个卡片 代理 里切换节点。

    ![image](https://github.com/EchoHeim/EchoHeim/assets/26021085/5f49a89d-d9cb-4227-83eb-43847ef0720c)

### 3.5 iOS 系统

1. 下载安装 Shadowrocket 小火箭；

2. 打开 Shadowrocket 首页，点击右上角的加号，再次点击第一行的「类型」，选择 Subscribe。随后在「URL」中粘贴订阅链接。

3. 打开小火箭开关，进入配置选项卡，点击添加配置

    `配置链接：
    https://raw.githubusercontent.com/Hackl0us/Surge-Rule-Snippets/master/LAZY_RULES/Shadowrocket.conf`

4. 粘贴配置链接，点击下载；

5. 点击新增的配置文件，选择使用配置；

> 注：ios平台没有找到免费好用的软件，如果需要，关注公众号（`程序小猴`），回复 `ios客户端软件` 即可。  

## 4. 客户端升级

> 为了保证软件功能正常使用，以及避免出现未知问题，建议及时更新客户端软件版本。

> 可以在 Clash git官网 上手动下载最新版软件安装，也可以在客户端软件内在线升级；

这里以 `windows` 版本为例，在软件主界面，点击 `版本号`  

![image](https://github.com/EchoHeim/EchoHeim/assets/26021085/e17ab35c-bf31-45bf-ad91-6990cc7e1abb)

如果有更新，会弹出最新版本的软件更新信息，点击 `更新(Update)` 即可，也可以点击 `下载(Download)`，然后手动安装。

在线升级的时候，在软件上方会显示更新进度，更新完成后会有弹窗提示，点击 `是` 即可。软件重新打开后，会发现版本号已经更新，再次点击版本号，会提示软件已经是最新版本。

## 5. 常见问题

1. 如果当前节点出现访问故障。可以点击右侧 `信号扫描` 标志进行节点测速，然后选择延时较低的节点使用即可。

    ![image](https://github.com/EchoHeim/EchoHeim/assets/26021085/a97fa037-2b9e-4579-b625-32cf18beb602)

2. 或者在 配置 页面，点击 配置文件 上的刷新按钮进行节点更新。

    ![image](https://github.com/EchoHeim/EchoHeim/assets/26021085/4a64581e-95bb-4dee-9605-c4456c90e77c)
