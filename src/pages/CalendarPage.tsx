import { Calendar as CalendarIcon } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import Calendar from '../components/Calendar';

export default function CalendarPage() {
  const { selectedStation } = useAppStore();

  return (
    <div className="space-y-6">
     
        {!selectedStation && (
           <header>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Booking Calendar
            </h1>
          </header>
        )}
      
      {/* Calendar Component */}
      {selectedStation ? (
        <Calendar />
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Select a Station
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              To use the booking calendar, please first select a station from the dropdown menu above.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
