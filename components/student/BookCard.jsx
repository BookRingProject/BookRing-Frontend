'use client';

import React from 'react';
import Link from 'next/link';
import SaveButton from './SaveButton';
import styles from './BookCard.module.css';
import { getPdfThumbnail } from '../../utils/cloudinary';

const BookCard = ({ book, isSaved, onSaveToggle }) => {
  return (
    <div className={styles.card}>
      <Link href={`/booksphere/${book._id}`} className={styles.link}>
        <div className={styles.cover}>
        <img 
         src={getPdfThumbnail(book.pdfUrl)} 
         alt={book.title}
         className={styles.coverImage}
         onError={(e) => { e.target.src = '/images/default-cover.png' }}
        />
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{book.title}</h3>
          <p className={styles.lecturer}>{book.lecturerId?.name || 'Unknown Lecturer'}</p>
          <div className={styles.meta}>
            <span className={styles.category}>{book.category}</span>
            <span className={styles.saves}>⭐ {book.saveCount || 0}</span>
          </div>
        </div>
      </Link>
      <div className={styles.saveBtn}>
        <SaveButton isSaved={isSaved} onToggle={() => onSaveToggle(book._id)} />
      </div>
    </div>
  );
};

export default BookCard;