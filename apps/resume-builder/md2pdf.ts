import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import { marked } from "marked";

(async () => {
  // =================配置区域=================
  // 1. 修改这里：你的 markdown 文件名
  const mdFileName = "冉军林-web前端开发-15520000125.md";
  // 2. 输出的 PDF 文件名
  const pdfFileName = `冉军林-web前端开发-15520000125-${Date.now()}.pdf`; // 
  // =========================================

  // 读取 Markdown 文件内容
  const mdPath = path.join(__dirname, mdFileName);
  if (!fs.existsSync(mdPath)) {
    console.error(`错误：找不到文件 ${mdFileName}，请确认文件名是否正确！`);
    process.exit(1);
  }
  const mdContent = fs.readFileSync(mdPath, "utf-8");

  // 将 Markdown 转换为 HTML
  const htmlContent = marked.parse(mdContent);

  // 关键步骤：我们需要给 HTML 加一层壳，引入 Github 风格的 CSS 样式
  // 否则生成的 PDF 会非常简陋（纯黑白文本）
  const finalHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <!-- 引入 GitHub 风格的 CSS -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-light.min.css">
      <style>
        /* 额外的打印样式调整 */
        body {
          box-sizing: border-box;
          min-width: 200px;
          max-width: 980px;
          margin: 0 auto;
          padding: 45px;
        }
        @media print {
          .markdown-body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body class="markdown-body">
      ${htmlContent}
    </body>
    </html>
  `;

  // 启动 Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // 直接设置页面内容（注意：这里用了 setContent 而不是 goto）
  // waitUntil: 'networkidle0' 确保 CSS 加载完毕
  await page.setContent(finalHtml, { waitUntil: "networkidle0" });

  // 生成 PDF
  await page.pdf({
    path: pdfFileName,
    format: "A4",
    printBackground: true, // 必须开启，否则 CSS 背景色可能丢失
    margin: {
      top: "20px",
      bottom: "20px",
      left: "20px",
      right: "20px",
    },
  });

  console.log(`转换成功！PDF 已生成：${pdfFileName}`);

  await browser.close();
})();
