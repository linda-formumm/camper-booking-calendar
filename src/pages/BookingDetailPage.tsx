import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, User, Phone, Mail, Car } from 'lucide-react'

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Mock data basierend auf ID
  const getBookingData = (bookingId: string) => {
    const mockData = {
      'abc123': {
        id: 'abc123',
        customerName: 'Max Mustermann',
        email: 'max@example.com',
        phone: '+49 123 456789',
        vehicle: 'Volkswagen California',
        startDate: '2025-08-25',
        endDate: '2025-08-30',
        station: 'München Hauptbahnhof',
        status: 'confirmed',
        totalPrice: 650
      },
      'def456': {
        id: 'def456',
        customerName: 'Anna Schmidt',
        email: 'anna@example.com',
        phone: '+49 987 654321',
        vehicle: 'Mercedes Marco Polo',
        startDate: '2025-08-27',
        endDate: '2025-09-02',
        station: 'Berlin Alexanderplatz',
        status: 'pending',
        totalPrice: 890
      }
    }
    
    return mockData[bookingId as keyof typeof mockData] || {
      id: bookingId,
      customerName: 'Demo Kunde',
      email: 'demo@example.com',
      phone: '+49 555 123456',
      vehicle: 'Beispiel Camper',
      startDate: '2025-08-28',
      endDate: '2025-09-01',
      station: 'Demo Station',
      status: 'confirmed',
      totalPrice: 750
    }
  }

  const booking = getBookingData(id || '')
  const statusColors = {
    confirmed: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    cancelled: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Navigation */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
          Zurück zum Kalender
        </button>
        
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Buchung #{booking.id}
        </h1>
        
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[booking.status as keyof typeof statusColors]}`}>
          {booking.status === 'confirmed' ? 'Bestätigt' : 
           booking.status === 'pending' ? 'Ausstehend' : 'Storniert'}
        </span>
      </div>

      {/* Booking Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User size={20} />
            Kundeninformationen
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
              <p className="text-gray-900 dark:text-white font-medium">{booking.customerName}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">E-Mail</label>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <a href={`mailto:${booking.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {booking.email}
                </a>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Telefon</label>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <a href={`tel:${booking.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {booking.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Buchungsdetails
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Fahrzeug</label>
              <div className="flex items-center gap-2">
                <Car size={16} className="text-gray-400" />
                <p className="text-gray-900 dark:text-white font-medium">{booking.vehicle}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Station</label>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400" />
                <p className="text-gray-900 dark:text-white font-medium">{booking.station}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Von</label>
                <p className="text-gray-900 dark:text-white font-medium">{booking.startDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Bis</label>
                <p className="text-gray-900 dark:text-white font-medium">{booking.endDate}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Gesamtpreis</label>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{booking.totalPrice}€</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
          Buchung bearbeiten
        </button>
        <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-2 rounded-lg transition-colors">
          E-Mail senden
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors">
          Stornieren
        </button>
      </div>

      {/* Demo Navigation Links */}
      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">🔗 Demo Navigation</h3>
        <div className="flex gap-3 text-sm">
          <Link to="/booking/abc123" className="text-blue-600 dark:text-blue-400 hover:underline">
            Buchung #abc123
          </Link>
          <Link to="/booking/def456" className="text-blue-600 dark:text-blue-400 hover:underline">
            Buchung #def456
          </Link>
          <Link to="/booking/xyz789" className="text-blue-600 dark:text-blue-400 hover:underline">
            Buchung #xyz789
          </Link>
        </div>
      </div>
    </div>
  )
}
