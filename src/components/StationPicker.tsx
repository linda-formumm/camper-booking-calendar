import { useState, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { stationsApi } from '../lib/api';
import { useAppStore } from '../store/appStore';
import type { Station } from '../lib/types';

export function StationPicker({ autoFocus = false }: { autoFocus?: boolean }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const { selectedStation, setSelectedStation } = useAppStore();
  const navigate = useNavigate();

  // Load stations once
  useEffect(() => {
    stationsApi.getStations().then(setStations);
  }, []);

  // Filter stations based on query
  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(query.toLowerCase())
  );

  // Show input value: either selected station name or current query
  const inputValue = selectedStation ? selectedStation.name : query;

  const handleInputChange = (value: string) => {
    if (selectedStation) {
      // If station is selected and user types, clear selection and start new search
      setSelectedStation(null);
    }
    setQuery(value);
    setIsOpen(value.length > 0);
  };

  const selectStation = (station: Station) => {
    setSelectedStation(station);
    setQuery('');
    setIsOpen(false);
    navigate('/calendar');
  };

  const clearSelection = () => {
    setSelectedStation(null);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-white z-10" />
        <Input
          type="text"
          placeholder="Enter station..."
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (!selectedStation && query.length > 0) {
              setIsOpen(true);
            }
          }}
          onBlur={() => {
            // Close after small delay to allow clicking suggestions
            setTimeout(() => setIsOpen(false), 150);
          }}
          className={cn(
            "pl-10 pr-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500",
            "dark:bg-gray-800/80 dark:border-gray-500/50 dark:text-white dark:placeholder-white/80"
          )}
          autoFocus={autoFocus}
        />
        {(query || selectedStation) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-transparent dark:hover:bg-gray-700"
          >
            <X className="h-3 w-3 dark:text-gray-400" />
          </Button>
        )}
      </div>

      {/* Simple dropdown */}
      {isOpen && filteredStations.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-white py-1 shadow-lg dark:bg-gray-800 dark:border-gray-600">
          {filteredStations.slice(0, 10).map((station) => (
            <li
              key={station.id}
              onClick={() => selectStation(station)}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white">{station.name}</span>
            </li>
          ))}
        </ul>
      )}

      {/* No results message */}
      {isOpen && query.length > 0 && filteredStations.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-white py-3 px-4 shadow-lg dark:bg-gray-800 dark:border-gray-600">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No stations found for "{query}"
          </p>
        </div>
      )}
    </div>
  );
}
