'use client';

import React from 'react';
import styles from './TopBooksChart.module.css';

const TopBooksChart = ({ books }) => {
  if (!books || books.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No books uploaded yet</p>
      </div>
    );
  }

  const maxSaves = books[0]?.saveCount || 1;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Top 5 Most Saved Books</h3>
      <div className={styles.chart}>
        {books.map((book, index) => (
          <div key={book._id} className={styles.barItem}>
            <div className={styles.bookInfo}>
              <span className={styles.rank}>{index + 1}</span>
              <span className={styles.bookTitle}>{book.title}</span>
              <span className={styles.saveCount}>{book.saveCount} saves</span>
            </div>
            <div className={styles.barWrapper}>
              <div 
                className={styles.bar}
                style={{ width: `${(book.saveCount / maxSaves) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBooksChart;