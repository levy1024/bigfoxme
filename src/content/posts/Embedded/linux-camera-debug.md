---
title: "Linux 平台调试摄像头的常用命令"
published: 2025-03-04
tags:
- Camera
- Linux
category: 嵌入式
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## 列出系统中所有的 USB 设备，包括 USB 摄像头
lsusb  可查看设备号、厂商ID和产品ID  
lsusb -t  可查看拓扑和速度  

## 内核对 USB (或 UVC) 设备的加载和识别过程
dmesg | grep -i usb  
dmesg | grep -i uvc  

## 检查内核模块是否加载 UVC 驱动
lsmod | grep uvcvideo  

## 查看 UVC 驱动版本
cat /sys/module/uvcvideo/version  
modinfo uvcvideo | grep version  

## 查看设备节点  
ls /dev/video*  

## 使用 ffplay 进行实时预览
为了能够在系统上使用 ffplay, 需要先确保已正确安装了 FFmpeg 。  
sudo apt install ffmpeg  
ffplay /dev/video25  

## 使用 cheese 进行实时预览
cheese 是一个简单的摄像头应用程序，可以用来进行实时预览和拍摄照片或视频。  
apt install cheese  
cheese  

## 使用 guvcview 进行高级控制
guvcview 提供了更多的摄像头控制选项，可以用来进行高级调试。  
sudo apt install guvcview  
guvcview  

## v4l2-ctl
v4l2-ctl 是 Linux 系统中用于控制 Video for Linux 2 (V4L2) 设备的命令行工具，主要用于管理摄像头、视频采集卡等多媒体设备的参数和功能。  

### 安装v4l2-ctl (Debian/Ubuntu)  
sudo apt install v4l-utils  

### 全部选项
```shell
bigfox@ubuntu:~$ v4l2-ctl -h

General/Common options:
  --all              display all information available
  -C, --get-ctrl=<ctrl>[,<ctrl>...]
                     get the value of the controls [VIDIOC_G_EXT_CTRLS]
  -c, --set-ctrl=<ctrl>=<val>[,<ctrl>=<val>...]
                     set the value of the controls [VIDIOC_S_EXT_CTRLS]
  -D, --info         show driver info [VIDIOC_QUERYCAP]
  -d, --device=<dev> use device <dev> instead of /dev/video0
                     if <dev> starts with a digit, then /dev/video<dev> is used
  -e, --out-device=<dev> use device <dev> for output streams instead of the
                     default device as set with --device
                     if <dev> starts with a digit, then /dev/video<dev> is used
  -h, --help         display this help message
  --help-all         all options
  --help-io          input/output options
  --help-misc        miscellaneous options
  --help-overlay     overlay format options
  --help-sdr         SDR format options
  --help-selection   crop/selection options
  --help-stds        standards and other video timings options
  --help-streaming   streaming options
  --help-tuner       tuner/modulator options
  --help-vbi         VBI format options
  --help-vidcap      video capture format options
  --help-vidout      vidout output format options
  --help-edid        edid handling options
  -k, --concise      be more concise if possible.
  -l, --list-ctrls   display all controls and their values [VIDIOC_QUERYCTRL]
  -L, --list-ctrls-menus
                     display all controls and their menus [VIDIOC_QUERYMENU]
  -r, --subset=<ctrl>[,<offset>,<size>]+
                     the subset of the N-dimensional array to get/set for control <ctrl>,
                     for every dimension an (<offset>, <size>) tuple is given.
  -w, --wrapper      use the libv4l2 wrapper library.
  --list-devices     list all v4l devices
  --log-status       log the board status in the kernel log [VIDIOC_LOG_STATUS]
  --get-priority     query the current access priority [VIDIOC_G_PRIORITY]
  --set-priority=<prio>
                     set the new access priority [VIDIOC_S_PRIORITY]
                     <prio> is 1 (background), 2 (interactive) or 3 (record)
  --silent           only set the result code, do not print any messages
  --sleep=<secs>     sleep <secs>, call QUERYCAP and close the file handle
  --verbose          turn on verbose ioctl status reporting
bigfox@ubuntu:~$

```

### 常用选项说明
列出所有 V4L2 设备：v4l2-ctl --list-devices  

查看摄像头支持的图像格式：v4l2-ctl -d /dev/video25 --list-formats  
查看摄像头支持的图像格式和分辨率：v4l2-ctl -d /dev/video25 --list-formats-ext  
查看摄像头详细参数：v4l2-ctl -d /dev/video25 --all  
查看摄像头驱动信息：v4l2-ctl -d /dev/video25 -D  
查看摄像头编码格式所支持的分辨率：  
v4l2-ctl --list-framesizes=MJPG -d /dev/video25  
v4l2-ctl --list-framesizes=YUYV -d /dev/video25  
设置帧率：v4l2-ctl --device=/dev/video25 --set-parm=30  

