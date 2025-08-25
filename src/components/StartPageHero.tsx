import { useState, useEffect } from 'react';

interface StartPageHeroProps {
  children: React.ReactNode;
  className?: string;
}

export function StartPageHero({ children, className = '' }: StartPageHeroProps) {
  const [lightLoaded, setLightLoaded] = useState(false);
  const [darkLoaded, setDarkLoaded] = useState(false);

  useEffect(() => {
    // Lazy load images
    const loadImage = (src: string, onLoad: () => void) => {
      const img = new Image();
      img.onload = onLoad;
      img.src = src;
    };

    loadImage('/images/startpage-light.jpg', () => setLightLoaded(true));
    loadImage('/images/startpage-dark.jpg', () => setDarkLoaded(true));
  }, []);

  // CSS Gradient Fallbacks
  const lightGradient = 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
  const darkGradient = 'linear-gradient(135deg, #434343 0%, #000000 100%)';

  return (
    <section className={`relative h-[720px] overflow-hidden ${className}`}>
      {/* Light Mode Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat dark:hidden transition-opacity duration-500"
        style={{
          backgroundImage: lightLoaded 
            ? `url('/images/startpage-light.jpg')`
            : lightGradient,
          opacity: lightLoaded ? 1 : 0.8
        }}
      />
      
      {/* Dark Mode Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden dark:block transition-opacity duration-500"
        style={{
          backgroundImage: darkLoaded 
            ? `url('/images/startpage-dark.jpg')`
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
      <div className="absolute inset-0 bg-gradient-to-b from-orange-200 via-pink-200 to-blue-200 opacity-10 dark:from-black/30 dark:via-black/20 dark:to-black/60 dark:opacity-100 z-10" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        {children}
      </div>
    </section>
  );
}
