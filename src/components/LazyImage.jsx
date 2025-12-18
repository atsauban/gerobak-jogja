import { useState, useMemo } from 'react';

/**
 * Generate tiny blur placeholder URL from Cloudinary
 */
const getBlurPlaceholder = (url) => {
  if (!url) return null;
  
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    // Generate tiny blurred version (20px wide, heavy blur)
    return url.replace(
      '/upload/',
      '/upload/w_20,q_10,e_blur:1000,f_auto/'
    );
  }
  return null;
};

/**
 * Optimize Cloudinary URLs with auto-format and quality
 */
const optimizeImageUrl = (url, options = {}) => {
  if (!url) return url;
  
  const { width = 800, quality = 'auto', format = 'auto' } = options;
  
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
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
  aspectRatio,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(props.loading === 'eager');
  const [hasError, setHasError] = useState(false);

  // Memoize URLs
  const optimizedSrc = useMemo(() => 
    optimizeImageUrl(src, { width: optimizeWidth }), 
    [src, optimizeWidth]
  );
  
  const blurSrc = useMemo(() => getBlurPlaceholder(src), [src]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const aspectClass = aspectRatio ? `aspect-${aspectRatio}` : '';

  return (
    <div className={`relative overflow-hidden ${aspectClass}`}>
      {/* Blur Placeholder - shows tiny blurred version while loading */}
      {!isLoaded && (
        <div className={`absolute inset-0 ${placeholderClassName}`}>
          {blurSrc ? (
            // Cloudinary blur placeholder
            <img
              src={blurSrc}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover scale-110 blur-xl"
            />
          ) : (
            // Fallback shimmer placeholder
            <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          )}
          {/* Overlay with subtle pulse */}
          <div className="absolute inset-0 bg-gray-200/30 animate-pulse" />
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
          className={`${className} transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-105'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      ) : (
        <div className={`${className} bg-gray-50 flex items-center justify-center`}>
          <div className="text-center text-gray-400 p-4">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs">Gagal memuat</span>
          </div>
        </div>
      )}
    </div>
  );
}
