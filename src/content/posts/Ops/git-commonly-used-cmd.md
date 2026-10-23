---
title: "Git 操作常用命令"
published: 2026-05-06
tags:
- Github
category: 运维
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## Github 认证
gh auth login -h github.com

## 添加远程仓库地址
第一次配置用 add，修改配置用 set-url。  
git remote add origin <项目 .git 地址>  
git remote set-url origin <项目 .git 地址>  

## 推送分支或标签
注意：代码分支和标签需分别推送！！！  
git push origin <分支>（推送某个分支）   
git push origin --all （推送所有分支）    
git push origin <标签>（推送某个标签）  
git push origin --tags （推送所有标签）    

## 查看当前状态                                                                                                                                                                                                                                                 
git status  

## 提交并推送
git add <files>  (提交某个文件）  
git add -A && git commit -m "提交信息" && git push（一键三连）                                                                                                                                                                                                                                 

## 查看历史
git log --oneline

## 回滚到某个版本
git  reset --hard <commit-id>

## 打标签
git tag -a <标签> -m "描述信息"  
git tag -a <标签> <commit-hash> -m "描述信息" （给指定 commit 打标签）  

## 查看所有标签
git tag

## 查看标签详情
git show <标签>

## 删除本地标签
git tag -d <标签>

