'use client';

import React from 'react';
import SaveButton from './SaveButton';
import AudioPlayer from './AudioPlayer';
import styles from './BookDetailView.module.css';
import { getPdfThumbnail, getPdfPreview } from '../../utils/cloudinary';

const BookDetailView = ({ book, isSaved, onSaveToggle }) => {
  if (!book) {
    return (
      <div className={styles.loading}>
        <p>Loading book details...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.cover}>
        <img 
         src={getPdfThumbnail(book.pdfUrl, 300, 400)} 
         alt={book.title}
         onError={(e) => { e.target.src = '/images/default-cover.png' }}
        />
        </div>
        <div className={styles.info}>
          <h1 className={styles.title}>{book.title}</h1>
          <p className={styles.lecturer}>By: {book.lecturerId?.name}</p>
          <p className={styles.category}>Category: {book.category}</p>
          <div className={styles.saveWrapper}>
            <SaveButton isSaved={isSaved} onToggle={onSaveToggle} />
            <span>{isSaved ? 'Saved to Library' : 'Save this book'}</span>
          </div>
        </div>
      </div>

      <div className={styles.summarySection}>
        <h2>Summary</h2>
        <div className={styles.summaryText}>
          <p>{book.summaryText || 'No summary available'}</p>
        </div>
      </div>

      <div className={styles.audioSection}>
        <h2>Audio Summary</h2>
        {book.audioUrl ? (
          <AudioPlayer audioUrl={book.audioUrl} title={book.title} />
        ) : (
          <p className={styles.noAudio}>Audio not available yet</p>
        )}
      </div>
    </div>
  );
};

export default BookDetailView;