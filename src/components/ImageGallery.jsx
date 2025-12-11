import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

export default function ImageGallery({ 
  images, 
  initialIndex = 0, 
  onClose,
  title = '',
  showCounter = true,
  enableZoom = true
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);
  const imageRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Focus trap for accessibility
  useFocusTrap(true, modalRef);

  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Focus close button when modal opens
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case '+':
        case '=':
          if (enableZoom && !isZoomed) {
            e.preventDefault();
            setIsZoomed(true);
          }
          break;
        case '-':
          if (enableZoom && isZoomed) {
            e.preventDefault();
            setIsZoomed(false);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isZoomed, enableZoom, onClose]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsZoomed(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsZoomed(false);
  };

  const handleImageMouseMove = (e) => {
    if (!isZoomed || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  const toggleZoom = () => {
    if (enableZoom) {
      setIsZoomed(!isZoomed);
    }
  };

  if (!images || images.length === 0) return null;

  const currentImage = typeof images[currentIndex] === 'string' 
    ? images[currentIndex] 
    : images[currentIndex]?.url || images[currentIndex]?.image || images[currentIndex];

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-modal-title"
      aria-describedby="gallery-modal-description"
    >
      {/* Close Button */}
      <button
        ref={closeButtonRef}
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50 z-10"
        aria-label="Close gallery"
      >
        <X size={28} />
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50 z-10"
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Zoom Button */}
      {enableZoom && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleZoom();
          }}
          className="absolute top-6 left-6 text-white hover:text-gray-300 transition-colors bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50 z-10"
          aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
        >
          {isZoomed ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
        </button>
      )}

      {/* Image Container */}
      <div
        className="max-w-7xl w-full animate-scale-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            ref={imageRef}
            src={currentImage}
            alt={title || `Image ${currentIndex + 1} of ${images.length}`}
            className={`w-full h-auto rounded-2xl shadow-2xl transition-transform duration-300 ${
              isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            style={{
              transform: isZoomed ? `scale(2)` : 'scale(1)',
              transformOrigin: isZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center',
            }}
            onMouseMove={handleImageMouseMove}
            onClick={toggleZoom}
            id="gallery-modal-description"
          />

          {/* Image Counter */}
          {showCounter && images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Title */}
        {title && (
          <div className="text-center mt-6">
            <p id="gallery-modal-title" className="text-white text-2xl font-bold mb-2">
              {title}
            </p>
          </div>
        )}

        {/* Keyboard Hints */}
        <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-xs space-y-1 hidden md:block">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/20 rounded">←</kbd>
            <kbd className="px-2 py-1 bg-white/20 rounded">→</kbd>
            <span>Navigate</span>
          </div>
          {enableZoom && (
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/20 rounded">+</kbd>
              <kbd className="px-2 py-1 bg-white/20 rounded">-</kbd>
              <span>Zoom</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/20 rounded">ESC</kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}

