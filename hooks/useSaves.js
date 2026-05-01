'use client';

import { useState, useCallback } from 'react';
import {
  saveBook,
  unsaveBook,
  checkSavedStatus,
  fetchSavedBooks
} from '../services/bookService';

export const useSaves = () => {
  const [savedBookIds, setSavedBookIds] = useState([]);
  const [savedBooksList, setSavedBooksList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSavedBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchSavedBooks();
      // FIX: Access the nested data array
      const books = response.data.data || [];
      setSavedBooksList(books);
      const ids = books.map(book => book._id || book.bookId);
      setSavedBookIds(ids);
      return books;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load saved books');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const saveBookHandler = useCallback(async (bookId) => {
    setLoading(true);
    setError(null);
    try {
      await saveBook(bookId);
      setSavedBookIds(prev => [...prev, bookId]);
      await loadSavedBooks(); // Refresh the full list
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, [loadSavedBooks]);

  const unsaveBookHandler = useCallback(async (bookId) => {
    setLoading(true);
    setError(null);
    try {
      await unsaveBook(bookId);
      setSavedBookIds(prev => prev.filter(id => id !== bookId));
      await loadSavedBooks(); // Refresh the full list
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unsave book');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, [loadSavedBooks]);

  const checkSaved = useCallback(async (bookId) => {
    try {
      const response = await checkSavedStatus(bookId);
      return response.data.isSaved;
    } catch (err) {
      return false;
    }
  }, []);

  const toggleSave = useCallback(async (bookId, isCurrentlySaved) => {
    if (isCurrentlySaved) {
      return await unsaveBookHandler(bookId);
    } else {
      return await saveBookHandler(bookId);
    }
  }, [saveBookHandler, unsaveBookHandler]);

  return {
    savedBookIds,
    savedBooksList,
    loading,
    error,
    loadSavedBooks,
    saveBook: saveBookHandler,
    unsaveBook: unsaveBookHandler,
    checkSaved,
    toggleSave
  };
};