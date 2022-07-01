#!/bin/sh
   
   echo "Start wifi ..."
   
   if [ ! -e /var/run/wpa_supplicant]
   then
   mkdir -p /var/run/wpa_supplicant
   fi
   
  busybox ifconfig wlan0 up
  
  ps -fe|grep wpa_supplicant |grep -v grep
  
  if [ $? -ne 0 ]
  then
  wpa_supplicant -Dnl80211 -iwlan0 -c/etc/wifi/wpa_supplicant.conf&
  fi
  
  echo "######$1"
  
  if [ "$1" = "ap" ]
  then
  
      echo "Start wifi AP..."
  
      if [ ! $# == 2 ]
      then
          echo "Please input : start-wifi ap 192.168.1.xx(1-19)"
          exit
      fi
  
      if [ ! -e /var/lib/misc ]
     then
     mkdir -p /var/lib/misc
     fi
 
     if [ ! -e /var/lib/misc/udhcpd.leases ]
     then
     touch /var/lib/misc/udhcpd.leases
     fi                                                                                                                                   
 
     ifconfig wlan0 down
 
     result=`cat /sys/module/bcmdhd/parameters/firmware_path`
 
     if [ "$result" != "/usr/firmware/wifi/fw_43341_apsta.bin" ]
     then
     echo "/usr/firmware/wifi/fw_43341_apsta.bin">/sys/module/bcmdhd/parameters/firmware_path
     fi
 
     ifconfig wlan0 $2 up                                                                                                                 
 
    echo "Start hostapd ..."
 
     ps -fe|grep hostapd |grep -v grep
 
     if [ $? -eq 0 ]
     then
         ps -ef | grep hostapd | grep -v grep | awk '{print $1}' | sed -e "s/^/kill -9 /g" | sh -
     fi
 
    hostapd /etc/wifi/hostapd.conf&
 
     echo "Start udhcpd ..."
 
     ps -fe|grep udhcpd |grep -v grep
 
     if [ $? -eq 0 ]
     then
         ps -ef | grep udhcpd | grep -v grep | awk '{print $1}' | sed -e "s/^/kill -9 /g" | sh -
     fi
 
     udhcpd -fS /etc/udhcpd.conf&

     echo "Wifi AP finshed!"
 
 elif [ "$1" = "sta" ]
 then
     ifconfig wlan0 down
 
     result=`cat /sys/module/bcmdhd/parameters/firmware_path`
 
     if [ "$result" != "/usr/firmware/wifi/fw_43341.bin" ]
    then
     echo "/usr/firmware/wifi/fw_43341.bin">/sys/module/bcmdhd/parameters/firmware_path
     fi
 
     ifconfig wlan0 up
 
    udhcpc -i wlan0
 
 else
 
     echo "Error!! Please input again!"
    
 fi