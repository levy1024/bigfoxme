---
title: "AI 搜索，搜得更准，看得更清 —— 我使用 AI 做了一个调用 DeepSeek Search API 的搜索网站"
published: 2026-11-11
tags:
- 搜索
- DeepSeek Search
category: AI
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

2026年 10 月 17 日，DeepSeek 开放了自研搜索引擎的 Search 和 Fetch 这两个 API 接口。  

当时听到这个消息，我就有一个想法：一定要试试，用这个接口来搜索我想找的东西。

为什么，因为它有两个特点：无广告！无竞价排名！有广告还可以接受，而竞价排名，忍无可忍，现在无需再忍。

但是，使用 DeepSeek 的 Search 功能，有个问题，它只是 API 接口，不是直接可以在界面输入搜索词就可以的。

于是，我使用 AI 大模型（DeepSeek-V4.1-Flash），帮我做了一个搜索网站，调用 DeepSeek 的 Search API 接口来获取搜索结果并展示。—— 这样的小网站，现在对大模型来说，简直就是小菜一碟。

除了网站代码的实现，部署网站上线，全都是使用 AI 大模型（DeepSeek-V4.1-Flash）。

网址：[https://dss.bigfox.me](https://dss.bigfox.me)。

有兴趣尝试的同学可以访问上述网址，体验其搜索效果。

网站设置了访问密码，防止网站被滥用，可以关注我的微信公众号：程序员大狐狸，发送"搜索”获取。

调用这个搜索接口，DeepSeek 是收费的。我上线网站并免费开放，只是想给感兴趣的同学一个体验入口，并不是想中转收费，所以我给网站设置了搜索频率和次数的限制，望悉知。

网站也开源，地址：[https://github.com/bigfoxme/ai-search](https://github.com/bigfoxme/ai-search)，如果你也想自己部署一个，可以直接使用。




