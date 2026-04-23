#!/bin/bash

# ==============================================================================
# Markdown 批量导入脚本 (知识库专用)
# 
# 用途：
# 将指定目录下的所有 Markdown 文件批量拷贝至知识库指定模块，并自动注入 
# Front Matter（如果原文件没有的话）。
# 
# 用法：
# ./import_markdown.sh <源目录> <目标模块>
# 示例：./import_markdown.sh ~/Downloads/my_notes frontend
# ==============================================================================

if [ "$#" -ne 2 ]; then
    echo "用法: $0 <源目录> <目标模块 (frontend|backend|ai)>"
    echo "示例: $0 ~/Downloads/vue_notes frontend"
    exit 1
fi

SRC_DIR=$1
TARGET_MODULE=$2
DOCS_DIR="docs/${TARGET_MODULE}"

if [ ! -d "$SRC_DIR" ]; then
    echo "错误: 源目录 '$SRC_DIR' 不存在。"
    exit 1
fi

if [ ! -d "$DOCS_DIR" ]; then
    echo "错误: 目标模块目录 '$DOCS_DIR' 不存在。请确认输入了正确的模块名。"
    exit 1
fi

# 查找所有 markdown 文件
find "$SRC_DIR" -type f -name "*.md" | while read -r file; do
    filename=$(basename "$file")
    # 去除后缀，作为标题
    title="${filename%.*}"
    target_path="${DOCS_DIR}/${filename}"
    
    echo "处理文件: $filename ..."
    
    # 检查文件是否已经包含 Front Matter (以 --- 开头)
    if head -n 1 "$file" | grep -q "^---$"; then
        # 直接复制
        cp "$file" "$target_path"
        echo "  -> 包含 Front Matter，直接复制到 $target_path"
    else
        # 自动注入 Front Matter
        echo "---" > "$target_path"
        echo "title: ${title}" >> "$target_path"
        echo "---" >> "$target_path"
        echo "" >> "$target_path"
        cat "$file" >> "$target_path"
        echo "  -> 未包含 Front Matter，已自动注入并复制到 $target_path"
    fi
done

echo "=========================================="
echo "✅ 批量导入完成！请启动 npm start 查看效果。"
echo "=========================================="
