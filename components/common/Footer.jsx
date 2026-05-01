'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import styles from './Footer.module.css';

const Footer = () => {
  const pathname = usePathname();
  const { isLecturer, isStudent, logout } = useAuth();

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  // Lecturer Footer Icons
  if (isLecturer) {
    return (
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <Link href="/dashboard" className={`${styles.footerItem} ${pathname === '/dashboard' ? styles.active : ''}`}>
            <img src="/icons/metrics-icon.svg" alt="Dashboard" className={styles.icon} />
            <span>Dashboard</span>
          </Link>
          
          <Link href="/upload" className={`${styles.footerItem} ${styles.centerBtn} ${pathname === '/upload' ? styles.active : ''}`}>
            <div className={styles.plusCircle}>
              <img src="/icons/plus-icon.svg" alt="Upload" className={styles.plusIcon} />
            </div>
          </Link>
          
          <Link href="/profile" className={`${styles.footerItem} ${pathname === '/profile' ? styles.active : ''}`}>
            <img src="/icons/profile-icon.svg" alt="Profile" className={styles.icon} />
            <span>Profile</span>
          </Link>
        </div>
      </footer>
    );
  }

  // Student Footer Icons
  if (isStudent) {
    return (
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <Link href="/booksphere" className={`${styles.footerItem} ${pathname === '/booksphere' ? styles.active : ''}`}>
            <img src="/icons/world-icon.svg" alt="Booksphere" className={styles.icon} />
            <span>Booksphere</span>
          </Link>
          
          <Link href="/my-library" className={`${styles.footerItem} ${pathname === '/my-library' ? styles.active : ''}`}>
            <img src="/icons/book-icon.svg" alt="My Library" className={styles.icon} />
            <span>My Library</span>
          </Link>
        </div>
      </footer>
    );
  }

  return null;
};

export default Footer;