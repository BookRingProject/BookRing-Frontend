'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { STORAGE_KEYS, USER_ROLES } from '../utils/constants';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load user from localStorage on mount
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const response = await authService.login(email, password, role);
      
      // FIX: User and token are inside response.data.data
      const { user: userData, token: authToken } = response.data.data;
      
      setUser(userData);
      setToken(authToken);
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      
      // Redirect based on role
      if (userData.role === USER_ROLES.LECTURER) {
        router.push('/dashboard');
      } else {
        router.push('/booksphere');
      }
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const signup = async (userData, role) => {
    try {
      const response = await authService.signup(userData, role);
      
      // FIX: User and token are inside response.data.data
      const { user: newUser, token: authToken } = response.data.data;
      
      setUser(newUser);
      setToken(authToken);
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      
      // Redirect based on role
      if (newUser.role === USER_ROLES.LECTURER) {
        router.push('/dashboard');
      } else {
        router.push('/booksphere');
      }
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    router.push('/');
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  };

  const isLecturer = user?.role === USER_ROLES.LECTURER;
  const isStudent = user?.role === USER_ROLES.STUDENT;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      signup,
      logout,
      updateUser,
      isLecturer,
      isStudent,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};