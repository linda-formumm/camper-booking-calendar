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
              <svg 
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
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
