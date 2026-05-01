// 10 categories, API endpoints, roles

export const CATEGORIES = [
  'Mathematics',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Engineering',
  'Medicine & Health',
  'Business & Economics',
  'Law',
  'Humanities & Arts'
];

export const USER_ROLES = {
  STUDENT: 'student',
  LECTURER: 'lecturer'
};

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  ME: '/auth/me',
  
  // Books
  BOOKS: '/books',
  UPLOAD_BOOK: '/books/upload',
  SAVE_BOOK: '/saves',
  TRENDING: '/trending/books',
  
  // Lecturers
  LECTURERS: '/lecturers',
  FOLLOW: '/follows',
  
  // Categories
  CATEGORIES: '/categories',
  
  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
  DASHBOARD_TOP_BOOKS: '/dashboard/top-books',
  DASHBOARD_PERFORMANCE: '/dashboard/performance',
  
  // Student Library
  STUDENT_LIBRARY: '/students/library'
};

export const UPLOAD_STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  SUMMARIZING: 'summarizing',
  GENERATING_AUDIO: 'generating_audio',
  COMPLETED: 'completed',
  ERROR: 'error'
};

export const STORAGE_KEYS = {
  TOKEN: 'bookring_token',
  USER: 'bookring_user',
  THEME: 'bookring_theme'
};

export const FILE_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB
export const ALLOWED_FILE_TYPES = ['application/pdf'];