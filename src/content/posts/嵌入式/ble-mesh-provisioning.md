---
title: "蓝牙 Mesh 网络中的 PB-ADV 与 PB-GATT"
published: 2025-10-20
tags:
- BLE
- Mesh
category: 嵌入式
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

**说明：以下内容来源于我在夸克浏览中与 AI 的对话。**    

**问：**  
PB_ADV 和 PB-GATT 分别是哪些单词的缩写  

**答：**  
这两个术语是蓝牙 Mesh 网络中“配网承载层”（Provisioning Bearer）的具体实现方式。它们的全称和含义如下：  

## 1. PB-ADV
*   **全称**：**Provisioning Bearer - Advertising**  
*   **中文含义**：**基于广播信道的配网承载层**  
*   **核心原理**：  
    *   它利用蓝牙的**广播信道**（Advertising Channels，共 37、38、39 三个信道）来传输配网数据。  
    *   这是一种**无连接**（Connectionless）的通信方式。设备通过广播包（如 ADV_NONCONN_IND）发送配网邀请或能力信息，配网者（Provisioner）通过扫描广播来接收这些信息。  
    *   **特点**：功耗极低，适合电池供电的传感器或简单设备，但吞吐量较低。  

## 2. PB-GATT
*   **全称**：**Provisioning Bearer - GATT**  
*   **中文含义**：**基于 GATT 连接的配网承载层**  
*   **核心原理**：  
    *   它利用蓝牙的 **GATT** 协议（Generic Attribute Profile，通用属性配置文件）来传输配网数据。  
    *   这是一种**基于连接**（Connected）的通信方式。手机或配网器需要先与设备建立标准的 BLE 连接，然后通过读写特定的 GATT 特征值（如 Mesh Provisioning Data In/Out）来交换配网信息。  
    *   **特点**：传输速率较高，支持长包分片，适合手机、平板等作为配网端，或者需要大量数据交换的复杂设备。  

## 总结对比
|缩写   |全称   |传输媒介   |连接方式   |典型应用场景
| :--- | :--- | :--- | :--- | :---
|**PB-ADV**   |**P**rovisioning **B**earer - **Adv**ertising  | 广播信道   |无连接   |传感器、灯泡、开关等低功耗设备
|**PB-GATT**   |**P**rovisioning **B**earer -**GATT**   |GATT 通道   |有连接   |手机 App 配网、网关、复杂终端

简单来说，**PB-ADV** 是“喊话”式的配网（广播），而 **PB-GATT** 是“打电话”式的配网（连接）。  

