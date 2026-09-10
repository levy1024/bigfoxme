---
title: "C 盘满了，如何完全安装 Android Studio 至 D 盘？"
published: 2025-05-23
tags:
- Android Studio
category: Android
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

Android Studio 非常占用磁盘空间，C 盘空间不足，需要完全安装 Android Studio 至 D 盘。  
下面是自己安装过程的一个简单记录：  
1. 安装 Android studio IDE 时，选择 D 盘的目录。  
2. 迁移 .gradle 文件至 D 盘。  
	不需要把 .gradle 目录拷贝到 D 盘， .gradle 目录可以重建。（原因：目录很大；拷贝过程中会因为路径太长不能完全拷贝，导致拷贝不完全）  
	参考：[https://zhuanlan.zhihu.com/p/24519564798](https://zhuanlan.zhihu.com/p/24519564798)  修改 gradle 的下载地址，否则因国内网络环境的原因，导致 sync 失败。  
3. 迁移 SDK 目录至 D 盘。  
4. 迁移 AVD 至 D 盘。  

每一步具体如何操作，可在网络上搜索，比如：  
[https://blog.csdn.net/weixin_44987713/article/details/115656391](https://blog.csdn.net/weixin_44987713/article/details/115656391 "https://blog.csdn.net/weixin_44987713/article/details/115656391")    
[https://blog.csdn.net/AoXue2017/article/details/130322535](https://blog.csdn.net/AoXue2017/article/details/130322535 "https://blog.csdn.net/AoXue2017/article/details/130322535")  
