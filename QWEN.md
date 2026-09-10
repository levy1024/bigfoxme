# QWEN.md - 项目指令集

## 项目概述

基于 **Astro 5.7+** 深度二次开发的**个人技术博客**，集成 Obsidian + PicList + Gitee 图床工作流，专为技术博客打造。

- **博客地址**: https://bigfox.me
- **GitHub**: https://github.com/levy1024/bigfoxme
- **技术栈**: Astro 5.7.9 + Tailwind CSS 3.4+ + Svelte 5.28+ + Vite + pnpm 9.14+

---

## ⚠️ 开发注意事项

1. **Typora 缓存问题**：编辑 md 文件后，Typora 可能不显示变化，需 Ctrl+S 保存并关闭重开
2. **image 字段验证**：`src/content/config.ts` 中 image 字段需添加 `.nullable()` 允许空值
3. **封面图提取**：`scripts/add-frontmatter.cjs` 会自动提取文章正文第一张图片（忽略 frontmatter）
4. **移动端隐藏**：侧边栏使用 `hidden lg:block` 类在移动端隐藏
5. **画廊标题**：已隐藏，图片本身包含标题信息

---

## 常用命令

```bash
# 安装依赖
pnpm install

# 开发服务器 (端口固定 4321)
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 创建新文章
pnpm new-post

# 添加 frontmatter 模板
pnpm add-frontmatter

# 按分类组织文章
pnpm organize-posts

# 清理未使用的图片
pnpm clean

# 删除文件名空格
pnpm del-space

# 代码格式化
pnpm format

# 代码检查
pnpm lint
```

---

## 项目结构

```
fuwari/
├── src/
│   ├── components/          # 组件 (Astro/Svelte)
│   │   ├── widget/          # 侧边栏组件
│   │   │   ├── TagList.astro      # 3D标签云
│   │   │   ├── CategoryList.astro # 分类列表
│   │   │   └── Profile.astro      # 个人信息卡片
│   │   └── PostPage.astro        # 文章列表页
│   ├── content/posts/       # 博客文章 (*.md)
│   │   ├── AIHacks/         # AI 相关
│   │   ├── Software/        # 软件推荐
│   │   ├── Technical/       # 技术教程
│   │   ├── Workflow/        # 工作流
│   │   └── Xenia/           # 碎碎念
│   ├── pages/
│   │   └── posts/           # 文章详情页
│   ├── data/friends/        # 友链数据
│   ├── layouts/             # 布局文件
│   ├── styles/              # CSS 样式
│   ├── utils/               # 工具函数
│   └── config.ts            # 站点配置
├── scripts/
│   └── add-frontmatter.cjs  # 封面自动提取脚本
├── public/                  # 静态资源
└── *.config.mjs            # 配置文件
```

---

## 站点配置

编辑 `src/config.ts`:

- **siteConfig**: 站点标题、副标题、描述、主题色 (hue: 268 冷紫蓝系)
- **navBarConfig**: 导航栏链接
- **profileConfig**: 头像、名称、简介、社交链接

---

## 文章规范

### Frontmatter 字段

```yaml
---
title: 文章标题
published: 2026-04-22  # ISO 格式 (必须用连字符)
tags: [标签1, 标签2]
category: Software     # Software | Technical | AIHacks | Workflow | Xenia
draft: false          # 必须小写
pinned: false
image: https://xxx.com/image.webp  # 可选，留空自动提取第一张图
---
```

### 注意事项

- YAML 冒号后必须加空格: `title: 文章`
- 日期格式: `2026-04-22` (不是 `2026/04/22`)
- 标签格式: `tags: [标签1, 标签2]`
- image 字段支持留空，脚本会自动提取

---

## 分类说明

| 分类 | URL 路径 | 说明 |
|------|----------|------|
| Software | /categories/Software/ | 软件推荐 |
| Technical | /categories/Technical/ | 技术教程 |
| AIHacks | /categories/AIHacks/ | AI 相关 |
| Workflow | /categories/Workflow/ | 工作流 |
| Xenia | /categories/Xenia/ | 碎碎念 |

---

## 新增功能 (2026-04)

| 功能 | 文件 | 说明 |
|------|------|------|
| 3D标签云 | `src/components/widget/TagList.astro` | 萤火虫效果旋转星球 |
| 归档增强 | `src/components/ArchivePanel.astro` | 年份+月份分组 |
| 移动端优化 | `src/layouts/MainGridLayout.astro` | 侧边栏移动端隐藏 |

---

## 自定义特性

- **冷紫蓝渐变主题** (hue: 268)
- **霞鹜文楷字体** (LXGW WenKai)
- **Giscus 评论** (GitHub Discussions)
- **Swup 页面切换动画**
- **Expressive Code** 代码高亮
- **Katex 数学公式支持**
- **自定义 rehype 组件**: note, tip, important, caution, warning, github, url

---

## 开发约定

1. 使用 **pnpm** 作为包管理器
2. 代码格式化: `pnpm format` (Biome)
3. 代码检查: `pnpm lint` (Biome)
4. 开发服务器端口固定为 **4321**
5. 静态资源放 `public/` 目录
6. 文章图片放 `src/content/assets/images/` 或使用 Gitee 图床

---

## 工作流

1. 在 Obsidian 中写文章，填写 frontmatter
2. 运行 `node scripts/add-frontmatter.cjs` 自动提取封面图
3. `pnpm dev` 本地预览
4. 推送 GitHub

---

## 部署

推荐部署到 **EdgeOne（腾讯云）**：

```
框架预设: Astro
根目录: ./
输出目录: dist
编译命令: pnpm run build
安装命令: pnpm install
```