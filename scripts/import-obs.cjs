const fs = require('fs');
const path = require('path');

const sourceFile = 'D:/blog/blog/article/OBS摄像头一键移动插件';
const targetFile = 'src/content/posts/OBS摄像头一键移动插件.md';

// 读取原始内容
let content = fs.readFileSync(sourceFile, 'utf-8');

// 提取标题
const title = 'OBS摄像头一键移动插件';

// 从内容开头提取摘要
const firstPara = content.split('\n\n')[0].replace(/!\[.*?\]\(.*?\)/g, '').replace(/[*_`]/g, '').trim();
let description = firstPara.substring(0, 100);
if (firstPara.length > 100) description += '...';

// 标签和分类
const tags = ['OBS', '直播', '录课', '效率工具'];
const category = '效率工具';

// 构建 frontmatter
const frontmatter = `---
title: ${title}
published: ${new Date().toISOString()}
description: ${description}
tags: ${JSON.stringify(tags)}
category: ${category}
draft: false
lang: zh_CN
---

`;

// 写入新文件
fs.writeFileSync(targetFile, frontmatter + content);
console.log(`Processed: OBS摄像头一键移动插件.md`);
console.log('All posts processed!');
