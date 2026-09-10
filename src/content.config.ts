import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// 空集合：占位这些 Obsidian 目录，避免 Astro 为其自动创建 collection。
// 使用不触文件系统的 simple loader（而非 glob），目录不存在时也不会产生 glob-loader 警告。
const emptyLoader = { name: "empty-loader", load: async () => {} };

const emptyCollection = () => defineCollection({ loader: emptyLoader });

const postsCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default("").nullable(),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().default("未分类"),
		lang: z.string().optional().default(""),
		pinned: z.boolean().optional().default(false),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});

export const collections = {
	posts: postsCollection,
	// 阻止自动创建 collection 的空定义
	Zen: emptyCollection(),
	"01-输入": emptyCollection(),
	Xenia: emptyCollection(),
	Yoke: emptyCollection(),
	Memoria: emptyCollection(),
};
