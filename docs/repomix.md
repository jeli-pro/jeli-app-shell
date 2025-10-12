# Directory Structure
```
src/
  components/
    layout/
      AppShell.tsx
      RightPane.tsx
      TopBar.tsx
      ViewModeSwitcher.tsx
  context/
    AppShellContext.tsx
  hooks/
    useAppShellAnimations.hook.ts
    useResizablePanes.hook.ts
  lib/
    utils.ts
  store/
    appStore.ts
  App.tsx
  index.ts
index.html
package.json
postcss.config.js
README.md
tailwind.config.js
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: src/components/layout/ViewModeSwitcher.tsx
````typescript
import { cn } from '@/lib/utils'
import { useAppShell } from '@/context/AppShellContext'
import { useAppStore, type ActivePage } from '@/store/appStore'
import { BODY_STATES } from '@/lib/utils'
import { type AppShellState } from '@/context/AppShellContext'
import {
  Columns,
  PanelRightOpen,
  SplitSquareHorizontal,
  Maximize,
  Minimize,
  Layers
} from 'lucide-react'

const pageToPaneMap: Record<ActivePage, AppShellState['sidePaneContent']> = {
  dashboard: 'main',
  settings: 'settings',
  toaster: 'toaster',
  notifications: 'notifications',
};

export function ViewModeSwitcher() {
  const {
    bodyState,
    sidePaneContent,
    openSidePane,
    closeSidePane,
    toggleFullscreen,
    toggleSplitView,
  } = useAppShell()
  const { activePage } = useAppStore()

  const handleSidePaneClick = () => {
    const paneContent = pageToPaneMap[activePage] || 'details';
    // If side pane is already open with the current page's content, clicking again should close it.
    if (bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === paneContent) {
      closeSidePane();
    } else {
      openSidePane(paneContent);
    }
  };
  
  const handleSplitViewClick = () => {
      const paneContent = pageToPaneMap[activePage] || 'details';
      toggleSplitView(paneContent);
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-card rounded-full border border-border">
      <button
        onClick={() => {
            if (bodyState !== BODY_STATES.NORMAL) closeSidePane();
        }}
        className={cn(
          'h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors group',
          bodyState === BODY_STATES.NORMAL && 'bg-accent text-accent-foreground'
        )}
        title="Normal View"
      >
        <Columns className="w-4 h-4" />
      </button>
      <button
        onClick={handleSidePaneClick}
        className={cn(
          'h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors group',
          bodyState === BODY_STATES.SIDE_PANE && 'bg-accent text-accent-foreground'
        )}
        title="Side Pane View"
      >
        <PanelRightOpen className="w-4 h-4" />
      </button>
      <button
        onClick={handleSplitViewClick}
        className={cn(
          'h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors group',
          bodyState === BODY_STATES.SPLIT_VIEW && 'bg-accent text-accent-foreground'
        )}
        title={bodyState === BODY_STATES.SPLIT_VIEW ? 'Switch to Overlay View' : 'Switch to Split View'}
      >
        {bodyState === BODY_STATES.SPLIT_VIEW ? <Layers className="w-4 h-4" /> : <SplitSquareHorizontal className="w-4 h-4" />}
      </button>
      <button
        onClick={toggleFullscreen}
        className={cn(
          'h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors group',
          bodyState === BODY_STATES.FULLSCREEN && 'bg-accent text-accent-foreground'
        )}
        title="Toggle Fullscreen"
      >
        {bodyState === BODY_STATES.FULLSCREEN ? (
          <Minimize className="w-4 h-4" />
        ) : (
          <Maximize className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}
````

## File: postcss.config.js
````javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
````

## File: src/lib/utils.ts
````typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SIDEBAR_STATES = {
  HIDDEN: 'hidden',
  COLLAPSED: 'collapsed', 
  EXPANDED: 'expanded',
  PEEK: 'peek'
} as const

export const BODY_STATES = {
  NORMAL: 'normal',
  FULLSCREEN: 'fullscreen',
  SIDE_PANE: 'side_pane',
  SPLIT_VIEW: 'split_view'
} as const

export type SidebarState = typeof SIDEBAR_STATES[keyof typeof SIDEBAR_STATES]
export type BodyState = typeof BODY_STATES[keyof typeof BODY_STATES]
````

## File: src/index.ts
````typescript
// Context
export { AppShellProvider, useAppShell } from './context/AppShellContext';

// Layout Components
export { AppShell } from './components/layout/AppShell';
export { MainContent } from './components/layout/MainContent';
export { ViewModeSwitcher } from './components/layout/ViewModeSwitcher';
export { RightPane } from './components/layout/RightPane';
export { TopBar } from './components/layout/TopBar';
export { UserDropdown } from './components/layout/UserDropdown';
export { Workspaces as WorkspaceProvider, WorkspaceTrigger, WorkspaceContent } from './components/layout/WorkspaceSwitcher';

// Sidebar Primitives
export {
  Sidebar,
  SidebarBody,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSection,
  SidebarTitle,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarLabel,
  SidebarBadge,
  SidebarTooltip,
  SidebarIcon,
  useSidebar,
} from './components/layout/Sidebar';

// Shared Components
export { ContentInSidePanePlaceholder } from './components/shared/ContentInSidePanePlaceholder';
export { PageHeader } from './components/shared/PageHeader';

// Feature Components
export { SettingsContent } from './features/settings/SettingsContent';
export { SettingsSection } from './features/settings/SettingsSection';
export { SettingsToggle } from './features/settings/SettingsToggle';
export { LoginPage } from './components/auth/LoginPage';

// UI Components
export * from './components/ui/avatar';
export * from './components/ui/badge';
export * from './components/ui/button';
export * from './components/ui/card';
export * from './components/ui/command';
export * from './components/ui/dialog';
export * from './components/ui/dropdown-menu';
export * from './components/ui/input';
export * from './components/ui/label';
export * from './components/ui/popover';
export * from './components/ui/tabs';
export * from './components/ui/toast';

// Global Components
export { CommandPalette } from './components/global/CommandPalette';

// Hooks
export { useAutoAnimateTopBar } from './hooks/useAutoAnimateTopBar';
export { useCommandPaletteToggle } from './hooks/useCommandPaletteToggle.hook';

// Lib
export * from './lib/utils';

// Store
export { useAppStore, type ActivePage } from './store/appStore';
export { useAuthStore } from './store/authStore';
````

## File: tsconfig.json
````json
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
  ],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

## File: src/components/layout/TopBar.tsx
````typescript
import {
  Menu, 
  Moon, 
  Sun,
  Settings,
  Command,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BODY_STATES } from '@/lib/utils'
import { useAppStore } from '@/store/appStore'
import { useAppShell } from '@/context/AppShellContext'
import { UserDropdown } from './UserDropdown'
import { ViewModeSwitcher } from './ViewModeSwitcher'

interface TopBarProps {
  onToggleSidebar?: () => void
  onToggleDarkMode?: () => void
  children?: React.ReactNode
}

export function TopBar({
  onToggleSidebar,
  onToggleDarkMode,
  children,
}: TopBarProps) {
  const { bodyState, openSidePane, sidePaneContent } = useAppShell();
  const { 
    setCommandPaletteOpen,
    isDarkMode,
  } = useAppStore()

  const handleSettingsClick = () => {
    const isSettingsInSidePane = bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === 'settings'

    // If we're on the settings page and it's not in the side pane, treat this as a "minimize" action.
    if (!isSettingsInSidePane) {
      openSidePane('settings');
    } else {
      // In all other cases (on dashboard page, or settings already in pane),
      // just toggle the settings side pane.
      openSidePane('settings')
    }
  };

  return (
    <div className={cn(
      "h-20 bg-background border-b border-border flex items-center justify-between px-6 z-50 gap-4",
      'transition-all duration-300 ease-in-out'
    )}>
      {/* Left Section - Sidebar Controls & Breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* Sidebar Controls */}
        <button
          onClick={() => onToggleSidebar?.()}
          className={cn(
            "h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
          )}
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

      </div>

      {/* Right Section - page controls, and global controls */}
      <div className="flex items-center gap-3">
        {children}

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

        {/* View Mode Controls */}
        <ViewModeSwitcher />

        <div className="w-px h-6 bg-border mx-2" />

        {/* Theme and Settings */}
        <button
          onClick={() => onToggleDarkMode?.()}
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
          onClick={handleSettingsClick}
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
}
````

## File: src/hooks/useAppShellAnimations.hook.ts
````typescript
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { useAppShell } from '@/context/AppShellContext';
import { SIDEBAR_STATES, BODY_STATES } from '@/lib/utils';

export function useSidebarAnimations(
  sidebarRef: React.RefObject<HTMLDivElement>,
  resizeHandleRef: React.RefObject<HTMLDivElement>
) {
  const { sidebarState, sidebarWidth, bodyState, reducedMotion } = useAppShell();
  const animationDuration = reducedMotion ? 0.1 : 0.4;

  useEffect(() => {
    if (!sidebarRef.current || !resizeHandleRef.current) return;

    const sidebar = sidebarRef.current;
    const handle = resizeHandleRef.current;
    
    let targetWidth = 0;
    let targetOpacity = 1;

    if (bodyState === BODY_STATES.FULLSCREEN) {
      targetWidth = 0;
      targetOpacity = 0;
    } else {
      switch (sidebarState) {
        case SIDEBAR_STATES.HIDDEN:
          targetWidth = 0;
          targetOpacity = 0;
          break;
        case SIDEBAR_STATES.COLLAPSED:
          targetWidth = 64;
          targetOpacity = 1;
          break;
        case SIDEBAR_STATES.EXPANDED:
          targetWidth = sidebarWidth;
          targetOpacity = 1;
          break;
        case SIDEBAR_STATES.PEEK:
          targetWidth = sidebarWidth * 0.8;
          targetOpacity = 0.95;
          break;
      }
    }

    const tl = gsap.timeline({ ease: "power3.out" });
    
    tl.to(sidebar, {
      width: targetWidth,
      opacity: targetOpacity,
      duration: animationDuration,
    });
    tl.to(handle, {
      left: targetWidth,
      duration: animationDuration,
    }, 0);

  }, [sidebarState, sidebarWidth, bodyState, animationDuration, sidebarRef, resizeHandleRef]);
}

export function useBodyStateAnimations(
  appRef: React.RefObject<HTMLDivElement>,
  mainContentRef: React.RefObject<HTMLDivElement>,
  rightPaneRef: React.RefObject<HTMLDivElement>,
  topBarContainerRef: React.RefObject<HTMLDivElement>,
  mainAreaRef: React.RefObject<HTMLDivElement>
) {
  const { bodyState, reducedMotion, rightPaneWidth, isTopBarVisible, closeSidePane } = useAppShell();
  const animationDuration = reducedMotion ? 0.1 : 0.4;

  useEffect(() => {
    if (!mainContentRef.current || !rightPaneRef.current || !topBarContainerRef.current || !mainAreaRef.current) return;

    const ease = "power3.out";
    const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;
    const isSidePane = bodyState === BODY_STATES.SIDE_PANE;
    const isSplitView = bodyState === BODY_STATES.SPLIT_VIEW;

    // Right pane animation
    gsap.to(rightPaneRef.current, {
      width: rightPaneWidth,
      x: isSidePane || isSplitView ? 0 : rightPaneWidth + 5, // +5 to hide border
      duration: animationDuration,
      ease,
    });

    gsap.to(mainAreaRef.current, {
      marginRight: isSplitView ? rightPaneWidth : 0,
      duration: animationDuration,
      ease,
    });

    gsap.to(mainContentRef.current, {
      paddingTop: isFullscreen ? '0rem' : isTopBarVisible ? '5rem' : '0rem', // h-20 is 5rem
      duration: animationDuration,
      ease,
    });

    gsap.to(topBarContainerRef.current, {
      y: (isFullscreen || !isTopBarVisible) ? '-100%' : '0%',
      duration: animationDuration,
      ease,
    });
    
    // Add backdrop for side pane
    const backdrop = document.querySelector('.app-backdrop');
    if (isSidePane) { // This is correct because isSidePane is false when bodyState is split_view
      if (!backdrop) {
        const el = document.createElement('div');
        el.className = 'app-backdrop fixed inset-0 bg-black/30 z-[55]';
        appRef.current?.appendChild(el);
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: animationDuration });
        el.onclick = () => closeSidePane();
      }
    } else {
      if (backdrop) {
        gsap.to(backdrop, { opacity: 0, duration: animationDuration, onComplete: () => backdrop.remove() });
      }
    }
  }, [bodyState, animationDuration, rightPaneWidth, closeSidePane, isTopBarVisible, appRef, mainContentRef, rightPaneRef, topBarContainerRef, mainAreaRef]);
}
````

## File: src/hooks/useResizablePanes.hook.ts
````typescript
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { useAppShell } from '@/context/AppShellContext';
import { BODY_STATES } from '@/lib/utils';

export function useResizableSidebar(
  sidebarRef: React.RefObject<HTMLDivElement>,
  resizeHandleRef: React.RefObject<HTMLDivElement>
) {
  const { isResizing, dispatch } = useAppShell();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = Math.max(200, Math.min(500, e.clientX));
      dispatch({ type: 'SET_SIDEBAR_WIDTH', payload: newWidth });

      if (sidebarRef.current) {
        gsap.set(sidebarRef.current, { width: newWidth });
      }
      if (resizeHandleRef.current) {
        gsap.set(resizeHandleRef.current, { left: newWidth });
      }
    };

    const handleMouseUp = () => {
      dispatch({ type: 'SET_IS_RESIZING', payload: false });
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
  }, [isResizing, dispatch, sidebarRef, resizeHandleRef]);
}

export function useResizableRightPane() {
  const { isResizingRightPane, dispatch, bodyState } = useAppShell();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRightPane) return;

      const newWidth = window.innerWidth - e.clientX;
      if (bodyState === BODY_STATES.SPLIT_VIEW) {
        dispatch({ type: 'SET_SPLIT_PANE_WIDTH', payload: newWidth });
      } else {
        dispatch({ type: 'SET_SIDE_PANE_WIDTH', payload: newWidth });
      }
    };

    const handleMouseUp = () => {
      dispatch({ type: 'SET_IS_RESIZING_RIGHT_PANE', payload: false });
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
  }, [isResizingRightPane, dispatch, bodyState]);
}
````

## File: index.html
````html
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
````

## File: tailwind.config.js
````javascript
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
  plugins: [require("tailwindcss-animate")],
}
````

## File: tsconfig.node.json
````json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true
  },
  "include": ["vite.config.ts"]
}
````

## File: src/components/layout/RightPane.tsx
````typescript
import { forwardRef, type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn, BODY_STATES } from '@/lib/utils'
import { useAppShell } from '@/context/AppShellContext'

interface RightPaneProps {
  children?: ReactNode
  header?: ReactNode
  className?: string
}

export const RightPane = forwardRef<HTMLDivElement, RightPaneProps>(({ children, header, className }, ref) => {
  const { closeSidePane, dispatch, bodyState } = useAppShell();

  return (
    <aside
      ref={ref}
      className={cn("bg-card border-l border-border flex flex-col h-full overflow-hidden fixed top-0 right-0 z-[60]", className)}
    >
      {bodyState !== BODY_STATES.SPLIT_VIEW && (
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
          dispatch({ type: 'SET_IS_RESIZING_RIGHT_PANE', payload: true });
        }}
      >
        <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200 mx-auto" />
      </div>
      {header && (
        <div className="flex items-center justify-between p-4 border-b border-border h-20 flex-shrink-0 pl-6">
          {header}
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {children}
      </div>
    </aside>
  )
})
RightPane.displayName = "RightPane"
````

## File: src/components/layout/AppShell.tsx
````typescript
import React, { useRef, type ReactElement } from 'react'
import { cn } from '@/lib/utils'
import { CommandPalette } from '@/components/global/CommandPalette';
import { useAppStore } from '@/store/appStore';
import { useAppShell } from '@/context/AppShellContext';
import { SIDEBAR_STATES } from '@/lib/utils'
import { useResizableSidebar, useResizableRightPane } from '@/hooks/useResizablePanes.hook'
import { useSidebarAnimations, useBodyStateAnimations } from '@/hooks/useAppShellAnimations.hook'

interface AppShellProps {
  sidebar: ReactElement;
  topBar: ReactElement;
  mainContent: ReactElement;
  rightPane: ReactElement;
  commandPalette?: ReactElement;
}


export function AppShell({ sidebar, topBar, mainContent, rightPane, commandPalette }: AppShellProps) {
  const {
    sidebarState,
    dispatch,
    autoExpandSidebar,
    toggleSidebar,
    peekSidebar,
  } = useAppShell();
  
  const { isDarkMode, toggleDarkMode } = useAppStore();
  const appRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const rightPaneRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const topBarContainerRef = useRef<HTMLDivElement>(null)
  const mainAreaRef = useRef<HTMLDivElement>(null)

  // Custom hooks for logic
  useResizableSidebar(sidebarRef, resizeHandleRef);
  useResizableRightPane();
  useSidebarAnimations(sidebarRef, resizeHandleRef);
  useBodyStateAnimations(appRef, mainContentRef, rightPaneRef, topBarContainerRef, mainAreaRef);
  
  const sidebarWithProps = React.cloneElement(sidebar, { 
    ref: sidebarRef,
    onMouseEnter: () => {
      if (autoExpandSidebar && sidebarState === SIDEBAR_STATES.COLLAPSED) {
        peekSidebar()
      }
    },
    onMouseLeave: () => {
      if (autoExpandSidebar && sidebarState === SIDEBAR_STATES.PEEK) {
        dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.COLLAPSED });
      }
    }
  });

  const topBarWithProps = React.cloneElement(topBar, {
    onToggleSidebar: toggleSidebar,
  });

  const mainContentWithProps = React.cloneElement(mainContent, {
    ref: mainContentRef,

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
              dispatch({ type: 'SET_IS_RESIZING', payload: true });
            }}
          >
            <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200 mx-auto" />
          </div>
        )}

        {/* Main Content Area */}
        <div ref={mainAreaRef} className="relative flex-1 overflow-hidden bg-background">
          <div ref={topBarContainerRef} className="absolute inset-x-0 top-0 z-30">
            {topBarWithProps}
          </div>
          
          {/* Main Content */}
          {mainContentWithProps}
        </div>
      </div>
      {rightPaneWithProps}
      {commandPalette || <CommandPalette />}
    </div>
  )
}
````

## File: vite.config.ts
````typescript
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
````

## File: src/context/AppShellContext.tsx
````typescript
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
  type ReactElement,
  type Dispatch,
} from 'react';
import { SIDEBAR_STATES, BODY_STATES, type SidebarState, type BodyState } from '@/lib/utils';

// --- State and Action Types ---

export interface AppShellState {
  sidebarState: SidebarState;
  bodyState: BodyState;
  sidePaneContent: 'details' | 'settings' | 'main' | 'toaster' | 'notifications';
  sidebarWidth: number;
  sidePaneWidth: number;
  splitPaneWidth: number;
  isResizing: boolean;
  isResizingRightPane: boolean;
  isTopBarVisible: boolean;
  autoExpandSidebar: boolean;
  reducedMotion: boolean;
  compactMode: boolean;
  primaryColor: string;
  appName?: string;
  appLogo?: ReactElement;
}

type AppShellAction =
  | { type: 'SET_SIDEBAR_STATE'; payload: SidebarState }
  | { type: 'SET_BODY_STATE'; payload: BodyState }
  | { type: 'SET_SIDE_PANE_CONTENT'; payload: AppShellState['sidePaneContent'] }
  | { type: 'SET_SIDEBAR_WIDTH'; payload: number }
  | { type: 'SET_SIDE_PANE_WIDTH'; payload: number }
  | { type: 'SET_SPLIT_PANE_WIDTH'; payload: number }
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
  sidePaneWidth: typeof window !== 'undefined' ? Math.max(300, Math.round(window.innerWidth * 0.6)) : 400,
  splitPaneWidth: typeof window !== 'undefined' ? Math.max(300, Math.round(window.innerWidth * 0.35)) : 400,
  isResizing: false,
  isResizingRightPane: false,
  isTopBarVisible: true,
  autoExpandSidebar: true,
  reducedMotion: false,
  compactMode: false,
  primaryColor: '220 84% 60%',
  appName: 'Jeli App',
  appLogo: undefined,
};

function appShellReducer(state: AppShellState, action: AppShellAction): AppShellState {
  switch (action.type) {
    case 'SET_SIDEBAR_STATE': return { ...state, sidebarState: action.payload };
    case 'SET_BODY_STATE': return { ...state, bodyState: action.payload };
    case 'SET_SIDE_PANE_CONTENT': return { ...state, sidePaneContent: action.payload };
    case 'SET_SIDEBAR_WIDTH': return { ...state, sidebarWidth: Math.max(200, Math.min(500, action.payload)) };
    case 'SET_SIDE_PANE_WIDTH': return { ...state, sidePaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, action.payload)) };
    case 'SET_SPLIT_PANE_WIDTH': return { ...state, splitPaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, action.payload)) };
    case 'SET_IS_RESIZING': return { ...state, isResizing: action.payload };
    case 'SET_IS_RESIZING_RIGHT_PANE': return { ...state, isResizingRightPane: action.payload };
    case 'SET_TOP_BAR_VISIBLE': return { ...state, isTopBarVisible: action.payload };
    case 'SET_AUTO_EXPAND_SIDEBAR': return { ...state, autoExpandSidebar: action.payload };
    case 'SET_REDUCED_MOTION': return { ...state, reducedMotion: action.payload };
    case 'SET_COMPACT_MODE': return { ...state, compactMode: action.payload };
    case 'SET_PRIMARY_COLOR': return { ...state, primaryColor: action.payload };
    case 'RESET_TO_DEFAULTS':
      return {
        ...defaultState,
        appName: state.appName, // Preserve props passed to provider
        appLogo: state.appLogo,   // Preserve props passed to provider
      };
    default: return state;
  }
}

// --- Context and Provider ---

interface AppShellContextValue extends AppShellState {
  dispatch: Dispatch<AppShellAction>;
  rightPaneWidth: number;
  // Composite actions for convenience
  toggleSidebar: () => void;
  hideSidebar: () => void;
  showSidebar: () => void;
  peekSidebar: () => void;
  toggleFullscreen: () => void;
  toggleSplitView: (content?: AppShellState['sidePaneContent']) => void;
  openSidePane: (content: AppShellState['sidePaneContent']) => void;
  closeSidePane: () => void;
  resetToDefaults: () => void;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

interface AppShellProviderProps {
  children: ReactNode;
  appName?: string;
  appLogo?: ReactElement;
  defaultSplitPaneWidth?: number;
}

export function AppShellProvider({ children, appName, appLogo, defaultSplitPaneWidth }: AppShellProviderProps) {
  const [state, dispatch] = useReducer(appShellReducer, {
    ...defaultState,
    ...(appName && { appName }),
    ...(appLogo && { appLogo }),
    ...(defaultSplitPaneWidth && { splitPaneWidth: defaultSplitPaneWidth }),
  });

  // Side effect for primary color
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-hsl', state.primaryColor);
  }, [state.primaryColor]);

  // Memoized composite actions using useCallback for stable function identities
  const toggleSidebar = useCallback(() => {
    const current = state.sidebarState;
    if (current === SIDEBAR_STATES.HIDDEN) dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.COLLAPSED });
    else if (current === SIDEBAR_STATES.COLLAPSED) dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.EXPANDED });
    else if (current === SIDEBAR_STATES.EXPANDED) dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.COLLAPSED });
  }, [state.sidebarState]);

  const hideSidebar = useCallback(() => dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.HIDDEN }), []);
  const showSidebar = useCallback(() => dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.EXPANDED }), []);
  const peekSidebar = useCallback(() => dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.PEEK }), []);
  
  const toggleFullscreen = useCallback(() => {
    const current = state.bodyState;
    dispatch({ type: 'SET_BODY_STATE', payload: current === BODY_STATES.FULLSCREEN ? BODY_STATES.NORMAL : BODY_STATES.FULLSCREEN });
  }, [state.bodyState]);

  const toggleSplitView = useCallback((content?: AppShellState['sidePaneContent']) => {
    const current = state.bodyState;
    if (current === BODY_STATES.SIDE_PANE) {
      dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SPLIT_VIEW });
      if (state.sidebarState === SIDEBAR_STATES.EXPANDED) {
        dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.COLLAPSED });
      }
    } else if (current === BODY_STATES.SPLIT_VIEW) {
      dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SIDE_PANE });
    } else if (current === BODY_STATES.NORMAL && content) {
      // If we're in normal view, open the pane and switch to split view
      dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: content });
      dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SPLIT_VIEW });
    }
  }, [state.bodyState, state.sidebarState]);

  const openSidePane = useCallback((content: AppShellState['sidePaneContent']) => {
    if (state.bodyState === BODY_STATES.SIDE_PANE && state.sidePaneContent === content) {
      // If it's open with same content, close it.
      dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.NORMAL });
    } else {
      // If closed, or different content, open with new content.
      dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: content });
      dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SIDE_PANE });
    }
  }, [state.bodyState, state.sidePaneContent]);

  const closeSidePane = useCallback(() => dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.NORMAL }), []);
  const resetToDefaults = useCallback(() => dispatch({ type: 'RESET_TO_DEFAULTS' }), []);

  const rightPaneWidth = useMemo(() => (
    state.bodyState === BODY_STATES.SPLIT_VIEW ? state.splitPaneWidth : state.sidePaneWidth
  ), [state.bodyState, state.splitPaneWidth, state.sidePaneWidth]);

  const value = useMemo(() => ({ 
    ...state, 
    dispatch,
    rightPaneWidth,
    toggleSidebar,
    hideSidebar,
    showSidebar,
    peekSidebar,
    toggleFullscreen,
    toggleSplitView,
    openSidePane,
    closeSidePane,
    resetToDefaults,
  }), [
    state, 
    rightPaneWidth,
    toggleSidebar,
    hideSidebar,
    showSidebar,
    peekSidebar,
    toggleFullscreen,
    toggleSplitView,
    openSidePane,
    closeSidePane,
    resetToDefaults
  ]);

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
````

## File: README.md
````markdown
# Jeli App Shell

[![npm version](https://img.shields.io/npm/v/jeli-app-shell.svg?style=flat)](https://www.npmjs.com/package/jeli-app-shell)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/travis/com/your-username/jeli-app-shell.svg)](https://travis-ci.com/your-username/jeli-app-shell)

A fully-featured, animated, and customizable application shell for React, built with TypeScript, Tailwind CSS, and powered by GSAP for smooth animations. Provide a modern, desktop-grade user experience out of the box.

This library provides all the necessary components and hooks to build a complex application layout with a resizable sidebar, a dynamic main content area, a contextual side pane, and more.

[**Live Demo (Storybook) →**](https://your-demo-link.com)

 <!-- TODO: Add a real preview image -->

---

## Key Features

-   **Component-Based Architecture**: Build your shell by composing flexible and powerful React components.
-   **Resizable Sidebar**: Draggable resizing with multiple states: `Expanded`, `Collapsed`, `Hidden`, and `Peek` (on hover).
-   **Dynamic Body States**: Seamlessly switch between `Normal`, `Fullscreen`, and `Side Pane` views.
-   **Smooth Animations**: Fluid transitions powered by GSAP for a premium feel.
-   **Dark Mode Support**: First-class dark mode support, easily toggled.
-   **Customizable Theming**: Easily theme your application using CSS variables, just like shadcn/ui.
-   **State Management Included**: Simple and powerful state management via React Context and Zustand.
-   **Command Palette**: Built-in command palette for quick navigation and actions.
-   **TypeScript & Modern Tools**: Built with TypeScript, React, Vite, and Tailwind CSS for a great developer experience.

## Installation

Install the package and its peer dependencies using your preferred package manager.
```bash
npm install jeli-app-shell react react-dom tailwindcss gsap lucide-react tailwind-merge class-variance-authority clsx tailwindcss-animate
```

or

```bash
yarn add jeli-app-shell react react-dom tailwindcss gsap lucide-react tailwind-merge class-variance-authority clsx tailwindcss-animate
```

## Getting Started

Follow these steps to integrate Jeli App Shell into your project.

### 1. Configure Tailwind CSS

You need to configure Tailwind CSS to correctly process the styles from the library.

**`tailwind.config.js`**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  // ... your other config
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // Add the path to the library's components
    './node_modules/jeli-app-shell/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    // ...
  },
  plugins: [require('tailwindcss-animate')],
};
```

