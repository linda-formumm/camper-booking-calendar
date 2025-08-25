import { useParams, useNavigate } from "react-router-dom";
import { useBookingDetail } from "../hooks/use-booking-detail";
import { useStations } from "../hooks/use-stations";
import { calculateBookingDuration } from "../lib/date-utils";
import { HeroBackground } from "../components/HeroBackground";

export default function BookingDetailPage() {
  const { stationId, bookingId } = useParams<{ stationId: string; bookingId: string }>();
  const navigate = useNavigate();
  
  const { data: booking, isLoading: bookingLoading, error: bookingError } = useBookingDetail(stationId || null, bookingId || null);
  const { data: stations } = useStations();
  
  const station = stations?.find(s => s.id === stationId);

  if (bookingLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Booking Details
          </h1>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
        <div className="flex">
          <button
            onClick={() => navigate("/calendar")}
            className="rounded-lg bg-gray-100 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            ← Back to Calendar
          </button>
        </div>
      </div>
    );
  }

  if (bookingError || !booking) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Booking Details
          </h1>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-12 text-center dark:border-red-800 dark:bg-red-900/20">
          <p className="text-lg text-red-600 dark:text-red-400">
            Booking not found
          </p>
          <p className="mt-2 text-sm text-red-500 dark:text-red-500">
            The booking you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <div className="flex">
          <button
            onClick={() => navigate("/calendar")}
            className="rounded-lg bg-gray-100 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            ← Back to Calendar
          </button>
        </div>
      </div>
    );
  }

  const duration = calculateBookingDuration(booking.startDate, booking.endDate);

  return (
    <div className="relative">
      {/* Hero Header Section */}
      <HeroBackground
        lightImage="/images/van-roadtrip-light.jpg"
        darkImage="/images/van-mountains-dark.jpg"
        lightImageMobile="/images/van-roadtrip-light-mobile.jpg"
        darkImageMobile="/images/van-mountains-dark-mobile.jpg"
        preload={true}
      >
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-black text-white drop-shadow-2xl md:text-5xl">
            Booking Details
          </h1>
          
          <div className="mb-4 flex items-center justify-center">
            <hr className="h-px w-16 bg-gradient-to-r from-transparent via-white to-transparent border-0" />
            <svg className="mx-3 w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <hr className="h-px w-16 bg-gradient-to-r from-transparent via-white to-transparent border-0" />
          </div>
          
          <p className="text-lg font-light text-white/90 drop-shadow-lg">
            Location: {station?.name || 'Roadsurfer Station'} • Booking ID {bookingId}
          </p>
        </div>
      </HeroBackground>

      <div className="space-y-6">

      {/* Booking Details - Desktop Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Customer Information Panel */}
        <div className="relative">
          <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200/60 shadow-sm dark:bg-gray-800/70 dark:border-gray-600/40 overflow-hidden">
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Customer Information
                </h2>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-600/30">
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Customer Name
                  </dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-white">
                    {booking.customerName}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Information Panel */}
        <div className="relative">
          <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200/60 shadow-sm dark:bg-gray-800/70 dark:border-gray-600/40 overflow-hidden">
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Booking Information
                </h2>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-600/30">
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Pickup Date
                  </dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-white">
                    {new Date(booking.startDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </dd>
                </div>
                
                <div className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-600/30">
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Return Date
                  </dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-white">
                    {new Date(booking.endDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </dd>
                </div>
                
                <div className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-600/30">
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Duration
                  </dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-white">
                    {duration} {duration === 1 ? 'day' : 'days'}
                  </dd>
                </div>
                
                <div className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-600/30">
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Station
                  </dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-white">
                    {station?.name || `Station ${stationId}`}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="flex justify-start">
        <button
          onClick={() => {
            const bookingDate = new Date(booking.startDate);
            const dateParam = bookingDate.toISOString().split('T')[0];
            navigate(`/calendar?date=${dateParam}`);
          }}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors cursor-pointer"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Calendar
        </button>
      </div>
      </div>
    </div>
  );
}
