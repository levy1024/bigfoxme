---
title: "我的 XGO-Duck 机器鸭终于运行起来了，并可以完成预置的大部分动作，其中遇到的问题，记录一下"
published: 2026-11-18
tags:
- 机器人
- Micro-Duck
- XGO-Duck
- 机器鸭
category: 机器人
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

XGO-Duck 是由国内陆吾智能（Luwu Dynamics）基于 Pollen Robotics 的 MicroDuck 项目改造并开源的一款桌面级双足机器鸭。

它并非开箱即玩的遥控玩具，而是一套高度开放的机器人实验平台。从 3D 打印结构件、总线舵机控制，到 Linux 端的强化学习策略部署，它把完整的软硬件链路摆到了开发者桌面上。

经过几天的努力，我的 XGO-Duck 机器鸭终于运行起来了，并可以完成预置的大部分动作，虽然还不完美，但也值得记录一下。也希望给第一次玩这只可爱小鸭子的同学一个参考。

## 演示
<iframe
  src="https://player.bilibili.com/player.html?bvid=BV1Bmst63ERx&page=1&autoplay=0"
  title="机器鸭演示视频"
  style="width:100%; aspect-ratio:16/9; height:auto;"
  scrolling="no"
  frameborder="no"
  framespacing="0"
  allowfullscreen="true">
</iframe>

## 准备
- 购买电子套件：[购买地址](https://item.taobao.com/item.htm?id=1097102740185&mi_id=0000xEMm2_mBeigMCx_mNWq1j26S3RXTHJ8DB6EVm5605JI&skuId=6320721803129&spm=a1z10.1-c-s.w4004-26100791746.26.280e134bymesnC)  
- 完成 3D 结构件打印：[3D 打印文件下载地址（Makerworld）](https://makerworld.com.cn/zh/models/3098881-xgo-duck-da-zao-shu-yu-ni-de-shuang-zu-ji-qi-ya#profileId-3648786)   

电子套件分为整机套件与基础款，我使用的是基础款，没有音频、视频和 ToF 测距模块。

## 两种方式
- 新手用户：[一键烧录](https://www.xgorobot.com/duck.html#software)  
- 开发者：[一步一步，完成上手](https://www.xgorobot.com/duck-developer-guide/index.html)   

我走的是开发者方式。  

## 问题记录

### 关于 3D 打印
1. 3D 打印文件在官方 Github 仓库中有，官方在 Makerworld 中也有，建议使用 Makerworld 中的，因为后者有分盘，有中位标定托盘打印文件。
2. 3D 打印文件上传嘉立创，有两个部件因尺寸太小问题，嘉立创不支持。另外选择了一家打印平台，也反馈有打印风险，但最后打印出来没有问题。这些打印平台上的打印都相对比较贵，可以在闲鱼上找人打印，玩这款机器人的玩家还是很多的。  
3. 3D 打印材料和颜色的选择：材料大部分是 PLA，只有鸭舌和鸭脚是 TPU，中位标定托盘是 PETG。颜色看自己喜欢，官方在 Makerworld 中也有颜色的分盘明细。
4. 建议打印后壳保护板，保护电路板，否则电路板很容易摔坏。注意后壳保护板有两个版本，分别对应扩展板 V1.0 和 V1.1。区别：V1.1 增加了音视频供电接口，舵机热插拔保护、堵转保护、电池正反接保护。
5. 建议打印中位标定托盘，否则不好做标定，标定没做好，会导致很多问题。

### 关于组装
1. 注意事项：组装之前要先运行开发板，做舵机编号，否则一旦组装起来，再编号就不好做了，因为编号时要保证单舵机连接。
1. 螺丝：沉头/平头/圆头，要分清楚，否则有些地方舵机安装不上。
2. 电子套件中，有 3 根长线，注意使用的位置，都是用在连接舵机与扩展板上的，其它舵机之间用的都是短线。否则最后连接到拓展板时，不够长。
3. 螺丝不能拧的太紧，可能导致结构变形，特别是固定主控板时。固定主控板的 4 个位置，我的有一边感觉偏高，拧太紧导致电路板变形了。

### 关于系统运行
1. 系统更新： ARUINO UNO Q 开发版上的软件的更新，需要很长的时间，需要耐心。拉取镜像可能失败，失败时可选择科学上网。
2. 充电：开发板上没有充电指示，充电看电源适配器的指示灯，充电时红，满电时绿。
3. 连接开发板：可通过 USB 或者 Network 连接，通过 Network 连接时需要在同一无线局域网中。
4. 标定：IMU 标定和中位标定是两个不同的东西，不能省略和替代。

### 15 个电机突然找不到的问题
1. 扩展板上的三条舵机连线，交换插口重新拔插连接后恢复正常。
2. 某一个电机的某一条线接触不良了，会导致所有电机都找不到。

### 摔倒后断电问题
现象：机器鸭摔倒后，可能会立即断电。重新断开打开电源开关，又恢复正常。  
原因：电池型号不对，要使用 3500mAh/7.2V 的电池，之前是 2500mAh/7.4V 的电池，最初官方发货混用导致。

## 待解决问题
- 机器鸭起身站立后，不稳，容易后倒。
- 翻跟斗的动作很难完成，实验多次，仅成功一次。

## 附录

### 官网
https://www.xgorobot.com/duck.html  
页面后面有企业微信交流群，建议加入，可以随时咨询遇到的问题。  

### Wiki
https://wiki.xgorobot.com/xgo/kb/xgo-duck

### 创客世界 / 陆吾智能
https://makerworld.com.cn/zh/@LuwuDynamics

### Github
硬件仓库 ：[https://github.com/LuwuDynamics/xgoduck_hardware](https://github.com/LuwuDynamics/xgoduck_hardware)    
固件仓库 ：[https://github.com/LuwuDynamics/xgoduck_runtime_arduino](https://github.com/LuwuDynamics/xgoduck_runtime_arduino)  
3D 打印结构件：[https://github.com/LuwuDynamics/xgoduck_hardware/tree/master/structure](https://github.com/LuwuDynamics/xgoduck_hardware/tree/master/structure)    

