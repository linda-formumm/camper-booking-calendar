import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { stationsApi } from '../lib/api';
import { useAppStore } from '../store/appStore';
import type { Station } from '../lib/types';

export function StationPicker() {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
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

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setInputValue(station.name);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
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
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Station eingeben..."
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (filteredStations.length > 0) {
              setIsOpen(true);
            }
          }}
          className="pl-10 pr-10"
          disabled={isLoading}
        />
        {(inputValue || selectedStation) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && filteredStations.length > 0 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <ul ref={listRef} className="max-h-60 overflow-y-auto p-1">
            {filteredStations.map((station, index) => (
              <li key={station.id}>
                <button
                  type="button"
                  onClick={() => handleStationSelect(station)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-left transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                    index === highlightedIndex && "bg-accent text-accent-foreground"
                  )}
                >
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {station.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No results */}
      {isOpen && inputValue.trim() && filteredStations.length === 0 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover p-3 shadow-md">
          <p className="text-sm text-muted-foreground">
            Keine Station gefunden für "{inputValue}"
          </p>
        </div>
      )}
    </div>
  );
}
