/***********************************************
Linux 下smi/mdio总线通信

下面代码描述了在用户层访问smi／mdio总线， 读写phy芯片寄存器的通用代码。Linux内核2.6以上通用。
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

#define reteck(ret)                                            \
    if (ret < 0)                                               \
    {                                                          \
        printf("%m! \"%s\" : line: %d\n", __func__, __LINE__); \
        goto lab;                                              \
    }

#define help()                                        \
    printf("mdio:\n");                                \
    printf("read operation: mdio reg_addr\n");        \
    printf("write operation: mdio reg_addr value\n"); \
    printf("For example:\n");                         \
    printf("mdio eth0 1\n");                          \
    printf("mdio eth0 0 0x12\n\n");                   \
    exit(0);

int sockfd;

int main(int argc, char *argv[])
{
    if (argc == 1 || !strcmp(argv[1], "-h"))
    {
        help();
    }

    struct mii_ioctl_data *mii = NULL;
    struct ifreq ifr;
    int ret;

    memset(&ifr, 0, sizeof(ifr));
    strncpy(ifr.ifr_name, argv[1], IFNAMSIZ - 1);

    sockfd = socket(PF_LOCAL, SOCK_DGRAM, 0);
    reteck(sockfd);

    // get phy address in smi bus
    ret = ioctl(sockfd, SIOCGMIIPHY, &ifr);
    reteck(ret);

    mii = (struct mii_ioctl_data *)&ifr.ifr_data;

    if (argc == 3)
    {
        mii->reg_num = (uint16_t)strtoul(argv[2], NULL, 0);

        ret = ioctl(sockfd, SIOCGMIIREG, &ifr);
        reteck(ret);

        printf("read phy addr: 0x%x  reg: 0x%x   value : 0x%x\n\n", mii->phy_id, mii->reg_num, mii->val_out);
    }
    else if (argc == 4)
    {
        mii->reg_num = (uint16_t)strtoul(argv[2], NULL, 0);
        mii->val_in = (uint16_t)strtoul(argv[3], NULL, 0);

        ret = ioctl(sockfd, SIOCSMIIREG, &ifr);
        reteck(ret);

        printf("write phy addr: 0x%x  reg: 0x%x  value : 0x%x\n\n", mii->phy_id, mii->reg_num, mii->val_in);
    }

lab:
    close(sockfd);
    return 0;
}
