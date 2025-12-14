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
            ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20'
            : 'bg-white shadow-sm'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-400 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                  <img
                    src="/images/logo.webp"
                    alt="Gerobak Jogja Logo"
                    className="h-10 w-10 sm:h-12 sm:w-12 object-contain relative z-10 transition-transform duration-300 group-hover:rotate-6"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-display font-bold gradient-text tracking-tight group-hover:tracking-wide transition-all duration-300">
                    Gerobak Jogja
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500 font-medium tracking-widest uppercase">
                    Pusat Gerobak Premium
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
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
                  className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-full hover:bg-gray-50 ${isActive(link.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600'
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Separator */}
              <div className="w-px h-6 bg-gray-200 mx-2"></div>

              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-200 group"
                aria-label="Cari produk"
              >
                <Search size={20} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Mobile Menu Button & Search */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all"
                aria-label="Cari"
              >
                <Search size={24} />
              </button>

              <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div
            id="mobile-menu"
            ref={menuRef}
            className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-2xl border-t border-gray-100 animate-slide-down overflow-hidden z-[90]"
          >
            <div className="px-4 py-6 space-y-2 max-h-[80vh] overflow-y-auto">
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
                  className={`block px-5 py-4 rounded-xl text-lg font-semibold transition-all duration-200 border-l-4 ${isActive(link.path)
                      ? 'bg-primary-50/50 text-primary-700 border-primary-500'
                      : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900'
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
