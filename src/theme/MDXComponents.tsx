import React from 'react';
// 导入默认的 MDX 组件映射
import MDXComponents from '@theme-original/MDXComponents';

// 导入我们自定义的组件
import Highlight from '@site/src/components/Highlight';
import ShowcaseCard from '@site/src/components/ShowcaseCard';

export default {
  // 复用默认的映射关系
  ...MDXComponents,
  // 注册自定义组件，以便在所有 .mdx 文件中直接使用，无需 import
  Highlight,
  ShowcaseCard,
};
