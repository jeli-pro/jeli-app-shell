# Directory Structure
```
src/
  components/
    layout/
      RightPane.tsx
  context/
    AppShellContext.tsx
  features/
    settings/
      SettingsContent.tsx
  hooks/
    useStaggeredAnimation.motion.hook.ts
    useUrlStateSync.hook.ts
  lib/
    utils.ts
  pages/
    Dashboard/
      hooks/
        useDashboardAnimations.motion.hook.ts
      index.tsx
    DataDemo/
      components/
        DataCardView.tsx
        DataDetailPanel.tsx
        DataListView.tsx
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

## File: src/hooks/useUrlStateSync.hook.ts
```typescript
import { useEffect } from "react";
import {
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useAppShell } from "@/context/AppShellContext";
import type { AppShellState } from "@/context/AppShellContext";
import { BODY_STATES } from "@/lib/utils";

/**
 * A hook to synchronize the URL state (params and search query) with the AppShellContext.
 * This hook is responsible for setting the body state and side pane content based on the URL.
 * It does not return anything.
 */
export function useUrlStateSync() {
  const { dispatch } = useAppShell();
  const [searchParams] = useSearchParams();
  const { itemId } = useParams<{ itemId: string }>();

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
}
```

## File: src/hooks/useStaggeredAnimation.motion.hook.ts
```typescript
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface StaggeredAnimationOptions {
	stagger?: number;
	duration?: number;
	y?: number;
	scale?: number;
	ease?: string;
}

/**
 * Animates the direct children of a container element with a staggered fade-in effect.
 * This version is for lists that might grow (e.g., infinite scroll). It only
 * animates new elements that are added to the container.
 *
 * @param containerRef Ref to the container element.
 * @param deps Dependency array. A change here that adds items will trigger the animation on the new items.
 * @param options Animation options.
 */
