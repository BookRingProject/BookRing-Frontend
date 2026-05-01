import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const fetchAllLecturers = async () => {
  const response = await api.get(API_ENDPOINTS.LECTURERS);
  return response;
};

export const fetchLecturerById = async (lecturerId) => {
  const response = await api.get(`${API_ENDPOINTS.LECTURERS}/${lecturerId}`);
  return response;
};

export const followLecturer = async (lecturerId) => {
  const response = await api.post(`${API_ENDPOINTS.FOLLOW}/${lecturerId}`);
  return response;
};

export const unfollowLecturer = async (lecturerId) => {
  const response = await api.delete(`${API_ENDPOINTS.FOLLOW}/${lecturerId}`);
  return response;
};

export const checkFollowStatus = async (lecturerId) => {
  const response = await api.get(`${API_ENDPOINTS.FOLLOW}/check/${lecturerId}`);
  return response;
};

export const fetchFollowingLecturers = async () => {
  const response = await api.get(API_ENDPOINTS.FOLLOW);
  return response;
};

export const fetchLecturerFollowers = async (lecturerId) => {
  const response = await api.get(`${API_ENDPOINTS.LECTURERS}/${lecturerId}/followers`);
  return response;
};

// Dashboard endpoints for lecturer
export const fetchDashboardStats = async () => {
  const response = await api.get(API_ENDPOINTS.DASHBOARD_STATS);
  return response;
};

export const fetchTopBooks = async () => {
  const response = await api.get(API_ENDPOINTS.DASHBOARD_TOP_BOOKS);
  return response;
};

export const fetchPerformanceData = async () => {
  const response = await api.get(API_ENDPOINTS.DASHBOARD_PERFORMANCE);
  return response;
};

export const updateLecturerProfile = async (data) => {
  const response = await api.put('/lecturers/profile', data);
  return response;
};

export const fetchMyBooks = async () => {
  const response = await api.get('/books/my-books');
  return response;
};

// ADD THIS FUNCTION - DELETE BOOK
export const deleteBook = async (bookId) => {
  const response = await api.delete(`/books/${bookId}`);
  return response;
};