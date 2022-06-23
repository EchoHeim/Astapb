# 1. MFAST 简介

- 脚本作用

  为了简化本人在实际工作中的重复操作流程
- 目录结构

  > 具体内容可查看相应 `Readme.md` 文件。

  | 文件夹 |      说明      |
  | :-------: | :---------------: |
  | klipper | klipper配置文件 |
  | scripts | 实用小工具脚本 |

> 脚本运行 `不具有`通用性

- 主程序

    Astapb/mfast.sh

# 2. 功能包含

> * 自动备份 (`部分指定文件`)
> * 构建debian文件系统
> * 编译树莓派内核源码
> * 编译和烧录stm32mp157源码
> * 编译香橙派 (`H616`)

![image](https://user-images.githubusercontent.com/26021085/174472486-14a441ff-d8f9-4449-bcb9-73805889b5d6.png)

# 3. 注意事项

## 3.1 共享文件

备份文件脚本需要使用 windows 与 Ubuntu 文件共享，需要在 windows 文件系统里创建两个文件夹 (BackUp、Code)
并且设置成共享文件夹，指定用户可访问;

参考：[https://www.cnblogs.com/smartjourneys/articles/7992298.html](https://www.cnblogs.com/smartjourneys/articles/7992298.html)

## 3.2 FileGee 软件

备份脚本使用到备份软件 FileGee，需要在软件中建立相应的同步任务，可同步到百度网盘;

软件介绍

待添加;
