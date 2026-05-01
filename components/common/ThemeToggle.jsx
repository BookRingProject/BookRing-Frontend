'use client';

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={styles.toggleBtn}
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <img src="/icons/sun.svg" alt="Light mode" className={styles.icon} />
      ) : (
        <img src="/icons/moon.svg" alt="Dark mode" className={styles.icon} />
      )}
    </button>
  );
};

export default ThemeToggle;