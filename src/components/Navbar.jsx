// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { FaBook, FaChartLine, FaSignOutAlt, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all">
                <FaBook className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-gray-800 hover:text-gray-900 transition-colors">
                StudyBuddy
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {user && (
              <>
                <Link 
                  to="/" 
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive('/') 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Dashboard
                </Link>
                
                <Link 
                  to="/progress" 
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive('/progress') 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Progress
                </Link>
              </>
            )}
          </div>
          
          {/* Desktop User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <FaUserCircle className="text-gray-400 text-xl" />
                  <span className="text-sm text-gray-700">{user.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-400 transition-all duration-200"
                >
                  <FaSignOutAlt size={14} />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign in
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t mt-2 py-4 space-y-3 animate-fade-in">
            {user && (
              <>
                <Link 
                  to="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2 text-sm font-medium ${
                    isActive('/') 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>
                
                <Link 
                  to="/progress" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2 text-sm font-medium ${
                    isActive('/progress') 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Progress
                </Link>
                
                <div className="border-t pt-3 mt-3">
                  <div className="px-4 py-2 flex items-center space-x-2">
                    <FaUserCircle className="text-gray-400 text-xl" />
                    <span className="text-sm text-gray-700">{user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
            
            {!user && (
              <div className="space-y-2 px-4">
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 text-center"
                >
                  Sign in
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};