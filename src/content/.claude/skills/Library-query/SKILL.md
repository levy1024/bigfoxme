# /Library-query — 检索 Library

## 触发条件

- 用户输入 `/Library-query <问题>`
- 用户说"Library 里有没有关于 XXX 的内容"、"查一下 Library"

## 执行流程

### 1. 定位相关页面

读取 `Library/index.md`，根据问题关键词找到相关页面列表。

### 2. 深度阅读

逐一读取相关页面，提取关键信息。如果页面引用了 `sources` 中的原始文件，按需追溯阅读。

### 3. 综合回答

- 使用简体中文回答
- 回答中必须使用 `[[wikilink]]` 标注引用来源
- 引用格式示例：根据 [[摘要-claude-code-codex对比]] 中的分析……

### 4. 保存为综合分析（可选）

如果回答满足以下条件，主动提议保存为 syntheses 页面：
- 超过 2 段深度分析
- 综合了 2 个以上来源
- 具有长期参考价值

保存位置：`Library/syntheses/<kebab-case-slug>.md`

### 5. 更新 log.md

追加日志条目：
```
## [YYYY-MM-DD] query | <问题描述>
- **检索页面**: [[page1]], [[page2]]
- **输出**: 直接回答（或：已保存至 [[synthesis-slug]]）
```

## 约束

- **禁止凭记忆回答**。如果Library中没有相关内容，必须明确告知："Library中暂无相关内容，建议先 /ingest 相关素材。"
- 每次回答必须标注信息来源页面
