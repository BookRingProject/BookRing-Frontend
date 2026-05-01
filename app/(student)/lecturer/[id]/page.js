'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../../context/AuthContext';
import { fetchLecturerById } from '../../../../services/lecturerService';
import { useBooks } from '../../../../hooks/useBooks';
import { useSaves } from '../../../../hooks/useSaves';
import { useLecturers } from '../../../../hooks/useLecturers';
import Loader from '../../../../components/common/Loader';
import Button from '../../../../components/ui/Button';
import BookIcon from '../../../../components/icons/BookIcon';
import UsersIcon from '../../../../components/icons/UsersIcon';
import styles from './page.module.css';

export default function LecturerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { getBooksByLecturer } = useBooks();
  const { followLecturer, unfollowLecturer, getFollowingLecturers, following } = useLecturers();
  const { savedBookIds, toggleSave, loadSavedBooks } = useSaves();
  
  const [lecturer, setLecturer] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch lecturer details
      const lecturerRes = await fetchLecturerById(id);
      setLecturer(lecturerRes.data.data);
      
      // Fetch lecturer's books
      const booksData = await getBooksByLecturer(id);
      setBooks(booksData);
      
      // Check follow status (only if logged in as student)
      if (user?.role === 'student') {
        const followingList = await getFollowingLecturers();
        setIsFollowing(followingList.includes(id));
      }
      
      await loadSavedBooks();
    } catch (error) {
      console.error('Failed to load lecturer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (isFollowing) {
      await unfollowLecturer(id);
    } else {
      await followLecturer(id);
    }
    // Refresh following list and update state directly
    const updatedFollowingList = await getFollowingLecturers();
    setIsFollowing(updatedFollowingList.includes(id));
  };

  const handleSaveToggle = async (bookId) => {
    await toggleSave(bookId, savedBookIds.includes(bookId));
    await loadSavedBooks();
  };

  if (loading) {
    return <Loader />;
  }

  if (!lecturer) {
    return (
      <div className={styles.notFound}>
        <h2>Lecturer not found</h2>
        <p>The lecturer you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/booksphere')}>Back to Booksphere</Button>
      </div>
    );
  }

  const isOwnProfile = user?._id === id;

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <button onClick={() => router.back()} className={styles.backBtn}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Lecturers
      </button>

      {/* Lecturer Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>
          <img 
            src={lecturer.profilePicture || '/images/default-avatar.png'} 
            alt={lecturer.name}
          />
        </div>
        <div className={styles.profileInfo}>
          <h1 className={styles.name}>{lecturer.name}</h1>
          <p className={styles.specialty}>{lecturer.specialty}</p>
          {lecturer.institution && (
            <p className={styles.institution}>{lecturer.institution}</p>
          )}
          <div className={styles.stats}>
            <div className={styles.stat}>
              <BookIcon />
              <span>{books.length} books</span>
            </div>
            <div className={styles.stat}>
              <UsersIcon />
              <span>{lecturer.followerCount || 0} followers</span>
            </div>
          </div>
          {user?.role === 'student' && !isOwnProfile && (
            <div className={styles.followAction}>
              <Button 
                variant={isFollowing ? 'outline' : 'primary'}
                onClick={handleFollowToggle}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Books Section */}
      <div className={styles.booksSection}>
        <h2 className={styles.sectionTitle}>Books by {lecturer.name}</h2>
        {books.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No books published yet.</p>
          </div>
        ) : (
          <div className={styles.booksGrid}>
            {books.map((book) => (
              <div key={book._id} className={styles.bookCard}>
                <Link href={`/booksphere/${book._id}`} className={styles.bookLink}>
                  <div className={styles.bookCover}>
                    <img src={book.coverUrl || '/images/default-cover.png'} alt={book.title} />
                  </div>
                  <div className={styles.bookInfo}>
                    <h3 className={styles.bookTitle}>{book.title}</h3>
                    <p className={styles.bookCategory}>{book.category}</p>
                    <div className={styles.bookActions}>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleSaveToggle(book._id);
                        }}
                        className={styles.saveBtn}
                      >
                        {savedBookIds.includes(book._id) ? '★ Saved' : '☆ Save'}
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}