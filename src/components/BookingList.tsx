import { useState } from 'react';
import { KeyRound, CircleCheck, MoreHorizontal } from 'lucide-react';
import type { Booking } from '../lib/types';

interface BookingPillProps {
  booking: Booking;
  type: 'pickup' | 'return';
  onClick: (booking: Booking) => void;
}

// Simple pill component for individual bookings
function BookingPill({ booking, type, onClick }: BookingPillProps) {
  const isPickup = type === 'pickup';
  
  // Calculate booking duration in days
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  return (
    <button
      onClick={() => onClick(booking)}
      className={`
        w-full flex items-center gap-2 px-3 py-2 text-sm font-medium
        transition-colors cursor-pointer border-l-4
        ${isPickup 
          ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 border-green-500 rounded-r-lg' 
          : 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50 border-orange-500 rounded-r-lg'
        }
      `}
    >
      {isPickup ? (
        <KeyRound className="h-4 w-4 shrink-0" />
      ) : (
        <CircleCheck className="h-4 w-4 shrink-0" />
      )}
      <span className="truncate flex-1 text-left">
        {booking.customerName}
      </span>
      {isPickup && (
        <span className="text-xs opacity-75 shrink-0">
          {duration}d
        </span>
      )}
    </button>
  );
}

interface BookingListProps {
  pickups: Booking[];
  returns: Booking[];
  onBookingClick: (booking: Booking) => void;
  maxVisible?: number;
}

// Component to show list of bookings for a day  
export function BookingList({ pickups, returns, onBookingClick, maxVisible = 3 }: BookingListProps) {
  const [showAll, setShowAll] = useState(false);
  
  // Only show pickups and returns - no ongoing bookings
  const allBookings = [...pickups, ...returns];
  const totalCount = allBookings.length;
  
  // If no bookings, show nothing
  if (totalCount === 0) {
    return null;
  }
  
  // Decide what to show
  const visibleBookings = showAll ? allBookings : allBookings.slice(0, maxVisible);
  const hasMore = totalCount > maxVisible;
  
  return (
    <div className="space-y-0">
      {/* Show pickup bookings first */}
      {visibleBookings
        .filter(booking => pickups.includes(booking))
        .map(booking => (
          <BookingPill
            key={`pickup-${booking.id}`}
            booking={booking}
            type="pickup"
            onClick={onBookingClick}
          />
        ))
      }
      
      {/* Then show return bookings */}
      {visibleBookings
        .filter(booking => returns.includes(booking))
        .map(booking => (
          <BookingPill
            key={`return-${booking.id}`}
            booking={booking}
            type="return"
            onClick={onBookingClick}
          />
        ))
      }
      
      {/* Show "more" button if needed */}
      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm
                     bg-gray-100 text-gray-600 hover:bg-gray-200 
                     dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600
                     transition-colors"
        >
          <MoreHorizontal className="h-4 w-4" />
          +{totalCount - maxVisible} more
        </button>
      )}
      
      {/* Show "less" button when expanded */}
      {showAll && hasMore && (
        <button
          onClick={() => setShowAll(false)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm
                     bg-gray-100 text-gray-600 hover:bg-gray-200 
                     dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600
                     transition-colors"
        >
          Show less
        </button>
      )}
    </div>
  );
}
