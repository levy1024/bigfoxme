---
title: "忘记 MySQL 数据库 root 用户的密码了，怎么办？"
published: 2025-02-27
tags:
- MySQL
category: 运维
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

注：以下内容来源于 AI 问答的整理。

如果忘记 MySQL 数据库 root 用户的密码，可以使用 mysqld_safe 加 --init-file 参数重置 root 的密码。具体操作如下：

## 第一步：停止MySQL服务
sudo systemctl stop mysql  

## 第二步：创建一个包含密码重置命令的文件
echo "ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';" > /tmp/mysql-init.sql  
将 new_password 替换为你想要设置的新密码。  

## 第三步：以 --init-file 参数启动 MySQL
使用 mysqld_safe 而不是直接使用 mysqld 来启动 MySQL 服务，以避免以 root 用户身份运行的问题：  
sudo mysqld_safe --init-file=/tmp/mysql-init.sql &  
等待 MySQ L 服务启动并执行初始化文件中的命令，这个过程可能需要一些时间，具体取决于你的系统配置和性能。  

## 第四步：删除初始化文件
rm /tmp/mysql-init.sql  

## 第五步：重启MySQL服务
sudo systemctl restart mysql  

通过以上步骤，即可成功重置 MySQL 的 root 密码。  