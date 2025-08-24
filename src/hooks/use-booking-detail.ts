import { useQuery } from '@tanstack/react-query';
import type { Booking } from '../lib/types';

/**
 * Hook to fetch booking detail by station and booking ID
 */
export function useBookingDetail(stationId: string | null, bookingId: string | null) {
  return useQuery({
    queryKey: ['booking-detail', stationId, bookingId],
    queryFn: async (): Promise<Booking> => {
      if (!stationId || !bookingId) {
        throw new Error('Station ID and Booking ID are required');
      }

      const response = await fetch(
        `https://605c94c36d85de00170da8b4.mockapi.io/stations/${stationId}/bookings/${bookingId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch booking details: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!stationId && !!bookingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}
