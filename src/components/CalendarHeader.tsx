import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonthYear, getISOWeek } from '../lib/date-utils';

interface CalendarHeaderProps {
  weekDays: Date[];
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onDateSelect: (date: Date) => void;
}

export function CalendarHeader({ weekDays, onPreviousWeek, onNextWeek, onDateSelect }: CalendarHeaderProps) {
  const weekNumber = getISOWeek(weekDays[0]);
  const weekStart = weekDays[0];

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1"></div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={onPreviousWeek}  
          className="p-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-white" />
        </button>
        
        <div className="text-center min-w-[140px]">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
            {formatMonthYear(weekDays[0])}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Week {weekNumber}
          </span>
        </div>
        
        <button 
          onClick={onNextWeek} 
          className="p-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-gray-600 dark:text-white" />
        </button>
      </div>

      <div className="flex-1 flex justify-end">
        <input
          type="date"
          lang="en"
          value={`${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`}
          onChange={(e) => {
            const selectedDate = new Date(e.target.value);
            if (!isNaN(selectedDate.getTime())) {
              onDateSelect(selectedDate);
            }
          }}
          className="hidden lg:block px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white transition-colors"
          title="Select date"
        />
      </div>
    </div>
  );
}
