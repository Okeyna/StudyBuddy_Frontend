import axios from 'axios';
import { getToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const register = (email, password) =>
  api.post('/auth/register', { email, password });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const oauthVerify = (provider, token) =>
  api.post('/auth/oauth-verify', { provider, token });

export const exchangeFirebaseToken = (idToken) =>
  api.post('/auth/firebase-exchange', { id_token: idToken });

// File endpoints
export const uploadFile = (formData) =>
  api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getDocuments = () => api.get('/files');

// Audio endpoints
export const generateAudio = (docId) =>
  api.post(`/audio/generate/${docId}`);

export const getAudioStream = (audioId) =>
  api.get(`/audio/${audioId}`);

export const syncProgress = (audioId, position) =>
  api.post(`/audio/${audioId}/progress`, { position });

export const getTranscript = (audioId) =>
  api.get(`/audio/${audioId}/transcript`);

// Quiz endpoints
export const generateQuiz = (docId, numQuestions = 5) =>
  api.post('/quiz/generate', {
    document_id: docId,
    num_questions: numQuestions,
  });

export const submitQuiz = (quizId, answers) =>
  api.post('/quiz/submit', { quiz_id: quizId, answers });

// Chat endpoint
export const sendChatMessage = (message) =>
  api.post('/chat/message', { message });

// Progress endpoint
export const getProgress = () => api.get('/progress');

export default api;
