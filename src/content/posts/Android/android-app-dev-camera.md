---
title: "Android 相机和媒体应用开发相关链接"
published: 2025-06-10
tags:
- Android
- Camera
category: Android
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## Android 相机和媒体应用  
[https://developer.android.google.cn/media?hl=zh-cn](https://developer.android.google.cn/media?hl=zh-cn "https://developer.android.google.cn/media?hl=zh-cn")  

## 音视频：Jetpack Media3 库  
[https://developer.android.google.cn/media/audio-and-video?hl=zh-cn](https://developer.android.google.cn/media/audio-and-video?hl=zh-cn "https://developer.android.google.cn/media/audio-and-video?hl=zh-cn")  
使用 ExoPlayer 流式传输媒体内容：  
[https://developer.android.google.cn/codelabs/exoplayer-intro?hl=zh-cn#0](https://developer.android.google.cn/codelabs/exoplayer-intro?hl=zh-cn#0 "https://developer.android.google.cn/codelabs/exoplayer-intro?hl=zh-cn#0")  

## 相机：cameraX 库 、camera2 库  
[https://developer.android.google.cn/media/camera/get-started-with-camera?hl=zh-cn](https://developer.android.google.cn/media/camera/get-started-with-camera?hl=zh-cn "https://developer.android.google.cn/media/camera/get-started-with-camera?hl=zh-cn")  
[https://developer.android.google.cn/media/camera/camerax?hl=zh-cn](https://developer.android.google.cn/media/camera/camerax?hl=zh-cn "https://developer.android.google.cn/media/camera/camerax?hl=zh-cn")  

Github 代码示例：  
[https://github.com/android/camera-samples/](https://github.com/android/camera-samples/ "https://github.com/android/camera-samples/")    
CameraX 使用入门：  
[https://developer.android.google.cn/codelabs/camerax-getting-started?hl=zh-cn#0](https://developer.android.google.cn/codelabs/camerax-getting-started?hl=zh-cn#0 "https://developer.android.google.cn/codelabs/camerax-getting-started?hl=zh-cn#0")  

设备等级：  
如果要同时支持预览+视频拍摄，那么相机都能支持。但是如果想预览+视频拍摄+图片拍摄，那么需要LIMITED以及更好的相机，  
而预览+视频拍摄+分析 就需要LEVEL_3以及更好的相机。  
因为很多设备前后双摄的性能是不一样的。所以有些功能后摄支持而前摄不支持。那么如何了解呢？  
可以通过Camera2CameraInfo类来了解。  
等级范围为：LEGACY < LIMITED < FULL < LEVEL_3。

## 参考
[Google CameraX，看这篇文章就够了](https://blog.csdn.net/Mr_ZJC/article/details/140222899 "Google CameraX，看这篇文章就够了")  
[Android NDK开发详解相机之CameraX 架构](https://blog.csdn.net/hnjzfwy/article/details/134331074 "Android NDK开发详解相机之CameraX 架构")  
[安卓kotlin JetPack Compose 实现摄像头监控画面变化并录制视频](https://developer.aliyun.com/article/1536079 "安卓kotlin JetPack Compose 实现摄像头监控画面变化并录制视频")  
[结合JetPack Compose和CameraX实现视频的录制和存储](https://blog.csdn.net/userhu2012/article/details/134413862 "结合JetPack Compose和CameraX实现视频的录制和存储")  


