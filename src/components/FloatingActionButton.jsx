import { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../config/contact';

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
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* WhatsApp FAB */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-14 h-14 bg-green-500 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 animate-gentle-glow"
        aria-label="Chat WhatsApp"
      >
        <MessageCircle size={24} className="text-white" />
        
        {/* Tooltip */}
        <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat WhatsApp
        </span>

        {/* Gentle pulse effect */}
        <span className="absolute inset-0 rounded-full bg-green-400 animate-subtle-pulse"></span>
      </a>

      {/* Scroll to Top FAB */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="group relative w-14 h-14 bg-primary-600 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} className="text-white" />
          
          {/* Tooltip */}
          <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ke Atas
          </span>
        </button>
      )}
    </div>
  );
}
