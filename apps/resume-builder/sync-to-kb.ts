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

  // 如果没有 frontmatter，添加 Docusaurus frontmatter 以便在侧边栏显示
  if (!content.startsWith('---')) {
    const frontmatter = `---
id: resume
title: 👨‍💻 个人简历
sidebar_position: 1
---

`;
    content = frontmatter + content;
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(targetPath, content, 'utf-8');
  console.log(`✅ 简历 Markdown 已成功同步到知识库: ${targetPath}`);
}

syncResumeToKnowledgeBase();