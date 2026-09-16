# 程序员大狐狸 · 博客源码

> [bigfox.me](https://bigfox.me) 的源码 —— 基于 [Fuwari](https://github.com/saicaca/fuwari) 深度二次开发的个人技术博客，记录**嵌入式 · AI · 独立开发**。

## ✨ 特性

- 🚀 **Astro 5 静态构建** —— 纯静态输出，可部署到任意静态托管
- 🌙 **深色 / 浅色主题** —— 主题色可配置（当前 hue 260 蓝色系）
- 🔍 **本地搜索** —— 前端索引，无需后端服务
- 🏷️ **标签云 / 分类 / 归档** —— 从文章数据自动聚合
- 📝 **碎片笔记 `/notes`** —— 直接解析 Obsidian 日记（Memoria）并渲染
- 📚 **导航站 `/nav`** —— 数据驱动的常用网站导航页
- 💬 **Giscus 评论** —— 由 GitHub Discussions 驱动
- 📡 **RSS / Sitemap / SEO** —— JSON-LD 结构化数据、Open Graph 标签
- 🎨 **Expressive Code 代码高亮** —— 语言角标、可折叠代码段
- ➗ **KaTeX 数学公式** + GitHub 风格 admonition（note/tip/warning…）
- 🔄 **Swup 页面过渡** —— 平滑的页面切换动画

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Astro | 5.7.9 | 静态站点生成器 |
| Tailwind CSS | 3.4 | 样式框架 |
| Svelte | 5 | 交互组件（搜索、设置面板） |
| TypeScript | 5.8 | 类型检查 |
| pnpm | 9.14（`packageManager` 锁定） | 包管理器 |

## 🚀 快速开始

环境要求：**Node.js ≥ 22**（wrangler 4 的硬性要求）、**pnpm 9**。本项目仅使用 pnpm（锁文件为 `pnpm-lock.yaml`），请勿使用 npm / yarn。

```bash
git clone https://github.com/levy1024/bigfoxme.git
cd bigfoxme
pnpm install
pnpm dev            # 开发服务器 http://localhost:4321
```

构建与本地预览：

```bash
pnpm build          # 静态构建，产物在 dist/
pnpm preview        # 预览构建产物
```

### 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 开发服务器（端口固定 4321） |
| `pnpm build` | 静态构建到 `dist/` |
| `pnpm preview` | 预览构建产物 |
| `pnpm deploy` | 发布 `dist/` 到 Cloudflare Workers（需先 `pnpm build`） |
| `pnpm new-post` | 新建文章 |
| `pnpm add-frontmatter` | 批量补 frontmatter + 自动提取封面图 |
| `pnpm organize-posts` | 按分类整理文章 |
| `pnpm clean` | 清理未引用的图片 |
| `pnpm del-space` | 删除文件名中的空格 |
| `pnpm format` | Biome 格式化 `./src`（tab 缩进、双引号） |
| `pnpm lint` | Biome 检查并自动修复 |
| `pnpm type-check` | `tsc --noEmit` 类型检查 |

## 📁 目录结构

```
├── public/                    静态资源（头像、图标、二维码等）
├── scripts/                   内容维护脚本（新建文章、补 frontmatter…）
├── src/
│   ├── components/            组件：widget（侧边栏）/ control / misc
│   ├── content/
│   │   ├── posts/             博客文章，按分类分子目录
│   │   └── Memoria/           碎片笔记源文件 → 渲染到 /notes
│   ├── data/                  友链、导航站等 JSON 数据
│   ├── layouts/               Layout / MainGridLayout
│   ├── pages/                 路由：posts / categories / tags / archive / notes / nav …
│   ├── plugins/               自定义 remark / rehype 插件
│   ├── styles/                全局样式（含 markdown、代码高亮、过渡动画）
│   ├── config.ts              站点配置：标题、导航栏、资料卡、评论…
│   └── content.config.ts      内容集合 schema
├── astro.config.mjs           Astro 配置（Markdown 管线、短链跳转）
└── .github/workflows/deploy.yml   构建并部署到 Cloudflare Workers
```

## ✍️ 写文章

文章放在 `src/content/posts/{分类}/`，**目录名即分类名**（当前：`AI` / `Android` / `嵌入式` / `运维` / `其它`，侧边栏分类列表自动聚合）。

frontmatter 示例：

```yaml
---
title: 文章标题
published: 2026-01-01      # ISO 日期，必须用连字符
tags: [标签1, 标签2]        # 数组格式
category: 嵌入式
draft: false               # 小写布尔值；构建时会过滤 draft: true
pinned: false              # 置顶
image: ""                  # 留空则自动取正文第一张图作为封面
description: ""            # 留空则自动取首段作为摘要
---
```

几条容易踩的规则：冒号后必须有空格、日期用 `2026-01-01` 而非 `2026/01/01`、布尔值必须小写。

## 📦 部署

**线上地址：<https://bigfox.me>**（`www.bigfox.me` 同样可访问），托管在 Cloudflare Workers，2026-09-16 上线。

日常更新不需要任何部署命令，推上去就自动发布：

```bash
git add -A
git commit -m "post: 新文章"
git push          # GitHub Actions 自动构建并发布，约 1 分钟
```

流程：push 到 `main` 触发 `.github/workflows/deploy.yml` —— 在 GitHub Actions 内 `pnpm build`，再由 `cloudflare/wrangler-action` 把 `dist/` 作为静态资源上传（Worker 配置见 `wrangler.jsonc`）。wrangler 按内容哈希增量上传，只改一篇文章时只传变化的文件。需要仓库 Secrets：`CLOUDFLARE_API_TOKEN`（权限 `Workers Scripts: Edit`）、`CLOUDFLARE_ACCOUNT_ID`。

本地手动发布：`pnpm build && pnpm deploy`。

> ⚠️ 构建环境的 pnpm 必须锁在 **9.x**：`patches/astro.patch`（关闭 Astro 图片优化与文件名哈希）靠 `pnpm.patchedDependencies` 生效，pnpm 10+ 已不读 `package.json` 里的该字段，补丁会静默失效导致产物不一致。因此**不要**改成让 Cloudflare 自己构建。

> ⚠️ `bigfoxme.bigfoxme.workers.dev`（Worker 的默认域名）**不要对外使用**：`.workers.dev` 后缀被 GFW 按 TLS SNI 阻断，国内访问会立即连接重置。它只是部署端点，对外一律用 `bigfox.me`。

其他平台：`edgeone.json` 仍可用于 EdgeOne Pages。原先发布到 `page` 分支的 GitHub Pages 流程已移除，`origin/page` 会停留在最后一次构建。

### 上线后待办

- [ ] 开启 **Always Use HTTPS**（Cloudflare → bigfox.me → SSL/TLS → Edge Certificates），目前 `http://bigfox.me/` 返回 200 而非跳转 https
- [ ] 安装 **giscus App**（<https://github.com/apps/giscus/installations/new>），否则文章评论区不显示

## 🤝 鸣谢

- [Fuwari](https://github.com/saicaca/fuwari) —— 本项目的上游主题，感谢原作者及贡献者
- 以及所有上游依赖的作者

## 📄 许可证

[MIT License](LICENSE)
