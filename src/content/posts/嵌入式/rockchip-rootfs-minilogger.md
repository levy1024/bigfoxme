---
title: "编译 rootfs 时出现：Could not find a package configuration file provided by MiniLogger"
published: 2025-08-14
tags:
- Linux
- Rockchip
category: 嵌入式
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## 起因
半年前用瑞芯微的 RV1109 芯片及 SDK 进行软件开发，顺利完成编译 SDK。最近需要重新去编译 SDK，因为移动了 SDK 的位置，不得不`./build.sh cleanall`清空原有的编译输出，重新编译系统（如果不清空，直接编译，经实操，编译错误更多，解决一个还有下一个，无法进行下去）。

## 问题
当使用`./build.sh all`重新编译到 rootfs 时，编译失败，提示：Could not find a package configuration file provided by "MiniLogger"。  
编译输出如下（其中 ...... 表示省略了非关键的信息）：
```shell
2025-08-07T09:46:33 >>> ipcweb-backend release Syncing from source dir /home/levy/RV1109/P30/rv1109-26-25/buildroot/../app/ipcweb-backend
......
2025-08-07T09:46:42 >>> ipcweb-backend release Configuring
......
2025-08-07T09:46:42 -- The CXX compiler identification is GNU 8.3.0
......
2025-08-07T09:46:42 -- Detecting CXX compiler ABI info
2025-08-07T09:46:42 -- Detecting CXX compiler ABI info - done
2025-08-07T09:46:42 -- Detecting CXX compile features
2025-08-07T09:46:43 -- Detecting CXX compile features - done
2025-08-07T09:46:44 CMake Error at CMakeLists.txt:29 (find_package):
2025-08-07T09:46:44 By not providing "FindMiniLogger.cmake" in CMAKE_MODULE_PATH this project
2025-08-07T09:46:44 has asked CMake to find a package configuration file provided by
2025-08-07T09:46:44 "MiniLogger", but CMake did not find one.
2025-08-07T09:46:44
2025-08-07T09:46:44 Could not find a package configuration file provided by "MiniLogger" with
2025-08-07T09:46:44 any of the following names:
2025-08-07T09:46:44
2025-08-07T09:46:44 MiniLoggerConfig.cmake
2025-08-07T09:46:44 minilogger-config.cmake
2025-08-07T09:46:44
2025-08-07T09:46:44 Add the installation prefix of "MiniLogger" to CMAKE_PREFIX_PATH or set
2025-08-07T09:46:44 "MiniLogger_DIR" to a directory containing one of the above files.  If
2025-08-07T09:46:44 "MiniLogger" provides a separate development package or SDK, be sure it has
2025-08-07T09:46:44 been installed.
2025-08-07T09:46:44
2025-08-07T09:46:44
2025-08-07T09:46:44 -- Configuring incomplete, errors occurred!
```

## 排查
出现这个现象，首先想到的是 MiniLogger 的编译配置没有选中。但是经确认，MiniLogger 的编译配置是打开的！

## 原因
ipcweb-backend 的编译依赖于 MiniLogger 先编译，但是 MiniLogger 没有先编译。
为什么MiniLogger 没有先编译？编译输出中可能有详细原因，但是我不想去改动官方 SDK。

## 解决办法
1. 在 SDK 目录下，运行 make menuconfig，先取消 ipcweb-backend 的编译配置：
> Target packages → Rockchip BSP packages 
  [ ]   ipcweb backend for Linux  
2. 重新编译 rootfs；
3. 如果需要 ipcweb-backend，再打开配置，再编译。

