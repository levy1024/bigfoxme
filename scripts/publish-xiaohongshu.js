import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// 配置文件路径
const configPath = path.join('scripts', 'xiaohongshu-config.json');

// 加载配置
let config = {};
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

// 默认配置
const defaultConfig = {
  username: '',
  password: '',
  headless: false,
  slowMo: 100,
};

// 合并配置
config = { ...defaultConfig, ...config };

(async () => {
  try {
    // 启动浏览器
    const browser = await puppeteer.launch({
      headless: config.headless,
      slowMo: config.slowMo,
      args: ['--disable-blink-features=AutomationControlled'], // 避免被检测为爬虫
    });

    // 创建新页面
    const page = await browser.newPage();

    // 设置用户代理
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // 导航到小红书网站
    await page.goto('https://www.xiaohongshu.com');
    await page.waitForTimeout(3000);

    // 检查登录状态
    const isLoggedIn = await checkLogin(page);

    if (!isLoggedIn) {
      console.log('请先登录小红书账号');
      await login(page);
    }

    // 创建新笔记
    await createNewNote(page);

    // 填充标题和内容
    await fillNoteContent(page);

    // 上传图片
    await uploadImage(page);

    // 发布笔记
    await publishNote(page);

    console.log('笔记发布成功！');

    // 关闭浏览器
    await browser.close();
  } catch (error) {
    console.error('发布过程中出现错误：', error);
  }
})();

async function checkLogin(page) {
  try {
    // 检查是否存在登录按钮或用户头像
    const loginButton = await page.$('button:has(span:contains("登录"))');
    const userAvatar = await page.$('div[class*="avatar"]');

    return !!userAvatar && !loginButton;
  } catch (error) {
    return false;
  }
}

async function login(page) {
  // 等待用户手动登录
  console.log('请在浏览器中手动登录小红书账号');
  console.log('登录完成后，请按回车键继续...');

  // 等待用户操作
  await new Promise(resolve => {
    process.stdin.once('data', () => {
      resolve();
    });
  });
}

async function createNewNote(page) {
  // 找到创建新笔记的按钮（可能需要根据实际页面结构调整）
  const createButton = await page.$('button:has(span:contains("发布"))');
  if (createButton) {
    await createButton.click();
    await page.waitForTimeout(2000);
  }
}

async function fillNoteContent(page) {
  // 填充标题
  const titleInput = await page.$('input[placeholder="标题"]');
  if (titleInput) {
    await titleInput.type('这是一篇测试笔记');
  }

  // 填充内容
  const contentInput = await page.$('textarea[placeholder="分享新鲜事..."]');
  if (contentInput) {
    await contentInput.type('这是笔记的内容');
  }
}

async function uploadImage(page) {
  // 找到上传图片的按钮
  const uploadButton = await page.$('div[class*="upload"]');
  if (uploadButton) {
    await uploadButton.click();
    // 等待上传对话框出现
    await page.waitForTimeout(1000);

    // 找到文件选择输入框
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
      // 上传一张示例图片
      const imagePath = path.join('scripts', 'test-image.jpg');
      if (fs.existsSync(imagePath)) {
        await fileInput.uploadFile(imagePath);
        await page.waitForTimeout(2000);
      } else {
        console.log('示例图片不存在，请在 scripts 目录下创建 test-image.jpg 文件');
      }
    }
  }
}

async function publishNote(page) {
  // 找到发布按钮
  const publishButton = await page.$('button:has(span:contains("发布"))');
  if (publishButton) {
    await publishButton.click();
    await page.waitForTimeout(3000);
  }
}
