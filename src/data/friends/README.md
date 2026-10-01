# 友链数据

`src/pages/friends.astro` 会用 `import.meta.glob("@/data/friends/*.json")` 读取本目录下**所有 `*.json`**，
按每个文件的 `category` 字段分组渲染到 <https://bigfox.me/friends/>。

## 添加一条友链

在本目录新建一个 `*.json` 文件（文件名随意，建议用站点域名，如 `example.com.json`）：

```json
{
	"name": "站点名",
	"avatar": "https://example.com/avatar.png",
	"description": "一句话简介",
	"url": "https://example.com",
	"category": "技术博客"
}
```

## 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | ✅ | 站点名 |
| `avatar` | ✅ | 头像 URL（外链即可，不会被打包处理） |
| `description` | ✅ | 一句话简介 |
| `url` | ✅ | 站点地址 |
| `category` | 可选 | 分组名；留空则归入「未分类」 |
| `subcategory` | 可选 | 仅 `/nav/` 导航站使用，友链页忽略 |

## 注意事项

- 目录里**任何** `*.json` 都会被渲染，所以本说明用 `.md`，示例请写进自己的 JSON 文件。
- 历史情况：本目录曾长期缺失，导致 `/friends/` 渲染为空页（页面已加空态提示）。
- 类型定义见 `src/types/data.ts` 的 `Friend` 接口。
