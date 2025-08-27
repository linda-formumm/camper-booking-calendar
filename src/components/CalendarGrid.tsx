import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { isToday, formatDayHeader, isValidBookingDateRange } from '../lib/date-utils';
import { useBookingStore } from '../store/bookingStore';
import { BookingList } from './BookingList';
import { cn } from '../lib/utils';
import type { Booking } from '../lib/types';

interface CalendarGridProps {
  weekDays: Date[];
  onBookingClick: (booking: Booking) => void;
}

export function CalendarGrid({ weekDays, onBookingClick }: CalendarGridProps) {
  const { updateBooking, getAllBookings } = useBookingStore();
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);

  // Load all bookings once per render instead of per day
  const allBookings = getAllBookings();

  // Handle native HTML5 drag & drop for booking rescheduling
  const handleDrop = (e: React.DragEvent, newDate: string) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    // Avoid unnecessary updates if date hasn't changed
    const originalBooking = data.originalBooking;
    const currentDate = data.type === 'pickup' ? originalBooking.startDate : originalBooking.endDate;
    
    if (currentDate === newDate) {
      console.log('No change - same date, skipping');
      return;
    }
    
    // Validate new booking date range before updating
    const newPickupDate = data.type === 'pickup' ? newDate : originalBooking.startDate;
    const newReturnDate = data.type === 'return' ? newDate : originalBooking.endDate;
    
    if (!isValidBookingDateRange(newPickupDate, newReturnDate)) {
      alert('Error: Return date must be at least one day after pickup date.');
      return;
    }
    
    const formattedDate = new Date(newDate).toLocaleDateString();
    const actionText = data.type === 'pickup' ? 'pickup' : 'return';
    
    const confirmed = confirm(`Change ${actionText} date to ${formattedDate}?`);
    
    if (confirmed) {
      // Optimistically update booking in store for immediate UI feedback
      const updatedBooking = {
        ...data.originalBooking,
        [data.type === 'pickup' ? 'startDate' : 'endDate']: newDate
      };
      
      updateBooking(updatedBooking);
    }
  };

  // Efficiently filter bookings by day using pre-loaded data
  const getMergedBookings = (dayString: string) => {
    
    const pickups = allBookings.filter(booking => {
      const bookingDate = booking.startDate.split('T')[0]; // Extract date part
      return bookingDate === dayString;
    });
    
    const returns = allBookings.filter(booking => {
      const bookingDate = booking.endDate.split('T')[0]; // Extract date part
      return bookingDate === dayString;
    });
    
    return { pickups, returns };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="lg:grid lg:grid-cols-7 lg:gap-px lg:bg-gray-200 lg:dark:bg-gray-700 lg:rounded-lg space-y-3 lg:space-y-0">
      {/* Desktop Headers */}
      {weekDays.map((day, index) => (
        <div key={`header-${index}`} className="hidden lg:block bg-gray-100 dark:bg-gray-800 p-3 text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">{formatDayHeader(day)}</div>
          <div className={isToday(day) ? "text-blue-600 font-medium" : ""}>{day.getDate()}</div>
        </div>
      ))}
      
      {/* Calendar Days */}
      {weekDays.map((day, index) => {
        const dayString = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
        const { pickups, returns } = getMergedBookings(dayString);

        return (
          <div 
            key={`day-${index}`} 
            className={cn(
              "bg-white dark:bg-gray-900 rounded-lg lg:rounded-none border lg:border-0 p-4 min-h-24 transition-all duration-200",
              isToday(day) && "ring-2 ring-blue-200 lg:ring-0 border-blue-300",
              dragOverTarget === dayString && "bg-gray-50 dark:bg-gray-800 border-4 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] dark:shadow-[0_0_20px_rgba(59,130,246,0.7)]"
            )}
            onDrop={(e) => {
              setDragOverTarget(null);
              handleDrop(e, dayString);
            }}
            onDragOver={handleDragOver}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragOverTarget(dayString);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              // Only remove highlight if we're actually leaving the day container
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX;
              const y = e.clientY;
              if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                setDragOverTarget(null);
              }
            }}
          >
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 uppercase">{formatDayHeader(day)}</span>
                <span className={isToday(day) ? "text-blue-600 font-medium" : ""}>{day.getDate()}</span>
              </div>
              <CalendarIcon className="h-4 w-4 text-gray-400" />
            </div>
            
            {/* Content */}
            {pickups.length > 0 || returns.length > 0 ? (
              <BookingList pickups={pickups} returns={returns} onBookingClick={onBookingClick} maxVisible={3} />
            ) : (
              <div className="text-sm text-gray-500 h-16 flex items-center justify-center">
                {/* Empty day - larger drop zone */}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
