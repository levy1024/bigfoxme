---
title: "Ultra X7 358H 笔记本电脑，通过 ComfyUI 来使用 Qwen-Image-2.1-Turbo, 比之前的方案快约 1.8 倍"
published: 2026-11-23
tags:
- ComfyUI
- 文生图
- 本地部署
category: AI
draft: false		# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

我的 Ultra X7 358H 笔记本电脑，在之前文章[《Ultra X7 358H 笔记本电脑，本地部署 Qwen-Image-2.1-Turbo，生成一张 1024*1024 的图片，耗时约 2 分钟》](#post:intel-ultra-x7-qwen-image-2.1-turbo)中，部署了文生图的大模型 Qwen-Image-2.1-Turbo。

但是这次部署有一个不方便的地方：通过命令行指定参数、提示词来生成图片，我希望能在图形界面中完成。之前一直听说过 ComfyUI，但没用过，所以这次便考虑通过 ComfyUI 来使用 Qwen-Image-2.1-Turbo。

ComfyUI 是一款免费开源、基于节点图的生成式 AI 创作引擎，可在本地或云端运行图像、视频、音频与 3D 生成工作流，提供极高的可控性与可扩展性。

## 本地 ComfyUI 界面
部署成功后，ComfyUI 界面截图：  
![local-qwen-image-21](/images/posts/ai/local-qwen-image-21.png)

同样，所有部署的工作由大模型来完成。下面是 AI 的总结报告（Deepseek Harness Desktop + Deepseek V4.1 Flash）：

## 结论摘要

> 结论：**已经接入并跑通**。ComfyUI 0.46.0 跑在 Intel Arc B390 的 XPU 后端上，  
> 通过浏览器操作出图，1024×1024 / 8 步约 **75 秒** —— 比原来的 stable-diffusion.cpp 方案快约 1.8 倍。  
>  
> 代价：内存峰值从 sd.cpp 的 14.9 GB 涨到 **31.4 GB**（几乎吃满 31.55 GB）。  


## 为什么不是"改个配置"

原来的部署是 **stable-diffusion.cpp + GGUF + Vulkan**，ComfyUI 是 **PyTorch + safetensors** 的栈，
两者不共享推理代码。所以"接入"实际是一次栈迁移，可选三条路：

| 路线 | 做法 | 结论 |
|---|---|---|
| A. 自定义节点调 sd-cli | ComfyUI 只当遥控器，后端仍是 sd.cpp | 保住 Vulkan 性能，但用不到 ComfyUI 的节点生态（LoRA/ControlNet 编排），等于没用上 ComfyUI |
| **B. ComfyUI 原生 + XPU**（**已采用**） | torch.xpu 直接跑官方 ComfyUI 模型格式 | 走通，最快，且能复用 ComfyUI 全部能力 |
| C. ncnn/Vulkan | 另一套后端 | 与本机已有资源不匹配，未采用 |


## 本机现有条件（实测）

关键点：之前那次部署里，`D:\AI_Tools\unsloth\envs\unsloth-xpu` 这个 conda 环境**已经有完整的 XPU PyTorch**：

```
python 3.10.21
torch 2.9.0+xpu
torchvision 0.24.0+xpu
xpu_available True   device_count 1
dev0 Intel(R) Arc(TM) B390 GPU
transformers 5.5.0   diffusers 0.40.0   safetensors 0.8.0   accelerate 1.15.0
```

**所以不需要装 CUDA 版 PyTorch，也不需要 IPEX。** ComfyUI 源码本身就支持 Intel XPU
（`comfy/model_management.py` 里有 `is_intel_xpu()`、`torch.device("xpu", ...)`，
甚至有一条专门针对 iGPU 的注释：*"xpu does support non blocking but it is slower on iGPUs"*）。


## 部署产物

```
D:\AI_Tools\
├─ ComfyUI\                                  # 0.46.0（gitcode 镜像克隆，GitHub 大仓库被重置）
│   ├─ custom_nodes\ComfyUI-GGUF\            # GGUF 加载器（含本次补丁）
│   └─ models\
│       ├─ diffusion_models\qwen-image-2.1-turbo-Q4_K.gguf   ← 硬链接复用已有 3.91 GB
│       ├─ text_encoders\qwen3vl_8b_int8_convrot.safetensors ← 新下 8.71 GB（官方）
│       └─ vae\qwen_image_2.1_vae_bf16.safetensors           ← 新下 0.64 GB（官方）
└─ qwen-image-2.1\
    ├─ start-comfyui.cmd                     # 一键启动（浏览器用这个）
    ├─ qwen-image-2.1-turbo-comfyui.json     # 可在 ComfyUI 里打开的工作流
    ├─ comfy_t2i.py                          # 命令行/批量出图（已验证）
    └─ make_comfy_workflow.py                # 从 /object_info 生成工作流文件
```

> 硬链接：DiT 的 3.91 GB 没有复制，直接在 `models\diffusion_models` 建了硬链接（同盘不占额外空间）。


## 三个必须解决的问题（本次核心技术内容）

### 问题 1：DiT 的 GGUF 被判定为"Unknown model architecture"

```
node 1 UnetLoaderGGUF -> ValueError: This model is not currently supported - (Unknown model architecture!)
```

**根因**：`gguf-org` / `AtomicChat` 这类给 sd.cpp 用的 GGUF **没有 `general.architecture` 元数据**
（实测 `kv_count = 0`）。于是 ComfyUI-GGUF 走兼容模式，调用 `tools/convert.py` 的 `detect_arch()`
去猜架构 —— 而它的 `arch_list` 里**根本没有 Qwen-Image 的模板**。

有意思的是：插件 `loader.py` 的 `IMG_ARCH_LIST` 里**有** `"qwen_image"`，
也就是说插件本身支持，只是这个猜测函数漏了注册。

**修法**（`ComfyUI-GGUF/tools/convert.py`，11 行）：

```python
class ModelQwenImage(ModelTemplate):
    # Qwen-Image 2.1. sd.cpp-style GGUFs carry no general.architecture field, so this
    # signature is what lets gguf_sd_loader accept them; the fused img_mlp keeps it
    # off Qwen-Image 1.x.
    arch = "qwen_image"
    keys_detect = [
        ("txt_in.text_norm.weight", "transformer_blocks.0.img_mlp.gate_up.weight")
    ]
```
并把它加入 `arch_list`。

修完后 **DiT 的 GGUF 正常加载**，4017 MB 权重直接用我们之前下的文件。

### 问题 2：文本编码器维度不匹配（12288 vs 4096）

```
Given normalized_shape=[4096], expected input with shape [*, 4096],
but got input of size [1, 512, 12288]
```

12288 = 3 × 4096，说明 ComfyUI 把编码器当成了 **Qwen-Image 1.x**（三层 tap 拼接），
而不是 2.1 需要的"最后一层"。

**根因**（关键发现）：ComfyUI 的 `detect_te_model()` 靠 **视觉权重** 来识别 Qwen3-VL：

```python
if "model.visual.deepstack_merger_list.0.norm.weight" in sd:  # DeepStack is unique to Qwen3-VL
    return {2048: TEModel.QWEN3VL_2B, 2560: TEModel.QWEN3VL_4B}.get(...)
```

而我们从 `gguf-org` 下的文本编码器是**纯文本的**（399 个张量，视觉权重在独立的 mmproj 文件里）。
没有 `model.visual.*` → 识别失败 → 落到 v1 分支。

**修法**：换成官方 ComfyUI 格式的 `qwen3vl_8b_int8_convrot.safetensors`（8.71 GB）。
实测它有 **1258 个张量，其中 351 个 `model.visual.*`**，识别正常。

> 这条路也验证了：**ComfyUI 的 Qwen-Image-2.1 文本编码器不能省略视觉塔**。
> 想省内存只能选更小的量化（如 `qwen3vl_8b_w4a8.safetensors` 5.88 GB），不能只给纯文本权重。

### 问题 3：不能直接 `pip install -r requirements.txt`

ComfyUI 的 requirements 里含 `torch`、`torchvision`、`transformers`。
直接装会**把 `torch 2.9.0+xpu` 覆盖成 CPU/CUDA 版，直接毁掉整条 XPU 链路**。

**做法**：先 `pip install --dry-run` 确认 torch 不在待装列表，再只装缺失的 20 个包
（走阿里云镜像）：

```
  Would install ... （列表里没有 torch / torchvision / transformers / numpy）
```

装完复核：

```
torch 2.9.0+xpu
xpu True Intel(R) Arc(TM) B390 GPU
```


## 实测性能

### ComfyUI 耗时（1024×1024，Turbo 8 步，cfg 1.0，euler，固定 sigma）

| 运行 | 耗时 |
|---|---|
| 1 | 53.3 s |
| 2 | 74.8 s |
| 3 | 74.9 s |
| 4 | 77.3 s |
| **典型值** | **≈ 75 s** |

（第 1 次偏快是模型仍在缓存里；512×512 约 60 s 含加载。）

### 与 stable-diffusion.cpp 对比

| | stable-diffusion.cpp (Vulkan) | **ComfyUI (XPU)** |
|---|---|---|
| 1024×1024 单张 | 131~136 s | **≈ 75 s** ✅ 快 ~1.8× |
| 全进程内存峰值 | **14.88 GB** | **31.4 GB** ⚠️ |
| 模型权重 | 8.95 GB（TE 用 Q4 GGUF 4.68 GB） | 13.26 GB（TE 用 int8 8.71 GB） |
| 交互方式 | 命令行 | 浏览器 GUI ✅ |
| 生态 | 无 | LoRA / ControlNet / 工作流编排 ✅ |

**结论：速度和无 GUI 的问题都解决了，但代价是内存几乎翻倍。**

`vram_total` 上报 16.46 GB、总 RAM 32.3 GB，而实测全进程工作集合计峰值 **31.4 GB**
（含 Windows 基线约 6 GB，ComfyUI 自身约 25 GB）。**在 31.55 GB 的机器上属于贴边走**。


## 怎么用

### 启动（必须插电，否则会降频 8 倍）

```bat
D:\AI_Tools\qwen-image-2.1\start-comfyui.cmd
```
然后浏览器打开 **http://127.0.0.1:8188**

### 浏览器里出图

1. 把 `qwen-image-2.1-turbo-comfyui.json` 拖进 ComfyUI 窗口（9 个节点已连好）
2. 在 `TextEncodeQwenImage21` 节点里改提示词
3. 点 Run

工作流结构：

```
UnetLoaderGGUF ─┐
CLIPLoader ─────┼→ TextEncodeQwenImage21 ─┬→ SamplerCustom → VAEDecode → SaveImage
VAELoader ──────┘   (prompt/resolution)   │        ↑
                     ManualSigmas ────────┘        │
                     KSamplerSelect ───────────────┘
```

节点参数（已在文件里配好）：
- `CLIPLoader`：`qwen3vl_8b_int8_convrot.safetensors` + type **`qwen_image`**
- `ManualSigmas`：`1.0,0.978453,0.95418,0.926626,0.89508,0.845148,0.704534,0.414568,0.0`
- `SamplerCustom`：cfg **1.0**、seed 42、add_noise true
- `TextEncodeQwenImage21`：resolution **1024**（这是输出画布边长）

### 命令行/批量

```powershell
D:\AI_Tools\unsloth\envs\unsloth-xpu\python.exe D:\AI_Tools\qwen-image-2.1\comfy_t2i.py `
  --prompt "一只坐在窗台上的橘猫" --resolution 1024 --seed 42
```


## 局限与后续可优化

| 项 | 现状 | 建议 |
|---|---|---|
| **内存峰值 31.4 GB** | 贴边 | 换 `qwen3vl_8b_w4a8.safetensors`（5.88 GB，省 2.8 GB）；或出图前关浏览器 |
| 电池供电 | 会降频 | 插电 + `powercfg /setactive SCHEME_MIN` |
| 图像编辑 | **未测** | ComfyUI 支持（`TextEncodeQwenImage21` 有 16 个参考图槽），需额外验证 |
| 2048×2048 | **未测** | 官方说原生支持 2K；按 4 倍像素推约 5 分钟/张，内存风险高 |
| 画质瑕疵 | 未对比 | 官方文档提到 Qwen-Image-2.1 的 VAE 在写实细节上有棋盘纹理，有第三方 `texture_fix_vae` 可替换 |
| 提示词增强 | 未启用 | 官方 PE 模型（`qwen3.5_9b_qwen_image_2.1_pe_*`，8.82 GB）本机内存放不下 |
| GGUF 文本编码器 | 暂不可用 | 缺视觉塔导致识别失败；若把 mmproj 合进 TE GGUF 可绕开，但需要改插件支持双文件 |


## 验证命令

```powershell
# 1. 确认 ComfyUI 跑在 XPU 上
curl.exe -s http://127.0.0.1:8188/system_stats

# 2. 命令行出图（也可当健康检查）
D:\AI_Tools\unsloth\envs\unsloth-xpu\python.exe D:\AI_Tools\qwen-image-2.1\comfy_t2i.py `
  --prompt "test" --resolution 512

# 3. 重新生成工作流文件（改了节点参数后）
D:\AI_Tools\unsloth\envs\unsloth-xpu\python.exe D:\AI_Tools\qwen-image-2.1\make_comfy_workflow.py
```


## 附：实测产出

| 文件 | 说明 |
|---|---|
| `ComfyUI\output\comfy1024_1..4_00001_.png` | 1024×1024 RGBA，四种运行耗时样本 |
| `ComfyUI\output\comfy512_00001_.png` | 512×512 首图 |
| `ComfyUI\output\final_check_00001_.png` | 重启后用启动脚本跑的验收图 |

*本文所有耗时、内存、速度均为本机实测；模型架构结论来自阅读 ComfyUI 与 ComfyUI-GGUF 源码并实测验证。*
