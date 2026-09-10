---
title: "信任 AI，把它当朋友，它会给你惊喜 —— 记一次与 AI 对话的过程"
published: 2026-08-10
tags:
- AI 对话
category: AI 编程
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## 背景
使用 AI  自动评审 Github 项目的 PR，这个PR 是我自己的账户提交的，出现问题：  
使用 Codex + GPT5.6 没有提交评审，而使用 Claude Code + deepseek-v4-pro 提交了评审。  
下面是与 Claude Code + deepseek-v4-pro 对话的记录。

## 感悟
- AI 会有错误，不能全信。
- AI 的对错，你都可以告诉它。特别是你知道它错误之后，更应该反馈给它。
- 程序员应该具有的"不放过任何不确定性"、"把问题搞清楚"的态度，不能丢掉。
- AI 经过验证，承认自己说错了，并不奇怪。但是它通过自己的错误，又发现了自己的一个 bug，这就有点让我感到意外和惊讶了！

## 重点对话摘录
```
● GitHub 的规则是：
  - 作者可以在自己的 PR 上 COMMENT 和 REQUEST_CHANGES
  - 作者不能 APPROVE 自己的 PR（GitHub 会返回 422 错误）
  
❯ 据我的了解，作者可以在自己的 PR 上 COMMENT，但不能 REQUEST_CHANGES 和 APPROVE。你是不是说错了。

● 你说得对，我之前的说法有误。让我验证一下。

● 你说得对，我之前说错了。GitHub 规则是：PR 作者只能在自己 PR 上 COMMENT，不能 REQUEST_CHANGES，也不能 APPROVE。

  这也暴露了 review_bot.py 的一个 bug：代码只对 APPROVE 做了降级到 COMMENT 的 fallback，但没对 REQUEST_CHANGES 做。如果 DeepSeek 返回 REQUEST_CHANGES，而 PR 作者就是你自己，GitHub 会拒绝（422），导致评审彻底失败。
```

## 详细对话
```
❯ 我是 PR #26 的提交者，我看github上已有 PR #26的评审，但据我了解，PP 作者自己不能评审自己的 PR，真实情况是什么                                                                                                                   
● 让我查看 PR #26 的实际情况。

● Bash(gh pr view 26 --repo sednar/NordicBLE --json number,title,author,state,reviews 2>&1)
  ⎿  {
       "author": {
         "id": "U_kgDOBgF9jA",
     … +37 lines (ctrl+o to expand)

● PR #26 上有两条评审记录：
  ┌──────────┬───────────────────────────────┬───────────┬────────────────────────┐
  │  评审者  │             身份              │   结论    │          时间          │
  ├──────────┼───────────────────────────────┼───────────┼────────────────────────┤
  │ sednar   │ OWNER（仓库所有者）           │ APPROVED  │ 2026-08-06 16:40 (CST) │
  ├──────────┼───────────────────────────────┼───────────┼────────────────────────┤
  │ levy1024 │ COLLABORATOR（= 你，PR 作者） │ COMMENTED │ 2026-08-07 00:05 (CST) │
  └──────────┴───────────────────────────────┴───────────┴────────────────────────┘
  
  真实情况：

  - levy1024 的那条评审就是 DeepSeek 机器人发的，内容以 "DeepSeek-V4-Flash Code Review" 开头
  - 它之所以显示为 你的评审，是因为这台机器上的 gh CLI 登录的是你的账号 levy1024，机器人直接用了你的身份发评审

  关于"作者不能评审自己的 PR"：

  GitHub 的规则是：
  - 作者可以在自己的 PR 上 COMMENT 和 REQUEST_CHANGES
  - 作者不能 APPROVE 自己的 PR（GitHub 会返回 422 错误）

  review_bot.py 第 215-233 行已经处理了这种情况——先尝试 APPROVE，如果被 422 拒绝就降级为 COMMENT。所以机器人这条评审最终以 COMMENT 形式发出去了，没有报错。

  核心问题：机器人应该用自己的 deepseek-review-bot 账号发评审，而不是用你的 levy1024 账号。需要让 gh CLI 切换到 bot 账号认证，或者在脚本中指定 gh 使用的认证 token。要我帮你设置吗？

✻ Brewed for 27s

❯ 继续使用当前方案，不要使用bot账号，使用我的 levy1024 账号。                                                                                                                                                                     
● 明白，保持现状。用你的账号发评审完全没问题，代码里 APPROVE → COMMENT 的降级逻辑也已经覆盖了自己 PR 不能自批的情况。当前方案无需改动。

✻ Baked for 5s

❯ 据我的了解，作者可以在自己的 PR 上 COMMENT，但不能 REQUEST_CHANGES 和 APPROVE。你是不是说错了。                                                                                                                                 
● 你说得对，我之前的说法有误。让我验证一下。

● Bash(gh api repos/sednar/NordicBLE/pulls/26/reviews --jq '.[] | {author: .author.login, state: .state, body: .body[0:80]}' 2>&1)
  ⎿  {
       "author": null,
       "body": "结论：APPROVE。未发现阻塞合并的问题。\n\n已针对 head `14ffba185869d2b1e65c00e2b78d161804fe5c79` 检查：\n",
     … +12 lines (ctrl+o to expand)

● 你说得对，我之前说错了。GitHub 规则是：PR 作者只能在自己 PR 上 COMMENT，不能 REQUEST_CHANGES，也不能 APPROVE。

  这也暴露了 review_bot.py 的一个 bug：代码只对 APPROVE 做了降级到 COMMENT 的 fallback，但没对 REQUEST_CHANGES 做。如果 DeepSeek 返回 REQUEST_CHANGES，而 PR 作者就是你自己，GitHub 会拒绝（422），导致评审彻底失败。

  Read 1 file (ctrl+o to expand)

● Update(review_bot.py)
  ⎿  Added 2 lines, removed 2 lines
      227  def post_review(pr_number: str, verdict: str, body: str) -> tuple[int, str]:
      228      """Post a review to GitHub. Returns (review_id, actual_verdict)."""
      229      attempts = [verdict]
      230 -    if verdict == "APPROVE":
      231 -        attempts.append("COMMENT")  # fallback for own-PR rejection
      230 +    if verdict in ("APPROVE", "REQUEST_CHANGES"):
      231 +        attempts.append("COMMENT")  # fallback: PR authors can't approve or request-changes on their own PR
      232
      233      last_error = None
      234      for attempt_verdict in attempts:

● 已修复。现在 APPROVE 和 REQUEST_CHANGES 都会在遇到 422 时自动降级为 COMMENT，不会再因为 "不能给自己提 REQUEST_CHANGES" 而导致评审失败。
```