设置摄像头的编码格式和分辨率：v4l2-ctl -d /dev/video25 --set-fmt-video=width=640,height=480,pixelformat=MJPG  
查看摄像头编码格式和分辨率：v4l2-ctl -d /dev/video25 --get-fmt-video  

设置摄像头曝光参数、亮度、对比度等参数：  
v4l2-ctl -d /dev/video25 --set-ctrl=exposure_auto=1 # 关闭自动曝光  
v4l2-ctl -d /dev/video25 --set-ctrl=exposure_absolute=1000  
v4l2-ctl -d /dev/video25 --set-ctrl=brightness=128  
v4l2-ctl -d /dev/video25 --set-ctrl=contrast=32  
并非所有摄像头支持所有控制参数，--list-ctrls 可以查看支持的参数：  
v4l2-ctl --list-ctrls  
v4l2-ctl --list-ctrls-menus  

### 拍照    
v4l2-ctl -d /dev/video25 --set-fmt-video=width=2592,height=1944,pixelformat=MJPG --stream-mmap=3 --stream-to=/userdata/media/test.jpg --stream-count=1 --stream-skip=3 --stream-poll  
参数说明：  
-d /dev/video25 指定video设备  
--set-fmt-video 指定宽高及pxielformat  
--stream-mmap 指定内存映射缓冲区的数量
--stream-to 指定帧数据保存的文件路径  
--stream-count 指定抓取的帧数  
--stream-skip 指定丢弃（不保存到文件）前 3 帧  
--stream-poll 该选项指示 v4l2-ctl 采用异步 IO 

### 录像  
v4l2-ctl -d /dev/video25 --set-fmt-video=width=1920,height=1080,pixelformat=MJPG --stream-mmap=3 --stream-to=/userdata/media/test --stream-count=120 --stream-skip=3 --stream-poll  

录像后的视频流封装为可播放的 mp4 格式（使用 ffmpeg)：  
/oem/usr/bin/ffmpeg -r 60 -i /userdata/media/test -b:v 10M /userdata/media/test.mp4 -y  
参数说明：  
-r：设置帧率  
-i：输入文件  
-b:v：设置码率  
-y：不用确认覆盖同名文件  

### 选项总结
--all	显示设备全部信息  
--list-devices	列出视频设备及节点  
--list-formats / --list-formats-ext	列出支持的视频格式和分辨率  
--get-fmt-video / --set-fmt-video	获取或设置视频格式（分辨率、像素格式）  
--get-parm / --set-parm	获取或设置帧率  
--get-ctrl / --set-ctrl	获取或设置控制参数（亮度、曝光等）  
--stream-mmap=N		使用内存映射方式抓帧  
--stream-to=文件名		抓帧数据保存到文件  
--stream-count=N		抓取 N 帧  

## media-ctl
media-ctl 是 Linux 系统中用于配置和管理 V4L2（Video for Linux 2）子设备的命令行工具，它主要用于配置媒体控制器（Media Controller）框架下的复杂视频设备（如摄像头、图像传感器、CSI/DSI接口、图像处理单元等）的拓扑结构和数据流路径。  
```shell
bigfox@ubuntu:~$ media-ctl -h
media-ctl [options]
-d, --device dev        Media device name (default: /dev/media0)
-e, --entity name       Print the device name associated with the given entity
-V, --set-v4l2 v4l2     Comma-separated list of formats to setup
    --get-v4l2 pad      Print the active format on a given pad
    --set-dv pad        Configure DV timings on a given pad
-h, --help              Show verbose help and exit
-i, --interactive       Modify links interactively
-l, --links links       Comma-separated list of link descriptors to setup
    --known-mbus-fmts   List known media bus formats and their numeric values
-p, --print-topology    Print the device topology. If an entity
                        is specified through the -e option, print
                        information for that entity only.
    --print-dot         Print the device topology as a dot graph
-r, --reset             Reset all links to inactive
-v, --verbose           Be verbose
......
bigfox@ubuntu:~$ 
```

## 参考
[RK3576——MIPI CSI之v4l2-ctl、media-ctl命令分析](https://blog.csdn.net/m0_49857167/article/details/145603913 "RK3576——MIPI CSI之v4l2-ctl、media-ctl命令分析")
