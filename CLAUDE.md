# CLAUDE.md

本文件是本仓库的**唯一事实源**（2026-09-30 起）。此前并存的 `AGENTS.md` 与 `QWEN.md` 内容大幅过期——英文分类（Software/Technical/AIHacks/Workflow/Xenia）、GitHub Pages `page` 分支部署、字体走 CDN、`tags` 用内联数组、`src/content/config.ts`、147 条友链等说法**均已不实**——已删除，不要凭记忆恢复。

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
- `Zen` / `01-输入` / `Xenia` / `Yoke` / `Memoria` — **空 loader 占位**（simple loader 空实现 `emptyLoader`，不触碰文件系统），阻止 Astro 自动为这些 Obsidian 目录创建 collection。不要删除这些空定义；目录即使不存在也不会再产生 glob-loader 警告。其中只有 `Memoria/` 在本仓库实际存在，其余四个目录并不存在（纯防御性占位）。

### 博客文章

- 路径：`src/content/posts/{分类}/`。目录名是**物理归档**，实际分类以 frontmatter 的 **`category` 字段为准**——侧栏 `CategoryList.astro` 与 `categories/[category].astro` 已统一到该口径（2026-09-30 修复：侧栏原先按目录名过滤，会把 `category` 有值但目录不同名的分类隐藏掉）。现存 1 篇 `category: AI 编程` 位于 `AI/` 目录下，属正常。常用分类：`AI` / `Android` / `嵌入式` / `运维` / `其它`。
- 侧边栏 `CategoryList.astro` 从 posts 的 `category` 字段动态聚合，链接到 `/categories/{category}/`。
- frontmatter 关键规则：`published` 用连字符 ISO 日期；`tags` 用 YAML 列表（现有文章一律块状换行 `- x`，内联 `[a, b]` 同样合法）；布尔值小写；`image` 可空（留空自动提取正文第一张图）；`draft: true` 在 `PROD` 下过滤。frontmatter 里可用内联注释（如 `draft: false # true=草稿`）。
- `getSortedPosts()`（`src/utils/content-utils.ts`）是文章列表/详情/归档的通用入口：置顶在前，按 `published` 倒序，并回填 prev/next。

### 文章间引用：`#post:` 插件

正文里引用另一篇文章，用 `#post:` 链接，由 `src/plugins/remark-post-reference.mjs` 在构建时解析：

```markdown
参考 [内存那篇](#post:intel-ultra-x7-llm-memory)
参考 [](#post:intel-ultra-x7-llm-coding)      ← 链接文字留空则自动填入目标标题
```

- 「目标」可写**完整 slug**（`ai/intel-ultra-x7-llm-memory`）或**只写文件名**（全站唯一时即可）。大小写、首尾斜杠自动容错。
- **构建时校验**（本插件的核心价值）：目标不存在 → 报错终止构建并推荐 3 个最接近的候选；文件名重名 → 报错要求写完整 slug；引用了 `draft: true` 的文章 → 生产构建报错。
- 插件排在 remark 链**最前面**，所以自动填入的标题会被后面的字数统计与摘要正确计入。
- 索引按「文件路径 + mtime」缓存，dev 下新增/改名/改标题会自动重建，不必重启。
- **不要手写 `/posts/xxx/` 之类的硬编码内链**——拼错只会在运行时 404，而这个插件会在构建时就拦住。

### Memoria → /notes 碎片笔记

- 源：`src/content/Memoria/2026.md` 等 Markdown，格式为 `## YYYY-MM-DD 周X` 下挂 `- HH:MM` 条目，`#标签` 结尾。
- 由 **运行时文件系统解析**（`src/utils/notes-utils.ts` 的 `parseNotes()`，不是 Astro collection），按天分组、提取标签和 `![[attachment]]` 图片。
- `/notes/` 页面（`src/pages/notes/index.astro`）客户端筛选 + 分页。
- `src/integrations/memoria-assets.ts` 在 build/server 启动时把 `Memoria/attachments` 同步到 `public/memoria-attachments/`。

### Library / 素材输入（当前悬空，勿当既有事实）

