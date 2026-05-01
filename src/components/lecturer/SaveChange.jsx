'use client';

import React from 'react';
import styles from './SaveChange.module.css';

const SaveChange = ({ newSaves }) => {
  if (!newSaves || newSaves === 0) return null;
  
  return (
    <div className={styles.badge}>
      +{newSaves} new
    </div>
  );
};

export default SaveChange;