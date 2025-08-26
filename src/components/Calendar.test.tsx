import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Calendar from "./Calendar";
import { useAppStore } from "../store/appStore";
import { useBookingStore } from "../store/bookingStore";

// Mock the stores
vi.mock("../store/appStore");
vi.mock("../store/bookingStore");

const mockUseAppStore = vi.mocked(useAppStore);
const mockUseBookingStore = vi.mocked(useBookingStore);

// Mock data
const mockStation = {
  id: "station-1",
  name: "Test Station",
  location: "Test Location"
};

const mockBookings = [
  {
    id: "booking-1",
    customerName: "John Doe", 
    startDate: "2021-03-10",
    endDate: "2021-03-12",
    pickupReturnStationId: "station-1"
  }
];

describe("Calendar Component", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });

    // Reset mocks
    vi.clearAllMocks();

    // Setup default mock implementations
    mockUseAppStore.mockReturnValue({
      selectedStation: mockStation,
      weekStart: new Date(2021, 2, 8), // March 8, 2021 (Monday)
      setWeekStart: vi.fn(),
      goToPreviousWeek: vi.fn(),
      goToNextWeek: vi.fn()
    } as any);

    mockUseBookingStore.mockReturnValue({
      updateBooking: vi.fn(),
      getAllBookings: vi.fn(() => mockBookings)
    } as any);
  });

  const renderCalendar = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Calendar />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it("should render calendar header correctly", () => {
    renderCalendar();
    
    expect(screen.getByText("Booking Calendar")).toBeInTheDocument();
    expect(screen.getByText("Location: Test Station")).toBeInTheDocument();
  });

  it("should render weekdays correctly", () => {
    renderCalendar();
    
    // Check for day headers (desktop)
    const dayHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    dayHeaders.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it("should display week navigation buttons", () => {
    renderCalendar();
    
    const prevButton = screen.getByRole("button", { name: /previous/i });
    const nextButton = screen.getByRole("button", { name: /next/i });
    
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it("should call navigation functions when buttons clicked", () => {
    const mockGoToPrevious = vi.fn();
    const mockGoToNext = vi.fn();
    
    mockUseAppStore.mockReturnValue({
      selectedStation: mockStation,
      weekStart: new Date(2021, 2, 8),
      setWeekStart: vi.fn(),
      goToPreviousWeek: mockGoToPrevious,
      goToNextWeek: mockGoToNext
    } as any);

    renderCalendar();
    
    const prevButton = screen.getByRole("button", { name: /previous/i });
    const nextButton = screen.getByRole("button", { name: /next/i });
    
    fireEvent.click(prevButton);
    expect(mockGoToPrevious).toHaveBeenCalledOnce();
    
    fireEvent.click(nextButton);
    expect(mockGoToNext).toHaveBeenCalledOnce();
  });

  it("should show booking information when bookings exist", () => {
    renderCalendar();
    
    // Should show the customer name from the mock booking
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("should show appropriate message when no station selected", () => {
    mockUseAppStore.mockReturnValue({
      selectedStation: null,
      weekStart: new Date(2021, 2, 8),
      setWeekStart: vi.fn(),
      goToPreviousWeek: vi.fn(),
      goToNextWeek: vi.fn()
    } as any);

    renderCalendar();
    
    expect(screen.getByText("Fleet Management Dashboard")).toBeInTheDocument();
  });
});
