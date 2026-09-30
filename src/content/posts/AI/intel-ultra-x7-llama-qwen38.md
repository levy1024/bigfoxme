---
title: "Ultra X7 358H 笔记本电脑，本地部署 Qwen3.8-27B-Q4，实测生成速度 5.6 t/s"
published: 2026-09-29
tags:
- AI
- 本地部署
category: AI
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## 本地运行成功
全部部署成功后，双击桌面 “Qwen3.8-27B” 快捷方式：  
![llama-qwen38-q4-1](/images/posts/llama-qwen38-q4-1.png)

## 实测结果：5.6 t/s
随便输入一个问题，最后有速度统计：  
![llama-qwen38-q4-2](/images/posts/llama-qwen38-q4-2.png)


## 说明

> **目标机型**：Intel Core Ultra 处理器 + Arc 核显（无 NVIDIA 独显）的 Windows 11 电脑  
> **部署方案**：llama.cpp (SYCL) + Qwen3.8-27B-Q4 量化模型  
> **实测验证**：2026-09 于 Intel Core Ultra X7 358H + Arc B390 + 32GB DDR5-9600 平台完整部署成功  
> **文档用途**：相同/相似配置的电脑可按本文档从零复现完整部署  


## 硬件要求与选型分析

### 目标硬件配置（实测机型）

| 项目 | 规格 |
|------|------|
| CPU | Intel Core Ultra X7 358H（16 核，Panther Lake） |
| 内存 | 32GB DDR5-9600 |
| GPU | Intel Arc B390 核显（Xe3 架构，12 Xe 核心 / 96 EU，共享系统内存，GPU 可用约 17.6GB） |
| 系统 | Windows 11 家庭中文版 |
| 硬盘 | 需要约 45GB 可用空间（建议 SSD） |

### 关键约束：没有 NVIDIA 独显意味着什么

- **CUDA 生态完全不可用**，Ollama / vLLM 等多数工具的 GPU 加速默认走 CUDA
- Intel GPU 的加速路径只有三条：**SYCL**（llama.cpp）、**OpenVINO**（Intel 官方）、**DirectML**（通用但较慢）

### 推理方案对比与选型结论

| 方案 | GPU 加速 | 部署难度 | 性能 | 结论 |
|------|---------|---------|------|------|
| Ollama | Intel GPU 支持有限 | ⭐ 最简单 | 一般 | 不选 |
| llama.cpp + SYCL | ✅ 原生支持 level_zero | ⭐⭐⭐ 中等 | ✅ 最佳 | 选择 |
| OpenVINO | ✅ Intel 官方 | ⭐⭐ 中等 | 中等 | 备选 |

**选型结论：llama.cpp SYCL 后端 + level_zero:gpu 设备**，这是 Intel 核显跑大模型的最优路径。

### 模型选型（32GB 内存档位）

| 模型规模 | Q4 量化体积 | 可运行性 | 预估生成速度 |
|---------|-----------|---------|-------------|
| 7B-8B | ~5GB | ✅ 流畅 | 18-20 t/s |
| 13B-14B | ~9GB | ✅ 流畅 | 10-12 t/s |
| 27B (Qwen3.8) | 15.33GB | ✅ 可运行 | 5-6 t/s |
| 70B | ~40GB | ❌ 超出内存 | 不可行 |

**质量优先选 27B（本文档方案）**；速度优先选 14B/8B。模型文件可共存，随时切换。

### 实测性能（本方案最终结果）

| 指标 | 速度 | 说明 |
|------|------|------|
| pp128（批量预填充） | 55.76 t/s | 128 token 提示词约 2.3 秒读完 |
| tg64（token 生成） | 5.68 t/s | 约 4-5 汉字/秒，200 字回复约 40 秒 |

> 生成速度受限于核显共享内存带宽（物理瓶颈，非配置问题）。独显 RTX 4090 同模型约 30-40 t/s 仅作参照。


## 软件清单与安装位置

**所有软件统一安装到 D 盘 `D:\AI_Tools`，不占 C 盘：**

