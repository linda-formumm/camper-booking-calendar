import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../lib/api';
import type { DayBookings, Booking } from '../lib/types';

// Helper function to format date as YYYY-MM-DD (local time, no timezone)
function formatDate(date: Date): string {
  return date.getFullYear() + '-' + 
    String(date.getMonth() + 1).padStart(2, '0') + '-' + 
    String(date.getDate()).padStart(2, '0');
}

// Helper function to check if two dates are the same day
function isSameDay(date1: string, date2: string): boolean {
  // Extract just the date part (YYYY-MM-DD) from both dates
  const dateOnly1 = date1.split('T')[0];
  const dateOnly2 = date2.split('T')[0];
  return dateOnly1 === dateOnly2;
}

// Simple function to organize bookings by day
function organizeBookingsByDay(bookings: Booking[], weekDays: Date[]): DayBookings[] {
  const dayBookings: DayBookings[] = [];

  // Go through each day of the week
  for (const day of weekDays) {
    const dayString = formatDate(day);
    
    // Find bookings that start today (pickups)
    const pickups = bookings.filter(booking => 
      isSameDay(booking.startDate, dayString)
    );
    
    // Find bookings that end today (returns)
    const returns = bookings.filter(booking => 
      isSameDay(booking.endDate, dayString)
    );

    // Find bookings that are active on this day (ongoing bookings)
    const activeBookings = bookings.filter(booking => {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      const currentDay = new Date(dayString);
      
      // Check if current day is between start and end (inclusive)
      return currentDay >= startDate && currentDay <= endDate;
    });

    dayBookings.push({
      date: dayString,
      pickups,
      returns,
      activeBookings // Add all bookings active on this day
    });
  }

  return dayBookings;
}

// Main hook for getting weekly booking data
export function useWeeklyBookings(stationId: string | null, weekDays: Date[]) {
  // Calculate week range
  const weekStart = weekDays[0] ? formatDate(weekDays[0]) : '';
  const weekEnd = weekDays[6] ? formatDate(weekDays[6]) : '';

  // Fetch bookings for this week and station
  const query = useQuery({
    queryKey: ['weeklyBookings', stationId, weekStart, weekEnd],
    queryFn: async () => {
      if (!stationId) return [];
      
      return await bookingsApi.getBookings({
        stationId,
        from: weekStart,
        to: weekEnd
      });
    },
    enabled: !!stationId && !!weekStart && !!weekEnd,
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
  });

  // Organize the data by day
  const weeklyData = query.data ? organizeBookingsByDay(query.data, weekDays) : [];

  return {
    weeklyData,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
}
