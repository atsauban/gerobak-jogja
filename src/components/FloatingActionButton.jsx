import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function FloatingActionButton() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll to Top FAB */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 group relative w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full shadow-lg hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 animate-slide-up"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} className="text-white" />
          
          {/* Tooltip */}
          <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ke Atas
          </span>
        </button>
      )}
    </>
  );
}
