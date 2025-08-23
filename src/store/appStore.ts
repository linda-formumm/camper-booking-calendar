import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Minimal types for startup
export interface AppState {
  // Only what we actually need right now
  isDarkMode: boolean
  
  // Actions
  toggleDarkMode: () => void
}

// Zustand Store - Minimal Setup
export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Initial State
      isDarkMode: false,

      // Dark Mode Toggle
      toggleDarkMode: () => 
        set((state) => ({ 
          isDarkMode: !state.isDarkMode 
        }), false, 'toggleDarkMode'),
    }),
    {
      name: 'app-store',
    }
  )
)

// Simple selector hooks
export const useIsDarkMode = () => useAppStore(state => state.isDarkMode)

// Direct action hooks  
export const useToggleDarkMode = () => useAppStore(state => state.toggleDarkMode)
