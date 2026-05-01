import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const login = async (email, password, role) => {
  const response = await api.post(API_ENDPOINTS.LOGIN, {
    email,
    password,
    role
  });
  return response;
};

export const signup = async (userData, role) => {
  const response = await api.post(API_ENDPOINTS.SIGNUP, {
    ...userData,
    role
  });
  return response;
};

export const getCurrentUser = async () => {
  const response = await api.get(API_ENDPOINTS.ME);
  return response;
};

export const updateProfile = async (data) => {
  const response = await api.put('/users/profile', data);
  return response;
};

export const logout = () => {
  localStorage.removeItem('bookring_token');
  localStorage.removeItem('bookring_user');
};