const fs = require('fs');
const path = require('path');

const sourceDir = 'D:/blog/blog/article';
const targetDir = 'src/content/posts';

const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);

  // 读取原始内容
  let content = fs.readFileSync(sourcePath, 'utf-8');

  // 提取第一张图片URL（必须是有效的URL格式）
  let coverImage = '';
  const imgMatch = content.match(/!\[.*?\]\(([^)]+)\)/i);
  if (imgMatch) {
    const url = imgMatch[1].split(/\s+/)[0];
    // 只接受 http://, https://, 或 / 开头的URL
    if (url.match(/^https?:\/\//) || url.match(/^\//)) {
      coverImage = url;
    }
  }

  // 提取标题（优先使用文件名）
  let title = file.replace('.md', '');
  const lines = content.split('\n');
  for (const line of lines) {
    // 跳过引用行
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('>')) continue;

    if (trimmedLine.startsWith('# ')) {
      const extractedTitle = trimmedLine.replace(/^#\s+/, '').trim();
      // 只使用看起来像真实标题的文本（排除无效标题）
      const invalidTitles = ['任务目标', '标题', '任务', '元数据', '安装前必读', '文章结构', '默认标题', 'Title'];
      if (extractedTitle && !invalidTitles.some(invalid => extractedTitle.includes(invalid))) {
        title = extractedTitle;
      }
      break;
    }
  }

  // 从内容开头提取摘要（确保是单行且安全）
  let contentStart = content.replace(/^#.*$/m, '').trim();

  // 移除所有 > 开头的引用行
  contentStart = contentStart.split('\n')
    .filter(line => !line.trim().startsWith('>'))
    .join('\n')
    .trim();

  const firstPara = contentStart.split('\n\n')[0]
    .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
    .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
    .replace(/[*_`#]/g, '') // 移除 markdown 符号
    .replace(/\n/g, ' ') // 换行转空格
    .replace(/\s+/g, ' ') // 多个空格转单个
    .replace(/"/g, "'") // 双引号转单引号（避免YAML问题）
    .trim();

  // 确保描述为空或有效
  let description = firstPara.substring(0, 80);
  if (firstPara.length > 80) description += '...';
  if (!description || description.length < 5) {
    description = '这是一篇关于' + title + '的文章';
  }

  // 根据文件内容推断标签
  let tags = ['效率工具'];
  let category = '效率工具';

  if (content.includes('Claude') || content.includes('AI')) {
    tags.push('AI');
    tags.push('Claude');
  }
  if (content.includes('Windows')) {
    tags.push('Windows');
  }
  if (content.includes('Typora')) {
    tags.push('Typora');
  }

  // 构建 frontmatter
  let frontmatter = `---
title: ${title}
published: ${new Date().toISOString()}
description: ${description}
tags: ${JSON.stringify(tags)}
category: ${category}
draft: false
lang: zh_CN
`;

  // 如果有封面图，添加到 frontmatter
  if (coverImage) {
    frontmatter += `\nimage: ${coverImage}`;
  }

  frontmatter += `\n---\n\n`;

  // 写入新文件
  fs.writeFileSync(targetPath, frontmatter + content);
  console.log(`Processed: ${file}${coverImage ? ' (with cover)' : ' (no cover)'}`);
});

console.log('All posts processed!');
