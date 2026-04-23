import puppeteer from "puppeteer";
import * as path from "path";
import * as fs from "fs";

// 输入的 HTML 文件名
const in_file_name = "index.html";
// 输出目录和文件
const out_dir = path.join(__dirname, "build");
if (!fs.existsSync(out_dir)) {
  fs.mkdirSync(out_dir, { recursive: true });
}
const out_file_name = path.join(out_dir, `resume.pdf`);

(async () => {
  // 1. 启动浏览器
  const browser = await puppeteer.launch({
    headless: true, // 新版无头模式
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // --- 场景 A: 转换本地 HTML 文件 ---
  // 获取 demo.html 的绝对路径
  // 假设你的 HTML 文件叫 demo.html，并且和 index.js 在同一目录
  const localFile = path.join(__dirname, in_file_name);
  await page.goto(`file://${localFile}`, { waitUntil: "networkidle0" });

  // --- 场景 B: 转换在线网页 (如果需要，解开下面这行的注释，注释掉上面的场景 A) ---
  // await page.goto('https://www.baidu.com', { waitUntil: 'networkidle0' });

  // 2. 设置生成 PDF 的参数
  await page.pdf({
    path: out_file_name, // 输出的文件名
    format: "A4", // 纸张大小
    printBackground: true, // 是否打印背景色 (非常重要，否则背景是白的)
    margin: {
      top: "20px",
      bottom: "20px",
      left: "20px",
      right: "20px",
    },
  });

  console.log("PDF 转换成功！文件名为:" + out_file_name); 

  // 3. 关闭浏览器
  await browser.close();
})();
