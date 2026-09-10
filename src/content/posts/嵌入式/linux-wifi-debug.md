---
title: "Linux 调试 WiFi 的常用命令"
published: 2025-03-08
tags:
- WiFi
- Linux
category: 嵌入式
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## wpa_cli
### 查看当前连接的 WiFi 热点信息
wpa_cli -i wlan0 -p /var/run/wpa_supplicant/ status
```shell
[bigfox@RV1126_RV1109]#wpa_cli -i wlan0 -p /var/run/wpa_supplicant/ status
bssid=5c:02:14:b5:ff:03
freq=5240
ssid=RDwifi-5G
id=0
mode=station
pairwise_cipher=CCMP
group_cipher=CCMP
key_mgmt=WPA2-PSK
wpa_state=COMPLETED
ip_address=192.168.31.25
p2p_device_address=a0:9f:10:26:03:98
address=a0:9f:10:26:03:98
uuid=4733e679-57e1-52da-aa08-6ec6286ddadd
[bigfox@RV1126_RV1109]#
```
### 获取附近无线 WiFi 热点信息
wpa_cli -i wlan0 -p /var/run/wpa_supplicant scan_results
```shell
[bigfox@RV1126_RV1109]# wpa_cli -i wlan0 -p /var/run/wpa_supplicant scan_results
bssid / frequency / signal level / flags / ssid
5c:02:14:b5:ff:03       5240    -44     [WPA2-PSK-CCMP][WPS][ESS]       RDwifi-5G
34:47:d4:af:e6:9d       5220    -53     [WPA-PSK-CCMP][WPA2-PSK-CCMP][ESS]      RDpub-5G
36:47:d4:cf:e6:9c       5220    -52     [WPA2-PSK-CCMP][ESS]
48:5f:08:44:9c:38       5240    -52     [WPA-PSK-CCMP][WPA2-PSK-CCMP][ESS]      RD888
aa:8c:21:2f:9d:b3       5180    -64     [WPA-PSK-CCMP][WPA2-PSK-CCMP][ESS]      TP-LINK_9DB0
[bigfox@RV1126_RV1109]#
```

## iwlist
iwlist wlan0 scan