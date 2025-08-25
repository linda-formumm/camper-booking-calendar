import { MapIcon } from 'lucide-react';
import { StationPicker } from '../components/StationPicker';
import { StartPageHero } from '../components/StartPageHero';

export default function StartPage() {

  return (
    <main className="relative min-h-[calc(80vh-200px)]">
      {/* Hero Section */}
      <StartPageHero>
        <div className="mx-auto w-full max-w-6xl px-4 text-center">
          <header className="mb-8">
            <h1 className="mb-6 text-5xl font-black leading-none text-white drop-shadow-2xl md:text-7xl">
              Camper Booking
            </h1>
            
            <div className="mb-6 flex items-center justify-center" aria-hidden="true">
              <hr className="h-px w-20 bg-gradient-to-r from-transparent via-white to-transparent border-0" />
              <MapIcon size={24} className="mx-4 text-white" />
              <hr className="h-px w-20 bg-gradient-to-r from-transparent via-white to-transparent border-0" />
            </div>
            
            <p className="mb-2 text-2xl font-light text-white/90 drop-shadow-lg md:text-3xl">
              Management Dashboard
            </p>
            <p className="text-lg font-light text-white/80 drop-shadow-lg">
              Professional fleet operations
            </p>
          </header>

          {/* Station Selection Form */}
          <section className="mx-auto max-w-lg">
              <form className="rounded-3xl bg-gray-900/40 p-10 shadow-2xl dark:bg-gray-900/50">
                <header className="mb-8 text-center">
                  <h2 className="mb-3 text-2xl font-bold text-white drop-shadow-lg">
                    Begin Your Journey
                  </h2>
                  <p className="text-white/80 drop-shadow-lg">
                    Select your base station to access the dashboard
                  </p>
                </header>
                
                <fieldset>
                  <label 
                    htmlFor="station-picker" 
                    className="mb-4 block text-left text-sm font-medium text-white/90 drop-shadow-lg"
                  >
                    Choose Station
                  </label>
                  <StationPicker autoFocus={true} />
                </fieldset>
              </form>
            </section>
          </div>
      </StartPageHero>
    </main>
  );
}
