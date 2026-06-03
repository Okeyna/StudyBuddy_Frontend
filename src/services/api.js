import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = (email, password) => api.post('/auth/register', { email, password });
export const login = (email, password) => api.post('/auth/login', { email, password });
export const oauthVerify = (provider, token) => api.post('/auth/oauth-verify', { provider, token });

export const uploadFile = (formData) => api.post('/files/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  onUploadProgress: (progressEvent) => {
    // You can emit progress to a store if needed
  },
});
export const getDocuments = () => api.get('/files');
export const generateAudio = (docId) => api.post(`/audio/generate/${docId}`);
export const getAudioStream = (audioId) => api.get(`/audio/${audioId}`);
export const syncProgress = (audioId, position) => api.post(`/audio/${audioId}/progress`, { position });
export const getTranscript = (audioId) => api.get(`/audio/${audioId}/transcript`);

export const generateQuiz = (docId, numQuestions = 5) => api.post('/quiz/generate', { document_id: docId, num_questions: numQuestions });
export const submitQuiz = (quizId, answers) => api.post('/quiz/submit', { quiz_id: quizId, answers });

export const sendChatMessage = (message) => api.post('/chat/message', { message }); // or WebSocket
export const getProgress = () => api.get('/progress');

export const exchangeFirebaseToken = (idToken) => api.post('/auth/firebase-exchange', { id_token: idToken });
