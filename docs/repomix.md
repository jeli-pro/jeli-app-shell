# Directory Structure
```
src/
  components/
    layout/
      MainContent.tsx
      RightPane.tsx
  hooks/
    useAppViewManager.hook.ts
    useRightPaneContent.hook.tsx
  store/
    appShell.store.ts
  App.tsx
```

# Files

## File: src/hooks/useRightPaneContent.hook.tsx
```typescript
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Component,
  Bell,
  SlidersHorizontal,
  Database,
  MessageSquare,
} from 'lucide-react';

import { DashboardContent } from "@/pages/Dashboard";
import { SettingsContent } from "@/features/settings/SettingsContent";
import { ToasterDemo } from "@/pages/ToasterDemo";
import { NotificationsPage } from "@/pages/Notifications";
import DataDemoPage from "@/pages/DataDemo";
import { DataDetailPanel } from "@/pages/DataDemo/components/DataDetailPanel";
import { mockDataItems } from "@/pages/DataDemo/data/mockData";
import { MessagingContent } from "@/pages/Messaging/components/MessagingContent";
import type { AppShellState } from '@/store/appShell.store';

export function useRightPaneContent(sidePaneContent: AppShellState['sidePaneContent']) {
  const navigate = useNavigate();
  const { itemId, conversationId } = useParams<{ itemId: string; conversationId: string }>();

  const contentMap = useMemo(() => ({
    main: {
      title: "Dashboard",
      icon: LayoutDashboard,
      page: "dashboard",
      content: <DashboardContent />,
    },
    settings: {
      title: "Settings",
      icon: Settings,
      page: "settings",
      content: <div className="p-6"><SettingsContent /></div>
    },
    toaster: {
      title: "Toaster Demo",
      icon: Component,
      page: "toaster",
      content: <ToasterDemo />,
    },
    notifications: {
      title: "Notifications",
      icon: Bell,
      page: "notifications",
      content: <NotificationsPage />,
    },
    dataDemo: {
      title: "Data Showcase",
      icon: Database,
      page: "data-demo",
      content: <DataDemoPage />,
    },
    messaging: {
      title: "Conversation",
      icon: MessageSquare,
      page: "messaging",
      content: <MessagingContent conversationId={conversationId} />,
    },
    details: {
      title: "Details Panel",
      icon: SlidersHorizontal,
      content: (
        <div className="p-6">
          <p className="text-muted-foreground">
            This is the side pane. It can be used to display contextual
            information, forms, or actions related to the main content.
          </p>
        </div>
      ),
    },
  }), [conversationId]);

  const selectedItem = useMemo(() => {
    if (!itemId) return null;
    return mockDataItems.find(item => item.id === itemId) ?? null;
  }, [itemId]);

  const { meta, content } = useMemo(() => {
    if (sidePaneContent === 'dataItem' && selectedItem) {
      return {
        meta: { title: "Item Details", icon: Database, page: `data-demo/${itemId}` },
        content: <DataDetailPanel item={selectedItem} onClose={() => navigate('/data-demo')} />,
      };
    }
    const mappedContent = contentMap[sidePaneContent as keyof typeof contentMap] || contentMap.details;
    return {
      meta: mappedContent,
      content: mappedContent.content,
    };
  }, [sidePaneContent, selectedItem, navigate, contentMap, itemId, conversationId]);

  return { meta, content };
}
```

