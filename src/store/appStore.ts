import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ActivePage = 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo';

interface AppState {
  // UI States
  isCommandPaletteOpen: boolean
  searchTerm: string
  isDarkMode: boolean
  
  // Actions
  setCommandPaletteOpen: (open: boolean) => void
  setSearchTerm: (term: string) => void
  toggleDarkMode: () => void
}

const defaultState = {
  isCommandPaletteOpen: false,
  searchTerm: '',
  isDarkMode: false,
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...defaultState,
      
      // Basic setters
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'app-preferences',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        // searchTerm is not persisted
      }),
    }
  )
)