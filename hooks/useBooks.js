'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchAllBooks,
  fetchBookById,
  fetchBooksByCategory,
  fetchBooksByLecturer,
  fetchTrendingBooks,
  saveBook,
  unsaveBook,
  checkSavedStatus,
  fetchSavedBooks
} from '../services/bookService';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllBooks = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAllBooks(params);
      console.log('🔍 RAW getAllBooks response:', response);
      console.log('🔍 response.data:', response.data);
      console.log('🔍 response.data.data:', response.data?.data);
      
      // FIX: The data is an object with a "books" property
      const booksData = response.data?.data?.books || [];
      console.log('🔍 Final booksData array:', booksData);
      console.log('🔍 Is array?', Array.isArray(booksData));
      
      setBooks(booksData);
      return booksData;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch books');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getBookById = useCallback(async (bookId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchBookById(bookId);
      return response.data?.data || null;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch book');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBooksByCategory = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchBooksByCategory(category);
      // FIX: The API returns { data: { books: [...], pagination: {...} } }
      const booksData = response.data?.data?.books || [];
      setBooks(booksData);
      return booksData;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch books by category');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getBooksByLecturer = useCallback(async (lecturerId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchBooksByLecturer(lecturerId);
      // FIX: Check if response.data.data is an array or has a books property
      let booksData = response.data?.data || [];
      // If it's an object with a books property, extract it
      if (booksData && !Array.isArray(booksData) && booksData.books) {
        booksData = booksData.books;
      }
      setBooks(booksData);
      return booksData;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch books by lecturer');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrendingBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchTrendingBooks();
      // FIX: Extract the books array from response.data.data
      const booksData = response.data?.data || [];
      setTrendingBooks(booksData);
      return booksData;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch trending books');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getSavedBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchSavedBooks();
      const savedData = response.data?.data || [];
      setSavedBooks(savedData);
      return savedData;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch saved books');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const saveBookHandler = useCallback(async (bookId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await saveBook(bookId);
      await getSavedBooks(); // Refresh saved books list
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getSavedBooks]);

  const unsaveBookHandler = useCallback(async (bookId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await unsaveBook(bookId);
      await getSavedBooks(); // Refresh saved books list
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unsave book');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getSavedBooks]);

  const isBookSaved = useCallback(async (bookId) => {
    try {
      const response = await checkSavedStatus(bookId);
      return response.data.isSaved;
    } catch (err) {
      return false;
    }
  }, []);

  return {
    books,
    trendingBooks,
    savedBooks,
    loading,
    error,
    getAllBooks,
    getBookById,
    getBooksByCategory,
    getBooksByLecturer,
    getTrendingBooks,
    getSavedBooks,
    saveBook: saveBookHandler,
    unsaveBook: unsaveBookHandler,
    isBookSaved
  };
};