## File: src/hooks/useAppViewManager.hook.ts
```typescript
import { useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAppShellStore, type AppShellState, type ActivePage } from '@/store/appShell.store';
import type { DataItem, ViewMode, SortConfig, SortableField, GroupableField, Status, Priority } from '@/pages/DataDemo/types';
import type { FilterConfig } from '@/pages/DataDemo/components/DataToolbar';
import type { TaskView } from '@/pages/Messaging/types';
import { BODY_STATES, SIDEBAR_STATES } from '@/lib/utils';

const pageToPaneMap: Record<string, AppShellState['sidePaneContent']> = {
  dashboard: 'main',
  settings: 'settings',
  toaster: 'toaster',
  notifications: 'notifications',
  'data-demo': 'dataDemo',
  messaging: 'messaging',
};

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

/**
 * A centralized hook to manage and synchronize all URL-based view states.
 * This is the single source of truth for view modes, side panes, split views,
 * and page-specific parameters.
 */
export function useAppViewManager() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ itemId: string; conversationId: string }>();
  const { itemId, conversationId } = params;
  const { setSidebarState, sidebarState } = useAppShellStore();

  // --- DERIVED STATE FROM URL ---

  const view = searchParams.get('view');
  const sidePane = searchParams.get('sidePane');
  const right = searchParams.get('right');
  const messagingView = searchParams.get('messagingView') as TaskView | null;

  const { bodyState, sidePaneContent } = useMemo(() => {
    const validPanes: AppShellState['sidePaneContent'][] = ['details', 'settings', 'main', 'toaster', 'notifications', 'dataDemo', 'messaging'];
    
    // 1. Priority: Explicit side pane overlay via URL param
    if (sidePane && validPanes.includes(sidePane as AppShellState['sidePaneContent'])) {
      return { bodyState: BODY_STATES.SIDE_PANE, sidePaneContent: sidePane as AppShellState['sidePaneContent'] };
    }

    // 2. Data item detail view (can be overlay or split)
    if (itemId) {
      if (view === 'split') {
        return { bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: 'dataItem' as const };
      }
      return { bodyState: BODY_STATES.SIDE_PANE, sidePaneContent: 'dataItem' as const };
    }

    // 3. Messaging conversation view (always split)
    if (conversationId) {
      return { bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: 'messaging' as const };
    }

    // 4. Generic split view via URL param
    if (view === 'split' && right && validPanes.includes(right as AppShellState['sidePaneContent'])) {
      return { bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: right as AppShellState['sidePaneContent'] };
    }

    return { bodyState: BODY_STATES.NORMAL, sidePaneContent: 'details' as const };
  }, [itemId, conversationId, view, sidePane, right]);
  
  const currentActivePage = useMemo(() => (location.pathname.split('/')[1] || 'dashboard') as ActivePage, [location.pathname]);
  const prevActivePage = usePrevious(currentActivePage);

  // --- SIDE EFFECTS ---
  useEffect(() => {
    // On navigating to messaging page, collapse sidebar if it's expanded.
    // This ensures a good default view but allows the user to expand it again if they wish.
    if (currentActivePage === 'messaging' && prevActivePage !== 'messaging' && sidebarState === SIDEBAR_STATES.EXPANDED) {
      setSidebarState(SIDEBAR_STATES.COLLAPSED);
    }
  }, [currentActivePage, prevActivePage, sidebarState, setSidebarState]);

  // DataDemo specific state
  const viewMode = useMemo(() => (searchParams.get('view') as ViewMode) || 'list', [searchParams]);
	const page = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams]);
	const groupBy = useMemo(() => (searchParams.get('groupBy') as GroupableField | 'none') || 'none', [searchParams]);
	const activeGroupTab = useMemo(() => searchParams.get('tab') || 'all', [searchParams]);
	const filters = useMemo<FilterConfig>(
		() => ({
			searchTerm: searchParams.get('q') || '',
			status: (searchParams.get('status')?.split(',') || []).filter(Boolean) as Status[],
			priority: (searchParams.get('priority')?.split(',') || []).filter(Boolean) as Priority[],
		}),
		[searchParams],
	);
	const sortConfig = useMemo<SortConfig | null>(() => {
		const sortParam = searchParams.get('sort');
		if (!sortParam) return { key: 'updatedAt', direction: 'desc' }; // Default sort
		if (sortParam === 'default') return null;

		const [key, direction] = sortParam.split('-');
		return { key: key as SortableField, direction: direction as 'asc' | 'desc' };
	}, [searchParams]);

  // --- MUTATOR ACTIONS ---

  const handleParamsChange = useCallback(
		(newParams: Record<string, string | string[] | null | undefined>, resetPage = false) => {
			setSearchParams(
				(prev) => {
					const updated = new URLSearchParams(prev);
					
					for (const [key, value] of Object.entries(newParams)) {
						if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || value === '') {
							updated.delete(key);
						} else if (Array.isArray(value)) {
							updated.set(key, value.join(','));
						} else {
							updated.set(key, String(value));
						}
					}

					if (resetPage) {
						updated.delete('page');
					}
					if ('groupBy' in newParams) {
						updated.delete('tab');
					}

					return updated;
				},
				{ replace: true },
			);
		},
		[setSearchParams],
	);

  const navigateTo = useCallback((page: string, params?: Record<string, string | null>) => {
    const targetPath = page.startsWith('/') ? page : `/${page}`;
    const isSamePage = location.pathname === targetPath;
    
    const newSearchParams = new URLSearchParams(isSamePage ? searchParams : undefined);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === undefined) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      }
    }

    navigate({ pathname: targetPath, search: newSearchParams.toString() });
  }, [navigate, location.pathname, searchParams]);

  const openSidePane = useCallback((pane: AppShellState['sidePaneContent']) => {
    if (location.pathname === `/${Object.keys(pageToPaneMap).find(key => pageToPaneMap[key] === pane)}`) {
        navigate({ pathname: '/dashboard', search: `?sidePane=${pane}` }, { replace: true });
    } else {
        handleParamsChange({ sidePane: pane, view: null, right: null });
    }
  }, [handleParamsChange, navigate, location.pathname]);

  const closeSidePane = useCallback(() => {
    if (itemId) {
      navigate('/data-demo');
    } else {
      handleParamsChange({ sidePane: null, view: null, right: null });
    }
  }, [itemId, navigate, handleParamsChange]);

  const toggleSidePane = useCallback((pane: AppShellState['sidePaneContent']) => {
    if (sidePane === pane) {
      closeSidePane();
    } else {
      openSidePane(pane);
    }
  }, [sidePane, openSidePane, closeSidePane]);

  const toggleSplitView = useCallback(() => {
    if (bodyState === BODY_STATES.SIDE_PANE) {
      handleParamsChange({ view: 'split', right: sidePane, sidePane: null });
    } else if (bodyState === BODY_STATES.SPLIT_VIEW) {
      handleParamsChange({ sidePane: right, view: null, right: null });
    } else { // From normal
      const paneContent = pageToPaneMap[currentActivePage] || 'details';
      handleParamsChange({ view: 'split', right: paneContent, sidePane: null });
    }
  }, [bodyState, sidePane, right, currentActivePage, handleParamsChange]);
  
  const setNormalView = useCallback(() => {
      handleParamsChange({ sidePane: null, view: null, right: null });
  }, [handleParamsChange]);

  const switchSplitPanes = useCallback(() => {
    if (bodyState !== BODY_STATES.SPLIT_VIEW) return;
    const newSidePaneContent = pageToPaneMap[currentActivePage];
    const newActivePage = Object.entries(pageToPaneMap).find(
      ([, value]) => value === sidePaneContent
    )?.[0] as ActivePage | undefined;

    if (newActivePage && newSidePaneContent) {
      navigate(`/${newActivePage}?view=split&right=${newSidePaneContent}`, { replace: true });
    }
  }, [bodyState, currentActivePage, sidePaneContent, navigate]);
  
  const closeSplitPane = useCallback((paneToClose: 'main' | 'right') => {
    if (bodyState !== BODY_STATES.SPLIT_VIEW) return;
    if (paneToClose === 'right') {
      navigate(`/${currentActivePage}`, { replace: true });
    } else { // Closing main pane
      const pageToBecomeActive = Object.entries(pageToPaneMap).find(
        ([, value]) => value === sidePaneContent
      )?.[0] as ActivePage | undefined;
      
      if (pageToBecomeActive) {
        navigate(`/${pageToBecomeActive}`, { replace: true });
      } else {
        navigate(`/dashboard`, { replace: true });
      }
    }
  }, [bodyState, currentActivePage, sidePaneContent, navigate]);
  
  // DataDemo actions
  const setViewMode = (mode: ViewMode) => handleParamsChange({ view: mode });
  const setGroupBy = (val: string) => handleParamsChange({ groupBy: val === 'none' ? null : val }, true);
  const setActiveGroupTab = (tab: string) => handleParamsChange({ tab: tab === 'all' ? null : tab });
  const setFilters = (newFilters: FilterConfig) => {
    handleParamsChange({ q: newFilters.searchTerm, status: newFilters.status, priority: newFilters.priority }, true);
  }
  const setSort = (config: SortConfig | null) => {
    if (!config) {
      handleParamsChange({ sort: 'default' }, true);
    } else {
      handleParamsChange({ sort: `${config.key}-${config.direction}` }, true);
    }
  }
  const setTableSort = (field: SortableField) => {
    let newSort: string | null = `${field}-desc`;
    if (sortConfig?.key === field) {
      if (sortConfig.direction === 'desc') newSort = `${field}-asc`;
      else if (sortConfig.direction === 'asc') newSort = 'default';
    }
    handleParamsChange({ sort: newSort }, true);
  };
  const setPage = (newPage: number) => handleParamsChange({ page: newPage.toString() });

  const onItemSelect = useCallback((item: DataItem) => {
		navigate(`/data-demo/${item.id}${location.search}`);
	}, [navigate, location.search]);

  const setMessagingView = (view: TaskView) => handleParamsChange({ messagingView: view });


  return useMemo(() => ({
    // State
    bodyState,
    sidePaneContent,
    currentActivePage,
    itemId,
    messagingView,
    // DataDemo State
    viewMode,
    page,
    groupBy,
    activeGroupTab,
    filters,
    sortConfig,
    // Actions
    navigateTo,
    openSidePane,
    closeSidePane,
    toggleSidePane,
    toggleSplitView,
    setNormalView,
    switchSplitPanes,
    setMessagingView,
    closeSplitPane,
    // DataDemo Actions
    onItemSelect,
    setViewMode,
    setGroupBy,
    setActiveGroupTab,
    setFilters,
    setSort,
    setTableSort,
    setPage,
  }), [
    bodyState, sidePaneContent, currentActivePage, itemId, messagingView,
    viewMode, page, groupBy, activeGroupTab, filters, sortConfig,
    navigateTo, openSidePane, closeSidePane, toggleSidePane, toggleSplitView, setNormalView, setMessagingView,
    switchSplitPanes, closeSplitPane, onItemSelect, setViewMode, setGroupBy, setActiveGroupTab, setFilters,
    setSort, setTableSort, setPage
  ]);
}
```

