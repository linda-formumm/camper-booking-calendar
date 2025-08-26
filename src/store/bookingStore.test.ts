import { describe, it, expect, beforeEach } from "vitest";
import { useBookingStore } from "./bookingStore";
import type { Booking } from "../lib/types";

// Mock booking data
const mockBookings: Booking[] = [
  {
    id: "booking-1",
    customerName: "John Doe",
    startDate: "2021-03-10",
    endDate: "2021-03-12",
    pickupReturnStationId: "station-1"
  },
  {
    id: "booking-2", 
    customerName: "Jane Smith",
    startDate: "2021-03-15",
    endDate: "2021-03-17",
    pickupReturnStationId: "station-1"
  }
];

describe("bookingStore", () => {
  beforeEach(() => {
    // Reset store before each test
    useBookingStore.getState().setBookings([]);
  });

  describe("setBookings", () => {
    it("should set bookings correctly", () => {
      const { setBookings, getAllBookings } = useBookingStore.getState();
      
      setBookings(mockBookings);
      
      expect(getAllBookings()).toEqual(mockBookings);
    });

    it("should replace existing bookings", () => {
      const { setBookings, getAllBookings } = useBookingStore.getState();
      
      setBookings([mockBookings[0]]);
      expect(getAllBookings()).toHaveLength(1);
      
      setBookings(mockBookings);
      expect(getAllBookings()).toHaveLength(2);
    });
  });

  describe("updateBooking", () => {
    it("should update existing booking", () => {
      const { setBookings, updateBooking, getBooking } = useBookingStore.getState();
      
      setBookings(mockBookings);
      
      const updatedBooking = {
        ...mockBookings[0],
        startDate: "2021-03-11",
        endDate: "2021-03-13"
      };
      
      updateBooking(updatedBooking);
      
      const result = getBooking("booking-1");
      expect(result?.startDate).toBe("2021-03-11");
      expect(result?.endDate).toBe("2021-03-13");
      expect(result?.customerName).toBe("John Doe");
    });

    it("should add new booking if it doesn't exist", () => {
      const { updateBooking, getAllBookings } = useBookingStore.getState();
      
      const newBooking: Booking = {
        id: "booking-new",
        customerName: "New Customer",
        startDate: "2021-03-20",
        endDate: "2021-03-22",
        pickupReturnStationId: "station-1"
      };
      
      updateBooking(newBooking);
      
      expect(getAllBookings()).toHaveLength(1);
      expect(getAllBookings()[0]).toEqual(newBooking);
    });
  });

  describe("getBooking", () => {
    it("should return correct booking by ID", () => {
      const { setBookings, getBooking } = useBookingStore.getState();
      
      setBookings(mockBookings);
      
      const result = getBooking("booking-1");
      expect(result).toEqual(mockBookings[0]);
    });

    it("should return undefined for non-existent booking", () => {
      const { setBookings, getBooking } = useBookingStore.getState();
      
      setBookings(mockBookings);
      
      const result = getBooking("non-existent");
      expect(result).toBeUndefined();
    });
  });

  describe("getAllBookings", () => {
    it("should return empty array when no bookings", () => {
      const { getAllBookings } = useBookingStore.getState();
      
      expect(getAllBookings()).toEqual([]);
    });

    it("should return all bookings", () => {
      const { setBookings, getAllBookings } = useBookingStore.getState();
      
      setBookings(mockBookings);
      
      expect(getAllBookings()).toEqual(mockBookings);
    });
  });
});
