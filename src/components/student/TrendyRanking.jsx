'use client';

import React from 'react';
import Link from 'next/link';
import FireIcon from '../icons/FireIcon';
import StarIcon from '../icons/StarIcon';
import styles from './TrendyRanking.module.css';

const TrendyRanking = ({ books }) => {
  if (!books || books.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No trending books yet</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        <FireIcon />
        Trending Books
      </h3>
      <div className={styles.list}>
        {books.slice(0, 10).map((book, index) => (
          <Link href={`/booksphere/${book._id}`} key={book._id} className={styles.item}>
            <div className={styles.rank}>{index + 1}</div>
            <div className={styles.cover}>
              <img src={book.coverUrl || '/images/default-cover.png'} alt={book.title} />
            </div>
            <div className={styles.info}>
              <div className={styles.bookTitle}>{book.title}</div>
              <div className={styles.lecturer}>{book.lecturer?.name}</div>
            </div>
            <div className={styles.saves}>
              <StarIcon filled={false} />
              {book.saveCount}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendyRanking;