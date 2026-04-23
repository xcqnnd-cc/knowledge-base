import React from 'react';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

interface ShowcaseCardProps {
  title: string;
  description: string;
  url: string;
  icon?: React.ReactNode;
}

export default function ShowcaseCard({ title, description, url, icon }: ShowcaseCardProps) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardBody}>
        {icon && <div className={styles.iconWrapper}>{icon}</div>}
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
      </div>
      <div className={styles.cardFooter}>
        <Link className="button button--primary button--block" to={url}>
          立即前往
        </Link>
      </div>
    </div>
  );
}
