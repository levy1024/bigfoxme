---
title: "边缘 AI 总览（逐步更新）"
published: 2025-11-03
tags:
- Edge AI
category: AI
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## 边缘 AI 概述
[漫谈人工智能边缘硬件](https://mp.weixin.qq.com/s?__biz=MzA5NzU0NjY0Nw==&mid=2649556715&idx=1&sn=7ec13d5c3866cb4590c00dcf2e54d633&chksm=896cacbabc57d795a574256471fcc899f440a07dcb61ed72f44a816f44818167417c1e1794ec&mpshare=1&scene=1&srcid=0416votYpoORFE5noPvAaJRk&sharer_shareinfo=354ab1adad343ee69f098ce0e1a54892&sharer_shareinfo_first=354ab1adad343ee69f098ce0e1a54892&exportkey=n_ChQIAhIQPtIUE7a%2FSP8DFxmicmyEGRLyAQIE97dBBAEAAAAAAL0VNaitRGMAAAAOpnltbLcz9gKNyK89dVj0XmlwR03fKGm9muGx6NzF3vKomv6gEwXwJCLhCnsnn0RVNjmRDGZnHz4B4EM8KPWoFmFOk%2FrudHhLYbIExvEoc2MJVGhzxmY2cY%2BLvPPhclKO8LmZBbHr%2B%2FyTPPlu1h%2BaQov9b3LaIXCKvZWzMlBwK42lUFTYpIcTlbNRAAxdpDjfZclx%2BlZECwVy28S745W54rOxovj%2F%2FBaN7R6%2BxfwUE0ZdMdArjJrE%2FAxI%2F6Odx28dAseG2iX%2FQOdJ3cBCit5cgVvv36c4soG27G75&acctmode=0&pass_ticket=B8U5lsc9xJz8SmGNUav44%2FYArozFYAnq4XdhbbFVq1xexXF9V5f877Yl6YwBvD9B&wx_header=0#rd "漫谈人工智能边缘硬件")（作者：铁云， 微信公众号：铁云文摘）  
[主流AI应用边缘计算平台综合对比](https://zhuanlan.zhihu.com/p/382557252 "主流AI应用边缘计算平台综合对比")（作者知乎账号：GPUS开发者）

## 边缘 AI 硬件平台
### 华为
#### Atlas 200I DK A2
华为“小藤”开发者套件 Atlas 200I DK A2。  
官方网站：[https://www.hiascend.com/hardware/developer-kit-a2](https://www.hiascend.com/hardware/developer-kit-a2 "https://www.hiascend.com/hardware/developer-kit-a2")  
官方文档：[https://www.hiascend.com/document/detail/zh/Atlas200IDKA2DeveloperKit/](https://www.hiascend.com/document/detail/zh/Atlas200IDKA2DeveloperKit/ "https://www.hiascend.com/document/detail/zh/Atlas200IDKA2DeveloperKit/")  

### 英伟达
#### NVIDIA Jstson 系列
NVIDIA 机器人和边缘 AI 官网：[https://www.nvidia.cn/autonomous-machines/](https://www.nvidia.cn/autonomous-machines/ "https://www.nvidia.cn/autonomous-machines/")  
知乎专栏：[NVIDIA Jetson开发者](https://www.zhihu.com/column/c_1324347229126529024 "NVIDIA Jetson开发者")  

### 树莓派
#### Raspberry Pi AI Kit  
官网介绍：[https://www.raspberrypi.com/products/ai-kit/](https://www.raspberrypi.com/products/ai-kit/ "https://www.raspberrypi.com/products/ai-kit/")  
官方文档：[https://www.raspberrypi.com/documentation/accessories/ai-kit.html](https://www.raspberrypi.com/documentation/accessories/ai-kit.html "https://www.raspberrypi.com/documentation/accessories/ai-kit.html")  
中文文档：[https://pidoc.cn/docs/accessories/ai-kit/](https://pidoc.cn/docs/accessories/ai-kit/ "https://pidoc.cn/docs/accessories/ai-kit/")

### STM32
STM32边缘AI官网：[https://stm32ai.st.com/zh/](https://stm32ai.st.com/zh/ "https://stm32ai.st.com/zh/")
NanoEdge AI Studio: [https://stm32ai.st.com/zh/nanoedge-ai/](https://stm32ai.st.com/zh/nanoedge-ai/ "https://stm32ai.st.com/zh/nanoedge-ai/")  
STM32Cube.AI: [https://stm32ai.st.com/zh/stm32-cube-ai/](https://stm32ai.st.com/zh/stm32-cube-ai/ "https://stm32ai.st.com/zh/stm32-cube-ai/")  
边缘AI硬件: [https://stm32ai.st.com/zh/edge-ai-hardware/](https://stm32ai.st.com/zh/edge-ai-hardware/ "https://stm32ai.st.com/zh/edge-ai-hardware/")  
ST Edge AI 开发人员云（在线）: [https://stm32ai.st.com/zh/bian-yuan-ai-kai-fa-zhe-yun/](https://stm32ai.st.com/zh/bian-yuan-ai-kai-fa-zhe-yun/ "https://stm32ai.st.com/zh/bian-yuan-ai-kai-fa-zhe-yun/")  
适用于OpenSTLinux的AI: [https://stm32ai.st.com/zh/ai-for-linux/](https://stm32ai.st.com/zh/ai-for-linux/ "https://stm32ai.st.com/zh/ai-for-linux/")  

### Intel
Intel 边缘AI官网：https://www.intel.cn/content/www/cn/zh/edge-computing/edge-ai.html

## 边缘 AI 软件工具
### CMSIS-NN
ARM公司推出的神经网络加速库，专为Cortex-M系列处理器优化。    
[https://arm-software.github.io/CMSIS_5/latest/NN/html/index.html](https://arm-software.github.io/CMSIS_5/latest/NN/html/index.html "https://arm-software.github.io/CMSIS_5/latest/NN/html/index.html")  

### RKNN
[Rockchip NPU模型-RKNN](https://mp.weixin.qq.com/s?__biz=MzA5MTUzNDUyNA==&mid=2651345197&idx=1&sn=8c2e31d735a96352b873060b3b5c8c0d&chksm=8ad6b788b129b798d6177c7228b5c9c50d6a44d7b5ffb24f266a64e0f1d062f53843c443193f&mpshare=1&scene=1&srcid=0411XwFuT2auXvCfBkyzD1a9&sharer_shareinfo=4b0e0e354f84b09a6d1b68b0ef068302&sharer_shareinfo_first=65d2f152921448fb8e384d6469534b0d&exportkey=n_ChQIAhIQiuaXjSeANcnfUxJIztAgrhLyAQIE97dBBAEAAAAAALH5Jjge%2FJYAAAAOpnltbLcz9gKNyK89dVj085mA%2FsN0BsHTno4yXW5jOYrmEaudA4dihjH3N1YtzudxTC5MlhbZgt6rrCG%2FXtcyWFlJxQ2MF%2B%2FOGIFrqXNy2uKjXUjHfM0wkmVzFamEKg3oE43GuKzervwkAQoUQMJGlTJZ%2FNPtI%2FDZt8ldiDYdC69N9la%2FixkmVTeq1O9hJUBzeoGN9W6aMi%2FCtARVbwsxAE9fkOAPx3s3Z%2FEKtzhMPWCW6IKFXqbdH4JBoFc5G6o40IUNRRWtxQJs6N722l1%2BTz%2FtOPJkgLDHSEhB&acctmode=0&pass_ticket=Fgn5qBBPfgASFIwbxIBs%2BBm97RY9ydbedhPbkPnxUUEzdTK%2F23dV8EYRRrGHs6wA&wx_header=0#rd "Rockchip NPU模型-RKNN")  
[技术帖——飞凌嵌入式RK3588开发板推理模型转换及测试](https://mp.weixin.qq.com/s?__biz=MzI1ODIzMzU1Ng==&mid=2649743633&idx=2&sn=c3dccf3791feec7ea510e717805ecfbe&chksm=f3a71c81826f27323f2ba3ed22f5fa85ea066ae9f91f7ebe5495e3f8b70ed11c935aaeb209cd&mpshare=1&scene=1&srcid=0411hPp0pfWVAaXowI9z731O&sharer_shareinfo=18aefd9ef02ccd6b11011ed6d05837f7&sharer_shareinfo_first=7c1ad9140ae7fee26d480ce34edab42f&exportkey=n_ChQIAhIQ1hNpKR2lcdNRzf9d4DejIhLyAQIE97dBBAEAAAAAAB2sIZLIJ4MAAAAOpnltbLcz9gKNyK89dVj0jls7wFoWNHcB7aHvmVpnFIdPTefr9eSIedgXuvkpMYZWmOtpyfpZAI7%2FXUIb2c1l0hJUvc4wGNQOw5Pie2QX7KE%2BYBGtwMwwIXTHfYtzpZXThRPvA3755ibiB%2BzYQd%2FSxkyxsiNuLIGbx6DpmSRDrL4lBFCK0HIMxqKFxhlB011paIh9HJgYvDPngFpXHoorvvTLW2%2FEedQlCxATW2qadYKsa0GTgcwZ4Z5qw6HBoEXXRe29Q8c4NFitSItz5%2FqN%2F8Va8L8dw9sDOtZG&acctmode=0&pass_ticket=zWZJRzF22vLRbI3%2FIiMIV%2BEEbqt90cGsTaqsbZnVfKlRo3v8I6n6kEju2q64kFfP&wx_header=0#rd "技术帖——飞凌嵌入式RK3588开发板推理模型转换及测试")  

### NVIDIA Dynamo
NVIDIA Dynamo 是一个开源、低延迟的模块化推理框架，用于在分布式环境中服务生成式 AI 模型。  
[https://developer.nvidia.cn/dynamo](https://developer.nvidia.cn/dynamo "https://developer.nvidia.cn/dynamo")  
揭秘 NVIDIA Dynamo：分布式AI推理的高效引擎  
[https://cloud.tencent.com/developer/article/2508888](https://cloud.tencent.com/developer/article/2508888 "https://cloud.tencent.com/developer/article/2508888")  

### TensorFlow Lite
TensorFlow Lite 是一组工具，可帮助开发者在移动设备、嵌入式设备和 loT 设备上运行模型，以便实现设备端机器学习。  
主要特性 ：
* 通过解决以下 5 项约束条件，针对设备端机器学习进行了优化：延时（数据无需往返服务器）、隐私（没有任何个人数据离开设备）、连接性（无需连接互联网）、大小（缩减了模型和二进制文件的大小）和功耗（高效推断，且无需网络连接）。  
* 支持多种平台，涵盖 Android 和 iOS 设备、嵌入式 Linux 和微控制器。  
* 支持多种语言，包括 Java、Swift、Objective-C、C++ 和 Python。  
* 高性能，支持硬件加速和模型优化。  
* 提供多种平台上的常见机器学习任务的端到端示例，例如图像分类、对象检测、姿势估计、问题回答、文本分类等。

[https://www.tensorflow.org/lite/guide?hl=zh-cn](https://www.tensorflow.org/lite/guide?hl=zh-cn "https://www.tensorflow.org/lite/guide?hl=zh-cn")  
[https://github.com/tensorflow/tflite-micro](https://github.com/tensorflow/tflite-micro "https://github.com/tensorflow/tflite-micro")  

### ExecuTorch (PyTorch Mobile)
ExecuTorch is PyTorch’s solution to training and inference on the Edge.  
[https://docs.pytorch.org/executorch/stable/index.html](https://docs.pytorch.org/executorch/stable/index.html "https://docs.pytorch.org/executorch/stable/index.html")  
[https://github.com/pytorch/executorch](https://github.com/pytorch/executorch "https://github.com/pytorch/executorch")  

### Edge Impulse
Build datasets, train models, and optimize libraries to run directly on device; from the smallest microcontrollers to gateways with the latest neural accelerators (and anything in between).  
[https://edgeimpulse.com/](https://edgeimpulse.com/ "https://edgeimpulse.com/")  

