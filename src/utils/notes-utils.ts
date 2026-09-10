import fs from "node:fs";
import path from "node:path";

export const NOTES_PAGE_SIZE = 10;

export interface Note {
  date: string;
  weekday: string;
  time: string;
  content: string;
  images: string[];
  tags: string[];
}

export interface DayGroup {
  date: string;
  weekday: string;
  notes: Note[];
}

export function parseNotes(): DayGroup[] {
  const memoriaDir = path.resolve("src/content/Memoria");
  const mdFiles = fs.readdirSync(memoriaDir).filter((f) => f.endsWith(".md"));

  const notes: Note[] = [];

  for (const file of mdFiles) {
    const raw = fs.readFileSync(path.join(memoriaDir, file), "utf-8");
    const dayBlocks = raw.split(/(?=^## \d{4}-\d{2}-\d{2})/m);

    for (const block of dayBlocks) {
      const dayMatch = block.match(/^## (\d{4}-\d{2}-\d{2})\s+(.*)/m);
      if (!dayMatch) continue;
      const date = dayMatch[1];
      const weekday = dayMatch[2];

      const memoBlocks = block.split(/(?=^- \d{1,2}[:.]\d{2})/m);
      for (const memo of memoBlocks) {
        const memoMatch = memo.match(/^- (\d{1,2}[:.]\d{2})\s*\n?([\s\S]*)/m);
        if (!memoMatch) continue;
        const time = memoMatch[1];
        let content = memoMatch[2].trim();
        const images: string[] = [];
        const imageRegex = /!\[\[([^\]]+)\]\]/g;
        let match;
        while ((match = imageRegex.exec(content)) !== null) {
          images.push(`/memoria-attachments/${match[1]}`);
        }
        content = content.replace(/!\[\[[^\]]+\]\]/g, "").trim();
        // 提取 #标签
        const tags: string[] = [];
        const tagRegex = /#([\w一-鿿-]+)/g;
        let tagMatch;
        while ((tagMatch = tagRegex.exec(content)) !== null) {
          tags.push(tagMatch[1]);
        }
        content = content
          .replace(/#[\w一-鿿-]+/g, "")
          .replace(/^ +/gm, "")
          .replace(/\n{3,}/g, "\n\n")
          .trim();
        // 提取 Markdown 链接 [text](url)
        const mdLinks: string[] = [];
        content = content.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (_, text, url) => {
          const anchor =
            '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' +
            text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") +
            "</a>";
          mdLinks.push(anchor);
          return "\x00MDLINK" + (mdLinks.length - 1) + "\x00";
        });
        // 裸 URL 转链接，再转义其余 HTML
        content = content.replace(/(https?:\/\/[^\s<)]+)/g, "\x00LINK\x00$1\x00/LINK\x00");
        content = content
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        content = content.replace(
          /\x00LINK\x00([^\x00]+)\x00\/LINK\x00/g,
          '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
        );
        // 恢复 Markdown 链接
        content = content.replace(/\x00MDLINK(\d+)\x00/g, (_, i) => mdLinks[parseInt(i, 10)]);
        // 加粗 **text**
        content = content.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
        notes.push({ date, weekday, time, content, images, tags });
      }
    }
  }

  notes.sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));

  // 按日期分组
  const grouped = new Map<string, Note[]>();
  for (const note of notes) {
    if (!grouped.has(note.date)) grouped.set(note.date, []);
    grouped.get(note.date)!.push(note);
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, dayNotes]) => ({ date, weekday: dayNotes[0].weekday, notes: dayNotes }));
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}月${day}日`;
}
