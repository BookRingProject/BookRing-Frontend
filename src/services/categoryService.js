import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const fetchAllCategories = async () => {
  const response = await api.get(API_ENDPOINTS.CATEGORIES);
  return response;
};

export const fetchBooksByCategoryId = async (categoryId) => {
  const response = await api.get(`${API_ENDPOINTS.CATEGORIES}/${categoryId}/books`);
  return response;
};