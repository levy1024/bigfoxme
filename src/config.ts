import type {
	ExpressiveCodeConfig,
	GitHubEditConfig,
	ImageFallbackConfig,
	LicenseConfig,
	NavBarConfig,
	NoticeConfig,
	ProfileConfig,
	SiteConfig,
	UmamiConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const noticeConfig: NoticeConfig = {
	enable: false,
	level: "happy",
	content: "元宝发红包了！看置顶文章？",
};

export const siteConfig: SiteConfig = {
	title: "程序员大狐狸",
	subtitle: "嵌入式 · AI · 独立开发",
	description:
		"嵌入式是本职，AI 是趋势，独立开发是兴趣。",

	keywords: ["程序员大狐狸", "嵌入式", "AI", "独立开发", "Vibe Coding", "AI Coding", "端侧 AI","氛围编程"],
	lang: "zh_CN", // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th'
	themeColor: {
		hue: 260, // 蓝色系
		fixed: true, // Hide the theme color picker for visitors
		forceDarkMode: false, // Force dark mode and hide theme switcher
	},
	banner: {
		enable: false,
		src: "/xinghui.avif", // Relative to the /src directory. Relative to the /public directory if it starts with '/'

		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: true, // Display the credit text of the banner image
			text: "Pixiv @chokei", // Credit text to be displayed

			url: "https://www.pixiv.net/artworks/122782209", // (Optional) URL link to the original artwork or artist's page
		},
	},
	background: {
		enable: false, // 没有背景图片，禁用 bg-box 覆盖层
		src: "",
		position: "center",
		size: "cover",
		repeat: "no-repeat",
		attachment: "fixed",
		opacity: 1,
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		{
			src: "/favicon.ico",
			sizes: "48x48",
		},
	],
	officialSites: [
		{ url: "https://bigfox.me", alias: "主页" },
		{ url: "https://www.bigfox.me", alias: "WWW" },
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		{
			name: "笔记",
			url: "/notes/",
			external: false,
		},
//		{
//			name: "赞助",
//			url: "/sponsors/",
//			external: false,
//		},
		{
			name: "导航",
			url: "/nav/",
			external: false,
			},
		{
			name: "标签",
			url: "/tags/",
			external: false,
		},
		{
			name: "关于",
			url: "/about/",
			external: false,
		},
		{
			name: "友链",
			url: "/friends/",
			external: false,
		},
			{
			name: "RSS",
			url: "/rss.xml",
			external: true,
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "/avatar-112.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "程序员大狐狸",
	bio: "https://bigfox.me<br>嵌入式 · AI · 独立开发",
	links: [
		{
			name: "微信",
			icon: "wechat", // Local icon
			url: "javascript:;", // 占位链接
		},
		{
			name: "稀土掘金",
			icon: "juejin", // Local icon
			url: "https://juejin.cn/user/1345457963671805",
		},
		{
			name: "Bilibili",
			icon: "bilibili", // Local icon
			url: "https://space.bilibili.com/628190453/dynamic",
		},
		{
			name: "GitHub",
			icon: "github", // Local icon
			url: "https://github.com/bigfoxme",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: false,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

// 图片域名回退：未启用。如需启用，请填入自己的图床域名。
export const imageFallbackConfig: ImageFallbackConfig = {
	enable: false,
	originalDomain: "",
	fallbackDomain: "",
};

// 阅读量统计（Umami share API）：未启用。如需启用，请填入自建 Umami 的 baseUrl / shareId。
export const umamiConfig: UmamiConfig = {
	enable: false,
	baseUrl: "",
	shareId: "",
	timezone: "Asia/Shanghai",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};

export const gitHubEditConfig: GitHubEditConfig = {
	enable: true,
	baseUrl: "https://github.com/levy1024/bigfoxme/blob/main/src/content/posts",
};

// todoConfig removed from here
