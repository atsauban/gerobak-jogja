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
        className="flex flex-col items-center justify-center w-full h-full max-w-6xl mx-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title - Top */}
        {title && (
          <div className="text-center mb-4 px-4">
            <p id="gallery-modal-title" className="text-white text-xl sm:text-2xl font-semibold">
              {title}
            </p>
          </div>
        )}

        {/* Image Wrapper - Contain without cropping */}
        <div className="relative flex items-center justify-center w-full" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <img
            ref={imageRef}
            src={currentImage}
            alt={title || `Image ${currentIndex + 1} of ${images.length}`}
            className={`max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-2xl shadow-2xl transition-transform duration-300 bg-white/5 ${
              isZoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in'
            }`}
            style={{
              transformOrigin: isZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center',
            }}
            onMouseMove={handleImageMouseMove}
            onClick={toggleZoom}
            id="gallery-modal-description"
          />
        </div>

        {/* Bottom Info Bar */}
        <div className="flex items-center justify-center gap-4 mt-6 px-4">
          {/* Image Counter */}
          {showCounter && images.length > 1 && (
            <div className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium border border-white/10">
              {currentIndex + 1} / {images.length}
            </div>
          )}
          
          {/* Keyboard Hints - Desktop only */}
          <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-md text-white/70 px-4 py-2 rounded-full text-xs border border-white/10">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-white">←</kbd>
              <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-white">→</kbd>
            </span>
            <span className="text-white/50">|</span>
            {enableZoom && (
              <>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-white">+</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-white">-</kbd>
                </span>
                <span className="text-white/50">|</span>
              </>
            )}
            <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-white">ESC</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}

