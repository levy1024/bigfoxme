---
title: "Windows 下 Docker、虚拟机、WSL2 同时运行，爽！"
published: 2025-07-25
tags:
- WSL2
- 虚拟机
category: 运维
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

不记得多久以前，我试图在 Windows 下同时运行 Docker，和 VMware 虚拟机，尽然不允许！当时甚是苦恼！至于原因，随便网络上搜一搜，就知道了。

近日，我又有了这个需求，这个问题已经得到了解决，一个字，爽！

现在，我有了3个开发环境：VMware 虚拟机运行着 Ubuntu18.04、WSL2 运行着 Ubuntu22.04、WSL2 运行着Docker。

以前只会用虚拟机，现在多了一个选择 WSL2，至少有以下好处：
- WSL2 运行 Linux 的资源开销更小；
- Windows下的C盘、D盘对应wsl的/mnt/c、/mnt/d，可用于wsl与Windows之间传输数据。而Linux虚拟机与Windows之间数据传输通常使用xshell等。
