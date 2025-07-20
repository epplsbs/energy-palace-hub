import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { preloadCriticalResources, optimizeForSlowConnection } from './lib/performance'
import { initializeMobileOptimizations } from './lib/mobile'

// Performance optimizations for weak networks
preloadCriticalResources();
const isSlowConnection = optimizeForSlowConnection();

// Mobile optimizations
const mobileMode = initializeMobileOptimizations();

// Additional optimizations for slow connections
if (isSlowConnection) {
  // Defer non-critical JavaScript
  const deferredScripts = document.querySelectorAll('script[data-defer]');
  deferredScripts.forEach(script => {
    setTimeout(() => {
      const newScript = document.createElement('script');
      newScript.src = script.getAttribute('src') || '';
      newScript.async = true;
      document.body.appendChild(newScript);
    }, 2000);
  });
}

// Log optimization status for debugging
if (import.meta.env.DEV) {
  console.log('🚀 Performance optimizations active:', {
    slowConnection: isSlowConnection,
    mobileMode: mobileMode
  });
}

createRoot(document.getElementById("root")!).render(<App />);
