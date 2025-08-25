import { create } from 'zustand';
import type { Booking } from '../lib/types';

interface BookingStore {
  // All bookings (server data + local changes merged)
  bookings: Booking[];
  
  // Actions
  setBookings: (bookings: Booking[]) => void;
  updateBooking: (booking: Booking) => void;
  getBooking: (bookingId: string) => Booking | undefined;
  getAllBookings: () => Booking[];
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: [],
  
  setBookings: (bookings: Booking[]) => {
    set({ bookings });
  },
  
  updateBooking: (updatedBooking: Booking) => {
    set((state) => {
      // Replace existing booking or add new one
      const otherBookings = state.bookings.filter(b => b.id !== updatedBooking.id);
      
      console.log('Booking updated in store:', {
        bookingId: updatedBooking.id,
        startDate: updatedBooking.startDate,
        endDate: updatedBooking.endDate,
        customerName: updatedBooking.customerName
      });
      
      // TODO: Later API call to persist changes
      console.log('TODO: API call needed to persist booking changes:', {
        method: 'PUT',
        endpoint: `/api/bookings/${updatedBooking.id}`,
        payload: {
          startDate: updatedBooking.startDate,
          endDate: updatedBooking.endDate
        }
      });
      
      // TODO: Uncomment when API is ready
      // try {
      //   await bookingsApi.updateBooking(updatedBooking.id, {
      //     startDate: updatedBooking.startDate,
      //     endDate: updatedBooking.endDate
      //   });
      //   console.log('Booking successfully updated via API');
      // } catch (error) {
      //   console.error('Failed to update booking via API:', error);
      //   // TODO: Handle error - maybe revert local changes or show user notification
      // }
      
      return {
        bookings: [...otherBookings, updatedBooking]
      };
    });
  },
  
  getBooking: (bookingId: string) => {
    const state = get();
    return state.bookings.find(b => b.id === bookingId);
  },
  
  getAllBookings: () => {
    return get().bookings;
  },
}));
