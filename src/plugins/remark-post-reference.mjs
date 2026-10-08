import fs from "node:fs";
import path from "node:path";
import { visit } from "unist-util-visit";

/**
 * 站内文章引用插件
 *
 * 在 Markdown 正文里这样引用另一篇文章：
 *
 *   [自定义文字](#post:目标)
 *   [](#post:目标)               ← 链接文字留空时，自动填入目标文章的标题
 *
 * 「目标」两种写法都支持：
 *   1. 完整 slug（= 文章 URL 去掉 /posts/ 的部分），如 ai/intel-ultra-x7-llm-memory
 *   2. 只写文件名，只要全站唯一即可，如 intel-ultra-x7-llm-memory
 * 大小写和首尾斜杠都会自动容错。
 *
 * 构建时校验：目标不存在（或文件名有歧义）会直接抛错终止构建，并给出最接近的候选，
 * 不会静默产出一个 404 链接；引用了草稿文章时，生产构建同样报错。
 */

const PREFIX = "#post:";
const POSTS_DIR = path.resolve("src/content/posts");
// 与 astro.config.mjs 的 base: "/" 对应；若将来改了 base，这里要同步
const URL_BASE = "/posts/";

/**
 * 逐段生成 slug，尽量贴近 Astro glob loader 内部的 github-slugger 行为
 * （小写、去掉标点符号、空白转连字符），同时保留中日韩等字母字符。
 */
function slugifySegment(segment) {
	return segment
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\p{M}\s-]/gu, "")
		.trim()
		.replace(/\s+/g, "-");
}

/** 从 frontmatter 行里取标量值：优先按引号截取，否则去掉行尾内联注释 */
function parseScalar(raw) {
	const value = raw.trim();
	const quoted =
		value.match(/^"((?:[^"\\]|\\.)*)"/) ?? value.match(/^'([^']*)'/);
	if (quoted) return quoted[1];
	return value.replace(/\s+#.*$/, "").trim();
}

/** 读取一篇文章的标题和草稿标记 */
function readEntryMeta(filePath) {
	const source = fs.readFileSync(filePath, "utf-8");
	const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	const block = frontmatter ? frontmatter[1] : "";

	const titleLine = block.match(/^title:[ \t]*(.*)$/m);
	const draftLine = block.match(/^draft:[ \t]*(.*)$/m);

	return {
		title: titleLine ? parseScalar(titleLine[1]) : undefined,
		draft: draftLine
			? parseScalar(draftLine[1]).toLowerCase() === "true"
			: false,
	};
}

/** 递归收集 posts 目录下的所有 Markdown 文件 */
function collectMarkdownFiles(dir) {
	const found = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			found.push(...collectMarkdownFiles(full));
		} else if (/\.mdx?$/.test(entry.name)) {
			found.push(full);
		}
	}
	return found;
}

let cachedIndex = null;
let cachedSignature = "";

/**
 * 建立并缓存 `slug -> { title, draft, file, basename }` 索引。
 * 用「所有文件的路径 + 修改时间」当缓存签名，所以新增/改名/改标题后会自动重建，
 * 开发时不必重启 dev server。
 */
function getPostIndex() {
	let files;
	try {
		files = collectMarkdownFiles(POSTS_DIR);
	} catch {
		return new Map();
	}

	const signature = files
		.map((f) => `${f}:${fs.statSync(f).mtimeMs}`)
		.sort()
		.join("|");
	if (cachedIndex && cachedSignature === signature) return cachedIndex;

	const index = new Map();
	for (const file of files) {
		const relative = path.relative(POSTS_DIR, file);
		// Windows 上 path.relative 给的是反斜杠，统一成正斜杠再逐段 slug 化
		const slug = relative
			.replace(/\\/g, "/")
			.replace(/\.mdx?$/, "")
			.split("/")
			.map(slugifySegment)
			.join("/");
		const basename = slug.slice(slug.lastIndexOf("/") + 1);
		index.set(slug, { ...readEntryMeta(file), file, basename });
	}

	cachedIndex = index;
	cachedSignature = signature;
	return index;
}

/**
 * 解析引用目标：
 * 先按完整 slug 精确匹配，再退化为按文件名匹配（要求全站唯一）。
 */
