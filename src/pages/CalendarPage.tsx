import { Link } from 'react-router-dom'
import { Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { 
  useWeekStart, 
  useSelectedStation, 
  useSetStation, 
  usePrevWeek, 
  useNextWeek, 
  useGoToday 
} from '../store/appStore'

export default function CalendarPage() {
  const weekStart = useWeekStart()
  const selectedStation = useSelectedStation()
  const setStation = useSetStation()
  const prevWeek = usePrevWeek()
  const nextWeek = useNextWeek()
  const goToday = useGoToday()

  // Format current week display
  const formatWeek = (date: Date) => {
    const weekNumber = getWeekNumber(date)
    const year = date.getFullYear()
    return `KW ${weekNumber}, ${year}`
  }

  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  }

  const mockStations = [
    { id: 'muc', name: 'München Hauptbahnhof' },
    { id: 'ber', name: 'Berlin Alexanderplatz' },
    { id: 'ham', name: 'Hamburg Hauptbahnhof' },
    { id: 'fra', name: 'Frankfurt am Main' },
  ]
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Buchungskalender
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Überblick über alle Camperbuchungen
          </p>
        </div>
        
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus size={16} />
          Neue Buchung
        </button>
      </div>

      {/* Station Selection */}
      <div className="flex items-center gap-4 mb-6">
        <label htmlFor="station-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Station:
        </label>
        <select
          id="station-select"
          value={selectedStation || ''}
          onChange={(e) => setStation(e.target.value || null)}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Alle Stationen</option>
          {mockStations.map(station => (
            <option key={station.id} value={station.id}>
              {station.name}
            </option>
          ))}
        </select>
        {selectedStation && (
          <span className="text-sm text-blue-600 dark:text-blue-400">
            Filter aktiv: {mockStations.find(s => s.id === selectedStation)?.name}
          </span>
        )}
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <button 
          onClick={prevWeek}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
        >
          <ChevronLeft size={16} />
          Vorherige Woche
        </button>
        
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatWeek(weekStart)}
          </h2>
          <button
            onClick={goToday}
            className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
          >
            Heute
          </button>
        </div>
        
        <button 
          onClick={nextWeek}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
        >
          Nächste Woche
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Calendar Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Kalender-Ansicht
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Hier wird der Buchungskalender implementiert
          </p>
          
          {/* Demo Links zu Booking Details */}
          <div className="flex gap-3 justify-center">
            <Link 
              to="/booking/abc123"
              className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              Demo Buchung #1
            </Link>
            <Link 
              to="/booking/def456"
              className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
            >
              Demo Buchung #2
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Diese Woche</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">12 Buchungen</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Verfügbare Camper</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">8 Fahrzeuge</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Auslastung</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">75%</p>
        </div>
      </div>
    </div>
  )
}