- `src/content/01-输入/` 与 `src/content/Library/` **在本仓库并不存在**。`src/content/.claude/skills/` 里那套内容管线 skill（`Update`、`up-Library-ingest`、`up-index`、`Library-query`、`Library-lint`）全部围绕这两个目录设计，**目标路径落空**；而且 skill 内把仓库写死成 `D:\project2026\fuwari`，与当前工作目录不符。若要启用，先改路径并建目录。
- `src/content/claude.md`（《内容规范》）同样指向另一个仓库（`D:\project2026\fuwari`、`dqtx760/Firefly`）与其 `wiki/` 结构，其中的英文分类表与 Gitee 图床要求已与现状脱节——它如今只有「写作风格」和「tags 用块状列表」这两部分仍然有效。

### Vite 忽略插件（astro.config.mjs 内联）

`src/content/` 混入大量非博客文件，构建会失败除非有这些忽略规则（在 `load`/`resolveId` 钩子）：
- `.canvas` 文件返回空模块
- `get attachment` 目录下无扩展名附件返回空模块
- `obsidian-home-console` 目录的 JS/TS 返回空模块
- `content/get` / `get笔记` 引用的本地图片被标记 external

**新增内容文件时注意别踩到这些边界**：不要把可执行 JS/TS 放进 `src/content/` 任何位置（除了已列出的 `obsidian-home-console` 例外），否则 Rollup 会尝试解析并失败。

**样式入口是显式 import，绝不要依赖通配 glob（重要，2026-10-06 踩过）**：

- `src/layouts/Layout.astro` 顶部**显式 import** 了全部全局样式（`main.css`、`variables.styl`、`markdown-extend.styl`、`markdown.css`、`scrollbar.css`、`transition.css`，另有 `expressive-code.css`）。**不要删除这些 import**——它们一度并不存在，全局样式实际是被 `ImageWrapper.astro` 里那句过宽的 `import.meta.glob("../../**")` 顺带打包进来的（glob 是构建期转换，运行时 `if (isLocal)` 分支拦不住它，`src/**` 下所有文件都会成为模块依赖）。
- 那次教训：为修复 `.docx` 导致的构建失败而把该通配**收窄为图片扩展名**，等于同时切断了全站 CSS 的来源，症状是**文章标题后的 `#` 锚点显形**（`.custom-md h* .anchor { opacity: 0 }` 丢失）与**右侧 TOC 消失**（`--toc-width` 等变量丢失）。
- **推论**：需要对外提供的下载文件（docx/pdf/zip）放 `public/`（如 `public/docs/`），不要放 `src/`；往 `src/` 里放 Vite 不认识的文件类型会让构建挂在 `vite:build-import-analysis`（`.pdf` 例外，Vite 内置支持）。

## 架构

### 配置入口 `src/config.ts`

导出 `siteConfig`（标题「程序员大狐狸」、hue: 260 蓝色系主题、favicon、TOC）、`navBarConfig`（含 `/notes/` `/nav/` 链接）、`profileConfig`、`licenseConfig`、`imageFallbackConfig`、`expressiveCodeConfig`、`gitHubEditConfig`、`noticeConfig`。类型在 `src/types/config.ts`。`src/constants/` 有主题常量与图标集合。

### 组件分层

- `src/components/widget/` — 侧边栏组件（Profile、CategoryList、TagList 标签云、TOC、SideBar、PageHeader 等）。注意 `TagList.astro` 已**不是** 3D 标签云，而是普通 chip 列表（`slice(0, 30)`）。
- `src/components/control/` — Pagination、BackToTop
- `src/components/misc/` — Markdown、ImageWrapper、License
- `Search.svelte` 用 `client:only="svelte"`（跳过 SSR），Navbar 用固定宽度容器包裹它避免 SSR/客户端 DOM 宽度不一致导致的点击抖动。`DisplaySettings.svelte` 同理。

### 页面

