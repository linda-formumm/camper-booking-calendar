import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { stationsApi, bookingsApi } from '../lib/api';
import { useAppStore } from '../store/appStore';
import type { Station } from '../lib/types';

export function StationPicker({ autoFocus = false }: { autoFocus?: boolean }) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const { selectedStation, setSelectedStation } = useAppStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const loadStations = async () => {
      setIsLoading(true);
      try {
        const data = await stationsApi.getStations();
        setStations(data);
      } catch (error) {
        console.error('Failed to load stations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStations();
  }, []);

  // Auto focus when autoFocus prop is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Small delay to ensure component is fully mounted
      setTimeout(() => {
        inputRef.current?.focus();
        setIsFocused(true);
      }, 100);
    }
  }, [autoFocus]);

  // Filter stations based on input
  useEffect(() => {
    if (!inputValue.trim()) {
      setFilteredStations([]);
      setIsOpen(false);
      return;
    }

    const filtered = stations.filter(station =>
      station.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredStations(filtered);
    setIsOpen(filtered.length > 0);
    setHighlightedIndex(-1);
  }, [inputValue, stations]);

  // Set input value when station is selected externally
  useEffect(() => {
    if (selectedStation) {
      setInputValue(selectedStation.name);
      setIsOpen(false);
    }
  }, [selectedStation]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (!value.trim()) {
      setSelectedStation(null);
    }
  };

  const handleStationSelect = async (station: Station) => {
    setSelectedStation(station);
    setInputValue(station.name);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();

    // Log all bookings for this station
    try {
      const bookings = await bookingsApi.getBookings({ stationId: station.id });
      console.log(`Bookings for station "${station.name}":`, bookings);
    } catch (error) {
      console.error('Failed to load bookings for station:', error);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setSelectedStation(null);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredStations.length === 0) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredStations.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredStations.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleStationSelect(filteredStations[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-white z-10" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Enter station..."
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            if (filteredStations.length > 0) {
              setIsOpen(true);
            }
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          className={cn(
            "pl-10 pr-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 transition-all duration-200",
            "dark:bg-gray-800/80 dark:border-gray-500/50 dark:text-white dark:placeholder-white/80 dark:backdrop-blur-sm",
            (isFocused || autoFocus) && "shadow-lg shadow-blue-500/25 border-blue-300 dark:shadow-blue-400/30 dark:border-blue-400/50"
          )}
          disabled={isLoading}
        />
        {(inputValue || selectedStation) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-transparent dark:hover:bg-gray-700"
          >
            <X className="h-3 w-3 dark:text-gray-400" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && filteredStations.length > 0 && (
  <div className="absolute top-full z-50 mt-1 w-full rounded-md border-2 border-gray-300 bg-white shadow-xl dark:border-gray-600 dark:bg-gray-800 dark:shadow-2xl">
          <ul ref={listRef} className="max-h-60 overflow-y-auto p-1">
            {filteredStations.map((station, index) => (
              <li key={station.id}>
                <button
                  type="button"
                  onClick={() => handleStationSelect(station)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-left transition-colors",
                    "hover:bg-gray-100 hover:text-gray-900",
                    "focus:bg-gray-100 focus:text-gray-900 focus:outline-none",
                    "dark:hover:bg-blue-600 dark:focus:bg-blue-600 dark:hover:text-white dark:focus:text-white",
                    index === highlightedIndex && "bg-gray-100 text-gray-900 dark:bg-blue-600 dark:text-white"
                  )}
                >
                  <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-300 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-gray-100">{station.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No results */}
      {isOpen && inputValue.trim() && filteredStations.length === 0 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border-2 border-border bg-popover p-3 shadow-xl dark:border-gray-600 dark:bg-gray-800 dark:shadow-2xl">
          <p className="text-sm text-muted-foreground dark:text-gray-300">
            Keine Station gefunden für "{inputValue}"
          </p>
        </div>
      )}
    </div>
  );
}
