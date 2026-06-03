import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <div className="flex space-x-6">
        <Link to="/" className="text-gray-700 hover:text-blue-500 font-medium">
          StudyBuddy
        </Link>
        {user && (
          <Link to="/progress" className="text-gray-700 hover:text-blue-500 font-medium">
            Progress
          </Link>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {user ? (
          // Logged in - show user email and logout button
          <>
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          // Logged out - show login and register links
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-500">
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};