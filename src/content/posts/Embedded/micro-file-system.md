---
title: "适用于嵌入式的小型文件系统汇总"
published: 2025-10-31
tags:
- 文件系统
category: 嵌入式
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## 参考
[别让文件系统毁了你项目！5款轻量级单片机文件系统](https://mp.weixin.qq.com/s?__biz=Mzg5MDU1OTgzMw==&mid=2247502543&idx=1&sn=9cd6ccc97e54623f6e11aadbd6cc3b7a&chksm=ceb933ebb3d5f98e64f8f998036fb8e5cd6a3aa293aaa23e6a4e6f853b668778d7aee4cd3448&mpshare=1&scene=24&srcid=0708Wc7JTa1WpOmRyPJ1b5H1&sharer_shareinfo=dac64ab5ba41669c38b8567b725c6e96&sharer_shareinfo_first=dac64ab5ba41669c38b8567b725c6e96&exportkey=n_ChQIAhIQMNkmvy5j3DgBh2WcwEzeXRLyAQIE97dBBAEAAAAAAHbtEfvU%2BZ8AAAAOpnltbLcz9gKNyK89dVj0nxgPj5JdZm0g9Ogpopt9LZBvK2BAs9t0nuOdSfv7zg3XQRB%2F7cF4bMqQGU6zlwKd8n1uXJGwwL4kTEZ1sXIiw8AqfPxZM0Cte%2FU2ohC7EntZdHj%2FqeZxey%2FasoD05WGXBwmk5HXKlQj8td7PGWD7PkAz%2FYovPFZGgjf6fxreYbi90KT7hAJIzxBi119e9jMb4ndmXcJjZl2QBApNEDHIE7u0ElmKz47SiVSVFoYK%2FtOoA4meTj9hkybFHz73OHpcuc4TcWM%2B8%2FvUCxx5&acctmode=0&pass_ticket=ITnOijyaPuPgDuYGkeNyJeFkk5l2AlBhL8gZo7fEuKwcB2wAhAbHwa0y2hrT1qgm&wx_header=0#rd "别让文件系统毁了你项目！5款轻量级单片机文件系统")  
[嵌入式系统中那些比较知名的FAT文件系统](https://mp.weixin.qq.com/s?__biz=Mzg3ODU3Nzk3MQ==&mid=2247502913&idx=2&sn=58d3dd6940128145c757aaabeb9a3b93&chksm=cef1cf3c1fedb9884095f522b1f58af8bd61b5e4a823d9468e3391391a1b7998bf4bf5485fd4&mpshare=1&scene=24&srcid=0708gEuSevh0t43oFAGea4pR&sharer_shareinfo=0444dbdeee7576172622f4f955abadd8&sharer_shareinfo_first=0444dbdeee7576172622f4f955abadd8&exportkey=n_ChQIAhIQYpaOFSsRI9HaaEJZVhjHyRLyAQIE97dBBAEAAAAAAGG2LcpketsAAAAOpnltbLcz9gKNyK89dVj0JdOsedKOhJwxx6o8Nj8RVGKJ9lwpBfXnwMUKumrNXaKEwibHyb%2FI2YhFDvhPtXqagG7rAFHJzGGZ%2BtciL2sQefrDE35LU0QprzO%2BwKRVqBquzBK3e3EsCCjw1KwEMZ%2FOgV2SWXTKAcxxQtPGU9J2GcPBK8DDGMo%2Fgsx7qkaflNV4bOjYU2qnDxu5ns15FircwKggP7YdHPEXoWyOXi6KsKyKlHtN8MadMknXqtvdKpatFmarfZG7ozMCL16%2BlYM65tzU1GQOU8EXRNRE&acctmode=0&pass_ticket=SxnepQt%2BuBK%2FR%2FGeEvTll%2FYEl%2BjNMv8FM6ugsrrnFPvs4qflza%2BvptllXT4RsmPv&wx_header=0#rd "嵌入式系统中那些比较知名的FAT文件系统")  
[小型文件系统如何选择？FatFs和LittleFs优缺点比较](https://blog.csdn.net/zn2857/article/details/144162828 "小型文件系统如何选择？FatFs和LittleFs优缺点比较")  

## FatFs / Petiti FatFs
官方网址：[FatFs - Generic FAT Filesystem Module](https://elm-chan.org/fsw/ff/00index_e.html "FatFs - Generic FAT Filesystem Module")  
源码地址：[FatFs Github](https://github.com/abbrev/fatfs "FatFs Github")  
官方网址：[Petit FAT File System Module](https://elm-chan.org/fsw/ff/00index_p.html "Petit FAT File System Module")  
源码地址：[Petiti FatFs Github](https://github.com/forGGe/petite-fat "Petiti FatFs Github")  

## littleFs
源码地址：[https://github.com/armmbed/mbed-littlefs](https://github.com/armmbed/mbed-littlefs "https://github.com/armmbed/mbed-littlefs")  
[嵌入式Flash文件系统LittleFS，用过都说好！](https://mp.weixin.qq.com/s?__biz=MzAxMDM1Mzg5NA==&mid=2247485237&idx=1&sn=ffde89571bccc1de3d222533f197f3d2&chksm=9a041cdb3b1bbe8fc896d5856495411766e7a3c7059ffcaa6c99527099ea8d746db166992fab&mpshare=1&scene=24&srcid=0708Z4TWv4wqvUYfx8axyYwD&sharer_shareinfo=649c7876c3e48baa68b504a40af06bcc&sharer_shareinfo_first=649c7876c3e48baa68b504a40af06bcc&exportkey=n_ChQIAhIQCiJbtUwySgmY%2FOcrnyp6NRLyAQIE97dBBAEAAAAAAHd1EQCplREAAAAOpnltbLcz9gKNyK89dVj0Ub%2BSQwU2liZSv5um8RsmEM58pKix28cQ2u3R9OZk9WMxTXpdQskvN8BmaQxwUMy4DgUR6yjLauXpVrIn67h6%2BPJMpdQX6URFZlxYlADauW5zcQsRB%2BYz0AHTBocA8EfXJGnpcC2T3AKcrYutWlwziZB6rUo%2FvDSTxnULh8%2BJjzRw%2BIlINyUoCtSpZZwFtepDu84l%2Bq8MK4RTr04x63yvykI5JJBLzNiFwxuPOjrkL7vTfsm9qEQNowoMXpo58hWEHVdVGSoetj6hnV6y&acctmode=0&pass_ticket=%2FpJtBOHpVEgjo8PJLdSDMIy6bcU%2BNC3LU78gdKt6Aoq2dM2eHGD2Ff1emwlQ8cIx&wx_header=0#rd "嵌入式Flash文件系统LittleFS，用过都说好！")  
[LittleFS:一个高度完整的嵌入式文件系统](https://mp.weixin.qq.com/s?__biz=MzU1NTY2MDQ2MQ==&mid=2247483807&idx=1&sn=0d3567f2716b6fe1ff198a0faf7709f6&chksm=fa45915fe9ecb691e60f93ed841f7274d4b5cbe290ab029407af9f8ae53cb575a7c67172b9b9&mpshare=1&scene=24&srcid=0708oH7EsGcd27bxtZjNLBRp&sharer_shareinfo=cb2bc1ccaea790035153e3151192d3b8&sharer_shareinfo_first=cb2bc1ccaea790035153e3151192d3b8&exportkey=n_ChQIAhIQ%2BuwbgapBdQOqshV3qTpBmRLyAQIE97dBBAEAAAAAAN%2BGJ1O3assAAAAOpnltbLcz9gKNyK89dVj0DLpgVfzMHoSB6KRsO8iCjNw%2FRXFOux%2FwMe79EGXQwxixhKk1hHWXkE2RkG0OsnkaYGZ6bBlIu5HmRxMBqQY7V3ifE35HGimJO7Z2%2F1doQnauRZSIRos4nfoBUW3sdmtr03zWAVT2smE1%2BqmUBSy%2F14hmvJ5s3xOOjstzENPOCjKpy2W3gVsTO2l8bM7jCWJ5Ugbn6QqJ2K0EhKWNqlJVSjwFdmtfi1Gjh7PTu0Yvi4z5UwOm6LQAWNswibHN1DYErOKEwnJXVTq4H%2FCS&acctmode=0&pass_ticket=Ru6weoNP4R0C4pSnNwDixVONUhvL9vlo%2FH%2F%2FWV5N811N9MvPTFCfP3hO0kwsEpYO&wx_header=0#rd "LittleFS:一个高度完整的嵌入式文件系统")  

## spiffs
[spiffs 文件系统在esp32中的应用](https://zhuanlan.zhihu.com/p/115869248 "spiffs 文件系统在esp32中的应用")  
[三分钟上马 ESP32 spiffs文件系统](https://blog.csdn.net/weixin_44821644/article/details/109480902 "三分钟上马 ESP32 spiffs文件系统")  

## JesFS
[JesFS Flash文件系统：针对小型控制器的大数据存储](https://mp.weixin.qq.com/s?__biz=Mzg4MzgyNDY1NA==&mid=2247487643&idx=2&sn=6e0738cffed9bae73faabb1c21cb0458&chksm=ce6cfc6cc2617a5aba54a59d17979644f8be620812fb413d46accd6439ef25dbe0705d440e87&mpshare=1&scene=24&srcid=0708aw43d3BdDgQdZJJPj46d&sharer_shareinfo=6f14aa4da35323f0470bbfa7a29182cd&sharer_shareinfo_first=6f14aa4da35323f0470bbfa7a29182cd&exportkey=n_ChQIAhIQu2kv3UNkcKqwD2hs3TNQbBLyAQIE97dBBAEAAAAAAMmNEK9ZPBEAAAAOpnltbLcz9gKNyK89dVj05El35QcWQwWOX1hhMlp7YW85Pw2dQK3ICQzFCo%2BkTouwDIqdv9lO94PAk6u9u9IVFhBZ6jrlw0Myua1DXf89xOfvg0BTpxu1MbUv2gmdWhgmAlmWyqLIh2Sj%2Ffnv9rpMasGSV4fQOoNb9MatPjuhv4r7nj89p9Gyi2d0eaipJdwmeXWaowqZlw6Syki7j6NRB92Dt6YyiWR7kNJwbky8dJOuu5kXf08tDVNSVWn6L1rhM2OM7YY8Ygz8E0%2F7TLR1UenHv%2FYyb%2B%2Fu99lK&acctmode=0&pass_ticket=SVhxZ6nyDUEtKgcIlhgFtZK0j6HEsHsDoR%2F1uE9uNOUVbyah2O4f3kbgw%2FNKvR3f&wx_header=0#rd "JesFS Flash文件系统：针对小型控制器的大数据存储")  

## znFAT
[振南的znfat，国内唯一的嵌入式文件系统方案](https://gitee.com/dbembed/znfat "振南的znfat，国内唯一的嵌入式文件系统方案")  


