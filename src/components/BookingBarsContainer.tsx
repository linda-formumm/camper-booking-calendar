import { BookingBar } from './BookingBar';
import { organizeBookingsAsBars } from './BookingBarsLayout';
import type { Booking } from '../lib/types';

interface BookingBarsContainerProps {
  bookings: Booking[];
  weekStart: Date;
  weekEnd: Date;
  onBookingClick: (booking: Booking) => void;
}

// Container component that displays booking bars across the week
export function BookingBarsContainer({ 
  bookings, 
  weekStart, 
  weekEnd, 
  onBookingClick 
}: BookingBarsContainerProps) {
  const bookingBars = organizeBookingsAsBars(bookings, weekStart, weekEnd);
  
  // Calculate the height needed for all bars
  const maxLevel = Math.max(0, ...bookingBars.map(bar => bar.level));
  const containerHeight = (maxLevel + 1) * 32; // 32px per level (24px bar + 8px gap)
  
  return (
    <div 
      className="relative w-full"
      style={{ height: `${containerHeight}px`, minHeight: '32px' }}
    >
      {bookingBars.map((bar, index) => (
        <div
          key={`${bar.booking.id}-${index}`}
          className="absolute"
          style={{
            top: `${bar.level * 32}px`,
            left: 0,
            right: 0,
          }}
        >
          <BookingBar
            booking={bar.booking}
            startDay={bar.startDay}
            endDay={bar.endDay}
            duration={bar.duration}
            startsBeforeWeek={bar.startsBeforeWeek}
            endsAfterWeek={bar.endsAfterWeek}
            weekPortion={bar.weekPortion}
            onBookingClick={onBookingClick}
          />
        </div>
      ))}
      
      {bookingBars.length === 0 && (
        <div className="h-8 flex items-center justify-center text-xs text-stone-500 dark:text-gray-400">
          No bookings
        </div>
      )}
    </div>
  );
}
