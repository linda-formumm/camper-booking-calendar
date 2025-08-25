import { useState, useEffect } from 'react';

interface HeroBackgroundProps {
  lightImage: string;
  darkImage: string;
  lightImageMobile?: string;
  darkImageMobile?: string;
  preload?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function HeroBackground({
  lightImage,
  darkImage,
  lightImageMobile,
  darkImageMobile,
  preload = false,
  className = '',
  children
}: HeroBackgroundProps) {
  const [lightLoaded, setLightLoaded] = useState(false);
  const [darkLoaded, setDarkLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Preload critical images
    if (preload) {
      const preloadImages = [
        isMobile && lightImageMobile ? lightImageMobile : lightImage,
        isMobile && darkImageMobile ? darkImageMobile : darkImage
      ];

      preloadImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    }

    // Lazy load images
    const loadImage = (src: string, onLoad: () => void) => {
      const img = new Image();
      img.onload = onLoad;
      img.src = src;
    };

    // Load appropriate images
    const lightSrc = isMobile && lightImageMobile ? lightImageMobile : lightImage;
    const darkSrc = isMobile && darkImageMobile ? darkImageMobile : darkImage;

    loadImage(lightSrc, () => setLightLoaded(true));
    loadImage(darkSrc, () => setDarkLoaded(true));
  }, [lightImage, darkImage, lightImageMobile, darkImageMobile, preload, isMobile]);

  // CSS Gradient Fallbacks
  const lightGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  const darkGradient = 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';

  const lightSrc = isMobile && lightImageMobile ? lightImageMobile : lightImage;
  const darkSrc = isMobile && darkImageMobile ? darkImageMobile : darkImage;

  return (
    <section className={`relative h-[280px] overflow-hidden mb-8 rounded-lg ${className}`}>
      {/* Light Mode Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat dark:hidden transition-opacity duration-500"
        style={{
          backgroundImage: lightLoaded 
            ? `url('${lightSrc}')`
            : lightGradient,
          opacity: lightLoaded ? 1 : 0.8
        }}
      />
      
      {/* Dark Mode Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden dark:block transition-opacity duration-500"
        style={{
          backgroundImage: darkLoaded 
            ? `url('${darkSrc}')`
            : darkGradient,
          opacity: darkLoaded ? 1 : 0.8
        }}
      />

      {/* Loading State - Gradient Fallback */}
      {(!lightLoaded || !darkLoaded) && (
        <>
          {/* Light fallback */}
          <div
            className="absolute inset-0 dark:hidden"
            style={{ background: lightGradient }}
          />
          {/* Dark fallback */}
          <div
            className="absolute inset-0 hidden dark:block"
            style={{ background: darkGradient }}
          />
        </>
      )}

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-gray-900/50 to-gray-900/70 dark:from-black/50 dark:via-black/60 dark:to-black/80" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        {children}
      </div>
    </section>
  );
}
