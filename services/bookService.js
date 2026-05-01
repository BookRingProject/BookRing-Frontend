import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const fetchAllBooks = async (params = {}) => {
  const response = await api.get(API_ENDPOINTS.BOOKS, { params });
  return response;
};

export const fetchBookById = async (bookId) => {
  const response = await api.get(`${API_ENDPOINTS.BOOKS}/${bookId}`);
  return response;
};

export const fetchBooksByCategory = async (category) => {
  const response = await api.get(`${API_ENDPOINTS.CATEGORIES}/${category}/books`);
  return response;
};

export const fetchBooksByLecturer = async (lecturerId) => {
  const response = await api.get(`${API_ENDPOINTS.LECTURERS}/${lecturerId}/books`);
  return response;
};

export const fetchTrendingBooks = async () => {
  const response = await api.get(API_ENDPOINTS.TRENDING);
  return response;
};

export const saveBook = async (bookId) => {
  const response = await api.post(`${API_ENDPOINTS.SAVE_BOOK}/${bookId}`);
  return response;
};

export const unsaveBook = async (bookId) => {
  const response = await api.delete(`${API_ENDPOINTS.SAVE_BOOK}/${bookId}`);
  return response;
};

export const checkSavedStatus = async (bookId) => {
  const response = await api.get(`${API_ENDPOINTS.SAVE_BOOK}/check/${bookId}`);
  return response;
};

export const fetchSavedBooks = async () => {
  const response = await api.get(API_ENDPOINTS.SAVE_BOOK);
  return response;
};

export const deleteBook = async (bookId) => {
  const response = await api.delete(`${API_ENDPOINTS.BOOKS}/${bookId}`);
  return response;
};