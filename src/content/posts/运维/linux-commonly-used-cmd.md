---
title: "我经常使用的 Linux 常用命令"
published: 2025-03-23
tags:
- Linux
category: 运维
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## Linux 与 Windows 容易记混的命令
功能 | Linux | Windows |
| :------------ | :------------ | :------------ |
查看网卡信息 | ifconfig | ipconfig |
路由跟踪 | traceroute | tracert |
查看系统环境变量 | echo $PATH | PowerShell: echo $env:PATH / CMD 命令提示符：echo %PATH% |

nslookup
[nslookup 功能介绍、常用命令、使用注意事项](https://blog.csdn.net/qq_47742555/article/details/144718343 "nslookup 功能介绍、常用命令、使用注意事项")  

Linux 如何查看端口被谁占用（lsof -i 与 netstat 命令):  
lsof -i  
lsof -i:端口号  
netstat -tunlp  
netstat -tunplp | grep 端口号  

## 查看系统信息相关命令
查看 Linux 内核版本  
uname -r  
uname -a  

查看 linux 发行版
lsb_release -a  
cat /etc/os-release  
cat /etc/issue  
cat /etc/debian_version （Debian 系统）  
cat /etc/redhat-release （Red Hat 系统）  

监控 CPU 及内存使用率：top，htop  

查看磁盘空间：df -h  

查看内存空间：free -m  

## 查找文件相关命令
**grep**  
-r: 递归查找  
-s: 不显示错误信息  
--color：高亮显示搜索结果  

--exclude-dir 排除某文件夹  
举例：grep -r "要查找的字符串" --exclude-dir="要排除的文件夹1" --exclude-dir="要排除的文件夹2"    

--binary-files=without-match 排除二进制文件  
举例：grep -sr --binary-files=without-match --color mac_pwr_lut_ctrl .  

**find**  
find 起始路径 -name "被查找文件名"  

## Linux 内核模块管理相关命令
lsmod：查看内核已加载的模块  
modinfo：查看模块的基本信息  
insmod：将指定模块加载到内核，建议使用modeprobe命令  
rmmod：将已加载模块从内核中移除，建议使用modeprobe命令  
modprobe (-r)：加载（或卸载）内核模块，需要根据modules.dep.bin文件进行加载操作，可以自动解决模块间的依赖关系  
depmod：查找/lib/moduels/(uname -r)/中的所有模块并建立modules.dep.bin文件，该文件记录了模块位置及依赖关系  

## 进程管理
pkill -f "进程名称" 按名称关闭进程
