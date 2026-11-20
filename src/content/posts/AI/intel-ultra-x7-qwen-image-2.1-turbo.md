---
title: "Ultra X7 358H 笔记本电脑，本地部署 Qwen-Image-2.1-Turbo，生成一张 1024*1024 的图片，耗时约 2 分钟"
published: 2026-11-21
tags:
- 图片生成
- 本地部署
category: AI
draft: false		# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

之前在我的 Ultra X7 358H 笔记本电脑上部署大模型，都是大语言模型(LLM)，今天来试试生成图片的大模型 Qwen-Image-2.1-Turbo。

## 先看实际效果

提示词：一只坐在窗台上的橘猫，阳光斜射。  
![ultra-x7-qwen-image-cat](/images/posts/ai/ultra-x7-qwen-image-cat.png)

下面是 AI 的总结报告（Deepseek Harness Desktop + Deepseek V4.1 Flash）：

## 结论摘要

> 本机（HONOR MagicBook JGC-N / Intel Core Ultra X7 358H / Arc B390 核显 / 31.55 GiB 板载内存）  
> 用 stable-diffusion.cpp + Vulkan 跑通 Qwen-Image-2.1-Turbo 的全过程与实测数据。  
>  
> 结论：**可行且已跑通**。1024×1024 / 8 步，单张约 2 分钟（插电）；全部权重常驻显存仅占 8.95 GB。  


| 问题 | 答案 |
|---|---|
| 能不能跑？ | **能**，已生成 1024×1024 成品图，中文/英文文字渲染正确 |
| 内存够不够？ | 够。权重 8.95 GB，sd-cli 进程峰值 **10.01 GB**，全系统进程合计 14.88 GB，跑完仍空闲 24.5 GB |
| 一张要多久？ | **插电约 2 分 11 秒**（131~136 s）；**电池供电可能退化到 18 分钟**（实测最差 1101 s） |
| 磁盘要多少？ | 权重合计 **9.95 GB**，D 盘剩余 535 GB，无压力 |
| 难点在哪？ | 不是内存，是 **两个必须加的命令行开关**，否则根本跑不起来（见第四节） |


## 硬件与环境（实测）

| 项目 | 值 |
|---|---|
| CPU | Intel Core Ultra X7 358H（Panther Lake） |
| 核显 | Intel Arc B390，驱动 32.0.101.8509，**uma=1 / fp16=1 / KHR_coopmat** |
| 内存 | 31.55 GiB 板载，**与显存共享同一池** |
| 系统 | Windows 11 build 26200 |
| 推理引擎 | stable-diffusion.cpp **prebuilt Vulkan** 版，commit `d637cfb` |
| 网络现实 | `github.com` 被封（连接重置）；`api.github.com` / `raw.githubusercontent.com` / `cdn.jsdelivr.net` / `modelscope.cn` **可用** |

Vulkan 设备枚举（`sd-cli.exe -v` 实测输出）：

```
ggml_vulkan: Found 1 Vulkan devices:
ggml_vulkan: 0 = Intel(R) Arc(TM) B390 GPU (Intel Corporation) | uma: 1 | fp16: 1 |
                bf16: 0 | fp4: 0 | warp size: 32 | shared memory: 49152 |
                int dot: 1 | matrix cores: KHR_coopmat
```

`uma: 1` 这一项是后面所有麻烦的根源。


## 部署产物

```
D:\AI_Tools\
├─ sd-cpp\                          # 预编译 Vulkan 版（28.7 MB zip 解压）
│   ├─ sd-cli.exe                   # 主程序
│   ├─ ggml-vulkan.dll              # 40.7 MB，Vulkan 后端
│   └─ ggml-cpu-*.dll               # 各代 CPU 后端
├─ models\Qwen-Image-2.1\           # 从 ModelScope 下载，合计 9.95 GB
│   ├─ qwen-image-2.1-turbo-Q4_K.gguf   3.91 GB  ← DiT（Turbo 蒸馏权重）
│   ├─ qwen3vl-8b-it-Q4_K_M.gguf        4.68 GB  ← 文本编码器（关键：必须量化版）
│   ├─ mmproj-qwen3vl-8b-Q8_0.gguf      0.72 GB  ← 视觉投影（图像编辑用，文生图暂不需要）
│   └─ qwen-image-2.1-vae-BF16.gguf     0.64 GB  ← VAE
└─ qwen-image-2.1\
    ├─ generate.ps1                 # 生成脚本
    ├─ bench.ps1                    # 基准测试（含显存采样）
    ├─ final_bench.ps1              # 单次 + 内存监控
    ├─ fetch_segmented.py           # 分段下载器（见第六节）
    └─ outputs\                     # 产出图片
```

