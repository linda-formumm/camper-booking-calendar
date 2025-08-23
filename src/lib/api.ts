import { ApiClient } from "./api-client";
import type { Station, Booking, BookingRequest, BookingsQuery } from "./types";

// Real API configuration
const API_BASE_URL = "https://605c94c36d85de00170da8b4.mockapi.io";
const apiClient = new ApiClient(API_BASE_URL);

// API endpoints
export const stationsApi = {
  // Get all stations with optional search query
  getStations: async (query?: string): Promise<Station[]> => {
    const stations = await apiClient.get<Station[]>("/stations");

    if (query) {
      const searchTerm = query.toLowerCase();
      return stations.filter(station =>
        station.name.toLowerCase().includes(searchTerm)
      );
    }

    return stations;
  },

  // Get single station by ID
  getStation: async (id: string): Promise<Station> => {
    return apiClient.get<Station>(`/stations/${id}`);
  },

  // Prefetch stations for better UX
  prefetchStations: async (): Promise<void> => {
    try {
      await stationsApi.getStations();
    } catch (error) {
      console.warn("Failed to prefetch stations:", error);
    }
  },
};

// Bookings API
export const bookingsApi = {
  // Get bookings with optional filters
  getBookings: async (params: BookingsQuery = {}): Promise<Booking[]> => {
    const { stationId, from, to } = params;

    if (stationId) {
      // Get bookings for specific station via the embedded bookings
      const station = await apiClient.get<Station>(`/stations/${stationId}`);
      let bookings = station.bookings || [];

      // Filter by date range if provided
      if (from || to) {
        bookings = bookings.filter(booking => {
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

    // If no stationId, get all stations and combine bookings
    const stations = await apiClient.get<Station[]>("/stations");
    const allBookings = stations.flatMap(station => station.bookings || []);

    if (!from && !to) {
      return allBookings;
    }

    return allBookings.filter(booking => {
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

  // Get single booking by ID
  getBooking: async (id: string): Promise<Booking | null> => {
    // Since the API structure has bookings embedded in stations,
    // we need to search through all stations to find the booking
    try {
      const stations = await apiClient.get<Station[]>("/stations");

      for (const station of stations) {
        const booking = station.bookings?.find(b => b.id === id);
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

  // Create new booking
  createBooking: async (booking: BookingRequest): Promise<Booking> => {
    // Based on API structure, bookings are created within stations
    const { pickupReturnStationId, ...bookingData } = booking;

    return apiClient.post<Booking>(
      `/stations/${pickupReturnStationId}/bookings`,
      bookingData
    );
  },

  // Cancel booking
  cancelBooking: async (id: string): Promise<void> => {
    // Find which station contains this booking
    const stations = await apiClient.get<Station[]>("/stations");

    for (const station of stations) {
      const booking = station.bookings?.find(b => b.id === id);
      if (booking) {
        // Delete from the station's bookings
        await apiClient.delete(`/stations/${station.id}/bookings/${id}`);
        return;
      }
    }

    throw new Error(`Booking with id ${id} not found`);
  },
};
