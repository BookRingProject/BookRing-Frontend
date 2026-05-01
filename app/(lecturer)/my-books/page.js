'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BookContentCard from '../../../components/lecturer/BookContentCard';
import { fetchMyBooks, deleteBook } from '../../../services/lecturerService';
import Loader from '../../../components/common/Loader';
import Button from '../../../components/ui/Button';
import FileIcon from '../../../components/icons/FileIcon';
import SummaryIcon from '../../../components/icons/SummaryIcon';
import AudioIcon from '../../../components/icons/AudioIcon';
import styles from './page.module.css';

export default function MyBooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('original');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const response = await fetchMyBooks();
      setBooks(response.data.data || []);
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(bookId);
        await loadBooks();
        alert('Book deleted successfully');
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  const getFilteredBooks = () => {
    switch (activeTab) {
      case 'original':
        return books.filter(book => book.pdfUrl);
      case 'summary':
        return books.filter(book => book.summaryText);
      case 'audio':
        return books.filter(book => book.audioUrl);
      default:
        return books;
    }
  };

  const filteredBooks = getFilteredBooks();

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <button onClick={() => router.back()} className={styles.backBtn}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </button>

      <div className={styles.header}>
        <h1 className={styles.title}>My Published Books</h1>
        <Button onClick={() => router.push('/upload')} variant="primary">
          Upload New Book
        </Button>
      </div>

      {/* Tabs/Menu */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'original' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('original')}
        >
          <FileIcon />
          <span className={styles.tabLabel}>Original</span>
          <span className={styles.count}>{books.filter(b => b.pdfUrl).length}</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'summary' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          <SummaryIcon />
          <span className={styles.tabLabel}>Summaries</span>
          <span className={styles.count}>{books.filter(b => b.summaryText).length}</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'audio' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('audio')}
        >
          <AudioIcon />
          <span className={styles.tabLabel}>Audio Files</span>
          <span className={styles.count}>{books.filter(b => b.audioUrl).length}</span>
        </button>
      </div>

      {/* Content Area - Cards */}
      <div className={styles.contentArea}>
        {filteredBooks.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No {activeTab} content available yet</p>
            <Button onClick={() => router.push('/upload')} variant="primary">
              Upload a Book
            </Button>
          </div>
        ) : (
          filteredBooks.map((book) => (
            <BookContentCard
              key={book._id}
              book={book}
              type={activeTab}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}