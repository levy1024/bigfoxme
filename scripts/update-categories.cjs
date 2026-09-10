const fs = require('fs');
const path = require('path');

const postsDir = 'src/content/posts';

// 分类规则（优先级从高到低）
const categoryRules = [
    {
        category: 'AI新鲜玩法',
        keywords: ['Claude', 'ChatGPT', 'GPT', '提示词', '提示工程', '大语言模型', 'LLM', 'AIGC'],
        exclude: []
    },
    {
        category: '技术教程',
        keywords: ['教程', '部署', '搭建', '安装使用', '安装配置', '完整指南', '使用教程', '从零开始'],
        exclude: ['快捷键', '配置参考']
    },
    {
        category: '软件安利',
        keywords: ['Typora', 'PicList', 'Listary', 'PixPin', 'AutoHotkey', 'Passkeys', '快捷键', '图床', '截图', '打包', '安利', '工具', '企业邮', '域名邮箱', '油管', '影视库'],
        exclude: []
    }
];

function getCategory(title, content) {
    const text = (title + ' ' + content).toLowerCase();

    for (const rule of categoryRules) {
        // 检查是否包含关键词
        const hasKeyword = rule.keywords.some(keyword => text.includes(keyword.toLowerCase()));

        // 检查是否包含排除词
        const hasExclude = rule.exclude.some(exclude => text.includes(exclude.toLowerCase()));

        if (hasKeyword && !hasExclude) {
            return rule.category;
        }
    }

    return '技术教程'; // 默认分类
}

// 读取所有文章
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

console.log(`开始更新 ${files.length} 篇文章的分类...\n`);

files.forEach(file => {
    const filePath = path.join(postsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    let inFrontmatter = false;
    let frontmatterStart = -1;
    let frontmatterEnd = -1;

    // 找到 frontmatter 的开始和结束位置
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '---') {
            if (frontmatterStart === -1) {
                frontmatterStart = i;
                inFrontmatter = true;
            } else {
                frontmatterEnd = i;
                break;
            }
        }
    }

    if (frontmatterStart === -1 || frontmatterEnd === -1) {
        console.log(`✗ ${file} - 无效的 frontmatter`);
        return;
    }

    // 提取标题和内容用于分类判断
    let title = '';
    for (let i = frontmatterStart + 1; i < frontmatterEnd; i++) {
        const line = lines[i];
        if (line.startsWith('title:')) {
            title = line.replace(/^title:\s*/, '').trim().replace(/^['"]|['"]$/g, '');
            break;
        }
    }

    const bodyContent = content.substring(frontmatterEnd + 4);
    const newCategory = getCategory(title, bodyContent);

    // 移除所有现有的 category 行
    const frontmatterLines = lines.slice(frontmatterStart + 1, frontmatterEnd);
    const filteredLines = frontmatterLines.filter(line => !line.trim().startsWith('category:'));

    // 添加新的 category 行
    filteredLines.push(`category: ${newCategory}`);

    // 重新组合文件内容
    const newLines = [
        ...lines.slice(0, frontmatterStart + 1),
        ...filteredLines,
        ...lines.slice(frontmatterEnd)
    ];

    fs.writeFileSync(filePath, newLines.join('\n'));

    console.log(`✓ ${file.replace('.md', '')} → ${newCategory}`);
});

console.log('\n分类更新完成！');
