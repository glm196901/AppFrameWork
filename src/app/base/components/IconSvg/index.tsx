import React from 'react';
import styles from './style.less';

export default ({ type, color }: { type: string; color: string }) => {
  return (
    <svg className={styles.icon} aria-hidden="true" fill={color}>
      <use xlinkHref={`#${type}`}></use>
    </svg>
  );
};