| 软件 | 安装位置 | 作用 | 安装方式 |
|------|---------|------|---------|
| Git (Portable) | `D:\AI_Tools\Git` | 源码管理 | 脚本自动 |
| CMake | `D:\AI_Tools\CMake` | 构建系统 | 脚本自动 |
| Intel oneAPI Base Toolkit | `D:\AI_Tools\Intel\oneAPI` | icx 编译器 + SYCL 运行时 | 手动安装 |
| VS Build Tools 2022 | `D:\AI_Tools\VS_BuildTools` | MSVC link.exe + Windows SDK（icx 硬依赖） | winget 自动 |
| Ninja | `D:\AI_Tools\ninja` | 构建执行器 | 脚本自动 |
| llama.cpp 源码 | `D:\AI_Tools\llama.cpp` | 推理引擎 | zip 解压 |
| Qwen3.8-27B 模型 | `D:\AI_Tools\models` | GGUF 量化模型 | 下载 |

最终目录结构：

```
D:\AI_Tools\
├── Git\                    # Git 便携版
├── CMake\                  # CMake 3.31.5
├── Intel\oneAPI\           # oneAPI Base Toolkit 2025.3
├── VS_BuildTools\          # VS Build Tools（含 MSVC 14.44）
├── ninja\                  # ninja.exe
├── llama.cpp\              # 源码 + build\bin\llama-cli.exe
├── models\                 # Qwen3.8-27B-UD-Q4_K_M.gguf (15.33GB)
├── start_qwen38.bat        # 对话启动脚本
└── bench_qwen38.bat        # 性能测试脚本
```


## 完整部署流程

> 按顺序执行，每步都有验证点。所有命令可直接复制粘贴到 PowerShell 运行。

### 步骤 1：创建目录结构

```powershell
New-Item -ItemType Directory -Force -Path "D:\AI_Tools\Git","D:\AI_Tools\CMake","D:\AI_Tools\Intel\oneAPI","D:\AI_Tools\ninja","D:\AI_Tools\llama.cpp","D:\AI_Tools\models","D:\AI_Tools\downloads" | Out-Null
```

### 步骤 2：安装 Git 便携版

```powershell
# 下载 PortableGit（约 50MB）
$GitUrl = "https://github.com/git-for-windows/git/releases/download/v2.47.1.windows.2/PortableGit-2.47.1.2-64-bit.7z.exe"
curl.exe -L -o "D:\AI_Tools\downloads\PortableGit.7z.exe" $GitUrl --progress-bar

# 自解压安装
Start-Process -FilePath "D:\AI_Tools\downloads\PortableGit.7z.exe" -ArgumentList '-o"D:\AI_Tools\Git" -y' -Wait

# 加入用户 PATH
$CurrentPath = [Environment]::GetEnvironmentVariable("Path", "User")
[Environment]::SetEnvironmentVariable("Path", "D:\AI_Tools\Git\cmd;$CurrentPath", "User")

# 基础配置
& "D:\AI_Tools\Git\cmd\git.exe" config --global init.defaultBranch "main"
& "D:\AI_Tools\Git\cmd\git.exe" config --global core.quotepath "false"
```

**✅ 验证**（新开 PowerShell 窗口）：`git --version` 输出版本号。

> ⚠️ GitHub 直连慢/失败时，给 URL 加国内镜像前缀：`https://ghfast.top/` + 原始 URL。

### 步骤 3：安装 CMake

```powershell
$CMakeUrl = "https://github.com/Kitware/CMake/releases/download/v3.31.5/cmake-3.31.5-windows-x86_64.zip"
curl.exe -L -o "D:\AI_Tools\downloads\cmake.zip" $CMakeUrl --progress-bar
Expand-Archive -Path "D:\AI_Tools\downloads\cmake.zip" -DestinationPath "D:\AI_Tools\downloads" -Force
Copy-Item -Path "D:\AI_Tools\downloads\cmake-3.31.5-windows-x86_64\*" -Destination "D:\AI_Tools\CMake" -Recurse -Force

$CurrentPath = [Environment]::GetEnvironmentVariable("Path", "User")
[Environment]::SetEnvironmentVariable("Path", "D:\AI_Tools\CMake\bin;$CurrentPath", "User")
```

**✅ 验证**（新开窗口）：`cmake --version`。

### 步骤 4：手动安装 Intel oneAPI Base Toolkit（唯一的必经手动步骤）

1. 浏览器打开：**https://www.intel.cn/content/www/cn/zh/developer/tools/oneapi/base-toolkit-download.html**
2. 选择 **Windows → Offline Installer**，下载（约 2.3GB）
3. 运行安装器，**安装路径必须改为**：`D:\AI_Tools\Intel\oneAPI`
4. 勾选组件：Intel C++ Compiler、DPC++/C++ Compiler、oneMKL（默认勾选即可）

