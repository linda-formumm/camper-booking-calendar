import type { Booking } from '../lib/types';

interface BookingBarProps {
  booking: Booking;
  startDay: number; // Which day of the week this booking starts (0-6)
  endDay: number;   // Which day of the week this booking ends (0-6) 
  duration: number; // Total duration in days
  startsBeforeWeek: boolean; // True if booking started before this week
  endsAfterWeek: boolean;    // True if booking ends after this week
  weekPortion: string;       // "start", "middle", "end", or "complete"
  onBookingClick: (booking: Booking) => void;
}

// Component for booking bars that span across multiple days
export function BookingBar({ 
  booking, 
  startDay, 
  endDay, 
  duration, 
  startsBeforeWeek,
  endsAfterWeek,
  weekPortion,
  onBookingClick 
}: BookingBarProps) {
  // Calculate the width and position of the bar
  const spanDays = endDay - startDay + 1;
  const leftOffset = (startDay / 7) * 100; // Position as percentage
  const width = (spanDays / 7) * 100; // Width as percentage
  
  // Visual style based on week portion
  const getBarStyles = () => {
    const baseClasses = "h-full text-white text-xs flex items-center shadow-md hover:shadow-lg transition-all";
    
    switch (weekPortion) {
      case "start":
        return `${baseClasses} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                rounded-l-md pr-1 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800`;
      case "end":
        return `${baseClasses} bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600
                rounded-r-md pl-1 dark:from-blue-700 dark:to-blue-600 dark:hover:from-blue-800 dark:hover:to-blue-700`;
      case "middle":
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 px-1
                dark:bg-blue-700 dark:hover:bg-blue-800`;
      default: // complete
        return `${baseClasses} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                rounded-md px-2 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800`;
    }
  };
  
  return (
    <div
      className="absolute h-6 z-10 cursor-pointer"
      style={{
        left: `${leftOffset}%`,
        width: `${width}%`,
      }}
      onClick={() => onBookingClick(booking)}
    >
      <div className={getBarStyles()}>
        {/* Arrow indicators for extended bookings */}
        {startsBeforeWeek && (
          <span className="text-blue-200 dark:text-blue-300 mr-1">◀</span>
        )}
        
        <div className="truncate flex-1 min-w-0">
          <span className="font-medium">{booking.customerName}</span>
          {weekPortion === "complete" && (
            <span className="ml-1 opacity-75">({duration}d)</span>
          )}
        </div>
        
        {endsAfterWeek && (
          <span className="text-blue-200 dark:text-blue-300 ml-1">▶</span>
        )}
      </div>
      
      {/* Tooltip for extended bookings */}
      {(startsBeforeWeek || endsAfterWeek) && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                        bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap
                        opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                        dark:bg-gray-700">
          {startsBeforeWeek && endsAfterWeek 
            ? `Continues from previous week, extends to next week (${duration}d total)`
            : startsBeforeWeek 
              ? `Started in previous week (${duration}d total)`
              : `Continues to next week (${duration}d total)`
          }
        </div>
      )}
    </div>
  );
}
