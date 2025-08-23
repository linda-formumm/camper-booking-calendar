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
