---
title: "泰凌微 TLSR 825x 系列 BLE Mesh 开发记录"
published: 2025-10-10
tags:
- Telink
- BLE
- Mesh
category: 嵌入式
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

泰凌微（Telink）的开发资料与文档，相对比较混乱（官网文档、官方 wiki 网站、pdf文档三者之间内容重复，又新旧不一致），加之蓝牙开发又相对复杂，现把开发过程中使用的文档，遇到的问题纪录一下。

## 官方文档
[SIG Mesh SDK 官方文档](https://doc.telink-semi.cn/doc/zh/software/res/sdk/ble_mesh/sig_mesh_cn/sig_mesh_cn/)  

## TLSR825x Mesh SDK 下载地址
[Gitee 下载地址](https://gitee.com/telink-semi/tc_ble_mesh/tags)  
[Github 下载地址](https://github.com/telink-semi/tc_ble_mesh/tags)  
注意：下载 SDK 之后，需要打 patch，才有最近的更新。

## 集成开发环境（IDE）
[Telink IoT Studio 下载地址](https://wiki.telink-semi.cn/wiki/IDE-and-Tools/Telink_IoT_Studio/)  
[Telink IoT Studio 用户指南](https://doc.telink-semi.cn/doc/zh/software/res/tools/telink_ide/Telink_IoT_Studio_User_Guide_cn/)  

## IDE 中 Warnings 的解决
首次打开官方 SDK 中的项目，IDE 开发环境中 Problems 标签中会出现警告：
Project 'firmware' has no explicit encoding set。  
这是因为 IDE 中，没有显式配置项目的文件编码，即使 IDE 有默认配置的文件编码 UTF-8。  
解决方法：鼠标选中 IDE 左侧项目文件夹，右键，最底下的 properties，Resource，Text file encoding，Other 选择 UTF-8。

## 如何确认使用的 SDK 版本
在 IDE 中，可以通过编译完成后，Console 中最后的输出来判断使用的 SDK 版本：
```
---------------------------  SDK version info ---------------------------
telink_sig_mesh_sdk_V4.1.0.1.2
---------------------------  SDK version end  ---------------------------
```

## 如何修改设备端的固件版本号
SDK目录/vendor/common/version.h 文件中修改：  
```
#define SW_VERSION_SPEC			(4)		// "3" means SIG MESH 1.0.x, "4" means SIG MESH 1.1.x; 0 mean beta version.
#define SW_VERSION_MAJOR		(1)		// "1" means single connection"2", means multi connection. 
#define SW_VERSION_MINOR		(0)		// 
#define SW_VERSION_2ND_MINOR	(1)		// second minor or fix version
```
**注意：**  
修改版本号后，需要 make clean 后再重新编译（IDE 中：Project->Clean...），代码注释中有说明： 
```
#define BUILD_VERSION		(MESH_PID_SEL|(MESH_VID << 16))	// if value change, must make clean. same sequence with cps
```

## 设置 MCU 时钟频率
项目中实际使用的 MCU 时钟来源于外部 24M Hz 晶振，需要核对 SDK 中的时钟配置。  
SDK目录/vendor/mesh/app_config_8258.h 文件中修改：  
```
#define CLOCK_SYS_CLOCK_HZ  	24000000
```

## 设置 publish addr
出处：[Sensor设备Sensor Control](https://doc.telink-semi.cn/doc/zh/software/res/sdk/ble_mesh/sig_mesh_cn/sig_mesh_cn/?h=publish+addr#device-settinglight)  
> Sensor设备Sensor Control  
当Sensor设备支持Sensor Server时，设备Control页面下会出现Sensor Control子页面入口。  
(a) publish adr是能够接收到传感器状态数据的地址。publish adr为0表示传感器不上报状态数据。publish adr为0xFFFF表示所有设备都可以接收到传感器状态数据。如果只想单个设备接收到这个传感器的状态数据，则需要将publish adr设置为该设备的Light LC Server所在的element地址。  
(b) period默认设置为0，表示Sensor数据不会周期性上报，而是Sensor数据的值有变化时才会进行数据上报。  
(c) Sensor Data是传感器通过SensorStatus指令上报的传感器数据，Sensor Descriptor是传感器通过SensorDescriptorStatus指令上报的传感器固化的配置参数，Sensor Cadence是传感器通过SensorCadenceStatus指令上报的传感器可修改的配置参数。  

