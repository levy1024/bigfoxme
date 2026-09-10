# -*- coding: utf-8 -*-
"""将 jekyll-export 目录下的 WordPress 导出文章转换为本项目 Astro 文章格式。

转换规则:
- frontmatter: title / date->published / categories->category(首个)+tags / tags->tags / description
- 正文: 去除 `\` 转义 (`\##`->`##` 等), HTML 实体解码 (&amp; &lt; &gt; &quot; &#39;)
- 输出: 按 category 建子目录, 文件名用标题生成 slug + 日期前缀
- 草稿(_drafts): 输出到草稿对应目录, draft: true
"""
import html
import os
import re
import sys
from collections import defaultdict

sys.stdout.reconfigure(encoding="utf-8")

SRC = os.path.join(os.environ.get("TEMP", "/tmp"), "jekyll-export-backup")
DEST = "src/content/posts"

# ---------- 中文标点归一化后去空白, 用于判断分类 ----------
def clean(s: str) -> str:
    # 去掉首尾空白和首尾引号
    s = s.strip().strip("'\"")
    # 统一引号为中文引号, 方便与 categories 比较
    return s.replace('"', "“").replace("'", "”")

def parse_yaml_list_block(lines, start_idx):
    """解析 YAML list 块: 从 start_idx 开始, 形如 `- 值`, 返回 (值列表, 结束下标)"""
    vals = []
    i = start_idx
    while i < len(lines) and re.match(r"^\s+-\s+", lines[i]):
        v = lines[i].strip()
        v = re.sub(r"^-\s*", "", v)
        # 去除 YAML 引号包裹
        if len(v) >= 2 and v[0] in "'\"" and v[-1] == v[0]:
            v = v[1:-1]
        vals.append(v)
        i += 1
    return vals, i

def slugify(title: str) -> str:
    """将标题转为适合做文件名的 slug。保留中文, 转英文为小写连字符, 去非法字符。"""
    s = title.strip()
    # 常见全角/特殊字符替换为连字符
    s = s.replace("：", ":").replace("“", '"').replace("”", '"')
    s = re.sub(r"[【】\[\]（）()<>《》\"'.,!?！？、/\\:：;；*|#]", "-", s)
    s = re.sub(r"[-_\s]+", "-", s)
    s = s.strip("-").strip()
    # 英文转小写（仅对纯英文部分）
    s = re.sub(r"[A-Za-z]+", lambda m: m.group(0).lower(), s)
    return s

def clean_body(body: str) -> str:
    """去除 WP 转义符并解码 HTML 实体。"""
    # 先去掉转义反斜杠: `\#` `\*` `\[` `\]` `\(` `\)` 等 (保留真正的代码中的反斜杠需谨慎,
    # 但 WP 导出里 `\` 几乎都是 markdown 转义, 统一移除)。
    body = re.sub(r"\\([#*\[\]()_>`~+\-])", r"\1", body)
    # HTML 实体解码
    body = html.unescape(body)
    return body


# 句子结束标点(中文优先): 在这些标点后断行。
SENT_END = re.compile(r"(?<=[。！？；：!?;])")
# 不在此类场景断行(避免破坏代码、链接、行内代码、序号等)
def should_not_break(segment: str) -> bool:
    s = segment
    # 若该段落在代码块/行内代码内, 不断行(由外层块级判断处理)
    if s.lstrip().startswith(("```", "~~~")):
        return True
    # 若段落是列表项/标题/引用/分割线开头, 不断行
    if re.match(r"^\s{0,3}([-*+] |\d+\. |#{1,6} |>|---|\*\*\*)", s):
        return True
    # 若句子非常短(如 "1." "2."), 可能只是序号
    if len(s.strip()) <= 4:
        return True
    return False


def reflow_paragraph(para: str) -> str:
    """将单个超长段落按句子边界重建为多行。

    - 段落内可能包含行内代码/链接/HTML标签等, 用占位符保护它们, 避免误拆。
    - 句子结束标点后加换行, 保留原段落语义。
    """
    # 保护行内代码 `...` 与链接 [..](..) 与行内 HTML <..>
    tokens = []
    protect_re = re.compile(r"(`[^`]*`|\[[^\]]*\]\([^)]*\)|<[^>]+>)")
    parts = protect_re.split(para)
    for idx, part in enumerate(parts):
        if idx % 2 == 1:
            tokens.append(("\x00TOKEN%d\x00" % len(tokens), part))
        else:
            tokens.append((None, part))

    # 重组: 把被保护 token 还原, 并在句子边界处插入换行
    sentences = []
    cur = ""
    # 逐个片段累积, 遇到句子结束标点(属于普通文本)则断句
    for marker, part in tokens:
        if marker is not None:
            cur += marker
            continue
        frags = SENT_END.split(part)
        for i, f in enumerate(frags):
            cur += f
            if i < len(frags) - 1 and f and not should_not_break(cur):
                sentences.append(cur)
                cur = ""
    if cur:
        sentences.append(cur)

    # 还原 token
    token_map = {m: t for m, t in tokens if m}
    restored = []
    for s in sentences:
        for m, t in token_map.items():
            s = s.replace(m, t)
        restored.append(s.strip())

    # 去掉可能的空句子
    restored = [r for r in restored if r]
    return "\n".join(restored)


