export function BookingBarLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-stone-600 dark:text-gray-400 mb-4">
      <div className="flex items-center gap-2">
        <div className="w-4 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-sm"></div>
        <span>Complete booking</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-l-sm"></div>
        <span>Booking start</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-2 bg-blue-600"></div>
        <span>Continues</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-r-sm"></div>
        <span>Booking end</span>
      </div>
      <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
        <span>◀▶</span>
        <span>Extended booking indicators</span>
      </div>
    </div>
  );
}
