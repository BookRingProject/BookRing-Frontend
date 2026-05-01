'use client';

import { useAuth } from '../context/AuthContext';

export const useAuthHook = () => {
  const {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    isLecturer,
    isStudent,
    isAuthenticated
  } = useAuth();

  return {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    isLecturer,
    isStudent,
    isAuthenticated
  };
};