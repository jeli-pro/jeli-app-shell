# Directory Structure
```
src/
  components/
    layout/
      AppShell.tsx
  hooks/
    useAppViewManager.hook.ts
    useResizablePanes.hook.ts
    useRightPaneContent.hook.tsx
  pages/
    Messaging/
      index.tsx
  providers/
    AppShellProvider.tsx
  store/
    appShell.store.ts
index.html
package.json
postcss.config.js
tailwind.config.js
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: src/providers/AppShellProvider.tsx
```typescript
import { useEffect, type ReactNode, type ReactElement } from 'react';
import { useAppShellStore } from '@/store/appShell.store';

interface AppShellProviderProps {
  children: ReactNode;
  appName?: string;
  appLogo?: ReactElement;
  defaultSplitPaneWidth?: number;
}

export function AppShellProvider({ children, appName, appLogo, defaultSplitPaneWidth }: AppShellProviderProps) {
  const init = useAppShellStore(state => state.init);
  const setPrimaryColor = useAppShellStore(state => state.setPrimaryColor);
  const primaryColor = useAppShellStore(state => state.primaryColor);

  useEffect(() => {
    init({ appName, appLogo, defaultSplitPaneWidth });
  }, [appName, appLogo, defaultSplitPaneWidth, init]);

  // Side effect for primary color
  useEffect(() => {
    // This effect is here because the store itself can't run side-effects on init
    // before React has mounted. So we trigger it from the provider.
    setPrimaryColor(primaryColor);
  }, [primaryColor, setPrimaryColor]);

  return <>{children}</>;
}
```

## File: postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## File: index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jeli App Shell</title>
  </head>
  <body>
    <div id="root"></div>
    <div id="toaster-container"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## File: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Library Build */
    "declaration": true,
    "emitDeclarationOnly": true,
    "declarationDir": "dist",

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": [
    "dist",
    "src/App.tsx",
    "src/main.tsx",
    "src/pages"
  ]
}
```

