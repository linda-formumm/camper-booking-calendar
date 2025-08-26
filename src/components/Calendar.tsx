import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar as CalendarIcon } from 'lucide-react';
import { getWeekDays } from '../lib/date-utils';
import { useAppStore } from '../store/appStore';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { HeroBackground } from './HeroBackground';
import { getImagePath } from '../lib/image-utils';
import { cn } from '../lib/utils';
import type { Booking } from '../lib/types';

interface CalendarProps {
  className?: string;
}

export default function Calendar({ className }: CalendarProps) {
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  
  const { selectedStation, weekStart, setWeekStart, goToPreviousWeek, goToNextWeek } = useAppStore();
  const navigate = useNavigate();

  const weekDays = getWeekDays(weekStart);

  const handleBookingClick = (booking: Booking) => {
    if (selectedStation?.id) {
      navigate(`/booking/${selectedStation.id}/${booking.id}`);
    }
  };

  // Set initial week from URL parameter
  useEffect(() => {
    if (dateParam) {
      const paramDate = new Date(dateParam);
      if (!isNaN(paramDate.getTime())) {
        setWeekStart(paramDate);
      }
    }
  }, [dateParam, setWeekStart]);

  const goToDate = (selectedDate: Date) => {
    setWeekStart(selectedDate);
  };

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPreviousWeek();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNextWeek();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPreviousWeek, goToNextWeek]);

  return (
    <div className={cn('relative', className)}>
      <HeroBackground
        lightImage={getImagePath("/images/van-roadtrip-light.jpg")}
        darkImage={getImagePath("/images/van-mountains-dark.jpg")}
      >
        <div className="text-center space-y-4">
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white lg:text-white">
            Booking Calendar
          </h1>
          
          {selectedStation && (
            <div className="hidden lg:flex items-center justify-center">
              <hr className="w-16 h-px bg-white/50" />
              <CalendarIcon size={20} className="mx-3 text-white" />
              <hr className="w-16 h-px bg-white/50" />
            </div>
          )}
          
          <p className="text-sm lg:text-lg text-gray-600 dark:text-gray-400 lg:text-white/90">
            {selectedStation ? `Location: ${selectedStation.name}` : 'Fleet Management Dashboard'}
          </p>
        </div>
      </HeroBackground>

      <div className="space-y-6">
        <CalendarHeader 
          weekDays={weekDays}
          onPreviousWeek={goToPreviousWeek}
          onNextWeek={goToNextWeek}
          onDateSelect={goToDate}
        />

        <CalendarGrid 
          weekDays={weekDays}
          onBookingClick={handleBookingClick}
        />
      </div>
    </div>
  );
}
