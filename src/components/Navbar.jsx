import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import SearchOverlay from './SearchOverlay';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Scroll Logic
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const location = useLocation();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Glass effect trigger
      setScrolled(currentScrollY > 20);

      // Hide/Show on scroll
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false); // Scroll Down -> Hide
      } else {
        setIsVisible(true);  // Scroll Up -> Show
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
  }, [location]);

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

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen || isSearchOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen, isSearchOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed w-full z-[100] transition-all duration-300 transform ${isVisible ? 'translate-y-0' : '-translate-y-full'
          } ${scrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100'
            : 'bg-white'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 lg:h-18 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2.5 group">
                <img
                  src="/images/logo.webp"
                  alt="Gerobak Jogja Logo"
                  className="h-9 w-9 sm:h-10 sm:w-10 object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => e.target.style.display = 'none'}
                />
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl font-display font-bold text-gray-900 tracking-tight">
                    Gerobak Jogja
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium tracking-wide hidden sm:block">
                    Pusat Gerobak Premium
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { path: '/', label: 'Beranda' },
                { path: '/katalog', label: 'Katalog' },
                { path: '/galeri', label: 'Galeri' },
                { path: '/tentang', label: 'Tentang' },
                { path: '/blog', label: 'Blog' },
                { path: '/kontak', label: 'Kontak' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${isActive(link.path)
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"></span>
                  )}
                </Link>
              ))}

              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="ml-2 p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                aria-label="Cari produk"
              >
                <Search size={18} />
              </button>
            </div>

            {/* Mobile Menu Button & Search */}
            <div className="lg:hidden flex items-center gap-1">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                aria-label="Cari"
              >
                <Search size={20} />
              </button>

              <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div
            id="mobile-menu"
            ref={menuRef}
            className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 animate-slide-down overflow-hidden z-[90]"
          >
            <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
              {[
                { path: '/', label: 'Beranda' },
                { path: '/katalog', label: 'Katalog' },
                { path: '/galeri', label: 'Galeri' },
                { path: '/tentang', label: 'Tentang' },
                { path: '/blog', label: 'Blog' },
                { path: '/kontak', label: 'Kontak' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${isActive(link.path)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Global Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
