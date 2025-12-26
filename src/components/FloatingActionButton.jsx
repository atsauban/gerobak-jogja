import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp, MessageCircle } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

export default function FloatingActionButton() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  // Hide FAB on product detail pages
  const isProductPage = location.pathname.startsWith('/produk/');

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

  if (isProductPage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* WhatsApp FAB */}
      <WhatsAppButton
        showIcon={false}
        className="group relative w-14 h-14 bg-green-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:bg-green-700"
        aria-label="Chat WhatsApp"
      >
        <MessageCircle size={24} className="text-white" />

        {/* Tooltip */}
        <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat WhatsApp
        </span>
      </WhatsAppButton>

      {/* Scroll to Top FAB */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="group relative w-14 h-14 bg-gray-900 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:bg-gray-800"
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
