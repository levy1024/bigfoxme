// Image path fixer for posts in subdirectories
const fs = require('fs');
const path = require('path');

const postsDir = 'src/content/posts';

// 递归处理所有 markdown 文件
function fixImagePaths(dir, baseDir = dir) {
    const items = fs.readdirSync(dir);

    items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // 递归处理子目录
            fixImagePaths(fullPath, baseDir);
        } else if (item.endsWith('.md')) {
            // 处理 markdown 文件
            let content = fs.readFileSync(fullPath, 'utf-8');
            const originalContent = content;

            // 计算文件相对于 posts 目录的深度
            const relativePath = path.relative(baseDir, fullPath);
            const depth = relativePath.split(path.sep).length - 1;

            // 根据深度决定需要多少个 ../
            let prefix = '';
            if (depth === 0) {
                // 根目录文件：../assets/
                prefix = '../assets/';
            } else if (depth === 1) {
                // 一级子目录：../../assets/
                prefix = '../../assets/';
            } else {
                // 更深层次：逐级向上
                prefix = '../'.repeat(depth + 1) + 'assets/';
            }

            // 替换所有 ../assets/ 为正确的路径
            content = content.replace(/\.\.\/assets\//g, prefix);

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf-8');
                console.log(`✅ 修复: ${relativePath}`);
            }
        }
    });
}

console.log('========================================');
console.log('   修复图片路径');
console.log('========================================\n');

fixImagePaths(postsDir);

console.log('\n✅ 完成！所有图片路径已修复');
