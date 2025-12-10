import { ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 left-6 z-50 w-12 h-12 bg-primary-600 text-white rounded-full 
                 flex items-center justify-center shadow-lg hover:bg-primary-700 
                 transition-all duration-300 hover:scale-105 ${
                   isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                 }`}
      aria-label="Scroll to top"
    >
      <ArrowUp size={24} />
    </button>
  );
}
