// src/utils/constants.js

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    FIREBASE_EXCHANGE: '/auth/firebase-exchange',
    LOGOUT: '/auth/logout',
  },
  FILES: {
    UPLOAD: '/files/upload',
    LIST: '/files',
    DELETE: (id) => `/files/${id}`,
  },
  AUDIO: {
    STREAM: (id) => `/audio/${id}`,
    GENERATE: (docId) => `/audio/generate/${docId}`,
    PROGRESS: (id) => `/audio/${id}/progress`,
    TRANSCRIPT: (id) => `/audio/${id}/transcript`,
  },
  QUIZ: {
    GENERATE: '/quiz/generate',
    SUBMIT: '/quiz/submit',
    GET_RESULTS: (id) => `/quiz/${id}/results`,
  },
  CHAT: {
    MESSAGE: '/chat/message',
    STREAM: '/chat/stream',
  },
  PROGRESS: {
    GET: '/progress',
    UPDATE: '/progress/update',
  },
  PUSH: {
    REGISTER: '/push/register',
    UNREGISTER: '/push/unregister',
  },
};

// File Upload Constraints
export const FILE_CONSTRAINTS = {
  MAX_SIZE: 20 * 1024 * 1024, // 20MB
  ALLOWED_TYPES: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
  ALLOWED_EXTENSIONS: ['.pdf', '.docx', '.txt'],
};

// Audio Playback Settings
export const AUDIO_CONSTRAINTS = {
  DEFAULT_PLAYBACK_RATE: 1.0,
  PLAYBACK_RATES: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
  PROGRESS_SYNC_INTERVAL: 5000, // 5 seconds
  MAX_HISTORY_ITEMS: 50,
};

// Quiz Settings
export const QUIZ_CONSTRAINTS = {
  MIN_QUESTIONS: 3,
  MAX_QUESTIONS: 20,
  DEFAULT_QUESTIONS: 5,
  QUESTION_TYPES: ['multiple_choice', 'true_false', 'fill_blank'],
  PASSING_SCORE: 70, // percentage
};

// Subscription Tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
};

export const SUBSCRIPTION_FEATURES = {
  [SUBSCRIPTION_TIERS.FREE]: {
    maxDocuments: 5,
    maxAudioPerDocument: 1,
    maxQuizAttempts: 3,
    hasChatSupport: false,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  [SUBSCRIPTION_TIERS.PREMIUM]: {
    maxDocuments: Infinity,
    maxAudioPerDocument: Infinity,
    maxQuizAttempts: Infinity,
    hasChatSupport: true,
    maxFileSize: 50 * 1024 * 1024, // 50MB
  },
  [SUBSCRIPTION_TIERS.ENTERPRISE]: {
    maxDocuments: Infinity,
    maxAudioPerDocument: Infinity,
    maxQuizAttempts: Infinity,
    hasChatSupport: true,
    maxFileSize: 100 * 1024 * 1024, // 100MB
  },
};

// Push Notification Types
export const NOTIFICATION_TYPES = {
  AUDIO_READY: 'audio_ready',
  QUIZ_READY: 'quiz_ready',
  PROGRESS_REMINDER: 'progress_reminder',
  SUBSCRIPTION_EXPIRY: 'subscription_expiry',
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  AUDIO_DETAIL: (id) => `/audio/${id}`,
  QUIZ: (docId) => `/quiz/${docId}`,
  PROGRESS: '/progress',
  SETTINGS: '/settings',
  SUBSCRIPTION: '/subscription',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  RECENT_DOCUMENTS: 'recent_documents',
  AUDIO_HISTORY: 'audio_history',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  FILE_TOO_LARGE: `File size exceeds the maximum allowed (${FILE_CONSTRAINTS.MAX_SIZE / (1024 * 1024)}MB).`,
  INVALID_FILE_TYPE: `File type not supported. Allowed: ${FILE_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')}`,
  UPLOAD_FAILED: 'Failed to upload file. Please try again.',
  AUDIO_GENERATION_FAILED: 'Failed to generate audio. Please try again.',
  QUIZ_GENERATION_FAILED: 'Failed to generate quiz. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: 'File uploaded successfully!',
  AUDIO_GENERATED: 'Audio generated successfully!',
  QUIZ_SUBMITTED: 'Quiz submitted! Check your results.',
  PROGRESS_SAVED: 'Progress saved!',
};

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Date Formats
export const DATE_FORMATS = {
  FULL: 'MMMM Do, YYYY',
  SHORT: 'MM/DD/YYYY',
  TIME: 'h:mm A',
  DATE_TIME: 'MMM Do, YYYY h:mm A',
};

// Helper Functions
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename) => {
  return filename?.split('.').pop()?.toLowerCase();
};

export const isAllowedFileType = (filename) => {
  const ext = getFileExtension(filename);
  return FILE_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(`.${ext}`);
};

export const isWithinFileSizeLimit = (size) => {
  return size <= FILE_CONSTRAINTS.MAX_SIZE;
};