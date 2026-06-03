// // src/services/auth.js (minimal)
// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// export const ProtectedRoute = () => {
//   const { user, loading } = useAuth();
//   if (loading) return <div>Loading...</div>;
//   return user ? <Outlet /> : <Navigate to="/login" />;
// };

export const getToken = () => localStorage.getItem('access_token');
export const removeToken = () => localStorage.removeItem('access_token');
