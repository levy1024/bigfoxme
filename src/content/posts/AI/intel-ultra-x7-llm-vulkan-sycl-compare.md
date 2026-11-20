---
title: "Ultra X7 358H 笔记本电脑，本地部署 Qwen3.8-27B-Q4，llama.cpp Vulkan 版与 SYCL 版对比测试报告"
published: 2026-11-20
tags:
- LLM
- 本地部署
category: AI
draft: false		# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

在之前文章[《Ultra X7 358H 笔记本电脑，本地部署当红炸子鸡 Qwen3.8-27B-Q4，实测生成速度 5.6 tok/s》](#post:intel-ultra-x7-llm-qwen38-27b)中，我已完成 Qwen3.8-27B-Q4 模型的本地部署。

但当时的部署，选用的是 SYCL 作为 llama.cpp 的后端，网友建议使用 Vulkan 作为 llama.cpp 的后端，速度会更快。于是，我便想试一试，实际情况到底如何，于是便有了这一篇文章。

## 省时间，只看结论
Vulkan 的预填充快 3.9 倍（输入快很多），生成速度也快一丢丢，但实际体验差距不大（输出差距不明显）。  

生成阶段是内存带宽瓶颈：每生成一个 token 都要完整读一遍 15.33GB 模型权重。无论 SYCL 还是 Vulkan，最终都受限于 DDR5 的物理带宽（约 150-230 GB/s）。

理论极限 ≈ 带宽 ÷ 模型大小 ≈ 10-15 t/s，核显的访问开销再打个折 → 6-7 t/s 是这台机器的物理上限。

## 实际测试截图
![ultra-x7-qwen38-q4-vulkan](/images/posts/ultra-x7-qwen38-q4-vulkan.png)

下面是 AI 的总结报告（Deepseek Harness Desktop + Deepseek V4.1 Flash）：

## 结论速览

| 指标 | SYCL | **Vulkan** | 胜出 |
|------|------|-----------|------|
| **pp128**（预填充吞吐）| 56.93 t/s | **219.56 t/s** | 🔥 **Vulkan 快 3.86 倍** |
| **tg64**（生成速度）| 6.17 t/s | **6.68 t/s** | ✅ Vulkan 快 8.3% |
| 部署复杂度 | 11 步（oneAPI 2.3GB + VS Build Tools 4GB + 编译）| **4 步（下载解压即用）** | ✅ Vulkan 完胜 |
| 运行时依赖 | 每次启动需 setvars.bat | **无（绿色包）** | ✅ Vulkan 完胜 |
| 可移植性 | 需重建整套编译环境 | 拷目录即用 | ✅ Vulkan 完胜 |

**推荐：日常使用 Vulkan 版；SYCL 版可保留作备用。**


## 测试环境

### 硬件

| 项目 | 规格 |
|------|------|
| CPU | Intel Core Ultra X7 358H（16 核，Panther Lake） |
| 内存 | 32GB DDR5-9600 |
| GPU | Intel Arc B390 核显（Xe3，96 EU，共享系统内存） |
| GPU 驱动 | 32.0.101.8509（driverVersion 101.8509） |
| Vulkan 运行时 | 1.4.313（系统自带，`C:\Windows\System32\vulkan-1.dll`） |
| Vulkan 设备 API | 1.4.335（vulkaninfo 报告） |

### 软件版本

| 组件 | SYCL 版 | Vulkan 版 |
|------|---------|-----------|
| llama.cpp | master 自编译（build unknown） | **官方 nightly b12292**（build af6b5243d） |
| 后端库 | ggml-sycl（oneAPI DPC++ 编译） | ggml-vulkan.dll（40MB，预编译） |
| 编译环境 | oneAPI 2025.3 + VS Build Tools 14.44 + Ninja | 无需编译 |
| 模型 | Qwen3.8-27B-UD-Q4_K_M.gguf（15.33GB） | 同一个文件（共享） |

### 设备识别对比

**SYCL 后端**（`sycl-ls` / llama.cpp 日志）：
```
| 0| [level_zero:gpu:0]| Intel Arc B390 GPU| 30.0| 96 EU| Global mem: 17677M | driver 1.14.36605
```

**Vulkan 后端**（`llama-cli --list-devices`）：
```
Vulkan0: Intel(R) Arc(TM) B390 GPU (18413 MiB, 18413 MiB free)
```
Vulkan 后端加载日志（关键能力标记）：
```
ggml_vulkan: 0 = Intel(R) Arc(TM) B390 GPU (Intel Corporation) | uma: 1 | rebar: 1 | fp16: 1 |
              bf16: 0 | fp4: 0 | warp size: 32 | shared memory: 49152 | int dot: 1 |
              matrix cores: KHR_coopmat
```

> 注：两个 API 报告的内存上限不同（SYCL 17677M ≈ 17.3GB，Vulkan 18413MiB ≈ 18.0GB），
> 是不同接口的内存上报口径差异，实际可用额度在同一区间。


## 对比测试方法

为保证可比性，两个后端使用**完全相同的参数**：

```powershell
llama-bench -m Qwen3.8-27B-UD-Q4_K_M.gguf -ngl 99 -p 128 -n 64
#            -ngl 99 = 全部层卸载到 GPU
#            -p 128  = 预填充 128 token 测试
#            -n 64   = 生成 64 token 测试
```

测试脚本：SYCL 用 `bench_qwen38.bat`，Vulkan 用 `bench_vulkan.bat`。


## 实测数据

### 基准测试结果

| 后端 | pp128 (t/s) | tg64 (t/s) | 测试批次 |
|------|------------|-----------|---------|
| SYCL（自编译） | 55.76 ± 0.22 | 5.68 ± 0.13 | 第 1 次 |
| SYCL（自编译） | 56.93 ± 0.48 | 6.17 ± 0.04 | 第 2 次 |
| **Vulkan（b12292）** | **219.56 ± 0.57** | **6.68 ± 0.05** | 官方包 |

> SYCL 两次测量有 ±5% 波动（系统负载影响），不影响结论。

**差距汇总**：
- **pp128：Vulkan 是 SYCL 的 3.86 倍**（219.56 / 56.93）
- **tg64：Vulkan 比 SYCL 快 8.3%**（6.68 / 6.17）

### 实际对话速度（Vulkan 版）

交互界面底部显示：
```
[ Prompt: 6.1 t/s | Generation: 6.6 t/s ]
```

- **Generation 6.6 t/s** ✅ 与 bench 的 6.68 t/s 吻合——这是真实生成上限
- **Prompt 6.1 t/s** ⚠️ 与 bench 的 219 t/s 不矛盾，见下节解释


## 性能差异根因分析

### 为什么 Vulkan 的预填充快 3.9 倍

**矩阵核心（Matrix Cores）完整启用**

Vulkan 后端日志明确标记：
```
matrix cores: KHR_coopmat    ← 协作矩阵扩展已启用
int dot: 1                   ← 整数点积加速已启用
```
B390 的 XMX 矩阵运算单元被充分调用，而预填充（Prompt processing）正是矩阵运算最密集的阶段，因此吞吐量提升 3.9 倍。

**统一内存 + ReBAR 优化**
```
uma: 1      ← Unified Memory Architecture，核显共享内存的零拷贝路径
rebar: 1    ← Resizable BAR，GPU 可直接访问更大内存窗口
```
核显通过统一内存架构访问系统内存的路径被优化，减少了数据传输开销。

**SYCL 版本身是“降级配置”**

回顾 SYCL 编译时的配置信息：
```
GGML_SYCL_SUPPORT_LEVEL_ZERO_API: no   ← Level Zero API 支持被禁用
GGML_SYCL_F16: no                      ← FP16 计算未启用
（CMake 警告：Level Zero loader or development headers not found）
```
编译时 oneAPI 缺 Level Zero 开发头文件，导致 SYCL 后端只能走通用路径，未能用上最优的内存管理和 FP16 通道。**即使用户修复 SYCL 编译配置，预填充也很难追上 Vulkan 的 219 t/s。**

### 为什么生成速度（tg）差距不大

生成阶段是**内存带宽瓶颈**：每生成一个 token 都要完整读一遍 15.33GB 模型权重。无论 SYCL 还是 Vulkan，最终都受限于 DDR5 的物理带宽（约 150-230 GB/s）。

理论极限 ≈ 带宽 ÷ 模型大小 ≈ 10-15 t/s，核显的访问开销再打个折 → **6-7 t/s 是这台机器的物理上限**。Vulkan 的 8% 优势来自更高效的内存访问实现。

### 为什么交互模式 Prompt 只有 6.1 t/s

bench 与交互模式衡量的是**不同场景**：

| 场景 | 批量大小 | 速度 | 原因 |
|------|---------|------|------|
| bench pp128 | 一次并行 128 token | 219 t/s | 矩阵核心满载，吞吐最大化 |
| 交互输入 | 每次几十个 token | 6.1 t/s | 批量太小，矩阵核心“吃不饱”，固定调度开销占主导 |

**类比**：219 t/s 是“大货车满载运量”，6.1 t/s 是“一件一件搬运速度”。

**实际体验**：输入 30 token 的问题 → 首字等待约 5 秒 → 生成 6.6 t/s（约 5 汉字/秒）。


## 场景适用性分析

### 最适合：输入远大于输出的任务

**代码分析**是最典型的受益场景：

| 阶段 | 指标 | 速度 | 例：分析 5 万 token 的项目 |
|------|------|------|--------------------------|
| 读取代码 | 预填充 | 200+ t/s | 约 4-8 分钟（Vulkan）|
| 输出分析 | 生成 | 6.6 t/s | 300 字结论约 30 秒 |

> 对比 SYCL：同样的 5 万 token 输入，预填充需 15-25 分钟——**Vulkan 的优势在这个场景被放大 3.9 倍**。

### 预填充速度随上下文衰减

bench 的 219 t/s 是短上下文（128 token）成绩。上下文越长，attention 计算量按平方增长：

| 上下文长度 | 预计预填充速度 |
|-----------|--------------|
| 128 token | 219 t/s（实测）|
| 8K | 约 150-180 t/s |
| 32K+ | 可能低于 100 t/s |

即便如此，仍远快于生成速度，量级优势不变。

### 代码分析的上下文容量要求

当前脚本 `-c 4096` 只能装约 3000 字（几百行代码），**分析真实项目需要扩容**：

```bat
REM 启动脚本中修改：32K 上下文 + KV 量化控显存
llama-cli.exe -m "..." -ngl 99 -c 32768 -ctk q8_0 -ctv q8_0 --color auto
```

- `-c 32768`：约 2.5 万行代码的容量
- `-ctk/-ctv q8_0`：KV 缓存量化，显存占用减半，质量影响极小

**替代策略**：大项目建议「按模块分段分析 + 逐层汇总」，比一次塞整个项目质量更好。


## 故障排查

| 现象 | 原因 | 解法 |
|------|------|------|
| 下载 release 包 403 | ghfast.top 对 llama.cpp 不友好 | 改用 `gh-proxy.com` 前缀 |
| `/releases/latest` 只有 1 个资产 | 官方改为 nightly 策略 | 用 `releases?per_page=10` 列表找带资产的 tag |
| `llama-cli` 启动闪退 0xC0000135 | 缺运行时 DLL（SYCL 版问题）| SYCL 版用 setvars.bat；**Vulkan 版无此问题** |
| `--color` 报错 expected value | 新版参数格式 | `--color auto` |
| `-no-cnv` 不存在 | 新版已移除 | 用 `--single-turn` |
| 生成速度远低于 6.6 t/s | KV 缓存溢出到系统内存 | 降低 `-c`，或用 KV 量化 |
| 显存不足 | 模型 15.33GB + KV | 用 `-ctk/-ctv q8_0` 量化 KV |


## 部署路线选择建议

**新机器部署请直接走 Vulkan 路线**：

| | SYCL 路线（11 步）| Vulkan 路线（4 步）|
|---|---|---|
| 前置软件 | oneAPI 2.3GB + VS Build Tools 4GB + CMake + Ninja + Git | **无** |
| 编译 | 需 10-20 分钟编译 496 个目标 | **无需编译** |
| 环境加载 | 每次启动 setvars.bat | **无需** |
| 实测性能 | pp 57 t/s / tg 6.17 t/s | **pp 220 t/s / tg 6.68 t/s** |
| 出错风险 | 高（编译链/ACL/DLL 多坑）| **低（解压即用）** |

**结论**：除非有特殊理由（如需 SYCL 生态集成），新机器都建议直接部署 Vulkan 版。上一份《Intel核显电脑本地大模型部署指南》中的 SYCL 流程可作为技术参考或备用方案保留。


*报告生成：2026-11，数据来自本机实测。*
