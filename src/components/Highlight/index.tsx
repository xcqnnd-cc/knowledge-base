import React from 'react';
import styles from './styles.module.css';

interface HighlightProps {
  children: React.ReactNode;
  color?: string;
}

export default function Highlight({ children, color }: HighlightProps) {
  return (
    <span
      className={styles.highlight}
      style={{
        backgroundColor: color || 'var(--ifm-color-primary)',
      }}>
      {children}
    </span>
  );
}