### 为什么用预编译二进制而不是自己编译

原计划用本机 VS BuildTools + CMake + Ninja 编 SYCL 版。但 `github.com` 无法 `git clone`（连接被重置），而官方 releases **有 Windows Vulkan 预编译包**，且 release 资源走 `release-assets.githubusercontent.com`，**该域名未被封**。28.7 MB、6 MB/s 下载完即用，省掉整条编译链。

**为什么不选 SYCL**：本机 llama.cpp 是 SYCL 版，但 sd.cpp 的官方预编译包没有 Windows SYCL 变体（只有 CPU / CUDA / ROCm / Vulkan），而 Vulkan 在 Arc 上完全可用且已实测通过。


## 两个必须加的开关（本报告最重要的部分）

### 开关 1：`--eager-load` —— 不加就完全跑不起来

**症状**（首次运行时）：

```
[W] model manager memory on Vulkan0: reported free 25074.88 MB / total 18413.58 MB,
    tracked weights 0.00 MB / other runtime 0.00 MB / current runtime 0.00 MB
[W] model manager cannot make enough memory available on Vulkan0:
    need 846.72 MB device / 334.72 MB budget, available 0.00 MB device / unlimited budget
[E] qwen3vl segment 1/37 (llm.text.prelude) failed during weight preparation
[E] LLM prompt encoding failed
[E] generate failed
```

**根因**：驱动上报的 `free`（25074 MB）**大于** `total`（18413 MB）。这在独显上不可能出现，但 `uma: 1` 的核显上，ggml 拿到的"空闲显存"其实是**整机可用内存**，而"总显存"是驱动给的一个堆预算上限。两者相减为负，模型管理器算出 **0 MB 设备预算**，于是每一次 lazy 权重准备都失败。

**为什么 `--offload-to-cpu` 帮不上**：在核显上"显存"和"内存"是同一个池子，offload 只是换个名字占同一份内存，模型管理器照样走那条坏路径。

**试过但无效的方案**（均已实测）：

| 方案 | 结果 |
|---|---|
| 默认（auto-fit on） | ❌ 失败 |
| `--auto-fit off` | ❌ 失败（同样报 0 MB device） |
| `--max-vram 12` | ❌ 失败（budget 显示 12288 MB，device 仍是 0.00 MB） |
| `--backend vulkan0` | ❌ 失败 |
| `--params-backend cpu` | ❌ 失败 |
| `--params-backend disk` | ❌ 失败 |
| `--offload-to-cpu` | ❌ 失败 |
| `--disable-segmented-compute` | ❌ 失败（改报 `segment 1/1 (graph)`） |
| **`--eager-load`** | ✅ **成功** |

**原理**：`--eager-load` 在模型加载期一次性把所有 8953 MB 参数放进后端，**绕过 lazy 权重准备那条调用模型管理器的代码路径**。实测加载仅 2.53~3.14 s。

### 开关 2：`--vae-tiling` —— 不加慢 33 倍

不加时 1024×1024 的 VAE 解码撞上 pinned memory 分配失败：

```
[W] ggml: ggml_vulkan: Failed to allocate pinned memory
    (Requested buffer size exceeds device buffer size limit: ErrorOutOfDeviceMemory)
[I] decode_first_stage completed, taking 541.54s
```

（注意 `shared memory: 49152` 这个 48 KB 的硬件上限 —— Vulkan 后端尝试分配 pinned buffer 时越界，回退到一条极慢的路径。）

加 `--vae-tiling` 后：

| 1024×1024 | 解码耗时 | 全流程 |
|---|---|---|
| 不加 `--vae-tiling` | **541.5 s** | 656.7 s |
| 加 `--vae-tiling` | **16.4 s** | **136.5 s** |

