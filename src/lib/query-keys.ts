import type { BookingsQuery } from "./types";

// TanStack Query key factory for consistent caching
export const queryKeys = {
  // Stations
  stations: {
    all: ["stations"] as const,
    lists: () => [...queryKeys.stations.all, "list"] as const,
    list: (query?: string) => [...queryKeys.stations.lists(), query] as const,
    details: () => [...queryKeys.stations.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.stations.details(), id] as const,
  },

  // Bookings
  bookings: {
    all: ["bookings"] as const,
    lists: () => [...queryKeys.bookings.all, "list"] as const,
    list: (filters: BookingsQuery) =>
      [...queryKeys.bookings.lists(), filters] as const,
    details: () => [...queryKeys.bookings.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.bookings.details(), id] as const,
  },
} as const;

// Utility to invalidate related queries
export const invalidateQueries = {
  // When station changes, invalidate station-related data
  station: (stationId: string) => [
    queryKeys.stations.detail(stationId),
    queryKeys.bookings.list({ stationId }),
  ],

  // When booking changes, invalidate booking and related station data
  booking: (bookingId: string, stationId: string) => [
    queryKeys.bookings.detail(bookingId),
    queryKeys.bookings.lists(),
    queryKeys.stations.detail(stationId),
  ],

  // Clear all cached data
  all: () => [queryKeys.stations.all, queryKeys.bookings.all],
};