## File: src/components/layout/MainContent.tsx
```typescript
import { forwardRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils';
import { BODY_STATES } from '@/lib/utils'
import { useAppShellStore } from '@/store/appShell.store'

interface MainContentProps {
  children?: React.ReactNode;
}

export const MainContent = forwardRef<HTMLDivElement, MainContentProps>(
  ({ children }, ref) => {
    const bodyState = useAppShellStore(s => s.bodyState);
    const fullscreenTarget = useAppShellStore(s => s.fullscreenTarget);
    const { toggleFullscreen } = useAppShellStore.getState();
    const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;

    if (isFullscreen && fullscreenTarget === 'right') {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
        "flex flex-col h-full overflow-hidden bg-background",
        isFullscreen && "fixed inset-0 z-[60]"
        )}
      >
        {isFullscreen && (
          <button
            onClick={() => toggleFullscreen()}
            className="fixed top-6 right-6 lg:right-12 z-[100] h-12 w-12 flex items-center justify-center rounded-full bg-card/50 backdrop-blur-sm hover:bg-card/75 transition-colors group"
            title="Exit Fullscreen"
          >
            <X className="w-6 h-6 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
          </button>
        )}

        <div className="flex-1 min-h-0 flex flex-col">
          {children}
        </div>
      </div>
    )
  }
)
MainContent.displayName = 'MainContent'
```