**✅ 验证**：`Test-Path "D:\AI_Tools\Intel\oneAPI\compiler\latest\bin\icx.exe"` 返回 `True`。

### 步骤 5：安装 VS Build Tools（icx 的硬依赖，约 4GB）

> **重要**：icx 编译器在 Windows 上使用 MSVC 兼容模式，链接阶段必须调用 Visual Studio 的 `link.exe` 和 Windows SDK。没有它编译必然报错 `unable to find a Visual Studio installation`。

```powershell
winget install Microsoft.VisualStudio.2022.BuildTools --accept-source-agreements --accept-package-agreements --override "--quiet --wait --norestart --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended --installPath D:\AI_Tools\VS_BuildTools"
```

安装约 10-20 分钟。

**✅ 验证**：`Test-Path "D:\AI_Tools\VS_BuildTools\VC\Auxiliary\Build\vcvarsall.bat"` 返回 `True`。

### 步骤 6：安装 Ninja

```powershell
# 国内镜像下载（GitHub 直连易断）
$ninjaUrl = "https://ghfast.top/https://github.com/ninja-build/ninja/releases/download/v1.12.1/ninja-win.zip"
curl.exe -L -o "D:\AI_Tools\ninja\ninja.zip" $ninjaUrl --progress-bar
Expand-Archive -Path "D:\AI_Tools\ninja\ninja.zip" -DestinationPath "D:\AI_Tools\ninja" -Force
Remove-Item "D:\AI_Tools\ninja\ninja.zip"
```

**✅ 验证**：`& "D:\AI_Tools\ninja\ninja.exe" --version` 输出 `1.12.1`。

### 步骤 7：获取 llama.cpp 源码

两种方式任选：

**方式 A：zip 解压（国内推荐，git clone 很慢）**

```powershell
# 从 https://github.com/ggml-org/llama.cpp 页面下载 Source code (zip)
# 或用镜像：https://ghfast.top/https://github.com/ggml-org/llama.cpp/archive/refs/heads/master.zip
Expand-Archive -Path "D:\AI_Tools\llama.cpp-master.zip" -DestinationPath "D:\AI_Tools\temp_extract" -Force
Copy-Item -Path "D:\AI_Tools\temp_extract\llama.cpp-master\*" -Destination "D:\AI_Tools\llama.cpp" -Recurse -Force
Remove-Item "D:\AI_Tools\temp_extract" -Recurse -Force
```

**方式 B：git clone（网络好时）**

```powershell
Set-Location "D:\AI_Tools\llama.cpp"
git clone https://github.com/ggml-org/llama.cpp .
```

**✅ 验证**：`Test-Path "D:\AI_Tools\llama.cpp\CMakeLists.txt"` 返回 `True`。

### 步骤 8：编译 llama.cpp（SYCL 版）

> **核心要点（三个缺一不可）**：
> 1. 必须先加载 VS 环境（vcvarsall.bat）再加载 oneAPI 环境（setvars.bat）
> 2. CMake 必须显式指定 `-G "Ninja"`（默认 NMake 在本机不存在，直接报错）
> 3. 编译器和构建器路径都要在 PATH 中

```powershell
$OneAPIDir = "D:\AI_Tools\Intel\oneAPI"
$LlamaCppDir = "D:\AI_Tools\llama.cpp"
$vcvars = "D:\AI_Tools\VS_BuildTools\VC\Auxiliary\Build\vcvarsall.bat"

# 清理旧缓存（重编译时也需要）
Remove-Item "$LlamaCppDir\build" -Recurse -Force -ErrorAction SilentlyContinue

# 加载 VS + oneAPI 双环境到当前 PowerShell 进程
$envOutput = cmd /c "`"$vcvars`" amd64 >nul 2>&1 && call `"$OneAPIDir\setvars.bat`" >nul 2>&1 && set"
$envOutput | ForEach-Object {
    if ($_ -match "^([^=]+)=(.*)$") {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
    }
}
$env:PATH = "D:\AI_Tools\ninja;$env:PATH"

# 配置
Set-Location $LlamaCppDir
cmake -B build -G "Ninja" -DGGML_SYCL=ON -DCMAKE_C_COMPILER=icx -DCMAKE_CXX_COMPILER=icx -DCMAKE_BUILD_TYPE=Release

