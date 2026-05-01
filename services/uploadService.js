import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const uploadBook = async (formData, onProgress) => {
  const response = await api.post(API_ENDPOINTS.UPLOAD_BOOK, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });
  return response;
};

export const uploadProfilePicture = async (formData) => {
  const response = await api.post('/users/upload-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};