## File: src/hooks/useAppViewManager.hook.ts
```typescript
import { useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import type { AppShellState, ActivePage } from '@/store/appShell.store';
import type { DataItem, ViewMode, SortConfig, SortableField, GroupableField, Status, Priority } from '@/pages/DataDemo/types';
import type { FilterConfig } from '@/pages/DataDemo/components/DataToolbar';
import { BODY_STATES } from '@/lib/utils';

const pageToPaneMap: Record<string, AppShellState['sidePaneContent']> = {
  dashboard: 'main',
  settings: 'settings',
  toaster: 'toaster',
  notifications: 'notifications',
  'data-demo': 'dataDemo',
  messaging: 'messaging',
};

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

  // --- DERIVED STATE FROM URL ---

  const view = searchParams.get('view');
  const sidePane = searchParams.get('sidePane');
  const right = searchParams.get('right');

  const { bodyState, sidePaneContent } = useMemo(() => {
    const validPanes: AppShellState['sidePaneContent'][] = ['details', 'settings', 'main', 'toaster', 'notifications', 'dataDemo', 'messaging'];
    
    if (conversationId) {
      return { bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: 'messaging' as const };
    }

    if (itemId) {
      if (view === 'split') {
        return { bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: 'dataItem' as const };
      }
      return { bodyState: BODY_STATES.SIDE_PANE, sidePaneContent: 'dataItem' as const };
    }
    
    if (sidePane && validPanes.includes(sidePane as AppShellState['sidePaneContent'])) {
      return { bodyState: BODY_STATES.SIDE_PANE, sidePaneContent: sidePane as AppShellState['sidePaneContent'] };
    }
    
    if (view === 'split' && right && validPanes.includes(right as AppShellState['sidePaneContent'])) {
      return { bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: right as AppShellState['sidePaneContent'] };
    }
    
    return { bodyState: BODY_STATES.NORMAL, sidePaneContent: 'details' as const };
  }, [itemId, conversationId, view, sidePane, right]);
  
  const currentActivePage = useMemo(() => (location.pathname.split('/')[1] || 'dashboard') as ActivePage, [location.pathname]);

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

  const navigateTo = useCallback((page: string) => {
    navigate(page.startsWith('/') ? page : `/${page}`);
  }, [navigate]);

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


  return useMemo(() => ({
    // State
    bodyState,
    sidePaneContent,
    currentActivePage,
    itemId,
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
    bodyState, sidePaneContent, currentActivePage, itemId,
    viewMode, page, groupBy, activeGroupTab, filters, sortConfig,
    navigateTo, openSidePane, closeSidePane, toggleSidePane, toggleSplitView, setNormalView, 
    switchSplitPanes, closeSplitPane, onItemSelect, setViewMode, setGroupBy, setActiveGroupTab, setFilters,
    setSort, setTableSort, setPage
  ]);
}
```

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
    if (sidePaneContent === 'messaging') {
      return {
       meta: contentMap.messaging,
       content: <MessagingContent conversationId={conversationId} />,
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

## File: src/pages/Messaging/index.tsx
```typescript
import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { ConversationList } from "./components/ConversationList";
import { cn } from "@/lib/utils";
import { MessagingContent } from "./components/MessagingContent";
import { useAppShellStore } from "@/store/appShell.store";
import { useResizableMessagingList } from "@/hooks/useResizablePanes.hook";
import { BODY_STATES } from "@/lib/utils";

export default function MessagingPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const COLLAPSED_WIDTH = 80;

  const { messagingListWidth, isResizingMessagingList, isMessagingListCollapsed, bodyState } = useAppShellStore(s => ({
    messagingListWidth: s.messagingListWidth,
    isResizingMessagingList: s.isResizingMessagingList,
    isMessagingListCollapsed: s.isMessagingListCollapsed,
    bodyState: s.bodyState,
  }));
  const { setIsResizingMessagingList } = useAppShellStore.getState();

  useResizableMessagingList(containerRef);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMessagingListCollapsed) return;
    e.preventDefault();
    setIsResizingMessagingList(true);
  };

  const listWidth = isMessagingListCollapsed ? COLLAPSED_WIDTH : messagingListWidth;

  if (bodyState === BODY_STATES.SPLIT_VIEW) {
    return (
      <div className="h-full w-full">
        <ConversationList />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn(
      "h-full w-full flex bg-background", 
      isResizingMessagingList && !isMessagingListCollapsed && "cursor-col-resize select-none"
    )}>
        <div style={{ width: `${listWidth}px` }} className="flex-shrink-0 transition-[width] duration-300 ease-in-out">
          <ConversationList />
        </div>
        {!isMessagingListCollapsed && (
          <div onMouseDown={handleMouseDown} className="w-2 flex-shrink-0 cursor-col-resize group flex items-center justify-center">
            <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200" />
          </div>
        )}
        <div className="flex-1 min-w-0"><MessagingContent conversationId={conversationId} /></div>
    </div>
  );
}
```

## File: tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        DEFAULT: "0.5rem",
      },
      boxShadow: {
        input: [
          "0px 2px 3px -1px rgba(0, 0, 0, 0.1)",
          "0px 1px 0px 0px rgba(25, 28, 33, 0.02)",
          "0px 0px 0px 1px rgba(25, 28, 33, 0.08)",
        ].join(", "),
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        ripple: "ripple 2s ease calc(var(--i, 0) * 0.2s) infinite",
        orbit: "orbit calc(var(--duration) * 1s) linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        ripple: {
          "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
          "50%": { transform: "translate(-50%, -50%) scale(0.9)" },
        },
        orbit: {
          "0%": {
            transform:
              "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
          },
          "100%": {
            transform:
              "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
          },
        }
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss/plugin")(function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      });
    }),
  ],
}
```

## File: tsconfig.node.json
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

## File: vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'
import { resolve } from 'path'
import pkg from './package.json' with { type: 'json' }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'JeliAppShell',
      fileName: (format) => `jeli-app-shell.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: Object.keys(pkg.peerDependencies || {}),
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          tailwindcss: 'tailwindcss',
          gsap: 'gsap',
          'lucide-react': 'lucide-react',
          zustand: 'zustand',
          sonner: 'sonner'
        },
      },
    },
  },
})
```

## File: src/store/appShell.store.ts
```typescript
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
```

## File: src/hooks/useResizablePanes.hook.ts
```typescript
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { useAppShellStore } from '@/store/appShell.store';
import { BODY_STATES } from '@/lib/utils';

export function useResizableSidebar(
  sidebarRef: React.RefObject<HTMLDivElement>,
  resizeHandleRef: React.RefObject<HTMLDivElement>
) {
  const isResizing = useAppShellStore(s => s.isResizing);
  const { setSidebarWidth, setIsResizing } = useAppShellStore.getState();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = Math.max(200, Math.min(500, e.clientX));
      setSidebarWidth(newWidth);

      if (sidebarRef.current) {
        gsap.set(sidebarRef.current, { width: newWidth });
      }
      if (resizeHandleRef.current) {
        gsap.set(resizeHandleRef.current, { left: newWidth });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setSidebarWidth, setIsResizing, sidebarRef, resizeHandleRef]);
}

