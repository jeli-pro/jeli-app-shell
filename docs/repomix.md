# Directory Structure
```
src/
  components/
    auth/
      LoginPage.tsx
    ui/
      avatar.tsx
      badge.tsx
      card.tsx
  context/
    AppShellContext.tsx
  features/
    settings/
      SettingsContent.tsx
  hooks/
    usePageContent.hook.tsx
  lib/
    utils.ts
  pages/
    Dashboard/
      index.tsx
    DataDemo/
      components/
        AnimatedLoadingSkeleton.tsx
        DataCardView.tsx
        DataDetailPanel.tsx
        DataListView.tsx
        DataTableView.tsx
      hooks/
        useDataManagement.hook.tsx
      index.tsx
      types.ts
    Notifications/
      index.tsx
    Settings/
      index.tsx
    ToasterDemo/
      index.tsx
  App.tsx
index.html
package.json
postcss.config.js
tailwind.config.js
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: src/hooks/usePageContent.hook.tsx
```typescript
import React, { useEffect, useMemo, useCallback } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useAppShell } from "@/context/AppShellContext";
import type { AppShellState } from "@/context/AppShellContext";
import { BODY_STATES } from "@/lib/utils";

// Import page/content components
import { DashboardContent } from "@/pages/Dashboard";
import { ToasterDemo } from "@/pages/ToasterDemo";
import { NotificationsPage } from "@/pages/Notifications";
import { DataDetailPanel } from "@/pages/DataDemo/components/DataDetailPanel";
import { mockDataItems } from "@/pages/DataDemo/data/mockData";
import DataDemoPage from "@/pages/DataDemo";
import { SettingsContent } from "@/features/settings/SettingsContent";

// Import icons
import {
  LayoutDashboard,
  Settings,
  Component,
  Bell,
  SlidersHorizontal,
  ChevronsLeftRight,
  Layers,
  SplitSquareHorizontal,
  Database,
} from "lucide-react";

export function usePageContent() {
  const { bodyState, dispatch } = useAppShell();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { itemId } = useParams<{ itemId: string }>();

  // Effect to sync app shell state (bodyState, sidePaneContent) with URL
  useEffect(() => {
    const pane = searchParams.get('sidePane');
    const view = searchParams.get('view');
    const right = searchParams.get('right');
    const validPanes: AppShellState['sidePaneContent'][] = ['details', 'settings', 'main', 'toaster', 'notifications', 'dataDemo'];

    if (itemId) {
      dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: 'dataItem' });
      if (view === 'split') {
        dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SPLIT_VIEW });
      } else {
        dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SIDE_PANE });
      }
    } else if (pane && validPanes.includes(pane as AppShellState['sidePaneContent'])) {
      dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: pane as AppShellState['sidePaneContent'] });
      dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SIDE_PANE });
    } else if (view === 'split' && right && validPanes.includes(right as AppShellState['sidePaneContent'])) {
      dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: right as AppShellState['sidePaneContent'] });
      dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SPLIT_VIEW });
    } else {
      dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.NORMAL });
      dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: 'details' });
    }
  }, [itemId, searchParams, dispatch]);

  const contentMap = useMemo(() => ({
    main: {
      title: "Dashboard",
      icon: LayoutDashboard,
      page: "dashboard",
      content: <DashboardContent isInSidePane />,
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
      content: <ToasterDemo isInSidePane />,
    },
    notifications: {
      title: "Notifications",
      icon: Bell,
      page: "notifications",
      content: <NotificationsPage isInSidePane />,
    },
    dataDemo: {
      title: "Data Showcase",
      icon: Database,
      page: "data-demo",
      content: <DataDemoPage />,
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
  }), []);

  const selectedItem = useMemo(() => {
    if (!itemId) return null
    return mockDataItems.find(item => item.id === itemId) ?? null
  }, [itemId]);

  const sidePaneIdentifier = itemId
    ? 'dataItem'
    : searchParams.get('sidePane') || searchParams.get('right') || 'details';

  const { currentContent, rightPaneContent } = useMemo(() => {
    if (sidePaneIdentifier === 'dataItem') {
      return {
        currentContent: { title: "Item Details", icon: Database, page: `data-demo/${itemId}` },
        rightPaneContent: <DataDetailPanel item={selectedItem} onClose={() => navigate('/data-demo')} />,
      };
    }
    const mappedContent = contentMap[sidePaneIdentifier as keyof typeof contentMap] || contentMap.details;
    return {
      currentContent: mappedContent,
      rightPaneContent: mappedContent.content,
    };
  }, [sidePaneIdentifier, selectedItem, navigate, contentMap, itemId]);

  const CurrentIcon = currentContent.icon;

  const handleMaximize = useCallback(() => {
    if ("page" in currentContent && currentContent.page) {
      navigate(`/${currentContent.page}`, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [currentContent, navigate, setSearchParams]);

  const handleCloseSidePane = useCallback(() => {
    if (itemId) {
      navigate('/data-demo');
    } else {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.delete('sidePane');
        newParams.delete('right');
        newParams.delete('view');
        return newParams;
      }, { replace: true });
    }
  }, [setSearchParams, itemId, navigate]);

  const handleToggleSplitView = useCallback(() => {
    if (bodyState === BODY_STATES.SIDE_PANE) {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        const currentPane = newParams.get('sidePane');
        if (currentPane) {
          newParams.set('view', 'split');
          newParams.set('right', currentPane);
          newParams.delete('sidePane');
        }
        return newParams;
      }, { replace: true });
    } else if (bodyState === BODY_STATES.SPLIT_VIEW) {
      setSearchParams(prev => {
        return { sidePane: prev.get('right') || 'details' }
      }, { replace: true });
    }
  }, [bodyState, setSearchParams]);

  const rightPaneHeader = useMemo(() => (
    bodyState !== BODY_STATES.SPLIT_VIEW ? (
      <>
        <div className="flex items-center gap-2">
          <CurrentIcon className="w-5 h-5" />
          <h2 className="text-lg font-semibold whitespace-nowrap">
            {currentContent.title}
          </h2>
        </div>
        <div className="flex items-center">
          {(bodyState === BODY_STATES.SIDE_PANE ||
            bodyState === BODY_STATES.SPLIT_VIEW) && (
            <button
              onClick={handleToggleSplitView}
              className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors"
              title={
                bodyState === BODY_STATES.SIDE_PANE
                  ? "Switch to Split View"
                  : "Switch to Overlay View"
              }
            >
              {bodyState === BODY_STATES.SPLIT_VIEW ? (
                <Layers className="w-5 h-5" />
              ) : (
                <SplitSquareHorizontal className="w-5 h-5" />
              )}
            </button>
          )}
          {"page" in currentContent && currentContent.page && (
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
    ) : undefined
  ), [bodyState, currentContent, CurrentIcon, handleToggleSplitView, handleMaximize]);

  return {
    rightPaneContent,
    rightPaneHeader,
    handleCloseSidePane
  };
}
```

## File: src/components/ui/avatar.tsx
```typescript
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
```

## File: src/components/ui/card.tsx
```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border bg-card text-card-foreground",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
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

## File: src/components/ui/badge.tsx
```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
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
import { useAppShell } from '@/context/AppShellContext'
import { useAppStore } from '@/store/appStore'
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
  const shell = useAppShell()
  const dispatch = shell.dispatch
  const { isDarkMode, toggleDarkMode } = useAppStore()

  const [tempSidebarWidth, setTempSidebarWidth] = useState(shell.sidebarWidth)

  const handleSidebarWidthChange = (width: number) => {
    setTempSidebarWidth(width)
    dispatch({ type: 'SET_SIDEBAR_WIDTH', payload: width });
  }

  const handleReset = () => {
    shell.resetToDefaults();
    setTempSidebarWidth(280); // Reset temp state as well
  }

  const setCompactMode = (payload: boolean) => dispatch({ type: 'SET_COMPACT_MODE', payload });
  const setReducedMotion = (payload: boolean) => dispatch({ type: 'SET_REDUCED_MOTION', payload });
  const setSidebarWidth = (payload: number) => {
    dispatch({ type: 'SET_SIDEBAR_WIDTH', payload });
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
          checked={shell.compactMode}
          onCheckedChange={(payload) => dispatch({ type: 'SET_COMPACT_MODE', payload })}
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
              const isActive = color.value === shell.primaryColor
              return (
                <button
                  key={color.name}
                  title={color.name}
                  onClick={() => dispatch({ type: 'SET_PRIMARY_COLOR', payload: color.value })}
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
          checked={shell.autoExpandSidebar}
          onCheckedChange={(payload) => dispatch({ type: 'SET_AUTO_EXPAND_SIDEBAR', payload })}
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
          checked={shell.reducedMotion}
          onCheckedChange={(payload) => dispatch({ type: 'SET_REDUCED_MOTION', payload })}
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
              setSidebarWidth(320)
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
              setSidebarWidth(240)
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

## File: src/pages/DataDemo/components/AnimatedLoadingSkeleton.tsx
```typescript
import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ViewMode } from '../types'

interface GridConfig {
  numCards: number
  cols: number
}

