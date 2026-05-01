'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import BookGrid from '../../../components/student/BookGrid';
import CategoryFilter from '../../../components/student/CategoryFilter';
import LecturerList from '../../../components/student/LecturerList';
import TrendyRanking from '../../../components/student/TrendyRanking';
import { useBooks } from '../../../hooks/useBooks';
import { useLecturers } from '../../../hooks/useLecturers';
import { useSaves } from '../../../hooks/useSaves';
import Loader from '../../../components/common/Loader';
import styles from './page.module.css';

export default function BookspherePage() {
  const searchParams = useSearchParams();
  const lecturerId = searchParams.get('lecturer');
  
  const { books, getAllBooks, getBooksByCategory, getBooksByLecturer, getTrendingBooks, trendingBooks, loading: booksLoading } = useBooks();
  const { lecturers, getAllLecturers, getFollowingLecturers, following, followLecturer, unfollowLecturer, loading: lecturersLoading } = useLecturers();
  const { savedBookIds, toggleSave, loadSavedBooks } = useSaves();
  
  const [activeView, setActiveView] = useState('books');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLecturer, setSelectedLecturer] = useState(lecturerId);
  const [currentBooks, setCurrentBooks] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedLecturer) {
      loadBooksByLecturer();
    } else if (selectedCategory) {
      loadBooksByCategory();
    } else {
      loadAllBooks();
    }
  }, [selectedCategory, selectedLecturer]);

  const loadInitialData = async () => {
    await Promise.all([
      getAllBooks(),
      getAllLecturers(),
      getTrendingBooks(),
      loadSavedBooks(),
      getFollowingLecturers()  // Load initial following state
    ]);
  };

  const loadAllBooks = async () => {
    const allBooks = await getAllBooks();
    console.log('✅ getAllBooks returned:', allBooks);
    console.log('✅ Is it an array?', Array.isArray(allBooks));   
    setCurrentBooks(allBooks);
  };

  const loadBooksByCategory = async () => {
    const categoryBooks = await getBooksByCategory(selectedCategory);
    console.log('✅ getBooksByCategory returned:', categoryBooks);
    console.log('✅ Is it an array?', Array.isArray(categoryBooks));   
    setCurrentBooks(categoryBooks);
  };

  const loadBooksByLecturer = async () => {
    const lecturerBooks = await getBooksByLecturer(selectedLecturer);
    console.log('✅ getBooksByLecturer returned:', lecturerBooks);
    console.log('✅ Is it an array?', Array.isArray(lecturerBooks));    
    setCurrentBooks(lecturerBooks);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedLecturer(null);
    setActiveView('books');
  };

  const handleLecturerSelect = (id) => {
    setSelectedLecturer(id);
    setSelectedCategory(null);
    setActiveView('books');
  };

  const handleFollowToggle = async (lecturerId) => {
    const isCurrentlyFollowing = following.includes(lecturerId);
    if (isCurrentlyFollowing) {
      await unfollowLecturer(lecturerId);
    } else {
      await followLecturer(lecturerId);
    }
    // Refresh both the lecturers list and the following state
    await getAllLecturers();
    await getFollowingLecturers();
  };

  const handleSaveToggle = async (bookId) => {
    await toggleSave(bookId, savedBookIds.includes(bookId));
    await loadSavedBooks();
    await getAllBooks();
  };

  if (booksLoading && lecturersLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.booksphere}>
      <div className={styles.header}>
        <h1 className={styles.title}>Booksphere</h1>
        <div className={styles.navButtons}>
          <button
            className={`${styles.navBtn} ${activeView === 'books' ? styles.active : ''}`}
            onClick={() => setActiveView('books')}
          >
            Books
          </button>
          <button
            className={`${styles.navBtn} ${activeView === 'lecturers' ? styles.active : ''}`}
            onClick={() => setActiveView('lecturers')}
          >
            Lecturers
          </button>
          <button
            className={`${styles.navBtn} ${activeView === 'trendy' ? styles.active : ''}`}
            onClick={() => setActiveView('trendy')}
          >
            Trendy
          </button>
        </div>
      </div>

      {activeView === 'books' && (
        <>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
          <BookGrid
            books={currentBooks}
            savedBooks={savedBookIds}
            onSaveToggle={handleSaveToggle}
          />
        </>
      )}

      {activeView === 'lecturers' && (
        <LecturerList
          lecturers={lecturers}
          following={following}
          onFollowToggle={handleFollowToggle}
        />
      )}

      {activeView === 'trendy' && (
        <TrendyRanking books={trendingBooks} />
      )}
    </div>
  );
}