export interface Sponsor {
	name: string;
	avatar: string | null;
	date: string;
	amount: string;
}

export interface Friend {
	name: string;
	avatar: string;
	description: string;
	url: string;
	category?: string;
	subcategory?: string;
	order?: number; // 组内显示顺序，小的在前；缺省时保持文件名字典序
}

export interface SponsorsData {
	sponsors: Sponsor[];
}

export interface FriendsData {
	friends: Friend[];
}