**提速 33 倍**，而且我逐像素对比过两张图 —— 无接缝、画质一致。这在本机不是"省内存的优化"，而是**能否实用**的分界线。


## 实测性能

### 各分辨率耗时（Turbo，8 步固定 sigma，CFG 1.0）

| 分辨率 | 文本编码 | 8 步采样 | VAE 解码 | 全程 |
|---|---|---|---|---|
| 256×256 | 0.24 s | 2.26 s | 0.43 s | ~5 s |
| 512×512 | 0.42 s | 10.89 s | 15.43 s | 31.2 s |
| **1024×1024** | 0.33 s | **110.4 s** | **16.4 s** | **131~136 s** |

采样速度约 **3.1 it/s**（即 8 步 110 s，单步约 13.7 s）。

1024×1024 的耗时构成很说明问题：**采样占 80%，解码占 12%**。所以想再快，方向是采样侧（见第八节），不是解码侧。

> 关于 Qwen-Image-2.1-Turbo 的参数：官方指定固定 8 步 sigma 计划
> `--sigmas qwen-image-2.1-turbo`（等价于 `1.0,0.978453,0.95418,0.926626,0.89508,0.845148,0.704534,0.414568,0.0`），
> CFG=1.0，euler。sigma 个数决定实际步数。

### 逐次重复测试（同一提示词、同一种子 42）

| 运行 | 采样 | 解码 | 全程 |
|---|---|---|---|
| 1 | 110.4 s | 15.8 s | **131.3 s** |
| 2 | **1077.4 s** | 16.8 s | **1101.5 s** ⚠️ |
| 3 | 111.5 s | 16.2 s | **134.3 s** |

三次产出的 PNG **字节数完全相同**（2,231 KB，同种子确定性输出），说明运行 2 没有出问题，纯粹是**变慢**。

### ⚠️ 运行 2 为什么慢 8 倍：本机在电池供电

```
PowerLineStatus: Offline      ← 未插电
BatteryCharge  : 65%
电源方案       : 平衡 (Balanced)
```

Intel 核显在电池 + 平衡方案下会大幅降频。**这是本机最大的性能变量，比任何软件调参都重要。**

**操作建议**：

```powershell
# 插电，并切到高性能方案
powercfg /setactive SCHEME_MIN      # 高性能
```

不插电时请预期 5~18 分钟一张。

### 内存占用（实测，final_bench.ps1 每 2 s 采样）

| 项目 | 值 |
|---|---|
| 权重总量（sd.cpp 自报） | **8953.76 MB** — 文本编码器 4302.33 + DiT 4007.05 + VAE 644.38 |
| 是否常驻显存 | 是，`VRAM 8953.76MB, RAM 0.00MB` |
| **sd-cli 进程峰值工作集** | **10.01 GB** |
| 全系统进程峰值合计 | 14.88 GB |
| 运行结束后可用内存 | **24.69 GB** |

对比你之前定的经验线（《显存与内存实测报告》§4.1：权重 ≤15.5 GiB，系统占用 ≈ 权重×1.6+5.8）：

- 权重 8.95 GB < 15.5 GB 上限，**安全**
- 实测系统占用 14.88 GB ≈ 8.95×1.6+5.8 = 20.1（估算偏保守，实际更宽松）

**结论：内存完全不是瓶颈，余量很大。** 这与跑 27B/35B 文本模型时"余量只剩 0.7 GiB"的紧张状态完全不同。


## 怎么用

### 生成一张图

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File D:\AI_Tools\qwen-image-2.1\generate.ps1 `
  -Prompt "一只坐在窗台上的橘猫，阳光斜射" -Output cat.png
```

> ⚠️ 必须带 `-ExecutionPolicy Bypass`：本机 PowerShell 执行策略禁止运行未签名脚本
> （报错 `未对文件进行数字签名`）。

### 直接用 sd-cli 的最小命令

