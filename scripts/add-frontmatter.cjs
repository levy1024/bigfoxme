const fs = require('fs');
const path = require('path');

const postsDir = 'src/content/posts';

// 获取今天的日期
function getDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

// 从文章内容中提取第一张图片
function extractFirstImage(content) {
	// 匹配 ![](图片URL) 格式
	const match = content.match(/!\[.*?\]\((.*?)\)/);
	if (match && match[1]) {
		return match[1].trim();
	}
	return '';
}

// 从文章内容中提取第一张图片（忽略 frontmatter）
function extractFirstImageIgnoreFrontmatter(content) {
	// 找到 frontmatter 结束的位置
	const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/m);
	if (match && match[1]) {
		const bodyContent = match[1];
		return extractFirstImage(bodyContent);
	}
	// 如果没有 frontmatter，直接提取
	return extractFirstImage(content);
}

// 检查文章内容是否为空（frontmatter 之后的内容）
function hasPostContent(content) {
	// 找到 frontmatter 结束后的内容
	const match = content.match(/^---[\s\S]*?---\n([\s\S]*)$/m);
	if (match && match[1]) {
		// 检查是否有实际内容（不只是空白字符）
		return match[1].trim().length > 0;
	}
	return false;
}

// 根据文件夹路径生成 frontmatter
function generateFrontmatter(folderName, imageUrl = '') {
	let category = '';
	// 根据文件夹名称设置分类
	if (folderName === 'Technical') {
		category = 'Technical';
	} else if (folderName === 'Software') {
		category = 'Software';
	} else if (folderName === 'AIHacks') {
		category = 'AIHacks';
	} else if (folderName === 'Workflow') {
		category = 'Workflow';
	} else if (folderName === 'Xenia') {
		category = 'Xenia';
	} else {
		category = ''; // 其他文件夹留空，让用户手动填写
	}

	// 如果有图片，添加 image 字段
	const imageLine = imageUrl ? `image: ${imageUrl}\n` : '';

	return `---
title:
published: ${getDate()}
tags: []
category: ${category}
draft: false
pinned: false
${imageLine}---
`;
}

// 获取所有 md 文件
function getAllFiles(dir, files = []) {
	fs.readdirSync(dir).forEach(f => {
		const p = path.join(dir, f);
		if (fs.statSync(p).isDirectory()) {
			getAllFiles(p, files);
		} else if (f.endsWith('.md')) {
			files.push(p);
		}
	});
	return files;
}

// 主逻辑
console.log('检查文章文件...\n');

const files = getAllFiles(postsDir);
let modifiedCount = 0;

files.forEach(filePath => {
	const relativePath = path.relative(postsDir, filePath);
	let content = fs.readFileSync(filePath, 'utf-8');

	// 检查是否已有 frontmatter
	const hasFrontmatter = content.trimStart().startsWith('---');

	// 检查是否已有 image 字段
	const hasImage = /^image:\s*\S/m.test(content);

	// 提取文章正文中的第一张图片（忽略 frontmatter）
	const imageUrl = extractFirstImageIgnoreFrontmatter(content);

	if (!hasFrontmatter) {
		// 完全没有 frontmatter，全部添加
		const folderName = path.basename(path.dirname(filePath));
		const frontmatter = generateFrontmatter(folderName, imageUrl);
		const newContent = frontmatter + '\n' + content;
		fs.writeFileSync(filePath, newContent, 'utf-8');

		let info = '';
		if (folderName === 'Technical' || folderName === 'Software' || folderName === 'AIHacks' || folderName === 'Workflow' || folderName === 'Xenia') {
			info = `[分类: ${folderName}]`;
		} else {
			info = '[未识别分类，请手动填写]';
		}

		if (imageUrl) {
			console.log(`✅ ${relativePath} - 已添加 frontmatter ${info} [已提取封面图]`);
		} else {
			console.log(`✅ ${relativePath} - 已添加 frontmatter ${info} [无图片，请手动填写]`);
		}
		console.log(`   ↳ 请在 Typora 中按 Ctrl+S 保存，然后关闭文件重新打开查看`);
		modifiedCount++;
	} else if (!hasImage) {
		// 已有 frontmatter 但没有 image 字段，补充 image 字段
		
		if (imageUrl) {
			// 有图片，添加到 pinned: false 后面
			if (content.includes('pinned: false')) {
				content = content.replace('pinned: false', 'pinned: false\nimage: ' + imageUrl);
			} else if (content.includes('pinned: true')) {
				content = content.replace('pinned: true', 'pinned: true\nimage: ' + imageUrl);
			} else {
				// 兜底：在 --- 后面添加
				content = content.replace(/^---\n/, '---\nimage: ' + imageUrl + '\n');
			}
			fs.writeFileSync(filePath, content, 'utf-8');
			console.log(`✅ ${relativePath} - 已补充封面图 ${imageUrl}`);
		} else {
			// 无图片，添加空的 image 字段
			if (content.includes('pinned: false')) {
				content = content.replace('pinned: false', 'pinned: false\nimage: ');
			} else if (content.includes('pinned: true')) {
				content = content.replace('pinned: true', 'pinned: true\nimage: ');
			} else {
				// 兜底：在 --- 后面添加
				content = content.replace(/^---\n/, '---\nimage: \n');
			}
			fs.writeFileSync(filePath, content, 'utf-8');
			console.log(`✅ ${relativePath} - 已添加 image 字段 [无图片，请手动填写]`);
		}
		console.log(`   ↳ 请在 Typora 中按 Ctrl+S 保存，然后关闭文件重新打开查看`);
		modifiedCount++;
	} else {
		console.log(`⏭️  ${relativePath} - 已有 frontmatter 和 image，跳过`);
	}
});

console.log(`\n完成！共修改了 ${modifiedCount} 个文件`);
console.log('Error: (none)');
