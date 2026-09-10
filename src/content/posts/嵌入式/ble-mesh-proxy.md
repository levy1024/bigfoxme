---
title: "蓝牙 Mesh 网络中的 Proxy 节点的作用，有点出乎我的意料"
published: 2025-10-21
tags:
- BLE
- Mesh
category: 嵌入式
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

蓝牙 Mesh 网络中的 Proxy 节点，是为了手机能够连接 Mesh 网络而出现的，这有点出乎我的意料：  
**手机要加入蓝牙 Mesh 网络，需要蓝牙 Mesh 协议做特别的设计——设计 Proxy 节点。**      

来源：[解密蓝牙mesh系列 | 第二篇](https://mp.weixin.qq.com/s?__biz=MzA4MTg3MTg2Mg==&mid=2651236874&idx=2&sn=e2aa638d8c8047d8f1ce772961eb94b6&chksm=847c5c93b30bd5858efd7869a24f4364bbb3693b0f654428f52dc805a049687da95ef748d878&scene=21#wechat_redirect)  
> 蓝牙mesh网络虽然推出不久，但低功耗蓝牙（Bluetooth Low Energy）却面世已久。  
那么市场上数十亿台设备呢？智能手机和平板电脑呢？它们能否访问蓝牙mesh网络？  
幸运的是，答案是YES！  
蓝牙mesh网络会指定一台设备来扮演代理节点（proxy node）的角色。代理节点包含一项标准：低功耗蓝牙GATT服务，具有两个GATT特性，分别是mesh代理数据输入(Mesh Proxy Data In)和mesh代理数据输出(Mesh Proxy Data Out)。诸如智能手机等低功耗蓝牙设备均可使用这些特性，与mesh网络进行数据收发。  
这种mesh规格定义了一种代理协议（proxy protocol），同时通过代理节点的两个GATT特性交换的数据中包含代理协议PDU。  

来源：[Telink SIG Mesh SDK 文档](https://doc.telink-semi.cn/doc/zh/software/res/sdk/ble_mesh/sig_mesh_cn/sig_mesh_cn/?h=feature#features)  
> Proxy feature：proxy是用于手机APP接入mesh网络的协议。在mesh网络中，APP也是一个独立的节点，有自己的Node address。引入proxy，是因为目前大部分手机不能完全自定义发送广播包，以及不能一直处于监听mesh网络的状态(中间要切换到WiFi等)，所以手机APP需要通过BLE GATT连接一个节点，直连节点收到APP发过来的数据后会转发出去，当直连节点收到mesh网络中回复给app的message后，会先通过GATT按proxy协议回复给手机APP。  

来源：AI（夸克浏览器中问答）  
> 现实中的“硬伤”（为什么手机做不了 Proxy）  
目前的智能手机操作系统（为了省电和系统稳定性）对蓝牙底层能力做了严格限制，导致手机无法胜任 Proxy 的角色：  
🚫 障碍一：无法接收广播数据（Scanning）  
这是最大的瓶颈。  
Mesh 的机制：Mesh 网络中的设备（包括 Proxy Node）需要持续不断地发送和接收广播包（Advertising PDU）来传递消息。  
手机的限制：  
Android/iOS：手机的蓝牙协议栈通常不允许 App 在后台持续进行“高占空比”的扫描（Scan）。系统为了省电，会限制扫描的频率和时长。  
后果：如果手机不能持续扫描，它就会漏掉网络中其他设备发出来的广播消息。这意味着，你用手机 App 看不到设备的状态变化（比如别人按了物理开关，手机不知道）。  
🚫 障碍二：无法发送广播数据包（Advertising）  
Proxy 的要求：Proxy 节点需要能够发送承载着 Mesh 数据的广播包，让周围的节点收到。  
手机的限制：手机虽然可以发广播（比如手机找手环），但通常只能发特定格式的广播（如 GAP 广播），很难发送符合 Mesh 协议规范的、承载着复杂网络数据的广播包。而且，手机发广播非常耗电，系统通常会阻止 App 长期占用此能力。  
🚫 障碍三：连接模式的冲突  
GATT vs ADV：手机蓝牙最稳定、最标准的工作模式是 GATT（Client/Server 模式），也就是“一问一答”的连接模式。  
Proxy 的本质：真正的 Proxy Node 是在 广播模式（ADV Bearer） 和 GATT 模式之间做翻译。  
手机 -> Proxy (GATT 连接，稳定)。  
Proxy -> 设备 (广播 ADV，覆盖广)。  
如果手机自己做 Proxy，它就必须自己发 ADV 广播，这在手机上是不被支持的。  


