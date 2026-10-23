---
title: "360T7 路由器刷机记录"
published: 2025-07-30
tags:
- 路由器
- 刷机
category: 运维
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

参考：深度记录360T7刷机历程，帮小白的你避坑  
[https://blog.csdn.net/u014193285/article/details/143305239](https://blog.csdn.net/u014193285/article/details/143305239 "https://blog.csdn.net/u014193285/article/details/143305239")  

通过串口连接路由器，开机后按 f 键进入 failsafe mode 后操作：
```shell
[   11.025567] mtk_soc_eth 15100000.ethernet eth0: configuring for fixed/2500base-x link mode
[   11.033896] mtk_soc_eth 15100000.ethernet eth0: Link is Up - 2.5Gbps/Full - flow control rx/tx
Press the [f] key and hit [enter] to enter failsafe mode
Press the [1], [2], [3] or [4] key and hit [enter] to select the debug level
[   13.608363] mt753x gsw@0: Port 1 Link is Up - 1Gbps/Full
[   13.614189] mt753x gsw@0: linkstatus_mask front:2 after:2
Before mount_root
[   15.210583] UBIFS (ubi0:2): Mounting in unauthenticated mode

root@Openwrt:~# md5sum /tmp/mt7981_360t7-fip-fixed-parts.bin
72bc149016da90d743754a808f474595  /tmp/mt7981_360t7-fip-fixed-parts.bin
root@Openwrt:~#
root@Openwrt:~# mtd erase fip
Unlocking fip ...
Erasing fip ...
root@Openwrt:~# mtd write /tmp/mt7981_360t7-fip-fixed-parts.bin fip
Unlocking fip ...

Writing from /tmp/mt7981_360t7-fip-fixed-parts.bin to fip ...
root@Openwrt:~# mtd verify /tmp/mt7981_360t7-fip-fixed-parts.bin fip
Verifying fip against /tmp/mt7981_360t7-fip-fixed-parts.bin ...
9014bc72d790da16804a75439545478f - fip
9014bc72d790da16804a75439545478f - /tmp/mt7981_360t7-fip-fixed-parts.bin
Success
root@Openwrt:~#

Web failsafe UI started
T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T T GET /
GET /style.css
T GET /index.js
GET /version
GET /getmtdlayout
GET /favicon.ico
T T T T T T T T T T T T T T T T T T T T T T T T T T

root@(none):/# passwd root
Changing password for root
New password:
Bad password: too weak
Retype password:
passwd: password for root changed by root
root@(none):/#
```
