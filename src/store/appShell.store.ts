import { create } from 'zustand';
import { type ReactElement } from 'react';
import { SIDEBAR_STATES, BODY_STATES, type SidebarState, type BodyState } from '@/lib/utils';

export type ActivePage = 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo' | 'messaging';

// --- State and Action Types ---

export interface AppShellState {
  sidebarState: SidebarState;
  bodyState: BodyState;
  sidePaneContent: 'details' | 'settings' | 'main' | 'toaster' | 'notifications' | 'dataDemo' | 'dataItem' | 'messaging';
  sidebarWidth: number;
  sidePaneWidth: number;
  splitPaneWidth: number;
  messagingListWidth: number;
  messagingProfileWidth: number;
  previousBodyState: BodyState;
  fullscreenTarget: 'main' | 'right' | null;
  isResizing: boolean;
  isResizingRightPane: boolean;
  isResizingMessagingList: boolean;
  isResizingMessagingProfile: boolean;
  isMessagingListCollapsed: boolean;
  isMessagingProfileCollapsed: boolean;
  isTopBarVisible: boolean;
  autoExpandSidebar: boolean;
  reducedMotion: boolean;
  compactMode: boolean;
  primaryColor: string;
  isCommandPaletteOpen: boolean;
  isDarkMode: boolean;
  appName?: string;
  appLogo?: ReactElement;
  draggedPage: 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo' | 'messaging' | null;
  dragHoverTarget: 'left' | 'right' | null;
  hoveredPane: 'left' | 'right' | null;
}

export interface AppShellActions {
    // Initialization
    init: (config: { appName?: string; appLogo?: ReactElement; defaultSplitPaneWidth?: number }) => void;
    
    // Direct state setters
    setSidebarState: (payload: SidebarState) => void;
    setBodyState: (payload: BodyState) => void;
    setSidePaneContent: (payload: AppShellState['sidePaneContent']) => void;
    setSidebarWidth: (payload: number) => void;
    setSidePaneWidth: (payload: number) => void;
    setSplitPaneWidth: (payload: number) => void;
    setMessagingListWidth: (payload: number) => void;
    setIsResizing: (payload: boolean) => void;
    setMessagingProfileWidth: (payload: number) => void;
    setFullscreenTarget: (payload: 'main' | 'right' | null) => void;
    setIsResizingRightPane: (payload: boolean) => void;
    setIsResizingMessagingList: (payload: boolean) => void;
    setIsResizingMessagingProfile: (payload: boolean) => void;
    toggleMessagingListCollapsed: () => void;
    toggleMessagingProfileCollapsed: () => void;
    setTopBarVisible: (payload: boolean) => void;
    setAutoExpandSidebar: (payload: boolean) => void;
    setReducedMotion: (payload: boolean) => void;
    setCompactMode: (payload: boolean) => void;
    setPrimaryColor: (payload: string) => void;
    setDraggedPage: (payload: AppShellState['draggedPage']) => void;
    setCommandPaletteOpen: (open: boolean) => void;
    toggleDarkMode: () => void;
    setDragHoverTarget: (payload: 'left' | 'right' | null) => void;
    setHoveredPane: (payload: 'left' | 'right' | null) => void;
    
    // Composite actions
    toggleSidebar: () => void;
    hideSidebar: () => void;
    showSidebar: () => void;
    peekSidebar: () => void;
    toggleFullscreen: (target?: 'main' | 'right' | null) => void;
    resetToDefaults: () => void;
}

const defaultState: AppShellState = {
  sidebarState: SIDEBAR_STATES.EXPANDED,
  bodyState: BODY_STATES.NORMAL,
  sidePaneContent: 'details',
  sidebarWidth: 280,
  sidePaneWidth: typeof window !== 'undefined' ? Math.max(300, Math.round(window.innerWidth * 0.6)) : 400,
  splitPaneWidth: typeof window !== 'undefined' ? Math.max(300, Math.round(window.innerWidth * 0.35)) : 400,
  messagingListWidth: 384,
  messagingProfileWidth: 384,
  previousBodyState: BODY_STATES.NORMAL,
  fullscreenTarget: null,
  isResizing: false,
  isResizingRightPane: false,
  isResizingMessagingList: false,
  isResizingMessagingProfile: false,
  isMessagingListCollapsed: false,
  isMessagingProfileCollapsed: false,
  isTopBarVisible: true,
  autoExpandSidebar: true,
  reducedMotion: false,
  compactMode: false,
  primaryColor: '220 84% 60%',
  isCommandPaletteOpen: false,
  isDarkMode: false,
  appName: 'Jeli App',
  appLogo: undefined,
  draggedPage: null,
  dragHoverTarget: null,
  hoveredPane: null,
};