**`index.css` (or your main CSS file)**

You need to import the library's stylesheet. It contains all the necessary base styles and CSS variables for theming.

```css
/* Import Tailwind's base, components, and utilities */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Import the App Shell's stylesheet */
@import 'jeli-app-shell/dist/style.css';
```

### 2. Set Up Providers

Wrap your application's root component with `AppShellProvider` and `ToasterProvider`.

**`App.tsx`**

```tsx
import React from 'react';
import { AppShellProvider } from 'jeli-app-shell';
import { ToasterProvider } from 'jeli-app-shell'; // Re-exported for convenience
import { Rocket } from 'lucide-react';
import { YourAppComponent } from './YourAppComponent';

function App() {
  const myLogo = (
    <div className="p-2 bg-primary/20 rounded-lg">
      <Rocket className="w-5 h-5 text-primary" />
    </div>
  );

  return (
    <AppShellProvider appName="My Awesome App" appLogo={myLogo}>
      <ToasterProvider>
        <YourAppComponent />
      </ToasterProvider>
    </AppShellProvider>
  );
}

export default App;
```

### 3. Compose Your Shell

The `<AppShell>` component is the heart of the library. You compose your layout by passing the `sidebar`, `topBar`, `mainContent`, and `rightPane` components as props.

Here's a complete example:

