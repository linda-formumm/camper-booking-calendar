import { useAppStore } from '../store/appStore';
import Calendar from '../components/Calendar';

export default function CalendarPage() {
  const { selectedStation } = useAppStore();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {selectedStation ? `${selectedStation.name} Booking Calendar` : 'Booking Calendar'}
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          {selectedStation ? `Manage bookings for ${selectedStation.name} station` : 'Select a station to use the calendar'}
        </p>
      </header>

      {/* Calendar Component */}
      <Calendar />
    </div>
  );
}