export const AnimatedLoadingSkeleton = ({ viewMode }: { viewMode: ViewMode }) => {
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  const getGridConfig = (width: number): GridConfig => {
    if (width === 0) return { numCards: 8, cols: 2 }; // Default before measurement
    if (viewMode === 'list' || viewMode === 'table') {
      return { numCards: 5, cols: 1 }
    }
    // For card view
    if (viewMode === 'cards') {
      const cols = Math.max(1, Math.floor(width / 344)); // 320px card + 24px gap
      return { numCards: Math.max(8, cols * 2), cols }
    }
    // For grid view
    const cols = Math.max(1, Math.floor(width / 304)); // 280px card + 24px gap
    return { numCards: Math.max(8, cols * 2), cols }
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.kill()
    }
    if (!iconRef.current || !containerRef.current || containerWidth === 0) return

    // Allow DOM to update with new skeleton cards
    const timeoutId = setTimeout(() => {
      const cards = Array.from(containerRef.current!.children)
      if (cards.length === 0) return

      const shuffledCards = gsap.utils.shuffle(cards)

      const getCardPosition = (card: Element) => {
        const rect = card.getBoundingClientRect()
        const containerRect = containerRef.current!.getBoundingClientRect()
        const iconRect = iconRef.current!.getBoundingClientRect()

        return {
          x: rect.left - containerRect.left + rect.width / 2 - iconRect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2 - iconRect.height / 2,
        }
      }
      
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.5,
        defaults: { duration: 1, ease: 'power2.inOut' }
      });
      timelineRef.current = tl

      // Animate to a few random cards
      shuffledCards.slice(0, 5).forEach(card => {
        const pos = getCardPosition(card)
        tl.to(iconRef.current, { 
          x: pos.x,
          y: pos.y,
          scale: 1.2,
          duration: 0.8
        }).to(iconRef.current, {
          scale: 1,
          duration: 0.2
        })
      });

      // Loop back to the start
      const firstPos = getCardPosition(shuffledCards[0]);
      tl.to(iconRef.current, { x: firstPos.x, y: firstPos.y, duration: 0.8 });
    }, 100) // Small delay to ensure layout is calculated

    return () => {
      clearTimeout(timeoutId)
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }

  }, [containerWidth, viewMode])

  const config = getGridConfig(containerWidth)

  const renderSkeletonCard = (key: number) => {
    if (viewMode === 'list' || viewMode === 'table') {
      return (
        <div key={key} className="bg-card/30 border border-border/30 rounded-2xl p-6 flex items-start gap-4 animate-pulse">
          <div className="w-14 h-14 bg-muted rounded-xl flex-shrink-0"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-5/6"></div>
            <div className="flex gap-2 pt-2">
              <div className="h-6 bg-muted rounded-full w-20"></div>
              <div className="h-6 bg-muted rounded-full w-20"></div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div 
        key={key} 
        className={cn(
          "bg-card/30 border border-border/30 rounded-3xl p-6 space-y-4 animate-pulse",
        )}
      >
        <div className="flex items-start justify-between">
          <div className="w-16 h-16 bg-muted rounded-2xl"></div>
          <div className="w-4 h-4 bg-muted rounded-full"></div>
        </div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-3 bg-muted rounded w-full"></div>
        <div className="h-3 bg-muted rounded w-5/6"></div>
        <div className="h-2 w-full bg-muted rounded-full my-4"></div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-muted rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-2 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      </div>
    )
  }

  const gridClasses = {
    list: "space-y-4",
    table: "space-y-4",
    cards: "grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6",
    grid: "grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6"
  }

  return (
    <div className="relative overflow-hidden rounded-lg min-h-[500px]">
      <div 
        ref={iconRef}
        className="absolute z-10 p-3 bg-primary/20 rounded-full backdrop-blur-sm"
        style={{ willChange: 'transform' }}
      >
        <Search className="w-6 h-6 text-primary" />
      </div>

      <div 
        ref={containerRef}
        className={cn(gridClasses[viewMode])}
      >
        {[...Array(config.numCards)].map((_, i) => renderSkeletonCard(i))}
      </div>
    </div>
  )
}
```

## File: src/pages/DataDemo/hooks/useDataManagement.hook.tsx
```typescript
import { useState, useRef, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { capitalize, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { mockDataItems } from '../data/mockData';
import type { DataItem, ViewMode, SortConfig, SortableField, GroupableField, Status, Priority } from '../types';
import type { FilterConfig } from '../components/DataToolbar';

export function useDataManagement() {
	const [searchParams, setSearchParams] = useSearchParams();

	// Derive state from URL search params
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

	// Centralized handler for updating URL search params
	const handleParamsChange = useCallback(
		(newParams: Record<string, string | string[] | null | undefined>) => {
			setSearchParams(
				(prev) => {
					const updated = new URLSearchParams(prev);
					let pageReset = false;

					for (const [key, value] of Object.entries(newParams)) {
						const isFilterOrSort = ['q', 'status', 'priority', 'sort', 'groupBy'].includes(key);

						if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || value === '') {
							updated.delete(key);
						} else if (Array.isArray(value)) {
							updated.set(key, value.join(','));
						} else {
							updated.set(key, String(value));
						}

						if (isFilterOrSort) {
							pageReset = true;
						}
					}

					if (pageReset) {
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

	const [items, setItems] = useState<DataItem[]>([]);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const observer = useRef<IntersectionObserver>();

	// Centralized data filtering and sorting from the master list
	const filteredAndSortedData = useMemo(() => {
		const filteredItems = mockDataItems.filter((item) => {
			const searchTermMatch =
				item.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
				item.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

			const statusMatch = filters.status.length === 0 || filters.status.includes(item.status);
			const priorityMatch = filters.priority.length === 0 || filters.priority.includes(item.priority);

			return searchTermMatch && statusMatch && priorityMatch;
		});

		if (sortConfig) {
			filteredItems.sort((a, b) => {
				const getNestedValue = (obj: DataItem, path: string): unknown => 
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					path.split('.').reduce((o: any, k) => (o || {})[k], obj);
				
				const aValue = getNestedValue(a, sortConfig.key);
				const bValue = getNestedValue(b, sortConfig.key);

				if (aValue === undefined || bValue === undefined) return 0;

				if (typeof aValue === 'string' && typeof bValue === 'string') {
					return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
				}
				if (typeof aValue === 'number' && typeof bValue === 'number') {
					return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
				}
				// Date sorting (assuming ISO strings)
				if (sortConfig.key === 'updatedAt' || sortConfig.key === 'createdAt') {
					return sortConfig.direction === 'asc'
						? new Date(aValue).getTime() - new Date(bValue).getTime()
						: new Date(bValue).getTime() - new Date(aValue).getTime();
				}
				return 0;
			});
		}

		return filteredItems;
	}, [filters, sortConfig]);

	// Data loading effect
	useEffect(() => {
		setIsLoading(true);
		const isFirstPage = page === 1;

		const loadData = () => {
			if (groupBy !== 'none') {
				// For grouped views, load all data at once, pagination is disabled.
				setItems(filteredAndSortedData);
				setHasMore(false);
				setIsLoading(false);
				return;
			}

			// Handle paginated view
			const pageSize = 12;
			const newItems = filteredAndSortedData.slice((page - 1) * pageSize, page * pageSize);

			setTimeout(() => {
				// Double-check in case groupBy changed during the timeout
				if (groupBy === 'none') {
					setItems((prev) => (isFirstPage ? newItems : [...prev, ...newItems]));
					setHasMore(filteredAndSortedData.length > page * pageSize);
					setIsLoading(false);
				}
			}, isFirstPage && items.length === 0 ? 1500 : 500); // Longer delay for initial skeleton
		};

		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams, filteredAndSortedData]); // Reacts to any URL change

	const loaderRef = useCallback(
		(node: Element | null) => {
			if (isLoading) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					// Instead of setting local state, we update the URL, which triggers the data loading effect.
					handleParamsChange({ page: (page + 1).toString() });
				}
			});
			if (node) observer.current.observe(node);
		},
		[isLoading, hasMore, page, handleParamsChange],
	);

	const groupTabs = useMemo(() => {
		if (groupBy === 'none' || !filteredAndSortedData.length) return [];

		const groupCounts = filteredAndSortedData.reduce((acc, item) => {
			const groupKey = String(item[groupBy as GroupableField]);
			acc[groupKey] = (acc[groupKey] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const sortedGroups = Object.keys(groupCounts).sort((a, b) => a.localeCompare(b));

		const createLabel = (text: string, count: number, isActive: boolean): ReactNode => (
			<>
				{text}
				<Badge
					variant={isActive ? 'default' : 'secondary'}
					className={cn(
						'transition-colors duration-300 text-xs font-semibold',
						!isActive && 'group-hover:bg-accent group-hover:text-accent-foreground',
					)}
				>
					{count}
				</Badge>
			</>
		);

		return [
			{ id: 'all', label: createLabel('All', filteredAndSortedData.length, activeGroupTab === 'all') },
			...sortedGroups.map((g) => ({
				id: g,
				label: createLabel(capitalize(g), groupCounts[g], activeGroupTab === g),
			})),
		];
	}, [filteredAndSortedData, groupBy, activeGroupTab]);

	// Data to be rendered in the current view, after grouping and tab selection is applied
	const dataToRender = useMemo(() => {
		if (groupBy === 'none') {
			return items; // This is the paginated list.
		}

		// When grouped, `items` contains ALL filtered/sorted data.
		if (activeGroupTab === 'all') {
			return items;
		}
		return items.filter((item) => String(item[groupBy as GroupableField]) === activeGroupTab);
	}, [items, groupBy, activeGroupTab]);

	const totalItemCount = filteredAndSortedData.length;
	const isInitialLoading = isLoading && items.length === 0;

  const setViewMode = (mode: ViewMode) => handleParamsChange({ view: mode });
  const setGroupBy = (val: string) => handleParamsChange({ groupBy: val === 'none' ? null : val });
  const setActiveGroupTab = (tab: string) => handleParamsChange({ tab: tab === 'all' ? null : tab });
  const setFilters = (newFilters: FilterConfig) => {
    handleParamsChange({ q: newFilters.searchTerm, status: newFilters.status, priority: newFilters.priority });
  }
  const setSort = (config: SortConfig | null) => {
    if (!config) {
      handleParamsChange({ sort: 'default' });
    } else {
      handleParamsChange({ sort: `${config.key}-${config.direction}` });
    }
  }
  const setTableSort = (field: SortableField) => {
    if (sortConfig?.key === field) {
      if (sortConfig.direction === 'desc') {
        // Cycle: desc -> asc
        handleParamsChange({ sort: `${field}-asc` });
      } else {
        // Cycle: asc -> default (by removing param)
        handleParamsChange({ sort: 'default' });
      }
    } else {
      // New field, default to desc
      handleParamsChange({ sort: `${field}-desc` });
    }
  }

	return {
		viewMode,
		groupBy,
		activeGroupTab,
		filters,
		sortConfig,
		hasMore,
		isLoading,
		loaderRef,
		groupTabs,
		dataToRender,
		totalItemCount,
		isInitialLoading,
    setViewMode,
    setGroupBy,
    setActiveGroupTab,
    setFilters,
    setSort,
    setTableSort
	};
}
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
  ],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## File: src/lib/utils.ts
```typescript
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

export function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500/20 text-green-700 border-green-500/30'
    case 'pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
    case 'completed': return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
    case 'archived': return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
    default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
  }
}

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-500/20 text-red-700 border-red-500/30'
    case 'high': return 'bg-orange-500/20 text-orange-700 border-orange-500/30'
    case 'medium': return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
    case 'low': return 'bg-green-500/20 text-green-700 border-green-500/30'
    default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
  }
}
```

## File: src/pages/DataDemo/types.ts
```typescript
export type ViewMode = 'list' | 'cards' | 'grid' | 'table'

export type GroupableField = 'status' | 'priority' | 'category'

export type SortableField = 'title' | 'status' | 'priority' | 'updatedAt' | 'assignee.name' | 'metrics.views' | 'metrics.completion' | 'createdAt'
export type SortDirection = 'asc' | 'desc'
export interface SortConfig {
  key: SortableField
  direction: SortDirection
}

export interface DataItem {
  id: string
  title: string
  description: string
  category: string
  status: 'active' | 'pending' | 'completed' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee: {
    name: string
    avatar: string
    email: string
  }
  metrics: {
    views: number
    likes: number
    shares: number
    completion: number
  }
  tags: string[]
  createdAt: string
  updatedAt: string
  dueDate?: string
  thumbnail?: string
  content?: {
    summary: string
    details: string
    attachments?: Array<{
      name: string
      type: string
      size: string
      url: string
    }>
  }
}

export interface ViewProps {
  data: DataItem[] | Record<string, DataItem[]>
  onItemSelect: (item: DataItem) => void
  selectedItem: DataItem | null
  isGrid?: boolean

  // Props for table view specifically
  sortConfig?: SortConfig | null
  onSort?: (field: SortableField) => void
}

export type Status = DataItem['status']
export type Priority = DataItem['priority']
```

## File: src/pages/Settings/index.tsx
```typescript
import { SettingsContent } from '@/features/settings/SettingsContent';
import { useAutoAnimateTopBar } from '@/hooks/useAutoAnimateTopBar';
import { PageHeader } from '@/components/shared/PageHeader';
import { PageLayout } from '@/components/shared/PageLayout';

export function SettingsPage() {
  const { onScroll } = useAutoAnimateTopBar();

  return (
    <PageLayout onScroll={onScroll}>
      {/* Header */}
      <PageHeader
        title="Settings"
        description="Customize your experience. Changes are saved automatically."
      />
      <SettingsContent />
    </PageLayout>
  )
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

## File: tsconfig.node.json
```json
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
```

## File: src/components/auth/LoginPage.tsx
```typescript
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Eye, EyeOff, Mail, ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { AnimatedInput } from '../effects/AnimatedInput';
import { BoxReveal } from '../effects/BoxReveal';
import { Ripple } from '../effects/Ripple';
import { TechOrbitDisplay } from '../effects/OrbitingCircles';
import { BottomGradient } from '../effects/BottomGradient';

// ==================== AnimatedForm Components ====================

// ==================== Main LoginPage Component ====================
interface LoginPageProps {
	onLogin?: (email: string, password: string) => void;
	onForgotPassword?: (email: string) => void;
	onSignUp?: () => void;
}

type LoginState = 'login' | 'forgot-password' | 'reset-sent';

export function LoginPage({ onLogin, onForgotPassword }: LoginPageProps) {
	const [state, setState] = useState<LoginState>('login');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
	const [showPassword, setShowPassword] = useState(false);

	const handleLoginSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setErrors({});
		const newErrors: typeof errors = {};
		if (!email) newErrors.email = 'Email is required';
		if (!password) newErrors.password = 'Password is required';
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		setIsLoading(true);
		await onLogin?.(email, password);
		setIsLoading(false);
	};

	const handleForgotSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setErrors({});
		if (!email) {
			setErrors({ email: 'Email is required' });
			return;
		}
		setIsLoading(true);
		await onForgotPassword?.(email);
		setIsLoading(false);
		setState('reset-sent');
	};

	const renderContent = () => {
		if (state === 'reset-sent') {
			return (
				<div className="w-full max-w-md mx-auto text-center flex flex-col gap-4">
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.5}>
						<div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
							<Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
						</div>
					</BoxReveal>
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.5}>
						<h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
					</BoxReveal>
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.5}>
						<p className="text-muted-foreground">We've sent a password reset link to <strong>{email}</strong></p>
					</BoxReveal>
					<BoxReveal width="100%" boxColor="hsl(var(--skeleton))" duration={0.5}>
						<button onClick={() => setState('login')} className="text-sm text-blue-500 hover:underline">
							<div className="flex items-center justify-center gap-2">
								<ArrowLeft className="w-4 h-4" /> Back to login
							</div>
						</button>
					</BoxReveal>
				</div>
			);
		}

		const isLogin = state === 'login';
		const formFields = isLogin
			? [
				{ label: 'Email', required: true, type: 'email', placeholder: 'Enter your email address', onChange: (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) },
				{ label: 'Password', required: true, type: 'password', placeholder: 'Enter your password', onChange: (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value) },
			]
			: [{ label: 'Email', required: true, type: 'email', placeholder: 'Enter your email address', onChange: (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) }];

		return (
			<div className="w-full max-w-md mx-auto flex flex-col gap-4">
				<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3}>
					<h2 className="font-bold text-3xl text-neutral-800 dark:text-neutral-200">{isLogin ? 'Welcome back' : 'Reset Password'}</h2>
				</BoxReveal>
				<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3} className="pb-2">
					<p className="text-neutral-600 text-sm max-w-sm dark:text-neutral-300">{isLogin ? 'Sign in to your account to continue' : 'Enter your email to receive a reset link'}</p>
				</BoxReveal>
				{isLogin && (
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3} width="100%" className="overflow-visible">
						<button className="g-button group/btn bg-transparent w-full rounded-md border h-10 font-medium outline-hidden hover:cursor-pointer" type="button">
							<span className="flex items-center justify-center w-full h-full gap-3">
								<img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" width={26} height={26} alt="Google Icon" />
								Sign in with Google
							</span>
							<BottomGradient />
						</button>
					</BoxReveal>
				)}
				{isLogin && (
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3} width="100%">
						<div className="flex items-center gap-4">
							<hr className="flex-1 border-1 border-dashed border-neutral-300 dark:border-neutral-700" />
							<p className="text-neutral-700 text-sm dark:text-neutral-300">or</p>
							<hr className="flex-1 border-1 border-dashed border-neutral-300 dark:border-neutral-700" />
						</div>
					</BoxReveal>
				)}
				<form onSubmit={isLogin ? handleLoginSubmit : handleForgotSubmit}>
					{formFields.map((field) => (
						<div key={field.label} className="flex flex-col gap-2 mb-4">
							<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3}>
								<Label htmlFor={field.label}>{field.label} <span className="text-red-500">*</span></Label>
							</BoxReveal>
							<BoxReveal width="100%" boxColor="hsl(var(--skeleton))" duration={0.3} className="flex flex-col space-y-2 w-full">
								<div className="relative">
									<AnimatedInput type={field.type === 'password' ? (showPassword ? 'text' : 'password') : field.type} id={field.label} placeholder={field.placeholder} onChange={field.onChange} />
									{field.type === 'password' && (
										<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
											{showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
										</button>
									)}
								</div>
								<div className="h-4">{errors[field.label as keyof typeof errors] && <p className="text-red-500 text-xs">{errors[field.label as keyof typeof errors]}</p>}</div>
							</BoxReveal>
						</div>
					))}

					<BoxReveal width="100%" boxColor="hsl(var(--skeleton))" duration={0.3} className="overflow-visible">
						<button
							className="bg-gradient-to-br relative group/btn from-zinc-200 dark:from-zinc-900 dark:to-zinc-900 to-zinc-200 block dark:bg-zinc-800 w-full text-black dark:text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] outline-hidden hover:cursor-pointer disabled:opacity-50"
							type="submit" disabled={isLoading}
						>
							{isLoading ? (
								<div className="flex items-center justify-center gap-2">
									<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
									<span>Processing...</span>
								</div>
							) : (
								<>{isLogin ? 'Sign in' : 'Send reset link'} &rarr;</>
							)}
							<BottomGradient />
						</button>
					</BoxReveal>
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3}>
						<div className="mt-4 text-center">
							<button type="button" className="text-sm text-blue-500 hover:underline" onClick={() => setState(isLogin ? 'forgot-password' : 'login')}>
								{isLogin ? 'Forgot password?' : 'Back to login'}
							</button>
						</div>
					</BoxReveal>
				</form>
			</div>
		);
	};

	return (
		<section className="flex max-lg:justify-center min-h-screen w-full login-page-theme bg-background text-foreground">
			{/* Left Side */}
			<div className="flex flex-col justify-center w-1/2 max-lg:hidden relative">
				<Ripple />
				<TechOrbitDisplay />
			</div>

			{/* Right Side */}
			<div className="w-1/2 h-screen flex flex-col justify-center items-center max-lg:w-full max-lg:px-[10%]">
				{renderContent()}
			</div>
		</section>
	);
}
```

## File: src/pages/DataDemo/components/DataListView.tsx
```typescript
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import type { ViewProps } from '../types'
import { useIncrementalStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import { EmptyState } from './EmptyState'
import {
  AssigneeInfo,
  ItemMetrics,
  ItemProgressBar,
  ItemStatusBadge,
  ItemPriorityBadge,
  ItemDateInfo,
} from './shared/DataItemParts'

export function DataListView({ data, onItemSelect, selectedItem }: ViewProps) {
  const listRef = useRef<HTMLDivElement>(null)
  useIncrementalStaggeredAnimation(listRef, [data], { scale: 1, y: 30, stagger: 0.08, duration: 0.5 });

  if (data.length === 0) {
    return <EmptyState />
  }

  return (
    <div ref={listRef} className="space-y-4">
      {data.map((item) => {
        const isSelected = selectedItem?.id === item.id
        
        return (
          <div
            key={item.id}
            onClick={() => onItemSelect(item)}
            className={cn(
              "group relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm transition-all duration-300 cursor-pointer",
              "hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20",
              "active:scale-[0.99]",
              isSelected && "ring-2 ring-primary/20 border-primary/30 bg-card/90"
            )}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center text-2xl">
                    {item.thumbnail}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 ml-4 flex-shrink-0" />
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-4">
                    <ItemStatusBadge status={item.status} />
                    <ItemPriorityBadge priority={item.priority} />
                    <Badge variant="outline" className="bg-accent/50">
                      {item.category}
                    </Badge>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center justify-between text-muted-foreground">
                    <div className="flex items-center gap-4">
                      {/* Assignee */}
                      <AssigneeInfo assignee={item.assignee} avatarClassName="w-7 h-7" />
                      {/* Date */}
                      <ItemDateInfo date={item.updatedAt} />
                    </div>

                    {/* Metrics */}
                    <ItemMetrics metrics={item.metrics} />
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4"><ItemProgressBar completion={item.metrics.completion} /></div>
                </div>
              </div>
            </div>

            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        )
      })}
    </div>
  )
}
```

## File: src/pages/ToasterDemo/index.tsx
```typescript
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { PageHeader } from '@/components/shared/PageHeader';
import { PageLayout } from '@/components/shared/PageLayout';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'success' | 'error' | 'warning';
type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

const variantColors = {
  default: 'border-border text-foreground hover:bg-muted/10 dark:hover:bg-muted/20',
  success: 'border-green-600 text-green-600 hover:bg-green-600/10 dark:hover:bg-green-400/20',
  error: 'border-destructive text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20',
  warning: 'border-amber-600 text-amber-600 hover:bg-amber-600/10 dark:hover:bg-amber-400/20',
}

const DemoSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section>
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    {children}
  </section>
);

