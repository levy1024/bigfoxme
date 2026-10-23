---
title: "Ubuntu 24.04 下成功安装 nvm，Node.js 的版本可以随时切换了"
published: 2026-05-15
tags:
- nvm
- Node.js
- Ubuntu
category: 运维
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

现在，很多程序的安装和使用都要使用 node 和 npm/pnpm。而且，不同的程序要求的 node 版本经常还不一样。于是，nvm 便成了最优解决方案，不得不安装 nvm。

问了 AI 一圈，照着操作，没有安装成功，终于照着网上的一篇文章安装成功了。整理如下，方便以后再次需要安装。

1. 修改默认的源地址，避免国外源无法访问  
export NVM_NODEJS_ORG_MIRROR=https://mirrors.ustc.edu.cn/node

2. 通过官方地址查看最新版本（可选）  
https://github.com/nvm-sh/nvm

3. 下载nvm安装脚本（可选替换其中的版本号）  
wget https://github.com/nvm-sh/nvm/archive/refs/tags/v0.40.8.tar.gz

4. 创建nvm的安装目录  
mkdir /root/.nvm/

5. 解压下载的软件包（原文少了这一步）  
tar -xzf v0.40.8.tar.gz -C /root/.nvm/

6. 执行脚本安装 nvm  
cd /root/.nvm/nvm-0.40.8/  
sh install.sh  
source /root/.bashrc  

7. 安装 node 版本  
nvm ls-remote			#查看node都有哪些版本  
nvm install v18.17.1	#根据项目情况下载自己需要的node版本  
nvm install v20.12.0

8. 使用下载的 node 版本  
nvm use v18.17.1	#使用nvm use 选择或切换要使用的node版本  
node -v					#查看当前node版本  
nvm alias default 18.17.1   #设置默认node版本，如果不设置，每次登录命令行默认使用第一个安装node版本   

9. 设置npm源地址  
npm config set registry https://registry.npmmirror.com/