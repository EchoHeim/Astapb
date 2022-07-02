#!/bin/bash
# open web_camera server

cd /home/biqu/mjpg-streamer
./mjpg_streamer -i "./input_uvc.so -d /dev/video0 -r 320x240 -f 15 -y" -o "./output_http.so -w ./www" &


