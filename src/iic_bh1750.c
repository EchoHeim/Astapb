#include <stdio.h>
#include <fcntl.h>
#include <linux/i2c-dev.h>
#include <errno.h>

#define I2C_ADDR 0x23

int main(void)
{
    int fd;
    char buf[3];
    char val, value;
    float flight;
    fd = open("/dev/i2c-0", O_RDWR);
    if (fd < 0)
    {
        printf("open file error:%s\n", strerror(errno));
        return 1;
    }
    if (ioctl(fd, I2C_SLAVE, I2C_ADDR) < 0)
    {
        printf("ioctl error : %s\n", strerror(errno));
        return 1;
    }
    val = 0x01;
    if (write(fd, &val, 1) < 0)
    {
        printf("power on error!\n");
    }
    val = 0x11;
    if (write(fd, &val, 1) < 0)
    {
        printf("Turn on high-resolution mode 2 error!\n");
    }
    usleep(200000);
    if (read(fd, &buf, 3))
    {
        flight = (buf[0] * 256 + buf[1]) * 0.5 / 1.2;
        printf("light: %6.2flx\n", flight);
    }
    else
    {
        printf("read error!\n");
    }
}
