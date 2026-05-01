'use client';

import React from 'react';
import styles from './SaveButton.module.css';

const SaveButton = ({ isSaved, onToggle }) => {
  return (
    <button onClick={onToggle} className={styles.button} aria-label={isSaved ? 'Unsave' : 'Save'}>
      <img 
        src={isSaved ? '/icons/star-filled.svg' : '/icons/star-icon.svg'} 
        alt={isSaved ? 'Saved' : 'Save'}
        className={styles.icon}
      />
    </button>
  );
};

export default SaveButton;