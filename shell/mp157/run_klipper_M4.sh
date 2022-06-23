#!/bin/bash

if [ $# != 0 ]; then
	sudo chmod 666 /sys/class/remoteproc/remoteproc0/firmware
	sudo chmod 666 /sys/class/remoteproc/remoteproc0/state

	sudo echo stop > /sys/class/remoteproc/remoteproc0/state

	echo -e " Del:\r\n/lib/firmware:\r\n"
	sudo rm /lib/firmware/$1 -f
	ls /lib/firmware

	sudo mv $1  /lib/firmware/ -f
	
	echo -e " Copy:\r\n/lib/firmware:\r\n"
	ls /lib/firmware
	echo ""

	sudo echo $1 > /sys/class/remoteproc/remoteproc0/firmware

	sudo echo start > /sys/class/remoteproc/remoteproc0/state
else
	echo "Please try again!"
fi
