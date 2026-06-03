// src/hooks/usePushNotifications.js
import { useEffect, useState } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { auth } from '../services/firebase';
import { exchangeFirebaseToken } from '../services/api';

export const usePushNotifications = () => {
  const [permission, setPermission] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  const [notification, setNotification] = useState(null);

  // Request permission and get FCM token
  const requestPermission = async () => {
    try {
      // Check if browser supports notifications
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return null;
      }

      // Request permission
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult !== 'granted') {
        console.warn('Notification permission denied');
        return null;
      }

      // Get FCM token
      const messaging = getMessaging();
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

      if (!vapidKey) {
        console.error('VAPID key not found in environment variables');
        return null;
      }

      const token = await getToken(messaging, { vapidKey });
      setFcmToken(token);

      // Send token to backend
      await sendTokenToBackend(token);

      return token;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return null;
    }
  };

  // Send FCM token to backend for storage
  const sendTokenToBackend = async (token) => {
    try {
      // First ensure we have a valid backend JWT
      const user = auth.currentUser;
      if (user) {
        const idToken = await user.getIdToken();
        await exchangeFirebaseToken(idToken); // Ensures backend JWT is fresh
      }

      // Send token to backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/push/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ fcm_token: token, platform: 'web' }),
      });

      if (!response.ok) {
        throw new Error('Failed to register token with backend');
      }

      console.log('FCM token registered successfully');
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  };

  // Listen for foreground messages
  const setupForegroundListener = () => {
    try {
      const messaging = getMessaging();
      onMessage(messaging, (payload) => {
        console.log('Foreground notification received:', payload);
        
        // Show browser notification even in foreground
        if (Notification.permission === 'granted') {
          new Notification(payload.notification?.title || 'StudyBuddy', {
            body: payload.notification?.body || 'New update available',
            icon: '/vite.svg',
          });
        }
        
        // Update state for in-app notification display
        setNotification({
          title: payload.notification?.title,
          body: payload.notification?.body,
          data: payload.data,
          timestamp: new Date(),
        });
      });
    } catch (error) {
      console.error('Error setting up foreground listener:', error);
    }
  };

  // Check existing permission on mount
  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission);
    }
  }, []);

  // Auto-request permission when user logs in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && permission === 'granted') {
        await requestPermission();
        setupForegroundListener();
      } else if (user && permission === 'default') {
        // Optionally ask for permission after login
        // You might want to show a button instead of auto-asking
        console.log('User logged in but notifications not enabled');
      }
    });

    return () => unsubscribe();
  }, [permission]);

  return {
    permission,
    fcmToken,
    notification,
    requestPermission,
    sendTokenToBackend,
    clearNotification: () => setNotification(null),
  };
};