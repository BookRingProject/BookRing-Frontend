'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BookDetailView from '../../../../components/student/BookDetailView';
import { useBooks } from '../../../../hooks/useBooks';
import { useSaves } from '../../../../hooks/useSaves';
import Loader from '../../../../components/common/Loader';
import styles from './page.module.css';

export default function BookDetailPage() {
  const { bookId } = useParams();
  const router = useRouter();
  const { getBookById, loading: booksLoading } = useBooks();
  const { savedBookIds, toggleSave, loadSavedBooks } = useSaves();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBook();
    loadSavedBooks();
  }, [bookId]);

  const loadBook = async () => {
    setLoading(true);
    const bookData = await getBookById(bookId);
    setBook(bookData);
    setLoading(false);
  };

  const handleSaveToggle = async () => {
    await toggleSave(bookId, savedBookIds.includes(bookId));
    await loadSavedBooks();
    await loadBook();
  };

  if (loading || booksLoading) {
    return <Loader />;
  }

  if (!book) {
    return (
      <div className={styles.notFound}>
        <h2>Book not found</h2>
        <p>The book you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <button onClick={() => router.back()} className={styles.backBtn}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Books
      </button>

      <BookDetailView
        book={book}
        isSaved={savedBookIds.includes(bookId)}
        onSaveToggle={handleSaveToggle}
      />
    </div>
  );
}