# 编译（约 4-10 分钟，496 个目标）
cmake --build build --config Release
```

**✅ 验证**：
```powershell
Test-Path "D:\AI_Tools\llama.cpp\build\bin\llama-cli.exe"   # True
# 检查 SYCL 是否识别到 GPU（关键！）
$env:PATH = "D:\AI_Tools\Intel\oneAPI\compiler\latest\bin;$env:PATH"
& "D:\AI_Tools\Intel\oneAPI\compiler\latest\bin\sycl-ls.exe"
```

`sycl-ls` 应输出（有 `level_zero:gpu` 行即成功）：

```
[level_zero:gpu][level_zero:0] Intel(R) oneAPI Unified Runtime over Level-Zero V2, Intel(R) Arc(TM) B390 GPU ...
[opencl:gpu][opencl:0] Intel(R) OpenCL Graphics, Intel(R) Arc(TM) B390 GPU ...
```

### 步骤 9：下载模型

> **⚠️ 关键坑：文件名必须带 UD 前缀！**
> `Qwen3.8-27B-UD-Q4_K_M.gguf`（UD = Unsloth Dynamic 动态量化）是正确文件名；
> 不带 UD 的 `Qwen3.8-27B-Q4_K_M.gguf` **不存在，会 404**（返回 145 字节错误页）。

```powershell
$ModelUrl = "https://modelscope.cn/models/unsloth/Qwen3.8-27B-GGUF/resolve/master/Qwen3.8-27B-UD-Q4_K_M.gguf"
$ModelFile = "D:\AI_Tools\models\Qwen3.8-27B-UD-Q4_K_M.gguf"

# 断点续传 + 自动重试（16GB 约 30-60 分钟）
for ($i = 1; $i -le 10; $i++) {
    curl.exe -L -o $ModelFile $ModelUrl --retry 3 --retry-delay 5 -C - --connect-timeout 30 --speed-time 60 --speed-limit 10240
    if ($LASTEXITCODE -eq 0) { break }
    Start-Sleep -Seconds 10
}
```

**✅ 验证**：文件大小约 **15.33GB**（小于 14GB 说明下载不完整，重跑上面的循环会断点续传）。

### 步骤 10：创建启动脚本

> **⚠️ 两个坑**：
> 1. 运行时必须用 `setvars.bat` 加载完整 oneAPI 环境——手工拼接 PATH 会缺 DLL，报 `0xC0000135`
> 2. 新版 llama.cpp 的 `--color` 参数必须带值：`--color auto`（裸传 `--color` 报错）

**对话启动脚本** `D:\AI_Tools\start_qwen38.bat`：

```bat
@echo off
REM Qwen3.8-27B - llama.cpp SYCL + Intel Arc GPU
call "D:\AI_Tools\Intel\oneAPI\setvars.bat" >nul 2>&1
set ONEAPI_DEVICE_SELECTOR=level_zero:gpu
cd /d "D:\AI_Tools\llama.cpp"
echo ========================================
echo Qwen3.8-27B (SYCL + Intel Arc B390)
echo Loading model, please wait...
echo ========================================
echo.
build\bin\llama-cli.exe -m "D:\AI_Tools\models\Qwen3.8-27B-UD-Q4_K_M.gguf" -ngl 99 -c 4096 --color auto %*
echo.
pause
```

**性能测试脚本** `D:\AI_Tools\bench_qwen38.bat`：

```bat
@echo off
call "D:\AI_Tools\Intel\oneAPI\setvars.bat" >nul 2>&1
set ONEAPI_DEVICE_SELECTOR=level_zero:gpu
cd /d "D:\AI_Tools\llama.cpp"
build\bin\llama-bench.exe -m "D:\AI_Tools\models\Qwen3.8-27B-UD-Q4_K_M.gguf" -ngl 99 -p 128 -n 64 2>&1
pause
```

**桌面快捷方式**（可选）：

```powershell
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Qwen3.8-27B.lnk")
$Shortcut.TargetPath = "D:\AI_Tools\start_qwen38.bat"
$Shortcut.WorkingDirectory = "D:\AI_Tools"
$Shortcut.IconLocation = "shell32.dll,13"
$Shortcut.Save()
```

### 步骤 11：验收测试

**1. 运行 bench_qwen38.bat**，正常结果：

```
Found 1 SYCL devices:
| 0| [level_zero:gpu:0]| Intel Arc B390 GPU| 30.0| 96| 1024| 32| 17677M| ...|

