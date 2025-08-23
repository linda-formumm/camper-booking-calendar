import { MapIcon } from 'lucide-react';
import { StationPicker } from '../components/StationPicker';
import { useAppStore } from '../store/appStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StartPage() {
  const { selectedStation } = useAppStore();
  const navigate = useNavigate();

  // Redirect to calendar when station is selected
  useEffect(() => {
    if (selectedStation) {
      navigate('/calendar');
    }
  }, [selectedStation, navigate]);

  return (
    <div className="min-h-[calc(80vh-200px)] relative">
      {/* Full Screen Hero mit Light/Dark Background */}
      <div className="relative h-[720px] overflow-hidden">
        {/* Light/Dark Mode Photo Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat dark:hidden"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1521499420147-36d5bfc2781f?q=80&w=2602&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-orange-200 via-pink-200 to-blue-200 opacity-10"></div>
        </div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden dark:block"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1604854417262-01a8f7975775?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-orange-300 via-pink-400 to-blue-600 opacity-0"></div>
        </div>
        {/* Dark Gradient Overlay für Lesbarkeit */}
        <div className="absolute inset-0 bg-gradient-to-a from-black/30 via-black/20 to-black/60 z-10"></div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="max-w-6xl mx-auto px-4 w-full">
            <div className="text-center">
              {/* Main Title */}
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl leading-none">
                  Camper Booking
                </h1>
                <div className="flex items-center justify-center mb-6">
                  <div className="h-1 w-20 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                  <MapIcon size={24} className="text-white mx-4" />
                  <div className="h-1 w-20 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                </div>
                <p className="text-2xl md:text-3xl text-white/90 font-light mb-2 drop-shadow-lg">
                  Management Dashboard
                </p>
                <p className="text-lg text-white/80 font-light drop-shadow-lg">
                  Professional fleet operations
                </p>
              </div>

              {/* Station Selection - Floating Card */}
              <div className="max-w-lg mx-auto">
                <div className="bg-gray-900/40 dark:bg-gray-900/50 rounded-3xl p-10 shadow-2xl">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">
                      Begin Your Journey
                    </h2>
                    <p className="text-white/80 drop-shadow-lg">
                      Select your base station to access the dashboard
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-4 text-left drop-shadow-lg">
                        Choose Station
                      </label>
                      <StationPicker autoFocus={true} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