export function useIncrementalStaggeredAnimation<T extends HTMLElement>(
	containerRef: React.RefObject<T>,
	deps: React.DependencyList,
	options: StaggeredAnimationOptions = {},
) {
	const animatedItemsCount = useRef(0);

	const { stagger = 0.1, duration = 0.5, y = 30, scale = 0.95, ease = 'power2.out' } = options;

	useLayoutEffect(() => {
		if (!containerRef.current) return;

		const children = Array.from(containerRef.current.children);
		// On dependency change, if the number of children is less than what we've animated,
		// it's a list reset (e.g., filtering), so reset the counter.
		if (children.length < animatedItemsCount.current) {
			animatedItemsCount.current = 0;
		}

		const newItems = children.slice(animatedItemsCount.current);

		if (newItems.length > 0) {
			gsap.fromTo(
				newItems,
				{ y, opacity: 0, scale },
				{
					duration,
					y: 0,
					opacity: 1,
					scale: 1,
					stagger,
					ease,
				},
			);
			animatedItemsCount.current = children.length;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [containerRef, ...deps]);
}

/**
 * Animates the direct children of a container element with a staggered fade-in effect.
 * This version animates all children every time the dependencies change.
 * Ideal for content that is replaced, not appended to.
 *
 * @param containerRef Ref to the container element.
 * @param deps Dependency array to trigger the animation.
 * @param options Animation options.
 */
export function useStaggeredAnimation<T extends HTMLElement>(
	containerRef: React.RefObject<T>,
	deps: React.DependencyList,
	options: StaggeredAnimationOptions = {},
) {
	const { stagger = 0.08, duration = 0.6, y = 30, scale = 1, ease = 'power3.out' } = options;

	useLayoutEffect(() => {
		if (containerRef.current?.children.length) {
			gsap.fromTo(
				containerRef.current.children,
				{ y, opacity: 0, scale },
				{
					duration,
					y: 0,
					opacity: 1,
					scale: 1,
					stagger,
					ease,
				},
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [containerRef, ...deps]);
}
```

## File: src/pages/Dashboard/hooks/useDashboardAnimations.motion.hook.ts
```typescript
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { useAppShell } from '@/context/AppShellContext';
import { BODY_STATES } from '@/lib/utils';
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook';

export function useDashboardAnimations(
  contentRef: React.RefObject<HTMLDivElement>,
  statsCardsContainerRef: React.RefObject<HTMLDivElement>,
  featureCardsContainerRef: React.RefObject<HTMLDivElement>,
) {
  const { bodyState } = useAppShell();

  // Animate cards on mount
  useStaggeredAnimation(statsCardsContainerRef, [], { y: 20, scale: 0.95 });
  useStaggeredAnimation(featureCardsContainerRef, [], { y: 30, scale: 0.95, stagger: 0.05 });

  useEffect(() => {
    if (!contentRef.current) return;

    const content = contentRef.current;

    switch (bodyState) {
      case BODY_STATES.FULLSCREEN:
        gsap.to(content, { scale: 1.02, duration: 0.4, ease: 'power3.out' });
        break;
      default:
        gsap.to(content, { scale: 1, duration: 0.4, ease: 'power3.out' });
        break;
    }
  }, [bodyState, contentRef]);
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

## File: src/pages/DataDemo/components/DataListView.tsx
```typescript
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import type { ViewProps, DataItem } from '../types'
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

  if (!Array.isArray(data) || data.length === 0) {
    return <EmptyState />
  }

  return (
    <div ref={listRef} className="space-y-4">
      {data.map((item: DataItem) => {
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
import type { ViewProps, DataItem } from '../types'
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

  if (!Array.isArray(data) || data.length === 0) {
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
      {data.map((item: DataItem) => {
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
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Clock, 
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
  ItemProgressBar,
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

## File: src/components/layout/RightPane.tsx
```typescript
import { forwardRef, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronRight, X } from 'lucide-react'
import { cn, BODY_STATES } from '@/lib/utils'
import { useAppShell } from '@/context/AppShellContext'

interface RightPaneProps {
  children?: ReactNode
  header?: ReactNode
  className?: string
  onClose?: () => void;
}

export const RightPane = forwardRef<HTMLDivElement, RightPaneProps>(({ children, header, className, onClose }, ref) => {
  const { dispatch, bodyState, fullscreenTarget, toggleFullscreen } = useAppShell();
  const [, setSearchParams] = useSearchParams()
  const isSplitView = bodyState === BODY_STATES.SPLIT_VIEW;
  const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;

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
          onClick={onClose ?? (() => {
              setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.delete('sidePane');
                newParams.delete('right');
                newParams.delete('view');
                return newParams;
              }, { replace: true });
            })
          }
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
      <div className={cn("flex-1 overflow-y-auto")}>
        {children}
      </div>
    </aside>
  )
})
RightPane.displayName = "RightPane"
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
import { Card } from '@/components/ui/card';
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
import React, { useEffect, useMemo, useCallback } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
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

// --- Page/Content Components for Pages and Panes ---
import { DashboardContent } from "./pages/Dashboard";
import { SettingsPage } from "./pages/Settings";
import { SettingsContent } from "./features/settings/SettingsContent";
import { ToasterDemo } from "./pages/ToasterDemo";
import { NotificationsPage } from "./pages/Notifications";
import DataDemoPage from "./pages/DataDemo";
import { DataDetailPanel } from "./pages/DataDemo/components/DataDetailPanel";
import { mockDataItems } from "./pages/DataDemo/data/mockData";
import { LoginPage } from "./components/auth/LoginPage";

// --- Icons ---
import {
  Search,
  Filter,
  Plus,
  ChevronRight,
  Rocket,
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

// --- Utils & Hooks ---
import { cn, BODY_STATES } from "./lib/utils";
import { useUrlStateSync } from "./hooks/useUrlStateSync.hook";

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
  // --- State from Context & Router ---
  const { bodyState, sidePaneContent } = useAppShell();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { itemId } = useParams<{ itemId: string }>();

  // --- Sync URL with App Shell State ---
  useUrlStateSync();

  // --- Content Mapping for Side/Right Panes ---
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

  // --- Derived State for Content ---
  const selectedItem = useMemo(() => {
    if (!itemId) return null
    return mockDataItems.find(item => item.id === itemId) ?? null
  }, [itemId]);

  const { currentContent, rightPaneContent } = useMemo(() => {
    if (sidePaneContent === 'dataItem' && selectedItem) {
      return {
        currentContent: { title: "Item Details", icon: Database, page: `data-demo/${itemId}` },
        rightPaneContent: <DataDetailPanel item={selectedItem} onClose={() => navigate('/data-demo')} />,
      };
    }
    const mappedContent = contentMap[sidePaneContent as keyof typeof contentMap] || contentMap.details;
    return {
      currentContent: mappedContent,
      rightPaneContent: mappedContent.content,
    };
  }, [sidePaneContent, selectedItem, navigate, contentMap, itemId]);

  const CurrentIcon = currentContent.icon;

  // --- Callbacks for Right Pane Actions ---
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

  // --- Right Pane Header UI ---
  const rightPaneHeader = useMemo(() => (
    <>
      {bodyState !== BODY_STATES.SPLIT_VIEW ? (
        <div className="flex items-center gap-2">
          <CurrentIcon className="w-5 h-5" />
          <h2 className="text-lg font-semibold whitespace-nowrap">
            {currentContent.title}
          </h2>
        </div>
      ) : <div />} {/* Placeholder to make justify-between work */}
      <div className="flex items-center">
        {(bodyState === BODY_STATES.SIDE_PANE || bodyState === BODY_STATES.SPLIT_VIEW) && (
          <button onClick={handleToggleSplitView} className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors" title={bodyState === BODY_STATES.SIDE_PANE ? "Switch to Split View" : "Switch to Overlay View"}>
            {bodyState === BODY_STATES.SPLIT_VIEW ? <Layers className="w-5 h-5" /> : <SplitSquareHorizontal className="w-5 h-5" />}
          </button>
        )}
        {bodyState !== BODY_STATES.SPLIT_VIEW && "page" in currentContent && currentContent.page && (
          <button onClick={handleMaximize} className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors mr-2" title="Move to Main View">
            <ChevronsLeftRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </>
  ), [bodyState, currentContent, CurrentIcon, handleToggleSplitView, handleMaximize]);

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
