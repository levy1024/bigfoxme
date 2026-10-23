---
title: "嵌入式 Linux 系统中，未识别 USB CDC 设备的解决办法"
published: 2025-03-18
tags:
- Linux
- USB 
category: 嵌入式
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## 起因
最近在使用瑞芯微的 RV1109 芯片及 SDK 进行软件开发，需要使用 USB CDC 协议与 GD32L233 通信。  

## 问题
GD32L233 上已经运行了 USB CDC 的 Demo 程序，通过 USB 接口接入 PC，PC 可识别出一个虚拟串口。  
但是当把 GD32L233 通过 USB 接口接入 RV1109 开发板，通过 `ls /dev/tty*` 查看，没有此设备的设备文件。  

## 排查
通过拔插 USB 连接线，插入连接线时开发板的 dmesg 信息如下：
``` 
[  418.101649] usb 1-1.2.3: new full-speed USB device number 11 using ehci-platform
[  418.201364] usb 1-1.2.3: New USB device found, idVendor=28e9, idProduct=018a, bcdDevice= 1.00
[  418.201540] usb 1-1.2.3: New USB device strings: Mfr=1, Product=2, SerialNumber=3
[  418.201653] usb 1-1.2.3: Product: GD32-CDC_ACM
[  418.201687] usb 1-1.2.3: Manufacturer: GigaDevice
[  418.201714] usb 1-1.2.3: SerialNumber: 8F7FA3710636
```
表明已识别出 USB 设备，但是没有设备文件。

## 解决办法
在 SDK 的 kernel 目录下，运行 make menuconfig，内核打开配置：
> Device Drivers > USB support ：USB Modem (CDC ACM) support 

重新编译内核，烧录到开发板。

## 验证
再次拔插 USB 连接线，开发板的 dmesg 信息如下：
```
[ 1098.801007] usb 1-1.2: new full-speed USB device number 6 using ehci-platform
[ 1098.919135] usb 1-1.2: New USB device found, idVendor=28e9, idProduct=018a, bcdDevice= 1.00
[ 1098.919203] usb 1-1.2: New USB device strings: Mfr=1, Product=2, SerialNumber=3
[ 1098.919233] usb 1-1.2: Product: GD32-CDC_ACM
[ 1098.919270] usb 1-1.2: Manufacturer: GigaDevice
[ 1098.919308] usb 1-1.2: SerialNumber: 8F7FA3710636
[ 1098.921296] cdc_acm 1-1.2:1.0: ttyACM0: USB ACM device
```
表明已识别出USB 设备，并且其设备文件为：ttyACM0。