# Directory Structure
```
src/
  components/
    layout/
      TopBar.tsx
  features/
    settings/
      SettingsContent.tsx
  store/
    appShell.store.ts
  App.tsx
index.html
```

# Files

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

## File: src/features/settings/SettingsContent.tsx
```typescript
import { useState } from 'react'
import { 
  Moon, 
  Sun, 
  Zap, 
  Eye, 
  Minimize2, 
  RotateCcw,
  Monitor,
  Smartphone,
  Palette,
  Accessibility,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppShellStore } from '@/store/appShell.store'
import { SettingsToggle } from './SettingsToggle'
import { SettingsSection } from './SettingsSection'

const colorPresets = [
  { name: 'Default Blue', value: '220 84% 60%' },
  { name: 'Rose', value: '346.8 77.2% 49.8%' },
  { name: 'Green', value: '142.1 76.2% 36.3%' },
  { name: 'Orange', value: '24.6 95% 53.1%' },
  { name: 'Violet', value: '262.1 83.3% 57.8%' },
  { name: 'Slate', value: '215.3 20.3% 65.1%' }
]

export function SettingsContent() {
  const sidebarWidth = useAppShellStore(s => s.sidebarWidth);
  const compactMode = useAppShellStore(s => s.compactMode);
  const primaryColor = useAppShellStore(s => s.primaryColor);
  const autoExpandSidebar = useAppShellStore(s => s.autoExpandSidebar);
  const reducedMotion = useAppShellStore(s => s.reducedMotion);
  const isDarkMode = useAppShellStore(s => s.isDarkMode);
  
  const {
    setSidebarWidth, setCompactMode, setPrimaryColor, setAutoExpandSidebar,
    setReducedMotion, resetToDefaults, toggleDarkMode
  } = useAppShellStore.getState();

  const [tempSidebarWidth, setTempSidebarWidth] = useState(sidebarWidth)

  const handleSidebarWidthChange = (width: number) => {
    setTempSidebarWidth(width)
    setSidebarWidth(width);
  }

  const handleReset = () => {
    resetToDefaults();
    setTempSidebarWidth(280); // Reset temp state as well
  }

  const handleSetSidebarWidth = (payload: number) => {
    setSidebarWidth(payload);
    setTempSidebarWidth(payload);
  };

  return (
    <div className="space-y-10">
      {/* Appearance */}
      <SettingsSection icon={<Palette />} title="Appearance">
        {/* Dark Mode */}
        <SettingsToggle
          icon={isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          title="Dark Mode"
          description="Toggle dark theme"
          checked={isDarkMode}
          onCheckedChange={toggleDarkMode}
        />

        {/* Compact Mode */}
        <SettingsToggle
          icon={<Minimize2 className="w-4 h-4" />}
          title="Compact Mode"
          description="Reduce spacing and sizes"
          checked={compactMode}
          onCheckedChange={setCompactMode}
        />

        {/* Accent Color */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Palette className="w-4 h-4" />
            <div>
              <p className="font-medium">Accent Color</p>
              <p className="text-sm text-muted-foreground">Customize the main theme color</p>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2 pt-1">
            {colorPresets.map(color => {
              const isActive = color.value === primaryColor
              return (
                <button
                  key={color.name}
                  title={color.name}
                  onClick={() => setPrimaryColor(color.value)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center",
                    isActive ? 'border-primary' : 'border-transparent'
                  )}
                  style={{ backgroundColor: `hsl(${color.value})` }}
                >{isActive && <Check className="w-5 h-5 text-primary-foreground" />}</button>
              )
            })}
          </div>
        </div>
      </SettingsSection>

      {/* Behavior */}
      <SettingsSection icon={<Zap />} title="Behavior">
        {/* Auto Expand Sidebar */}
        <SettingsToggle
          icon={<Eye className="w-4 h-4" />}
          title="Auto Expand Sidebar"
          description="Expand on hover when collapsed"
          checked={autoExpandSidebar}
          onCheckedChange={setAutoExpandSidebar}
        />

        {/* Sidebar Width */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Monitor className="w-4 h-4" />
            <div>
              <p className="font-medium">Sidebar Width</p>
              <p className="text-sm text-muted-foreground">{tempSidebarWidth}px</p>
            </div>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="200"
              max="500"
              step="10"
              value={tempSidebarWidth}
              onChange={(e) => handleSidebarWidthChange(Number(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>200px</span>
              <span>350px</span>
              <span>500px</span>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Accessibility */}
      <SettingsSection icon={<Accessibility />} title="Accessibility">
        {/* Reduced Motion */}
        <SettingsToggle
          icon={<Zap className="w-4 h-4" />}
          title="Reduced Motion"
          description="Minimize animations"
          checked={reducedMotion}
          onCheckedChange={setReducedMotion}
        />
      </SettingsSection>

      {/* Presets */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Quick Presets
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => {
              setCompactMode(false)
              setReducedMotion(false)
              handleSetSidebarWidth(320)
            }}
            className="p-4 bg-accent/30 hover:bg-accent/50 rounded-xl transition-colors text-left"
          >
            <Monitor className="w-4 h-4 mb-2" />
            <p className="font-medium text-sm">Desktop</p>
            <p className="text-xs text-muted-foreground">Spacious layout</p>
          </button>
          
          <button 
            onClick={() => {
              setCompactMode(true)
              setReducedMotion(true)
              handleSetSidebarWidth(240)
            }}
            className="p-4 bg-accent/30 hover:bg-accent/50 rounded-xl transition-colors text-left"
          >
            <Smartphone className="w-4 h-4 mb-2" />
            <p className="font-medium text-sm">Mobile</p>
            <p className="text-xs text-muted-foreground">Compact layout</p>
          </button>
        </div>
      </div>
      <div className="pt-6 border-t border-border">
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}

// Custom slider styles
const sliderStyles = `
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: hsl(var(--primary));
  cursor: pointer;
  border: 3px solid hsl(var(--background));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: -7px;
}

