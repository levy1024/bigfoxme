---
title: "内网穿透 Tailscale（一）：参考资源"
published: 2025-09-01
tags:
- Tailscale
- VPN
category: 其它
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## Tailscale 官网
[https://tailscale.com/](https://tailscale.com/ "https://tailscale.com/")  

## Tailscale 工作原理
官方文档：  
[https://tailscale.com/blog/how-tailscale-works](https://tailscale.com/blog/how-tailscale-works "https://tailscale.com/blog/how-tailscale-works")。  
Tailscale 服务器端分为两部分，包括负责通信与认证的 Headscale 服务器和负责打洞和转发的 DERP 服务器。  
以两台计算机为例，它们首先分别通过 Tailscale 客户端注册至 Headscale 服务器，在建立通信时先通过 Headscale 服务器交换握手信息，随后分配到合适的 DERP 服务器进行中继连接和 STUN 打洞。若打洞成功，两端将在 Headscale 服务器引导下绕过中继服务器建立点对点的直连隧道；若打洞失败，两端将保持通过 DERP 服务器中继的互联模式。  

流量穿透原理：  
原文：[https://tailscale.com/blog/how-nat-traversal-works](https://tailscale.com/blog/how-nat-traversal-works "https://tailscale.com/blog/how-nat-traversal-works")  
翻译：[NAT 穿透是如何工作的：技术原理及企业级实践](https://arthurchiao.art/blog/how-nat-traversal-works-zh/ "NAT 穿透是如何工作的：技术原理及企业级实践")

## 自建 DERP 中继服务
官方文档：  
[https://tailscale.com/kb/1118/custom-derp-servers](https://tailscale.com/kb/1118/custom-derp-servers "https://tailscale.com/kb/1118/custom-derp-servers")  
网络文章：  
[Tailscale自定义DERP服务器](https://zhuanlan.zhihu.com/p/9863627411 "Tailscale自定义DERP服务器")  
[更好更快的的家庭组网，自建 Tailscale DERP服务（IPv4）](https://sspai.com/post/89200 "更好更快的的家庭组网，自建 Tailscale DERP服务（IPv4）")  
[Tailscale 基础教程：部署私有 DERP 中继服务器](https://icloudnative.io/posts/custom-derp-servers/ "Tailscale 基础教程：部署私有 DERP 中继服务器")

## 部署 Headscale
Headscale 是 Tailscale 的一个开源服务端，通过 go 语言完整地支持了绝大多数 Tailscale 的基础功能，使   Tailscale 能够完全工作于独立自建的服务端之上。  
官方文档：  
Headscale : [https://github.com/juanfont/headscale](https://tailscale.com/ "https://github.com/juanfont/headscale")  
Headscale WebUI: [https://github.com/GoodiesHQ/headscale-admin](https://github.com/GoodiesHQ/headscale-admin "https://github.com/GoodiesHQ/headscale-admin")  
网络文章：  
[一款超牛逼的 P2P 内网穿透神器（附安装、使用教程）](https://zhuanlan.zhihu.com/p/584825172 "一款超牛逼的 P2P 内网穿透神器（附安装、使用教程）")  
[Tailscale 基础教程：Headscale 的部署方法和使用教程](https://icloudnative.io/posts/how-to-set-up-or-migrate-headscale/ "Tailscale 基础教程：Headscale 的部署方法和使用教程")  
[自建境内 Headscale 实现点对点直连异地组网——以双栈腾讯云轻量为例](https://cloud.tencent.com/developer/article/2457464 "自建境内Headscale实现点对点直连异地组网——以双栈腾讯云轻量为例")  