FENCE_RE = re.compile(r"^\s*(```+|~~~+)")

TABLE_RE = re.compile(r"^\s*\|?.*\|\s*$")


def reflow_table_line(line: str) -> str:
    """把 WP 压成单行的 markdown 表格拆回多行。

    WP 导出的表格形如(全挤在一行):
    `## 标题 |列1 |列2 |列3 | | :--- | :--- | :--- | |值1 |值2 |值3 | |值4 |值5 |值6 |`
    单元格间用 `|` 分隔, 分隔行是 `:---` 单元格。

    策略: 按 `|` 拆出所有片段, 每段 strip 后作为单元格。由于 WP 把每行结尾的 `|`
    也保留了, 片段序列是 [行1内容..., 行2内容..., ...] 的交错。但无法可靠区分"行边界",
    因此采用启发式: 遇到 `:---`(或 `---`) 单元格即认为是分隔行, 将后续单元格分组为数据行。
    """
    s = line.strip()
    # 行首标题 `## xxx ` 单独保留
    head = None
    m = re.match(r"^(#{1,6}\s+[^|]{1,40}?)\s*\|", s)
    if m:
        head = m.group(1).strip()
        s = s[m.end():]

    # 拆单元格
    cells = [c.strip() for c in s.split("|")]

    # 找到连续分隔行单元格 `:---`/`---` 的位置范围(可能是多个)
    sep_start = None
    sep_end = None
    for i, c in enumerate(cells):
        if re.fullmatch(r":?-{3,}:?", c):
            if sep_start is None:
                sep_start = i
            sep_end = i + 1
        else:
            if sep_start is not None:
                break
    if sep_start is None:
        # 不是真表格, 原样返回
        return line

    # 表头: 分隔行之前的所有单元格
    header = [c for c in cells[:sep_start] if c]
    # 数据: 分隔行之后的所有单元格(去掉残留的 `:---`)
    rest = [c for c in cells[sep_end:] if c and not re.fullmatch(r":?-{3,}:?", c)]
    ncol = len(header) if header else (len(rest) // 2 if rest else 1)
    if ncol == 0:
        ncol = 1

    out = []
    if head:
        out.append(head)
    if header:
        out.append("| " + " | ".join(header) + " |")
        out.append("| " + " | ".join("---" for _ in header) + " |")
    # 数据行
    for i in range(0, len(rest), ncol):
        row = rest[i : i + ncol]
        if row:
            out.append("| " + " | ".join(row) + " |")
    return "\n".join(out)


def reflow_body(body: str) -> str:
    """对整个正文重建换行: 按行扫描, 代码块/表格/HTML块/列表/标题保持原样。

    WP 导出常把整段(含代码块)压成单行, 因此这里不依赖行首锚定,
    而是扫描整个文本: 一旦发现 fence 标记, 进入代码块模式, 直到出现闭合 fence。
    """
    # 先把 ` ``` ` 这些 fence 标记前后补换行, 让它们独立成行, 便于块级判断。
    # 仅当 fence 不在行首时插入换行; 已是独立行则不动。
    def _protect_fences(text: str) -> str:
        # 匹配 ``` 或 ~~~ 围栏(3个以上), 前后若紧贴非空白则补换行
        return re.sub(r"(?<!\n)(```+|~~~+)", r"\n\1", text)

    body2 = _protect_fences(body)

    out_lines = []
    in_code = False
    code_buf = []
    lines = body2.split("\n")
    for line in lines:
        stripped = line.strip()
        m = FENCE_RE.match(line)
        if m:
            if in_code:
                # 闭合
                code_buf.append(line)
                out_lines.append("\n".join(code_buf))
                code_buf = []
                in_code = False
            else:
                in_code = True
                code_buf = [line]
            continue
        if in_code:
            code_buf.append(line)
            continue

        # 普通文本行处理
        # 表格行(含 | 和 --- ) 或 HTML 块标签 保持原样
        if re.match(r"^\s*\|.*\|\s*$", line) or re.match(r"^\s*<\w+", line):
            out_lines.append(line)
            continue
        # 被压成单行的表格: 仅当行首是 `## 标题 |` 或 `|` 开头的规整表格才重建,
        # 排除 AI 对话流(以 `**` 开头) — 那些 `|` 是正文内容, 强拆会破坏。
        stripped_line = line.strip()
        is_table_head = re.match(r"^#{1,6}\s+[^|]{1,40}?\s*\|", stripped_line)
        is_pipe_start = stripped_line.startswith("|")
        is_dialog = stripped_line.startswith("**") or "**说明：" in stripped_line[:20]
        if (is_table_head or is_pipe_start) and not is_dialog and re.search(r"\|[^\|]*:?-{3,}:?", line) and line.count("|") >= 3:
            rebuilt = reflow_table_line(line)
            out_lines.append(rebuilt)
            continue
        # 标题/列表项/引用/分割线/序号: 保持原样
        if re.match(r"^\s{0,3}(#{1,6}\s|[-*+]\s|\d+\.\s|>\s|---|\*\*\*)", line):
            out_lines.append(line)
            continue

        # 普通段落行: 若超长则按句子断行
        if len(line.strip()) > 500:
            out_lines.append(reflow_paragraph(line.strip()))
        else:
            out_lines.append(line)

    if in_code:
        # fence 未闭合(原数据本身如此), 直接追加
        out_lines.append("\n".join(code_buf))

    # 重新拼接, 清理多余空行(但保留代码块内空行)
    result = "\n".join(out_lines)
    result = re.sub(r"\n{3,}", "\n\n", result)
    return result.strip()

def main():
    os.makedirs(DEST, exist_ok=True)

    stats = defaultdict(int)

    def process_files(src_dir, dest_dir, is_draft):
        for fname in sorted(os.listdir(src_dir)):
            if not fname.endswith(".md"):
                continue
            fpath = os.path.join(src_dir, fname)
            with open(fpath, "r", encoding="utf-8") as f:
                text = f.read()

            # 提取 frontmatter 块
            if not text.startswith("---"):
                print(f"[跳过] 无 frontmatter: {fpath}")
                continue
            end_fm = text.find("\n---", 3)
            if end_fm == -1:
                print(f"[跳过] frontmatter 未闭合: {fpath}")
                continue
            fm_text = text[3:end_fm]
            body_raw = text[end_fm + 4 :]
            lines = fm_text.split("\n")

            fm = {}
            i = 0
            while i < len(lines):
                line = lines[i]
                m = re.match(r"^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$", line)
                if not m:
                    i += 1
                    continue
                key, val = m.group(1), m.group(2).strip()
                if val:
                    fm[key] = val.strip().strip("'\"")
                    i += 1
                else:
                    # 可能是 list 块
                    vals, i = parse_yaml_list_block(lines, i + 1)
                    fm[key] = vals if vals else ""
                    continue

            title = fm.get("title")
            if isinstance(title, list) and title:
                title = title[0]
            if not title:
                title = os.path.splitext(fname)[0]
            date = fm.get("date", "")[:10]  # 取日期部分
            description = fm.get("description", "")
            if isinstance(description, list) and description:
                description = description[0]
            if not isinstance(description, str):
                description = ""
            categories = fm.get("categories") or []
            tags = fm.get("tags") or []

            # categories 首项作为 category, 其余并入 tags
            category = ""
            if isinstance(categories, list) and categories:
                category = clean(categories[0])
            if isinstance(tags, str) and tags:
                tags = [tags]
            extra_tags = list(categories[1:]) if isinstance(categories, list) else []
            all_tags = list(tags) + extra_tags
            all_tags = [t for t in all_tags if t]

            # 生成目标文件名: 日期-标题slug.md
            slug = slugify(title)
            out_fname = f"{date}-{slug}.md"
            # 分类目录
            cat_dir = clean(category) if category else "未分类"
            cat_dir = cat_dir if cat_dir else "未分类"
            out_dir = os.path.join(dest_dir, cat_dir)
            os.makedirs(out_dir, exist_ok=True)
            out_path = os.path.join(out_dir, out_fname)

            # 处理标题引号
            title_clean = title.strip()
            if '"' in title_clean:
                title_clean = title_clean.replace('"', '\\"')

            body = clean_body(body_raw).strip()
            body = reflow_body(body)

            # 组装新 frontmatter
            # 注意: schema 中 updated/description/image 是可选字段,
            # 空值必须整体省略(写成 `updated: ` 会被解析为 null 而报错)
            lines_out = ["---"]
            lines_out.append(f'title: "{title_clean}"')
            lines_out.append(f"published: {date}")
            lines_out.append(f"draft: {'true' if is_draft else 'false'}			# true=草稿不显示，false=公开")
            lines_out.append(f"pinned: false		# true=置顶")
            if description:
                desc_clean = description.strip().replace('"', '\\"')
                lines_out.append(f"description: \"{desc_clean}\"")
            if all_tags:
                lines_out.append("tags:")
                for t in all_tags:
                    t = t.strip().replace('"', '\\"')
                    lines_out.append(f"- {t}")
            lines_out.append(f"category: \"{category}\"" if category else "category: \"未分类\"")
            lines_out.append("---")
            lines_out.append("")
            lines_out.append(body)
            lines_out.append("")

            with open(out_path, "w", encoding="utf-8") as f:
                f.write("\n".join(lines_out))

            stats["total"] += 1
            stats[f"cat:{cat_dir}"] += 1
            print(f"[OK] {cat_dir}/{out_fname}")

    process_files(os.path.join(SRC, "_posts"), DEST, is_draft=False)
    process_files(os.path.join(SRC, "_drafts"), DEST, is_draft=True)

    print("\n===== 汇总 =====")
    for k in sorted(stats):
        print(f"{k}: {stats[k]}")

if __name__ == "__main__":
    main()
