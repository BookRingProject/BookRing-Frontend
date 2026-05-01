'use client';

import React from 'react';
import styles from './FollowerChange.module.css';

const FollowerChange = ({ change }) => {
  const isPositive = change >= 0;
  
  return (
    <div className={`${styles.badge} ${isPositive ? styles.positive : styles.negative}`}>
      {isPositive ? '+' : ''}{change}
    </div>
  );
};

export default FollowerChange;