'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';

export default function StudentLayout({ children }) {
  const { user, isStudent, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
    if (!isLoading && user && !isStudent) {
      router.push('/dashboard');
    }
  }, [user, isLoading, isStudent, router]);

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (!user || !isStudent) {
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