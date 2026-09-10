---
title: 内容规范
created: 2026-05-17
tags: [规范, 参考]
aliases: [claude规范, 写作规范]
---

# 内容规范

> 本文件是 AI 协作时的操作规范，确保产出与现有内容风格一致。

---

## 一、项目概览

- **框架**：Astro + Fuwari 主题
- **仓库**：`D:\project2026\fuwari`
- **GitHub**：https://github.com/dqtx760/Firefly
- **网站**：https://www.bigfox.me/
- **内容根**：`D:\project2026\fuwari\src\content`
- **Obsidian 仓库**（3 个独立 vault）：
  - `content` → `D:\project2026\fuwari\src\content`（博客内容）
  - `zhishiku` → `D:\project2026\zhishiku`（私下用）
  - `obsidian-vault` → `D:\project2026\obsidian-vault`（模板）

---

## 二、目录结构

```
src/content/
├── 01-输入/                ← 原始输入、素材、选题与模板（不直接发布）
│   ├── 01-Clipings/        ← 网页剪藏
│   ├── 02-get笔记/         ← Get 笔记插件同步内容
│   ├── 03-微信/            ← 微信文章、收藏
│   ├── 04-选题/            ← 选题素材
│   ├── 05-口喷稿/          ← 口播/口喷稿
│   ├── 06-微信读书/        ← 微信读书笔记
│   ├── 07-Daily/           ← 日常记录
│   └── archive/            ← 已编译归档（/up-Library-ingest 完成后移入）
├── Library/                ← 私人知识库（编译 01-输入 的输出，非发布）
│   ├── index.md            ← 知识库全局索引
│   ├── log.md              ← 操作日志（append-only）
│   ├── schema.md           ← 页面模板与操作规范
│   ├── concepts/           ← 概念、方法论、框架
│   ├── entities/           ← 工具、产品、人物、公司
│   ├── sources/            ← 原始素材摘要
│   └── syntheses/          ← 综合分析报告
├── Memoria/                ← 动态内容（公开发布）→ 博客导航栏 Notes
├── posts/                  ← 博客文章（公开发布）
│   ├── AIHacks/            ← AI 工具与自动化
│   ├── Software/           ← 软件相关
│   ├── Technical/          ← 技术类
│   └── Workflow/           ← 工作流类
├── wiki/                   ← posts 的索引 wiki（公开发布，由 AI 维护）→ 博客导航栏 Wiki
│   ├── index.md            ← Wiki 首页
│   ├── 目录.md             ← Wiki 目录
│   ├── overview.md         ← 内容总览
│   ├── purpose.md          ← Wiki 目的说明
│   ├── schema.md           ← Wiki 结构说明
│   ├── meta.json.md        ← Wiki 元数据
│   └── log.md              ← Wiki 维护日志
├── Xenia/                  ← 快捷键、命令参考（非发布）
├── Yoke/                   ← 参考资料合集（非发布）
├── Zen/                    ← Dataview 查询模板（非发布）
├── claude.md               ← 本规范文件
└── index.md                ← 本地文章索引（自己用）
```

### 目录用途速查

| 想做什么          | 去哪个目录                               |
| ------------- | ----------------------------------- |
| 写博客文章         | `posts/<分类>/`                       |
| 建文章索引（公开）     | `wiki/` → 博客导航栏 Wiki                |
| 本地文章索引（自己用）   | `index.md`                          |
| 发动态           | `Memoria/` → 博客导航栏 Notes            |
| 存 Get 笔记      | `01-输入/02-get笔记/`                  |
| 存参考资料         | `Yoke/`                             |
| 记快捷键/命令       | `Xenia/`                            |
| 写 Dataview 查询 | `Zen/`                              |
| 存网页剪藏         | `01-输入/01-Clipings/`                |
| 存微信文章         | `01-输入/03-微信/`                    |
| 存选题/口喷稿/读书笔记 | `01-输入/04-选题/`、`05-口喷稿/`、`06-微信读书/` |
| 编译素材到知识库      | `Library/`（使用 `/up-Library-ingest` 命令）  |

⚠️ `01-输入/`、`Library/`、`Yoke/`、`Xenia/`、`Zen/` 主要是本地资料区，不直接作为博客文章发布。
⚠️ `index.md` 更新专门使用技能 UpdateCheck。

### 四层内容体系

| 层 | 目录 | 角色 | 说明 |
|---|---|---|---|
| 输入层 | `01-输入/` | 原始素材（只读） | 网页剪藏、微信收藏、Get 笔记、研究资料 |
| 私人知识层 | `Library/` | 编译输出（AI 读写） | 从 `01-输入/` 提炼的结构化双链知识，使用 `/up-Library-ingest` 编译 |
| 博客文章层 | `posts/` | 公开发布 | 面向读者的博客文章 |
| 博客索引层 | `wiki/` | 公开索引（AI 维护） | `posts/` 的结构化索引，博客导航栏 Wiki |

