import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const fetchMyLibrary = async () => {
  const response = await api.get(API_ENDPOINTS.STUDENT_LIBRARY);
  return response;
};

export const fetchSavedBooksWithDetails = async () => {
  const response = await api.get('/students/saved-books');
  return response;
};

export const recordDownload = async (bookId, type) => {
  const response = await api.post(`/students/downloads`, { bookId, type });
  return response;
};