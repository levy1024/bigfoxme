---
title: "AI 辅助的能力让我更惊叹了：Claude Code 帮我解决了博客部署的问题！"
published: 2026-03-05
tags:
- Claude Code
category: AI
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

最近使用 Claude Code 完全帮我生成了一个基于 next.js 的博客主页，并让它生成了部署文档。

当我按照部署文档部署后，node.js 的后台服务无法启动，反复检查了多遍都解决不了问题。最后突然想到，何不继续让 Claude Code 帮我解决这个问题呢？

输入提示词：我已按照你生成的部署文档手动部署项目，但是 node.js 系统服务无法启动，是什么原因？

然后 Claude Code 一步步按照部署流程检查，它自己也发现了服务无法启动，最后输出：

```
● 现在我明白问题了！Node.js 是通过 nvm 安装的，systemd 服务无法找到正确的 Node.js 路径。我需要更新服务配置以使用完整的 Node.js 路径：

● Update(/etc/systemd/system/bigfoxme-homepage.service)

╭───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Edit file │
│ ╭───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮ │
│ │ ../../../../../etc/systemd/system/bigfoxme-homepage.service │ │
│ │ │ │
│ │ 6 Type=simple │ │
│ │ 7 User=root │ │
│ │ 8 WorkingDirectory=/usr/share/caddy/bigfoxme/bigfoxme_homepage │ │
│ │ 9 - ExecStart=/usr/bin/npm start │ │
│ │ 9 + ExecStart=/home/ubuntu/.nvm/versions/node/v18.20.7/bin/npm start │ │
│ │ 10 Restart=always │ │
│ │ 11 RestartSec=10 │ │
│ │ 12 Environment=NODE_ENV=production │ │
│ │ 13 Environment=PORT=3000 │ │
│ │ 14 + Environment=PATH=/home/ubuntu/.nvm/versions/node/v18.20.7/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin │ │
│ │ 15 │ │
│ │ 16 [Install] │ │
│ │ 17 WantedBy=multi-user.target │ │
│ ╰───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯ │
│ Do you want to make this edit to bigfoxme-homepage.service? │
│ ❯ 1. Yes │
│ 2. Yes, allow all edits in system/ during this session (shift+tab) │
│ 3. No, and tell Claude what to do differently (esc) │
│ │
╰───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

不仅找到了原因，还自己把配置文件给改正确了。

这个结果，确实惊艳到我了！赞！

原来它生成的部署文档中，启动 node.js 服务，npm 的路径使用的是标准安装的路径：
ExecStart=/usr/bin/npm start
而我当时为了方便多版本的管理，是使用 nvm 安装 node.js 的，所以，需要更改启动服务的 npm 路径：
ExecStart=/home/ubuntu/.nvm/versions/node/v18.20.7/bin/npm start


