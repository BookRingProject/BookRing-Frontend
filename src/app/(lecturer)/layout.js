'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';

export default function LecturerLayout({ children }) {
  const { user, isLecturer, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
    if (!isLoading && user && !isLecturer) {
      router.push('/booksphere');
    }
  }, [user, isLoading, isLecturer, router]);

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (!user || !isLecturer) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="container" style={{ paddingBottom: '80px', minHeight: '100vh' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}