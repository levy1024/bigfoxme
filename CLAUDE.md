# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

基于 Astro 5.7.9 深度二次开发（源自 Fuwari）的个人技术博客，静态输出（`output: "static"`），`trailingSlash: "always"`。技术栈：Astro + Tailwind CSS 3.x + Svelte 5 + pnpm。站点：https://bigfox.me（标题「程序员大狐狸」）

**pnpm only** — 锁文件是 `pnpm-lock.yaml`，`.npmrc` 强制版本管理。不要使用 npm/yarn。

## 常用命令

```bash
pnpm dev            # 开发服务器，端口固定 4321
pnpm build          # 静态构建 → dist/
pnpm preview        # 预览构建产物
pnpm format         # Biome 格式化 ./src（tab 缩进，双引号）
pnpm lint           # Biome 检查 + 自动修复 ./src
pnpm type-check     # tsc --noEmit --isolatedDeclarations
pnpm new-post       # 创建新文章（传文件名参数）
pnpm add-frontmatter  # 批量补 frontmatter + 自动提取封面图
pnpm organize-posts # 按分类整理文章
pnpm clean          # 清理未使用图片
pnpm del-space      # 删除文件名空格
```

代码风格由 Biome（非 ESLint/Prettier）强制：tab 缩进、双引号；`.astro`/`.svelte` 覆盖关闭 `useConst`/`useImportType`。CSS 使用 oklch 颜色 + `var(--primary)` 主题色。

## 内容系统（重点）

`src/content/` 同时是一个 **Obsidian 仓库**，被 Astro 5 的 glob loader 有选择地加载。集合定义在 **`src/content.config.ts`**（注意：不是 `src/content/config.ts`，后者只是备份 `.bak`）。

### 集合配置

- `posts` — 唯一真正加载的集合，glob `**/*.{md,mdx}` base `./src/content/posts`。schema 见 `src/content.config.ts`。
- `Zen` / `01-输入` / `Xenia` / `Yoke` / `Memoria` — **空 loader 占位**（simple loader 空实现 `emptyLoader`，不触碰文件系统），阻止 Astro 自动为这些 Obsidian 目录创建 collection。不要删除这些空定义；目录即使不存在也不会再产生 glob-loader 警告。

### 博客文章

- 路径：`src/content/posts/{分类}/`。实际使用的分类是 **中文文件夹名**：`AI` / `Android` / `嵌入式` / `运维` / `其它`（数据驱动，非硬编码）。
- 侧边栏 `CategoryList.astro` 从 posts 的 `category` 字段动态聚合，链接到 `/categories/{category}/`。
- frontmatter 关键规则：`published` 用连字符 ISO 日期；`tags` 用数组格式；布尔值小写；`image` 可空（留空自动提取正文第一张图）；`draft: true` 在 `PROD` 下过滤。frontmatter 里可用内联注释（如 `draft: false # true=草稿`）。
- `getSortedPosts()`（`src/utils/content-utils.ts`）是文章列表/详情/归档的通用入口：置顶在前，按 `published` 倒序，并回填 prev/next。

### Memoria → /notes 碎片笔记

- 源：`src/content/Memoria/2026.md` 等 Markdown，格式为 `## YYYY-MM-DD 周X` 下挂 `- HH:MM` 条目，`#标签` 结尾。
- 由 **运行时文件系统解析**（`src/utils/notes-utils.ts` 的 `parseNotes()`，不是 Astro collection），按天分组、提取标签和 `![[attachment]]` 图片。
- `/notes/` 页面（`src/pages/notes/index.astro`）客户端筛选 + 分页。
- `src/integrations/memoria-assets.ts` 在 build/server 启动时把 `Memoria/attachments` 同步到 `public/memoria-attachments/`。

### Library（Zettelkasten）与素材输入

- `src/content/01-输入/` 是 Obsidian 素材库（Clipings / get笔记 / 微信 / Daily 等子目录）。
- `src/content/Library/` 是经 `/Update` skill 编译的知识库（`sources/` `entities/` `concepts/` `syntheses/`），不参与 Astro 渲染。
- `src/content/.claude/skills/` 里有一套内容管线 skill（`Update`、`up-Library-ingest`、`up-index`、`Library-query`、`Library-lint`），用于素材编译与索引。

