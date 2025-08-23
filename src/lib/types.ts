export interface Station {
  id: string;
  name: string;
  bookings?: Booking[];
}

export interface Booking {
  id: string;
  pickupReturnStationId: string;
  customerName: string;
  startDate: string;
  endDate: string;
  pickupStation?: string;
  returnStation?: string;
}

export interface BookingRequest {
  pickupReturnStationId: string;
  customerName: string;
  startDate: string;
  endDate: string;
  pickupStation?: string;
  returnStation?: string;
}

export interface BookingsQuery {
  stationId?: string;
  from?: string;
  to?: string;
}

// New types for calendar integration
export interface DayBookings {
  date: string;
  pickups: Booking[];  // Bookings starting today
  returns: Booking[];  // Bookings ending today
  activeBookings?: Booking[];  // All bookings active on this day
}

export interface CalendarData {
  weekStart: string;
  weekEnd: string;
  stationId: string;
  days: DayBookings[];
}
