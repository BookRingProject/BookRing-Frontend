'use client';

import React from 'react';
import { CATEGORIES } from '../../utils/constants';
import styles from './CategoryFilter.module.css';

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.categoryBtn} ${!selectedCategory ? styles.active : ''}`}
        onClick={() => onSelectCategory(null)}
      >
        All
      </button>
      {CATEGORIES.map((category) => (
        <button
          key={category}
          className={`${styles.categoryBtn} ${selectedCategory === category ? styles.active : ''}`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;