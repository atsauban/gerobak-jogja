import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getWhatsAppUrl } from '../config/contact';

export default function WhatsAppFloat() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 
                 text-white rounded-full flex items-center justify-center shadow-2xl 
                 hover:from-green-600 hover:to-green-700 transition-all duration-300 
                 hover:scale-105 ${
                   isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                 }`}
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></span>
    </a>
  );
}
