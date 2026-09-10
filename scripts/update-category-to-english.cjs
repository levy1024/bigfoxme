const fs = require('fs');
const path = require('path');

// 分类映射
const categoryMap = {
  '软件安利': 'Software',
  '技术教程': 'Technical',
  'AI新鲜玩法': 'AIHacks'
};

// 读取所有文章文件
const postsDir = path.join('src', 'content', 'posts');

function updatePostCategory(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // 检查是否有 category 字段
  const categoryMatch = content.match(/^category:\s*(.+)$/m);
  if (!categoryMatch) return;

  const currentCategory = categoryMatch[1].trim();
  const newCategory = categoryMap[currentCategory];

  if (!newCategory) return;

  // 替换 category 字段
  const newContent = content.replace(
    /^category:\s*.+$/m,
    `category: ${newCategory}`
  );

  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`Updated: ${path.basename(filePath)} - ${currentCategory} → ${newCategory}`);
}

// 递归遍历所有 markdown 文件
function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (path.extname(filePath) === '.md') {
      updatePostCategory(filePath);
    }
  });
}

walkDir(postsDir);
console.log('Done!');