function resolveTarget(posts, target) {
	if (posts.has(target)) return { slug: target, entry: posts.get(target) };

	const byBasename = [...posts.entries()].filter(
		([, entry]) => entry.basename === target,
	);
	if (byBasename.length === 1) {
		const [slug, entry] = byBasename[0];
		return { slug, entry };
	}
	if (byBasename.length > 1) {
		return { ambiguous: byBasename.map(([slug]) => slug) };
	}
	return { missing: true };
}

/** 编辑距离，用来在报错时推荐最接近的 slug */
function levenshtein(a, b) {
	const rows = a.length + 1;
	const cols = b.length + 1;
	let previous = Array.from({ length: cols }, (_, i) => i);
	for (let i = 1; i < rows; i++) {
		const current = [i];
		for (let j = 1; j < cols; j++) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			current[j] = Math.min(
				previous[j] + 1,
				current[j - 1] + 1,
				previous[j - 1] + cost,
			);
		}
		previous = current;
	}
	return previous[cols - 1];
}

/** 按「完整 slug / 文件名」中较近的那个距离推荐候选 */
function suggestSlugs(target, posts) {
	const limit = Math.max(3, Math.floor(target.length / 3));
	return [...posts.entries()]
		.map(([slug, entry]) => ({
			slug,
			title: entry.title,
			distance: Math.min(
				levenshtein(target, slug),
				levenshtein(target, entry.basename),
			),
		}))
		.filter((item) => item.distance <= limit)
		.sort((a, b) => a.distance - b.distance)
		.slice(0, 3);
}

function candidateLines(posts, candidates) {
	return candidates.map(
		(item) => `    ${item.slug}${item.title ? `  （${item.title}）` : ""}`,
	);
}

const USAGE =
	"  可用写法：[显示文字](#post:目标) 或 [](#post:目标)（留空自动填标题）";

function notFoundMessage(target, source, posts) {
	const lines = [`引用的文章不存在：#post:${target}`, `  出处：${source}`];
	const candidates = suggestSlugs(target, posts);
	if (candidates.length > 0) {
		lines.push("  是不是想引用：", ...candidateLines(posts, candidates));
	}
	lines.push(
		"  也可以只写文件名（全站唯一时），例如 #post:intel-ultra-x7-llm-memory",
		USAGE,
	);
	return lines.join("\n");
}

function ambiguousMessage(target, source, slugs, posts) {
	return [
		`引用的文件名有歧义：#post:${target}`,
		`  出处：${source}`,
		"  多个分类下有同名文件，请写完整 slug：",
		...candidateLines(
			posts,
			slugs.map((slug) => ({ slug, title: posts.get(slug)?.title })),
		),
		USAGE,
	].join("\n");
}

export function remarkPostReference() {
	return (tree, file) => {
		// 没有任何 #post: 链接时直接跳过，避免无谓的文件扫描
		let hasReference = false;
		visit(tree, "link", (node) => {
			if (typeof node.url === "string" && node.url.startsWith(PREFIX)) {
				hasReference = true;
			}
		});
		if (!hasReference) return;

		const posts = getPostIndex();
		const source = (file?.history?.[0] ?? file?.path ?? "(未知文件)").replace(
			/\\/g,
			"/",
		);

		visit(tree, "link", (node) => {
			if (typeof node.url !== "string" || !node.url.startsWith(PREFIX)) return;

			const target = node.url
				.slice(PREFIX.length)
				.replace(/^\/+|\/+$/g, "")
				.toLowerCase();
			const resolved = resolveTarget(posts, target);

			if (resolved.ambiguous) {
				throw new Error(
					ambiguousMessage(target, source, resolved.ambiguous, posts),
				);
			}
			if (!resolved.entry) {
				throw new Error(notFoundMessage(target, source, posts));
			}

			const { slug, entry } = resolved;
			if (entry.draft && process.env.NODE_ENV === "production") {
				throw new Error(
					`引用了草稿文章：#post:${target}（解析为 ${slug}）\n  出处：${source}\n  该文 draft: true，生产构建不会生成它的页面。`,
				);
			}

			node.url = `${URL_BASE}${slug}/`;

			// 链接文字留空（或只有空白）时，用目标文章标题兜底
			const text = node.children
				.map((child) => (child.type === "text" ? child.value : ""))
				.join("");
			if (text.trim() === "") {
				node.children = [{ type: "text", value: entry.title ?? slug }];
			}
		});
	};
}
