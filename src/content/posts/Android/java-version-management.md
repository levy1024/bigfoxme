---
title: "如何管理 Java 多个版本，随时在不同的版本间切换？"
published: 2025-05-21
tags:
- Java
category: Android
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

有时我们需要在 java 的不同版本间切换，本文记录了在 Windows 平台下自己使用的一个简单的 java 多版本管理方法。  

1. 安装不同的 java 到不同的目录下（不同的 java 发行版，默认安装目录存在比较大的差异，可以默认路径安装，也可以把不同的版本集中在一个目录下，方便管理）。

2. 配置不同的系统变量指向不同的安装目录， 如：  
	变量名: JAVA_HOME8   变量值: C:\Program Files\Java\jdk1.8.0_361  
	变量名: JAVA_HOME11  变量值: C:\Program Files\Java\jdk-11  
	变量名: JAVA_HOME17  变量值: C:\Program Files\Java\jdk-17  

3. 如果开发环境需要 JAVA_HOME 环境变量，就配置  JAVA_HOME 指向上一步配置的对应版本的系统变量，如：  
	变量名: JAVA_HOME  变量值: %JAVA_HOME11%  

4. 如果开发环境需要 Shell 环境下执行 java 命令，就在系统的 Path 变量中，删除可能已经自动添加的 java 的 bin 目录，新增对应版本的 bin 目录。
	路径可以这样写：%JAVA_HOME11%\bin  
