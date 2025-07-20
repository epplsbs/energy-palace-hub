import { useState, useRef, useEffect } from 'react';
import { getConnectionSpeed } from '@/lib/performance';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  placeholder?: string;
  width?: number;
  height?: number;
  quality?: number;
}

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  placeholder = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/></svg>',
  width,
  height,
  quality = 75
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [optimizedSrc, setOptimizedSrc] = useState(placeholder);

  useEffect(() => {
    // Optimize image source based on connection speed
    const connectionSpeed = getConnectionSpeed();
    let finalSrc = src;

    if (connectionSpeed === 'slow') {
      // For slow connections, use lower quality or WebP format if supported
      const supportsWebP = document.createElement('canvas').toDataURL('image/webp').indexOf('webp') > -1;
      
      if (supportsWebP && !src.includes('.webp')) {
        // Convert to WebP if source is not already WebP
        finalSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      }
      
      // Add quality parameter for slow connections
      if (src.includes('?')) {
        finalSrc += `&quality=${Math.min(quality, 60)}`;
      } else {
        finalSrc += `?quality=${Math.min(quality, 60)}`;
      }
    }

    setOptimizedSrc(finalSrc);
  }, [src, quality]);

  useEffect(() => {
    if (!priority && imgRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { 
          threshold: 0.1,
          rootMargin: '50px'
        }
      );

      observer.observe(imgRef.current);
      return () => observer.disconnect();
    }
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    // Fallback to placeholder or default image
    setOptimizedSrc(placeholder);
  };

  const imageStyles = {
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0.7,
    ...(width && { width }),
    ...(height && { height })
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder/Loading state */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 text-gray-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <img
          ref={imgRef}
          src={optimizedSrc}
          alt={alt}
          style={imageStyles}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">Failed to load</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
