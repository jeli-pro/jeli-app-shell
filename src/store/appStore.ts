import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SIDEBAR_STATES, BODY_STATES, type SidebarState, type BodyState } from '@/lib/utils'

export type ActivePage = 'dashboard' | 'settings';

interface AppState {
  // UI States
  sidebarState: SidebarState
  bodyState: BodyState
  isDarkMode: boolean
  sidePaneContent: 'details' | 'settings' | 'main'
  activePage: ActivePage
  sidebarWidth: number
  rightPaneWidth: number
  isResizing: boolean
  isResizingRightPane: boolean
  
  // User Preferences
  autoExpandSidebar: boolean
  reducedMotion: boolean
  compactMode: boolean
  
  // Actions
  setSidebarState: (state: SidebarState) => void
  setBodyState: (state: BodyState) => void
  toggleDarkMode: () => void
  setActivePage: (page: ActivePage) => void
  setSidebarWidth: (width: number) => void
  setRightPaneWidth: (width: number) => void
  setIsResizing: (resizing: boolean) => void
  setIsResizingRightPane: (resizing: boolean) => void
  setAutoExpandSidebar: (auto: boolean) => void
  setReducedMotion: (reduced: boolean) => void
  setCompactMode: (compact: boolean) => void
  
  // Composite Actions
  toggleSidebar: () => void
  hideSidebar: () => void
  showSidebar: () => void
  peekSidebar: () => void
  toggleFullscreen: () => void
  openSidePane: (content: 'details' | 'settings' | 'main') => void
  closeSidePane: () => void
  resetToDefaults: () => void
}

const defaultState = {
  sidebarState: SIDEBAR_STATES.EXPANDED as SidebarState,
  bodyState: BODY_STATES.NORMAL as BodyState,
  sidePaneContent: 'details' as const,
  activePage: 'dashboard' as ActivePage,
  isDarkMode: false,
  sidebarWidth: 280,
  rightPaneWidth: typeof window !== 'undefined' ? Math.max(300, Math.round(window.innerWidth * 0.6)) : 400,
  isResizing: false,
  isResizingRightPane: false,
  autoExpandSidebar: true,
  reducedMotion: false,
  compactMode: false,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...defaultState,
      
      // Basic setters
      sidePaneContent: 'details',
      setSidebarState: (state) => set({ sidebarState: state }),
      setBodyState: (state) => set({ bodyState: state }),
      setActivePage: (page) => set({ activePage: page }),
      toggleDarkMode: () => {
        const newMode = !get().isDarkMode
        set({ isDarkMode: newMode })
        document.documentElement.classList.toggle('dark', newMode)
      },
      setSidebarWidth: (width) => set({ sidebarWidth: Math.max(200, Math.min(500, width)) }),
      setRightPaneWidth: (width) => set({ rightPaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, width)) }),
      setIsResizing: (resizing) => set({ isResizing: resizing }),
      setIsResizingRightPane: (resizing) => set({ isResizingRightPane: resizing }),
      setAutoExpandSidebar: (auto) => set({ autoExpandSidebar: auto }),
      setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
      setCompactMode: (compact) => set({ compactMode: compact }),
      
      // Composite actions
      toggleSidebar: () => {
        const current = get().sidebarState
        if (current === SIDEBAR_STATES.HIDDEN) {
          set({ sidebarState: SIDEBAR_STATES.COLLAPSED })
        } else if (current === SIDEBAR_STATES.COLLAPSED) {
          set({ sidebarState: SIDEBAR_STATES.EXPANDED })
        } else if (current === SIDEBAR_STATES.EXPANDED) {
          set({ sidebarState: SIDEBAR_STATES.COLLAPSED })
        }
      },
      
      hideSidebar: () => set({ sidebarState: SIDEBAR_STATES.HIDDEN }),
      showSidebar: () => set({ sidebarState: SIDEBAR_STATES.EXPANDED }),
      peekSidebar: () => set({ sidebarState: SIDEBAR_STATES.PEEK }),
      
      toggleFullscreen: () => {
        const current = get().bodyState
        set({ 
          bodyState: current === BODY_STATES.FULLSCREEN ? BODY_STATES.NORMAL : BODY_STATES.FULLSCREEN 
        })
      },
      
      openSidePane: (content) => {
        const { bodyState, sidePaneContent } = get()
        if (bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === content) {
          // If it's open with same content, close it.
          set({ bodyState: BODY_STATES.NORMAL });
        } else {
          // If closed, or different content, open with new content.
          set({ bodyState: BODY_STATES.SIDE_PANE, sidePaneContent: content });
        }
      },
      closeSidePane: () => {
        set({ bodyState: BODY_STATES.NORMAL })
      },
      
      resetToDefaults: () => set(defaultState),
    }),
    {
      name: 'app-preferences',
      partialize: (state) => ({
        sidebarState: state.sidebarState,
        bodyState: state.bodyState,
        activePage: state.activePage,
        sidePaneContent: state.sidePaneContent,
        isDarkMode: state.isDarkMode,
        sidebarWidth: state.sidebarWidth,
        rightPaneWidth: state.rightPaneWidth,
        autoExpandSidebar: state.autoExpandSidebar,
        reducedMotion: state.reducedMotion,
        compactMode: state.compactMode,
      }),
    }
  )
)

// Initialize dark mode on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('app-preferences')
  if (stored) {
    const parsed = JSON.parse(stored)
    if (parsed.state?.isDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }
}