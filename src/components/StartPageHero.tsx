import { getImagePath } from '../lib/image-utils';

interface StartPageHeroProps {
  children: React.ReactNode;
  className?: string;
}

export function StartPageHero({ children, className = '' }: StartPageHeroProps) {
  return (
    <section className={`relative h-[720px] overflow-hidden ${className}`}>
      {/* Light Mode Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat dark:hidden"
        style={{
          backgroundImage: `url('${getImagePath('/images/startpage-light.jpg')}')`
        }}
      />
      
      {/* Dark Mode Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden dark:block"
        style={{
          backgroundImage: `url('${getImagePath('/images/startpage-dark.jpg')}')`
        }}
      />

      {/* Overlay for text readability */}
      {/* Light mode: color filter */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-200 via-pink-200 to-blue-200 opacity-20 dark:hidden" />
      {/* Dark mode: Simple black overlay */}
      <div className="absolute inset-0 bg-black/40 hidden dark:block" />
      
      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        {children}
      </div>
    </section>
  );
}
