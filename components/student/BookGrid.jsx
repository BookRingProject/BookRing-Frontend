'use client';

import React from 'react';
import BookCard from './BookCard';
import styles from './BookGrid.module.css';

const BookGrid = ({ books, savedBooks = [], onSaveToggle }) => {
  if (!books || books.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No books found</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {books.map((book) => (
        <BookCard
          key={book._id}
          book={book}
          isSaved={savedBooks.includes(book._id)}
          onSaveToggle={onSaveToggle}
        />
      ))}
    </div>
  );
};

export default BookGrid;