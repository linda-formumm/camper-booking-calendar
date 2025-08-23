import { useAppStore } from '../store/appStore';

export default function CalendarPage() {
  const { selectedStation } = useAppStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {selectedStation ? `${selectedStation.name} Booking Calendar` : 'Booking Calendar'}
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          {selectedStation ? `Manage bookings for ${selectedStation.name} station` : 'Calendar implementation will be here'}
        </p>
      </div>

      {/* Placeholder for calendar implementation */}
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Calendar component will be implemented here
        </p>
      </div>
    </div>
  );
}
