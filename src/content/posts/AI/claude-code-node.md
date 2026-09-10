---
title: "claude 命令突然无法识别，原来是因为切换了 node 的版本"
published: 2026-03-02
tags:
- Claude Code
- Node.js
category: AI
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## 问题
最近在学习辅助编程工具 Claude Code 的使用，前几天还一切正常，今早在终端输入 claude 命令，启动 Claude Code，突然出现提示：
```
PS C:\Users\bigfox> claude
claude : 无法将“claude”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径
正确，然后再试一次。
所在位置 行:1 字符: 1
+ claude
+ ~~~~~~
    + CategoryInfo          : ObjectNotFound: (claude:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException

PS C:\Users\bigfox>
```

## 排查
出现问题，第一时间在网络上搜索，找到一些相关答案，但没有解决自己的问题。  
那就想到：重新安装一下看看吧。
当看到安装命令 `npm install -g @anthropic-ai/claude-code` 时，看到 -g 全局安装参数，突然得到了问题的答案：  
昨天下班前，因为安装某 MCP 需要更高的 node 版本，使用 nvm 安装了更高的 node 版本并进行了切换，之后就下班了，没有启动过 claude。

## 原因
Claude Code 是 npm 包，每个 npm 包都是当前 node 的一部分。环境中有多个版本的 node，其 npm 包都是独立的，互不干扰。
切换 node 版本后，在新的 node 版本环境下，需要重新安装 Claude Code。

## 吐槽
npm 的 -g 参数，表示全局安装，很容易让人误解为：当前电脑的全局。其实准确的说，只是表示：当前 node 版本环境的全局！