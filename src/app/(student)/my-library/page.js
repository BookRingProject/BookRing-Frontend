'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BookContentCard from '../../../components/student/BookContentCard';
import { useSaves } from '../../../hooks/useSaves';
import Loader from '../../../components/common/Loader';
import Button from '../../../components/ui/Button';
import FileIcon from '../../../components/icons/FileIcon';
import SummaryIcon from '../../../components/icons/SummaryIcon';
import AudioIcon from '../../../components/icons/AudioIcon';
import BookIcon from '../../../components/icons/BookIcon';
import styles from './page.module.css';

export default function MyLibraryPage() {
  const router = useRouter();
  const { savedBooksList, loadSavedBooks, loading, unsaveBook } = useSaves();
  const [activeTab, setActiveTab] = useState('original');

  useEffect(() => {
    loadSavedBooks();
  }, []);

  const handleUnsave = async (bookId) => {
    if (confirm('Remove this book from your library?')) {
      await unsaveBook(bookId);
      await loadSavedBooks();
    }
  };

  if (loading) {
    return <Loader />;
  }

  const getFilteredBooks = () => {
    switch (activeTab) {
      case 'original':
        return savedBooksList.filter(book => book.pdfUrl);
      case 'summary':
        return savedBooksList.filter(book => book.summaryText);
      case 'audio':
        return savedBooksList.filter(book => book.audioUrl);
      default:
        return savedBooksList;
    }
  };

  const filteredBooks = getFilteredBooks();

  if (savedBooksList.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <BookIcon />
        </div>
        <h2>Your library is empty</h2>
        <p>Start saving books from the Booksphere to see them here</p>
        <Button onClick={() => router.push('/booksphere')} variant="primary">
          Browse Books
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Library</h1>
        <p className={styles.subtitle}>Your saved books, summaries, and audio</p>
      </div>

      {/* Tabs/Menu */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'original' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('original')}
        >
          <FileIcon />
          <span className={styles.tabLabel}>Original Documents</span>
          <span className={styles.count}>{savedBooksList.filter(b => b.pdfUrl).length}</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'summary' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          <SummaryIcon />
          <span className={styles.tabLabel}>Summaries</span>
          <span className={styles.count}>{savedBooksList.filter(b => b.summaryText).length}</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'audio' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('audio')}
        >
          <AudioIcon />
          <span className={styles.tabLabel}>Audio Files</span>
          <span className={styles.count}>{savedBooksList.filter(b => b.audioUrl).length}</span>
        </button>
      </div>

      {/* Content Area - Cards */}
      <div className={styles.contentArea}>
        {filteredBooks.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No {activeTab} content available yet</p>
            <Button onClick={() => router.push('/booksphere')} variant="primary">
              Browse Books
            </Button>
          </div>
        ) : (
          filteredBooks.map((book) => (
            <BookContentCard
              key={book._id}
              book={book}
              type={activeTab}
              onDelete={handleUnsave}
              isLibrary={true}
            />
          ))
        )}
      </div>
    </div>
  );
}