**`YourAppComponent.tsx`**

```tsx
import {
  // Main Layout
  AppShell,
  MainContent,
  RightPane,
  TopBar,

  // Sidebar Primitives
  Sidebar,
  SidebarBody,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarIcon,
  SidebarLabel,

  // Hooks & Context
  useAppShell,
} from 'jeli-app-shell';
import { Home, Settings, PanelRight } from 'lucide-react';

// 1. Build your custom sidebar
const MySidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <SidebarTitle>My App</SidebarTitle>
        </SidebarHeader>
        <SidebarBody>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <SidebarIcon><Home /></SidebarIcon>
              <SidebarLabel>Dashboard</SidebarLabel>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <SidebarIcon><Settings /></SidebarIcon>
              <SidebarLabel>Settings</SidebarLabel>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarBody>
      </SidebarContent>
    </Sidebar>
  );
};

// 2. Build your custom top bar content
const MyTopBarContent = () => {
  const { openSidePane } = useAppShell();
  return (
    <button onClick={() => openSidePane('details')} title="Open Details">
      <PanelRight />
    </button>
  );
};

// 3. Build your main content
const MyMainContent = () => {
  return (
    <div>
      <h1>Welcome to your Dashboard!</h1>
      <p>This is the main content area.</p>
    </div>
  );
};

// 4. Build your right pane
const MyRightPane = () => {
  return (
    <div>
      <h3>Details Panel</h3>
      <p>Contextual information goes here.</p>
    </div>
  );
};

// 5. Assemble the App Shell
export function YourAppComponent() {
  return (
    <AppShell
      sidebar={<MySidebar />}
      topBar={<TopBar><MyTopBarContent /></TopBar>}
      mainContent={<MainContent><MyMainContent /></MainContent>}
      rightPane={<RightPane>{<MyRightPane />}</RightPane>}
    />
  );
}
```

