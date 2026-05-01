'use client';

import React from 'react';
import styles from './Loader.module.css';

const Loader = ({ size = 'medium', fullScreen = false }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        <div className={`${styles.loader} ${getSizeClass()}`}></div>
      </div>
    );
  }

  return <div className={`${styles.loader} ${getSizeClass()}`}></div>;
};

export default Loader;