export function ToasterDemo({ isInSidePane = false }: { isInSidePane?: boolean }) {
  const toast = useToast();

  const showToast = (variant: Variant, position: Position = 'bottom-right') => {
    toast.show({
      title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Notification`,
      message: `This is a ${variant} toast notification.`,
      variant,
      position,
      duration: 3000,
      onDismiss: () =>
        console.log(`${variant} toast at ${position} dismissed`),
    });
  };

  const simulateApiCall = async () => {
    toast.show({
      title: 'Scheduling...',
      message: 'Please wait while we schedule your meeting.',
      variant: 'default',
      position: 'bottom-right',
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.show({
        title: 'Meeting Scheduled',
        message: 'Your meeting is scheduled for July 4, 2025, at 3:42 PM IST.',
        variant: 'success',
        position: 'bottom-right',
        highlightTitle: true,
        actions: {
          label: 'Undo',
          onClick: () => console.log('Undoing meeting schedule'),
          variant: 'outline',
        },
      });
    } catch (error) {
      toast.show({
        title: 'Error Scheduling Meeting',
        message: 'Failed to schedule the meeting. Please try again.',
        variant: 'error',
        position: 'bottom-right',
      });
    }
  };

  return (
    <PageLayout isInSidePane={isInSidePane}>
      {/* Header */}
      {!isInSidePane && (
        <PageHeader
          title="Toaster"
          description="A customizable toast component for notifications."
        />
      )}
      <div className="space-y-6">
        <DemoSection title="Toast Variants">
          <div className="flex flex-wrap gap-4">
            {(['default', 'success', 'error', 'warning'] as Variant[]).map((variantKey) => (
              <Button
                key={variantKey}
                variant="outline"
                onClick={() => showToast(variantKey as Variant)}
                className={cn(variantColors[variantKey])}
              >
                {variantKey.charAt(0).toUpperCase() + variantKey.slice(1)} Toast
              </Button>
            ))}
          </div>
        </DemoSection>

        <DemoSection title="Toast Positions">
          <div className="flex flex-wrap gap-4">
            {[
              'top-left',
              'top-center',
              'top-right',
              'bottom-left',
              'bottom-center',
              'bottom-right',
            ].map((positionKey) => (
              <Button
                key={positionKey}
                variant="outline"
                onClick={() =>
                  showToast('default', positionKey as Position)
                }
                className="border-border text-foreground hover:bg-muted/10 dark:hover:bg-muted/20"
              >
                {positionKey
                  .replace('-', ' ')
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </Button>
            ))}
          </div>
        </DemoSection>

        <DemoSection title="Real-World Example">
          <Button
            variant="outline"
            onClick={simulateApiCall}
            className="border-border text-foreground hover:bg-muted/10 dark:hover:bg-muted/20"
          >
            Schedule Meeting
          </Button>
        </DemoSection>
      </div>
    </PageLayout>
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

## File: src/pages/Notifications/index.tsx
```typescript
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { useToast } from "@/components/ui/toast";
import { PageLayout } from "@/components/shared/PageLayout";
import { cn } from "@/lib/utils";
import { 
  CheckCheck, 
  Download, 
  Settings, 
  Bell,
  MessageSquare,
  UserPlus,
  Mail,
  File as FileIcon,
  Heart,
  AtSign,
  ClipboardCheck,
  ShieldCheck,
} from "lucide-react";


type Notification = {
  id: number;
  type: string;
  user: {
    name: string;
    avatar: string;
    fallback: string;
  };
  action: string;
  target?: string;
  content?: string;
  timestamp: string;
  timeAgo: string;
  isRead: boolean;
  hasActions?: boolean;
  file?: {
    name: string;
    size: string;
    type: string;
  };
};

const initialNotifications: Array<Notification> = [
  {
    id: 1,
    type: "comment",
    user: { name: "Amélie", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Amélie", fallback: "A" },
    action: "commented in",
    target: "Dashboard 2.0",
    content: "Really love this approach. I think this is the best solution for the document sync UX issue.",
    timestamp: "Friday 3:12 PM",
    timeAgo: "2 hours ago",
    isRead: false,
  },
  {
    id: 2,
    type: "follow",
    user: { name: "Sienna", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sienna", fallback: "S" },
    action: "followed you",
    timestamp: "Friday 3:04 PM",
    timeAgo: "2 hours ago",
    isRead: false,
  },
  {
    id: 3,
    type: "invitation",
    user: { name: "Ammar", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Ammar", fallback: "A" },
    action: "invited you to",
    target: "Blog design",
    timestamp: "Friday 2:22 PM",
    timeAgo: "3 hours ago",
    isRead: true,
    hasActions: true,
  },
  {
    id: 4,
    type: "file_share",
    user: { name: "Mathilde", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Mathilde", fallback: "M" },
    action: "shared a file in",
    target: "Dashboard 2.0",
    file: { name: "Prototype recording 01.mp4", size: "14 MB", type: "MP4" },
    timestamp: "Friday 1:40 PM",
    timeAgo: "4 hours ago",
    isRead: true,
  },
  {
    id: 5,
    type: "mention",
    user: { name: "James", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=James", fallback: "J" },
    action: "mentioned you in",
    target: "Project Alpha",
    content: "Hey @you, can you review the latest designs when you get a chance?",
    timestamp: "Thursday 11:30 AM",
    timeAgo: "1 day ago",
    isRead: true,
  },
  {
    id: 6,
    type: "like",
    user: { name: "Sofia", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sofia", fallback: "S" },
    action: "liked your comment in",
    target: "Team Meeting Notes",
    timestamp: "Thursday 9:15 AM",
    timeAgo: "1 day ago",
    isRead: true,
  },
  {
    id: 7,
    type: "task_assignment",
    user: { name: "Admin", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Admin", fallback: "AD" },
    action: "assigned you a new task in",
    target: "Q3 Marketing",
    content: "Finalize the social media campaign assets.",
    timestamp: "Wednesday 5:00 PM",
    timeAgo: "2 days ago",
    isRead: true,
  },
  {
    id: 8,
    type: "system_update",
    user: { name: "System", avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=System", fallback: "SYS" },
    action: "pushed a new update",
    content: "Version 2.1.0 is now live with improved performance and new features. Check out the release notes for more details.",
    timestamp: "Wednesday 9:00 AM",
    timeAgo: "2 days ago",
    isRead: true,
  },
  {
    id: 9,
    type: 'comment',
    user: { name: 'Elena', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Elena', fallback: 'E' },
    action: 'replied to your comment in',
    target: 'Dashboard 2.0',
    content: 'Thanks for the feedback! I\'ve updated the prototype.',
    timestamp: 'Tuesday 4:30 PM',
    timeAgo: '3 days ago',
    isRead: false,
  },
  {
    id: 10,
    type: 'invitation',
    user: { name: 'Carlos', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Carlos', fallback: 'C' },
    action: 'invited you to',
    target: 'API Integration',
    timestamp: 'Tuesday 10:00 AM',
    timeAgo: '3 days ago',
    isRead: true,
    hasActions: true,
  },
];

const iconMap: { [key: string]: React.ElementType } = {
  comment: MessageSquare,
  follow: UserPlus,
  invitation: Mail,
  file_share: FileIcon,
  mention: AtSign,
  like: Heart,
  task_assignment: ClipboardCheck,
  system_update: ShieldCheck,
};

function NotificationItem({ notification, onMarkAsRead }: { notification: Notification; onMarkAsRead: (id: number) => void; }) {
  const Icon = iconMap[notification.type];

  return (
    <div className={cn(
      "group w-full p-4 hover:bg-accent/50 rounded-lg transition-colors duration-200"
    )}>
      <div className="flex gap-3">
        <div className="relative h-10 w-10 shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={notification.user.avatar} alt={`${notification.user.name}'s profile picture`} />
            <AvatarFallback>{notification.user.fallback}</AvatarFallback>
          </Avatar>
          {Icon && (
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-background">
              <Icon className={cn("h-3 w-3", notification.type === 'like' ? 'text-red-500 fill-current' : 'text-muted-foreground')} />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col space-y-2">
          <div className="flex items-start justify-between">
            <div className="text-sm">
              <span className="font-semibold">{notification.user.name}</span>
              <span className="text-muted-foreground"> {notification.action} </span>
              {notification.target && <span className="font-semibold">{notification.target}</span>}
              <div className="mt-0.5 text-xs text-muted-foreground">{notification.timeAgo}</div>
            </div>
            <button
              onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
              title={notification.isRead ? "Read" : "Mark as read"}
              className={cn("size-2.5 rounded-full mt-1 shrink-0 transition-all duration-300",
                notification.isRead ? 'bg-transparent' : 'bg-primary hover:scale-125 cursor-pointer'
              )}
            ></button>
          </div>

          {notification.content && <div className="rounded-lg border bg-muted/50 p-3 text-sm">{notification.content}</div>}

          {notification.file && (
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2 border border-border">
              <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-background rounded-md border border-border">
                <FileIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{notification.file.name}</div>
                <div className="text-xs text-muted-foreground">{notification.file.type} • {notification.file.size}</div>
              </div>
              <Button variant="ghost" size="icon" className="size-8 shrink-0">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          )}

          {notification.hasActions && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Decline</Button>
              <Button size="sm">Accept</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function NotificationsPage({ isInSidePane = false }: { isInSidePane?: boolean; }) {
  const [notifications, setNotifications] = React.useState<Notification[]>(initialNotifications);
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const { show: showToast } = useToast();

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    if (unreadCount === 0) {
      showToast({
        title: "Already up to date!",
        message: "You have no unread notifications.",
        variant: "default",
      });
      return;
    }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast({
        title: "All Caught Up!",
        message: "All notifications have been marked as read.",
        variant: "success",
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const verifiedNotifications = notifications.filter((n) => n.type === "follow" || n.type === "like");
  const mentionNotifications = notifications.filter((n) => n.type === "mention");

  const verifiedCount = verifiedNotifications.filter(n => !n.isRead).length;
  const mentionCount = mentionNotifications.filter(n => !n.isRead).length;

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case "verified": return verifiedNotifications;
      case "mentions": return mentionNotifications;
      default: return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();

  const content = (
    <Card className={cn("flex w-full flex-col shadow-none", isInSidePane ? "border-none" : "")}>
      <CardHeader className={cn(isInSidePane ? "p-4" : "p-6")}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Your notifications
          </h3>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-8" onClick={handleMarkAllAsRead} title="Mark all as read">
              <CheckCheck className="size-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8">
              <Settings className="size-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-col justify-start mt-4">
          <TabsList className="gap-1.5">
            <TabsTrigger value="all" className="gap-1.5">
              View all {unreadCount > 0 && <Badge variant="secondary" className="rounded-full">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="verified" className="gap-1.5">
              Verified {verifiedCount > 0 && <Badge variant="secondary" className="rounded-full">{verifiedCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="mentions" className="gap-1.5">
              Mentions {mentionCount > 0 && <Badge variant="secondary" className="rounded-full">{mentionCount}</Badge>}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className={cn("h-full p-0", isInSidePane ? "px-2" : "px-6")}>
        <div className="space-y-2 divide-y divide-border">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2.5 py-12 text-center">
              <div className="rounded-full bg-muted p-4">
                <Bell className="text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No notifications yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <PageLayout isInSidePane={isInSidePane}>
      {!isInSidePane && (
        <PageHeader
          title="Notifications"
          description="Manage your notifications and stay up-to-date."
        />
      )}
      {content}
    </PageLayout>
  );
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

## File: src/pages/DataDemo/components/DataCardView.tsx
```typescript
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight } from 'lucide-react'
import type { ViewProps } from '../types'
import { useIncrementalStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import { EmptyState } from './EmptyState'
import {
  AssigneeInfo,
  ItemMetrics,
  ItemProgressBar,
  ItemStatusBadge,
  ItemTags,
  ItemDateInfo,
} from './shared/DataItemParts'

export function DataCardView({ data, onItemSelect, selectedItem, isGrid = false }: ViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useIncrementalStaggeredAnimation(containerRef, [data], { y: 40 });

  if (data.length === 0) {
    return <EmptyState />
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "gap-6",
        isGrid
          ? "grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))]"
          : "grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))]"
      )}
    >
      {data.map((item) => {
        const isSelected = selectedItem?.id === item.id
        
        return (
          <div
            key={item.id}
            onClick={() => onItemSelect(item)}
            className={cn(
              "group relative overflow-hidden rounded-3xl border bg-card/50 backdrop-blur-sm transition-all duration-500 cursor-pointer",
              "hover:bg-card/80 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-2",
              "active:scale-[0.98]",
              isSelected && "ring-2 ring-primary/30 border-primary/40 bg-card/90 shadow-lg shadow-primary/20",
            )}
          >
            {/* Card Header with Thumbnail */}
            <div className="relative p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                  {item.thumbnail}
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </div>

              {/* Priority indicator */}
              <div className="absolute top-4 right-4">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  item.priority === 'critical' && "bg-red-500",
                  item.priority === 'high' && "bg-orange-500",
                  item.priority === 'medium' && "bg-blue-500",
                  item.priority === 'low' && "bg-green-500"
                )} />
              </div>
            </div>

            {/* Card Content */}
            <div className="px-6 pb-6">
              {/* Title and Description */}
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {item.description}
              </p>

              {/* Status and Category */}
              <div className="flex items-center gap-2 mb-4">
                <ItemStatusBadge status={item.status} />
                <Badge variant="outline" className="bg-accent/50 text-xs">
                  {item.category}
                </Badge>
              </div>

              {/* Tags */}
              <div className="mb-4"><ItemTags tags={item.tags} /></div>

              {/* Progress */}
              <div className="mb-4"><ItemProgressBar completion={item.metrics.completion} /></div>

              {/* Assignee */}
              <div className="mb-4"><AssigneeInfo assignee={item.assignee} /></div>

              {/* Metrics */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <ItemMetrics metrics={item.metrics} />
                <ItemDateInfo date={item.updatedAt} />
              </div>
            </div>

            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 pointer-events-none" />
            )}
          </div>
        )
      })}
    </div>
  )
}
```

## File: src/pages/DataDemo/components/DataDetailPanel.tsx
```typescript
import React, { useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  Heart, 
  Share, 
  Download,
  FileText,
  Image,
  Video,
  File,
  Tag,
  User,
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Circle
} from 'lucide-react'
import type { DataItem } from '../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import {
  AssigneeInfo,
  ItemMetrics,
  ItemProgressBar,
  ItemStatusBadge,
  ItemPriorityBadge,
  ItemTags,
} from './shared/DataItemParts'
import { DataDetailActions } from './DataDetailActions'
interface DataDetailPanelProps {
  item: DataItem | null
  onClose: () => void
}

export function DataDetailPanel({ item, onClose }: DataDetailPanelProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  useStaggeredAnimation(contentRef, [item]);

  if (!item) {
    return null
  }

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return FileText
      case 'image':
      case 'png':
      case 'jpg':
      case 'jpeg': return Image
      case 'video':
      case 'mp4': return Video
      default: return File
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle
      case 'active': return Circle
      case 'pending': return AlertCircle
      default: return Circle
    }
  }

  return (
    <div ref={contentRef} className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm">
        <Button variant="ghost" onClick={onClose} className="mb-4 -ml-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to list
        </Button>
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
            {item.thumbnail}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold mb-2 leading-tight">
              {item.title}
            </h1>
            <p className="text-muted-foreground">
              {item.description}
            </p>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline">
            {React.createElement(getStatusIcon(item.status), { className: "w-3 h-3 mr-1" })}
            {item.status}
          </Badge>
          <ItemPriorityBadge priority={item.priority} />
          <Badge variant="outline" className="bg-accent/50">
            {item.category}
          </Badge>
        </div>

        {/* Progress */}
        <ItemProgressBar completion={item.metrics.completion} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Assignee Info */}
          <div className="bg-card/30 rounded-2xl p-4 border border-border/30">
            <div className="flex items-center gap-1 mb-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Assigned to</h3>
            </div>
            <AssigneeInfo assignee={item.assignee} avatarClassName="w-12 h-12" />
          </div>

          {/* Metrics */}
          <div className="bg-card/30 rounded-2xl p-4 border border-border/30">
            <div className="flex items-center gap-1 mb-3">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Engagement Metrics</h3>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{item.metrics.views + item.metrics.likes + item.metrics.shares}</p>
                <p className="text-xs text-muted-foreground">Shares</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-card/30 rounded-2xl p-4 border border-border/30">
            <div className="flex items-center gap-1 mb-3">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Tags</h3>
            </div>
            <ItemTags tags={item.tags} />
          </div>

          {/* Content Details */}
          {item.content && (
            <div className="bg-card/30 rounded-2xl p-4 border border-border/30">
              <h3 className="font-semibold text-sm mb-3">Project Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.content.summary}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.content.details}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Attachments */}
          {item.content?.attachments && item.content.attachments.length > 0 && (
            <div className="bg-card/30 rounded-2xl p-4 border border-border/30">
              <h3 className="font-semibold text-sm mb-3">Attachments</h3>
              <div className="space-y-2">
                {item.content.attachments.map((attachment, index) => {
                  const IconComponent = getFileIcon(attachment.type)
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                    >
                      <IconComponent className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {attachment.type} • {attachment.size}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-card/30 rounded-2xl p-4 border border-border/30">
            <div className="flex items-center gap-1 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Timeline</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">Last updated:</span>
                <span className="font-medium">
                  {new Date(item.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {item.dueDate && (
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-3 h-3 text-orange-500" />
                  <span className="text-muted-foreground">Due date:</span>
                  <span className="font-medium text-orange-600">
                    {new Date(item.dueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-border/50 bg-card/30">
        <DataDetailActions />
      </div>
    </div>
  )
}
```

## File: src/pages/DataDemo/components/DataTableView.tsx
```typescript
import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  ExternalLink
} from 'lucide-react'
import type { ViewProps, DataItem, SortableField } from '../types'
import { EmptyState } from './EmptyState'
import { capitalize } from '@/lib/utils'
import {
  AssigneeInfo,
  ItemMetrics,
  ItemStatusBadge,
  ItemPriorityBadge,
  ItemDateInfo,
} from './shared/DataItemParts'

export function DataTableView({ data, onItemSelect, selectedItem, sortConfig, onSort }: ViewProps) {
  const tableRef = useRef<HTMLTableElement>(null)
  const animatedItemsCount = useRef(0)

  useLayoutEffect(() => {
    if (tableRef.current) {
      // Only select item rows for animation, not group headers
      const newItems = Array.from( 
        tableRef.current.querySelectorAll('tbody tr')
      ).filter(tr => !tr.dataset.groupHeader)
       .slice(animatedItemsCount.current);
      gsap.fromTo(newItems,
        { y: 20, opacity: 0 },
        {
          duration: 0.5,
          y: 0,
          opacity: 1,
          stagger: 0.05,
          ease: "power2.out",
        },
      );
      animatedItemsCount.current = Array.isArray(data) 
        ? data.length 
        : Object.values(data).reduce((sum, items) => sum + items.length, 0);
    }
  }, [data]);

  const SortIcon = ({ field }: { field: SortableField }) => {
    if (sortConfig?.key !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp className="w-4 h-4 text-primary" />
    }
    if (sortConfig.direction === 'desc') {
      return <ArrowDown className="w-4 h-4 text-primary" />
    }
    return <ArrowUpDown className="w-4 h-4 opacity-50" />
  }

  const handleSortClick = (field: SortableField) => {
    onSort?.(field)
  }

  if ((Array.isArray(data) && data.length === 0) || (!Array.isArray(data) && Object.keys(data).length === 0)) {
    return <EmptyState />
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table ref={tableRef} className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20">
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSortClick('title')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Project
                  <SortIcon field="title" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSortClick('status')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Status
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSortClick('priority')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Priority
                  <SortIcon field="priority" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSortClick('assignee.name')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Assignee
                  <SortIcon field="assignee.name" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSortClick('metrics.completion')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Progress
                  <SortIcon field="metrics.completion" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSortClick('metrics.views')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Engagement
                  <SortIcon field="metrics.views" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">Last Updated</th>
              <th className="text-center p-4 font-semibold text-sm w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data)
              ? data.map(item => <TableRow key={item.id} item={item} isSelected={selectedItem?.id === item.id} onItemSelect={onItemSelect} />)
              : Object.entries(data).flatMap(([groupName, items]) => [
                  <tr key={groupName} data-group-header="true" className="sticky top-0 z-10">
                    <td colSpan={8} className="p-2 bg-muted/50 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{capitalize(groupName)}</h3>
                        <span className="text-xs px-2 py-0.5 bg-background rounded-full font-medium">{items.length}</span>
                      </div>
                    </td>
                  </tr>,
                  ...items.map(item => <TableRow key={item.id} item={item} isSelected={selectedItem?.id === item.id} onItemSelect={onItemSelect} />)
                ])
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TableRow({ item, isSelected, onItemSelect }: { item: DataItem; isSelected: boolean; onItemSelect: (item: DataItem) => void }) {
  return (
    <tr
      onClick={() => onItemSelect(item)}
      className={cn(
        "group border-b border-border/30 transition-all duration-200 cursor-pointer",
        "hover:bg-accent/20 hover:border-primary/20",
        isSelected && "bg-primary/5 border-primary/30"
      )}
    >
      {/* Project Column */}
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
            {item.thumbnail}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium group-hover:text-primary transition-colors truncate">
              {item.title}
            </h4>
            <p className="text-sm text-muted-foreground truncate">
              {item.category}
            </p>
          </div>
        </div>
      </td>

      {/* Status Column */}
      <td className="p-4">
        <ItemStatusBadge status={item.status} />
      </td>

      {/* Priority Column */}
      <td className="p-4">
        <ItemPriorityBadge priority={item.priority} />
      </td>

      {/* Assignee Column */}
      <td className="p-4">
        <AssigneeInfo assignee={item.assignee} />
      </td>

      {/* Progress Column */}
      {/* Note: This progress bar is custom for the table, so we don't use the shared component here. */}
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
                style={{ width: `${item.metrics.completion}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {item.metrics.completion}%
          </span>
        </div>
      </td>

      {/* Engagement Column */}
      <td className="p-4">
        <ItemMetrics metrics={item.metrics} />
      </td>

      {/* Date Column */}
      <td className="p-4">
        <ItemDateInfo date={item.updatedAt} />
      </td>

      {/* Actions Column */}
      <td className="p-4">
        <button 
          onClick={(e) => {
            e.stopPropagation()
            onItemSelect(item)
          }}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-accent transition-colors"
          title="View details"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </td>
    </tr>
  )
}
```

## File: src/pages/Dashboard/index.tsx
```typescript
import { useRef } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Calendar,
  Clock,
  MessageSquare,
  FileText,
  Star,
  ChevronRight,
  MoreVertical,
  ArrowDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DemoContent } from './DemoContent';
import { useDashboardAnimations } from './hooks/useDashboardAnimations.motion.hook'
import { useDashboardScroll } from './hooks/useDashboardScroll.hook'
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { PageLayout } from '@/components/shared/PageLayout';

interface StatsCard {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ReactNode
}

interface ActivityItem {
  id: string
  type: 'comment' | 'file' | 'meeting' | 'task'
  title: string
  description: string
  time: string
  user: string
}

const statsCards: StatsCard[] = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: <DollarSign className="w-5 h-5" />
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+180.1%",
    trend: "up",
    icon: <Users className="w-5 h-5" />
  },
  {
    title: "Conversion Rate",
    value: "12.5%",
    change: "+19%",
    trend: "up",
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    title: "Performance",
    value: "573ms",
    change: "-5.3%",
    trend: "down",
    icon: <Activity className="w-5 h-5" />
  }
]

const recentActivity: ActivityItem[] = [
  {
    id: "1",
    type: "comment",
    title: "New comment on Project Alpha",
    description: "Sarah Johnson added a comment to the design review",
    time: "2 minutes ago",
    user: "SJ"
  },
  {
    id: "2",
    type: "file",
    title: "Document uploaded",
    description: "quarterly-report.pdf was uploaded to Documents",
    time: "15 minutes ago",
    user: "MD"
  },
  {
    id: "3",
    type: "meeting",
    title: "Meeting scheduled",
    description: "Weekly standup meeting scheduled for tomorrow 9 AM",
    time: "1 hour ago",
    user: "RW"
  },
  {
    id: "4",
    type: "task",
    title: "Task completed",
    description: "UI wireframes for mobile app completed",
    time: "2 hours ago",
    user: "AL"
  }
]

interface DashboardContentProps {
  isInSidePane?: boolean;
}

export function DashboardContent({ isInSidePane = false }: DashboardContentProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null);
    const statsCardsContainerRef = useRef<HTMLDivElement>(null);
    const featureCardsContainerRef = useRef<HTMLDivElement>(null);
    const { showScrollToBottom, handleScroll, scrollToBottom } = useDashboardScroll(scrollRef, isInSidePane);

    useDashboardAnimations(contentRef, statsCardsContainerRef, featureCardsContainerRef);

    const getTypeIcon = (type: ActivityItem['type']) => {
      switch (type) {
        case 'comment':
          return <MessageSquare className="w-4 h-4" />
        case 'file':
          return <FileText className="w-4 h-4" />
        case 'meeting':
          return <Calendar className="w-4 h-4" />
        case 'task':
          return <Star className="w-4 h-4" />
        default:
          return <Activity className="w-4 h-4" />
      }
    }

    return (
      <PageLayout scrollRef={scrollRef} onScroll={handleScroll} ref={contentRef} isInSidePane={isInSidePane}>
        {/* Header */}
        {!isInSidePane && (
          <PageHeader
            title="Dashboard"
            description="Welcome to the Jeli App Shell demo! Explore all the features and customization options."
          />
        )}
          {/* Stats Cards */}
        <div ref={statsCardsContainerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Demo Content */}
        <DemoContent ref={featureCardsContainerRef} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Analytics Chart */}
          <Card className="p-6 border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Analytics Overview</h3>
              <button className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-full transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            {/* Mock Chart */}
            <div className="h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-xl flex items-center justify-center border border-border/50">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Chart visualization would go here</p>
              </div>
            </div>
          </Card>

          {/* Recent Projects */}
          <Card className="p-6 border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Projects</h3>
              <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "E-commerce Platform", progress: 75, team: 5, deadline: "Dec 15" },
                { name: "Mobile App Redesign", progress: 45, team: 3, deadline: "Jan 20" },
                { name: "Marketing Website", progress: 90, team: 4, deadline: "Dec 5" }
              ].map((project) => (
                <div key={project.name} className="p-4 bg-accent/30 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{project.name}</h4>
                    <span className="text-sm text-muted-foreground">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-3">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{project.team} team members</span>
                    <span>Due {project.deadline}</span>
                    </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6 border-border/50">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { icon: <FileText className="w-4 h-4" />, label: "Create Document", color: "bg-blue-500/10 text-blue-600" },
                { icon: <Calendar className="w-4 h-4" />, label: "Schedule Meeting", color: "bg-green-500/10 text-green-600" },
                { icon: <Users className="w-4 h-4" />, label: "Invite Team", color: "bg-purple-500/10 text-purple-600" },
                { icon: <BarChart3 className="w-4 h-4" />, label: "View Reports", color: "bg-orange-500/10 text-orange-600" }
              ].map((action) => (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors text-left"
                >
                  <div className={cn("p-2 rounded-full", action.color)}>
                    {action.icon}
                  </div>
                  <span className="font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 border-border/50">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-accent/30 rounded-xl transition-colors cursor-pointer">
                  <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
                    {getTypeIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{activity.time}</span>
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-medium">
                        {activity.user}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all animate-fade-in z-[51]"
          style={{ animation: 'bounce 2s infinite' }}
          title="Scroll to bottom"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      )}
      </PageLayout>
    )
}
```

## File: src/pages/DataDemo/index.tsx
```typescript
import { useRef, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Layers, 
  AlertTriangle, 
  PlayCircle, 
  TrendingUp,
  Loader2,
  ChevronsUpDown
} from 'lucide-react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { PageLayout } from '@/components/shared/PageLayout'
import { DataListView } from './components/DataListView'
import { DataCardView } from './components/DataCardView'
import { DataTableView } from './components/DataTableView'
import { DataViewModeSelector } from './components/DataViewModeSelector'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { StatCard } from '@/components/shared/StatCard'
import { AnimatedLoadingSkeleton } from './components/AnimatedLoadingSkeleton'
import { DataToolbar } from './components/DataToolbar'
import { mockDataItems } from './data/mockData'
import type { DataItem, GroupableField } from './types'
import { useDataManagement } from './hooks/useDataManagement.hook'

type Stat = {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down';
  type?: 'card';
};

type ChartStat = {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down';
  type: 'chart';
  chartData: number[];
};

type StatItem = Stat | ChartStat;

export default function DataDemoPage() {
  const {
    viewMode,
    groupBy,
    activeGroupTab,
    filters,
    sortConfig,
    hasMore,
    isLoading,
    loaderRef,
    groupTabs,
    dataToRender,
    totalItemCount,
    isInitialLoading,
    setViewMode,
    setGroupBy,
    setActiveGroupTab,
    setFilters,
    setSort,
    setTableSort,
  } = useDataManagement();

  const groupOptions: { id: GroupableField | 'none'; label: string }[] = [
    { id: 'none', label: 'None' }, { id: 'status', label: 'Status' }, { id: 'priority', label: 'Priority' }, { id: 'category', label: 'Category' }
  ]
  const contentRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { itemId } = useParams<{ itemId: string }>()

  const handleItemSelect = (item: DataItem) => {
    navigate(`/data-demo/${item.id}`)
  }

  const selectedItem = useMemo(() => {
    if (!itemId) return null
    return mockDataItems.find(item => item.id === itemId) ?? null
  }, [itemId])

  // Calculate stats from data
  const totalItems = mockDataItems.length
  const activeItems = mockDataItems.filter(item => item.status === 'active').length
  const highPriorityItems = mockDataItems.filter(item => item.priority === 'high' || item.priority === 'critical').length
  const avgCompletion = totalItems > 0 ? Math.round(
    mockDataItems.reduce((acc, item) => acc + item.metrics.completion, 0) / totalItems
  ) : 0

  const stats: StatItem[] = [
    {
      title: "Total Projects",
      value: totalItems.toString(),
      icon: <Layers className="w-5 h-5" />,
      change: "+5.2% this month",
      trend: "up" as const,
      type: 'chart',
      chartData: [120, 125, 122, 130, 135, 138, 142]
    },
    {
      title: "Active Projects",
      value: activeItems.toString(),
      icon: <PlayCircle className="w-5 h-5" />,
      change: "+2 this week", 
      trend: "up" as const,
      type: 'chart',
      chartData: [45, 50, 48, 55, 53, 60, 58]
    },
    {
      title: "High Priority",
      value: highPriorityItems.toString(),
      icon: <AlertTriangle className="w-5 h-5" />,
      change: "-1 from last week",
      trend: "down" as const,
      type: 'chart',
      chartData: [25, 26, 28, 27, 26, 24, 23]
    },
    {
      title: "Avg. Completion",
      value: `${avgCompletion}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      change: "+3.2%",
      trend: "up" as const,
      type: 'chart',
      chartData: [65, 68, 70, 69, 72, 75, 78]
    }
  ]

  useEffect(() => {
    // Animate stats cards in
    if (!isInitialLoading && statsRef.current) {
      gsap.fromTo(statsRef.current.children,
        { y: 30, opacity: 0 },
        {
          duration: 0.6,
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: "power2.out"
        }
      )
    }
  }, [isInitialLoading])

  const commonViewProps = {
    onItemSelect: handleItemSelect,
    selectedItem,
  };

  return (
    <PageLayout
      // Note: Search functionality is handled by a separate SearchBar in the TopBar
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">Data Showcase</h1>
            <p className="text-muted-foreground">
              {isInitialLoading 
                ? "Loading projects..." 
                : `Showing ${dataToRender.length} of ${totalItemCount} item(s)`}
            </p>
          </div>
          <DataViewModeSelector viewMode={viewMode} onChange={setViewMode} />
        </div>

        {/* Stats Section */}
        {!isInitialLoading && (
          <div ref={statsRef} className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
            {stats.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                trend={stat.trend}
                icon={stat.icon}
                chartData={stat.type === 'chart' ? stat.chartData : undefined}
              />
            ))}
          </div>
        )}

        {/* Controls Area */}
        <div className="space-y-6">
          <DataToolbar
            filters={filters}
            onFiltersChange={setFilters}
            sortConfig={sortConfig}
            onSortChange={setSort}
          />
        </div>

        {/* Group by and Tabs section */}
        <div className={cn(
          "flex items-center justify-between gap-4",
          groupBy !== 'none' && "border-b"
        )}>
          {/* Tabs on the left, takes up available space */}
          <div className="flex-grow overflow-x-auto overflow-y-hidden no-scrollbar">
            {groupBy !== 'none' && groupTabs.length > 1 ? (
              <AnimatedTabs
                tabs={groupTabs}
                activeTab={activeGroupTab}
                onTabChange={setActiveGroupTab}
              />
            ) : (
              <div className="h-[68px]" /> // Placeholder for consistent height.
            )}
          </div>
          
          {/* Group by dropdown on the right */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-medium text-muted-foreground shrink-0">Group by:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-between">
                  {groupOptions.find(o => o.id === groupBy)?.label}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[180px]">
                <DropdownMenuRadioGroup value={groupBy} onValueChange={setGroupBy}>
                  {groupOptions.map(option => (
                    <DropdownMenuRadioItem key={option.id} value={option.id}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div ref={contentRef} className="min-h-[500px]">
          {isInitialLoading ? <AnimatedLoadingSkeleton viewMode={viewMode} /> : (
            <div>
              {viewMode === 'table' ? (
                 <DataTableView 
                    data={dataToRender} 
                    {...commonViewProps}
                    sortConfig={sortConfig} 
                    onSort={setTableSort} 
                  />
              ) : (
                <>
                  {viewMode === 'list' && <DataListView data={dataToRender} {...commonViewProps} />}
                  {viewMode === 'cards' && <DataCardView data={dataToRender} {...commonViewProps} />}
                  {viewMode === 'grid' && <DataCardView data={dataToRender} {...commonViewProps} isGrid />}
                </>
              )}
            </div>
          )}
        </div>

        {/* Loader for infinite scroll */}
        <div ref={loaderRef} className="flex justify-center items-center py-6">
          {isLoading && !isInitialLoading && groupBy === 'none' && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more...</span>
            </div>
          )}
          {!isLoading && !hasMore && dataToRender.length > 0 && !isInitialLoading && groupBy === 'none' && (
            <p className="text-muted-foreground">You've reached the end.</p>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
```

## File: src/context/AppShellContext.tsx
```typescript
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
  sidePaneContent: 'details' | 'settings' | 'main' | 'toaster' | 'notifications' | 'dataDemo' | 'dataItem';
  sidebarWidth: number;
  sidePaneWidth: number;
  splitPaneWidth: number;
  previousBodyState: BodyState;
  fullscreenTarget: 'main' | 'right' | null;
  isResizing: boolean;
  isResizingRightPane: boolean;
  isTopBarVisible: boolean;
  autoExpandSidebar: boolean;
  reducedMotion: boolean;
  compactMode: boolean;
  primaryColor: string;
  appName?: string;
  appLogo?: ReactElement;
 draggedPage: 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo' | null;
 dragHoverTarget: 'left' | 'right' | null;
 hoveredPane: 'left' | 'right' | null;
}

type AppShellAction =
  | { type: 'SET_SIDEBAR_STATE'; payload: SidebarState }
  | { type: 'SET_BODY_STATE'; payload: BodyState }
  | { type: 'SET_SIDE_PANE_CONTENT'; payload: AppShellState['sidePaneContent'] }
  | { type: 'SET_SIDEBAR_WIDTH'; payload: number }
  | { type: 'SET_SIDE_PANE_WIDTH'; payload: number }
  | { type: 'SET_SPLIT_PANE_WIDTH'; payload: number }
  | { type: 'SET_IS_RESIZING'; payload: boolean }
  | { type: 'SET_PREVIOUS_BODY_STATE'; payload: BodyState }
  | { type: 'SET_FULLSCREEN_TARGET'; payload: 'main' | 'right' | null }
  | { type: 'SET_IS_RESIZING_RIGHT_PANE'; payload: boolean }
  | { type: 'SET_TOP_BAR_VISIBLE'; payload: boolean }
  | { type: 'SET_AUTO_EXPAND_SIDEBAR'; payload: boolean }
  | { type: 'SET_REDUCED_MOTION'; payload: boolean }
  | { type: 'SET_COMPACT_MODE'; payload: boolean }
  | { type: 'SET_PRIMARY_COLOR'; payload: string }
  | { type: 'SET_DRAGGED_PAGE'; payload: 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo' | null }
  | { type: 'SET_DRAG_HOVER_TARGET'; payload: 'left' | 'right' | null }
  | { type: 'SET_HOVERED_PANE'; payload: 'left' | 'right' | null }
  | { type: 'RESET_TO_DEFAULTS' };

// --- Reducer ---

const defaultState: AppShellState = {
  sidebarState: SIDEBAR_STATES.EXPANDED,
  bodyState: BODY_STATES.NORMAL,
  sidePaneContent: 'details',
  sidebarWidth: 280,
  sidePaneWidth: typeof window !== 'undefined' ? Math.max(300, Math.round(window.innerWidth * 0.6)) : 400,
  splitPaneWidth: typeof window !== 'undefined' ? Math.max(300, Math.round(window.innerWidth * 0.35)) : 400,
  previousBodyState: BODY_STATES.NORMAL,
  fullscreenTarget: null,
  isResizing: false,
  isResizingRightPane: false,
  isTopBarVisible: true,
  autoExpandSidebar: true,
  reducedMotion: false,
  compactMode: false,
  primaryColor: '220 84% 60%',
  appName: 'Jeli App',
  appLogo: undefined,
  draggedPage: null,
  dragHoverTarget: null,
  hoveredPane: null,
};

function appShellReducer(state: AppShellState, action: AppShellAction): AppShellState {
  switch (action.type) {
    case 'SET_SIDEBAR_STATE': return { ...state, sidebarState: action.payload };
    case 'SET_BODY_STATE':
      // If we're leaving fullscreen, reset the target and previous state
      if (state.bodyState === BODY_STATES.FULLSCREEN && action.payload !== BODY_STATES.FULLSCREEN) {
        return { ...state, bodyState: action.payload, fullscreenTarget: null, previousBodyState: BODY_STATES.NORMAL };
      }
      return { ...state, bodyState: action.payload };
    case 'SET_SIDE_PANE_CONTENT': return { ...state, sidePaneContent: action.payload };
    case 'SET_SIDEBAR_WIDTH': return { ...state, sidebarWidth: Math.max(200, Math.min(500, action.payload)) };
    case 'SET_SIDE_PANE_WIDTH': return { ...state, sidePaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, action.payload)) };
    case 'SET_SPLIT_PANE_WIDTH': return { ...state, splitPaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, action.payload)) };
    case 'SET_IS_RESIZING': return { ...state, isResizing: action.payload };
    case 'SET_PREVIOUS_BODY_STATE': return { ...state, previousBodyState: action.payload };
    case 'SET_FULLSCREEN_TARGET': return { ...state, fullscreenTarget: action.payload };
    case 'SET_IS_RESIZING_RIGHT_PANE': return { ...state, isResizingRightPane: action.payload };
    case 'SET_TOP_BAR_VISIBLE': return { ...state, isTopBarVisible: action.payload };
    case 'SET_AUTO_EXPAND_SIDEBAR': return { ...state, autoExpandSidebar: action.payload };
    case 'SET_REDUCED_MOTION': return { ...state, reducedMotion: action.payload };
    case 'SET_COMPACT_MODE': return { ...state, compactMode: action.payload };
    case 'SET_PRIMARY_COLOR': return { ...state, primaryColor: action.payload };
    case 'SET_DRAGGED_PAGE': return { ...state, draggedPage: action.payload };
    case 'SET_DRAG_HOVER_TARGET': return { ...state, dragHoverTarget: action.payload };
    case 'SET_HOVERED_PANE': return { ...state, hoveredPane: action.payload };
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
  toggleFullscreen: (target?: 'main' | 'right' | null) => void;
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
  
  const toggleFullscreen = useCallback((target: 'main' | 'right' | null = null) => {
    const current = state.bodyState;
    if (current === BODY_STATES.FULLSCREEN) {
      // Exiting fullscreen, go back to the previous state
      dispatch({ type: 'SET_BODY_STATE', payload: state.previousBodyState || BODY_STATES.NORMAL });
    } else {
      // Entering fullscreen
      dispatch({ type: 'SET_PREVIOUS_BODY_STATE', payload: current });
      dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.FULLSCREEN });
      dispatch({ type: 'SET_FULLSCREEN_TARGET', payload: target });
    }
  }, [state.bodyState, state.previousBodyState]);

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
    resetToDefaults,
  }), [
    state, 
    rightPaneWidth,
    toggleSidebar,
    hideSidebar,
    showSidebar,
    peekSidebar,
    toggleFullscreen,
    resetToDefaults
  ]);

  return (
    <AppShellContext.Provider value={value}>
      {children}
    </AppShellContext.Provider>
  );
}

// --- Hook ---

// eslint-disable-next-line react-refresh/only-export-components
export function useAppShell() {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error('useAppShell must be used within an AppShellProvider');
  }
  return context;
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
  }
}
```

## File: src/App.tsx
```typescript
import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { AppShell } from "./components/layout/AppShell";
import { AppShellProvider, useAppShell } from "./context/AppShellContext";
import { useAppStore } from "./store/appStore";
import { useAuthStore } from "./store/authStore";
import "./index.css";

// Import library components
import { EnhancedSidebar } from "./components/layout/EnhancedSidebar";
import { MainContent } from "./components/layout/MainContent";
import { RightPane } from "./components/layout/RightPane";
import { TopBar } from "./components/layout/TopBar";
import { CommandPalette } from "./components/global/CommandPalette";
import { ToasterProvider } from "./components/ui/toast";

// Import page/content components
import { DashboardContent } from "./pages/Dashboard";
import { SettingsPage } from "./pages/Settings";
import { ToasterDemo } from "./pages/ToasterDemo";
import { NotificationsPage } from "./pages/Notifications";
import DataDemoPage from "./pages/DataDemo";
import { LoginPage } from "./components/auth/LoginPage";

// Import icons
import {
  Search,
  Filter,
  Plus,
  ChevronRight,
  Rocket,
} from "lucide-react";
import { cn } from "./lib/utils";
import { usePageContent } from "./hooks/usePageContent.hook";

// Wrapper for LoginPage to provide auth handlers
function LoginPageWrapper() {
  const { login, forgotPassword } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname + location.state?.from?.search || "/";

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      // In a real app, you'd show an error message to the user
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await forgotPassword(email);
    } catch (error) {
      console.error("Forgot password failed:", error);
    }
  };

  const handleSignUp = () => {
    // In a real app, navigate to sign up page
    console.log("Navigate to sign up page");
  };

  return (
    <LoginPage
      onLogin={handleLogin}
      onForgotPassword={handleForgotPassword}
      onSignUp={handleSignUp}
    />
  );
}

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
  const isDarkMode = useAppStore((state) => state.isDarkMode);

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
  const { searchTerm, setSearchTerm } = useAppStore();
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const location = useLocation();
  const activePage = location.pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'dashboard';

  return (
    <div className="flex items-center gap-3 flex-1">
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

      <div className="flex-1" />

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
  const { rightPaneContent, rightPaneHeader, handleCloseSidePane } =
    usePageContent();

  return (
    <AppShell
      sidebar={<EnhancedSidebar />}
      onOverlayClick={handleCloseSidePane}
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
      rightPane={
        <RightPane onClose={handleCloseSidePane} header={rightPaneHeader}>
          {rightPaneContent}
        </RightPane>
      }
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
          element: <LoginPageWrapper />,
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
