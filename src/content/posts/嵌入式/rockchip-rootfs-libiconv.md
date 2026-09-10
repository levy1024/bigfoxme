---
title: "编译 rootfs 时出现：undefined reference to `libiconv'"
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
当使用`./build.sh all`重新编译到 rootfs 时，编译失败，提示：undefined reference to 'libiconv'。编译输出如下（其中 ...... 表示省略了非关键的信息）：
```shell
2025-08-06T17:19:07 >>> host-libglib2 2.64.4 Building
......
[11/400] Compiling C object 'glib/4430778@@glib-2.0@sha/gbacktrace.c.o'
......
[96/400] Linking target glib/libglib-2.0.so.0.6400.4
2025-08-06T17:19:11 FAILED: glib/libglib-2.0.so.0.6400.4
......
2025-08-06T17:19:11 glib/4430778@@glib-2.0@sha/gconvert.c.o: In function `try_conversion':
2025-08-06T17:19:11 gconvert.c:(.text+0x5): undefined reference to `libiconv_open'
2025-08-06T17:19:11 glib/4430778@@glib-2.0@sha/gconvert.c.o: In function `g_iconv':
2025-08-06T17:19:11 gconvert.c:(.text+0x6a1): undefined reference to `libiconv'
2025-08-06T17:19:11 glib/4430778@@glib-2.0@sha/gconvert.c.o: In function `g_iconv_close':
2025-08-06T17:19:11 gconvert.c:(.text+0x6b1): undefined reference to `libiconv_close'
2025-08-06T17:19:11 collect2: error: ld returned 1 exit status
```

## 原因
在这未编译 SDK 的半年的时间里，开发环境发生了变化：我在 Ubuntu 系统中安装了 libiconv 库，和 glib 中的 iconv 库发生了冲突。具体为什么会冲突，未深究，如果感兴趣，可以查看文末参考的文章。

## 解决办法
1. 先通过修改头文件格式的方式，让自己安装的 libiconv 库的头文件失效：
`mv /usr/local/include/iconv.h /usr/local/include/iconv.h.bak`
2. 然后重新编译 Linux 内核。
3. 编译完成后，别忘记恢复系统原来的模样，否则后续如果用到自己安装的 libiconv 库，又会出现问题：
`mv /usr/local/include/iconv.h.bak /usr/local/include/iconv.h`

## 参考
[编译出现 undefined reference to 'libiconv'](https://blog.csdn.net/jjblxd/article/details/110181344)  
[undefined reference to 'libiconv'](https://www.cnblogs.com/lovemdx/archive/2013/06/09/3128371.html)