export function useResizableRightPane() {
  const isResizingRightPane = useAppShellStore(s => s.isResizingRightPane);
  const bodyState = useAppShellStore(s => s.bodyState);
  const { setSplitPaneWidth, setSidePaneWidth, setIsResizingRightPane } = useAppShellStore.getState();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRightPane) return;

      const newWidth = window.innerWidth - e.clientX;
      if (bodyState === BODY_STATES.SPLIT_VIEW) {
        setSplitPaneWidth(newWidth);
      } else {
        setSidePaneWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingRightPane(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizingRightPane) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isResizingRightPane, setSplitPaneWidth, setSidePaneWidth, setIsResizingRightPane, bodyState]);
}

export function useResizableMessagingList(containerRef: React.RefObject<HTMLDivElement>) {
  const isResizingMessagingList = useAppShellStore(s => s.isResizingMessagingList);
  const { setMessagingListWidth, setIsResizingMessagingList } = useAppShellStore.getState();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingMessagingList || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;
      
      setMessagingListWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingMessagingList(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizingMessagingList) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizingMessagingList, setMessagingListWidth, setIsResizingMessagingList, containerRef]);
}

export function useResizableMessagingProfile(containerRef: React.RefObject<HTMLDivElement>) {
  const isResizingMessagingProfile = useAppShellStore(s => s.isResizingMessagingProfile);
  const { setMessagingProfileWidth, setIsResizingMessagingProfile } = useAppShellStore.getState();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingMessagingProfile || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = containerRect.right - e.clientX;
      
      setMessagingProfileWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingMessagingProfile(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizingMessagingProfile) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isResizingMessagingProfile, setMessagingProfileWidth, setIsResizingMessagingProfile, containerRef]);
}
```

## File: package.json
```json
{
  "name": "jeli-app-shell",
  "private": false,
  "version": "1.0.1",
  "type": "module",
  "files": [
    "dist"
  ],
  "main": "./dist/jeli-app-shell.umd.js",
  "module": "./dist/jeli-app-shell.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/jeli-app-shell.es.js",
      "require": "./dist/jeli-app-shell.umd.js"
    },
    "./dist/style.css": "./dist/style.css"
  },
  "sideEffects": [
    "**/*.css"
  ],
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "peerDependencies": {
    "@iconify/react": "^4.1.1",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "cmdk": "^0.2.0",
    "date-fns": "^3.6.0",
    "gsap": "^3.13.0",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3",
    "sonner": "^1.2.4",
    "tailwind-merge": "^2.0.0",
    "tailwindcss": "^3.3.5",
    "zustand": "^4.5.7"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.1.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5.2.2",
    "vite": "^4.5.0"
  },
  "dependencies": {
    "@radix-ui/react-checkbox": "^1.3.3"
  }
}
```

## File: src/components/layout/AppShell.tsx
```typescript
import React, { useRef, type ReactElement, useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils'
import { gsap } from 'gsap';
import { CommandPalette } from '@/components/global/CommandPalette';
import { useAppShellStore } from '@/store/appShell.store';
import { SIDEBAR_STATES, BODY_STATES } from '@/lib/utils'
import { useResizableSidebar, useResizableRightPane } from '@/hooks/useResizablePanes.hook'
import { useSidebarAnimations, useBodyStateAnimations } from '@/hooks/useAppShellAnimations.hook'
import { ViewModeSwitcher } from './ViewModeSwitcher';
import { usePaneDnd } from '@/hooks/usePaneDnd.hook';

interface AppShellProps {
  sidebar: ReactElement;
  topBar: ReactElement;
  mainContent: ReactElement;
  rightPane: ReactElement;
  commandPalette?: ReactElement;
  onOverlayClick?: () => void;
}

const pageToPaneMap: Record<string, 'main' | 'settings' | 'toaster' | 'notifications' | 'dataDemo'> = {
  dashboard: 'main',
  settings: 'settings',
  toaster: 'toaster',
  notifications: 'notifications',
  'data-demo': 'dataDemo',
};

// Helper hook to get the previous value of a prop or state
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}


