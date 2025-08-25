import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getWeekStart, getWeekDays, getISOWeek, isToday, formatDayHeader, formatMonthYear } from '../lib/date-utils';
import { useWeeklyBookings } from '../hooks/use-weekly-bookings';
import { useAppStore } from '../store/appStore';
import { BookingList } from './BookingList';
import { cn } from '../lib/utils';
import type { Booking } from '../lib/types';

interface CalendarProps {
  className?: string;
}

export default function Calendar({ className }: CalendarProps) {
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  
  // Initialize with date from URL parameter if available, otherwise use today
  const initialDate = dateParam ? new Date(dateParam) : new Date();
  const [currentWeek, setCurrentWeek] = useState(() => getWeekStart(initialDate));
  
  const { selectedStation } = useAppStore();
  const navigate = useNavigate();

  const weekDays = getWeekDays(currentWeek);
  const weekNumber = getISOWeek(currentWeek);

  // Fetch booking data for this week
  const { weeklyData, isLoading: bookingsLoading } = useWeeklyBookings(
    selectedStation?.id || null, 
    weekDays
  );

  // Handle booking click - navigate to detail page
  const handleBookingClick = (booking: Booking) => {
    if (selectedStation?.id) {
      navigate(`/booking/${selectedStation.id}/${booking.id}`);
    }
  };

  // Update current week when date parameter changes
  useEffect(() => {
    if (dateParam) {
      const paramDate = new Date(dateParam);
      if (!isNaN(paramDate.getTime())) {
        setCurrentWeek(getWeekStart(paramDate));
      }
    }
  }, [dateParam]);

  // Navigation functions
  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(getWeekStart(prevWeek));
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(getWeekStart(nextWeek));
  };

  const goToDate = (selectedDate: Date) => {
    setCurrentWeek(getWeekStart(selectedDate));
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
  }, [currentWeek]);

  return (
    <div className={cn('relative', className)}>
      {/* Hero Header Section */}
      <section className="relative h-[280px] overflow-hidden mb-8 rounded-lg">
        {/* Background Images */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat dark:hidden"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1527786356703-4b100091cd2c?q=80&w=2340&auto=format&fit=crop')`,
          }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden dark:block"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2340&auto=format&fit=crop')`,
          }}
        />

        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-gray-900/50 to-gray-900/70 dark:from-black/50 dark:via-black/60 dark:to-black/80" />

        {/* Header Content */}
        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-black text-white drop-shadow-2xl md:text-5xl">
              Booking Calendar
            </h1>
            
            <div className="mb-4 flex items-center justify-center">
              <hr className="h-px w-16 bg-gradient-to-r from-transparent via-white to-transparent border-0" />
              <CalendarIcon size={20} className="mx-3 text-white" />
              <hr className="h-px w-16 bg-gradient-to-r from-transparent via-white to-transparent border-0" />
            </div>
            
            <p className="text-lg font-light text-white/90 drop-shadow-lg">
              {selectedStation ? `Location: ${selectedStation.name}` : 'Fleet Management Dashboard'}
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1"></div>
        
        <div className="flex items-center space-x-4">
          {/* Week navigation */}
          <button
            onClick={goToPreviousWeek}
            disabled={bookingsLoading}
            className="p-2 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4 text-stone-600 dark:text-white" />
          </button>
          
          <div className="text-center">
            <h2 className="text-xl text-gray-900 dark:text-white">
              {formatMonthYear(weekDays[0])}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Week {weekNumber}
            </span>
          </div>
          
          <button
            onClick={goToNextWeek}
            disabled={bookingsLoading}
            className="p-2 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4 text-stone-600 dark:text-white" />
          </button>
        </div>
        
        <div className="flex-1 flex justify-end">
          {/* Date picker for quick navigation */}
          <input
            type="date"
            lang="en"
            value={`${currentWeek.getFullYear()}-${String(currentWeek.getMonth() + 1).padStart(2, '0')}-${String(currentWeek.getDate()).padStart(2, '0')}`}
            onChange={(e) => {
              const selectedDate = new Date(e.target.value);
              if (!isNaN(selectedDate.getTime())) {
                goToDate(selectedDate);
              }
            }}
            disabled={bookingsLoading}
            className="px-3 py-2 text-sm rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white transition-colors"
            title="Select date"
          />
        </div>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:block">
        <div className="grid grid-cols-7 gap-px bg-stone-300 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm">
          {/* Day Headers */}
          {weekDays.map((day, index) => (
            <div
              key={`header-${index}`}
              className="bg-stone-200 dark:bg-gray-800 p-3 text-center sticky top-0 z-10"
            >
              <div className="text-xs text-stone-600 dark:text-gray-400 uppercase tracking-wide">
                {formatDayHeader(day)}
              </div>
              <div className={cn(
                "text-base mt-1",
                isToday(day) 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-gray-900 dark:text-white"
              )}>
                {day.getDate()}
                {isToday(day) && (
                  <span className="ml-1 text-xs text-blue-600 dark:text-blue-400">
                    Today
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {/* Day Content Areas */}
          {weekDays.map((day, index) => {
            // Use local date formatting to avoid timezone issues
            const dayString = day.getFullYear() + '-' + 
              String(day.getMonth() + 1).padStart(2, '0') + '-' + 
              String(day.getDate()).padStart(2, '0');
            const dayData = weeklyData.find(d => d.date === dayString);
            
            return (
              <div
                key={`content-${index}`}
                className={cn(
                  "bg-stone-50 dark:bg-gray-900 p-4 min-h-32 border-t-2 border-stone-300 dark:border-gray-800",
                  bookingsLoading && "animate-pulse"
                )}
              >
                {bookingsLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-stone-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-stone-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ) : dayData ? (
                  <BookingList
                    pickups={dayData.pickups}
                    returns={dayData.returns}
                    onBookingClick={handleBookingClick}
                    maxVisible={3}
                  />
                ) : (
                  <div className="text-sm text-stone-600 dark:text-gray-400">
                    Available
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {weekDays.map((day, index) => {
          const dayString = day.toISOString().split('T')[0];
          const dayData = weeklyData.find(d => d.date === dayString);
          
          return (
            <div
              key={`mobile-${index}`}
              className={cn(
                "bg-stone-50 dark:bg-gray-900 rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer",
                isToday(day) 
                  ? "border-blue-300 ring-2 ring-blue-200 dark:border-blue-500 dark:ring-blue-400" 
                  : "border-stone-200 hover:border-stone-300 dark:border-gray-700"
              )}
            >
              <div className="flex items-center justify-between mb-3 p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-xs text-stone-500 dark:text-gray-400 uppercase tracking-wide">
                    {formatDayHeader(day)}
                  </div>
                  <div className={cn(
                    "text-base",
                    isToday(day) 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-gray-800 dark:text-white"
                  )}>
                    {day.getDate()}
                  </div>
                  {isToday(day) && (
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      Today
                    </span>
                  )}
                </div>
                <CalendarIcon className="h-4 w-4 text-stone-400 dark:text-gray-400" />
              </div>
              
              <div className="px-4 pb-4">
                {bookingsLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-stone-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-stone-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ) : dayData ? (
                  <BookingList
                    pickups={dayData.pickups}
                    returns={dayData.returns}
                    onBookingClick={handleBookingClick}
                    maxVisible={4} // Show a bit more on mobile
                  />
                ) : (
                  <div className="text-sm text-stone-600 dark:text-gray-400">
                    Available
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Keyboard Navigation Hint */}
      <div className="text-xs text-stone-500 dark:text-gray-500 text-center">
        Tip: Use ← → arrow keys for navigation
      </div>
      </div>
    </div>
  );
}
