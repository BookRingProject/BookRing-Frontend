'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Redirect based on role
        if (user.role === 'lecturer') {
          router.push('/dashboard');
        } else {
          router.push('/booksphere');
        }
      } else {
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  return <Loader fullScreen />;
}