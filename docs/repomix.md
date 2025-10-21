# Directory Structure
```
src/
  features/
    dynamic-view/
      components/
        controls/
          ViewControls.tsx
          ViewModeSelector.tsx
        shared/
          AddDataItemCta.tsx
          AnimatedLoadingSkeleton.tsx
          DetailPanel.tsx
          EmptyState.tsx
          FieldRenderer.tsx
        views/
          CalendarView.tsx
          CardView.tsx
          KanbanView.tsx
          ListView.tsx
          TableView.tsx
      DynamicView.tsx
      DynamicViewContext.tsx
      types.ts
  hooks/
    useAppViewManager.hook.ts
    useRightPaneContent.hook.tsx
  pages/
    DataDemo/
      store/
        dataDemo.store.tsx
      DataDemo.config.tsx
      index.tsx
  index.css
index.html
package.json
postcss.config.js
tailwind.config.js
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: src/index.css
```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@layer base {
  :root {
    --primary-hsl: 220 84% 60%;
    --background: 210 40% 96.1%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: var(--primary-hsl);
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: var(--primary-hsl);
    --radius: 1rem;
  }

  .dark {
    --background: 240 6% 9%;
    --foreground: 210 40% 98%;
    --card: 240 6% 14%;
    --card-foreground: 210 40% 98%;
    --popover: 240 6% 12%;
    --popover-foreground: 210 40% 98%;
    --primary: var(--primary-hsl);
    --primary-foreground: 210 40% 98%;
    --secondary: 240 5% 20%;
    --secondary-foreground: 210 40% 98%;
    --muted: 240 5% 20%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 240 5% 20%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 240 5% 20%;
    --input: 240 5% 20%;
    --ring: var(--primary-hsl);
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom scrollbar styles */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-transparent;
}

::-webkit-scrollbar-thumb {
  @apply bg-border rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-muted-foreground/50;
}

/* For UserDropdown */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

@layer base {
  .login-page-theme {
    --background: hsl(0 0% 100%);
    --foreground: hsl(0 0% 0%);
    --skeleton: hsl(0 0% 90%);
    --border: hsl(220 20% 90%);
    --btn-border: hsl(214.3 31.8% 91.4%);
    --input: hsl(220 20% 90%);
    --radius: 0.5rem;
  }
 
  .dark .login-page-theme {
    --background: hsl(222 94% 5%);
    --foreground: hsl(0 0% 100%);
    --skeleton: hsl(218 36% 16%);
    --border: hsl(220 20% 90%);
    --btn-border: hsl(217 32.6% 17.5%);
    --input: hsl(219 63% 16%);
    --radius: 0.5rem;
  }
}

@layer components {
  .g-button {
    @apply rounded-[var(--radius)] border;
    border-color: var(--btn-border);
  }
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

## File: index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jeli App Shell</title>
    <script>
      (function() {
        try {
          const storageKey = 'app-shell-storage';
          const storageValue = localStorage.getItem(storageKey);
          let isDarkMode;

          if (storageValue) {
            isDarkMode = JSON.parse(storageValue)?.state?.isDarkMode;
          }
          
          if (typeof isDarkMode !== 'boolean') {
            isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
          }
          
          document.documentElement.classList.toggle('dark', isDarkMode);
        } catch (e) { /* Fails safely */ }
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <div id="toaster-container"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
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

## File: src/features/dynamic-view/components/shared/EmptyState.tsx
```typescript
import { Eye } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Eye className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No items found</h3>
      <p className="text-muted-foreground">Try adjusting your search criteria</p>
    </div>
  )
}
```

## File: src/features/dynamic-view/components/controls/ViewModeSelector.tsx
```typescript
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { List, Grid3X3, LayoutGrid, Table, LayoutDashboard, CalendarDays } from 'lucide-react'
import type { ViewMode } from '../../types';
import { useDynamicView } from '../../DynamicViewContext';

const viewModes = [
  { id: 'list' as ViewMode, label: 'List', icon: List, description: 'Compact list with details' },
  { id: 'cards' as ViewMode, label: 'Cards', icon: LayoutGrid, description: 'Rich card layout' },
  { id: 'kanban' as ViewMode, label: 'Kanban', icon: LayoutDashboard, description: 'Interactive Kanban board' },
  { id: 'calendar' as ViewMode, label: 'Calendar', icon: CalendarDays, description: 'Interactive calendar view' },
  { id: 'grid' as ViewMode, label: 'Grid', icon: Grid3X3, description: 'Masonry grid view' },
  { id: 'table' as ViewMode, label: 'Table', icon: Table, description: 'Structured data table' }
]

export function ViewModeSelector() {
  const { viewMode, onViewModeChange } = useDynamicView();
  const indicatorRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const updateIndicatorPosition = useCallback((immediate = false) => {
    if (!indicatorRef.current || !containerRef.current || isTransitioning) return

    const activeButton = containerRef.current.querySelector(`[data-mode="${viewMode}"]`) as HTMLElement
    if (!activeButton) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const buttonRect = activeButton.getBoundingClientRect()
    
    const left = buttonRect.left - containerRect.left
    const width = buttonRect.width

    if (immediate) {
      // Set position immediately without animation for initial load
      gsap.set(indicatorRef.current, {
        x: left,
        width: width
      })
    } else {
      gsap.to(indicatorRef.current, {
        duration: 0.3,
        x: left,
        width: width,
        ease: "power2.out"
      })
    }
  }, [viewMode, isTransitioning])

  // Initial setup - set position immediately without animation
  useEffect(() => {
    const timer = setTimeout(() => {
      updateIndicatorPosition(true)
    }, 0)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  useEffect(() => {
    if (!isTransitioning) {
      updateIndicatorPosition()
    }
  }, [viewMode, isTransitioning, updateIndicatorPosition])

  const handleMouseEnter = () => {
    setIsTransitioning(true)
    setIsExpanded(true)
    
    // Wait for expand animation to complete
    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  const handleMouseLeave = () => {
    setIsTransitioning(true)
    setIsExpanded(false)
    
    // Wait for collapse animation to complete
    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  return (
    <div 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex items-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-1.5 shadow-lg transition-all duration-500 ease-out",
        "hover:shadow-xl hover:bg-card/70",
        isExpanded ? "gap-1" : "gap-0"
      )}
    >
      {/* Animated indicator */}
      <div
        ref={indicatorRef}
        className="absolute inset-y-1.5 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20 rounded-xl transition-all duration-300"
        style={{ left: 0, width: 0 }}
      />
      
      {/* Mode buttons */}
      {viewModes.map((mode, index) => {
        const IconComponent = mode.icon
        const isActive = viewMode === mode.id
        
        return (
          <button
            key={mode.id}
            data-mode={mode.id}
            onClick={() => onViewModeChange(mode.id)}
            className={cn(
              "relative flex items-center justify-center rounded-xl transition-all duration-500 ease-out group overflow-hidden",
              "hover:bg-accent/20 active:scale-95",
              isActive && "text-primary",
              isExpanded ? "gap-3 px-4 py-2.5" : "gap-0 px-3 py-2.5"
            )}
            title={mode.description}
            style={{
              transitionDelay: isExpanded ? `${index * 50}ms` : `${(viewModes.length - index - 1) * 30}ms`
            }}
          >
            <IconComponent className={cn(
              "w-5 h-5 transition-all duration-300 flex-shrink-0",
              isActive && "scale-110",
              "group-hover:scale-105",
              isExpanded ? "rotate-0" : "rotate-0"
            )} />
            
            {/* Label with smooth expand/collapse */}
            <div className={cn(
              "overflow-hidden transition-all duration-500 ease-out",
              isExpanded ? "max-w-[80px] opacity-100" : "max-w-0 opacity-0"
            )}>
              <span className={cn(
                "font-medium whitespace-nowrap transition-all duration-300",
                isActive ? "text-primary" : "text-muted-foreground",
                "group-hover:text-foreground"
              )}>
                {mode.label}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
```

## File: src/features/dynamic-view/components/shared/AddDataItemCta.tsx
```typescript
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

import type { ViewMode } from '../../types'

interface AddDataItemCtaProps {
  viewMode: ViewMode
  colSpan?: number
}

export function AddDataItemCta({ viewMode, colSpan }: AddDataItemCtaProps) {
  const isTable = viewMode === 'table'
  const isList = viewMode === 'list'
  const isCard = viewMode === 'cards' || viewMode === 'grid'

  const content = (
    <div
      className={cn(
        "flex items-center justify-center text-center w-full h-full p-6 gap-6",
        isCard && "flex-col min-h-[300px]",
        isList && "flex-row",
        isTable && "flex-row py-8",
      )}
    >
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-primary/10 border-2 border-dashed border-primary/30 rounded-full flex items-center justify-center text-primary">
          <Plus className="w-8 h-8" />
        </div>
      </div>
      <div className={cn("flex-1", isCard && "text-center", isList && "text-left", isTable && "text-left")}>
        <h3 className="font-semibold text-lg mb-1 text-primary">
          Showcase Your Own Data
        </h3>
        <p className="text-muted-foreground text-sm">
          Click here to add a new item and see how it looks across all views in the demo.
        </p>
      </div>
    </div>
  )

  if (isTable) {
    return (
      <tr className="group transition-colors duration-200 hover:bg-accent/20 cursor-pointer">
        <td colSpan={colSpan}>
          {content}
        </td>
      </tr>
    )
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border-2 border-dashed border-border bg-transparent transition-all duration-300 cursor-pointer",
        "hover:bg-accent/50 hover:border-primary/30",
        isList && "rounded-2xl"
      )}
    >
      {content}
    </div>
  )
}
```

## File: src/features/dynamic-view/components/shared/AnimatedLoadingSkeleton.tsx
```typescript
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ViewMode } from '../../types'

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
    grid: "grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6",
    kanban: "", // Kanban has its own skeleton
    calendar: "" // Calendar has its own skeleton
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

## File: src/features/dynamic-view/components/shared/DetailPanel.tsx
```typescript
import React, { useRef } from 'react'
import {
  Clock, 
  Tag,
  User,
  BarChart3,
} from 'lucide-react'
import type { GenericItem, DetailViewConfig } from '../../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook';
import { FieldRenderer } from '@/features/dynamic-view/components/shared/FieldRenderer'
import { getNestedValue } from '@/lib/utils'

interface DetailPanelProps<TFieldId extends string, TItem extends GenericItem> {
  item: TItem;
  config: DetailViewConfig<TFieldId>;
}

const SECTION_ICONS: Record<string, React.ElementType> = {
  "Assigned to": User,
  "Engagement Metrics": BarChart3,
  "Tags": Tag,
  "Timeline": Clock,
};

export function DetailPanel<TFieldId extends string, TItem extends GenericItem>({ item, config }: DetailPanelProps<TFieldId, TItem>) {
  const contentRef = useRef<HTMLDivElement>(null)
  useStaggeredAnimation(contentRef, [item]);

  if (!item) {
    return null
  }
  
  const { header, body } = config;

  return (
    <div ref={contentRef} className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
            <FieldRenderer item={item} fieldId={header.thumbnailField} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold mb-2 leading-tight">
              <FieldRenderer item={item} fieldId={header.titleField} />
            </h1>
            <p className="text-muted-foreground">
              <FieldRenderer item={item} fieldId={header.descriptionField} />
            </p>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {header.badgeFields.map((fieldId: TFieldId) => (
            <FieldRenderer key={fieldId} item={item} fieldId={fieldId} />
          ))}
        </div>

        {/* Progress */}
        <FieldRenderer item={item} fieldId={header.progressField} options={{ showPercentage: true }} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {body.sections.map((section) => {
            const IconComponent = SECTION_ICONS[section.title];
            // Render section only if at least one of its fields has a value
            const hasContent = section.fields.some((fieldId: TFieldId) => {
              const value = getNestedValue(item, fieldId as string);
              return value !== null && typeof value !== 'undefined';
            });

            if (!hasContent) return null;

            return (
              <div key={section.title} className="bg-card/30 rounded-2xl p-4 border border-border/30">
                <div className="flex items-center gap-1 mb-3">
                  {IconComponent && <IconComponent className="w-4 h-4 text-muted-foreground" />}
                  <h3 className="font-semibold text-sm">{section.title}</h3>
                </div>
                <div className="space-y-3">
                  {section.fields.map((fieldId: TFieldId) => (
                    <FieldRenderer key={fieldId} item={item} fieldId={fieldId} options={{ avatarClassName: "w-12 h-12" }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}
```

## File: src/features/dynamic-view/DynamicViewContext.tsx
```typescript
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { ViewConfig, GenericItem, ViewMode, FilterConfig, SortConfig, CalendarDateProp, CalendarDisplayProp, CalendarColorProp, GroupableField } from './types';

export interface DynamicViewContextProps<TFieldId extends string, TItem extends GenericItem> {
  config: ViewConfig<TFieldId, TItem>;
  data: TItem[];
  getFieldDef: (fieldId: TFieldId) => ViewConfig<TFieldId, TItem>['fields'][number] | undefined;

  // Data & State from parent
  items: TItem[];
  isLoading: boolean;
  isInitialLoading: boolean;
  totalItemCount: number;
  hasMore: boolean;

  // Controlled State Props from parent
  viewMode: ViewMode;
  filters: FilterConfig;
  sortConfig: SortConfig<TFieldId> | null;
  groupBy: GroupableField<TFieldId>;
  activeGroupTab: string;
  page: number;
  selectedItemId?: string;
  // Calendar-specific state
  calendarDateProp?: CalendarDateProp<TFieldId>;
  calendarDisplayProps?: CalendarDisplayProp<TFieldId>[];
  calendarItemLimit?: 'all' | number;
  calendarColorProp?: CalendarColorProp<TFieldId>;

  // Callbacks to parent
  onViewModeChange: (mode: ViewMode) => void;
  onFiltersChange: (filters: FilterConfig) => void;
  onSortChange: (sort: SortConfig<TFieldId> | null) => void;
  onGroupByChange: (group: GroupableField<TFieldId>) => void;
  onActiveGroupTabChange: (tab: string) => void;
  onPageChange: (page: number) => void;
  onItemSelect: (item: TItem) => void;
  onItemUpdate?: (itemId: string, updates: Partial<TItem>) => void;
  // Calendar-specific callbacks
  onCalendarDatePropChange?: (prop: CalendarDateProp<TFieldId>) => void;
  onCalendarDisplayPropsChange?: (props: CalendarDisplayProp<TFieldId>[]) => void;
  onCalendarItemLimitChange?: (limit: 'all' | number) => void;
  onCalendarColorPropChange?: (prop: CalendarColorProp<TFieldId>) => void;
}

const DynamicViewContext = createContext<DynamicViewContextProps<any, any> | null>(null);

interface DynamicViewProviderProps<TFieldId extends string, TItem extends GenericItem> extends Omit<DynamicViewContextProps<TFieldId, TItem>, 'getFieldDef' | 'config' | 'data'> {
  viewConfig: ViewConfig<TFieldId, TItem>,
  children: ReactNode;
}

export function DynamicViewProvider<TFieldId extends string, TItem extends GenericItem>({ viewConfig, children, ...rest }: DynamicViewProviderProps<TFieldId, TItem>) {
  const fieldDefsById = useMemo(() => {
    return new Map(viewConfig.fields.map(field => [field.id, field]));
  }, [viewConfig.fields]);

  const getFieldDef = (fieldId: TFieldId) => {
    return fieldDefsById.get(fieldId);
  };

  const value = useMemo(() => ({
    ...rest,
    config: viewConfig,
    data: rest.items, // alias for convenience
    getFieldDef,
  }), [viewConfig, getFieldDef, rest]);

  return (
    <DynamicViewContext.Provider value={value}>
      {children}
    </DynamicViewContext.Provider>
  );
}

export function useDynamicView<TFieldId extends string, TItem extends GenericItem>() {
  const context = useContext(DynamicViewContext);
  if (!context) {
    throw new Error('useDynamicView must be used within a DynamicViewProvider');
  }
  return context as DynamicViewContextProps<TFieldId, TItem>;
}
```

## File: src/features/dynamic-view/components/shared/FieldRenderer.tsx
```typescript
import { useDynamicView } from '../../DynamicViewContext';
import type { GenericItem, BadgeFieldDefinition, FieldDefinition } from '../../types';
import { cn, getNestedValue } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Heart, Share } from 'lucide-react';

interface FieldRendererProps<TFieldId extends string, TItem extends GenericItem> {
  item: TItem;
  fieldId: TFieldId;
  className?: string;
  options?: Record<string, any>; // For extra props like 'compact' for avatar
}

export function FieldRenderer<TFieldId extends string, TItem extends GenericItem>({ item, fieldId, className, options }: FieldRendererProps<TFieldId, TItem>) {
  const { getFieldDef } = useDynamicView<TFieldId, TItem>();
  const fieldDef = getFieldDef(fieldId);
  const value = getNestedValue(item, fieldId);

  // Custom render function takes precedence
  if (fieldDef?.render) {
    return <>{(fieldDef as FieldDefinition<TFieldId, TItem>).render?.(item, options)}</>;
  }

  if (!fieldDef) {
    console.warn(`[FieldRenderer] No field definition found for ID: ${fieldId}`);
    return <span className="text-red-500">?</span>;
  }

  if (value === null || typeof value === 'undefined') {
    return null; // Or some placeholder like 'N/A'
  }
  
  switch (fieldDef.type) {
    case 'string':
    case 'longtext':
      return <span className={cn("truncate", className)}>{String(value)}</span>;
    
    case 'thumbnail':
      return <span className={cn("text-xl", className)}>{String(value)}</span>;

    case 'badge': {
      const { colorMap, indicatorColorMap } = fieldDef as BadgeFieldDefinition<TFieldId, TItem>;
      
      if (options?.displayAs === 'indicator' && indicatorColorMap) {
        const indicatorColorClass = indicatorColorMap[String(value)] || 'bg-muted-foreground';
        return (
          <div className={cn("w-3 h-3 rounded-full", indicatorColorClass, className)} />
        );
      }

      const colorClass = colorMap?.[String(value)] || '';
      return (
        <Badge variant="outline" className={cn("font-medium capitalize", colorClass, className)}>
          {String(value)}
        </Badge>
      );
    }
    
    case 'avatar': {
      const { compact = false, avatarClassName = "w-8 h-8" } = options || {};
      const avatarUrl = getNestedValue(value, 'avatar');
      const name = getNestedValue(value, 'name');
      const email = getNestedValue(value, 'email');
      const fallback = name?.split(' ').map((n: string) => n[0]).join('') || '?';

      const avatarEl = (
        <Avatar className={cn("border-2 border-transparent group-hover:border-primary/50 transition-colors", avatarClassName)}>
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      );
      if (compact) return avatarEl;

      return (
        <div className={cn("flex items-center gap-2 group", className)}>
          {avatarEl}
          <div className="min-w-0 hidden sm:block">
            <p className="font-medium text-sm truncate">{name}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>
      );
    }
    
    case 'progress': {
      const { showPercentage = false } = options || {};
      const bar = (
        <div className="w-full bg-muted rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-primary to-primary/80 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${value}%` }}
          />
        </div>
      );
      if (!showPercentage) return bar;
      
      return (
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">{bar}</div>
          <span className="text-sm font-medium text-muted-foreground">{value}%</span>
        </div>
      );
    }

    case 'date':
      return (
        <div className={cn("flex items-center gap-1.5 text-sm", className)}>
          <Clock className="w-4 h-4" />
          <span>{new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      );

    case 'tags': {
      const MAX_TAGS = 2;
      const tags = Array.isArray(value) ? value : [];
      const remainingTags = tags.length - MAX_TAGS;
      return (
        <div className={cn("flex items-center gap-1.5 flex-wrap", className)}>
          {tags.slice(0, MAX_TAGS).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
          {remainingTags > 0 && (
            <Badge variant="outline" className="text-xs">+{remainingTags}</Badge>
          )}
        </div>
      );
    }

    case 'metrics': {
      const views = getNestedValue(value, 'views') || 0;
      const likes = getNestedValue(value, 'likes') || 0;
      const shares = getNestedValue(value, 'shares') || 0;
      return (
        <div className={cn("flex items-center gap-3 text-sm", className)}>
          <div className="flex items-center gap-1"><Eye className="w-4 h-4" /> {views}</div>
          <div className="flex items-center gap-1"><Heart className="w-4 h-4" /> {likes}</div>
          <div className="flex items-center gap-1"><Share className="w-4 h-4" /> {shares}</div>
        </div>
      );
    }
      
    default:
      return <>{String(value)}</>;
  }
}
```

## File: src/features/dynamic-view/components/views/TableView.tsx
```typescript
import { useRef, useLayoutEffect, useMemo, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  ExternalLink
} from 'lucide-react'
import type { GenericItem } from '../../types'
import { EmptyState } from '../shared/EmptyState'
import { capitalize } from '@/lib/utils'
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'

export function TableView({ data, ctaElement }: { data: GenericItem[], ctaElement?: ReactNode }) {
  const { config, sortConfig, onSortChange, groupBy, onItemSelect, selectedItemId } = useDynamicView<string, GenericItem>();
  const { tableView: viewConfig } = config;

  const tableRef = useRef<HTMLTableElement>(null)
  const animatedItemsCount = useRef(0)

  useLayoutEffect(() => {
    if (tableRef.current) {
      // Only select item rows for animation, not group headers
      const newItems = Array.from( 
        tableRef.current.querySelectorAll('tbody tr')
      ).filter(tr => !(tr as HTMLElement).dataset.groupHeader)
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
      animatedItemsCount.current = data.length;
    }
  }, [data]);

  const SortIcon = ({ field }: { field: string }) => {
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

  const handleSortClick = (field: string) => {
    const newDirection = (sortConfig?.key === field && sortConfig.direction === 'desc') ? 'asc' : 'desc';
    onSortChange({ key: field, direction: newDirection });
  }

  const groupedData = useMemo(() => {
    if (groupBy === 'none') return null;
    return (data as GenericItem[]).reduce((acc, item) => {
      const groupKey = item[groupBy as 'status' | 'priority' | 'category'] || 'N/A';
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    }, {} as Record<string, GenericItem[]>);
  }, [data, groupBy]);

  if (data.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table ref={tableRef} className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20">
              {viewConfig.columns.map(col => (
                <th key={col.fieldId} className="text-left p-4 font-semibold text-sm">
                  {col.isSortable ? (
                    <button
                      onClick={() => handleSortClick(col.fieldId)}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      {col.label}
                      <SortIcon field={col.fieldId} />
                    </button>
                  ) : (
                    <span>{col.label}</span>
                  )}
                </th>
              ))}
              <th className="text-center p-4 font-semibold text-sm w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groupedData
              ? Object.entries(groupedData).flatMap(([groupName, items]) => [
                  <tr key={groupName} data-group-header="true" className="sticky top-0 z-10">
                    <td colSpan={viewConfig.columns.length + 1} className="p-2 bg-muted/50 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{capitalize(groupName)}</h3>
                        <span className="text-xs px-2 py-0.5 bg-background rounded-full font-medium">{items.length}</span>
                      </div>
                    </td>
                  </tr>,
                  ...items.map(item => <TableRow key={item.id} item={item} isSelected={selectedItemId === item.id} onItemSelect={onItemSelect} />)
                ])
              : data.map(item => <TableRow key={item.id} item={item} isSelected={selectedItemId === item.id} onItemSelect={onItemSelect} />)
            }
            {ctaElement}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TableRow({ item, isSelected, onItemSelect }: { item: GenericItem; isSelected: boolean; onItemSelect: (item: GenericItem) => void }) {
  const { config } = useDynamicView<string, GenericItem>();
  return (
    <tr
      onClick={() => onItemSelect(item)}
      className={cn(
        "group border-b border-border/30 transition-all duration-200 cursor-pointer",
        "hover:bg-accent/20 hover:border-primary/20",
        isSelected && "bg-primary/5 border-primary/30"
      )}
    >
      {config.tableView.columns.map(col => (
        <td key={col.fieldId} className="p-4">
          <FieldRenderer item={item} fieldId={col.fieldId} options={{ showPercentage: true }} />
        </td>
      ))}
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

## File: src/features/dynamic-view/DynamicView.tsx
```typescript
import { useMemo, useCallback, type ReactNode, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import { DynamicViewProvider } from '@/features/dynamic-view/DynamicViewContext';
import type { ViewConfig, GenericItem, ViewMode, FilterConfig, SortConfig, CalendarDateProp, CalendarDisplayProp, CalendarColorProp, StatItem, GroupableField } from './types';
import { ViewControls } from './components/controls/ViewControls';
import { ViewModeSelector } from './components/controls/ViewModeSelector';
import { AnimatedLoadingSkeleton } from './components/shared/AnimatedLoadingSkeleton';
import { ListView } from './components/views/ListView';
import { CardView } from './components/views/CardView';
import { TableView } from './components/views/TableView';
import { KanbanView } from './components/views/KanbanView';
import { CalendarView } from './components/views/CalendarView';
import { EmptyState } from './components/shared/EmptyState';
import { useAutoAnimateStats } from '@/hooks/useAutoAnimateStats.hook';
import { StatCard } from '@/components/shared/StatCard';

// Define the props for the controlled DynamicView component
export interface DynamicViewProps<TFieldId extends string, TItem extends GenericItem> {
  // Config
  viewConfig: ViewConfig<TFieldId, TItem>;
  
  // Data & State
  items: TItem[];
  isLoading: boolean;
  isInitialLoading: boolean;
  totalItemCount: number;
  hasMore: boolean;
  
  // Controlled State Props
  viewMode: ViewMode;
  filters: FilterConfig;
  sortConfig: SortConfig<TFieldId> | null;
  groupBy: GroupableField<TFieldId>;
  activeGroupTab: string;
  page: number;
  selectedItemId?: string;
  // Calendar-specific state
  calendarDateProp?: CalendarDateProp<TFieldId>;
  calendarDisplayProps?: CalendarDisplayProp<TFieldId>[];
  calendarItemLimit?: 'all' | number;
  calendarColorProp?: CalendarColorProp<TFieldId>;
  statsData?: StatItem[];

  // State Change Callbacks
  onViewModeChange: (mode: ViewMode) => void;
  onFiltersChange: (filters: FilterConfig) => void;
  onSortChange: (sort: SortConfig<TFieldId> | null) => void;
  onGroupByChange: (group: GroupableField<TFieldId>) => void;
  onActiveGroupTabChange: (tab: string) => void;
  onPageChange: (page: number) => void;
  onItemSelect: (item: TItem) => void;
  onItemUpdate?: (itemId: string, updates: Partial<TItem>) => void;
  // Calendar-specific callbacks
  onCalendarDatePropChange?: (prop: CalendarDateProp<TFieldId>) => void;
  onCalendarDisplayPropsChange?: (props: CalendarDisplayProp<TFieldId>[]) => void;
  onCalendarItemLimitChange?: (limit: 'all' | number) => void;
  onCalendarColorPropChange?: (prop: CalendarColorProp<TFieldId>) => void;
  
  // Custom Renderers
  renderHeaderControls?: () => ReactNode;
  renderCta?: (viewMode: ViewMode, ctaProps: { colSpan?: number }) => ReactNode;
  loaderRef?: React.Ref<HTMLDivElement>;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

export function DynamicView<TFieldId extends string, TItem extends GenericItem>({ viewConfig, ...rest }: DynamicViewProps<TFieldId, TItem>) {
  
  const { viewMode, isInitialLoading, isLoading, hasMore, items, groupBy, statsData, scrollContainerRef } = rest;
  const statsRef = useRef<HTMLDivElement>(null);

  // Auto-hide stats container on scroll down
  useAutoAnimateStats(scrollContainerRef!, statsRef);

  useEffect(() => {
    // Animate stats cards in
    if (!isInitialLoading && statsRef.current) {
      gsap.fromTo(statsRef.current.children,
        { y: 30, opacity: 0 },
        {
          duration: 0.5,
          y: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "power2.out"
        }
      )
    }
  }, [isInitialLoading]);

  const groupedData = useMemo(() => {
    if (groupBy === 'none' || viewMode !== 'kanban') {
        return null;
    }
    return (items as TItem[]).reduce((acc, item) => {
        const groupKey = String(item[groupBy as keyof TItem]) || 'N/A';
        if (!acc[groupKey]) {
            acc[groupKey] = [] as TItem[];
        }
        acc[groupKey].push(item);
        return acc;
    }, {} as Record<string, TItem[]>);
  }, [items, groupBy, viewMode]);

  const renderViewForData = useCallback((data: TItem[], cta: ReactNode) => {
    switch (viewMode) {
        case 'table': return <TableView data={data} ctaElement={cta} />;
        case 'cards': return <CardView data={data} ctaElement={cta} />;
        case 'grid': return <CardView data={data} isGrid ctaElement={cta} />;
        case 'list': default: return <ListView data={data} ctaElement={cta} />;
    }
  }, [viewMode]);

  const renderContent = () => {
    if (isInitialLoading) {
      return <AnimatedLoadingSkeleton viewMode={viewMode} />;
    }

    if (viewMode === 'calendar') {
        return <CalendarView data={items} />;
    }

    if (viewMode === 'kanban') {
        return groupedData ? (
          <KanbanView data={groupedData} />
        ) : (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            Group data by a metric to use the Kanban view.
          </div>
        );
    }
    
    if (items.length === 0 && !isInitialLoading) {
        return <EmptyState />;
    }
    
    const ctaProps = {
        colSpan: viewMode === 'table' ? viewConfig.tableView.columns.length + 1 : undefined,
    };
    const ctaElement = rest.renderCta
        ? rest.renderCta(viewMode, ctaProps)
        : null;
    
    // This will be expanded later to handle group tabs
    return renderViewForData(items, ctaElement);
  };

  return (
    <DynamicViewProvider<TFieldId, TItem> viewConfig={viewConfig} {...rest}>
      <div className="space-y-6">
          <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                      {rest.renderHeaderControls ? rest.renderHeaderControls() : (
                          <>
                              <h1 className="text-2xl font-bold tracking-tight">Data Showcase</h1>
                              <p className="text-muted-foreground">
                                  {isInitialLoading 
                                      ? "Loading projects..." 
                                      : `Showing ${items.length} of ${rest.totalItemCount} item(s)`}
                              </p>
                          </>
                      )}
                  </div>
                  <ViewModeSelector />
              </div>
              <ViewControls />
          </div>

          {!isInitialLoading && statsData && statsData.length > 0 && (
            <div ref={statsRef} className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
              {statsData.map((stat) => (
                <StatCard
                  className="w-64 md:w-72 flex-shrink-0"
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  trend={stat.trend}
                  icon={stat.icon}
                  chartData={stat.chartData}
                />
              ))}
            </div>
          )}
          
          <div className="min-h-[500px]">
              {renderContent()}
          </div>

          {/* Loader for infinite scroll */}
          <div ref={rest.loaderRef} className="flex justify-center items-center py-6">
            {isLoading && !isInitialLoading && groupBy === 'none' && viewMode !== 'calendar' && viewMode !== 'kanban' && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading more...</span>
              </div>
            )}
            {!isLoading && !hasMore && items.length > 0 && !isInitialLoading && groupBy === 'none' && viewMode !== 'calendar' && viewMode !== 'kanban' && (
              <p className="text-muted-foreground">You've reached the end.</p>
            )}
          </div>
      </div>
    </DynamicViewProvider>
  );
}
```

## File: src/pages/DataDemo/DataDemo.config.tsx
```typescript
import { FieldRenderer } from "@/features/dynamic-view/components/shared/FieldRenderer";
import type { ViewConfig } from "@/features/dynamic-view/types";
import type { DataDemoItem } from "./data/DataDemoItem";

const config = {
  // 1. Field Definitions
  fields: [
    { id: "id", label: "ID", type: "string" },
    { id: "title", label: "Title", type: "string" },
    { id: "description", label: "Description", type: "longtext" },
    { id: "thumbnail", label: "Thumbnail", type: "thumbnail" },
    { id: "category", label: "Category", type: "badge" },
    {
      id: "status",
      label: "Status",
      type: "badge",
      colorMap: {
        active: "bg-sky-500/10 text-sky-600 border-sky-500/20",
        pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        completed: "bg-emerald-600/10 text-emerald-700 border-emerald-600/20",
        archived: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20",
      },
    },
    {
      id: "priority",
      label: "Priority",
      type: "badge",
      colorMap: {
        critical: "bg-red-600/10 text-red-700 border-red-600/20",
        high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        medium: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        low: "bg-green-500/10 text-green-600 border-green-500/20",
      },
      indicatorColorMap: {
        critical: "bg-red-500",
        high: "bg-orange-500",
        medium: "bg-blue-500",
        low: "bg-green-500",
      },
    },
    { id: "assignee", label: "Assignee", type: "avatar" },
    { id: "tags", label: "Tags", type: "tags" },
    { id: "metrics", label: "Engagement", type: "metrics" },
    { id: "metrics.completion", label: "Progress", type: "progress" },
    { id: "dueDate", label: "Due Date", type: "date" },
    { id: "createdAt", label: "Created At", type: "date" },
    { id: "updatedAt", label: "Last Updated", type: "date" },
    // A custom field to replicate the composite "Project" column in the table view
    {
      id: "project_details",
      label: "Project",
      type: "custom",
      render: (item: DataDemoItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
            <FieldRenderer item={item} fieldId="thumbnail" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium group-hover:text-primary transition-colors truncate">
              <FieldRenderer item={item} fieldId="title" />
            </h4>
            <p className="text-sm text-muted-foreground truncate">
              <FieldRenderer item={item} fieldId="category" />
            </p>
          </div>
        </div>
      ),
    },
  ] as const,
  // 2. Control Definitions
  sortableFields: [
    { id: "updatedAt", label: "Last Updated" },
    { id: "title", label: "Title" },
    { id: "status", label: "Status" },
    { id: "priority", label: "Priority" },
    { id: "metrics.completion", label: "Progress" },
  ],
  groupableFields: [
    { id: "none", label: "None" },
    { id: "status", label: "Status" },
    { id: "priority", label: "Priority" },
    { id: "category", label: "Category" },
  ],
  filterableFields: [
    {
      id: "status",
      label: "Status",
      options: [
        { id: "active", label: "Active" },
        { id: "pending", label: "Pending" },
        { id: "completed", label: "Completed" },
        { id: "archived", label: "Archived" },
      ],
    },
    {
      id: "priority",
      label: "Priority",
      options: [
        { id: "critical", label: "Critical" },
        { id: "high", label: "High" },
        { id: "medium", label: "Medium" },
        { id: "low", label: "Low" },
      ],
    },
  ],
  // 3. View Layouts
  listView: {
    iconField: "thumbnail",
    titleField: "title",
    metaFields: [
      { fieldId: "status", className: "hidden sm:flex" },
      { fieldId: "tags", className: "hidden lg:flex" },
      { fieldId: "updatedAt", className: "hidden md:flex" },
      { fieldId: "assignee" },
      { fieldId: "priority", className: "hidden xs:flex" },
    ],
  },
  cardView: {
    thumbnailField: "thumbnail",
    titleField: "title",
    descriptionField: "description",
    headerFields: ["priority"],
    statusField: "status",
    categoryField: "category",
    tagsField: "tags",
    progressField: "metrics.completion",
    assigneeField: "assignee",
    metricsField: "metrics",
    dateField: "updatedAt",
  },
  tableView: {
    columns: [
      { fieldId: "project_details", label: "Project", isSortable: true },
      { fieldId: "status", label: "Status", isSortable: true },
      { fieldId: "priority", label: "Priority", isSortable: true },
      { fieldId: "assignee", label: "Assignee", isSortable: true },
      { fieldId: "metrics.completion", label: "Progress", isSortable: true },
      { fieldId: "metrics", label: "Engagement", isSortable: true },
      { fieldId: "updatedAt", label: "Last Updated", isSortable: true },
    ],
  },
  kanbanView: {
    groupByField: "status",
    cardFields: {
      titleField: "title",
      descriptionField: "description",
      priorityField: "priority",
      tagsField: "tags",
      dateField: "dueDate",
      metricsField: "metrics",
      assigneeField: "assignee",
    },
  },
  calendarView: {
    dateField: "dueDate",
    titleField: "title",
    displayFields: ["tags", "priority", "assignee"],
    colorByField: "priority",
  },
  detailView: {
    header: {
      thumbnailField: "thumbnail",
      titleField: "title",
      descriptionField: "description",
      badgeFields: ["status", "priority", "category"],
      progressField: "metrics.completion",
    },
    body: {
      sections: [
        { title: "Assigned to", fields: ["assignee"] },
        { title: "Engagement Metrics", fields: ["metrics"] },
        { title: "Tags", fields: ["tags"] },
        {
          title: "Timeline",
          fields: ["createdAt", "updatedAt", "dueDate"],
        },
      ],
    },
  },
} as const;

// Infer the field IDs from the const-asserted array.
type DataDemoFieldId = (typeof config.fields)[number]["id"];

// This line validates the entire config object against the generic ViewConfig type.
export const dataDemoViewConfig: ViewConfig<DataDemoFieldId, DataDemoItem> = config;
```

## File: src/features/dynamic-view/components/views/KanbanView.tsx
```typescript
import { useState, useEffect, Fragment } from "react";
import {
  GripVertical,
  Plus,
} from "lucide-react";
import type { GenericItem } from '../../types'
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EmptyState } from "../shared/EmptyState";
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'

interface KanbanCardProps {
  item: GenericItem;
  isDragging: boolean;
}

function KanbanCard({ item, isDragging, ...props }: KanbanCardProps & React.HTMLAttributes<HTMLDivElement>) {
  const { config, onItemSelect } = useDynamicView<string, GenericItem>();
  const { kanbanView: viewConfig } = config;

  return (
    <Card
      {...props}
      data-draggable-id={item.id}
      onClick={() => onItemSelect(item)}
      className={cn(
        "cursor-pointer transition-all duration-300 border bg-card/60 dark:bg-neutral-800/60 backdrop-blur-sm hover:bg-card/70 dark:hover:bg-neutral-700/70 active:cursor-grabbing",
        isDragging && "opacity-50 ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      <CardContent className="p-5">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-card-foreground dark:text-neutral-100 leading-tight">
              <FieldRenderer item={item} fieldId={viewConfig.cardFields.titleField} />
            </h4>
            <GripVertical className="w-5 h-5 text-muted-foreground/60 dark:text-neutral-400 cursor-grab flex-shrink-0" />
          </div>

          <p className="text-sm text-muted-foreground dark:text-neutral-300 leading-relaxed line-clamp-2">
            <FieldRenderer item={item} fieldId={viewConfig.cardFields.descriptionField} />
          </p>

          <div className="flex flex-wrap gap-2">
            <FieldRenderer item={item} fieldId={viewConfig.cardFields.priorityField} />
            <FieldRenderer item={item} fieldId={viewConfig.cardFields.tagsField} />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/30 dark:border-neutral-700/30">
            <div className="flex items-center gap-4 text-muted-foreground/80 dark:text-neutral-400">
              <FieldRenderer item={item} fieldId={viewConfig.cardFields.dateField} />
              <FieldRenderer item={item} fieldId={viewConfig.cardFields.metricsField} />
            </div>
            <FieldRenderer item={item} fieldId={viewConfig.cardFields.assigneeField} options={{ compact: true, avatarClassName: 'w-8 h-8 ring-2 ring-white/50 dark:ring-neutral-700/50' }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DataKanbanViewProps {
  data: Record<string, GenericItem[]>;
}

export function KanbanView({ data }: DataKanbanViewProps) {
  const [columns, setColumns] = useState(data);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{ columnId: string; index: number } | null>(null);
  const { groupBy, onItemUpdate } = useDynamicView<string, GenericItem>();

  useEffect(() => {
    setColumns(data);
  }, [data]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: GenericItem, sourceColumnId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ itemId: item.id, sourceColumnId }));
    setDraggedItemId(item.id);
  };

  const getDropIndicatorIndex = (e: React.DragEvent, elements: HTMLElement[]) => {
    const mouseY = e.clientY;
    let closestIndex = elements.length;

    elements.forEach((el, index) => {
      const { top, height } = el.getBoundingClientRect();
      const offset = mouseY - (top + height / 2);
      if (offset < 0 && index < closestIndex) {
        closestIndex = index;
      }
    });
    return closestIndex;
  };

  const handleDragOverCardsContainer = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    const container = e.currentTarget;
    const draggableElements = Array.from(container.querySelectorAll('[data-draggable-id]')) as HTMLElement[];
    const index = getDropIndicatorIndex(e, draggableElements);

    if (dropIndicator?.columnId === columnId && dropIndicator.index === index) return;
    setDropIndicator({ columnId, index });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    setDropIndicator(null);
    try {
      const { itemId, sourceColumnId } = JSON.parse(e.dataTransfer.getData('text/plain'));

      const droppedItem = columns[sourceColumnId]?.find(i => i.id === itemId);
      if (!droppedItem) return;

      // Update local state for immediate feedback
      setColumns(prev => {
        const newColumns = { ...prev };
        const sourceCol = prev[sourceColumnId].filter(i => i.id !== itemId);

        if (sourceColumnId === targetColumnId) {
          const dropIndex = dropIndicator?.columnId === targetColumnId ? dropIndicator.index : sourceCol.length;
          sourceCol.splice(dropIndex, 0, droppedItem);
          newColumns[sourceColumnId] = sourceCol;
        } else {
          const targetCol = [...prev[targetColumnId]];
          const dropIndex = dropIndicator?.columnId === targetColumnId ? dropIndicator.index : targetCol.length;
          targetCol.splice(dropIndex, 0, droppedItem);
          
          newColumns[sourceColumnId] = sourceCol;
          newColumns[targetColumnId] = targetCol;
        }
        return newColumns;
      });
      
      // Persist change to global store. The groupBy value tells us which property to update.
      if (groupBy !== 'none' && sourceColumnId !== targetColumnId) {
        onItemUpdate?.(itemId, { [groupBy]: targetColumnId } as Partial<GenericItem>);
      }

    } catch (err) {
      console.error("Failed to parse drag data", err)
    } finally {
      setDraggedItemId(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDropIndicator(null);
  };

  const initialColumns = Object.entries(data);

  if (!initialColumns || initialColumns.length === 0) {
    return <EmptyState />;
  }

  const statusColors: Record<string, string> = {
    active: "bg-blue-500", pending: "bg-yellow-500", completed: "bg-green-500", archived: "bg-gray-500",
    low: "bg-green-500", medium: "bg-blue-500", high: "bg-orange-500", critical: "bg-red-500",
  };

  const DropIndicator = () => <div className="h-1 my-2 rounded-full bg-primary/60" />;

  return (
    <div className="flex items-start gap-6 pb-4 overflow-x-auto -mx-6 px-6">
      {Object.entries(columns).map(([columnId, items]) => (
        <div
          key={columnId}
          className={cn(
            "w-80 flex-shrink-0 bg-card/20 dark:bg-neutral-900/20 backdrop-blur-xl rounded-3xl p-5 border border-border dark:border-neutral-700/50 transition-all duration-300",
            dropIndicator?.columnId === columnId && "bg-primary/10 border-primary/30"
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn("w-3.5 h-3.5 rounded-full", statusColors[columnId] || "bg-muted-foreground")} />
              <h3 className="font-semibold text-card-foreground dark:text-neutral-100 capitalize truncate">{columnId}</h3>
              <span className="text-sm font-medium text-muted-foreground bg-background/50 rounded-full px-2 py-0.5">{items.length}</span>
            </div>
            <button className="p-1 rounded-full bg-card/30 dark:bg-neutral-800/30 hover:bg-card/50 dark:hover:bg-neutral-700/50 transition-colors">
              <Plus className="w-4 h-4 text-muted-foreground dark:text-neutral-300" />
            </button>
          </div>

          <div
            onDragOver={(e) => handleDragOverCardsContainer(e, columnId)}
            onDrop={(e) => handleDrop(e, columnId)}
            onDragLeave={() => setDropIndicator(null)}
            className="space-y-4 min-h-[100px]"
          >
            {items.map((item, index) => (
              <Fragment key={item.id}>
                {dropIndicator?.columnId === columnId && dropIndicator.index === index && (
                  <DropIndicator />
                )}
                <KanbanCard
                  item={item}
                  isDragging={draggedItemId === item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item, columnId)}
                  onDragEnd={handleDragEnd}
                />
              </Fragment>
            ))}
            {dropIndicator?.columnId === columnId && dropIndicator.index === items.length && (
              <DropIndicator />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

## File: src/features/dynamic-view/components/controls/ViewControls.tsx
```typescript
import * as React from 'react'
import { Check, ListFilter, Search, SortAsc, ChevronsUpDown, Settings } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

import type { FilterConfig, CalendarDateProp, CalendarDisplayProp, CalendarColorProp, GenericItem, FilterableFieldConfig } from '../../types'
import { useDynamicView } from '../../DynamicViewContext';

export interface DataViewControlsProps {
  // groupOptions will now come from config
}

export function ViewControls() {
  const {
    config,
    filters,
    onFiltersChange,
    sortConfig,
    onSortChange,
    groupBy,
    onGroupByChange,
    viewMode,
  } = useDynamicView<string, GenericItem>();
  const sortOptions = config.sortableFields;
  const groupOptions = config.groupableFields;
  const filterableFields = config.filterableFields;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, searchTerm: event.target.value });
  }
  
  const activeFilterCount = filterableFields.reduce((acc, field) => acc + (filters[field.id]?.length || 0), 0)

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
      {/* Search */}
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-9 w-full sm:w-64"
          value={filters.searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filters */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 w-full sm:w-auto justify-start border-dashed">
            <ListFilter className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <>
                <div className="mx-2 h-4 w-px bg-muted-foreground/50" />
                <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                  {activeFilterCount}
                </Badge>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0" align="start">
          <CombinedFilter filters={filters} onFiltersChange={onFiltersChange} filterableFields={filterableFields} />
        </PopoverContent>
      </Popover>

      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={() => onFiltersChange({ searchTerm: filters.searchTerm, status: [], priority: [] })}>Reset</Button>
      )}

      {/* Spacer */}
      <div className="hidden md:block flex-grow" />

      {viewMode === 'calendar' ? (
        <CalendarSpecificControls />
      ) : (
        <>
          {/* Sorter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 w-full sm:w-auto justify-start">
                <SortAsc className="mr-2 h-4 w-4" />
                Sort by: {sortOptions.find(o => o.id === sortConfig?.key)?.label || 'Default'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={`${sortConfig?.key || 'default'}-${sortConfig?.direction || ''}`}
                onValueChange={(value) => {
                  if (value.startsWith('default')) {
                    onSortChange(null);
                  } else {
                    const [key, direction] = value.split('-')
                    onSortChange({ key: key, direction: direction as 'asc' | 'desc' });
                  }
                }}
              >
                <DropdownMenuRadioItem value="default-">Default</DropdownMenuRadioItem>
                <DropdownMenuSeparator />
                {sortOptions.map(option => (
                  <React.Fragment key={option.id}>
                    <DropdownMenuRadioItem value={`${option.id}-desc`}>{option.label} (Desc)</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={`${option.id}-asc`}>{option.label} (Asc)</DropdownMenuRadioItem>
                  </React.Fragment>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Group By Dropdown */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 w-full justify-between">
                  Group by: {groupOptions.find(o => o.id === groupBy)?.label}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[180px]">
                <DropdownMenuRadioGroup value={groupBy} onValueChange={onGroupByChange}>
                  {groupOptions.map(option => (
                    <DropdownMenuRadioItem key={option.id} value={option.id}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </div>
  )
}

function CalendarSpecificControls() {
    const {
        calendarDateProp, onCalendarDatePropChange,
        calendarDisplayProps, onCalendarDisplayPropsChange,
        calendarItemLimit, onCalendarItemLimitChange,
        calendarColorProp, onCalendarColorPropChange,
    } = useDynamicView<string, GenericItem>();

    const handleDisplayPropChange = (prop: CalendarDisplayProp<string>, checked: boolean) => {
        const newProps = checked 
            ? [...(calendarDisplayProps || []), prop] 
            : (calendarDisplayProps || []).filter((p) => p !== prop);
        onCalendarDisplayPropsChange?.(newProps);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                    <Settings className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h4 className="font-medium leading-none">Calendar Settings</h4>
                        <p className="text-sm text-muted-foreground">
                            Customize the calendar view.
                        </p>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                        <Label className="font-semibold">Item Background Color</Label>
                        <RadioGroup value={calendarColorProp} onValueChange={(v) => onCalendarColorPropChange?.(v as CalendarColorProp<string>)} className="gap-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="none" id="color-none" />
                                <Label htmlFor="color-none" className="font-normal">None</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="priority" id="color-priority" />
                                <Label htmlFor="color-priority" className="font-normal">By Priority</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="status" id="color-status" />
                                <Label htmlFor="color-status" className="font-normal">By Status</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="category" id="color-category" />
                                <Label htmlFor="color-category" className="font-normal">By Category</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                        <Label className="font-semibold">Date Property</Label>
                        <RadioGroup value={calendarDateProp} onValueChange={(v) => onCalendarDatePropChange?.(v as CalendarDateProp<string>)} className="gap-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dueDate" id="dueDate" />
                                <Label htmlFor="dueDate" className="font-normal">Due Date</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="createdAt" id="createdAt" />
                                <Label htmlFor="createdAt" className="font-normal">Created Date</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="updatedAt" id="updatedAt" />
                                <Label htmlFor="updatedAt" className="font-normal">Updated Date</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-3">
                        <Label className="font-semibold">Card Details</Label>
                        <div className="space-y-2">
                            {(['priority', 'assignee', 'tags'] as CalendarDisplayProp<string>[]).map(prop => (
                                <div key={prop} className="flex items-center space-x-2">
                                    <Checkbox id={prop} checked={(calendarDisplayProps || []).includes(prop)} onCheckedChange={(c) => handleDisplayPropChange(prop, !!c)} />
                                    <Label htmlFor={prop} className="capitalize font-normal">{prop}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                         <div className="space-y-0.5">
                            <Label htmlFor="show-all" className="font-semibold">Show all items</Label>
                            <p className="text-xs text-muted-foreground">Display all items on a given day.</p>
                        </div>
                        <Switch id="show-all" checked={calendarItemLimit === 'all'} onCheckedChange={(c) => onCalendarItemLimitChange?.(c ? 'all' : 3)} />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

function CombinedFilter({
  filters,
  onFiltersChange,
  filterableFields,
}: {
  filters: FilterConfig;
  onFiltersChange: (filters: FilterConfig) => void;
  filterableFields: readonly FilterableFieldConfig<string>[];
}) {
  const handleSelect = (fieldId: string, value: string) => {
    const currentValues = new Set(filters[fieldId] || []);
    currentValues.has(value) ? currentValues.delete(value) : currentValues.add(value);
    
    onFiltersChange({ ...filters, [fieldId]: Array.from(currentValues) });
  };

  const hasActiveFilters = filterableFields.some(field => (filters[field.id] || []).length > 0);

  const clearFilters = () => {
    const clearedFilters: Partial<FilterConfig> = {};
    filterableFields.forEach(field => {
      clearedFilters[field.id as keyof Omit<FilterConfig, 'searchTerm'>] = [];
    });
    onFiltersChange({ searchTerm: filters.searchTerm, ...clearedFilters });
  }

  return (
    <Command>
      <CommandInput placeholder="Filter by..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {filterableFields.map((field, index) => (
          <React.Fragment key={field.id}>
            <CommandGroup heading={field.label}>
              {field.options.map((option) => {
            const isSelected = (filters[field.id] || []).includes(option.id);
            return (
              <CommandItem
                key={option.id}
                onSelect={() => handleSelect(field.id, option.id)}
              >
                <div
                  className={cn(
                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                    isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                  )}
                >
                  <Check className={cn('h-4 w-4')} />
                </div>
                <span>{option.label}</span>
              </CommandItem>
            );
          })}
            </CommandGroup>
            {index < filterableFields.length - 1 && <CommandSeparator />}
          </React.Fragment>
        ))}

        {hasActiveFilters && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={clearFilters}
                className="justify-center text-center text-sm"
              >
                Clear filters
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  )
}
```

## File: src/features/dynamic-view/components/views/CalendarView.tsx
```typescript
import { useState, useMemo, useRef, useLayoutEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isSameDay, } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GenericItem } from '../../types';
import type { CalendarDateProp, CalendarColorProp, Status, Priority } from '../../types';
import { useResizeObserver } from "@/hooks/useResizeObserver.hook";
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'

interface CalendarViewProps {
  data: GenericItem[];
}

const PRIORITY_BG_COLORS: Record<Priority, string> = {
  low: 'bg-blue-500/80 border-blue-600/80 text-white',
  medium: 'bg-yellow-500/80 border-yellow-600/80 text-yellow-950',
  high: 'bg-orange-500/80 border-orange-600/80 text-white',
  critical: 'bg-red-600/80 border-red-700/80 text-white',
};

const STATUS_BG_COLORS: Record<Status, string> = {
  active: 'bg-sky-500/80 border-sky-600/80 text-white',
  pending: 'bg-amber-500/80 border-amber-600/80 text-amber-950',
  completed: 'bg-emerald-600/80 border-emerald-700/80 text-white',
  archived: 'bg-zinc-500/80 border-zinc-600/80 text-white',
};

const CATEGORY_BG_COLORS = [
  'bg-rose-500/80 border-rose-600/80 text-white',
  'bg-fuchsia-500/80 border-fuchsia-600/80 text-white',
  'bg-indigo-500/80 border-indigo-600/80 text-white',
  'bg-teal-500/80 border-teal-600/80 text-white',
  'bg-lime-500/80 border-lime-600/80 text-lime-950',
];

const getCategoryBgColor = (category: string) => {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % CATEGORY_BG_COLORS.length);
  return CATEGORY_BG_COLORS[index];
};

function CalendarHeader({ currentDate, onPrevMonth, onNextMonth, onToday }: {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <h2 className="text-xl font-bold md:text-2xl tracking-tight">
        {format(currentDate, "MMMM yyyy")}
      </h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToday}>Today</Button>
        <div className="flex items-center">
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={onPrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={onNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function CalendarEvent({ item, isSelected, isDragging, onDragStart, colorProp }: { 
    item: GenericItem; 
    isSelected: boolean;
    isDragging: boolean;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, itemId: string) => void
    colorProp: CalendarColorProp<string>;
  }) {
  const { config, onItemSelect } = useDynamicView<string, GenericItem>();
  const { calendarView: viewConfig } = config;

    const colorClass = useMemo(() => {
      switch (colorProp) {
        case 'priority': return PRIORITY_BG_COLORS[item.priority as Priority];
        case 'status': return STATUS_BG_COLORS[item.status as Status];
        case 'category': return getCategoryBgColor(item.category as string);
        default: return null;
      }
    }, [colorProp, item]);

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, item.id)}
            onClick={() => onItemSelect(item)}
            className={cn(
                "p-2 rounded-lg cursor-grab transition-all duration-200 border space-y-1",
                isSelected && "ring-2 ring-primary ring-offset-background ring-offset-2",
                isDragging && "opacity-50 ring-2 ring-primary cursor-grabbing",
                colorClass 
                  ? `${colorClass} hover:brightness-95 dark:hover:brightness-110`
                  : "bg-card/60 dark:bg-neutral-800/60 backdrop-blur-sm hover:bg-card/80 dark:hover:bg-neutral-700/70"
            )}
        >
            <div className={cn(
              "font-semibold text-sm leading-tight line-clamp-2",
              colorClass ? "text-inherit" : "text-card-foreground/90"
            )}>
              <FieldRenderer item={item} fieldId={viewConfig.titleField} />
            </div>

            {viewConfig.displayFields.includes('tags') && <FieldRenderer item={item} fieldId="tags" />}

            {(viewConfig.displayFields.includes('priority') || viewConfig.displayFields.includes('assignee')) && (
                <div className={cn(
                    "flex items-center justify-between pt-1 border-t",
                    colorClass ? "border-black/10 dark:border-white/10" : "border-border/30 dark:border-neutral-700/50"
                )}>
                    <div>
                      {viewConfig.displayFields.includes('priority') && <FieldRenderer item={item} fieldId="priority" />}
                    </div>
                    <div>
                      {viewConfig.displayFields.includes('assignee') && <FieldRenderer item={item} fieldId="assignee" options={{ compact: true, avatarClassName: 'w-5 h-5' }}/>}
                    </div>
                </div>
            )}
        </div>
    );
}

const datePropLabels: Record<CalendarDateProp<string>, string> = {
  dueDate: 'due dates',
  createdAt: 'creation dates',
  updatedAt: 'update dates',
};

export function CalendarView({ data }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const {
    selectedItemId,
    onItemUpdate,
    calendarDateProp = 'dueDate', // Provide default
    calendarItemLimit = 3, // Provide default
    calendarColorProp = 'none', // Provide default
  } = useDynamicView<string, GenericItem>();
  
  // Drag & Drop State
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dropTargetDate, setDropTargetDate] = useState<Date | null>(null);

  // GSAP animation state
  const [direction, setDirection] = useState(0); // 0: initial, 1: next, -1: prev

  // Responsive Calendar State
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const { width } = useResizeObserver(calendarContainerRef);
  const MIN_DAY_WIDTH = 160; // px
  const numColumns = useMemo(() => {
    if (width === 0) return 7;
    const cols = Math.floor(width / MIN_DAY_WIDTH);
    return Math.max(3, Math.min(7, cols));
  }, [width]);

  const gridRef = useRef<HTMLDivElement>(null);
  const itemsByDateProp = useMemo(() => data.filter(item => !!item[calendarDateProp]), [data, calendarDateProp]);

  const eventsByDate = useMemo(() => {
    const eventsMap = new Map<string, GenericItem[]>();
    itemsByDateProp.forEach(item => {
      const dateValue = item[calendarDateProp];
      if (!dateValue) return;
      const date = new Date(dateValue as string);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!eventsMap.has(dateKey)) {
        eventsMap.set(dateKey, []);
      }
      eventsMap.get(dateKey)?.push(item);
    });
    return eventsMap;
  }, [itemsByDateProp, calendarDateProp]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // D&D Handlers
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
    setDraggedItemId(itemId);
  };
  
  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDropTargetDate(null);
  };

  const handleDragOver = (e: React.DragEvent, day: Date) => {
    e.preventDefault();
    if (dropTargetDate === null || !isSameDay(day, dropTargetDate)) {
        setDropTargetDate(day);
    }
  };

  const handleDragLeave = () => {
    setDropTargetDate(null);
  };

  const handleDrop = (e: React.DragEvent, day: Date) => {
    e.preventDefault();
    const itemIdToUpdate = e.dataTransfer.getData('text/plain');
    if (itemIdToUpdate) {
        const originalItem = itemsByDateProp.find(i => i.id === itemIdToUpdate);
        if (originalItem && originalItem[calendarDateProp]) {
            const originalDate = new Date(originalItem[calendarDateProp] as string);
            // Preserve the time, only change the date part
            const newDueDate = new Date(day);
            newDueDate.setHours(originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds(), originalDate.getMilliseconds());
            onItemUpdate?.(itemIdToUpdate, { [calendarDateProp]: newDueDate.toISOString() });
        }
    }
    handleDragEnd(); // Reset state
  };
  
  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentDate(subMonths(currentDate, 1));
  };
  const handleNextMonth = () => {
    setDirection(1);
    setCurrentDate(addMonths(currentDate, 1));
  };
  const handleToday = () => {
    setDirection(0); // No animation for 'Today'
    setCurrentDate(new Date());
  };

  useLayoutEffect(() => {
    if (direction === 0 || !gridRef.current) return;
    gsap.fromTo(gridRef.current, 
      { opacity: 0, x: 30 * direction }, 
      { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
    );
  }, [currentDate]);

  return (
    <div ref={calendarContainerRef} className="-mx-4 md:-mx-6">
      <div className="px-4 md:px-6 pb-2">
        <CalendarHeader currentDate={currentDate} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} onToday={handleToday} />
      </div>
      {itemsByDateProp.length === 0 ? (
        <div className="flex items-center justify-center h-96 text-muted-foreground rounded-lg border bg-card/30 mx-4 md:mx-6">
          No items with {datePropLabels[calendarDateProp]} to display on the calendar.
        </div>
      ) : (
        <div className="px-2" onDragEnd={handleDragEnd}>
          {numColumns === 7 && (
            <div className="grid grid-cols-7">
              {weekdays.map(day => (
                <div key={day} className="py-2 px-3 text-center text-xs font-semibold text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
          )}

            <div
              ref={gridRef}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${numColumns}, minmax(0, 1fr))`,
                gap: '0.5rem',
              }}
            >
              {days.map(day => {
                const dateKey = format(day, "yyyy-MM-dd");
                const dayEvents = eventsByDate.get(dateKey) || [];
                const visibleEvents = calendarItemLimit === 'all' 
                    ? dayEvents 
                    : dayEvents.slice(0, calendarItemLimit as number);
                const hiddenEventsCount = dayEvents.length - visibleEvents.length;
                const isCurrentMonthDay = isSameMonth(day, currentDate);
                const isDropTarget = dropTargetDate && isSameDay(day, dropTargetDate);
                return (
                  <div
                    key={day.toString()}
                    onDragOver={(e) => handleDragOver(e, day)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, day)}
                    className={cn(
                      "relative min-h-[150px] rounded-2xl p-2 flex flex-col gap-2 transition-all duration-300 border",
                      isCurrentMonthDay ? "bg-card/40 dark:bg-neutral-900/40 border-transparent" : "bg-muted/30 dark:bg-neutral-800/20 border-transparent text-muted-foreground/60",
                      isDropTarget ? "border-primary/50 bg-primary/10" : "hover:border-primary/20 hover:bg-card/60"
                    )}
                  >
                    <div className="font-semibold text-sm">
                      {isToday(day) ? (
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground">
                          {format(day, 'd')}
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1.5 px-1 py-0.5">
                          {numColumns < 7 && <span className="text-xs opacity-70">{format(day, 'eee')}</span>}
                          <span>{format(day, 'd')}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 overflow-y-auto flex-grow custom-scrollbar">
                      {visibleEvents.map(item => (
                        <CalendarEvent
                          key={item.id} 
                          item={item} 
                          isSelected={selectedItemId === item.id}
                          isDragging={draggedItemId === item.id}
                          onDragStart={handleDragStart}
                          colorProp={calendarColorProp}
                        />
                      ))}
                    </div>
                    {hiddenEventsCount > 0 && (
                      <div className="absolute bottom-1 right-2 text-xs font-bold text-muted-foreground">
                        +{hiddenEventsCount} more
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
        </div>
      )}
    </div>
  );
}
```

## File: src/features/dynamic-view/components/views/CardView.tsx
```typescript
import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'
import type { GenericItem } from '../../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import { EmptyState } from '../shared/EmptyState'
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'

export function CardView({ data, isGrid = false, ctaElement }: { data: GenericItem[]; isGrid?: boolean, ctaElement?: ReactNode }) {
  const { config, onItemSelect, selectedItemId } = useDynamicView<string, GenericItem>();
  const { cardView: viewConfig } = config;

  const containerRef = useRef<HTMLDivElement>(null)
  useStaggeredAnimation(containerRef, [data], { mode: 'incremental', y: 40 });

  const items = Array.isArray(data) ? data : [];
  if (items.length === 0) {
    return <EmptyState />
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "gap-6",
        isGrid
          ? "grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]"
          : "grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))]",
        "pb-4"
      )}
    >
      {items.map((item: GenericItem) => {
        const isSelected = selectedItemId === item.id
        
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
                  <FieldRenderer item={item} fieldId={viewConfig.thumbnailField} />
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </div>

              {/* Header Fields (e.g., priority indicator) */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {viewConfig.headerFields.map(fieldId => (
                  <FieldRenderer key={fieldId} item={item} fieldId={fieldId} options={{ displayAs: 'indicator' }} />
                ))}
              </div>
            </div>

            {/* Card Content */}
            <div className="px-6 pb-6">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                <FieldRenderer item={item} fieldId={viewConfig.titleField} />
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                <FieldRenderer item={item} fieldId={viewConfig.descriptionField} />
              </p>

              {/* Status and Category */}
              <div className="flex items-center gap-2 mb-4">
                <FieldRenderer item={item} fieldId={viewConfig.statusField} />
                <FieldRenderer item={item} fieldId={viewConfig.categoryField} />
              </div>

              {/* Tags, Progress, Assignee */}
              <div className="space-y-4 mb-4">
                <FieldRenderer item={item} fieldId={viewConfig.tagsField} />
                <FieldRenderer item={item} fieldId={viewConfig.progressField} />
                <FieldRenderer item={item} fieldId={viewConfig.assigneeField} />
              </div>

              {/* Metrics and Date */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <FieldRenderer item={item} fieldId={viewConfig.metricsField} />
                <FieldRenderer item={item} fieldId={viewConfig.dateField} />
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
      {ctaElement}
    </div>
  )
}
```

## File: src/features/dynamic-view/components/views/ListView.tsx
```typescript
import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { GenericItem } from '../../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import { EmptyState } from '../shared/EmptyState'
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'

export function ListView({ data, ctaElement }: { data: GenericItem[], ctaElement?: ReactNode }) {
  const { config, onItemSelect, selectedItemId } = useDynamicView<string, GenericItem>();

  const listRef = useRef<HTMLDivElement>(null)
  useStaggeredAnimation(listRef, [data], { mode: 'incremental', scale: 1, y: 20, stagger: 0.05, duration: 0.4 });

  const items = Array.isArray(data) ? data : [];
  if (items.length === 0) {
    return <EmptyState />
  }

  return (
    <div ref={listRef}>
      {items.map((item: GenericItem) => {
        const isSelected = selectedItemId === item.id
        
        return (
          <div key={item.id} className="px-2">
            <div
              onClick={() => onItemSelect(item)}
              className={cn(
                "group flex items-center px-2 py-2 rounded-md transition-colors duration-200 cursor-pointer",
                "hover:bg-accent/80",
                isSelected ? "bg-accent" : "bg-transparent"
              )}
            >
              {/* Left side: Icon and Title */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-8 text-center">
                  <FieldRenderer item={item} fieldId={config.listView.iconField} className="text-xl" />
                </div>
                <div className="font-medium truncate text-card-foreground group-hover:text-primary">
                  <FieldRenderer item={item} fieldId={config.listView.titleField} />
                </div>
              </div>

              {/* Right side: Metadata */}
              <div className="flex shrink-0 items-center gap-2 sm:gap-4 md:gap-6 ml-4 text-sm text-muted-foreground">
                {config.listView.metaFields.map(fieldConfig => (
                  <div key={fieldConfig.fieldId} className={fieldConfig.className}>
                    <FieldRenderer item={item} fieldId={fieldConfig.fieldId} options={{ avatarClassName: 'w-7 h-7' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
      {ctaElement}
    </div>
  )
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
    "@radix-ui/react-scroll-area": "^1.2.10",
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
    "@faker-js/faker": "^10.1.0",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.2.8"
  }
}
```

## File: src/features/dynamic-view/types.ts
```typescript
import type { ReactNode } from 'react';

// --- GENERIC DATA & ITEM ---
export type GenericItem = Record<string, any> & { id: string };

// --- FIELD DEFINITIONS ---
// Describes a single piece of data within a GenericItem.
export type FieldType =
  | 'string'
  | 'longtext'
  | 'badge'
  | 'avatar'
  | 'progress'
  | 'date'
  | 'tags'
  | 'metrics'
  | 'thumbnail'
  | 'custom';

export interface BaseFieldDefinition<TFieldId extends string, TItem extends GenericItem> {
  id: TFieldId; // Corresponds to a key in GenericItem
  label: string;
  type: FieldType;
  // Optional custom render function for ultimate flexibility.
  render?: (item: TItem, options?: Record<string, any>) => ReactNode;
}

export interface BadgeFieldDefinition<TFieldId extends string, TItem extends GenericItem>
  extends BaseFieldDefinition<TFieldId, TItem> {
  type: 'badge';
  colorMap?: Record<string, string>; // e.g., { 'active': 'bg-green-500', 'pending': 'bg-yellow-500' }
  indicatorColorMap?: Record<string, string>; // e.g., { 'critical': 'bg-red-500' }
}

// Add other specific field types if they need unique properties
// For now, most can be handled by the base definition.

export type FieldDefinition<TFieldId extends string, TItem extends GenericItem> =
  | BaseFieldDefinition<TFieldId, TItem>
  | BadgeFieldDefinition<TFieldId, TItem>;

// --- VIEW CONFIGURATION ---
// The master configuration object that defines the entire view.

export type ViewMode = 'list' | 'cards' | 'grid' | 'table' | 'kanban' | 'calendar';

export interface ListViewConfig<TFieldId extends string> {
  iconField: TFieldId;
  titleField: TFieldId;
  metaFields: readonly {
    fieldId: TFieldId;
    className?: string;
  }[];
}

export interface CardViewConfig<TFieldId extends string> {
  thumbnailField: TFieldId;
  titleField: TFieldId;
  descriptionField: TFieldId;
  headerFields: readonly TFieldId[];
  // Specific fields to recreate the original layout
  statusField: TFieldId;
  categoryField: TFieldId;
  tagsField: TFieldId;
  progressField: TFieldId;
  assigneeField: TFieldId;
  metricsField: TFieldId;
  dateField: TFieldId;
}

export interface TableColumnConfig<TFieldId extends string> {
  fieldId: TFieldId;
  label: string;
  isSortable: boolean;
}

export interface TableViewConfig<TFieldId extends string> {
  columns: readonly TableColumnConfig<TFieldId>[];
}

export interface KanbanViewConfig<TFieldId extends string> {
  groupByField: TFieldId; // Field ID to group by (e.g., 'status')
  cardFields: {
    titleField: TFieldId;
    descriptionField: TFieldId;
    priorityField: TFieldId;
    tagsField: TFieldId;
    // footer fields
    dateField: TFieldId;
    metricsField: TFieldId; // for comments/attachments
    assigneeField: TFieldId;
  };
}

export interface CalendarViewConfig<TFieldId extends string> {
  dateField: TFieldId;
  titleField: TFieldId;
  displayFields: readonly TFieldId[];
  colorByField?: TFieldId; // Field ID to color events by (e.g., 'priority', 'status')
}

export interface ControlOption<TId extends string> {
  id: TId;
  label: string;
}

export interface FilterableFieldConfig<TFieldId extends string> {
  id: TFieldId; // fieldId
  label: string;
  options: readonly ControlOption<string>[];
}

export interface ViewConfig<
  TFieldId extends string,
  TItem extends GenericItem,
> {
  fields: readonly FieldDefinition<TFieldId, TItem>[];
  sortableFields: readonly ControlOption<TFieldId>[];
  groupableFields: readonly ControlOption<TFieldId | 'none'>[];
  filterableFields: readonly FilterableFieldConfig<TFieldId>[];

  // Layouts for each view mode
  listView: ListViewConfig<TFieldId>;
  cardView: CardViewConfig<TFieldId>;
  tableView: TableViewConfig<TFieldId>;
  kanbanView: KanbanViewConfig<TFieldId>;
  calendarView: CalendarViewConfig<TFieldId>;
  detailView: DetailViewConfig<TFieldId>;
}

// --- DETAIL VIEW ---
export interface DetailViewSection<TFieldId extends string> {
  title: string;
  fields: readonly TFieldId[];
}

export interface DetailViewConfig<TFieldId extends string> {
  header: {
    thumbnailField: TFieldId;
    titleField: TFieldId;
    descriptionField: TFieldId;
    badgeFields: readonly TFieldId[];
    progressField: TFieldId;
  };
  body: {
    sections: readonly DetailViewSection<TFieldId>[];
  };
}

// --- GENERIC CONTROL & DATA TYPES ---

export type Status = 'active' | 'pending' | 'completed' | 'archived';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface FilterConfig {
  searchTerm: string;
  [key: string]: any; // For dynamic filter keys like status, priority
}

export interface SortConfig<TFieldId extends string> {
  key: TFieldId;
  direction: 'asc' | 'desc';
}

export type GroupableField<TFieldId extends string> = TFieldId | 'none';

export type CalendarDateProp<TFieldId extends string> = TFieldId;
export type CalendarDisplayProp<TFieldId extends string> = TFieldId;
export type CalendarColorProp<TFieldId extends string> = TFieldId | 'none';

// --- STATS ---
export type StatItem = {
  title: string;
  value: string;
  icon: ReactNode;
  change: string;
  trend: 'up' | 'down';
  chartData?: number[];
};
```

## File: src/pages/DataDemo/store/dataDemo.store.tsx
```typescript
import { create } from "zustand";
import { mockDataItems } from "@/pages/DataDemo/data/mockData";
import type {
  GroupableField,
  FilterConfig,
  SortConfig,
} from "@/features/dynamic-view/types";

import type { DataDemoItem } from "../data/DataDemoItem";
// --- State and Actions ---
interface DataDemoState {
  items: DataDemoItem[];
  hasMore: boolean;
  isLoading: boolean;
  isInitialLoading: boolean;
  totalItemCount: number;
}

interface DataDemoActions {
  loadData: (params: {
    page: number;
    groupBy: GroupableField<string> | "none";
    filters: FilterConfig;
    sortConfig: SortConfig<string> | null;
    isFullLoad?: boolean;
  }) => void;
  updateItem: (itemId: string, updates: Partial<DataDemoItem>) => void;
}

const defaultState: DataDemoState = {
  items: [],
  hasMore: true,
  isLoading: true,
  isInitialLoading: true,
  totalItemCount: 0,
};

// Cast the mock data to our strict type to satisfy the store's requirements
const typedMockData = mockDataItems as DataDemoItem[];

// --- Store Implementation ---
export const useDataDemoStore = create<DataDemoState & DataDemoActions>(
  (set) => ({
    ...defaultState,

    loadData: ({ page, groupBy, filters, sortConfig, isFullLoad }) => {
      set({ isLoading: true, ...(page === 1 && { isInitialLoading: true }) });
      const isFirstPage = page === 1;

      const filteredAndSortedData = (() => {
        const filteredItems = typedMockData.filter((item) => {
          const searchTermMatch =
            item.title
              .toLowerCase()
              .includes(filters.searchTerm.toLowerCase()) ||
            item.description
              .toLowerCase()
              .includes(filters.searchTerm.toLowerCase());
          const statusMatch =
            filters.status.length === 0 || filters.status.includes(item.status);
          const priorityMatch =
            filters.priority.length === 0 ||
            filters.priority.includes(item.priority);
          return searchTermMatch && statusMatch && priorityMatch;
        });

        if (sortConfig) {
          filteredItems.sort((a, b) => {
            const getNestedValue = (obj: DataDemoItem, path: string): unknown =>
              path.split(".").reduce((o: any, k) => (o || {})[k], obj);

            const aValue = getNestedValue(a, sortConfig.key);
            const bValue = getNestedValue(b, sortConfig.key);

            if (aValue === undefined || bValue === undefined) return 0;
            if (typeof aValue === "string" && typeof bValue === "string") {
              return sortConfig.direction === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
            }
            if (typeof aValue === "number" && typeof bValue === "number") {
              return sortConfig.direction === "asc"
                ? aValue - bValue
                : bValue - aValue;
            }
            if (
              sortConfig.key === "updatedAt" ||
              sortConfig.key === "createdAt"
            ) {
              if (typeof aValue === "string" && typeof bValue === "string") {
                return sortConfig.direction === "asc"
                  ? new Date(aValue).getTime() - new Date(bValue).getTime()
                  : new Date(bValue).getTime() - new Date(aValue).getTime();
              }
            }
            return 0;
          });
        }
        return filteredItems;
      })();

      const totalItemCount = filteredAndSortedData.length;

      setTimeout(
        () => {
          if (groupBy !== "none" || isFullLoad) {
            set({
              items: filteredAndSortedData,
              hasMore: false,
              isLoading: false,
              isInitialLoading: false,
              totalItemCount,
            });
            return;
          }

          const pageSize = 12;
          const newItems = filteredAndSortedData.slice(
            (page - 1) * pageSize,
            page * pageSize,
          );

          set((state) => ({
            items: isFirstPage ? newItems : [...state.items, ...newItems],
            hasMore: totalItemCount > page * pageSize,
            isLoading: false,
            isInitialLoading: false,
            totalItemCount,
          }));
        },
        isFirstPage ? 1500 : 500,
      );
    },

    updateItem: (itemId, updates) => {
      // In a real app, this would be an API call. Here we update the mock source.
      const itemIndex = typedMockData.findIndex((i) => i.id === itemId);
      if (itemIndex > -1) {
        typedMockData[itemIndex] = { ...typedMockData[itemIndex], ...updates };
      }

      // Also update the currently loaded items in the store's state for UI consistency
      set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item,
        ),
      }));
    },
  }),
);

export const useSelectedItem = (itemId?: string) => {
  if (!itemId) return null;
  return (
    (typedMockData.find((item) => item.id === itemId) as DataDemoItem) ?? null
  );
};
```

## File: src/hooks/useRightPaneContent.hook.tsx
```typescript
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Component,
  Bell,
  SlidersHorizontal,
  Database,
  MessageSquare,
  ExternalLink,
  Share,
} from 'lucide-react';

import { DynamicViewProvider } from '@/features/dynamic-view/DynamicViewContext';
import { Button } from '@/components/ui/button';
import { DashboardContent } from "@/pages/Dashboard";
import { SettingsContent } from "@/features/settings/SettingsContent";
import { ToasterDemo } from "@/pages/ToasterDemo";
import { NotificationsPage } from "@/pages/Notifications";
import DataDemoPage from "@/pages/DataDemo/index";
import { DetailPanel } from '@/features/dynamic-view/components/shared/DetailPanel';
import { dataDemoViewConfig } from '@/pages/DataDemo/DataDemo.config';
import { mockDataItems } from "@/pages/DataDemo/data/mockData";
import type { DataDemoItem } from '@/pages/DataDemo/data/DataDemoItem';
import { MessagingContent } from "@/pages/Messaging/components/MessagingContent";
import type { AppShellState } from '@/store/appShell.store';

export function useRightPaneContent(sidePaneContent: AppShellState['sidePaneContent']) {
  const { itemId, conversationId } = useParams<{ itemId: string; conversationId: string }>();

  const staticContentMap = useMemo(() => ({
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
      content: <div className="p-6"><SettingsContent /></div>,
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

  const contentMap = useMemo(() => ({
    ...staticContentMap,
    messaging: {
      title: "Conversation",
      icon: MessageSquare,
      page: "messaging",
      content: <MessagingContent conversationId={conversationId} />,
    },
  }), [conversationId, staticContentMap]);

  const selectedItem = useMemo(() => {
    if (!itemId) return null;
    return (mockDataItems.find(item => item.id === itemId) as DataDemoItem) ?? null;
  }, [itemId]);

  const { meta, content } = useMemo(() => {
    if (sidePaneContent === 'dataItem' && selectedItem) {
      return {
        meta: { title: "Item Details", icon: Database, page: `data-demo/${itemId}` },
        content: (
          <DynamicViewProvider
            viewConfig={dataDemoViewConfig}
            items={mockDataItems as DataDemoItem[]}
            isLoading={false}
            isInitialLoading={false}
            totalItemCount={0}
            hasMore={false}
            viewMode="list"
            filters={{ searchTerm: "" }}
            sortConfig={null}
            groupBy="none"
            activeGroupTab=""
            page={1}
            onViewModeChange={() => {}}
            onFiltersChange={() => {}}
            onSortChange={() => {}}
            onGroupByChange={() => {}}
            onActiveGroupTabChange={() => {}}
            onPageChange={() => {}}
            onItemSelect={() => {}}
          >
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <DetailPanel item={selectedItem} config={dataDemoViewConfig.detailView} />
              </div>
              {/* Application-specific actions can be composed here */}
              <div className="p-6 border-t border-border/50 bg-card/30">
                <div className="flex gap-3">
                  <Button className="flex-1" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Project
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </DynamicViewProvider>
        ),
      };
    }
    const mappedContent = contentMap[sidePaneContent as keyof typeof contentMap] || contentMap.details;
    return {
      meta: mappedContent,
      content: mappedContent.content,
    };
  }, [sidePaneContent, selectedItem, contentMap, itemId]);

  return { meta, content };
}
```

## File: src/hooks/useAppViewManager.hook.ts
```typescript
import { useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAppShellStore, type AppShellState, type ActivePage } from '@/store/appShell.store';
import type { GenericItem, ViewMode, SortConfig, GroupableField, CalendarDateProp, CalendarDisplayProp, CalendarColorProp, FilterConfig } from '@/features/dynamic-view/types';
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
  const q = searchParams.get('q');
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const sort = searchParams.get('sort');
  const calDate = searchParams.get('calDate');
  const calDisplay = searchParams.get('calDisplay');
  const calLimit = searchParams.get('calLimit');
  const calColor = searchParams.get('calColor');

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
  const viewMode = useMemo(() => (searchParams.get('dataView') as ViewMode) || 'list', [searchParams]);
	const page = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams]);
	const groupBy = useMemo(() => (searchParams.get('groupBy') as GroupableField<string> | 'none') || 'none', [searchParams]);
	const activeGroupTab = useMemo(() => searchParams.get('tab') || 'all', [searchParams]);
	const filters = useMemo<FilterConfig>(
		() => ({
			searchTerm: q || '',
			status: (status?.split(',') || []).filter(Boolean),
			priority: (priority?.split(',') || []).filter(Boolean),
		}),
		[q, status, priority],
	);
	const sortConfig = useMemo<SortConfig<string> | null>(() => {
		const sortParam = sort;
		if (!sortParam) return { key: 'updatedAt', direction: 'desc' }; // Default sort
		if (sortParam === 'default') return null;

		const [key, direction] = sortParam.split('-');
		return { key, direction: direction as 'asc' | 'desc' };
	}, [sort]);
  const calendarDateProp = useMemo(() => (calDate || 'dueDate') as CalendarDateProp<string>, [calDate]);
  const calendarDisplayProps = useMemo(
    () => {
      if (calDisplay === null) return []; // Default is now nothing
      if (calDisplay === '') return []; // Explicitly empty is also nothing
      return calDisplay.split(',') as CalendarDisplayProp<string>[];
    },
    [calDisplay]
  );
  const calendarItemLimit = useMemo(() => {
    const limit = parseInt(calLimit || '3', 10);
    if (calLimit === 'all') return 'all';
    return isNaN(limit) ? 3 : limit;
  }, [calLimit]);
  const calendarColorProp = useMemo(() => (calColor || 'none') as CalendarColorProp<string>, [calColor]);

  // --- MUTATOR ACTIONS ---

  const handleParamsChange = useCallback(
		(newParams: Record<string, string | number | string[] | null | undefined>, resetPage = false) => {
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
  const setViewMode = (mode: ViewMode) => handleParamsChange({ dataView: mode === 'list' ? null : mode });
  const setGroupBy = (val: string) => handleParamsChange({ groupBy: val === 'none' ? null : val }, true);
  const setActiveGroupTab = (tab: string) => handleParamsChange({ tab: tab === 'all' ? null : tab });
  const setFilters = (newFilters: FilterConfig) => {
    handleParamsChange({ q: newFilters.searchTerm, status: newFilters.status, priority: newFilters.priority }, true);
  }
  const setSort = (config: SortConfig<string> | null) => {
    if (!config) {
      handleParamsChange({ sort: null }, true);
    } else {
      handleParamsChange({ sort: `${config.key}-${config.direction}` }, true);
    }
  }
  const setTableSort = (field: string) => {
    let newSort: string | null = `${field}-desc`;
    if (sortConfig && sortConfig.key === field) {
      if (sortConfig.direction === 'desc') newSort = `${field}-asc`;
      else if (sortConfig.direction === 'asc') newSort = null;
    }
    handleParamsChange({ sort: newSort }, true);
  };
  const setPage = (newPage: number) => handleParamsChange({ page: newPage > 1 ? newPage.toString() : null });

  // Calendar specific actions
  const setCalendarDateProp = (prop: CalendarDateProp<string>) => handleParamsChange({ calDate: prop === 'dueDate' ? null : prop });
  const setCalendarDisplayProps = (props: CalendarDisplayProp<string>[]) => {
    // Check for default state to keep URL clean
    const isDefault = props.length === 0;
    handleParamsChange({ calDisplay: isDefault ? null : props.join(',') });
  };
  const setCalendarItemLimit = (limit: number | 'all') => handleParamsChange({ calLimit: limit === 3 ? null : String(limit) });
  const setCalendarColorProp = (prop: CalendarColorProp<string>) => handleParamsChange({ calColor: prop === 'none' ? null : prop });

  const onItemSelect = useCallback((item: GenericItem) => {
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
    calendarDateProp,
    calendarDisplayProps,
    calendarItemLimit,
    calendarColorProp,
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
    setCalendarDateProp,
    setCalendarDisplayProps,
    setCalendarItemLimit,
    setCalendarColorProp,
  }), [
    bodyState, sidePaneContent, currentActivePage, itemId, messagingView, viewMode,
    page, groupBy, activeGroupTab, filters, sortConfig, calendarDateProp,
    calendarDisplayProps, calendarItemLimit, calendarColorProp,
    navigateTo, openSidePane, closeSidePane, toggleSidePane, toggleSplitView, setNormalView, setMessagingView,
    switchSplitPanes, closeSplitPane, onItemSelect, setViewMode, setGroupBy, setActiveGroupTab, setFilters,
    setSort, setTableSort, setPage, setCalendarDateProp, setCalendarDisplayProps, setCalendarItemLimit, setCalendarColorProp
  ]);
}
```

## File: src/pages/DataDemo/index.tsx
```typescript
import { useRef, useEffect, useCallback } from "react";
import {
  Layers,
  AlertTriangle,
  PlayCircle,
  TrendingUp,
  CheckCircle,
  Clock,
  Archive,
  PlusCircle,
} from "lucide-react";
import { DynamicView } from "@/features/dynamic-view/DynamicView";
import { PageLayout } from "@/components/shared/PageLayout";
import { useScrollToBottom } from "@/hooks/useScrollToBottom.hook";
import { ScrollToBottomButton } from "@/components/shared/ScrollToBottomButton";
import { mockDataItems } from "./data/mockData";
import { useAppViewManager } from "@/hooks/useAppViewManager.hook";
import { useDataDemoStore } from "./store/dataDemo.store";
import {} from "./store/dataDemo.store";
import { AddDataItemCta } from "@/features/dynamic-view/components/shared/AddDataItemCta";

import { dataDemoViewConfig } from "./DataDemo.config";
import type { StatItem } from "@/features/dynamic-view/types";

export default function DataDemoPage() {
  const {
    viewMode,
    groupBy,
    activeGroupTab,
    setGroupBy,
    setSort,
    setActiveGroupTab,
    page,
    filters,
    sortConfig,
    setPage,
    setFilters,
    setViewMode,
    onItemSelect,
  } = useAppViewManager();

  const {
    items: allItems,
    hasMore,
    isLoading,
    isInitialLoading,
    totalItemCount,
    loadData,
  } = useDataDemoStore((state) => ({
    items: state.items,
    hasMore: state.hasMore,
    isLoading: state.isLoading,
    isInitialLoading: state.isInitialLoading,
    totalItemCount: state.totalItemCount,
    loadData: state.loadData,
  }));

  const scrollRef = useRef<HTMLDivElement>(null);

  // Note: The `DynamicViewProvider` needs `GenericItem[]`.
  // Our store uses `GenericItem` so no cast is needed.

  // Calculate stats from data
  const totalItems = mockDataItems.length;
  const { showScrollToBottom, scrollToBottom, handleScroll } =
    useScrollToBottom(scrollRef);

  const activeItems = mockDataItems.filter(
    (item) => item.status === "active",
  ).length;
  const highPriorityItems = mockDataItems.filter(
    (item) => item.priority === "high" || item.priority === "critical",
  ).length;
  const avgCompletion =
    totalItems > 0
      ? Math.round(
          mockDataItems.reduce(
            (acc, item) => acc + item.metrics.completion,
            0,
          ) / totalItems,
        )
      : 0;

  const stats: StatItem[] = [
    {
      title: "Total Projects",
      value: totalItems.toString(),
      icon: <Layers className="w-5 h-5" />,
      change: "+5.2% this month",
      trend: "up" as const,
      chartData: [120, 125, 122, 130, 135, 138, 142],
    },
    {
      title: "Active Projects",
      value: activeItems.toString(),
      icon: <PlayCircle className="w-5 h-5" />,
      change: "+2 this week",
      trend: "up" as const,
      chartData: [45, 50, 48, 55, 53, 60, 58],
    },
    {
      title: "High Priority",
      value: highPriorityItems.toString(),
      icon: <AlertTriangle className="w-5 h-5" />,
      change: "-1 from last week",
      trend: "down" as const,
      chartData: [25, 26, 28, 27, 26, 24, 23],
    },
    {
      title: "Avg. Completion",
      value: `${avgCompletion}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      change: "+3.2%",
      trend: "up" as const,
      chartData: [65, 68, 70, 69, 72, 75, 78],
    },
    {
      title: "Completion Rate",
      value: "88%",
      icon: <CheckCircle className="w-5 h-5" />,
      change: "+1.5% this month",
      trend: "up" as const,
      chartData: [80, 82, 81, 84, 85, 87, 88],
    },
    {
      title: "Overdue Items",
      value: "8",
      icon: <Clock className="w-5 h-5" />,
      change: "-3 this week",
      trend: "down" as const,
    },
    {
      title: "New This Week",
      value: "12",
      icon: <PlusCircle className="w-5 h-5" />,
      change: "+2 from last week",
      trend: "up" as const,
    },
    {
      title: "Archived Projects",
      value: "153",
      icon: <Archive className="w-5 h-5" />,
      change: "+20 this month",
      trend: "up" as const,
    },
  ];

  useEffect(() => {
    loadData({
      page,
      groupBy,
      filters,
      sortConfig,
      isFullLoad: viewMode === "calendar" || viewMode === "kanban",
    });
  }, [page, groupBy, filters, sortConfig, loadData, viewMode]);

  const observer = useRef<IntersectionObserver>();
  const loaderRef = useCallback(
    (node: Element | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, page, setPage],
  );

  useEffect(() => {
    // Auto-group by status when switching to kanban view for the first time
    if (viewMode === "kanban" && groupBy === "none") {
      setGroupBy("status");
      setSort(null); // Kanban is manually sorted, so disable programmatic sort
    }
    // For calendar view, we don't want grouping.
    else if (viewMode === "calendar" && groupBy !== "none") {
      setGroupBy("none");
    }
  }, [viewMode, groupBy, setGroupBy, setSort]);

  return (
    <PageLayout scrollRef={scrollRef} onScroll={handleScroll}>
      <DynamicView
        viewConfig={dataDemoViewConfig}
        items={allItems}
        isLoading={isLoading}
        isInitialLoading={isInitialLoading}
        totalItemCount={totalItemCount}
        hasMore={hasMore}
        // Controlled state
        viewMode={viewMode}
        filters={filters}
        sortConfig={sortConfig}
        groupBy={groupBy}
        activeGroupTab={activeGroupTab}
        page={page}
        // Callbacks
        onViewModeChange={setViewMode}
        onFiltersChange={setFilters}
        onSortChange={setSort}
        onGroupByChange={setGroupBy}
        onActiveGroupTabChange={setActiveGroupTab}
        onPageChange={setPage}
        onItemSelect={onItemSelect}
        loaderRef={loaderRef}
        scrollContainerRef={scrollRef}
        statsData={stats}
        // Custom Renderers
        renderCta={(viewMode, ctaProps) => (
          <AddDataItemCta viewMode={viewMode} colSpan={ctaProps.colSpan} />
        )}
      />

      <ScrollToBottomButton
        isVisible={showScrollToBottom}
        onClick={scrollToBottom}
      />
    </PageLayout>
  );
}
```
