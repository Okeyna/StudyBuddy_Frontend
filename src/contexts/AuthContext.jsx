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
        // Exchange Firebase token for our backend JWT
        const idToken = await firebaseUser.getIdToken();
        const { data } = await exchangeFirebaseToken(idToken);
        localStorage.setItem('access_token', data.access_token);
        setUser(firebaseUser);
        if (permission === 'granted') {
          await requestPermission();
        }
      } else {
        localStorage.removeItem('access_token');
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [permission]);

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const loginWithEmail = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const registerWithEmail = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);