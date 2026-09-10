const fs = require('fs');
const path = require('path');

const postsDir = 'src/content/posts';

// 定义分类对应的文件夹
const categoryFolders = {
    '软件安利': '软件安利',
    '技术教程': '技术教程',
    'AI新鲜玩法': 'AI新鲜玩法',
    '未分类': '未分类'
};

// 创建文件夹
function createFolders() {
    console.log('========================================');
    console.log('   1. 创建分类文件夹');
    console.log('========================================\n');

    Object.values(categoryFolders).forEach(folder => {
        const folderPath = path.join(postsDir, folder);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            console.log(`✅ 创建文件夹: ${folder}`);
        } else {
            console.log(`⏭️  文件夹已存在: ${folder}`);
        }
    });
    console.log('');
}

// 获取文章的分类
function getCategoryFromFrontmatter(content) {
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const categoryMatch = frontmatter.match(/^category:\s*(.+)$/m);
        if (categoryMatch) {
            return categoryMatch[1].trim();
        }
    }
    return '未分类';
}

// 移动文章到对应文件夹
function movePosts() {
    console.log('========================================');
    console.log('   2. 移动文章到对应文件夹');
    console.log('========================================\n');

    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

    let movedCount = 0;
    let skippedCount = 0;

    files.forEach(file => {
        const filePath = path.join(postsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const category = getCategoryFromFrontmatter(content);

        const targetFolder = categoryFolders[category] || '未分类';
        const targetPath = path.join(postsDir, targetFolder, file);

        // 检查目标文件是否已存在
        if (fs.existsSync(targetPath)) {
            console.log(`⚠️  ${file} -> ${targetFolder}/ (目标已存在，跳过)`);
            skippedCount++;
            return;
        }

        // 移动文件
        fs.renameSync(filePath, targetPath);
        console.log(`✅ ${file} -> ${targetFolder}/`);
        movedCount++;
    });

    console.log(`\n完成！移动了 ${movedCount} 个文件，跳过 ${skippedCount} 个文件\n`);
}

// 执行
createFolders();
movePosts();

console.log('========================================');
console.log('   ✅ 文章组织完成！');
console.log('========================================\n');
