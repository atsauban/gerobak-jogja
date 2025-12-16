import { useState, useMemo } from 'react';

/**
 * Optimize Cloudinary URLs with auto-format and quality
 * @param {string} url - Original image URL
 * @param {object} options - Optimization options
 * @returns {string} Optimized URL
 */
const optimizeImageUrl = (url, options = {}) => {
  if (!url) return url;
  
  const { width = 800, quality = 'auto', format = 'auto' } = options;
  
  // Cloudinary optimization
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    // Check if transformations already exist
    if (url.includes('/upload/f_') || url.includes('/upload/q_')) {
      return url;
    }
    return url.replace(
      '/upload/',
      `/upload/f_${format},q_${quality},w_${width},c_limit/`
    );
  }
  
  return url;
};

export default function LazyImage({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  onLoad,
  width,
  optimizeWidth = 800,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(props.loading === 'eager');
  const [hasError, setHasError] = useState(false);

  // Memoize optimized URL
  const optimizedSrc = useMemo(() => 
    optimizeImageUrl(src, { width: optimizeWidth }), 
    [src, optimizeWidth]
  );

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Placeholder/Blur */}
      {!isLoaded && (
        <div className={`absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse ${placeholderClassName}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      )}

      {/* Actual Image */}
      {!hasError ? (
        <img
          src={optimizedSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          width={width}
          className={`${className} transition-all duration-500 ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
            }`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      ) : (
        <div className={`${className} bg-gray-100 flex items-center justify-center`}>
          <div className="text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-xs">Gagal memuat</span>
          </div>
        </div>
      )}
    </div>
  );
}
