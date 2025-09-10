import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Impact', href: '/impact' },
    ...(user ? [{ name: 'Dashboard', href: '/dashboard' }] : []),
    { name: 'Contact', href: '/contact' },
    { name: 'Donate', href: '/donate' },
    { name: 'AI-Matching', href: '/match' },    
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    if (user.user_metadata?.name) return user.user_metadata.name;
    if (user.email) {
      const emailName = user.email.split('@')[0];
      return emailName
        .split(/[._-]/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    }
    return 'User';
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Mauka
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  location.pathname === item.href
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors">
                  <Bell size={20} />
                </button>
                
                <div className="hidden md:flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-orange-50 rounded-md">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 max-w-32 truncate">
                      {getUserDisplayName()}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors duration-200"
                  >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/auth/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors duration-200"
                >
                  Join as Volunteer
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-md border-t border-orange-100 shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-3 py-2 bg-orange-50 rounded-md">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {getUserDisplayName()}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md transition-colors"
                  >
                    <LogOut size={16} className="inline mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/signup"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}