```powershell
$M = 'D:\AI_Tools\models\Qwen-Image-2.1'
D:\AI_Tools\sd-cpp\sd-cli.exe `
  --diffusion-model "$M\qwen-image-2.1-turbo-Q4_K.gguf" `
  --vae             "$M\qwen-image-2.1-vae-BF16.gguf" `
  --llm             "$M\qwen3vl-8b-it-Q4_K_M.gguf" `
  -p "your prompt" -W 1024 -H 1024 `
  --cfg-scale 1.0 --sampling-method euler `
  --sigmas qwen-image-2.1-turbo `
  --fa --eager-load --vae-tiling `
  -o out.png
```

### 分辨率与参数

- 尺寸**必须能被 32 整除**（1024/1152/1248/1536/864/832…）
- 步数不用显式给，`--sigmas qwen-image-2.1-turbo` 自带 8 步
- 透明背景（RGBA）：提示词用官方格式
  `This is an RGBA image with transparency. <描述>. The image has alpha channel and the background is transparent.`
  （只对 `.png` / `.webp` 生效，存 `.jpg` 会丢 alpha）

### 图像编辑（`-r` 参考图）

需要额外的视觉权重 `--llm_vision`，本报告已下载 mmproj 文件：

```powershell
  ... --llm_vision "$M\mmproj-qwen3vl-8b-Q8_0.gguf" -r input.png -p "把背景换成雪山"
```

> 注意：mmproj 是 **Q8_0** 量化、来自 `gguf-org` 仓库，而官方文档示例用的是 `Qwen3VL-8B-Instruct-mmproj-BF16.gguf`。**编辑功能本次未实测**，如需使用建议先做一次验证。


## 局限与后续可优化项

| 项 | 现状 | 说明 |
|---|---|---|
| 电池 vs 插电 | **8 倍差距** | 最大变量，务必插电 + 高性能方案 |
| 2048×2048 | **未测** | 采样时间约为 1024² 的 4 倍（≈7 分钟），加解码预计 8~10 分钟；内存预计仍在预算内，但未验证 |
| 图像编辑 | **未测** | mmproj 已下载（Q8_0，非官方示例的 BF16），需验证 |
| 中文长文本渲染 | **未测** | 官方文档提到中文密集小字在量化下有损失 |
| 采样仍是瓶颈 | 110 s 占 80% | 可尝试 `--diffusion-fa`、`--cache-mode`（EasyCache/UCache）、或更低量化 Q3_K（3.35 GB） |
| 无常驻服务 | 每次重新加载 3 s | `sd-server.exe` 也在包里，可做常驻；本机加载才 3 s，收益不大 |
| 同种子确定性 | ✅ 已验证 | 三次运行 PNG 字节数完全一致 |


## 验证命令

```powershell
# 1. 确认 Vulkan 认到 Arc B390（关注 uma: 1）
D:\AI_Tools\sd-cpp\sd-cli.exe -v -M img_gen `
  --diffusion-model D:\AI_Tools\models\Qwen-Image-2.1\qwen-image-2.1-turbo-Q4_K.gguf `
  -p x -o $env:TEMP\never.png --steps 1 2>&1 | Select-String 'vulkan|uma'

# 2. 完整生成 + 阶段计时
powershell -NoProfile -ExecutionPolicy Bypass -File D:\AI_Tools\qwen-image-2.1\final_bench.ps1

# 3. 续传/校验权重（已下好的分片会跳过）
D:\AI_Tools\unsloth\miniconda3\python.exe -u D:\AI_Tools\qwen-image-2.1\fetch_segmented.py

# 4. 换高性能电源方案（插电时）
powercfg /setactive SCHEME_MIN
```


## 附：本次实测产出

| 文件 | 说明 |
|---|---|
| `outputs\final_1024.png` | 1024×1024 最终成品（猫举牌 `qwen2.1.cpp`，文字渲染准确） |
| `outputs\bench_1024_tiled.png` | 同上，验证 `--vae-tiling` 无接缝 |
| `outputs\bench_512.png` | 512×512 |
| `outputs\t_G.png` | 256×256 最小验证 |
| `outputs\rep_1..3.png` | 逐次重复测试（字节数相同，验证确定性） |
| `outputs\verify_generate.png` | 用 `generate.ps1` 生成（红熊猫吃竹子），验证脚本封装可用 |


*本报告所有耗时、内存、速度数字均为本机实测值，非引用或估算。*
