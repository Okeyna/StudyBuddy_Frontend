import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = { /* your config */ };
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestPushPermission = async () => {
  const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
  // Send token to backend: api.post('/push/register', { token })
  return token;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => resolve(payload));
  });