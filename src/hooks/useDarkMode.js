'use client';

import { useTheme } from '../context/ThemeContext';

export const useDarkMode = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return {
    isDarkMode,
    toggleTheme
  };
};