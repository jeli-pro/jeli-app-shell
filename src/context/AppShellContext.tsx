import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  type ReactNode,
  type Dispatch,
} from 'react';
import { SIDEBAR_STATES, BODY_STATES, type SidebarState, type BodyState } from '@/lib/utils';

// --- State and Action Types ---

interface AppShellState {
  sidebarState: SidebarState;
  bodyState: BodyState;
  sidePaneContent: 'details' | 'settings' | 'main' | 'toaster' | 'notifications';
  sidebarWidth: number;
  rightPaneWidth: number;
  isResizing: boolean;
  isResizingRightPane: boolean;
  isTopBarVisible: boolean;
  autoExpandSidebar: boolean;
  reducedMotion: boolean;
  compactMode: boolean;
  primaryColor: string;
}

type AppShellAction =
  | { type: 'SET_SIDEBAR_STATE'; payload: SidebarState }
  | { type: 'SET_BODY_STATE'; payload: BodyState }
  | { type: 'SET_SIDE_PANE_CONTENT'; payload: AppShellState['sidePaneContent'] }
  | { type: 'SET_SIDEBAR_WIDTH'; payload: number }
  | { type: 'SET_RIGHT_PANE_WIDTH'; payload: number }
  | { type: 'SET_IS_RESIZING'; payload: boolean }
  | { type: 'SET_IS_RESIZING_RIGHT_PANE'; payload: boolean }
  | { type: 'SET_TOP_BAR_VISIBLE'; payload: boolean }
  | { type: 'SET_AUTO_EXPAND_SIDEBAR'; payload: boolean }
  | { type: 'SET_REDUCED_MOTION'; payload: boolean }
  | { type: 'SET_COMPACT_MODE'; payload: boolean }
  | { type: 'SET_PRIMARY_COLOR'; payload: string }
  | { type: 'RESET_TO_DEFAULTS' };

// --- Reducer ---

const defaultState: AppShellState = {
  sidebarState: SIDEBAR_STATES.EXPANDED,
  bodyState: BODY_STATES.NORMAL,
  sidePaneContent: 'details',
  sidebarWidth: 280,
  rightPaneWidth: typeof window !== 'undefined' ? Math.max(300, Math.round(window.innerWidth * 0.6)) : 400,
  isResizing: false,
  isResizingRightPane: false,
  isTopBarVisible: true,
  autoExpandSidebar: true,
  reducedMotion: false,
  compactMode: false,
  primaryColor: '220 84% 60%',
};

function appShellReducer(state: AppShellState, action: AppShellAction): AppShellState {
  switch (action.type) {
    case 'SET_SIDEBAR_STATE': return { ...state, sidebarState: action.payload };
    case 'SET_BODY_STATE': return { ...state, bodyState: action.payload };
    case 'SET_SIDE_PANE_CONTENT': return { ...state, sidePaneContent: action.payload };
    case 'SET_SIDEBAR_WIDTH': return { ...state, sidebarWidth: Math.max(200, Math.min(500, action.payload)) };
    case 'SET_RIGHT_PANE_WIDTH': return { ...state, rightPaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, action.payload)) };
    case 'SET_IS_RESIZING': return { ...state, isResizing: action.payload };
    case 'SET_IS_RESIZING_RIGHT_PANE': return { ...state, isResizingRightPane: action.payload };
    case 'SET_TOP_BAR_VISIBLE': return { ...state, isTopBarVisible: action.payload };
    case 'SET_AUTO_EXPAND_SIDEBAR': return { ...state, autoExpandSidebar: action.payload };
    case 'SET_REDUCED_MOTION': return { ...state, reducedMotion: action.payload };
    case 'SET_COMPACT_MODE': return { ...state, compactMode: action.payload };
    case 'SET_PRIMARY_COLOR': return { ...state, primaryColor: action.payload };
    case 'RESET_TO_DEFAULTS': return defaultState;
    default: return state;
  }
}

// --- Context and Provider ---

interface AppShellContextValue extends AppShellState {
  dispatch: Dispatch<AppShellAction>;
  // Composite actions for convenience
  toggleSidebar: () => void;
  hideSidebar: () => void;
  showSidebar: () => void;
  peekSidebar: () => void;
  toggleFullscreen: () => void;
  openSidePane: (content: AppShellState['sidePaneContent']) => void;
  closeSidePane: () => void;
  resetToDefaults: () => void;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function AppShellProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appShellReducer, defaultState);

  // Side effect for primary color
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-hsl', state.primaryColor);
  }, [state.primaryColor]);

  // Memoized composite actions
  const actions = useMemo(() => ({
    toggleSidebar: () => {
      const current = state.sidebarState;
      if (current === SIDEBAR_STATES.HIDDEN) dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.COLLAPSED });
      else if (current === SIDEBAR_STATES.COLLAPSED) dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.EXPANDED });
      else if (current === SIDEBAR_STATES.EXPANDED) dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.COLLAPSED });
    },
    hideSidebar: () => dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.HIDDEN }),
    showSidebar: () => dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.EXPANDED }),
    peekSidebar: () => dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.PEEK }),
    toggleFullscreen: () => {
      const current = state.bodyState;
      dispatch({ type: 'SET_BODY_STATE', payload: current === BODY_STATES.FULLSCREEN ? BODY_STATES.NORMAL : BODY_STATES.FULLSCREEN });
    },
    openSidePane: (content: AppShellState['sidePaneContent']) => {
      if (state.bodyState === BODY_STATES.SIDE_PANE && state.sidePaneContent === content) {
        // If it's open with same content, close it.
        dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.NORMAL });
      } else {
        // If closed, or different content, open with new content.
        dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: content });
        dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SIDE_PANE });
      }
    },
    closeSidePane: () => dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.NORMAL }),
    resetToDefaults: () => dispatch({ type: 'RESET_TO_DEFAULTS' }),
  }), [state.sidebarState, state.bodyState]);

  const value = useMemo(() => ({ ...state, dispatch, ...actions }), [state, actions]);

  return (
    <AppShellContext.Provider value={value}>
      {children}
    </AppShellContext.Provider>
  );
}

// --- Hook ---

export function useAppShell() {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error('useAppShell must be used within an AppShellProvider');
  }
  return context;
}