## Component API

### Layout Components

-   `<AppShellProvider>`: Wraps your app and provides the context for all hooks and components.
-   `<AppShell>`: The main container that orchestrates the layout. Requires `sidebar`, `topBar`, `mainContent`, and `rightPane` props.
-   `<TopBar>`: The header component. It's a container for your own controls and branding.
-   `<MainContent>`: The primary content area of your application.
-   `<RightPane>`: A panel that slides in from the right, perfect for details, forms, or secondary information.

### Sidebar Primitives

The sidebar is built using a set of highly composable components.

-   `<Sidebar>`: The root sidebar component.
-   `<SidebarContent>`: Wrapper for all sidebar content.
-   `<SidebarHeader>`, `<SidebarBody>`, `<SidebarFooter>`: Structural components to organize sidebar content.
-   `<SidebarTitle>`: The title of your app, automatically hidden when the sidebar is collapsed.
-   `<SidebarSection>`: A component to group menu items with an optional title.
-   `<SidebarMenuItem>`: A wrapper for a single menu item, including the button and potential actions.
-   `<SidebarMenuButton>`: The main clickable button for a menu item.
-   `<SidebarIcon>`, `<SidebarLabel>`, `<SidebarBadge>`, `<SidebarTooltip>`: Atomic parts of a menu item.

