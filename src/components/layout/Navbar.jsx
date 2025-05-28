import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  // Navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
  ];

  // Additional navigation items for authenticated users
  const authNavItems = currentUser ? [
    { name: 'Dashboard', path: '/dashboard' },
    userProfile?.role === 'organizer' && { name: 'Create Event', path: '/create-event' },
  ].filter(Boolean) : [];

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-primary-600">Ring</span>
            <span className="text-dark">Ready</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {/* Main Nav Links */}
          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary-600'
                    : 'text-dark hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Auth Nav Links */}
            {authNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary-600'
                    : 'text-dark hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-dark hover:text-primary-600 transition-colors"
                >
                  <FaUser />
                  <span>{userProfile?.displayName || 'Profile'}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="btn-outline py-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="font-medium text-dark hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-2">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-dark hover:text-primary-600 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-white shadow-lg overflow-hidden"
          >
            <div className="container-custom py-4 flex flex-col space-y-4">
              {/* Mobile Nav Links */}
              {navItems.concat(authNavItems).map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`py-2 font-medium ${
                    location.pathname === item.path
                      ? 'text-primary-600'
                      : 'text-dark'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Auth Buttons */}
              {currentUser ? (
                <div className="flex flex-col space-y-3 pt-2 border-t border-gray-200">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-dark"
                  >
                    <FaUser />
                    <span>{userProfile?.displayName || 'Profile'}</span>
                  </Link>
                  <button onClick={handleLogout} className="btn-outline w-full">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 pt-2 border-t border-gray-200">
                  <Link to="/login" className="btn-outline w-full">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary w-full">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;