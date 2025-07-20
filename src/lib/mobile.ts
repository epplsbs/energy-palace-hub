// Mobile optimization utilities

// Detect mobile device
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Detect touch capability
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Get viewport dimensions
export const getViewportSize = () => {
  return {
    width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  };
};

// Optimize for mobile viewport
export const optimizeMobileViewport = () => {
  // Set viewport meta tag for mobile
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.setAttribute('name', 'viewport');
    document.head.appendChild(viewport);
  }
  viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');

  // Add mobile-specific meta tags
  const mobileMetaTags = [
    { name: 'format-detection', content: 'telephone=yes' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'theme-color', content: '#059669' }, // emerald-600
  ];

  mobileMetaTags.forEach(({ name, content }) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  });
};

// Handle mobile-specific interactions
export const setupMobileInteractions = () => {
  if (isMobileDevice()) {
    // Prevent zoom on input focus
    document.addEventListener('touchstart', function() {}, { passive: true });
    
    // Handle viewport height changes (mobile browsers)
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    window.addEventListener('resize', () => {
      vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    // Optimize touch events
    const style = document.createElement('style');
    style.textContent = `
      /* Mobile touch optimizations */
      * {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      /* Allow text selection where needed */
      input, textarea, [contenteditable] {
        -webkit-user-select: text;
        -khtml-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
      
      /* Optimize button touch targets */
      button, [role="button"], .btn {
        min-height: 44px;
        min-width: 44px;
        touch-action: manipulation;
      }
      
      /* Mobile scrolling optimizations */
      .mobile-scroll {
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
      }
      
      /* Reduce motion on mobile for better performance */
      @media (max-width: 768px) {
        *, *::before, *::after {
          animation-duration: 0.2s !important;
          transition-duration: 0.2s !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

// Mobile-specific performance optimizations
export const optimizeMobilePerformance = () => {
  if (isMobileDevice()) {
    // Reduce animation complexity on mobile
    const reduceAnimations = document.createElement('style');
    reduceAnimations.textContent = `
      @media (max-width: 768px) {
        .animate-float {
          animation: none !important;
        }
        
        .backdrop-blur-sm,
        .backdrop-blur-md,
        .backdrop-blur-lg {
          backdrop-filter: none !important;
          background-color: rgba(255, 255, 255, 0.8) !important;
        }
        
        .dark .backdrop-blur-sm,
        .dark .backdrop-blur-md,
        .dark .backdrop-blur-lg {
          background-color: rgba(0, 0, 0, 0.8) !important;
        }
      }
    `;
    document.head.appendChild(reduceAnimations);

    // Optimize images for mobile
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.loading = 'lazy';
      img.decoding = 'async';
    });
  }
};

// Network-aware loading for mobile
export const getMobileNetworkStatus = () => {
  // @ts-ignore
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (connection) {
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }
  
  return null;
};

// Adaptive loading based on mobile network
export const adaptiveLoadForMobile = () => {
  const networkStatus = getMobileNetworkStatus();
  
  if (networkStatus?.saveData || networkStatus?.effectiveType === 'slow-2g' || networkStatus?.effectiveType === '2g') {
    // Ultra-light mode for very slow connections
    const ultraLightMode = document.createElement('style');
    ultraLightMode.textContent = `
      /* Ultra-light mode for slow mobile connections */
      .shadow-lg, .shadow-xl, .shadow-2xl {
        box-shadow: none !important;
      }
      
      .blur-sm, .blur-md, .blur-lg {
        filter: none !important;
      }
      
      .animate-pulse, .animate-spin, .animate-bounce {
        animation: none !important;
      }
      
      /* Hide decorative elements */
      .decorative, [data-decorative] {
        display: none !important;
      }
    `;
    document.head.appendChild(ultraLightMode);
    
    return 'ultra-light';
  } else if (networkStatus?.effectiveType === '3g') {
    // Light mode for 3G connections
    const lightMode = document.createElement('style');
    lightMode.textContent = `
      /* Light mode for 3G connections */
      .shadow-xl, .shadow-2xl {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
      }
      
      .blur-lg {
        filter: blur(4px) !important;
      }
    `;
    document.head.appendChild(lightMode);
    
    return 'light';
  }
  
  return 'full';
};

// Initialize all mobile optimizations
export const initializeMobileOptimizations = () => {
  optimizeMobileViewport();
  setupMobileInteractions();
  optimizeMobilePerformance();
  return adaptiveLoadForMobile();
};