- `src/pages/posts/[...slug].astro` — 文章详情（Giscus 评论 + Markdown 渲染管线）
- **没有 `src/pages/index.astro`**：首页与文章列表分页都在根 `src/pages/[...page].astro`，`PAGE_SIZE = 8`（`src/constants/constants.ts`）。
- `src/pages/categories/[category].astro`、`src/pages/tags/[tag].astro`、`src/pages/archive/index.astro`
- `src/pages/notes/index.astro` — 碎片笔记（见上）
- `src/pages/nav.astro` + `src/data/nav/*.json` — 导航站页面
- `src/pages/friends.astro` + `src/data/friends/*.json` — 友链页
- `src/pages/rss.xml.ts`、`src/pages/robots.txt.ts`、404、about、sponsors

### 搜索、字体与友链

- **搜索**：无 pagefind、无构建期索引文件。`Search.svelte` 在 `onMount` 里 `fetch("/rss.xml")`，用 DOMParser 解析 `<item>` 做客户端 `includes` 匹配——即「拿 RSS 当索引」。源码里残留的 `data-pagefind-*` 属性（`Markdown.astro`、`posts/[...slug].astro`、`astro.config.mjs`）是死代码。
- **字体**：`Layout.astro` 直接 `import "lxgw-wenkai-webfont/style.css"`，是**自托管打包而不是 CDN**。`dist/_astro` 里有 592 个 woff2 子集、约 28 MB（占全站产物 66%）；靠 `unicode-range` 按需下载，单页开销不大，但部署体积与上传时间可观。
- **友链**：`src/data/friends/*.json`（glob 读取，一个文件一条友链；schema 见 `src/types/data.ts` 的 `Friend` 接口与目录内的 `README.md`）。该目录曾长期缺失，导致 `/friends/` 渲染为空页——页面现已加空态提示。
- **赞助页**：`/sponsors/` 的收款码图片（`/sponsors/alipay.webp`、`/sponsors/wechat.png`）所指目录不存在，已改为纯文字说明；放图后需同步改回。

### .astro 编写陷阱

- **注释/正文里不要出现字面量的 `<script>`**。Vite 的依赖扫描器是用正则从 `.astro` 源文件里抠 script 标签的，注释里那个 `<script>` 会被它当成真的开标签，于是「它到下一个 `</script>` 之间」的所有内容（注释、frontmatter、模板 HTML）都被当 JS 丢给 esbuild，报 `Expected ";" but found ...`。要描述 script 相关行为时改写成「script 标签」之类不带尖括号的说法。（只针对被 Vite 扫描的 `.astro` 等源文件；`CLAUDE.md`、`README.md` 这类根目录文档不在扫描范围内。）

### Markdown 渲染管线（astro.config.mjs）

remark：math → reading-time → excerpt → GitHub admonitions → directives → sectionize。rehype：katex → slug → image-fallback → 自定义组件（`:github`/`:url`/admonition 卡片）→ external links → autolink headings。

自定义插件在 `src/plugins/`（remark-*.mjs/js 和 rehype-component-*.mjs）。

### 样式

- `src/styles/main.css` — 全局 + `card-base` 组件类 + rainbow mode
- `src/styles/markdown.css`、`expressive-code.css`、`scrollbar.css`、`transition.css`。注意 **Swup 已被移除**（依赖里没有 swup），`transition.css` 与 `MainGridLayout.astro` 的 `#swup-container`、`astro:page-load` 都是遗留，别据此推断有页面过渡。
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
- **giscus App 已安装**：文章页的 `data-repo` / `data-repo-id` / `data-category-id` 是**硬编码在 `src/pages/posts/[...slug].astro` 里的**（`src/config.ts` 中并没有 giscus 配置），由 `Layout.astro` 的脚本读取这些 `data-*` 注入 iframe。仓库 Discussions 已启用，分类为 `Announcements`。
- **`@bigfox.me` 邮箱暂不使用**，zone 内没有 MX 记录是有意为之，不要"顺手补上"。
- CI 日志里有 Node 20 弃用注释（指 `actions/checkout@v4` 等 **action 自身**的运行环境被强制跑在 Node 24，与 workflow 里的 `node-version: 22` 是两回事），**不影响构建**；等 GitHub 彻底移除 Node 20 运行时再升级 action 版本。
