---
title: "[翻译] Android CLI 与技能：使用任何智能体将 Android 应用构建速度提升 3 倍"
published: 2026-04-27
tags:
- Android
- Agent
- 翻译
category: Android
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

Android CLI 官网：  
[https://developer.android.google.cn/tools/agents/android-cli?hl=zh-cn](https://developer.android.google.cn/tools/agents/android-cli?hl=zh-cn)    

原文：  
[Android CLI and skills: Build Android apps 3x faster using any agent](https://android-developers.googleblog.com/2026/04/build-android-apps-3x-faster-using-any-agent.html)    

译文：  

## Android CLI 与技能：使用任何智能体将 Android 应用构建速度提升 3 倍

作者：产品管理总监 Adarsh Fernando 和高级首席软件工程师 Esteban de la Canal

作为 Android 开发者，你在选择用于应用开发的智能体（Agents）、工具和大语言模型（LLMs）时拥有众多选择。无论你是在 Android Studio 中使用 Gemini、使用 Gemini CLI、Antigravity，还是使用像 Claude Code 或 Codex 这样的第三方智能体，我们的使命都是确保高质量的 Android 开发在任何地方都能实现。

今天，我们推出了一套全新的 Android 工具和资源，专为智能体工作流设计——即包含 Android 技能（Skills）的 Android CLI 和 Android 知识库（Knowledge Base）。这套工具旨在当你将智能体的工作指引到 Android Studio 之外时，消除核心 Android 开发工作流中的猜测环节，使你的智能体更加高效、有效，并能够遵循最新的推荐模式和最佳实践。

无论你是刚刚开始 Android 开发之旅，是一位经验丰富的 Android 开发者，还是在移动和网络平台管理应用，使用最新的指导、工具和 AI 辅助来构建你的应用都比以往任何时候都更加轻松。无论你从哪个环境开始使用这些资源，你始终可以将你的开发体验过渡到 Android Studio——在那里，最先进的 Android 开发工具和智能体随时待命，帮助你的应用体验真正大放异彩。

### (重新) 介绍 Android CLI

当你的智能体拥有一个轻量级的程序化接口来与 Android SDK 和开发环境交互时，它们的表现最佳。因此，这个新工作流的核心是一个焕然一新的 Android CLI。新的 Android CLI 作为从终端进行 Android 开发的主要接口，具备环境设置、项目创建和设备管理的命令——并充分考虑了更现代的功能和易于更新的能力。

`create` 命令可以在几秒钟内创建一个 Android 应用项目。

在我们的内部实验中，Android CLI 通过将 LLM Token 使用量减少 70% 以上，将项目和环境设置进行了优化，任务完成速度比智能体仅尝试使用标准工具集完成这些任务时快了 3 倍。

你可以使用的关键功能包括：

- **SDK 管理**：使用 `android sdk install` 仅下载所需的特定组件，确保一个精简的开发环境。
- **快速项目创建**：`android create` 命令从官方模板生成新项目，确保从第一行代码开始就应用了推荐的架构和最佳实践。
- **快速设备创建和部署**：使用 `android emulator` 创建和管理虚拟设备，并使用 `android run` 部署应用，消除了手动构建和部署周期中的猜测环节。
- **可更新性**：运行 `android update` 以确保你拥有可用的最新功能。

Android CLI 可以创建设备，在其上运行你的应用，并让智能体更轻松地导航 UI。

虽然 Android CLI 将赋能你的智能体开发流程，但它也被设计用于简化 CI（持续集成）、维护以及针对 Android 开发日益分布式性质的任何其他脚本化自动化。今天就下载并试用 Android CLI 吧！

### 使用官方 Android 技能（Skills）锚定 LLMs

传统的文档通常是描述性的、概念性的和高层次的。虽然非常适合学习，但 LLMs 通常需要精确的、可操作的指令来执行复杂的工作流，而不会使用过时的模式和库。

为了弥合这一差距，我们正在推出 Android Skills GitHub 仓库。技能是模块化的、基于 Markdown 的（SKILL.md）指令集，为任务提供技术规范，并设计为在你的提示词（Prompt）与技能的元数据匹配时自动触发，从而省去了你手动将文档附加到每个提示词的麻烦。

Android Skills 涵盖了部分 Android 开发者和 LLMs 可能会遇到困难的最常见工作流——它们帮助模型更好地理解和执行遵循我们 Android 开发最佳实践和指导的特定模式。

在我们的初始版本中，该仓库包括以下技能：

- Navigation 3 的设置和迁移。
- 实现边缘到边缘（Edge-to-edge）支持。
- AGP 9 和 XML 转 Compose 的迁移。
- R8 配置分析，等等！

如果你正在使用 Android CLI，你可以使用 `android skills` 命令浏览我们的技能集合并设置你的智能体工作流。这些技能也可以与你创建的任何其他技能，或 Android 开发者社区创建的第三方技能共存。了解更多关于开始使用 Android Skills 的信息。

通过 Android CLI 安装 Android Skills，让你的智能体更有效率。

### 通过 Android 知识库获取最新指导

我们今天推出的第三个组件是 Android 知识库。通过 `android docs` 命令访问，并且在最新版本的 Android Studio 中已经可用，这个专门的数据源使智能体能够搜索并获取最新的权威开发者指南作为相关上下文。

Android 知识库确保智能体拥有 Android 的最新上下文、指导和最佳实践。

通过访问频繁更新的知识库，智能体可以将其响应基于来自 Android 开发者文档、Firebase、Google Developers 和 Kotlin 文档的最新信息。这确保了即使 LLM 的训练截止日期是一年前，它仍然可以就我们今天推荐的最新框架和模式提供指导。

### Android Studio：优质应用的最终归宿

除了赋能开发者和智能体处理项目设置和样板代码外，我们还设计了这些新工具和资源，使其更易于过渡到 Android Studio。这意味着你可以使用 Android CLI 和智能体快速启动一个原型，然后在 Android Studio 中打开项目，使用可视化的代码编辑、UI 设计、深度调试和高级性能分析工具来微调你的 UI，这些工具会随着你应用能力的增长而扩展。

当是时候为各种设备类型构建大规模发布的高质量应用时，Android Studio 中的智能体将在此提供帮助，同时利用最新的开发最佳实践和库。除了强大的用于活跃开发的 Agent 和 Planning 模式外，我们还引入了 AI 驱动的“新建项目”流程，为快速原型化你的下一个伟大 Android 创意提供了一个切入点。

这些内置智能体使得将你的应用创意扩展到手机、折叠屏设备、平板电脑、Wear OS、Android Auto 和 Android TV 变得简单。凭借对你项目源代码的完整上下文以及一套全面的调试、性能分析和仿真工具，你拥有了一套端到端的 AI 加速工具包供你使用。

### 今天就开始

Android CLI 今天起提供预览版，同时伴随着一套不断增长的 Android Skills 和针对智能体的知识库。要开始使用，请前往 d.android.com/tools/agents 下载 Android CLI。