### Vite 忽略插件（astro.config.mjs 内联）

`src/content/` 混入大量非博客文件，构建会失败除非有这些忽略规则（在 `load`/`resolveId` 钩子）：
- `.canvas` 文件返回空模块
- `get attachment` 目录下无扩展名附件返回空模块
- `obsidian-home-console` 目录的 JS/TS 返回空模块
- `content/get` / `get笔记` 引用的本地图片被标记 external

**新增内容文件时注意别踩到这些边界**：不要把可执行 JS/TS 放进 `src/content/` 任何位置（除了已列出的 `obsidian-home-console` 例外），否则 Rollup 会尝试解析并失败。

## 架构

### 配置入口 `src/config.ts`

导出 `siteConfig`（标题「程序员大狐狸」、hue: 260 蓝色系主题、favicon、TOC）、`navBarConfig`（含 `/notes/` `/nav/` 链接）、`profileConfig`、`licenseConfig`、`imageFallbackConfig`、`expressiveCodeConfig`、`gitHubEditConfig`、`noticeConfig`。类型在 `src/types/config.ts`。`src/constants/` 有主题常量与图标集合。

### 组件分层

- `src/components/widget/` — 侧边栏组件（Profile、CategoryList、TagList 3D 标签云、TOC、SideBar、PageHeader 等）
- `src/components/control/` — Pagination、BackToTop
- `src/components/misc/` — Markdown、ImageWrapper、License
- `Search.svelte` 用 `client:only="svelte"`（跳过 SSR），Navbar 用固定宽度容器包裹它避免 SSR/客户端 DOM 宽度不一致导致的点击抖动。`DisplaySettings.svelte` 同理。

### 页面

- `src/pages/posts/[...slug].astro` — 文章详情（Giscus 评论 + Markdown 渲染管线）
- `src/pages/posts/[page].astro` — 文章列表分页
- `src/pages/categories/[category].astro`、`src/pages/tags/[tag].astro`、`src/pages/archive/index.astro`
- `src/pages/notes/index.astro` — 碎片笔记（见上）
- `src/pages/nav.astro` + `src/data/nav/*.json` — 导航站页面
- `src/pages/rss.xml.ts`、`src/pages/robots.txt.ts`、404、about、friends、sponsors

### .astro 编写陷阱

- **注释/正文里不要出现字面量的 `<script>`**。Vite 的依赖扫描器是用正则从 `.astro` 源文件里抠 script 标签的，注释里那个 `<script>` 会被它当成真的开标签，于是「它到下一个 `</script>` 之间」的所有内容（注释、frontmatter、模板 HTML）都被当 JS 丢给 esbuild，报 `Expected ";" but found ...`。要描述 script 相关行为时改写成「script 标签」之类不带尖括号的说法。（只针对被 Vite 扫描的 `.astro` 等源文件；`CLAUDE.md`、`README.md` 这类根目录文档不在扫描范围内。）

### Markdown 渲染管线（astro.config.mjs）

remark：math → reading-time → excerpt → GitHub admonitions → directives → sectionize。rehype：katex → slug → image-fallback → 自定义组件（`:github`/`:url`/admonition 卡片）→ external links → autolink headings。

自定义插件在 `src/plugins/`（remark-*.mjs/js 和 rehype-component-*.mjs）。

### 样式

- `src/styles/main.css` — 全局 + `card-base` 组件类 + rainbow mode
- `src/styles/markdown.css`、`expressive-code.css`、`scrollbar.css`、`transition.css`（Swup 页面过渡）
- 布局：`src/layouts/Layout.astro`（head 内联主题初始化脚本，防闪烁）+ `MainGridLayout.astro`（带侧边栏网格）

### 路径别名

`@components/*`、`@layouts/*`、`@utils/*`、`@constants/*`、`@/*` → `src/*`（tsconfig.json + astro）。

## 构建与部署

