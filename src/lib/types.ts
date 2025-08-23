// TypeScript types for real API data structure
export interface Station {
  id: string;
  name: string;
  bookings?: Booking[];
}

export interface Booking {
  id: string;
  pickupReturnStationId: string;
  customerName: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
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
  from?: string; // ISO date string
  to?: string; // ISO date string;
}

// API response types
export interface StationsResponse {
  stations: Station[];
  total: number;
}

export interface BookingsResponse {
  bookings: Booking[];
  total: number;
}
