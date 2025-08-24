/**
 * Date utilities for calendar functionality
 */

/**
 * Get the start of the week (Monday) for a given date
 */
export function getWeekStart(date: Date): Date {
  const start = new Date(date);
  const day = start.getDay();
  
  // Calculate days to subtract to get to Monday
  // Sunday = 0, Monday = 1, ..., Saturday = 6
  // For Monday (1): 1 - 1 = 0 (no change)
  // For Sunday (0): 0 - 1 = -1, but we want -6, so handle Sunday specially
  const daysToSubtract = day === 0 ? 6 : day - 1;
  
  start.setDate(start.getDate() - daysToSubtract);
  start.setHours(0, 0, 0, 0);
  return start;
}

/**
 * Get an array of 7 days starting from Monday
 */
export function getWeekDays(weekStart: Date): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    days.push(day);
  }
  return days;
}

/**
 * Get ISO week number for a given date
 */
export function getISOWeek(date: Date): number {
  const tempDate = new Date(date);
  tempDate.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year
  tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);
  // January 4 is always in week 1
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count weeks from there
  return 1 + Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Calculate booking duration in days (inclusive)
 */
export function calculateBookingDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }).format(date);
}

/**
 * Format day header (short weekday)
 */
export function formatDayHeader(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short'
  }).format(date);
}

/**
 * Format month year
 */
export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(date);
}

/**
 * Format date for display in booking details
 */
export function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

/**
 * Format day name for booking details
 */
export function formatDateForDayName(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long'
  }).format(date);
}
