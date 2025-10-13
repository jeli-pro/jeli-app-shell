# Directory Structure
```
src/
  pages/
    DataDemo/
      components/
        DataToolbar.tsx
        DataViewModeSelector.tsx
      index.tsx
      types.ts
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

## File: src/pages/DataDemo/components/DataToolbar.tsx
```typescript
import * as React from 'react'
import { Check, ListFilter, Search, SortAsc } from 'lucide-react'

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

import type { SortConfig, SortableField, Status, Priority } from '../types'

export interface FilterConfig {
  searchTerm: string
  status: Status[]
  priority: Priority[]
}

interface DataToolbarProps {
  filters: FilterConfig
  onFiltersChange: (filters: FilterConfig) => void
  sortConfig: SortConfig | null
  onSortChange: (config: SortConfig | null) => void
}

const statusOptions: { value: Status; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const sortOptions: { value: SortableField, label: string }[] = [
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'title', label: 'Title' },
  { value: 'status', label: 'Status' },
  { value: 'priority', label: 'Priority' },
  { value: 'metrics.completion', label: 'Progress' },
]


export function DataToolbar({
  filters,
  onFiltersChange,
  sortConfig,
  onSortChange,
}: DataToolbarProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, searchTerm: event.target.value })
  }
  
  const activeFilterCount = filters.status.length + filters.priority.length

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
      {/* Left side: Search, Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9 w-full sm:w-64"
            value={filters.searchTerm}
            onChange={handleSearchChange}
          />
        </div>

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
            <CombinedFilter filters={filters} onFiltersChange={onFiltersChange} />
          </PopoverContent>
        </Popover>

        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={() => onFiltersChange({ searchTerm: filters.searchTerm, status: [], priority: [] })}>Reset</Button>
        )}
      </div>

      {/* Right side: Sorter */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-start md:justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto justify-start">
              <SortAsc className="mr-2 h-4 w-4" />
              Sort by: {sortOptions.find(o => o.value === sortConfig?.key)?.label || 'Default'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={`${sortConfig?.key || 'default'}-${sortConfig?.direction || ''}`}
              onValueChange={(value) => {
                if (value.startsWith('default')) {
                  onSortChange(null)
                } else {
                  const [key, direction] = value.split('-')
                  onSortChange({ key: key as SortableField, direction: direction as 'asc' | 'desc' })
                }
              }}
            >
              <DropdownMenuRadioItem value="default-">Default</DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              {sortOptions.map(option => (
                <React.Fragment key={option.value}>
                  <DropdownMenuRadioItem value={`${option.value}-desc`}>{option.label} (Desc)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={`${option.value}-asc`}>{option.label} (Asc)</DropdownMenuRadioItem>
                </React.Fragment>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

function CombinedFilter({
  filters,
  onFiltersChange,
}: {
  filters: FilterConfig;
  onFiltersChange: (filters: FilterConfig) => void;
}) {
  const selectedStatus = new Set(filters.status);
  const selectedPriority = new Set(filters.priority);

  const handleStatusSelect = (status: Status) => {
    selectedStatus.has(status) ? selectedStatus.delete(status) : selectedStatus.add(status);
    onFiltersChange({ ...filters, status: Array.from(selectedStatus) });
  };

  const handlePrioritySelect = (priority: Priority) => {
    selectedPriority.has(priority) ? selectedPriority.delete(priority) : selectedPriority.add(priority);
    onFiltersChange({ ...filters, priority: Array.from(selectedPriority) });
  };

  const hasActiveFilters = filters.status.length > 0 || filters.priority.length > 0;

  return (
    <Command>
      <CommandInput placeholder="Filter by..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Status">
          {statusOptions.map((option) => {
            const isSelected = selectedStatus.has(option.value);
            return (
              <CommandItem
                key={option.value}
                onSelect={() => handleStatusSelect(option.value)}
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

        <CommandSeparator />

        <CommandGroup heading="Priority">
          {priorityOptions.map((option) => {
            const isSelected = selectedPriority.has(option.value);
            return (
              <CommandItem
                key={option.value}
                onSelect={() => handlePrioritySelect(option.value)}
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

        {hasActiveFilters && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => onFiltersChange({ ...filters, status: [], priority: [] })}
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

## File: postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
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

## File: src/pages/DataDemo/components/DataViewModeSelector.tsx
```typescript
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { List, Grid3X3, LayoutGrid, Table } from 'lucide-react'
import type { ViewMode } from '../types'

interface DataViewModeSelectorProps {
  viewMode: ViewMode
  onChange: (mode: ViewMode) => void
}

const viewModes = [
  { id: 'list' as ViewMode, label: 'List', icon: List, description: 'Compact list with details' },
  { id: 'cards' as ViewMode, label: 'Cards', icon: LayoutGrid, description: 'Rich card layout' },
  { id: 'grid' as ViewMode, label: 'Grid', icon: Grid3X3, description: 'Masonry grid view' },
  { id: 'table' as ViewMode, label: 'Table', icon: Table, description: 'Structured data table' }
]

export function DataViewModeSelector({ viewMode, onChange }: DataViewModeSelectorProps) {
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
  }, []) // Only run once on mount

  useEffect(() => {
    if (!isTransitioning) {
      updateIndicatorPosition()
    }
  }, [updateIndicatorPosition, viewMode, isTransitioning])

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
            onClick={() => onChange(mode.id)}
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

## File: src/pages/DataDemo/index.tsx
```typescript
import { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react'
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
import { capitalize, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { AnimatedLoadingSkeleton } from './components/AnimatedLoadingSkeleton'
import { StatChartCard } from './components/StatChartCard'
import { DataToolbar, FilterConfig } from './components/DataToolbar'
import { mockDataItems } from './data/mockData'
import type { DataItem, ViewMode, SortConfig, SortableField, GroupableField } from './types'

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
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [filters, setFilters] = useState<FilterConfig>({
    searchTerm: '',
    status: [],
    priority: [],
  })
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'updatedAt', direction: 'desc' })
  const [groupBy, setGroupBy] = useState<GroupableField | 'none'>('none')
  const [activeGroupTab, setActiveGroupTab] = useState('all')
  
  const groupOptions: { id: GroupableField | 'none'; label: string }[] = [
    { id: 'none', label: 'None' }, { id: 'status', label: 'Status' }, { id: 'priority', label: 'Priority' }, { id: 'category', label: 'Category' }
  ]
  const [items, setItems] = useState<DataItem[]>([])
  const [page, setPage] = useState(0) // Start at 0 to trigger initial load effect
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const observer = useRef<IntersectionObserver>()
  const navigate = useNavigate()
  const { itemId } = useParams<{ itemId: string }>()

  const selectedItem = useMemo(() => {
    if (!itemId) return null
    return mockDataItems.find(item => item.id === itemId) ?? null
  }, [itemId])

  const isInitialLoading = isLoading && items.length === 0

  // Step 1: Centralized data filtering and sorting from the master list
  const filteredAndSortedData = useMemo(() => {
    let filteredItems = mockDataItems.filter(item => {
      const searchTermMatch =
        item.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.searchTerm.toLowerCase())

      const statusMatch = filters.status.length === 0 || filters.status.includes(item.status)
      const priorityMatch = filters.priority.length === 0 || filters.priority.includes(item.priority)

      return searchTermMatch && statusMatch && priorityMatch
    })

    if (sortConfig) {
      filteredItems.sort((a, b) => {
        let aValue: any
        let bValue: any

        const getNestedValue = (obj: any, path: string) => path.split('.').reduce((o, k) => (o || {})[k], obj)

        aValue = getNestedValue(a, sortConfig.key)
        bValue = getNestedValue(b, sortConfig.key)

        if (aValue === undefined || bValue === undefined) return 0;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
        }
        // Date sorting (assuming ISO strings)
        if (sortConfig.key === 'updatedAt' || sortConfig.key === 'createdAt') {
            return sortConfig.direction === 'asc'
                ? new Date(aValue).getTime() - new Date(aValue).getTime()
                : new Date(bValue).getTime() - new Date(bValue).getTime()
        }
        return 0
      })
    }

    return filteredItems
  }, [filters, sortConfig, groupBy])

  // Calculate stats from data
  const totalItems = mockDataItems.length
  const activeItems = mockDataItems.filter(item => item.status === 'active').length
  const highPriorityItems = mockDataItems.filter(item => item.priority === 'high' || item.priority === 'critical').length
  const avgCompletion = totalItems > 0 ? Math.round(
    mockDataItems.reduce((acc, item) => acc + item.metrics.completion, 0) / totalItems
  ) : 0

  // Reset pagination when filters or sort change
  useEffect(() => {
    setItems([])
    setActiveGroupTab('all')
    setPage(0) // This will be incremented to 1 in the loader `useEffect`, triggering a fresh load
    setHasMore(true)
    setIsLoading(true)
    // Timeout prevents flicker and ensures loading state is visible for new filter/sort/group
    setTimeout(() => {
      if (groupBy !== 'none') {
        setItems(filteredAndSortedData);
        setHasMore(false);
        setIsLoading(false);
      } else {
        setPage(1)
      }
    }, 100);
  }, [filteredAndSortedData, groupBy])

  // Infinite scroll logic
  useEffect(() => {
    if (page === 0) return;
    if (groupBy !== 'none') return; // Pagination is disabled when grouping

    const fetchItems = () => {
      setIsLoading(true);
      const isFirstPage = page === 1
      
      const pageSize = 12;
      const newItems = filteredAndSortedData.slice((page - 1) * pageSize, page * pageSize);
      
      // Simulate network delay, longer for initial load to showcase skeleton
      setTimeout(() => {
        // Double-check in case groupBy changed during timeout
        if (groupBy === 'none') {
          setItems(prev => (isFirstPage ? newItems : [...prev, ...newItems]))
          setHasMore(filteredAndSortedData.length > page * pageSize)
          setIsLoading(false)
        }
      }, isFirstPage && items.length === 0 ? 1500 : 500)
    };

    if (hasMore) fetchItems();
  }, [page, groupBy, filteredAndSortedData, hasMore]);

  const loaderRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

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

  const handleSortChange = (config: SortConfig | null) => {
    setSortConfig(config)
  }

  // For table view header clicks
  const handleTableSort = (field: SortableField) => {
    if (sortConfig?.key === field) {
      if (sortConfig.direction === 'desc') {
        // Cycle: desc -> asc
        setSortConfig({ key: field, direction: 'asc' })
      } else {
        // Cycle: asc -> default
        setSortConfig(null)
      }
    } else {
      // New field, default to desc
      setSortConfig({ key: field, direction: 'desc' })
    }
  }

  const handleFilterChange = (newFilters: FilterConfig) => {
    setFilters(newFilters)
  }
  
  // Handle item selection and open side panel
  const handleItemSelect = (item: DataItem) => {
    navigate(`/data-demo/${item.id}`)
  }

  const groupTabs = useMemo(() => {
    if (groupBy === 'none' || !filteredAndSortedData.length) return []

    const groupCounts = filteredAndSortedData.reduce((acc, item) => {
      const groupKey = String(item[groupBy as GroupableField])
      acc[groupKey] = (acc[groupKey] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const sortedGroups = Object.keys(groupCounts).sort((a, b) => a.localeCompare(b))

    const createLabel = (text: string, count: number, isActive: boolean) => (
      <>
        {text}
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={cn(
            "transition-colors duration-300 text-xs font-semibold",
            !isActive && "group-hover:bg-accent group-hover:text-accent-foreground"
          )}
        >
          {count}
        </Badge>
      </>
    )

    return [
      { id: 'all', label: createLabel('All', filteredAndSortedData.length, activeGroupTab === 'all') },
      ...sortedGroups.map(g => ({
        id: g,
        label: createLabel(capitalize(g), groupCounts[g], activeGroupTab === g),
      })),
    ]
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
    return items.filter(item => String(item[groupBy as GroupableField]) === activeGroupTab);
  }, [items, groupBy, activeGroupTab]);

  const commonViewProps = {
    onItemSelect: handleItemSelect,
    selectedItem,
  };

  const totalItemCount = filteredAndSortedData.length;

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
                : `Showing ${totalItemCount} item(s)`}
            </p>
          </div>
          <DataViewModeSelector viewMode={viewMode} onChange={setViewMode} />
        </div>

        {/* Stats Section */}
        {!isInitialLoading && (
          <div ref={statsRef} className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
            {stats.map((stat) =>
              stat.type === 'chart' ? (
                <StatChartCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  trend={stat.trend}
                  icon={stat.icon}
                  chartData={stat.chartData}
                />
              ) : null
            )}
          </div>
        )}

        {/* Controls Area */}
        <div className="space-y-6">
          <DataToolbar
            filters={filters}
            onFiltersChange={handleFilterChange}
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
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
                <DropdownMenuRadioGroup value={groupBy} onValueChange={(val) => setGroupBy(val as GroupableField | 'none')}>
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
                    onSort={handleTableSort} 
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
          {!isLoading && !hasMore && totalItemCount > 0 && !isInitialLoading && groupBy === 'none' && (
            <p className="text-muted-foreground">You've reached the end.</p>
          )}
        </div>
      </div>
    </PageLayout>
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
import React, { useEffect, useMemo } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
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

// Import page/content components
import { DashboardContent } from "./pages/Dashboard";
import { SettingsPage } from "./pages/Settings";
import { ToasterDemo } from "./pages/ToasterDemo";
import { NotificationsPage } from "./pages/Notifications";
import { DataDetailPanel } from "./pages/DataDemo/components/DataDetailPanel";
import { mockDataItems } from "./pages/DataDemo/data/mockData";
import DataDemoPage from "./pages/DataDemo";
import { SettingsContent } from "./features/settings/SettingsContent";
import { LoginPage } from "./components/auth/LoginPage";

// Import icons
import {
  LayoutDashboard,
  Settings,
  Component,
  Bell,
  SlidersHorizontal,
  ChevronsLeftRight,
  Search,
  Filter,
  Plus,
  ChevronRight,
  Rocket,
  Layers,
  SplitSquareHorizontal,
  Database,
} from "lucide-react";
import { BODY_STATES } from "./lib/utils";
import { cn } from "./lib/utils";

// Wrapper for LoginPage to provide auth handlers
function LoginPageWrapper() {
  const { login, forgotPassword } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      navigate("/");
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
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

// The main layout for authenticated parts of the application
function ProtectedLayout() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

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
  const {
    bodyState,
    dispatch,
  } = useAppShell();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { itemId } = useParams<{ itemId: string }>();

  useEffect(() => {
    const pane = searchParams.get('sidePane');
    const view = searchParams.get('view');
    const right = searchParams.get('right');

    // Case 1: A specific item is selected via URL path. This takes precedence.
    // This will render the data list in main content, and item detail in a pane.
    if (itemId) {
      dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: 'dataItem' });
      // Allow user to still use split view with a direct item link
      if (view === 'split') {
          dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SPLIT_VIEW });
      } else {
          dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SIDE_PANE });
      }
    } 
    // Case 2: A generic side pane is requested via query param.
    else if (pane) {
      dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: pane as any });
      dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SIDE_PANE });
    } 
    // Case 3: Split view is requested via query param.
    else if (view === 'split' && right) {
      dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: right as any });
      dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SPLIT_VIEW });
    } 
    // Case 4: Default state, no panes.
    else {
      dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.NORMAL });
      // Clean up side pane content when not in use
      dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: 'details' });
    }
  }, [itemId, searchParams, dispatch]);

  const contentMap = {
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
      content: bodyState === BODY_STATES.SIDE_PANE ? (
        <div className="p-6">
          <SettingsContent />
        </div>
      ) : (
        <SettingsPage />
      ),
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
  } as const;

  const selectedItem = useMemo(() => {
    if (!itemId) return null
    return mockDataItems.find(item => item.id === itemId) ?? null
  }, [itemId]);

  // Derive content directly from URL to prevent flashes of incorrect content
  const sidePaneIdentifier = itemId 
    ? 'dataItem' 
    : searchParams.get('sidePane') || searchParams.get('right') || 'details';

  let rightPaneContent;
  let currentContent: { title: string, icon: React.ElementType, page?: string };

  if (sidePaneIdentifier === 'dataItem') {
    currentContent = { title: "Item Details", icon: Database };
    rightPaneContent = <DataDetailPanel item={selectedItem} onClose={() => navigate('/data-demo')} />;
  } else {
    const mappedContent = contentMap[sidePaneIdentifier as keyof typeof contentMap] || contentMap.details;
    currentContent = mappedContent;
    rightPaneContent = mappedContent.content;
  }
  
  const CurrentIcon = currentContent.icon;

  const handleMaximize = () => {
    if ("page" in currentContent && currentContent.page) {
      navigate(`/${currentContent.page}`, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleCloseSidePane = () => {
    // Use functional update to avoid stale closures with searchParams
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('sidePane');
      return newParams;
    }, { replace: true });
  };

  const handleToggleSplitView = () => {
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
  };

  const rightPaneHeader =
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
    ) : undefined;

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
        <RightPane onClose={handleCloseSidePane} header={rightPaneHeader}>{rightPaneContent}</RightPane>
      }
      commandPalette={<CommandPalette />}
    />
  );
}

function App() {
  const router = createBrowserRouter([
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
  ]);

  return (
    <ToasterProvider>
      <RouterProvider router={router} />
    </ToasterProvider>
  );
}

export default App;
```
