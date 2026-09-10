---
title: "泰凌微 sig_mesh_sdk 的 LOG 日志打印"
published: 2025-10-11
tags:
- Telink
- Log
category: 嵌入式
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## 日志打印
### 配置输出接口(USB、UART、GPIO)
文件：vendor/mesh/app_config_8258.h
```
/////////////////////HCI ACCESS OPTIONS///////////////////////////////////////
#define HCI_USE_NONE	0
#define HCI_USE_UART	1
#define HCI_USE_USB		2

#define HCI_ACCESS		HCI_USE_NONE

//#define HCI_LOG_FW_EN   (0 || DEBUG_LOG_SETTING_DEVELOP_MODE_EN)
#define HCI_LOG_FW_EN   (1 || DEBUG_LOG_SETTING_DEVELOP_MODE_EN)	//modify by bigfox

#define DEBUG_INFO_TX_PIN           		GPIO_PB1	//modify by bigfox
```

### 配置输出波特率
文件：vendor/common/myprintf.h  
```
#define SIMU_BAUD_115200    115200
#define SIMU_BAUD_230400    230400
#define SIMU_BAUD_1M        1000000

//#define BAUD_USE    SIMU_BAUD_1M
#define BAUD_USE    SIMU_BAUD_115200	//modify by bigfox
```

## 日志控制
文件：proj_lib/sig_mesh/app_mesh.h  

### 配置日志级别
```
#define TL_LOG_LEVEL				TL_LOG_LEVEL_DEBUG	//modify by bigfox
```

### 配置日志模块
```
#define TL_LOG_SEL_VAL  (BIT(TL_LOG_USER))//(BIT(TL_LOG_NODE_SDK)|BIT(TL_LOG_FRIEND)|BIT(TL_LOG_IV_UPDATE)) // |BIT(TL_LOG_NODE_SDK_NW_UT)  
```
TL_LOG_SEL_VAL 需要包含对应的 module， 比如 TL_LOG_USER，该 module 才会打印。  
只有 level 和 module 都符合条件的情况下，对应的 log 才会打印。  

## 浮点数打印
文件：proj/common/printf.c  
```
- - please enable FLOAT_PRINT_EN to support %f ! - -  
#define FLOAT_PRINT_EN		1  
```
但经实际测试，不能控制小数位数，比如2位小数，%.2f，只能用%f  

## 注意事项
1. 修改之后直接编译烧录，发现不生效！需要项目 clean 之后再 build !!!  
2. 同一个SDK，有不同的编译选项，比如：8258_mesh/8258_mesh_lpn/ 8258_mesh_gw 等，修改配置时，注意修改的是对应编译选项选择后生效的配置文件。比如 app_config_8258.h 文件，需要注意修改的是哪个目录下的此文件。  

## 参考
泰凌微 sig_mesh_sdk 的 LOG 日志打印：  
[https://blog.csdn.net/weixin_45149267/article/details/125478502](https://blog.csdn.net/weixin_45149267/article/details/125478502)  