## File: src/store/appShell.store.ts
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  defaultSidePaneWidth: number;
  defaultSplitPaneWidth: number;
  defaultWidthsSet: boolean;
  previousBodyState: BodyState;
  fullscreenTarget: 'main' | 'right' | null;
  isResizing: boolean;
  isResizingRightPane: boolean;
  isTopBarVisible: boolean;
  isTopBarHovered: boolean;
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
    setDefaultPaneWidths: () => void;
    resetPaneWidths: () => void;
    setSplitPaneWidth: (payload: number) => void;
    setIsResizing: (payload: boolean) => void;
    setFullscreenTarget: (payload: 'main' | 'right' | null) => void;
    setIsResizingRightPane: (payload: boolean) => void;
    setTopBarVisible: (payload: boolean) => void;
    setAutoExpandSidebar: (payload: boolean) => void;
    setReducedMotion: (payload: boolean) => void;
    setCompactMode: (payload: boolean) => void;
    setPrimaryColor: (payload: string) => void;
    setDraggedPage: (payload: AppShellState['draggedPage']) => void;
    setCommandPaletteOpen: (open: boolean) => void;
    toggleDarkMode: () => void;
    setDragHoverTarget: (payload: 'left' | 'right' | null) => void;
    setTopBarHovered: (isHovered: boolean) => void;
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
  defaultSidePaneWidth: 400,
  defaultSplitPaneWidth: 400,
  defaultWidthsSet: false,
  previousBodyState: BODY_STATES.NORMAL,
  fullscreenTarget: null,
  isResizing: false,
  isResizingRightPane: false,
  isTopBarVisible: true,
  isTopBarHovered: false,
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


