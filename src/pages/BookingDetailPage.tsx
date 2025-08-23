import { useParams, useNavigate } from "react-router-dom";

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="rounded-lg bg-gray-100 px-3 py-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          ← Back to Calendar
        </button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Booking #{id}
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Booking details will be displayed here
          </p>
        </div>
      </div>

      {/* Placeholder for booking details */}
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Booking detail component will be implemented here
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          Booking ID: {id}
        </p>
      </div>
    </div>
  );
}
