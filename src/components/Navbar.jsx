import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ScrollLink } from 'react-scroll';
import { Menu, X } from 'lucide-react';
import PropTypes from 'prop-types';

const Navbar = ({ sticky = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    userRole: 'citizen'
  });

  const navLinks = [
    { to: "home", label: "Home" },
    { to: "about", label: "About" }
  ];

  // Check auth state on initial load and route changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      setIsAuthenticated(!!token && !!userData);
    };

    checkAuth();
    // Listen for storage changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    // Clear all auth-related data from both storages
    ['token', 'userData', 'userRole'].forEach(item => {
      localStorage.removeItem(item);
      sessionStorage.removeItem(item);
    });
    
    setIsAuthenticated(false);
    setAuthState({
      isLoggedIn: false,
      userRole: 'citizen'
    });
    
    window.location.href = '/';
  };

  const getDashboardLink = () => {
    switch(authState.userRole) {
      case 'department': return '/department-dashboard';
      case 'agency': return '/agency-dashboard';
      case 'admin':
      case 'dev': return '/admin-dashboard';
      default: return '/dashboard';
    }
  };

  return (
    <nav className={`fixed w-full ${
      sticky 
        ? "bg-[#dee2e6] z-12 rounded-full mt-4 mx-2 w-[99%] justify-center p-1 shadow-lg" 
        : "bg-transparent"
    } z-20 transition-all duration-300`}>
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-2">
            <img 
              src="./citylogo.png" 
              alt="Logo" 
              className="w-16 h-14 xs:w-20 xs:h-16 sm:w-24 sm:h-20" 
            />
            <h1 className={`text-xl xs:text-2xl font-semibold hover:text-[#343a40] cursor-pointer ${
              sticky ? "text-gray-800" : "hidden"
            }`}>
              City Synergy
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <ScrollLink
                key={link.to}
                to={link.to}
                smooth={true}
                duration={500}
                className={`font-semibold hover:text-[#343a40] cursor-pointer ${
                  sticky ? "text-gray-800" : "text-white"
                }`}
              >
                {link.label}
              </ScrollLink>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link 
                  to={getDashboardLink()}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={`h-6 w-6 ${sticky ? "text-gray-800" : "text-white"}`} />
            ) : (
              <Menu className={`h-6 w-6 ${sticky ? "text-gray-800" : "text-white"}`} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden absolute right-4 mt-2 z-50">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-48">
              <div className="py-2">
                {navLinks.map((link) => (
                  <ScrollLink
                    key={link.to}
                    to={link.to}
                    smooth={true}
                    duration={500}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    {link.label}
                  </ScrollLink>
                ))}
                
                {isAuthenticated ? (
                  <>
                    <Link
                      to={getDashboardLink()}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={toggleMenu}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        toggleMenu();
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={toggleMenu}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={toggleMenu}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  sticky: PropTypes.bool
};

export default Navbar;