| model                    | size     | params | backend | ngl | test  | t/s        |
| qwen35 27B Q4_K - Medium | 15.32GiB | 27.32B | SYCL    | 99  | pp128 | 55.76±0.22 |
| qwen35 27B Q4_K - Medium | 15.32GiB | 27.32B | SYCL    | 99  | tg64  | 5.68±0.13  |
```

**2. 双击 start_qwen38.bat**，等待 1-2 分钟模型加载，出现提示符后输入问题即可对话。


## 日常使用

| 操作 | 方式 |
|------|------|
| 启动对话 | 双击桌面 "Qwen3.8-27B" 快捷方式 |
| 中断当前生成 | `Ctrl + C`（按 1 次中断回到提示符；快速 2 次退出） |
| 清空对话历史 | 提示符下输入 `/clear`（长对话变卡时用） |
| 退出 | `/exit` |
| 保存/恢复会话 | `/save 文件名` / `/load 文件名` |

### 常用启动参数
追加在 bat 的 llama-cli 命令后：  

| 参数 | 说明 |
|------|------|
| `-ngl 99` | 全部层放 GPU（保持默认） |
| `-c 2048` | 上下文长度减半，降低内存压力、加快响应 |
| `-n 256` | 限制单次最大生成 token 数 |
| `--single-turn` | 单轮问答后自动退出（脚本调用场景） |

### 性能参考
交互中会显示 `[ Prompt: x t/s | Generation: x t/s ]`。Generation 5-6 t/s 为本机正常水平；Prompt 速度低于 bench 的 pp128 属正常（逐 token vs 批量）。

### 上下文长度说明

启动脚本中 `-c 4096` 即当前上下文长度设置，含义与影响如下：

| 项目 | 数值 | 说明 |
|------|------|------|
| 当前设置 | 4096 tokens | 约能容纳 3000 字中文的对话历史 |
| 模型原生上限 | 262,144 tokens（256K） | 本地内存无法支撑，通过 -c 限制实际使用量 |
| 上下文耗尽表现 | 模型开始"遗忘"早期内容，且响应变慢 | 长对话后属正常现象 |

**调整方法**：编辑 `D:\AI_Tools\start_qwen38.bat`，修改 `-c` 值：

```bat
build\bin\llama-cli.exe -m "..." -ngl 99 -c 8192 --color auto %*
                                 ^^^^^^^^^ 改这里
```

| 调整方向 | 建议值 | 影响 |
|---------|--------|------|
| 调大 | `-c 8192` | 记住更多对话历史，但 KV 缓存占用更多 GPU 内存（27B 模型每翻倍约多 1-2GB），速度略降 |
| 调小 | `-c 2048` | 更省内存、响应更快，适合短问答场景 |

**实用建议**：无需盲目调大——长对话中感觉模型"忘事了"，直接输入 `/clear` 清空对话重来，比调大 `-c` 更省资源。


## 踩坑记录与故障排查（重要！）

按出错概率排序，新机器复现时优先对照：

### 坑 1：PowerShell 禁止运行 .ps1 脚本

```
无法加载文件 xxx.ps1，因为在此系统上禁止运行脚本
```

**解法**：`powershell -ExecutionPolicy Bypass -File .\xxx.ps1`，或先 `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` 再运行。不修改系统全局策略。

### 坑 2：.ps1 脚本含中文/特殊符号导致语法解析错误

UTF-8 无 BOM 的中文脚本被 PowerShell 5.1 按 GBK 解析，`✓`、`、`、中文提示串全部乱码并引发连锁语法错误（"Try 语句缺少 Catch"、"字符串缺少终止符"等）。

**解法**：脚本只用纯 ASCII 英文；或直接把代码粘贴进 PowerShell 窗口执行（不走文件）。

### 坑 3：CMake 报 `nmake: no such file or directory`

CMake 在 Windows 默认生成 NMake Makefiles，但系统没有 nmake。

**解法**：配置时显式指定 `-G "Ninja"`，并确保 `ninja.exe` 在 PATH。

### 坑 4：icx 报 `unable to find a Visual Studio installation` / `linker command failed`

icx 的 MSVC 兼容模式需要 VS 的 link.exe + Windows SDK。

**解法**：安装 VS Build Tools（见步骤 5），且编译前必须先运行 `vcvarsall.bat amd64`，再 `setvars.bat`，顺序不能反。

### 坑 5：GitHub 直连下载中断（ninja/cmake/llama.cpp 源码）

国内网络直连 GitHub 经常 `Remote end closed connection`。

**解法**：URL 前加镜像前缀 `https://ghfast.top/`（备用 `https://gh-proxy.com/`）；llama.cpp 源码直接下载 zip 解压代替 git clone。

