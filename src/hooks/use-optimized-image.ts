import { useState, useEffect } from 'react';

interface ImageConfig {
  src: string;
  mobileSrc?: string;
  alt: string;
  preload?: boolean;
}

interface OptimizedImageReturn {
  src: string;
  isLoaded: boolean;
  error: boolean;
}

export function useOptimizedImage(config: ImageConfig): OptimizedImageReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');

  useEffect(() => {
    // Determine which image to use based on screen size
    const isMobile = window.innerWidth < 768;
    const imageSrc = isMobile && config.mobileSrc ? config.mobileSrc : config.src;
    
    setCurrentSrc(imageSrc);

    // Preload critical images
    if (config.preload) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imageSrc;
      document.head.appendChild(link);
    }

    // Create image element for loading
    const img = new Image();
    
    img.onload = () => {
      setIsLoaded(true);
      setError(false);
    };
    
    img.onerror = () => {
      setError(true);
      setIsLoaded(false);
    };

    // Start loading
    img.src = imageSrc;

    return () => {
      if (config.preload) {
        const preloadLink = document.querySelector(`link[href="${imageSrc}"]`);
        if (preloadLink) {
          document.head.removeChild(preloadLink);
        }
      }
    };
  }, [config.src, config.mobileSrc, config.preload]);

  return {
    src: currentSrc,
    isLoaded,
    error
  };
}
