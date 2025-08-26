import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, CheckCircle } from "lucide-react";
import { HeroBackground } from "@/components/HeroBackground";
import { ErrorState } from "@/components/ErrorState";
import { BookingInfoPanel } from "@/components/BookingInfoPanel";
import { useAppStore } from "@/store/appStore";
import { useBookingStore } from "@/store/bookingStore";
import { getImagePath } from "@/lib/image-utils";
import * as dateUtils from "@/lib/date-utils";

export default function BookingDetailPage() {
  const { bookingId } = useParams<{ stationId: string; bookingId: string }>();
  const navigate = useNavigate();
  const { setWeekStart, selectedStation } = useAppStore();
  const { getBooking } = useBookingStore();

  // Get the booking from store (contains all current data including drag changes)
  const booking = bookingId ? getBooking(bookingId) : undefined;

  const handleBack = () => {
    if (booking) {
      const bookingStartDate = new Date(booking.startDate);
      const weekStart = dateUtils.getWeekStart(bookingStartDate);
      setWeekStart(weekStart);
    }
    navigate("/calendar");
  };

  // Layout wrapper
  const renderLayout = (content: React.ReactNode) => (
    <main className="min-h-screen relative">
      <HeroBackground 
        lightImage={getImagePath("/images/van-roadtrip-light.jpg")}
        darkImage={getImagePath("/images/van-mountains-dark.jpg")}
      >
        <div className="text-center space-y-4">
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white lg:text-white">
            Booking Details
          </h1>
          
          <div className="hidden lg:flex items-center justify-center">
            <hr className="w-16 h-px bg-white/50" />
            <CheckCircle size={20} className="mx-3 text-white" />
            <hr className="w-16 h-px bg-white/50" />
          </div>
          
          <p className="text-sm lg:text-lg text-gray-600 dark:text-gray-400 lg:text-white/90">
            {booking ? `Booking ID: ${booking.id}` : 'Loading booking information...'}
          </p>
        </div>
      </HeroBackground>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mx-auto">
          <nav className="mb-6" role="navigation" aria-label="Secondary navigation">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm"
              aria-label="Back to calendar"
              type="button"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back to Calendar</span>
            </button>
          </nav>
          {content}
        </div>
      </div>
    </main>
  );

  // Not Found State
  if (!booking) {
    return renderLayout(
      <ErrorState 
        title="Booking Not Found" 
        message="The booking you're looking for doesn't exist or has been removed." 
      />
    );
  }

  // Success State - Show Booking Details
  const customerInfo = [
    { label: "Name", value: booking.customerName },
  ];

  const duration = dateUtils.calculateBookingDuration(booking.startDate, booking.endDate);
  
  const bookingInfo = [
    { label: "Pickup Date", value: dateUtils.formatDateForDisplay(booking.startDate) },
    { label: "Return Date", value: dateUtils.formatDateForDisplay(booking.endDate) },
    { label: "Duration", value: `${duration} day${duration !== 1 ? 's' : ''}` },
    { label: "Station", value: selectedStation?.name || booking.pickupReturnStationId },
  ];

  return renderLayout(
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <BookingInfoPanel title="Customer Information" items={customerInfo} />
      <BookingInfoPanel title="Booking Information" items={bookingInfo} />
    </div>
  );
}
