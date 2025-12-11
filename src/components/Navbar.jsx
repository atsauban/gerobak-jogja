import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        // Return focus to menu button
        if (buttonRef.current) {
          buttonRef.current.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative">
                <img 
                  src="/images/logo.webp" 
                  alt="Gerobak Jogja Logo" 
                  className="h-8 w-8 sm:h-10 sm:w-10 object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => e.target.style.display = 'none'}
                />
                <div className="absolute inset-0 bg-primary-400 rounded-full blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <span className="text-lg sm:text-2xl font-display font-bold gradient-text whitespace-nowrap group-hover:tracking-wide transition-all duration-300">
                Gerobak Jogja
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <Link 
              to="/" 
              className={`relative px-4 py-2 font-medium transition-all duration-300 group ${
                isActive('/') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Beranda
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-primary-700 transform transition-transform duration-300 ${
                isActive('/') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </Link>
            <Link 
              to="/katalog" 
              className={`relative px-4 py-2 font-medium transition-all duration-300 group ${
                isActive('/katalog') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Katalog
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-primary-700 transform transition-transform duration-300 ${
                isActive('/katalog') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </Link>
            <Link 
              to="/galeri" 
              className={`relative px-4 py-2 font-medium transition-all duration-300 group ${
                isActive('/galeri') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Galeri
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-primary-700 transform transition-transform duration-300 ${
                isActive('/galeri') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </Link>
            <Link 
              to="/tentang" 
              className={`relative px-4 py-2 font-medium transition-all duration-300 group ${
                isActive('/tentang') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Tentang
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-primary-700 transform transition-transform duration-300 ${
                isActive('/tentang') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </Link>
            <Link 
              to="/kontak" 
              className={`relative px-4 py-2 font-medium transition-all duration-300 group ${
                isActive('/kontak') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Kontak
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-primary-700 transform transition-transform duration-300 ${
                isActive('/kontak') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </Link>
            <Link 
              to="/blog" 
              className={`relative px-4 py-2 font-medium transition-all duration-300 group ${
                isActive('/blog') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Blog
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-primary-700 transform transition-transform duration-300 ${
                isActive('/blog') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button 
              ref={buttonRef}
              onClick={() => setIsOpen(!isOpen)} 
              className="relative text-gray-700 hover:text-primary-600 transition-all duration-300 p-2 hover:bg-primary-50 rounded-lg group"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <div className="relative z-10">
                {isOpen ? <X size={24} className="transition-transform duration-300 rotate-90" /> : <Menu size={24} className="transition-transform duration-300" />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div 
          id="mobile-menu"
          ref={menuRef}
          className="lg:hidden animate-slide-down"
          role="menu"
          aria-label="Main navigation"
        >
          <div className="px-3 pt-3 pb-4 space-y-2 sm:px-4 bg-gradient-to-b from-white to-gray-50 border-t shadow-lg">
            <Link 
              to="/" 
              className={`block px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-md transform scale-105' 
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600 hover:pl-6'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Beranda
            </Link>
            <Link 
              to="/katalog" 
              className={`block px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive('/katalog') 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-md transform scale-105' 
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600 hover:pl-6'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Katalog
            </Link>
            <Link 
              to="/galeri" 
              className={`block px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive('/galeri') 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-md transform scale-105' 
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600 hover:pl-6'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Galeri
            </Link>
            <Link 
              to="/tentang" 
              className={`block px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive('/tentang') 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-md transform scale-105' 
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600 hover:pl-6'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Tentang
            </Link>
            <Link 
              to="/kontak" 
              className={`block px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive('/kontak') 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-md transform scale-105' 
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600 hover:pl-6'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Kontak
            </Link>
            <Link 
              to="/blog" 
              className={`block px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive('/blog') 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-md transform scale-105' 
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600 hover:pl-6'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
