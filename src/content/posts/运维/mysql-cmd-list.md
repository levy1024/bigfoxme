---
title: "MySQL 相关常用命令"
published: 2025-02-25
tags:
- MySQL
category: 运维
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## MySQL 运行状态
sudo systemctl status mysql  
sudo service mysql status  

## MySQL 启动/停止服务
sudo systemctl start mysql  
sudo systemctl restart mysql  
sudo systemctl stop mysql  

## MySQL 设置开机自启
sudo systemctl enable mysql

## MySQL 系统进程
ps aux | grep mysql  
ps -ef | grep mysqld  

## MySQL 端口监听
sudo netstat -tuln | grep 3306  
sudo ss -tuln | grep 3306  


