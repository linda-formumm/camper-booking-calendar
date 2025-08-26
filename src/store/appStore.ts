import { create } from "zustand";
import type { Station } from "../lib/types";

// Simple date utilities for week calculations
const getWeekStart = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

interface AppState {
  // Theme
  isDarkMode: boolean;

  // Calendar & Station State
  selectedStationId: string | null;
  selectedStation: Station | null;
  weekStart: Date;

  // UI State
  isLoading: boolean;
}

interface AppActions {
  // Theme actions
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;

  // Station & Calendar actions
  setSelectedStation: (station: Station | null) => void;
  setSelectedStationId: (stationId: string | null) => void;
  setWeekStart: (date: Date) => void;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  goToCurrentWeek: () => void;

  // UI actions
  setLoading: (loading: boolean) => void;

  // URL sync helpers for deep linking
  getStateForUrl: () => { station?: string; week?: string };
  setStateFromUrl: (params: { station?: string; week?: string }) => void;
}

type AppStore = AppState & AppActions;
  clearSearch: () => void;

  // UI actions
  setLoading: (loading: boolean) => void;

  // URL sync helpers
  getStateForUrl: () => { station?: string; week?: string };
  setStateFromUrl: (params: { station?: string; week?: string }) => void;
}

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  isDarkMode: false,
  selectedStationId: null,
  selectedStation: null,
  weekStart: getWeekStart(),
  isLoading: false,

  // Theme actions
  toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })),
  setDarkMode: isDark => set({ isDarkMode: isDark }),

  // Station & Calendar actions
  setSelectedStation: station =>
    set({
      selectedStation: station,
      selectedStationId: station?.id || null,
    }),
  setSelectedStationId: stationId => set({ selectedStationId: stationId }),

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

  // UI actions
  setLoading: loading => set({ isLoading: loading }),

  // URL sync helpers for deep linking and navigation
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
}));

// Simple selector hooks
export const useIsDarkMode = () => useAppStore(state => state.isDarkMode);
export const useSelectedStationId = () =>
  useAppStore(state => state.selectedStationId);
export const useWeekStart = () => useAppStore(state => state.weekStart);
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
export const useUrlSync = () =>
  useAppStore(state => ({
    getStateForUrl: state.getStateForUrl,
    setStateFromUrl: state.setStateFromUrl,
  }));
