#!/usr/bin/env python3
"""
使用 Chrome DevTools MCP 发布小红书笔记的示例脚本
"""

import anyio
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage

async def main():
    async for message in query(
        prompt="使用 Chrome DevTools MCP 来执行以下操作：\n\n1. 首先打开小红书网站：https://www.xiaohongshu.com\n2. 检查是否需要登录，如果需要，等待用户登录\n3. 找到创建新笔记的按钮并点击\n4. 在笔记编辑页面中，填充标题和内容\n5. 上传一张图片（可以使用网络图片或本地图片）\n6. 点击发布按钮\n\n请详细描述每一步的操作过程，并使用 MCP 工具来实现这些操作。",
        options=ClaudeAgentOptions(
            mcp_servers={
                "chrome-devtools": {"command": "npx", "args": ["-y", "chrome-devtools-mcp@latest"]}
            },
            allowed_tools=["Read", "Write", "Bash", "WebSearch", "WebFetch"],
            max_turns=20
        )
    ):
        if isinstance(message, ResultMessage):
            print("✅ 任务完成！")
            print(f"\n结果：{message.result}")
        else:
            print(f"\n💬 {message}")

if __name__ == "__main__":
    anyio.run(main)
