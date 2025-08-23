import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Date utilities
const getWeekStart = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as week start
  return new Date(d.setDate(diff));
};

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

interface AppState {
  // Theme
  isDarkMode: boolean;

  // Calendar & Booking State
  selectedStationId: string | null;
  weekStart: Date;
  detailModalBookingId: string | null;

  // UI State
  isLoading: boolean;
  searchQuery: string;
}

interface AppActions {
  // Theme actions
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;

  // Calendar actions
  setSelectedStation: (stationId: string | null) => void;
  setWeekStart: (date: Date) => void;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  goToCurrentWeek: () => void;

  // Modal actions
  openBookingDetail: (bookingId: string) => void;
  closeBookingDetail: () => void;

  // Search actions
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;

  // UI actions
  setLoading: (loading: boolean) => void;

  // URL sync helpers
  getStateForUrl: () => { station?: string; week?: string };
  setStateFromUrl: (params: { station?: string; week?: string }) => void;
}

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      isDarkMode: false,
      selectedStationId: null,
      weekStart: getWeekStart(),
      detailModalBookingId: null,
      isLoading: false,
      searchQuery: "",

      // Theme actions
      toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })),
      setDarkMode: isDark => set({ isDarkMode: isDark }),

      // Calendar actions
      setSelectedStation: stationId => set({ selectedStationId: stationId }),

      setWeekStart: date => set({ weekStart: getWeekStart(date) }),

      goToPreviousWeek: () => {
        const currentWeek = get().weekStart;
        const previousWeek = new Date(currentWeek);
        previousWeek.setDate(currentWeek.getDate() - 7);
        set({ weekStart: previousWeek });
      },

      goToNextWeek: () => {
        const currentWeek = get().weekStart;
        const nextWeek = new Date(currentWeek);
        nextWeek.setDate(currentWeek.getDate() + 7);
        set({ weekStart: nextWeek });
      },

      goToCurrentWeek: () => set({ weekStart: getWeekStart() }),

      // Modal actions
      openBookingDetail: bookingId => set({ detailModalBookingId: bookingId }),
      closeBookingDetail: () => set({ detailModalBookingId: null }),

      // Search actions
      setSearchQuery: query => set({ searchQuery: query }),
      clearSearch: () => set({ searchQuery: "" }),

      // UI actions
      setLoading: loading => set({ isLoading: loading }),

      // URL sync helpers
      getStateForUrl: () => {
        const { selectedStationId, weekStart } = get();
        return {
          station: selectedStationId || undefined,
          week: formatDate(weekStart),
        };
      },

      setStateFromUrl: params => {
        const updates: Partial<AppState> = {};

        if (params.station) {
          updates.selectedStationId = params.station;
        }

        if (params.week) {
          const date = new Date(params.week);
          if (!isNaN(date.getTime())) {
            updates.weekStart = getWeekStart(date);
          }
        }

        set(updates);
      },
    }),
    {
      name: "app-store",
    }
  )
);

// Selector hooks for better performance
export const useIsDarkMode = () => useAppStore(state => state.isDarkMode);
export const useSelectedStationId = () =>
  useAppStore(state => state.selectedStationId);
export const useWeekStart = () => useAppStore(state => state.weekStart);
export const useDetailModalBookingId = () =>
  useAppStore(state => state.detailModalBookingId);
export const useSearchQuery = () => useAppStore(state => state.searchQuery);
export const useIsLoading = () => useAppStore(state => state.isLoading);

// Action hooks
export const useToggleDarkMode = () =>
  useAppStore(state => state.toggleDarkMode);
export const useSetSelectedStation = () =>
  useAppStore(state => state.setSelectedStation);
export const useWeekNavigation = () =>
  useAppStore(state => ({
    goToPreviousWeek: state.goToPreviousWeek,
    goToNextWeek: state.goToNextWeek,
    goToCurrentWeek: state.goToCurrentWeek,
    setWeekStart: state.setWeekStart,
  }));
export const useBookingDetailModal = () =>
  useAppStore(state => ({
    openBookingDetail: state.openBookingDetail,
    closeBookingDetail: state.closeBookingDetail,
  }));
export const useSearch = () =>
  useAppStore(state => ({
    setSearchQuery: state.setSearchQuery,
    clearSearch: state.clearSearch,
  }));
export const useUrlSync = () =>
  useAppStore(state => ({
    getStateForUrl: state.getStateForUrl,
    setStateFromUrl: state.setStateFromUrl,
  }));
