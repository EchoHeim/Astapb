#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdlib.h>

int main(int argc, unsigned char *argv[])
{
    int fd;
    unsigned char RGB_led[6] = {0x00, 0x00, 0xff, // RGB color
                                0xff, 0x00, 0x00};

    fd = open("/dev/ws2812-led", O_RDWR);
    if (fd < 0)
    {
        printf("Error opening\n");
        return -1;
    }

    unsigned int led1 = 0, led2 = 0;

    if (argc == 2)
    {
        led1 = strtol(argv[1], NULL, 16);
        if (led1 > 0xFFFFFF || led1 < 0x00)
        {
            printf("Input led1 error!\n");
            return -1;
        }

        RGB_led[0] = (led1 >> 16) & 0xFF;
        RGB_led[1] = (led1 >> 8) & 0xFF;
        RGB_led[2] = led1 & 0xFF;
    }
    else if (argc == 3)
    {
        /*直接将16进制字符串转成整形*/
        led1 = strtol(argv[1], NULL, 16);
        if (led1 > 0xFFFFFF || led1 < 0x00)
        {
            printf("Input led1 error!\n");
            return -1;
        }
        led2 = strtol(argv[2], NULL, 16);
        if (led2 > 0xFFFFFF || led2 < 0x00)
        {
            printf("Input led2 error!\n");
            return -1;
        }

        RGB_led[0] = (led1 >> 16) & 0xFF;
        RGB_led[1] = (led1 >> 8) & 0xFF;
        RGB_led[2] = led1 & 0xFF;

        RGB_led[3] = (led2 >> 16) & 0xFF;
        RGB_led[4] = (led2 >> 8) & 0xFF;
        RGB_led[5] = led2 & 0xFF;
    }

    // for (char i = 0; i < 6; i++)
    // {
    //     printf(" 0x%02x", RGB_led[i]);
    // }

    write(fd, RGB_led, 6);

    close(fd);
    return 0;
}
