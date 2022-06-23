#!/bin/bash

# open web_camera server

cd /home/biqu

cd mjpg-streamer/mjpg-streamer-experimental/

./mjpg_streamer -i "./input_uvc.so -d /dev/video0" -o "./output_http.so -w ./www" &

