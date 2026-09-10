---
title: "Windows 下 C 盘爆满，如何安装 Docker 及其数据等至其它盘"
published: 2025-07-22
tags:
- Docker
category: 运维
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

首先，你可以搜索网络文章解决，如果遇到问题，再往下看。  

第1步：安装 WSL2  
第2步：下载 Docker Desktop  
第3步：以管理员身份打开 Windows 终端，进入下载的安装文件所在文件夹，输入：  
./"Docker Desktop Installer.exe" install --backend=wsl-2 --installation-dir=E:\Docker --wsl-default-data-root=E:\Docker\data --accept-license --windows-containers-default-data-root="E:\Docker"  

可能遇到的问题：  

1.  如果安装程序 docker Desktop Installer.exe 也在 --installation-dir 指定的目录，会有如下报错：  
Unpacking failed: 文件“E:\Docker\Docker Desktop Installer.exe”正由另一进程使用，因此该进程无法访问此文件。  
所以，不要把安装程序放在 --installation-dir 指定的目录就可以了。  

2. 程序安装成功后，双击桌面的 Docker Desktop 图标，打不开docker应用程序，解决方法如下：  
这可能是因为 Docker Desktop Service 没有启动，在服务管理器里启动此项服务。  
也可能是需要使用管理员权限打开，右键 Docker Desktop 应用的快捷方式，选择"属性"，点击"高级"，勾选"用管理员身份运行"。  

Docker 网络文章精选：   
[一文介绍Docker高级玩法（满满干货）](https://juejin.cn/post/7306146705971740710 "一文介绍Docker高级玩法（满满干货）")    
[Docker:容器（Container）和镜像(Image)的关系](https://blog.csdn.net/m0_60204812/article/details/139362321 "Docker:容器（Container）和镜像(Image)的关系")    