### 坑 6：模型下载 404（下载文件只有几百字节）

文件名错误。Qwen3.8-27B 的 GGUF 量化文件**必须带 UD 前缀**（Unsloth Dynamic），如 `Qwen3.8-27B-UD-Q4_K_M.gguf`。

**解法**：用 ModelScope API 先查真实文件列表：
`https://modelscope.cn/api/v1/models/unsloth/Qwen3.8-27B-GGUF/repo/files`

### 坑 7：llama-cli 启动闪退，退出码 -1073741515 (0xC0000135)

SYCL 运行时 DLL 未找到——手工拼 PATH 缺 DLL。

**解法**：启动脚本必须用 `call setvars.bat` 加载完整 oneAPI 环境，不要手工拼 PATH。

### 坑 8：`error: invalid argument: -no-cnv` / `expected value for argument "--color"`

新版 llama.cpp 参数变更。

**解法**：`-no-cnv` 已移除，单轮模式用 `--single-turn`；`--color` 必须带值 `--color auto`。

### 坑 9：沙箱/受限环境内存预算不足

在受限执行环境里测试 15.33GB 模型时，进程树内存超 15.8GB 预算被杀。这不是部署问题。

**解法**：验收测试直接在用户桌面环境双击 bat 运行（32GB 物理内存无此限制）。

### 坑 10：llama.cpp 源码目录写入被拒（ACL）

用户手动解压创建的目录可能 ACL 受限，导致某些工具进程无法写入。

**解法**：对该目录操作时以实际用户权限执行；或用管理员 PowerShell 操作。


## 附录

### 版本信息（实测通过的组合）

| 组件 | 版本 |
|------|------|
| Windows 11 | 26200 |
| Intel oneAPI Base Toolkit | 2025.3（icx 2025.3.3） |
| VS Build Tools 2022 | MSVC 14.44.35207 |
| CMake | 3.31.5 |
| Ninja | 1.12.1 |
| Git | 2.47.1 |
| llama.cpp | master（2026-09，v0.5.0-dev） |
| 模型 | Qwen3.8-27B-UD-Q4_K_M (Unsloth, 15.33GB) |

### 备选模型（同平台可直接复用本部署）

| 模型 | 下载源（ModelScope） | 体积 | 预估生成速度 |
|------|---------------------|------|-------------|
| Qwen3.8-27B-UD-Q4_K_M | `unsloth/Qwen3.8-27B-GGUF` | 15.33GB | ~5.7 t/s（本文档方案） |
| Qwen3.8-27B-UD-IQ4_XS | `unsloth/Qwen3.8-27B-GGUF` | ~12GB | ~7 t/s |
| Qwen3-32B-UD-Q4_K_M | `unsloth/Qwen3-32B-GGUF` | ~19GB | 较慢（近内存上限，慎选） |
| Qwen3-14B（更快） | `unsloth/Qwen3-14B-GGUF` 系列 | ~9GB | ~11 t/s |
| Qwen3-8B（最快） | `unsloth/Qwen3-8B-GGUF` 系列 | ~5GB | ~19 t/s |

换模型只需：下载新 gguf 到 `D:\AI_Tools\models`，把启动脚本里 `-m` 的路径改掉即可，其余环境完全复用。

### 更新维护

```powershell
# 更新 llama.cpp：下载新 zip 覆盖解压后，重复步骤 8（先删 build 目录）
# 更新 Intel GPU 驱动：Intel Driver & Support Assistant 或荣耀/品牌官网

# 完全卸载
Remove-Item -Recurse -Force D:\AI_Tools
Remove-Item "$env:USERPROFILE\Desktop\Qwen3.8-27B.lnk"
# 再从 PATH 环境变量中删除 D:\AI_Tools 相关条目
```

*文档生成：2026-09-29，基于一次完整的真实部署过程整理。*