### Ready-to-use Components

-   `<UserDropdown>`: A pre-styled user profile dropdown menu.
-   `<WorkspaceSwitcher>`: A complete workspace/tenant switcher component.
-   `<PageHeader>`: A standardized header for your main content pages.
-   `<LoginPage>`: A beautiful, animated login page component.
-   `<CommandPalette>`: A powerful command palette for your application.

### UI Primitives

The library also exports a set of UI components (Button, Card, Badge, etc.) based on shadcn/ui. You can import them directly from `jeli-app-shell`.

## Hooks

-   `useAppShell()`: The primary hook to control the shell's state.
    -   `sidebarState`: Current state of the sidebar (`expanded`, `collapsed`, etc.).
    -   `bodyState`: Current body state (`normal`, `fullscreen`, `side_pane`).
    -   `toggleSidebar()`: Toggles the sidebar between expanded and collapsed.
    -   `openSidePane(content: string)`: Opens the right-hand pane.
    -   `closeSidePane()`: Closes the right-hand pane.
    -   `toggleFullscreen()`: Toggles fullscreen mode.
    -   `dispatch`: For more granular state control.
-   `useToast()`: A hook to display toast notifications.
    -   `show({ title, message, variant, ... })`

## Theming

Customizing the look and feel is straightforward. The library uses CSS variables for colors, border radius, etc., which you can override in your global CSS file.

