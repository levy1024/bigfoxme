---
title: "内网穿透 Tailscale（二）：Derper 服务部署实践"
published: 2025-09-02
tags:
- Tailscale
- VPN
category: 其它
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## 参考
[使用 Let’s Encrypt 免费申请泛域名 SSL 证书，并实现自动续期](https://www.cnblogs.com/michaelshen/p/18538178)  

## 第1步：二级域名 SSL 证书申请
方法1：certbot certonly --standalone -d derper.example.com（需要关闭 80 端口服务）  
方法2：sudo certbot --nginx -d derper.example.com（需要 nginx ）  
方法3：certbot --manual --preferred-challenges dns certonly --domains derper.example.com （最后我使用的方法）

```
[root@VM_0_3_centos tailscale]# certbot --manual --preferred-challenges dns certonly --domains derper.example.com
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Renewing an existing certificate for derper.example.com

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please deploy a DNS TXT record under the name:

_acme-challenge.derper.example.com.

with the following value:

2NAlm8663zIkfaeBi5X8rLOyrOimu0oS_S1578DVwBU

Before continuing, verify the TXT record has been deployed. Depending on the DNS
provider, this may take some time, from a few seconds to multiple minutes. You can
check if it has finished deploying with aid of online tools, such as the Google
Admin Toolbox: https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.derper.example.com.
Look for one or more bolded line(s) below the line ';ANSWER'. It should show the
value(s) you've just added.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Press Enter to Continue
```

## 第2步：添加域名验证
出现上述提示，说明需要域名验证。在域名注册处通过添加 TXT 记录的方式验证域名属于自己。

## 第3步：确认 TXT 记录是否生效
Linux 系统下：dig -t txt _acme-challenge.derper.example.com  查看记录值的配置是否生效  
```
[root@VM_0_3_centos bin]# dig -t txt _acme-challenge.derper.example.com

; <<>> DiG 9.11.4-P2-RedHat-9.11.4-26.P2.el7_9.13 <<>> -t txt _acme-challenge.derper.example.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 8425
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;_acme-challenge.derper.example.com. IN      TXT

;; ANSWER SECTION:
_acme-challenge.derper.example.com. 495 IN   TXT     "2NAlm8663zIkfaeBi5X8rLOyrOimu0oS_S1578DVwBU"

;; Query time: 0 msec
;; SERVER: 100.100.100.100#53(100.100.100.100)
;; WHEN: 一 8月 18 11:29:16 CST 2025
;; MSG SIZE  rcvd: 103

[root@VM_0_3_centos bin]#
```

Windows 系统下：nslookup -type=TXT _acme-challenge.derper.example.com 8.8.8.8
```
PS C:\Users\bigfox> nslookup -type=TXT _acme-challenge.derper.example.com 8.8.8.8
服务器:  dns.google
Address:  8.8.8.8

非权威应答:
_acme-challenge.derper.example.com   text =

        "2NAlm8663zIkfaeBi5X8rLOyrOimu0oS_S1578DVwBU"
PS C:\Users\bigfox>
```

## 第4步：回车确认第1步
如果 TXT 记录已生效，在第1步的终端回车确认。输出如下：
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/derper.example.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/derper.example.com/privkey.pem
This certificate expires on 2025-11-16.
These files will be updated when the certificate renews.

NEXT STEPS:
- This certificate will not be renewed automatically. Autorenewal of --manual certificates requires the use of an authentication hook script (--manual-auth-hook) but one was not provided. To renew this certificate, repeat this same certbot command before the certificate's expiry date.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
If you like Certbot, please consider supporting our work by:
 * Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
 * Donating to EFF:                    https://eff.org/donate-le
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
[root@VM_0_3_centos tailscale]#
```

## 第5步：创建软链接指向域名证书  
ln -s /etc/letsencrypt/live/derper.example.com/fullchain.pem /root/go/bin/derper.example.com.crt  
ln -s /etc/letsencrypt/live/derper.example.com/privkey.pem   /root/go/bin/derper.example.com.key  

关于证书需要重点说明：  
假设你的域名是 xxx.com，那么证书的名称必须是 xxx.com.crt，同理，私钥名称必须是 xxx.com.key  

## 第6步：重启 derper 服务
systemctl daemon-reload 修改 service 文件后需要  
systemctl restart derper 重启 derper服务  
systemctl enable derper 服务加入开机启动  

## 运维
查看域名 https 证书有效期的多种方法：  
https://blog.csdn.net/citycloudpeter/article/details/113942161  

检查DERP服务是否在正常运行，同时可查看SSL证书过期时间：  
https://derper.example.com:33456/  

检查 tailscale 运行状态常用命令：    
tailscale netcheck  查看 Derp 中继服务器及时延  
tailscale status 可以看到和对方是否打洞成功，成功就是直连，不成功就走中继  
tailscale ping <节点IP地址> 这个更加友好一点，会直接告诉你是通过哪个 DERP 中继服务器来和对方通信的