export function AppShell({ sidebar, topBar, mainContent, rightPane, commandPalette, onOverlayClick }: AppShellProps) {
  const sidebarState = useAppShellStore(s => s.sidebarState);
  const autoExpandSidebar = useAppShellStore(s => s.autoExpandSidebar);
  const hoveredPane = useAppShellStore(s => s.hoveredPane);
  const draggedPage = useAppShellStore(s => s.draggedPage);
  const dragHoverTarget = useAppShellStore(s => s.dragHoverTarget);
  const bodyState = useAppShellStore(s => s.bodyState);
  const sidePaneContent = useAppShellStore(s => s.sidePaneContent);
  const reducedMotion = useAppShellStore(s => s.reducedMotion);
  const isTopBarVisible = useAppShellStore(s => s.isTopBarVisible);
  const isDarkMode = useAppShellStore(s => s.isDarkMode);
  const { setSidebarState, peekSidebar, setHoveredPane, setTopBarHovered } = useAppShellStore.getState();
  
  const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;
  const isSidePaneOpen = bodyState === BODY_STATES.SIDE_PANE;
  const location = useLocation();
  const activePage = location.pathname.split('/')[1] || 'dashboard';
  const appRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const rightPaneRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const topBarContainerRef = useRef<HTMLDivElement>(null)
  const mainAreaRef = useRef<HTMLDivElement>(null)

  const prevActivePage = usePrevious(activePage);
  const prevSidePaneContent = usePrevious(sidePaneContent);

  const isSplitView = bodyState === BODY_STATES.SPLIT_VIEW;
  const dndHandlers = usePaneDnd();

  // Custom hooks for logic
  useResizableSidebar(sidebarRef, resizeHandleRef);
  useResizableRightPane();
  useSidebarAnimations(sidebarRef, resizeHandleRef);
  useBodyStateAnimations(appRef, mainContentRef, rightPaneRef, topBarContainerRef, mainAreaRef);
  
  // Animation for pane swapping
  useLayoutEffect(() => {
    if (reducedMotion || bodyState !== BODY_STATES.SPLIT_VIEW || !prevActivePage || !prevSidePaneContent) {
      return;
    }

    const pageForPrevSidePane = Object.keys(pageToPaneMap).find(
      key => pageToPaneMap[key as keyof typeof pageToPaneMap] === prevSidePaneContent
    );

    // Check if a swap occurred by comparing current state with previous state
    if (activePage === pageForPrevSidePane && sidePaneContent === pageToPaneMap[prevActivePage as keyof typeof pageToPaneMap]) {
      const mainEl = mainAreaRef.current;
      const rightEl = rightPaneRef.current;

      if (mainEl && rightEl) {
        const mainWidth = mainEl.offsetWidth;
        const rightWidth = rightEl.offsetWidth;

        const tl = gsap.timeline();
        
        // Animate main content FROM where right pane was TO its new place
        tl.from(mainEl, {
          x: rightWidth, duration: 0.4, ease: 'power3.inOut'
        });

        // Animate right pane FROM where main content was TO its new place
        tl.from(rightEl, {
          x: -mainWidth, duration: 0.4, ease: 'power3.inOut'
        }, 0); // Start at the same time
      }
    }
  }, [activePage, sidePaneContent, bodyState, prevActivePage, prevSidePaneContent, reducedMotion]);
  
  const sidebarWithProps = React.cloneElement(sidebar, { 
    ref: sidebarRef,
    onMouseEnter: () => {
      if (autoExpandSidebar && sidebarState === SIDEBAR_STATES.COLLAPSED) {
        peekSidebar()
      }
    },
    onMouseLeave: () => {
      if (autoExpandSidebar && sidebarState === SIDEBAR_STATES.PEEK) {
        setSidebarState(SIDEBAR_STATES.COLLAPSED);
      }
    }
  });

  const mainContentWithProps = React.cloneElement(mainContent, {
    ref: mainContentRef,
  });

  const rightPaneWithProps = React.cloneElement(rightPane, { ref: rightPaneRef });

  return (
    <div 
      ref={appRef}
      className={cn(
        "relative h-screen w-screen overflow-hidden bg-background transition-colors duration-300",
        isDarkMode && "dark"
      )}
    >
      <div className="flex h-screen overflow-hidden">
        {/* Enhanced Sidebar */}
        {sidebarWithProps}

        {/* Resize Handle */}
        {sidebarState !== SIDEBAR_STATES.HIDDEN && (
          <div
            ref={resizeHandleRef}
            className={cn(
              "absolute top-0 w-2 h-full bg-transparent hover:bg-primary/20 cursor-col-resize z-50 transition-colors duration-200 group -translate-x-1/2"
            )}
            onMouseDown={(e) => {
              e.preventDefault()
              useAppShellStore.getState().setIsResizing(true);
            }}
          >
            <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200 mx-auto" />
          </div>
        )}

        {/* Main area wrapper */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div
            ref={topBarContainerRef}
            className={cn(
              "absolute top-0 left-0 right-0 z-30",
              isFullscreen && "z-0"
            )}
            onMouseEnter={() => {
              if (isSplitView) {
                setTopBarHovered(true);
                setHoveredPane(null);
              }
            }}
            onMouseLeave={() => {
              if (isSplitView) {
                setTopBarHovered(false);
              }
            }}
          >
            {topBar}
          </div>

          {/* Invisible trigger area for top bar in split view */}
          {isSplitView && (
            <div
              className="absolute top-0 left-0 right-0 h-4 z-20"
              onMouseEnter={() => {
                setTopBarHovered(true);
                setHoveredPane(null);
              }}
            />
          )}

          <div className="flex flex-1 min-h-0">
            <div
              ref={mainAreaRef}
              className="relative flex-1 overflow-hidden bg-background"
              onMouseEnter={() => { if (isSplitView && !draggedPage) setHoveredPane('left'); }}
              onMouseLeave={() => { if (isSplitView && !draggedPage) setHoveredPane(null); }}
            >
              {/* Side Pane Overlay */}
              <div
                role="button"
                aria-label="Close side pane"
                tabIndex={isSidePaneOpen ? 0 : -1}
                className={cn(
                  "absolute inset-0 bg-black/40 z-40 transition-opacity duration-300",
                  isSidePaneOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                )}
                onClick={onOverlayClick}
              />
              {/* Left drop overlay */}
              <div
                className={cn(
                  "absolute inset-y-0 left-0 z-40 border-2 border-transparent transition-all",
                  draggedPage
                    ? cn("pointer-events-auto", isSplitView ? 'w-full' : 'w-1/2')
                    : "pointer-events-none w-0",
                  dragHoverTarget === 'left' && "bg-primary/10 border-primary"
                )}
                onDragOver={dndHandlers.handleDragOverLeft}
                onDrop={dndHandlers.handleDropLeft}
                onDragLeave={dndHandlers.handleDragLeave}
              >
                {draggedPage && dragHoverTarget === 'left' && (
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-primary-foreground/80 pointer-events-none">
                    <span className="px-3 py-1 rounded-md bg-primary/70">{isSplitView ? 'Drop to Replace' : 'Drop to Left'}</span>
                  </div>
                )}
              </div>
              {mainContentWithProps}
              {isSplitView && hoveredPane === 'left' && !draggedPage && (
                <div className={cn("absolute right-4 z-50 transition-all", isTopBarVisible ? 'top-24' : 'top-4')}>
                  <ViewModeSwitcher pane="main" />
                </div>
              )}
              {/* Right drop overlay (over main area, ONLY when NOT in split view) */}
              {!isSplitView && (
                <div
                  className={cn(
                    "absolute inset-y-0 right-0 z-40 border-2 border-transparent",
                    draggedPage ? "pointer-events-auto w-1/2" : "pointer-events-none",
                    dragHoverTarget === 'right' && "bg-primary/10 border-primary"
                  )}
                  onDragOver={dndHandlers.handleDragOverRight}
                  onDrop={dndHandlers.handleDropRight}
                  onDragLeave={dndHandlers.handleDragLeave}
                >
                  {draggedPage && dragHoverTarget === 'right' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="px-3 py-1 rounded-md bg-primary/70 text-sm font-medium text-primary-foreground/80">Drop to Right</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            {isSplitView ? (
              <div
                className="relative"
                onMouseEnter={() => { if (isSplitView && !draggedPage) setHoveredPane('right'); }}
                onMouseLeave={() => { if (isSplitView && !draggedPage) setHoveredPane(null); }}
                onDragOver={dndHandlers.handleDragOverRight}
              >
                {rightPaneWithProps}
                {draggedPage && (
                  <div
                    className={cn(
                      'absolute inset-0 z-50 transition-all',
                      dragHoverTarget === 'right'
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'pointer-events-none'
                    )}
                    onDragLeave={dndHandlers.handleDragLeave}
                    onDrop={dndHandlers.handleDropRight}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {dragHoverTarget === 'right' && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="px-3 py-1 rounded-md bg-primary/70 text-sm font-medium text-primary-foreground/80">
                          Drop to Replace
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {hoveredPane === 'right' && !draggedPage && (
                  <div className={cn("absolute right-4 z-[70] transition-all", isTopBarVisible ? 'top-24' : 'top-4')}>
                    <ViewModeSwitcher pane="right" />
                  </div>
                )}
              </div>
            ) : rightPaneWithProps}
          </div>
        </div>
      </div>
      {commandPalette || <CommandPalette />}
    </div>
  )
}
```
