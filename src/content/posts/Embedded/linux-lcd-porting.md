---
title: "记录一次单片机 LCD 显示驱动移植到 Linux 环境下的曲折过程"
published: 2025-03-12
tags:
- LCD
- Linux
category: 嵌入式
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

单片机 LCD 显示驱动移植到 Linux 环境时，先后进行了如下修改：  
1.  文件需要由 GB2312 编码转换为 UTF8 编码；
2.  结构体中汉字所占字节大小由 2 改为 3；
3.  程序中循环显示每个汉字时，s+=2，改为 s+=3；
4.  程序中从字库中循环寻找汉字时，由比较 2 个字节改为比较 3 个字节；
5.  提升显示速度（由一次写 2 个字节，改为写每个字符的所有字节）；
