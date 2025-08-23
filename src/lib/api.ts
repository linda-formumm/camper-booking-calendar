import type { Station, Booking, BookingRequest, BookingsQuery } from "./types";

const API_BASE_URL = "https://605c94c36d85de00170da8b4.mockapi.io";

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export const stationsApi = {
  getStations: async (query?: string): Promise<Station[]> => {
    const stations = await apiFetch<Station[]>("/stations");

    if (query) {
      return stations.filter(station =>
        station.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    return stations;
  },

  getStation: async (id: string): Promise<Station> => {
    return apiFetch<Station>(`/stations/${id}`);
  },
};

export const bookingsApi = {
  getBookings: async (params: BookingsQuery = {}): Promise<Booking[]> => {
    const { stationId, from, to } = params;

    if (stationId) {
      const station = await apiFetch<Station>(`/stations/${stationId}`);
      let bookings = station.bookings || [];

      if (from || to) {
        bookings = bookings.filter((booking: Booking) => {
          const startDate = new Date(booking.startDate);
          const endDate = new Date(booking.endDate);

          if (from && endDate < new Date(from)) {
            return false;
          }
          if (to && startDate > new Date(to)) {
            return false;
          }
          return true;
        });
      }

      return bookings;
    }

    const stations = await apiFetch<Station[]>("/stations");
    const allBookings = stations.flatMap(
      (station: Station) => station.bookings || []
    );

    if (!from && !to) {
      return allBookings;
    }

    return allBookings.filter((booking: Booking) => {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);

      if (from && endDate < new Date(from)) {
        return false;
      }
      if (to && startDate > new Date(to)) {
        return false;
      }
      return true;
    });
  },

  getBooking: async (id: string): Promise<Booking | null> => {
    try {
      const stations = await apiFetch<Station[]>("/stations");

      for (const station of stations) {
        const booking = station.bookings?.find((b: Booking) => b.id === id);
        if (booking) {
          return booking;
        }
      }
      return null;
    } catch (error) {
      console.error("Error fetching booking:", error);
      return null;
    }
  },

  createBooking: async (booking: BookingRequest): Promise<Booking> => {
    const { pickupReturnStationId, ...bookingData } = booking;

    return apiFetch<Booking>(`/stations/${pickupReturnStationId}/bookings`, {
      method: "POST",
      body: JSON.stringify(bookingData),
    });
  },

  cancelBooking: async (id: string): Promise<void> => {
    const stations = await apiFetch<Station[]>("/stations");

    for (const station of stations) {
      const booking = station.bookings?.find((b: Booking) => b.id === id);
      if (booking) {
        await apiFetch(`/stations/${station.id}/bookings/${id}`, {
          method: "DELETE",
        });
        return;
      }
    }

    throw new Error(`Booking with id ${id} not found`);
  },
};
