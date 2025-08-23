import type { Station, Booking } from "./types";

// Mock stations data
export const mockStations: Station[] = [
  {
    id: "station-1",
    name: "Berlin Hauptbahnhof",
    location: "Berlin, Germany",
    latitude: 52.525,
    longitude: 13.3694,
    totalCampers: 25,
    availableCampers: 8,
    pricePerDay: 89,
    features: ["WiFi", "Power", "Water", "Toilet"],
    imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
  },
  {
    id: "station-2",
    name: "Munich Central",
    location: "Munich, Germany",
    latitude: 48.1408,
    longitude: 11.5581,
    totalCampers: 18,
    availableCampers: 3,
    pricePerDay: 95,
    features: ["WiFi", "Power", "Water", "Toilet", "Shower"],
    imageUrl:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
  },
  {
    id: "station-3",
    name: "Hamburg Harbor",
    location: "Hamburg, Germany",
    latitude: 53.5511,
    longitude: 9.9937,
    totalCampers: 30,
    availableCampers: 12,
    pricePerDay: 78,
    features: ["WiFi", "Power", "Water"],
    imageUrl:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
  },
];

// Mock bookings data
export const mockBookings: Booking[] = [
  {
    id: "booking-1",
    stationId: "station-1",
    camperId: "camper-vw-1",
    camperType: "VW California",
    customerName: "Max Mustermann",
    customerEmail: "max@example.com",
    startDate: "2025-08-25",
    endDate: "2025-08-28",
    totalPrice: 267,
    status: "confirmed",
    createdAt: "2025-08-20T10:30:00Z",
    features: ["WiFi", "Kitchen", "Bed"],
  },
  {
    id: "booking-2",
    stationId: "station-1",
    camperId: "camper-mb-1",
    camperType: "Mercedes Marco Polo",
    customerName: "Lisa Schmidt",
    customerEmail: "lisa@example.com",
    startDate: "2025-08-26",
    endDate: "2025-08-30",
    totalPrice: 356,
    status: "confirmed",
    createdAt: "2025-08-21T14:15:00Z",
    features: ["WiFi", "Kitchen", "Bed", "AC"],
  },
  {
    id: "booking-3",
    stationId: "station-2",
    camperId: "camper-ford-1",
    camperType: "Ford Transit Custom",
    customerName: "Tom Weber",
    customerEmail: "tom@example.com",
    startDate: "2025-08-24",
    endDate: "2025-08-27",
    totalPrice: 285,
    status: "pending",
    createdAt: "2025-08-22T09:45:00Z",
    features: ["Kitchen", "Bed"],
  },
];

// Helper to simulate API delay
export const simulateApiDelay = (ms: number = 500) =>
  new Promise(resolve => setTimeout(resolve, ms));
