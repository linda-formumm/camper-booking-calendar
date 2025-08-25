import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getWeekDays, getISOWeek, isToday, formatDayHeader, formatMonthYear, isValidBookingDateRange } from '../lib/date-utils';
import { useAppStore } from '../store/appStore';
import { useBookingStore } from '../store/bookingStore';
import { BookingList } from './BookingList';
import { HeroBackground } from './HeroBackground';
import { cn } from '../lib/utils';
import type { Booking } from '../lib/types';

interface CalendarProps {
  className?: string;
}

export default function Calendar({ className }: CalendarProps) {
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  
  const { selectedStation, weekStart, setWeekStart, goToPreviousWeek, goToNextWeek } = useAppStore();
  const { updateBooking, getAllBookings } = useBookingStore();
  const navigate = useNavigate();

  const weekDays = getWeekDays(weekStart);
  const weekNumber = getISOWeek(weekStart);

  // State for visual drag feedback
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);

  const handleBookingClick = (booking: Booking) => {
    if (selectedStation?.id) {
      navigate(`/booking/${selectedStation.id}/${booking.id}`);
    }
  };

  // drag and drop with state change
  const handleDrop = (e: React.DragEvent, newDate: string) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    // Check if the date is actually changing
    const originalBooking = data.originalBooking;
    const currentDate = data.type === 'pickup' ? originalBooking.startDate : originalBooking.endDate;
    
    if (currentDate === newDate) {
      console.log('No change - same date, skipping');
      return; // Same date, do nothing
    }
    
    // Calculate pickup and return dates for validation
    const newPickupDate = data.type === 'pickup' ? newDate : originalBooking.startDate;
    const newReturnDate = data.type === 'return' ? newDate : originalBooking.endDate;
    
    // Validate that return is at least one day after pickup
    if (!isValidBookingDateRange(newPickupDate, newReturnDate)) {
      alert('Error: Return date must be at least one day after pickup date.');
      return;
    }
    
    const formattedDate = new Date(newDate).toLocaleDateString();
    const actionText = data.type === 'pickup' ? 'pickup' : 'return';
    
    const confirmed = confirm(`Change ${actionText} date to ${formattedDate}?`);
    
    if (confirmed) {
      // Update booking in global store
      const updatedBooking = {
        ...data.originalBooking,
        [data.type === 'pickup' ? 'startDate' : 'endDate']: newDate
      };
      
      updateBooking(updatedBooking);
    }
  };

  // Function to get bookings for a specific day from store
  const getMergedBookings = (dayString: string) => {
    // Get all bookings from store (loaded when station was selected)
    const allBookings = getAllBookings();
    
    // Filter bookings for this specific day
    const pickups = allBookings.filter(booking => booking.startDate === dayString);
    const returns = allBookings.filter(booking => booking.endDate === dayString);
    
    return { pickups, returns };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (dateParam) {
      const paramDate = new Date(dateParam);
      if (!isNaN(paramDate.getTime())) {
        setWeekStart(paramDate);
      }
    }
  }, [dateParam, setWeekStart]);

  const goToDate = (selectedDate: Date) => {
    setWeekStart(selectedDate);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPreviousWeek();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNextWeek();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPreviousWeek, goToNextWeek]);

  return (
    <div className={cn('relative', className)}>
      <HeroBackground
        lightImage="/images/van-roadtrip-light.jpg"
        darkImage="/images/van-mountains-dark.jpg"
      >
        <div className="text-center space-y-4">
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white lg:text-white">
            Booking Calendar
          </h1>
          
          <div className="hidden lg:flex items-center justify-center">
            <hr className="w-16 h-px bg-white/50" />
            <CalendarIcon size={20} className="mx-3 text-white" />
            <hr className="w-16 h-px bg-white/50" />
          </div>
          
          <p className="text-sm lg:text-lg text-gray-600 dark:text-gray-400 lg:text-white/90">
            {selectedStation ? `Location: ${selectedStation.name}` : 'Fleet Management Dashboard'}
          </p>
        </div>
      </HeroBackground>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1"></div>
          
          <div className="flex items-center space-x-4">
            <button onClick={goToPreviousWeek}  
                    className="p-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
              <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-white" />
            </button>
            
            <div className="text-center min-w-[140px]">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
                {formatMonthYear(weekDays[0])}
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Week {weekNumber}
              </span>
            </div>
            
            <button onClick={goToNextWeek} 
                    className="p-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
              <ChevronRight className="h-4 w-4 text-gray-600 dark:text-white" />
            </button>
          </div>

          <div className="flex-1 flex justify-end">
            {/* Date picker - desktop only */}
            <input
              type="date"
              lang="en"
              value={`${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                if (!isNaN(selectedDate.getTime())) {
                  goToDate(selectedDate);
                }
              }}
              
              className="hidden lg:block px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white transition-colors"
              title="Select date"
            />
          </div>
        </div>

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
                {false ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ) : pickups.length > 0 || returns.length > 0 ? (
                  <BookingList pickups={pickups} returns={returns} onBookingClick={handleBookingClick} maxVisible={3} />
                ) : (
                  <div className="text-sm text-gray-500 h-16 flex items-center justify-center">
                    {/* Empty day - larger drop zone */}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