**`index.css`**

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 262.1 83.3% 57.8%; /* New primary color: Violet */
    --primary-foreground: 210 40% 98%;
    --radius: 0.75rem; /* New border radius */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 262.1 83.3% 57.8%;
    --primary-foreground: 210 40% 98%;
  }
}
```

## Contributing

Contributions are welcome! Please read our [contributing guidelines](./CONTRIBUTING.md) to get started.

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.
````

## File: src/App.tsx
````typescript
import React, { useEffect } from 'react'
import { AppShell } from './components/layout/AppShell'
import { AppShellProvider, useAppShell } from './context/AppShellContext'
import { useAppStore } from './store/appStore'
import { useAuthStore } from './store/authStore'
import './index.css'

// Import library components
import { EnhancedSidebar } from './components/layout/EnhancedSidebar'
import { MainContent } from './components/layout/MainContent'
import { RightPane } from './components/layout/RightPane'
import { TopBar } from './components/layout/TopBar'
import { CommandPalette } from './components/global/CommandPalette'

// Import page/content components
import { DashboardContent } from './pages/Dashboard'
import { SettingsPage } from './pages/Settings'
import { ToasterDemo } from './pages/ToasterDemo'
import { NotificationsPage } from './pages/Notifications'
import { ContentInSidePanePlaceholder } from './components/shared/ContentInSidePanePlaceholder'
import { SettingsContent } from './features/settings/SettingsContent'
import { LoginPage } from './components/auth/LoginPage'

// Import icons
import { LayoutDashboard, Settings, Component, Bell, SlidersHorizontal, ChevronsLeftRight, Search, Filter, Plus, PanelRight, ChevronRight, Rocket, Layers, SplitSquareHorizontal } from 'lucide-react'
import { BODY_STATES } from './lib/utils'
import { cn } from './lib/utils'


// The content for the main area, with page routing logic
function AppContent() {
  const { activePage, setActivePage } = useAppStore()
  const { bodyState, sidePaneContent, openSidePane } = useAppShell()

  const pageMap = {
    dashboard: {
      component: <DashboardContent />,
      sidePaneContent: 'main',
      icon: LayoutDashboard,
      name: 'dashboard',
    },
    settings: {
      component: <SettingsPage />,
      sidePaneContent: 'settings',
      icon: Settings,
      name: 'settings',
    },
    toaster: {
      component: <ToasterDemo />,
      sidePaneContent: 'toaster',
      icon: Component,
      name: 'toaster demo',
    },
    notifications: {
      component: <NotificationsPage />,
      sidePaneContent: 'notifications',
      icon: Bell,
      name: 'notifications',
    },
  } as const;

  const currentPage = pageMap[activePage];

  if (sidePaneContent === currentPage.sidePaneContent && bodyState === BODY_STATES.SIDE_PANE) {
    return (
      <ContentInSidePanePlaceholder 
        icon={currentPage.icon}
        title={`${currentPage.name.charAt(0).toUpperCase() + currentPage.name.slice(1)} is in Side Pane`}
        pageName={currentPage.name}
        onBringBack={() => {
          openSidePane(currentPage.sidePaneContent);
          setActivePage(activePage);
        }}
      />
    )
  }

  return currentPage.component;
}

// Content for the Top Bar
function AppTopBar() {
  const { activePage, searchTerm, setSearchTerm } = useAppStore()
  const { openSidePane } = useAppShell()
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  return (
    <div className="flex items-center gap-3 flex-1">
      <div className={cn("hidden md:flex items-center gap-2 text-sm transition-opacity", {
          "opacity-0 pointer-events-none": isSearchFocused && activePage === 'dashboard'
      })}>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Home</a>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-foreground capitalize">{activePage}</span>
      </div>
      
      <div className="flex-1" />

      {/* Page-specific: Dashboard search and actions */}
      {activePage === 'dashboard' && (
      <div className="flex items-center gap-2 flex-1 justify-end">
        <div className={cn("relative transition-all duration-300 ease-in-out", isSearchFocused ? 'flex-1 max-w-lg' : 'w-auto')}>
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
              isSearchFocused ? 'bg-background' : 'w-48'
            )}
          />
        </div>
         <button className="h-10 w-10 flex-shrink-0 flex items-center justify-center hover:bg-accent rounded-full transition-colors">
          <Filter className="w-5 h-5" />
        </button>
         <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 h-10 flex-shrink-0">
          <Plus className="w-5 h-5" />
          <span className={cn(isSearchFocused ? 'hidden sm:inline' : 'inline')}>New Project</span>
        </button>
      </div>
      )}
    </div>
  )
}

// The main App component that composes the shell
function ComposedApp() {
  const { sidePaneContent, closeSidePane, bodyState, toggleSplitView } = useAppShell();
  const { setActivePage } = useAppStore();

  const contentMap = {
    main: { title: 'Dashboard', icon: LayoutDashboard, page: 'dashboard', content: <DashboardContent isInSidePane /> },
    settings: { title: 'Settings', icon: Settings, page: 'settings', content: <SettingsContent /> },
    toaster: { title: 'Toaster Demo', icon: Component, page: 'toaster', content: <ToasterDemo isInSidePane /> },
    notifications: { title: 'Notifications', icon: Bell, page: 'notifications', content: <NotificationsPage isInSidePane /> },
    details: { title: 'Details Panel', icon: SlidersHorizontal, content: <p className="text-muted-foreground">This is the side pane. It can be used to display contextual information, forms, or actions related to the main content.</p> }
  } as const;

  const currentContent = contentMap[sidePaneContent as keyof typeof contentMap] || contentMap.details;
  const CurrentIcon = currentContent.icon;

  const handleMaximize = () => {
    if ('page' in currentContent && currentContent.page) {
      setActivePage(currentContent.page as any);
    }
    closeSidePane()
  }

  const rightPaneHeader = (
      <>
      <div className="flex items-center gap-2">
        <CurrentIcon className="w-5 h-5" />
        <h2 className="text-lg font-semibold whitespace-nowrap">
          {currentContent.title}
        </h2>
      </div>
      <div className="flex items-center">
        {(bodyState === BODY_STATES.SIDE_PANE || bodyState === BODY_STATES.SPLIT_VIEW) && (
          <button
            onClick={toggleSplitView}
            className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors"
            title={bodyState === BODY_STATES.SIDE_PANE ? 'Switch to Split View' : 'Switch to Overlay View'}
          >
            {bodyState === BODY_STATES.SPLIT_VIEW ? (
              <Layers className="w-5 h-5" />
            ) : (
              <SplitSquareHorizontal className="w-5 h-5" />
            )}
          </button>
        )}
        {'page' in currentContent && currentContent.page && (
          <button
            onClick={handleMaximize}
            className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors mr-2"
            title="Move to Main View"
          >
            <ChevronsLeftRight className="w-5 h-5" />
          </button>
        )}
      </div>
      </>
  );

  return (
    <AppShell
      sidebar={<EnhancedSidebar />}
      topBar={<TopBar><AppTopBar /></TopBar>}
      mainContent={<MainContent><AppContent /></MainContent>}
      rightPane={(
        <RightPane header={rightPaneHeader}>{currentContent.content}</RightPane>
      )}
      commandPalette={<CommandPalette />}
    />
  );
}

function App() {
  const isDarkMode = useAppStore((state) => state.isDarkMode)
  const { isAuthenticated, login, forgotPassword } = useAuthStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password)
    } catch (error) {
      console.error('Login failed:', error)
      // In a real app, you'd show an error message to the user
    }
  }

  const handleForgotPassword = async (email: string) => {
    try {
      await forgotPassword(email)
    } catch (error) {
      console.error('Forgot password failed:', error)
    }
  }

  const handleSignUp = () => {
    // In a real app, navigate to sign up page
    console.log('Navigate to sign up page')
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onForgotPassword={handleForgotPassword}
        onSignUp={handleSignUp}
      />
    )
  }

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
  )
}

export default App
````

## File: src/store/appStore.ts
````typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ActivePage = 'dashboard' | 'settings' | 'toaster' | 'notifications';

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
````

## File: package.json
````json
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
  "dependencies": {},
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
    "gsap": "^3.12.2",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
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
  }
}
````
