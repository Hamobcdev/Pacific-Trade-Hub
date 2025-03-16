import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, Sun, Moon, User, LogIn, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isDarkTheme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setIsMenuOpen(false);
  
  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-pacifico">
            Pacific Trade Hub
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/marketplace" className="hover:text-primary-light">
              Marketplace
            </Link>
            <Link to="/cart" className="relative hover:text-primary-light">
              <ShoppingCart size={20} />
              {/* Cart Count Badge goes here if needed */}
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-6">
                <Link to="/profile" className="hover:text-primary-light flex items-center gap-2">
                  <User size={20} />
                  {user?.name ? user.name.split(' ')[0] : 'Profile'}
                </Link>
                <button 
                  onClick={handleAuthAction}
                  className="hover:text-primary-light flex items-center gap-2"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={handleAuthAction}
                className="hover:text-primary-light flex items-center gap-2"
              >
                <LogIn size={20} />
                Sign In
              </button>
            )}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-primary-dark"
            >
              {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/marketplace" 
                className="hover:text-primary-light" 
                onClick={closeMenu}
              >
                Marketplace
              </Link>
              <Link 
                to="/cart" 
                className="hover:text-primary-light flex items-center gap-2" 
                onClick={closeMenu}
              >
                <ShoppingCart size={20} />
                Cart
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/profile" 
                    className="hover:text-primary-light flex items-center gap-2" 
                    onClick={closeMenu}
                  >
                    <User size={20} />
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      handleAuthAction();
                      closeMenu();
                    }}
                    className="hover:text-primary-light flex items-center gap-2 text-left"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    handleAuthAction();
                    closeMenu();
                  }}
                  className="hover:text-primary-light flex items-center gap-2 text-left"
                >
                  <LogIn size={20} />
                  Sign In
                </button>
              )}
              
              <button
                onClick={() => {
                  toggleTheme();
                  closeMenu();
                }}
                className="flex items-center gap-2 hover:text-primary-light"
              >
                {isDarkTheme ? (
                  <>
                    <Sun size={20} />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon size={20} />
                    Dark Mode
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;