export const useAppShellStore = create<AppShellState & AppShellActions>()(
  persist(
    (set, get) => ({
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
      setDefaultPaneWidths: () => {
        if (get().defaultWidthsSet) return;
        set(state => ({
            defaultSidePaneWidth: state.sidePaneWidth,
            defaultSplitPaneWidth: state.splitPaneWidth,
            defaultWidthsSet: true,
        }));
      },
      resetPaneWidths: () => set(state => ({
        sidePaneWidth: state.defaultSidePaneWidth,
        splitPaneWidth: state.defaultSplitPaneWidth,
      })),
      setSplitPaneWidth: (payload) => set({ splitPaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, payload)) }),
      setIsResizing: (payload) => set({ isResizing: payload }),
      setFullscreenTarget: (payload) => set({ fullscreenTarget: payload }),
      setIsResizingRightPane: (payload) => set({ isResizingRightPane: payload }),
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
      setTopBarHovered: (isHovered) => set({ isTopBarHovered: isHovered }),
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
        // Preserve props passed to provider and session defaults
        set(state => {
          const currentPrimaryColor = defaultState.primaryColor;
          if (typeof document !== 'undefined') {
            document.documentElement.style.setProperty('--primary-hsl', currentPrimaryColor);
          }
          return {
            ...defaultState,
            primaryColor: currentPrimaryColor,
            appName: state.appName,
            appLogo: state.appLogo,
            defaultSidePaneWidth: state.defaultSidePaneWidth,
            defaultSplitPaneWidth: state.defaultSplitPaneWidth,
            defaultWidthsSet: state.defaultWidthsSet,
            // Also reset current widths to the defaults
            sidePaneWidth: state.defaultSidePaneWidth,
            splitPaneWidth: state.defaultSplitPaneWidth,
          };
        });
      },
    }),
    {
      name: 'app-shell-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        sidebarState: state.sidebarState,
        sidebarWidth: state.sidebarWidth,
        sidePaneWidth: state.sidePaneWidth,
        splitPaneWidth: state.splitPaneWidth,
        autoExpandSidebar: state.autoExpandSidebar,
        reducedMotion: state.reducedMotion,
        compactMode: state.compactMode,
        primaryColor: state.primaryColor,
      }),
    }
  )
);

// Add a selector for the derived rightPaneWidth
export const useRightPaneWidth = () => useAppShellStore(state => 
    state.bodyState === BODY_STATES.SPLIT_VIEW ? state.splitPaneWidth : state.sidePaneWidth
);
```

## File: src/components/layout/RightPane.tsx
```typescript
import { forwardRef, useMemo, useCallback, createElement, memo } from 'react'
import {
  ChevronRight,
  X,
  Layers,
  SplitSquareHorizontal,
  ChevronsLeftRight,
} from 'lucide-react'
import { cn, BODY_STATES } from '@/lib/utils';
import { useAppShellStore } from '@/store/appShell.store';
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import { useRightPaneContent } from '@/hooks/useRightPaneContent.hook'