export const useAppShellStore = create<AppShellState & AppShellActions>((set, get) => ({
  ...defaultState,

  init: ({ appName, appLogo, defaultSplitPaneWidth }) => set(state => ({
    ...state,
    ...(appName && { appName }),
    ...(appLogo && { appLogo }),
    ...(defaultSplitPaneWidth && { splitPaneWidth: defaultSplitPaneWidth }),
  })),
  
  setSidebarState: (payload) => set({ sidebarState: payload }),
  setBodyState: (payload) => {
    // If we're leaving fullscreen, reset the target and previous state
    if (get().bodyState === BODY_STATES.FULLSCREEN && payload !== BODY_STATES.FULLSCREEN) {
      set({ bodyState: payload, fullscreenTarget: null, previousBodyState: BODY_STATES.NORMAL });
    } else {
      set({ bodyState: payload });
    }
  },
  setSidePaneContent: (payload) => set({ sidePaneContent: payload }),
  setSidebarWidth: (payload) => set({ sidebarWidth: Math.max(200, Math.min(500, payload)) }),
  setSidePaneWidth: (payload) => set({ sidePaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, payload)) }),
  setSplitPaneWidth: (payload) => set({ splitPaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, payload)) }),
  setMessagingListWidth: (payload) => set({ messagingListWidth: Math.max(320, Math.min(payload, window.innerWidth - 400)) }),
  setMessagingProfileWidth: (payload) => set({ messagingProfileWidth: Math.max(320, Math.min(payload, window.innerWidth - 400)) }),
  setIsResizing: (payload) => set({ isResizing: payload }),
  setFullscreenTarget: (payload) => set({ fullscreenTarget: payload }),
  setIsResizingRightPane: (payload) => set({ isResizingRightPane: payload }),
  setIsResizingMessagingList: (payload) => set({ isResizingMessagingList: payload }),
  setIsResizingMessagingProfile: (payload) => set({ isResizingMessagingProfile: payload }),
  toggleMessagingListCollapsed: () => set(state => ({ isMessagingListCollapsed: !state.isMessagingListCollapsed })),
  toggleMessagingProfileCollapsed: () => set(state => ({ isMessagingProfileCollapsed: !state.isMessagingProfileCollapsed })),
  setTopBarVisible: (payload) => set({ isTopBarVisible: payload }),
  setAutoExpandSidebar: (payload) => set({ autoExpandSidebar: payload }),
  setReducedMotion: (payload) => set({ reducedMotion: payload }),
  setCompactMode: (payload) => set({ compactMode: payload }),
  setPrimaryColor: (payload) => {
    if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--primary-hsl', payload);
    }
    set({ primaryColor: payload });
  },
  setDraggedPage: (payload) => set({ draggedPage: payload }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setDragHoverTarget: (payload) => set({ dragHoverTarget: payload }),
  setHoveredPane: (payload) => set({ hoveredPane: payload }),
  
  toggleSidebar: () => {
    const current = get().sidebarState;
    if (current === SIDEBAR_STATES.HIDDEN) set({ sidebarState: SIDEBAR_STATES.COLLAPSED });
    else if (current === SIDEBAR_STATES.COLLAPSED) set({ sidebarState: SIDEBAR_STATES.EXPANDED });
    else if (current === SIDEBAR_STATES.EXPANDED) set({ sidebarState: SIDEBAR_STATES.COLLAPSED });
  },
  hideSidebar: () => set({ sidebarState: SIDEBAR_STATES.HIDDEN }),
  showSidebar: () => set({ sidebarState: SIDEBAR_STATES.EXPANDED }),
  peekSidebar: () => set({ sidebarState: SIDEBAR_STATES.PEEK }),
  
  toggleFullscreen: (target = null) => {
    const { bodyState, previousBodyState } = get();
    if (bodyState === BODY_STATES.FULLSCREEN) {
      set({ 
        bodyState: previousBodyState || BODY_STATES.NORMAL,
        fullscreenTarget: null,
        previousBodyState: BODY_STATES.NORMAL,
      });
    } else {
      set({ 
        previousBodyState: bodyState, 
        bodyState: BODY_STATES.FULLSCREEN, 
        fullscreenTarget: target 
      });
    }
  },
  
  resetToDefaults: () => {
    // Preserve props passed to provider
    const { appName, appLogo } = get();
    const currentPrimaryColor = defaultState.primaryColor;
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--primary-hsl', currentPrimaryColor);
    }
    set({ ...defaultState, primaryColor: currentPrimaryColor, appName, appLogo });
  },
}));

// Add a selector for the derived rightPaneWidth
export const useRightPaneWidth = () => useAppShellStore(state => 
    state.bodyState === BODY_STATES.SPLIT_VIEW ? state.splitPaneWidth : state.sidePaneWidth
);