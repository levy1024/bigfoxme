import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
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

const wikiCollection = defineCollection({
	schema: z.object({
		title: z.string().optional().default(""),
		description: z.string().optional().default(""),
	}),
});

export const collections = {
	posts: postsCollection,
	wiki: wikiCollection,
};
