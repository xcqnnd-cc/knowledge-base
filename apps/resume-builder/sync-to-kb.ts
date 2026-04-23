import * as fs from 'fs';
import * as path from 'path';

/**
 * 同步简历 Markdown 到知识库 docs 目录
 * 确保 Docusaurus 能够直接渲染 Markdown 简历
 */
function syncResumeToKnowledgeBase() {
  const mdFileName = "冉军林-web前端开发-15520000125.md";
  const sourcePath = path.join(__dirname, mdFileName);
  const targetDir = path.join(__dirname, "../knowledge-base/docs");
  const targetPath = path.join(targetDir, "resume.md");

  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ 找不到简历文件: ${sourcePath}`);
    process.exit(1);
  }

  let content = fs.readFileSync(sourcePath, 'utf-8');

  // 为了让 Markdown 的展示效果更好，我们可以使用 Docusaurus 的 React 组件来内嵌 PDF
  // 或者在 Markdown 顶部提供一个明显的 PDF 下载/在线预览按钮
  const pdfViewerContent = `
import BrowserOnly from '@docusaurus/BrowserOnly';

<div className="resume-download-bar" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
  <a 
    href="/knowledge-base/resume/resume.pdf" 
    target="_blank" 
    className="button button--primary"
  >
    📄 查看 / 下载 PDF 版本简历
  </a>
</div>

`;

  // 如果没有 frontmatter，添加 Docusaurus frontmatter 以便在侧边栏显示
  if (!content.startsWith('---')) {
    const frontmatter = `---
id: resume
title: 👨‍💻 个人简历
sidebar_position: 1
---

`;
    content = frontmatter + pdfViewerContent + content;
  } else {
    // 如果已经有 frontmatter，把按钮插在 frontmatter 之后
    content = content.replace(/---\s*\n([\s\S]*?)\n---\s*\n/, (match) => {
      return match + pdfViewerContent;
    });
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(targetPath, content, 'utf-8');
  console.log(`✅ 简历 Markdown 已成功同步到知识库: ${targetPath}`);
}

syncResumeToKnowledgeBase();