// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBook, FaChartLine, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-100 shadow-md px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg shadow-lg group-hover:scale-105 transition-transform">
            <FaBook className="text-white text-xl" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            StudyBuddy
          </span>
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {user && (
            <>
              <Link 
                to="/" 
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive('/') 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-blue-200 hover:text-blue-600'
                }`}
              >
                <FaBook size={16} />
                <span>Dashboard</span>
              </Link>
              
              <Link 
                to="/progress" 
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive('/progress') 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-blue-200 hover:text-blue-600'
                }`}
              >
                <FaChartLine size={16} />
                <span>Progress</span>
              </Link>
            </>
          )}
        </div>
        
        {/* User Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex items-center space-x-2 bg-white/70 rounded-full px-3 py-1">
                <FaUserCircle className="text-blue-600 text-xl" />
                <span className="text-sm font-medium text-gray-700">{user.email}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-1 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <FaSignOutAlt size={14} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="flex space-x-3">
              <Link 
                to="/login" 
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};