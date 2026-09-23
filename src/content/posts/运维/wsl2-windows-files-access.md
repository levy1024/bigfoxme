---
title: "WSL2 和 Windows 如何互相访问彼此之间的文件"
published: 2025-07-28
tags:
- WSL2
- Windows
category: 运维
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## 在 Windows 中访问 WSL2 的文件
打开 Windows 文件资源管理器，在地址栏输入 "\\\wsl$" 并按回车。

## 在 WSL2 中访问 Windows 文件
WSL2 会自动将 Windows 磁盘驱动器挂载到 /mnt/ 目录下。  
C 盘对应 /mnt/c/  
D 盘对应 /mnt/d/  
以此类推。


