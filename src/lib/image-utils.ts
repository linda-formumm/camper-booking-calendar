// Image path utility for proper GitHub Pages deployment
export const getImagePath = (imagePath: string): string => {
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // In production (GitHub Pages), prepend the base path
  if (import.meta.env.PROD) {
    return `/camper-booking-calendar/${cleanPath}`;
  }
  
  // In development, use the original path
  return `/${cleanPath}`;
};
