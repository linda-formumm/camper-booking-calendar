interface HeroBackgroundProps {
  lightImage: string;
  darkImage: string;
  className?: string;
  children?: React.ReactNode;
}

export function HeroBackground({
  lightImage,
  darkImage,
  className = '',
  children
}: HeroBackgroundProps) {
  return (
    <section className={`relative mb-6 rounded-lg overflow-hidden ${className}`}>
      {/* Mobile: none background, lg+: Hero images */}
      <div className="lg:h-[280px]">
        
        {/* Desktop Light Mode Background */}
        <div 
          className="absolute inset-0 hidden lg:block dark:lg:hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${lightImage}')` }}
        />
        
        {/* Desktop Dark Mode Background */}
        <div 
          className="absolute inset-0 hidden dark:lg:block bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${darkImage}')` }}
        />

        {/* Desktop Overlay for text readability */}
        <div className="absolute inset-0 hidden lg:block bg-gradient-to-b from-gray-900/30 via-gray-900/50 to-gray-900/70 dark:from-black/50 dark:via-black/60 dark:to-black/80" />

        {/* Content */}
        <div className="relative z-10 flex h-full items-center justify-center p-4">
          <div className="text-center">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
