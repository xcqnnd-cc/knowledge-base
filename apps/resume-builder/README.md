# HTML 转 PDF 工具

这是一个使用 Puppeteer 将 HTML 文件转换为 PDF 的 Node.js 脚本。

## 功能特性

- 支持本地 HTML 文件转换为 PDF
- 支持在线网页转换为 PDF
- 自动设置 A4 纸张格式
- 保留背景色和样式
- 自定义页边距设置

## 环境要求

- Node.js (建议 14.0 或更高版本)
- npm 或 yarn 包管理器

## 安装依赖

```bash
npm install puppeteer
```

## 使用方法

### 转换本地 HTML 文件

1. 确保你的 HTML 文件名为 `index.html` 并与脚本在同一目录下
2. 运行脚本：

```bash
node index.js
```

### 转换在线网页

1. 打开 `index.js` 文件
2. 注释掉本地文件转换的代码行：
   ```javascript
   // const localFile = path.join(__dirname, "index.html");
   // await page.goto(`file://${localFile}`, { waitUntil: "networkidle0" });
   ```
3. 取消注释在线网页转换的代码行：
   ```javascript
   await page.goto('https://www.example.com', { waitUntil: 'networkidle0' });
   ```
4. 将 URL 替换为你想要转换的网页地址
5. 运行脚本

## 配置选项

### 输出文件名

默认输出文件名为 `冉军林-6年前端开发-15520000125.pdf`，可以通过修改 `default_file_name` 变量来自定义：

```javascript
const default_file_name = "your-custom-filename.pdf";
```

### PDF 设置

可以在 `page.pdf()` 方法中调整以下参数：

- `format`: 纸张大小（A4、A3、Letter 等）
- `printBackground`: 是否打印背景色（建议保持 true）
- `margin`: 页边距设置

```javascript
await page.pdf({
  path: default_file_name,
  format: "A4",
  printBackground: true,
  margin: {
    top: "20px",
    bottom: "20px", 
    left: "20px",
    right: "20px",
  },
});
```

## 输出结果

脚本执行成功后，会在当前目录下生成 PDF 文件，并在控制台显示成功消息。

## 注意事项

- 确保 HTML 文件中的所有资源（CSS、图片等）路径正确
- 对于复杂的网页，可能需要调整 `waitUntil` 参数以确保页面完全加载
- 如果遇到字体显示问题，请确保系统已安装相应字体

## 故障排除

### 常见问题

1. **PDF 背景是白色的**
   - 确保 `printBackground: true` 设置正确

2. **页面加载不完整**
   - 尝试增加等待时间或使用不同的 `waitUntil` 选项

3. **字体显示异常**
   - 检查系统字体安装情况
   - 在 HTML 中使用 web 安全字体

## 许可证

MIT License
