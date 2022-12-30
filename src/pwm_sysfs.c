#include <stdio.h>
#include <fcntl.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/time.h>
#include <unistd.h>
#include <string.h>
#include <sys/ioctl.h>
#include <linux/ioctl.h>
#include <linux/i2c-dev.h>
#include <errno.h>

#define dbmsg(fmt, args...) printf("%s[%d]: " fmt "\n", __FUNCTION__, __LINE__, ##args)

#define I2C_ADDR 0x5c

#define DUTY "duty"
#define PERIOD "1000000"
#define DUTYCYCLE "800000"

int bh1750_Init(void)
{
    int fd;
    char val;

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

    return fd;
}

float read_lights(int fd_i2c)
{
    char buf[3];
    float flight, flight_avg = 0.0;

    usleep(200000);
    for (char i = 0; i < 8; i++)
    {
        if (read(fd_i2c, &buf, 3))
        {
            flight = (buf[0] * 256 + buf[1]) * 0.5 / 1.2;
            // printf("light: %6.2flx\n", flight);
        }
        else
        {
            printf("read error!\n");
        }
        flight_avg += flight;
    }
    flight_avg = flight_avg / 8.0;

    return flight_avg;
}

int pwm_setup()
{
    int fd, ret;
    int fd_period = 0, fd_duty = 0, fd_enable = 0;

    fd = open("/sys/class/pwm/pwmchip0/export", O_WRONLY);
    if (fd < 0)
    {
        dbmsg("open export error\n");
        return -1;
    }
    ret = write(fd, "3", strlen("3"));
    if (ret < 0)
    {
        dbmsg("creat pwm3 error\n");
        return -1;
    }

    fd_period = open("/sys/class/pwm/pwmchip0/pwm3/period", O_RDWR);
    fd_duty = open("/sys/class/pwm/pwmchip0/pwm3/duty_cycle", O_RDWR);
    fd_enable = open("/sys/class/pwm/pwmchip0/pwm3/enable", O_RDWR);

    if ((fd_period < 0) || (fd_duty < 0) || (fd_enable < 0))
    {
        dbmsg("open error\n");
        return -1;
    }

    ret = write(fd_period, PERIOD, strlen(PERIOD));
    if (ret < 0)
    {
        dbmsg("change period error\n");
        return -1;
    }

    ret = write(fd_duty, DUTYCYCLE, strlen(DUTYCYCLE));
    if (ret < 0)
    {
        dbmsg("change duty_cycle error\n");
        return -1;
    }

    ret = write(fd_enable, "1", strlen("1"));
    if (ret < 0)
    {
        dbmsg("enable pwm3 error\n");
        return -1;
    }

    return fd_duty;
}

void ChangeLight(int fd_light, char light_level_now, char light_level_next)
{
    int ret, level = 0;
    float light[11] = {10000, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000};

    char str_light[8];
    float tmp_light = light[light_level_now];

    for (unsigned char i = 1; i < 250; i++)
    {
        if (light_level_now > light_level_next)
        {
            tmp_light = light[light_level_now] - i * 4000;
            if (tmp_light < light[light_level_next])
                break;
        }
        else if (light_level_now < light_level_next)
        {
            tmp_light = light[light_level_now] + i * 4000;
            if (tmp_light >= light[light_level_next])
                break;
        }

        gcvt(tmp_light, 8, str_light); // float to str;
        // printf("str_light: %s len: %d\n", str_light, strlen(str_light));

        ret = write(fd_light, str_light, strlen(str_light));
        if (ret < 0)
        {
            dbmsg("change duty_cycle error\n");
            return;
        }

        usleep(8000);
    }
}

int main(int argc, char *argv[])
{
    int ret, fd_light;
    int num;
    int fd_bh1750 = 0;
    float f_light;

    char light_level, light_level_now = 8;

    fd_bh1750 = bh1750_Init();
    fd_light = pwm_setup();

    while (1)
    {
        f_light = read_lights(fd_bh1750);

        if (f_light < 60)
            light_level = 0;
        else if (f_light < 100)
            light_level = 1;
        else if (f_light < 150)
            light_level = 2;
        else if (f_light < 200)
            light_level = 3;
        else if (f_light < 250)
            light_level = 4;
        else if (f_light < 300)
            light_level = 5;
        else if (f_light < 400)
            light_level = 6;
        else if (f_light < 500)
            light_level = 7;
        else if (f_light < 700)
            light_level = 8;
        else if (f_light < 1000)
            light_level = 9;
        else
            light_level = 10;

        ChangeLight(fd_light, light_level_now, light_level);
        light_level_now = light_level;
    }

    return 0;
}
