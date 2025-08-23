import type { Booking } from '../lib/types';

export interface WeeklyBookingBar {
  booking: Booking;
  startDay: number; // Day index in week (0-6)
  endDay: number;   // Day index in week (0-6)
  duration: number; // Total duration in days
  level: number;    // Vertical level to avoid overlaps (0, 1, 2...)
  startsBeforeWeek: boolean; // True if booking started before this week
  endsAfterWeek: boolean;    // True if booking ends after this week
  weekPortion: string;       // "start", "middle", "end", or "complete"
}

// Helper to get day index within a week (0 = Monday, 6 = Sunday)
function getDayIndex(date: Date, weekStart: Date): number {
  const dayDiff = Math.floor((date.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, Math.min(6, dayDiff));
}

// Helper to calculate booking duration in days
function getBookingDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

// Convert bookings to visual bars for the week view
export function organizeBookingsAsBars(bookings: Booking[], weekStart: Date, weekEnd: Date): WeeklyBookingBar[] {
  const bars: WeeklyBookingBar[] = [];
  
  // Filter bookings that overlap with this week
  const weeklyBookings = bookings.filter(booking => {
    const bookingStart = new Date(booking.startDate);
    const bookingEnd = new Date(booking.endDate);
    
    // Check if booking overlaps with current week
    return bookingStart <= weekEnd && bookingEnd >= weekStart;
  });
  
  // Convert each booking to a bar
  for (const booking of weeklyBookings) {
    const bookingStart = new Date(booking.startDate);
    const bookingEnd = new Date(booking.endDate);
    
    // Check if booking extends beyond current week
    const startsBeforeWeek = bookingStart < weekStart;
    const endsAfterWeek = bookingEnd > weekEnd;
    
    // Determine which portion of the booking this week shows
    let weekPortion: string;
    if (startsBeforeWeek && endsAfterWeek) {
      weekPortion = "middle";
    } else if (startsBeforeWeek) {
      weekPortion = "end";
    } else if (endsAfterWeek) {
      weekPortion = "start";
    } else {
      weekPortion = "complete";
    }
    
    // Calculate start and end day within the week (clamp to week bounds)
    const startDay = getDayIndex(
      bookingStart < weekStart ? weekStart : bookingStart, 
      weekStart
    );
    const endDay = getDayIndex(
      bookingEnd > weekEnd ? weekEnd : bookingEnd,
      weekStart
    );
    
    const duration = getBookingDuration(booking.startDate, booking.endDate);
    
    bars.push({
      booking,
      startDay,
      endDay,
      duration,
      level: 0, // We'll calculate levels in the next step
      startsBeforeWeek,
      endsAfterWeek,
      weekPortion
    });
  }
  
  // Calculate levels to avoid overlapping bars
  bars.sort((a, b) => a.startDay - b.startDay || a.endDay - b.endDay);
  
  for (let i = 0; i < bars.length; i++) {
    const currentBar = bars[i];
    let level = 0;
    
    // Check for overlaps with previous bars
    for (let j = 0; j < i; j++) {
      const otherBar = bars[j];
      
      // Check if bars overlap
      if (currentBar.startDay <= otherBar.endDay && currentBar.endDay >= otherBar.startDay) {
        if (otherBar.level >= level) {
          level = otherBar.level + 1;
        }
      }
    }
    
    currentBar.level = level;
  }
  
  return bars;
}
