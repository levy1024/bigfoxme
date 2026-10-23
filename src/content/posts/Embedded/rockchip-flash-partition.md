---
title: "如何修改 Rockchip RV1126/RV1109 平台的 Flash 分区大小"
published: 2025-03-20
tags:
- Rockchip
- Flash
category: 嵌入式
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

RV1126/RV1109 分区参数配置文件：  
瑞芯微 SDK 目录/device/rockchip/rv1126_rv1109/parameter-buildroot-fit.txt  

其中有一行即是修改位置：
```
CMDLINE: mtdparts=rk29xxnand:0x00002000@0x00004000(uboot),0x00002000@0x00006000(misc),0x00010000@0x00008000(boot),0x00010000@0x00018000(recovery),0x0    0010000@0x00028000(backup),0x00200000@0x00038000(rootfs),0x00200000@0x00238000(oem),0x00200000@0x00438000(userdata),-@0x00638000(media:grow)
```

同型号Flash，大小从 8G 直接更改为 16/32/64G，可以直接使用。media 分区自动增大，就是因为配置：-@0x00638000(media:grow)。  
