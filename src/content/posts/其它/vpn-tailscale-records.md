---
title: "异地组网工具 Tailscale 的学习与实践"
published: 2025-09-05
tags:
- Tailscale
- VPN
category: 其它
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## 缘起
需要在家里访问公司的电脑和服务器。

## 异地组网工具概述
### Tailscale、ZeroTier 和 Netbird
Tailscale、ZeroTier 和 Netbird 都是功能相似的优秀异地组网工具，且均支持自建服务器。  
与 ZeroTier 相比，Tailscale 功能更丰富、自建更为简便，同时 WireGuard 效率更高；缺点是 Tailscale 客户端资源占用略高（要求RAM＞512M）。  
与 Netbird 相比，Tailscale 起步较早实践资料和可用插件更多（如 OpenWRT Luci-UI，[https://github.com/asvow/luci-app-tailscale](https://github.com/asvow/luci-app-tailscale "https://github.com/asvow/luci-app-tailscale")），并且不强制要求独占80与443端口；缺点是 WireGuard 在 go 下性能略逊于内核态，同时 Headscale 并非 Netbird 一样由官方支持。  

### TigerVNC
High performance, multi-platform VNC client and server.  
官网：[https://tigervnc.org/](https://tigervnc.org/ "https://tigervnc.org/")  
源码：[https://github.com/TigerVNC/tigervnc](https://github.com/TigerVNC/tigervnc "https://github.com/TigerVNC/tigervnc")  

### 参考 
知乎专栏：[大内网战略](https://www.zhihu.com/column/c_1584682109159034881 "大内网战略")  

## Tailscale 异地组网
### Tailscale 官网
[https://tailscale.com/](https://tailscale.com/ "https://tailscale.com/")  

### Tailscale 工作原理
官方文档：  
[https://tailscale.com/blog/how-tailscale-works](https://tailscale.com/blog/how-tailscale-works "https://tailscale.com/blog/how-tailscale-works")。  
Tailscale 服务器端分为两部分，包括负责通信与认证的 Headscale 服务器和负责打洞和转发的 DERP 服务器。  
以两台计算机为例，它们首先分别通过 Tailscale 客户端注册至 Headscale 服务器，在建立通信时先通过 Headscale 服务器交换握手信息，随后分配到合适的 DERP 服务器进行中继连接和 STUN 打洞。若打洞成功，两端将在 Headscale 服务器引导下绕过中继服务器建立点对点的直连隧道；若打洞失败，两端将保持通过 DERP 服务器中继的互联模式。  

流量穿透原理：  
原文：[https://tailscale.com/blog/how-nat-traversal-works](https://tailscale.com/blog/how-nat-traversal-works "https://tailscale.com/blog/how-nat-traversal-works")  
翻译：[NAT 穿透是如何工作的：技术原理及企业级实践](https://arthurchiao.art/blog/how-nat-traversal-works-zh/ "NAT 穿透是如何工作的：技术原理及企业级实践")

### 自建 DERP 中继服务
官方文档：  
[https://tailscale.com/kb/1118/custom-derp-servers](https://tailscale.com/kb/1118/custom-derp-servers "https://tailscale.com/kb/1118/custom-derp-servers")  
网络文章：  
[Tailscale自定义DERP服务器](https://zhuanlan.zhihu.com/p/9863627411 "Tailscale自定义DERP服务器")  
[更好更快的的家庭组网，自建 Tailscale DERP服务（IPv4）](https://sspai.com/post/89200 "更好更快的的家庭组网，自建 Tailscale DERP服务（IPv4）")  
[Tailscale 基础教程：部署私有 DERP 中继服务器](https://icloudnative.io/posts/custom-derp-servers/ "Tailscale 基础教程：部署私有 DERP 中继服务器")

### 部署 Headscale
Headscale 是 Tailscale 的一个开源服务端，通过 go 语言完整地支持了绝大多数 Tailscale 的基础功能，使   Tailscale 能够完全工作于独立自建的服务端之上。  
官方文档：  
Headscale : [https://github.com/juanfont/headscale](https://tailscale.com/ "https://github.com/juanfont/headscale")  
Headscale WebUI: [https://github.com/GoodiesHQ/headscale-admin](https://github.com/GoodiesHQ/headscale-admin "https://github.com/GoodiesHQ/headscale-admin")  
网络文章：  
[一款超牛逼的 P2P 内网穿透神器（附安装、使用教程）](https://zhuanlan.zhihu.com/p/584825172 "一款超牛逼的 P2P 内网穿透神器（附安装、使用教程）")  
[Tailscale 基础教程：Headscale 的部署方法和使用教程](https://icloudnative.io/posts/how-to-set-up-or-migrate-headscale/ "Tailscale 基础教程：Headscale 的部署方法和使用教程")  
[自建境内 Headscale 实现点对点直连异地组网——以双栈腾讯云轻量为例](https://cloud.tencent.com/developer/article/2457464 "自建境内Headscale实现点对点直连异地组网——以双栈腾讯云轻量为例")  

## Tailscale Derper 服务部署实践
参考：使用 Let’s Encrypt 免费申请泛域名 SSL 证书，并实现自动续期  
[https://www.cnblogs.com/michaelshen/p/18538178](https://www.cnblogs.com/michaelshen/p/18538178 "https://www.cnblogs.com/michaelshen/p/18538178")  

二级域名SSL证书申请：  
方法1：certbot certonly --standalone -d derper.example.com 需要关闭80端口服务  
方法2：sudo certbot --nginx -d example.com -d www.example.com 需要nginx  
方法3：certbot --manual --preferred-challenges dns certonly --domains example.com 最后我使用的方法

查看域名 https 证书有效期的多种方法：  
https://blog.csdn.net/citycloudpeter/article/details/113942161  

验证txt记录  
Linux: dig -t txt _acme-challenge.example.com  查看记录值的配置是否生效  
Windows: nslookup -type=TXT _acme-challenge.example.com 8.8.8.8

关于证书部分需要重点说明：  
假设你的域名是 xxx.com，那么证书的名称必须是 xxx.com.crt，同理，私钥名称必须是 xxx.com.key  

创建软链接并同时重命名证书  
ln -s /etc/letsencrypt/live/example/fullchain.pem /root/go/bin/example.com.crt  
ln -s /etc/letsencrypt/live/example/privkey.pem   /root/go/bin/example.com.key  

derper.service：  
systemctl daemon-reload 修改 service 文件后需要  
systemctl restart derper 重启 derper服务（derper.service）  
systemctl enable derper 加入开机启动  

检查：  
tailscale netcheck  
tailscale status 可以看到和对方是否打洞成功，成功就是直连，不成功就走中继  
https://example.com:33456/  检查DERP服务是否在正常运行，同时可查看SSL证书过期时间  
tailscale ping <节点IP地址> 这个更加友好一点，会直接告诉你是通过 哪个 DERP 中继服务器来和对方通信的