.slider::-moz-range-thumb {
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: hsl(var(--primary));
  cursor: pointer;
  border: 3px solid hsl(var(--background));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = sliderStyles
  document.head.appendChild(styleSheet)
}
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
}));

// Add a selector for the derived rightPaneWidth
export const useRightPaneWidth = () => useAppShellStore(state => 
    state.bodyState === BODY_STATES.SPLIT_VIEW ? state.splitPaneWidth : state.sidePaneWidth
);
```

## File: src/components/layout/TopBar.tsx
```typescript
import React from 'react';
import {
  Moon, 
  Sun,
  Settings,
  Command,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BODY_STATES } from '@/lib/utils'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import { UserDropdown } from './UserDropdown'
import { ViewModeSwitcher } from './ViewModeSwitcher'
import { useAppShellStore } from '@/store/appShell.store'

interface TopBarProps {
  children?: React.ReactNode
}

export const TopBar = React.memo(({
  children,
}: TopBarProps) => {
  const bodyState = useAppShellStore(s => s.bodyState)
  const isDarkMode = useAppShellStore(s => s.isDarkMode);
  const { 
    setCommandPaletteOpen,
    toggleDarkMode,
  } = useAppShellStore.getState();
  const viewManager = useAppViewManager();

  return (
    <div className={cn(
      "h-20 bg-background border-b border-border flex items-center justify-between px-6 z-50 gap-4"
    )}>
      {/* Left Section - Sidebar Controls & Breadcrumbs */}
      <div className="flex items-center gap-4">
        {children}
      </div>

      {/* Right Section - page controls, and global controls */}
      <div className="flex items-center gap-3">
        {/* Separator */}
        <div className="w-px h-6 bg-border mx-2" />

        {/* Quick Actions */}
        <div className="flex items-center gap-3">

          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group"
            title="Command Palette (Ctrl+K)"
          >
            <Command className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

        <button
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group"
          title="Quick Actions"
        >
          <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {bodyState !== BODY_STATES.SPLIT_VIEW && <ViewModeSwitcher />}

        <div className="w-px h-6 bg-border mx-2" />

        {/* Theme and Settings */}
        <button
          onClick={toggleDarkMode}
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 group-hover:scale-110 transition-transform" />
          ) : (
            <Moon className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
        </button>

        <button
          onClick={() => viewManager.toggleSidePane('settings')}
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group"
          title="Settings"
        >
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>
        <UserDropdown />
        </div>
      </div>
    </div>
  )
});
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
