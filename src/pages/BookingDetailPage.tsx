import { useParams, useNavigate } from "react-router-dom";

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          ← Back to Calendar
        </button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Booking #{id}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Booking details will be displayed here
          </p>
        </div>
      </div>

      {/* Placeholder for booking details */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Booking detail component will be implemented here
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
          Booking ID: {id}
        </p>
      </div>
    </div>
  );
}
