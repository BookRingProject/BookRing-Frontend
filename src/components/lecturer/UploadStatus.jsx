'use client';

import React from 'react';
import styles from './UploadStatus.module.css';

const UploadStatus = ({ status, message }) => {
  if (!status) return null;

  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <div className={`${styles.container} ${isSuccess ? styles.success : isError ? styles.error : ''}`}>
      <div className={styles.icon}>
        {isSuccess ? '✓' : isError ? '✗' : 'ℹ'}
      </div>
      <div className={styles.message}>{message}</div>
    </div>
  );
};

export default UploadStatus;