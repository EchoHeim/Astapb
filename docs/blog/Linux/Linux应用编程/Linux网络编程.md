### <center> <font size=34 face="STKaiti"> Linux访问PHY芯片寄存器 </font>    <!-- {docsify-ignore} -->

> 在嵌入式linux开发中，可以通过smi/mdio总线访问PHY芯片寄存器，获取PHY芯片的状态。

# 1. C程序代码

``` C++
/***********************************************
Linux 下smi/mdio总线通信

下面代码描述了在用户层访问smi/mdio总线， 读写phy芯片寄存器的通用代码。Linux内核2.6以上通用。
将代码编译生成可执行文件 mdio

gcc read_mdio.c -o mdio

mdio eth0 1          	读取phy寄存器1的数值
mdio eth0 0 0x1120      将0x1120写入 phy寄存器0
eth0 为mac层控制器的名称， 一般为eth0或mgmt0或ens33。
************************************************/
 
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <linux/mii.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/ioctl.h>
#include <net/if.h>
#include <linux/sockios.h>
#include <linux/types.h>
#include <netinet/in.h>

#define reteck(ret)     \
        if(ret < 0){    \
            printf("%m! \"%s\" : line: %d\n", __func__, __LINE__);   \
            goto lab;   \
        }

#define help() \
    printf("mdio:\n");                  \
    printf("read operation: mdio reg_addr\n");          \
    printf("write operation: mdio reg_addr value\n");    \
    printf("For example:\n");            \
    printf("mdio eth0 1\n");             \
    printf("mdio eth0 0 0x12\n\n");      \
    exit(0);

int sockfd;

int main(int argc, char *argv[]){
    
    if(argc == 1 || !strcmp(argv[1], "-h")){
        help();
    }
    
    struct mii_ioctl_data *mii = NULL;
    struct ifreq ifr;
    int ret;
    
    memset(&ifr, 0, sizeof(ifr));
    strncpy(ifr.ifr_name, argv[1], IFNAMSIZ - 1);
    
    sockfd = socket(PF_LOCAL, SOCK_DGRAM, 0);
    reteck(sockfd);
    
    //get phy address in smi bus
    ret = ioctl(sockfd, SIOCGMIIPHY, &ifr);
    reteck(ret);
    
    mii = (struct mii_ioctl_data*)&ifr.ifr_data;
    
    if(argc == 3){
        
        mii->reg_num    = (uint16_t)strtoul(argv[2], NULL, 0);
        
        ret = ioctl(sockfd, SIOCGMIIREG, &ifr);
        reteck(ret);
        
        printf("read phy addr: 0x%x  reg: 0x%x   value : 0x%x\n\n", mii->phy_id, mii->reg_num, mii->val_out);
	}else if(argc == 4){
        
        mii->reg_num    = (uint16_t)strtoul(argv[2], NULL, 0);
        mii->val_in     = (uint16_t)strtoul(argv[3], NULL, 0);
        
        ret = ioctl(sockfd, SIOCSMIIREG, &ifr);
        reteck(ret);
        
        printf("write phy addr: 0x%x  reg: 0x%x  value : 0x%x\n\n", mii->phy_id, mii->reg_num, mii->val_in);
    }
    
lab:
    close(sockfd);
    return 0;
}
```

# 2. 编译测试

``` bash
# lodge @ lodge-ubuntu in ~ [11:30:50] 
$ gcc read_mdio.c -o mdio
read_mdio.c: In function ‘main’:
read_mdio.c:85:5: warning: implicit declaration of function ‘close’; did you mean ‘pclose’? [-Wimplicit-function-declaration]
   85 |     close(sockfd);
      |     ^~~~~
      |     pclose

# lodge @ lodge-ubuntu in ~ [11:31:06] 
$ sudo ./mdio eth0 0x02
read phy addr: 0x1  reg: 0x2   value : 0x4f51
```

# 3. 在read操作里面判断phy的link状态

``` C++
if(mii->val_out& 0x0004){
 
	printf("linkup\n");
}else{
 
	printf("linkdown\n");
}
```

!> 关于mii->val_out& 0x0004

> 大多数phy芯片的寄存器0为控制寄存器, 寄存器1 为状态寄存器，寄存器3和4为 Identifiier Register，这里的内容为phy芯片产商的识别码。
>> 举例，marvell 88E1116，无论是光口模式还是电口模式，寄存器1都是 Status register。一般寄存器有16个bit， 第2个bit为link 状态， 第5个bit为自动协商， 一般这个状态寄存器的数值为： 0x796d。部分bit位说明如下
    14bit ： 有能力实现全双工100BASE-X工作模式
    13bit :  有能力实现半双工 100BASE-X工作模式
    12bit ：  有能力实现全双工 10BASE-T工作模式
    11 bit ：  有能力实现半双工 10BASE-T工作模式
    8bit ： 扩展信息描述在寄存器15.
    6bit :  MF报头抑制
    5bit ： 自动协商完成
    3bit ： 有能力自动协商
    2bit ： link 状态： up
    0bit ： 有扩展寄存器


