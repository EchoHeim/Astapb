sudo hostapd /etc/hostapd/hostapd.conf -B

sudo hostapd hostapd.conf -B

# 这里直接指定使用我们上面写好的配置文件，具体的路径依据实际使用来定，-B将程序放到后台运行

# hostapd启动中常用到的参数说明
	# -h   显示帮助信息
	# -d   显示更多的debug信息 (-dd 获取更多)
	# -B   将hostapd程序运行在后台
	# -g   全局控制接口路径，这个工hostapd_cli使用，一般为/var/run/hostapd
	# -G   控制接口组
	# -P   PID 文件
	# -K   调试信息中包含关键数据
	# -t   调试信息中包含时间戳
	# -v   显示hostapd的版本

sudo ifconfig wlan0 192.168.175.1

sudo udhcpd /etc/udhcpd/udhcpd.conf &        # 加‘&’是程序运行在后台

sudo udhcpd udhcpd.conf &