- **线上地址 https://bigfox.me**（`www.bigfox.me` 同样 200）：Cloudflare Workers + 自定义域，2026-09-16 上线。日常更新只需 `git add -A && git commit && git push`，约 1 分钟自动上线，无需手动部署命令。
- **Cloudflare Workers（唯一部署链路）**：GitHub Actions（`.github/workflows/deploy.yml`）push 到 `main` → `pnpm build` → `cloudflare/wrangler-action` 上传 `dist/`。Worker 名 `bigfoxme`、assets 目录 `./dist`、`not_found_handling: 404-page`、`html_handling: auto-trailing-slash`（对齐 Astro 的 `trailingSlash: "always"`）均在 `wrangler.jsonc`。本地发布 `pnpm deploy`（需先 build）；Secrets 为 `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`。
- **别把 `bigfoxme.bigfoxme.workers.dev` 当对外地址**：该后缀被 GFW **SNI 阻断**——实测同一 Cloudflare IP 换个 SNI 就立刻从「0.25 秒 RST」变 200，说明是看 TLS ClientHello 里的 `.workers.dev` 就发 RST。换 DNS / 写 hosts / 开 DoH **全都无效**（包到不了 HTTP 层）。它只是部署端点，国内读者打不开。另外账号子域根 `bigfoxme.workers.dev` 无 A 记录、挂不了 worker，地址格式固定为 `<worker名>.<账号子域>.workers.dev`，无法缩短。
- **挂自定义域**：`PUT /accounts/{account_id}/workers/domains`（body 含 `zone_id` / `hostname` / `service` / `environment`）。若该 hostname 已有 A/CNAME 记录会冲突，**必须先删**（旧主机商迁移过来时尤其注意）。
- **pnpm 必须锁 9.x**：`patches/astro.patch`（关闭 Astro 图片优化与哈希重命名）靠 `package.json` 的 `pnpm.patchedDependencies` 生效，pnpm 10+ 不再读该字段 → 补丁静默失效。所以不要在 Cloudflare 侧构建，也不要升级 pnpm。
- **Node 必须 22+**：`wrangler` 4 要求 Node ≥ 22。CI 里若用 Node 20，`wrangler-action` 的版本探测会失败并静默回退安装 `wrangler@3.90.0`，而 3.x 读不懂只有 `assets` 没有 `main` 的配置，报 `Missing entry-point`。workflow 已钉 Node 22 + `wranglerVersion: '4'`，改回 20 就会复现。
- **短链要同步三处**：`astro.config.mjs` 的 `redirects`、`public/_redirects`（Cloudflare）、`edgeone.json`（备用的 EdgeOne）。新增短链时三处都改，以 `_redirects` 为准。注意 `/long` 的域名是一长串 `i`（49 个 `i` + `.` + 42 个 `i` + `.in`），**别手敲**，从 `_redirects` 复制。
- **EdgeOne 暂不启用**：`edgeone.json` 仍可用于 EdgeOne Pages，与 Cloudflare 互不影响，但**国内加速需 ICP 备案**，而 `.me` 能否备案说法不一（多数省级管局把它排除在外，少数较新的说法称已放开），结论未定，需以 <https://domain.miit.gov.cn/> 官方口径为准。没有备案时 EdgeOne 只有海外节点，换过去不会更快 —— 所以维持 Cloudflare，这份配置只作备用保留。
- astro.config 里那批短路径 302（`/s`、`/t`、`/tg`、`/gal`、`/long`、`/donate`）会被 Astro 生成为 meta-refresh 占位页，但实测 Cloudflare 上 `public/_redirects` **优先于** `html_handling`，线上实际走的是 `_redirects`，astro.config 那份只作兜底（比如换到别的托管平台）。

### 站点后台状态（2026-09-16 用户确认）

- **Always Use HTTPS 已开启**：`http://bigfox.me/`、`http://www.bigfox.me/` 及深路径均实测 301 → HTTPS。
- **giscus App 已安装**：文章页 `data-repo` / `data-repo-id` / `data-category-id` 实测正确，仓库 Discussions 已启用且 `Announcements` 分类 id 与 `src/config.ts` 一致。
- **`@bigfox.me` 邮箱暂不使用**，zone 内没有 MX 记录是有意为之，不要"顺手补上"。
- CI 日志里有 Node 20 弃用注释（指 `actions/checkout@v4` 等 **action 自身**的运行环境被强制跑在 Node 24，与 workflow 里的 `node-version: 22` 是两回事），**不影响构建**；等 GitHub 彻底移除 Node 20 运行时再升级 action 版本。