export const RightPane = memo(forwardRef<HTMLDivElement, { className?: string }>(({ className }, ref) => {
  const fullscreenTarget = useAppShellStore(s => s.fullscreenTarget)
  const bodyState = useAppShellStore(s => s.bodyState)
  const { toggleFullscreen, setIsResizingRightPane } =
    useAppShellStore.getState()

  const viewManager = useAppViewManager()
  const { sidePaneContent, closeSidePane, toggleSplitView, navigateTo } = viewManager
  
  const { meta, content: children } = useRightPaneContent(sidePaneContent)
  
  const isSplitView = bodyState === BODY_STATES.SPLIT_VIEW;
  const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;

  const handleMaximize = useCallback(() => {
    if ("page" in meta && meta.page) {
      navigateTo(meta.page);
    }
  }, [meta, navigateTo]);

  const header = useMemo(() => (
    <div className="flex items-center justify-between p-4 border-b border-border h-20 flex-shrink-0 pl-6">
      {bodyState !== BODY_STATES.SPLIT_VIEW && 'icon' in meta ? (
        <div className="flex items-center gap-2">
          {meta.icon && createElement(meta.icon, { className: "w-5 h-5" })}
          <h2 className="text-lg font-semibold whitespace-nowrap">{meta.title}</h2>
        </div>
      ) : <div />}
      <div className="flex items-center">
        {(bodyState === BODY_STATES.SIDE_PANE || bodyState === BODY_STATES.SPLIT_VIEW) && (
          <button onClick={toggleSplitView} className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors" title={bodyState === BODY_STATES.SIDE_PANE ? "Switch to Split View" : "Switch to Overlay View"}>
            {bodyState === BODY_STATES.SPLIT_VIEW ? <Layers className="w-5 h-5" /> : <SplitSquareHorizontal className="w-5 h-5" />}
          </button>
        )}
        {bodyState !== BODY_STATES.SPLIT_VIEW && "page" in meta && meta.page && (
          <button onClick={handleMaximize} className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors mr-2" title="Move to Main View">
            <ChevronsLeftRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  ), [bodyState, meta, handleMaximize, toggleSplitView]);

  if (isFullscreen && fullscreenTarget !== 'right') {
    return null;
  }

  return (
    <aside
      ref={ref}
      className={cn(
        "border-l border-border flex flex-col h-full overflow-hidden",
        isSplitView && "relative bg-background",
        !isSplitView && !isFullscreen && "fixed top-0 right-0 z-[60] bg-card", // side pane overlay
        isFullscreen && fullscreenTarget === 'right' && "fixed inset-0 z-[60] bg-card", // fullscreen
        className,
      )}
    >
      {isFullscreen && fullscreenTarget === 'right' && (
        <button
          onClick={() => toggleFullscreen()}
          className="fixed top-6 right-6 lg:right-12 z-[100] h-12 w-12 flex items-center justify-center rounded-full bg-card/50 backdrop-blur-sm hover:bg-card/75 transition-colors group"
          title="Exit Fullscreen"
        >
          <X className="w-6 h-6 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
        </button>
      )}
      {bodyState !== BODY_STATES.SPLIT_VIEW && !isFullscreen && (
        <button
          onClick={closeSidePane}
          className="absolute top-1/2 -left-px -translate-y-1/2 -translate-x-full w-8 h-16 bg-card border border-r-0 border-border rounded-l-lg flex items-center justify-center hover:bg-accent transition-colors group z-10"
          title="Close pane"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      )}
      <div 
        className={cn(
          "absolute top-0 left-0 w-2 h-full bg-transparent hover:bg-primary/20 cursor-col-resize z-50 transition-colors duration-200 group -translate-x-1/2"
        )}
        onMouseDown={(e) => {
          e.preventDefault()
          setIsResizingRightPane(true);
        }}
      >
        <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200 mx-auto" />
      </div>
      {!isSplitView && !isFullscreen && header}
      <div className={cn("flex-1 overflow-y-auto")}>
        {children}
      </div>
    </aside>
  )
}));
RightPane.displayName = "RightPane"
```

## File: src/App.tsx
```typescript
import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useNavigate, // used in LoginPageWrapper
  useLocation,
} from "react-router-dom";

import { AppShell } from "./components/layout/AppShell";
import { AppShellProvider } from "./providers/AppShellProvider";
import { useAppShellStore } from "./store/appShell.store";
import { useAuthStore } from "./store/authStore";
import "./index.css";

// Import library components
import { EnhancedSidebar } from "./components/layout/EnhancedSidebar";
import { MainContent } from "./components/layout/MainContent";
import { RightPane } from "./components/layout/RightPane";
import { TopBar } from "./components/layout/TopBar";
import { CommandPalette } from "./components/global/CommandPalette";
import { ToasterProvider } from "./components/ui/toast";

// --- Page/Content Components for Pages and Panes ---
import { DashboardContent } from "./pages/Dashboard";
import { SettingsPage } from "./pages/Settings";
import { ToasterDemo } from "./pages/ToasterDemo";
import { NotificationsPage } from "./pages/Notifications";
import DataDemoPage from "./pages/DataDemo";
import MessagingPage from "./pages/Messaging";
import { LoginPage } from "./components/auth/LoginPage";

// --- Icons ---
import {
  Search,
  Filter,
  Plus,
  ChevronRight,
  Rocket,
} from "lucide-react";

// --- Utils & Hooks ---
import { cn } from "./lib/utils";
import { useAppViewManager } from "./hooks/useAppViewManager.hook";
import { useRightPaneContent } from "./hooks/useRightPaneContent.hook";
import { BODY_STATES } from "./lib/utils";

// Checks for authentication and redirects to login if needed
function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

// A root component to apply global styles and effects
function Root() {
  const isDarkMode = useAppShellStore((state) => state.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return <Outlet />;
}

// The main layout for authenticated parts of the application
function ProtectedLayout() {

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <AppShellProvider
        appName="Jeli App"
        appLogo={
          <div className="p-2 bg-primary/20 rounded-lg">
            <Rocket className="w-5 h-5 text-primary" />
          </div>
        }
      >
        <ComposedApp />
      </AppShellProvider>
    </div>
  );
}

// Content for the Top Bar (will be fully refactored in Part 2)
function AppTopBar() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const location = useLocation();
  const activePage = location.pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'dashboard';

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "hidden md:flex items-center gap-2 text-sm transition-opacity",
          {
            "opacity-0 pointer-events-none":
              isSearchFocused && activePage === "dashboard",
          },
        )}
      >
        <a
          href="#"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Home
        </a>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-foreground capitalize">
          {activePage}
        </span>
      </div>

      {/* Page-specific: Dashboard search and actions */}
      {activePage === "dashboard" && (
        <div className="flex items-center gap-2 flex-1 justify-end">
          <div
            className={cn(
              "relative transition-all duration-300 ease-in-out",
              isSearchFocused ? "flex-1 max-w-lg" : "w-auto",
            )}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={cn(
                "pl-9 pr-4 py-2 h-10 border-none rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ease-in-out w-full",
                isSearchFocused ? "bg-background" : "w-48",
              )}
            />
          </div>
          <button className="h-10 w-10 flex-shrink-0 flex items-center justify-center hover:bg-accent rounded-full transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 h-10 flex-shrink-0">
            <Plus className="w-5 h-5" />
            <span
              className={cn(isSearchFocused ? "hidden sm:inline" : "inline")}
            >
              New Project
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

// The main App component that composes the shell
function ComposedApp() {
  const { setBodyState, setSidePaneContent } = useAppShellStore();
  const viewManager = useAppViewManager();

  // Sync URL state with AppShellStore
  useEffect(() => {
    setBodyState(viewManager.bodyState);
    setSidePaneContent(viewManager.sidePaneContent);
  }, [viewManager.bodyState, viewManager.sidePaneContent, setBodyState, setSidePaneContent]);

  return (
    <AppShell
      sidebar={<EnhancedSidebar />}
      onOverlayClick={viewManager.closeSidePane}
      topBar={
        <TopBar>
          <AppTopBar />
        </TopBar>
      }
      mainContent={
        <MainContent>
          <Outlet />
        </MainContent>
      }
      rightPane={<RightPane />}
      commandPalette={<CommandPalette />}
    />
  );
}

function App() {
  const router = createBrowserRouter([
    {
      element: <Root />,
      children: [
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/",
          element: <ProtectedRoute />,
          children: [
            {
              path: "/",
              element: <ProtectedLayout />,
              children: [
                { index: true, element: <Navigate to="/dashboard" replace /> },
                { path: "dashboard", element: <DashboardContent /> },
                { path: "settings", element: <SettingsPage /> },
                { path: "toaster", element: <ToasterDemo /> },
                { path: "notifications", element: <NotificationsPage /> },
                { path: "data-demo", element: <DataDemoPage /> },
                { path: "data-demo/:itemId", element: <DataDemoPage /> },
                { path: "messaging", element: <MessagingPage /> },
                { path: "messaging/:conversationId", element: <MessagingPage /> },
              ],
            },
          ],
        },
      ],
    },
  ]);

  return (
    <ToasterProvider>
      <RouterProvider router={router} />
    </ToasterProvider>
  );
}

export default App;
```