数据流向：`01-输入/` → `/up-Library-ingest` → `Library/`（私人知识沉淀）；`posts/` → `wiki/`（对外索引）。

---

## 三、文章分类规则

| 分类 | 目录 | 内容范围 | 示例 |
|------|------|---------|------|
| AIHacks | `posts/AIHacks/` | AI 工具、模型、自动化技能 | Obsidian CLI、Agent-Reach、MCP |
| Software | `posts/Software/` | 桌面软件、工具应用 | PixPin、ShareX、Terminal |
| Technical | `posts/Technical/` | 技术教程、运维配置 | 博客搭建、CF加速、路由器 |
| Workflow | `posts/Workflow/` | 工作流、效率方法 | 博客发布流、图床配置、笔记模板 |

**分类判断原则**：
- 涉及 AI 能力 → AIHacks
- 纯软件使用 → Software
- 需要技术背景/动手配置 → Technical
- 多工具串联的流程 → Workflow

---

## 四、Frontmatter 规范

每篇博客文章**必须**包含以下 frontmatter：

```yaml
---
title: 文章标题
published: 2026-05-17
tags:
  - 标签1
  - 标签2
category: AIHacks
draft: false
pinned: false
image: https://gitee.com/da-qiang-classmate/typora/raw/master/image/xxx.webp
---
```

### 字段说明

| 字段 | 必填 | 格式 | 说明 |
|------|------|------|------|
| `title` | ✅ | 字符串 | 文章标题，不含日期 |
| `published` | ✅ | YYYY-MM-DD | 发布日期 |
| `tags` | ✅ | 列表 | 至少 1 个标签，小写英文 |
| `category` | ✅ | 枚举 | AIHacks / Software / Technical / Workflow |
| `draft` | ✅ | 布尔 | 草稿为 true，发布为 false |
| `pinned` | 可选 | 布尔 | 置顶文章设为 true |
| `image` | ✅ | URL | 封面图，Gitee 图床链接 |

### 标签规范

- 小写英文，用连字符连接：`cli`、`ai-image`、`skill`
- 不超过 3 个标签
- 通用标签：`cli`、`skill`、`api`、`workflow`、`obsidian`

---

## 五、图片规范

### 封面图

- **后端**：GPT-Image-2（apimart 第三方 API，$0.005/张）
- **尺寸**：1672×941 PNG（1K 分辨率）
- **公众号用**：压缩至 900px + JPEG 格式
- **存储**：PicGo → Gitee 图床
- **链接格式**：`https://gitee.com/da-qiang-classmate/typora/raw/master/image/<filename>.webp`

### 文内配图

- 使用 `baoyu-article-illustrator` 技能自动配图
- 图片放在封面图之后、正文第一段之前
- 语法：`![](图床URL)`

---

## 六、Obsidian CLI 参考

- **路径**：`/d/software/Obsidian/obsidian`
- **版本**：1.12.7
- **Vault 名**：`zhishiku`（或 `obsidian-vault`）
- **详细命令参考**：`Xenia/Obsidian-cll命令.md`

### 常用操作

```bash
# 搜索文章
obsidian search query=关键词 vault=zhishiku

# 读取文章
obsidian read vault=zhishiku file="文章名"

# 创建文章
obsidian create vault=zhishiku path="posts/AIHacks/新文章.md" content="初始内容"

# 追加内容
obsidian append vault=zhishiku file="文章名" content="追加内容"

# 查看标签
obsidian tags vault=zhishiku counts sort=count

# 列出文件
obsidian files vault=zhishiku folder="posts/AIHacks"
```

### 注意事项

- CLI 需要 Obsidian GUI 在运行
- `file=` 用 wikilink 名，`path=` 用相对路径
- PowerShell profile 有语法错误，用 Git Bash 或 `-NoProfile` 运行

---

## 七、写作风格

- **语气**：直接、实用，不绕弯子
- **开头**：先说结论/价值，再展开
- **结构**：用 `###` 三级标题分段，避免过深的层级
- **列表**：习惯用 emoji 数字（一二三四五六）排版
- **代码块**：标注语言类型 ` ```bash `、` ```yaml `
- **强调**：用 `**粗体**` 标记关键信息
- **避免**：空洞的废话、过度铺垫、"让我们开始吧"类套话

---

## 八、内容分发

| 平台 | 格式要求 | 工具 |
|------|---------|------|
| 博客 | Markdown + frontmatter | Astro build |
| 即刻 | 短文，配图 | 手动发布 |
| Twitter/X | 280 字符限制 | x-post 改写 |
| 飞书 | 长文/摘要 | lark-cli |
| 公众号 | Markdown 转 | 配图需压缩 |

---

## 九、工具链速查

| 用途 | 工具 |
|------|------|
| 内容生产 | khazix-writer |
| 文章配图 | baoyu-article-illustrator |
| 封面图 | GPT-Image-2 API |
| 图床上传 | PicGo → Gitee |
| 飞书操作 | lark-cli |
| 网页抓取 | Agent-Reach |
| 笔记管理 | Obsidian CLI |
