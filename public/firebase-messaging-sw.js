// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Your Firebase config (same as in firebase.js)
const firebaseConfig = {
  apiKey: self.location.origin === 'http://localhost:5173' 
    ? import.meta.env.VITE_FIREBASE_API_KEY
    : 'your_prod_api_key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background notification received:', payload);
  
  const notificationTitle = payload.notification?.title || 'StudyBuddy';
  const notificationOptions = {
    body: payload.notification?.body || 'Your content is ready!',
    icon: '/vite.svg',
    badge: '/vite.svg',
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});