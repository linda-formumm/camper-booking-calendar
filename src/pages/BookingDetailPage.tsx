import { useParams, useNavigate } from "react-router-dom";
import { useBookingDetail } from "../hooks/use-booking-detail";
import { useStations } from "../hooks/use-stations";
import { calculateBookingDuration } from "../lib/date-utils";

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
    <div className="space-y-6">
      {/* Header with blue title and underline */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
          Booking Details
        </h1>
        <div className="w-20 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Booking Details */}
      <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Customer Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Customer Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Customer Name
                </label>
                <p className="text-lg text-gray-900 dark:text-white">
                  {booking.customerName}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Booking Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Booking Start Date
                </label>
                <p className="text-lg text-gray-900 dark:text-white">
                  {new Date(booking.startDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Booking End Date
                </label>
                <p className="text-lg text-gray-900 dark:text-white">
                  {new Date(booking.endDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Booking Duration
                </label>
                <p className="text-lg text-gray-900 dark:text-white">
                  {duration} {duration === 1 ? 'day' : 'days'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pickup & Return Station
                </label>
                <p className="text-lg text-gray-900 dark:text-white">
                  {station?.name || `Station ${stationId}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Calendar Button */}
      <div className="flex">
        <button
          onClick={() => {
            // Navigate back to calendar with the booking's date
            const bookingDate = new Date(booking.startDate);
            const dateParam = bookingDate.toISOString().split('T')[0];
            navigate(`/calendar?date=${dateParam}`);
          }}
          className="rounded-lg bg-gray-100 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          ← Back to Calendar
        </button>
      </div>
    </div>
  );
}
