import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { exchangeFirebaseToken } from '../services/api';
import { usePushNotifications } from '../hooks/usePushNotifications';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { requestPermission, permission } = usePushNotifications();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Exchange Firebase token for our backend JWT
          const idToken = await firebaseUser.getIdToken();
          const { data } = await exchangeFirebaseToken(idToken);
          localStorage.setItem('access_token', data.access_token);
          setUser(firebaseUser);
          
          // Request notification permission if already granted
          if (permission === 'granted') {
            await requestPermission();
          }
        } catch (error) {
          console.error('Error during authentication:', error);
          setUser(null);
          localStorage.removeItem('access_token');
        }
      } else {
        localStorage.removeItem('access_token');
        setUser(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [permission, requestPermission]);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Email login failed:', error);
      throw error;
    }
  };

  const registerWithEmail = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};