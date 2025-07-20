// Performance optimization utilities for weak networks

// Image loading optimization
export const optimizeImageLoading = () => {
  // Preload critical images
  const criticalImages = [
    '/logo.png',
    '/hero-bg.jpg'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Lazy loading utility
export const setupLazyLoading = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};

// Connection speed detection
export const getConnectionSpeed = (): 'slow' | 'fast' => {
  // @ts-ignore
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (connection) {
    const slowConnections = ['slow-2g', '2g', '3g'];
    return slowConnections.includes(connection.effectiveType) ? 'slow' : 'fast';
  }
  
  // Fallback: assume slow connection for safety
  return 'slow';
};

// Resource prioritization for slow connections
export const optimizeForSlowConnection = () => {
  const isSlowConnection = getConnectionSpeed() === 'slow';
  
  if (isSlowConnection) {
    // Disable non-critical animations
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      .animate-float,
      .animate-pulse-slow,
      .animate-bounce-slow,
      .animate-spin-slow {
        animation: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // Remove backdrop filters that can be expensive
    document.querySelectorAll('.backdrop-blur-sm, .backdrop-blur-md, .backdrop-blur-lg').forEach(el => {
      el.classList.remove('backdrop-blur-sm', 'backdrop-blur-md', 'backdrop-blur-lg');
    });
  }
  
  return isSlowConnection;
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const criticalResources = [
    { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
  ];
  
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) link.type = resource.type;
    if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
    document.head.appendChild(link);
  });
};

// Bundle splitting hints
export const getChunkPriority = (chunkName: string): 'high' | 'medium' | 'low' => {
  const highPriorityChunks = ['main', 'vendor', 'router'];
  const mediumPriorityChunks = ['pages', 'components'];
  
  if (highPriorityChunks.some(name => chunkName.includes(name))) return 'high';
  if (mediumPriorityChunks.some(name => chunkName.includes(name))) return 'medium';
  return 'low';
};
