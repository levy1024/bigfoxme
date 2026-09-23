---
title: "微软应用商店无法安装 Codex，怎么办？"
published: 2026-06-05
tags:
- Codex
category: AI
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

公司推广 AI 的使用，研发部门全员执行。有些电脑上的微软应用商店可以直接安装，但是有些电脑就会安装失败。

## 方法一：使用第三方应用 Codex App Manager  
应用官网：https://codexapp.agentsmirror.com/  
界面化方式安装、管理应用，推荐使用。  

## 方法二：winget 命令行直接安装  
1. 打开 “Windows PowerShell”（不需要管理员权限）。

2. 确认 winget 可用：    
输入 winget --version，能显示版本号就继续。  

3. 执行安装命令：  
winget install --id 9PLM9XGG6VKS --source msstore --exact --accept-package-agreements --accept-source-agreements  
注意用产品 ID 锁定官方应用，避免装错。

4. 看到 Successfully installed 提示就装好了，去开始菜单搜 Codex 启动即可。‌‌

另：如果提示 Store 源不可用，先运行 winget source reset --force 再 winget source update，然后重新执行安装命令。‌‌

## 方法三：提取应用的 ,msix 文件，使用命令行安装

1. 使用浏览器打开：https://store.rg-adguard.net/。

2. 在页面的输入框中：  
- 选择 URL(link)，输入：https://apps.microsoft.com/detail/9PLM9XGG6VKS；  
- 或者选择 Product ID，输入：9PLM9XGG6VKS；  

3. 点击确认后，在结果里找‌应用名是 OpenAI.Codex、机型x64、后缀是 .msix‌ 的文件下载。

4. 下载后‌使用 PowerShell 执行（路径换成你实际保存的位置）：
Add-AppxPackage -Path "C:\你的下载目录\OpenAI.Codex_版本号_x64__一串字符.msix"

