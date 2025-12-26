import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const modalRef = useRef(null);
  const imageRef = useRef(null);
  const closeButtonRef = useRef(null);

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.5;

  // Focus trap for accessibility
  // useFocusTrap(true, modalRef);

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
          if (enableZoom) {
            e.preventDefault();
            zoomIn();
          }
          break;
        case '-':
          if (enableZoom) {
            e.preventDefault();
            zoomOut();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, zoomLevel, enableZoom, onClose]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setZoomLevel(1);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setZoomLevel(1);
  };

  const handleImageMouseMove = (e) => {
    if (zoomLevel <= 1 || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  const handleWheel = useCallback((e) => {
    if (!enableZoom) return;

    e.preventDefault();

    setZoomLevel((prev) => {
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta));
      return newZoom;
    });

    // Update zoom position based on mouse position
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    }
  }, [enableZoom]);

  const toggleZoom = () => {
    if (enableZoom) {
      setZoomLevel((prev) => prev > 1 ? 1 : 2);
    }
  };

  const zoomIn = () => {
    if (enableZoom) {
      setZoomLevel((prev) => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
    }
  };

  const zoomOut = () => {
    if (enableZoom) {
      setZoomLevel((prev) => Math.max(MIN_ZOOM, prev - ZOOM_STEP));
    }
  };

  if (!images || images.length === 0) return null;

  const currentImage = typeof images[currentIndex] === 'string'
    ? images[currentIndex]
    : images[currentIndex]?.url || images[currentIndex]?.image || images[currentIndex];

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-modal-title"
      aria-describedby="gallery-modal-description"
    >
      {/* Close Button - positioned below navbar area */}
      <button
        ref={closeButtonRef}
        onClick={onClose}
        className="absolute top-20 sm:top-6 right-4 sm:right-6 text-white hover:text-gray-300 transition-colors bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50 z-[60]"
        aria-label="Close gallery"
      >
        <X size={24} />
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-white/10 backdrop-blur-sm rounded-full p-2.5 sm:p-3 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white z-[60]"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-white/10 backdrop-blur-sm rounded-full p-2.5 sm:p-3 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white z-[60]"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Zoom Buttons */}
      {enableZoom && (
        <div className="absolute top-20 sm:top-6 left-4 sm:left-6 flex items-center gap-2 z-[60]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              zoomOut();
            }}
            disabled={zoomLevel <= MIN_ZOOM}
            className="text-white hover:text-gray-300 transition-colors bg-white/10 backdrop-blur-sm rounded-full p-2.5 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Zoom out"
          >
            <ZoomOut size={18} />
          </button>
          <span className="text-white text-xs font-medium bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full min-w-[3rem] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              zoomIn();
            }}
            disabled={zoomLevel >= MAX_ZOOM}
            className="text-white hover:text-gray-300 transition-colors bg-white/10 backdrop-blur-sm rounded-full p-2.5 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Zoom in"
          >
            <ZoomIn size={18} />
          </button>
        </div>
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
        <div
          className="relative flex items-center justify-center w-full overflow-hidden"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
          onWheel={handleWheel}
        >
          <img
            ref={imageRef}
            src={currentImage}
            alt={title || `Image ${currentIndex + 1} of ${images.length}`}
            className={`max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-2xl shadow-2xl transition-transform duration-200 bg-white/5 ${zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
              }`}
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
            onMouseMove={handleImageMouseMove}
            onClick={toggleZoom}
            draggable={false}
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
                <span className="text-white/60">Scroll/</span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-white">+</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-white">-</kbd>
                </span>
                <span className="text-white/60">zoom</span>
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

