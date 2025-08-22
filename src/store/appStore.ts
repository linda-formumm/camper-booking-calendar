import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Types
export interface AppState {
  // Calendar State
  selectedStation: string | null
  weekStart: Date
  detailModalBookingId: string | null
  
  // Actions
  setStation: (stationId: string | null) => void
  prevWeek: () => void
  nextWeek: () => void
  goToday: () => void
  openDetail: (bookingId: string) => void
  closeDetail: () => void
}

// Helper functions
const getWeekStart = (date: Date): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is sunday
  return new Date(d.setDate(diff))
}

const addWeeks = (date: Date, weeks: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + (weeks * 7))
  return result
}

// Zustand Store
export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Initial State
      selectedStation: null,
      weekStart: getWeekStart(new Date()),
      detailModalBookingId: null,

      // Station Actions
      setStation: (stationId) => 
        set({ selectedStation: stationId }, false, 'setStation'),

      // Week Navigation Actions  
      prevWeek: () => 
        set((state) => ({ 
          weekStart: addWeeks(state.weekStart, -1) 
        }), false, 'prevWeek'),

      nextWeek: () => 
        set((state) => ({ 
          weekStart: addWeeks(state.weekStart, 1) 
        }), false, 'nextWeek'),

      goToday: () => 
        set({ 
          weekStart: getWeekStart(new Date()) 
        }, false, 'goToday'),

      // Detail Modal Actions
      openDetail: (bookingId) => 
        set({ detailModalBookingId: bookingId }, false, 'openDetail'),

      closeDetail: () => 
        set({ detailModalBookingId: null }, false, 'closeDetail'),
    }),
    {
      name: 'app-store', // name for devtools
    }
  )
)

// Simple selector hooks
export const useSelectedStation = () => useAppStore(state => state.selectedStation)
export const useWeekStart = () => useAppStore(state => state.weekStart)
export const useDetailModalBookingId = () => useAppStore(state => state.detailModalBookingId)

// Direct action hooks  
export const useSetStation = () => useAppStore(state => state.setStation)
export const usePrevWeek = () => useAppStore(state => state.prevWeek)
export const useNextWeek = () => useAppStore(state => state.nextWeek)
export const useGoToday = () => useAppStore(state => state.goToday)
export const useOpenDetail = () => useAppStore(state => state.openDetail)
export const useCloseDetail = () => useAppStore(state => state.closeDetail)
