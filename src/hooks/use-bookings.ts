import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsApi } from "../lib/api";
import type { BookingRequest, BookingsQuery } from "../lib/types";

export function useBookings(params: BookingsQuery = {}) {
  return useQuery({
    queryKey: ["bookings", params],
    queryFn: () => bookingsApi.getBookings(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBooking(id: string | undefined) {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: () => (id ? bookingsApi.getBooking(id) : null),
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (booking: BookingRequest) => bookingsApi.createBooking(booking),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["stations"] });
    },
  });
}
