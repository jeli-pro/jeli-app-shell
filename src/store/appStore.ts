import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ActivePage = 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo';

interface AppState {
  // UI States
  activePage: ActivePage
  isCommandPaletteOpen: boolean
  searchTerm: string
  isDarkMode: boolean
  
  // Actions
  setActivePage: (page: ActivePage) => void
  setCommandPaletteOpen: (open: boolean) => void
  setSearchTerm: (term: string) => void
  toggleDarkMode: () => void
  
  // Composite Actions
  handleNavigation: (page: ActivePage) => void
}

const defaultState = {
  activePage: 'dashboard' as ActivePage,
  isCommandPaletteOpen: false,
  searchTerm: '',
  isDarkMode: false,
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...defaultState,
      
      // Basic setters
      setActivePage: (page) => set({ activePage: page }),
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      // Composite actions
      handleNavigation: (page) => {
        set({ activePage: page });
      },
    }),
    {
      name: 'app-preferences',
      partialize: (state) => ({
        activePage: state.activePage,
        isDarkMode: state.isDarkMode,
        // searchTerm is not persisted
      }),
    }
  )
)