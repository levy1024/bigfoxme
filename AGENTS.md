# AGENTS.md — Fuwari Blog Project Guide

## Project Identity

- **What**: Personal tech blog (Fuwari fork, deeply customized)
- **Stack**: Astro 5.7.9 + Tailwind CSS 3.4+ + Svelte 5.28+ + Vite
- **Package manager**: pnpm 9.14+ (enforced — do NOT use npm/yarn)
- **Site**: https://bigfox.me
- **Repo**: https://github.com/levy1024/bigfoxme

## Quick Start

```bash
pnpm install          # install deps
pnpm dev              # dev server at http://localhost:4321 (port is fixed)
pnpm build            # production build → dist/
pnpm preview          # preview production build
```

## Key Commands

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Dev server (port 4321, fixed) |
| `pnpm build` | Static build to `dist/` |
| `pnpm format` | Biome format `./src` (tabs, double quotes) |
| `pnpm lint` | Biome check + auto-fix `./src` |
| `pnpm type-check` | `tsc --noEmit --isolatedDeclarations` |
| `pnpm new-post` | Interactive new post creator |
| `pnpm add-frontmatter` | Auto-add frontmatter + extract cover image |
| `pnpm organize-posts` | Organize posts by category |
| `pnpm clean` | Clean unused images |

## Linting & Formatting

**Biome** (not ESLint/Prettier):
- Config: `biome.json`
- Formatter: tabs, double quotes
- Ignores: `*.css`, `public/`, `.astro/`, `dist/`, `node_modules/`, `src/content/.obsidian/`
- Svelte/Astro overrides: `useConst` and `useImportType` rules disabled

Run `pnpm format` before committing. Run `pnpm lint` to check + auto-fix.

## Content System

### Posts location
`src/content/posts/{Category}/*.md`

### Categories (5 fixed)
| Slug | Purpose |
|------|---------|
| `Software` | Software recommendations |
| `Technical` | Tutorials & guides |
| `AIHacks` | AI-related content |
| `Workflow` | Automation & workflows |
| `Xenia` | Casual / personal notes |

### Frontmatter schema (`src/content/config.ts`)
```yaml
---
title: "Required string"
published: 2026-04-22    # ISO date (hyphens, NOT slashes)
tags: [tag1, tag2]        # array format required
category: Software        # one of the 5 categories above
draft: false              # lowercase boolean
pinned: false             # optional, pins to top
image: ""                 # nullable — leave empty to auto-extract first image
description: ""           # optional — auto-extracts first paragraph if empty
---
```

**Critical frontmatter rules**:
- Colon must have space after: `title: value` not `title:value`
- Date must use hyphens: `2026-04-22` not `2026/04/22`
- Tags must be array: `[a, b]` not `a, b`
- Booleans lowercase: `true`/`false` not `True`/`FALSE`
- `image` field is **nullable** — the schema uses `.nullable()`

### Cover image auto-extraction
`scripts/add-frontmatter.cjs` extracts the first image from post body (ignoring frontmatter) as the cover. Run `pnpm add-frontmatter` after adding new posts.

## Architecture

### Config entry point
`src/config.ts` — exports:
- `siteConfig` — title, subtitle, lang, theme color (hue: 250 blue), banner, favicon
- `navBarConfig` — navigation links
- `profileConfig` — avatar, name, bio, social links
- `licenseConfig`, `imageFallbackConfig`, `expressiveCodeConfig`, `gitHubEditConfig`

### Components
- `src/components/widget/` — sidebar widgets (Profile, CategoryList, TagList 3D cloud)
- `src/components/PostCard.astro` — article card
- `src/components/PostPage.astro` — article list with auto cover/description

### Layouts
- `src/layouts/Layout.astro` — main layout (LXGW WenKai font)
- `src/layouts/MainGridLayout.astro` — grid layout with sidebar

### Pages
- `src/pages/index.astro` — homepage
- `src/pages/posts/[...slug].astro` — post detail (Giscus comments)
- `src/pages/posts/[page].astro` — paginated post list
- `src/pages/categories/[category].astro` — category pages
- `src/pages/archive.astro` — archive (year+month grouping)
- `src/pages/friends.astro` — friend links (147 entries in `src/data/friends/`)
- `src/pages/sponsors.astro` — sponsors page

### Custom plugins (`src/plugins/`)
- `remark-reading-time.mjs` — reading time calculation
- `remark-excerpt.js` — auto-excerpt from first paragraph
- `remark-github-admonitions.js` — GitHub-style admonitions
- `remark-directive-rehype.js` — directive → rehype conversion
- `rehype-component-admonition.mjs` — note/tip/important/caution/warning blocks
- `rehype-component-github-card.mjs` — `:github[repo]` directive
- `rehype-component-url-card.mjs` — `:url[href]` directive
- `rehype-image-fallback.mjs` — image domain fallback
- `expressive-code/custom-copy-button.js` — custom code copy button

### Styles
- `src/styles/main.css` — primary styles
- `src/styles/transition.css` — Swup page transitions
- `src/styles/scrollbar.css` — custom scrollbar
- `src/styles/markdown.css` — markdown content styles

## TypeScript

- Extends `astro/tsconfigs/strict`
- Path aliases: `@components/*`, `@assets/*`, `@utils/*`, `@layouts/*`, `@/*` → `src/*`
- `strictNullChecks: true`
- `@astrojs/ts-plugin` enabled

## Build & Deploy

### GitHub Actions (`.github/workflows/deploy.yml`)
- Trigger: push to `main`
- pnpm 9 + Node 20
- Builds to `dist/`, deploys to `page` branch via `peaceiris/actions-gh-pages`
- CNAME: `bigfox.me`

### EdgeOne (Tencent Cloud)
- Config: `edgeone.json` (redirect rules)
- Framework preset: Astro, output: `dist`

### Cloudflare Workers
- Config: `wrangler.jsonc`
- Assets: `./dist`

## Patches

- `patches/astro.patch` — patched Astro dependency (applied via pnpm `patchedDependencies`)

## Conventions

1. **pnpm only** — lockfile is `pnpm-lock.yaml`
2. **Biome for linting** — not ESLint
3. **Tabs for indentation** — Biome enforces this
4. **Double quotes** in JS/TS — Biome enforces this
5. **Static output** — `output: "static"` in astro.config
6. **Trailing slashes** — `trailingSlash: "always"` enforced
7. **Dev port 4321** — fixed, do not change
8. **Images**: static assets in `public/`, post images in `src/content/assets/images/` or Gitee CDN
9. **Font**: LXGW WenKai (霞鹜文楷) loaded via CDN, not bundled
10. **Theme color**: hue 250 (blue), fixed mode

