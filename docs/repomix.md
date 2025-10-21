# Directory Structure
```
src/
  components/
    ui/
      tooltip.tsx
  features/
    dynamic-view/
      components/
        shared/
          FieldRenderer.tsx
        views/
          CalendarView.tsx
      DynamicView.tsx
      DynamicViewContext.tsx
      types.ts
  hooks/
    useAppViewManager.hook.ts
  lib/
    utils.ts
  pages/
    DataDemo/
      data/
        DataDemoItem.ts
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

## File: src/components/ui/tooltip.tsx
```typescript
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
```

## File: src/pages/DataDemo/data/DataDemoItem.ts
```typescript
import type { GenericItem, Status, Priority } from '@/features/dynamic-view/types';

export interface DataDemoItem extends GenericItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  status: Status;
  priority: Priority;
  assignee: {
    name: string;
    email: string;
    avatar: string;
  };
  tags: string[];
  metrics: {
    views: number;
    likes: number;
    shares: number;
    completion: number;
  };
  dueDate: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
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

## File: src/lib/utils.ts
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from "date-fns"

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

export function formatDistanceToNowShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const result = formatDistanceToNow(dateObj, { addSuffix: true });

  if (result === 'less than a minute ago') return 'now';

  return result
    .replace('about ', '')
    .replace(' minutes', 'm')
    .replace(' minute', 'm')
    .replace(' hours', 'h')
    .replace(' hour', 'h')
    .replace(' days', 'd')
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

// A helper to get nested properties from an object, e.g., 'metrics.views'
export function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

export const getPrioritySolidColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-500'
    case 'high': return 'bg-orange-500'
    case 'medium': return 'bg-blue-500'
    case 'low': return 'bg-green-500'
    default: return 'bg-gray-500'
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

## File: src/pages/DataDemo/DataDemo.config.tsx
```typescript
import { FieldRenderer } from "@/features/dynamic-view/components/shared/FieldRenderer";
import type {
  ViewConfig,
  FieldDefinition,
} from "@/features/dynamic-view/types";
import type { DataDemoItem } from "./data/DataDemoItem";

const fields: readonly FieldDefinition<string, DataDemoItem>[] = [
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
] as const;

// Infer the field IDs from the const-asserted array.
type DataDemoFieldId = (typeof fields)[number]["id"];

export const dataDemoViewConfig: ViewConfig<DataDemoFieldId, DataDemoItem> = {
  // 1. Field Definitions
  fields,
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
};
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
    onItemUpdate,
    calendarDateProp = 'dueDate', // Provide default
    calendarItemLimit = 3, // Provide default
    calendarColorProp = 'none', // Provide default
    selectedItemId,
  } = useDynamicView<string, GenericItem>();
  
  // Drag & Drop State
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dropTargetDate, setDropTargetDate] = useState<Date | null>(null);
  const [activeEdge, setActiveEdge] = useState<'left' | 'right' | null>(null);
  const edgeHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentEdgeRef = useRef<'left' | 'right' | null>(null);
  const consecutiveMonthChangesRef = useRef(0);

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
    if (edgeHoverTimerRef.current) {
      clearTimeout(edgeHoverTimerRef.current);
      edgeHoverTimerRef.current = null;
    }
    currentEdgeRef.current = null;
    consecutiveMonthChangesRef.current = 0;
    setActiveEdge(null);
    setDraggedItemId(null);
    setDropTargetDate(null);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    // Safety check: ensure user is still hovering on the correct edge
    if ((direction === 'prev' && currentEdgeRef.current !== 'left') || (direction === 'next' && currentEdgeRef.current !== 'right')) {
      return;
    }

    if (direction === 'prev') {
      setDirection(-1);
      setCurrentDate(current => subMonths(current, 1));
    } else {
      setDirection(1);
      setCurrentDate(current => addMonths(current, 1));
    }

    consecutiveMonthChangesRef.current += 1;

    // Schedule next accelerated change
    const nextDelay = consecutiveMonthChangesRef.current >= 2 ? 150 : 300;
    edgeHoverTimerRef.current = setTimeout(() => handleMonthChange(direction), nextDelay);
  };

  const handleDragOver = (e: React.DragEvent, day: Date) => {
    e.preventDefault();
    if (!gridRef.current) return;

    const rect = gridRef.current.getBoundingClientRect();
    const edgeZoneWidth = 80; // 80px hotzone on each side

    const clearTimer = () => {
      if (edgeHoverTimerRef.current) {
        clearTimeout(edgeHoverTimerRef.current);
        edgeHoverTimerRef.current = null;
      }
    };

    // Check left edge
    if (e.clientX < rect.left + edgeZoneWidth) {
      if (currentEdgeRef.current !== 'left') {
        clearTimer();
        currentEdgeRef.current = 'left';
        consecutiveMonthChangesRef.current = 0;
        setDropTargetDate(null);
        edgeHoverTimerRef.current = setTimeout(() => handleMonthChange('prev'), 600);
      }
      setActiveEdge('left');
      return;
    }

    // Check right edge
    if (e.clientX > rect.right - edgeZoneWidth) {
      if (currentEdgeRef.current !== 'right') {
        clearTimer();
        currentEdgeRef.current = 'right';
        consecutiveMonthChangesRef.current = 0;
        setDropTargetDate(null);
        edgeHoverTimerRef.current = setTimeout(() => handleMonthChange('next'), 600);
      }
      setActiveEdge('right');
      return;
    }

    // If not in an edge zone
    clearTimer();
    setActiveEdge(null);
    currentEdgeRef.current = null;
    
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
        <div className="px-2 relative" onDragEnd={handleDragEnd}>
          {/* Left edge cue */}
          <div className={cn(
              "absolute top-0 left-2 bottom-0 w-20 bg-gradient-to-r from-primary/20 to-transparent pointer-events-none transition-opacity duration-300 z-10",
              activeEdge === 'left' ? "opacity-100" : "opacity-0"
          )} />
          {/* Right edge cue */}
          <div className={cn(
              "absolute top-0 right-2 bottom-0 w-20 bg-gradient-to-l from-primary/20 to-transparent pointer-events-none transition-opacity duration-300 z-10",
              activeEdge === 'right' ? "opacity-100" : "opacity-0"
          )} />

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
                          isSelected={!!selectedItemId && selectedItemId === item.id}
                          isDragging={!!draggedItemId && draggedItemId === item.id}
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
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@faker-js/faker": "^10.1.0",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.2.8"
  }
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
  const { itemId: pathItemId, conversationId } = useParams<{ itemId: string; conversationId: string }>();
  const { setSidebarState, sidebarState } = useAppShellStore();

  // --- DERIVED STATE FROM URL ---

  const view = searchParams.get('view');
  const sidePane = searchParams.get('sidePane');
  const sidePaneItemId = searchParams.get('itemId');
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

    // 2. Data item detail view in a pane, triggered by search param
    if (sidePaneItemId) {
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
  }, [sidePaneItemId, conversationId, view, sidePane, right]);
  
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
  const groupBy = useMemo(() => {
    const groupByParam = (searchParams.get('groupBy') as GroupableField<string> | 'none') || 'none';
    // Kanban view should default to grouping by status if no group is specified
    if (viewMode === 'kanban' && groupByParam === 'none') {
      return 'status';
    }
    return groupByParam;
  }, [searchParams, viewMode]);
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
    if (viewMode === 'kanban') return null; // Kanban is manually sorted
		const sortParam = sort;
		if (!sortParam) return { key: 'updatedAt', direction: 'desc' }; // Default sort
		if (sortParam === 'default') return null;

		const [key, direction] = sortParam.split('-');
		return { key, direction: direction as 'asc' | 'desc' };
  }, [sort, viewMode]);
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
    // This should close any kind of side pane, including dataItem
    handleParamsChange({ sidePane: null, view: null, right: null, itemId: null });
  }, [handleParamsChange]);

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
		handleParamsChange({ itemId: item.id, sidePane: null });
	}, [handleParamsChange]);

  const setMessagingView = (view: TaskView) => handleParamsChange({ messagingView: view });

  // The final active item ID is either from the path (main view) or a search param (pane view)
  const itemId = pathItemId || sidePaneItemId;

  return useMemo(() => ({
    // State
    bodyState,
    sidePaneContent,
    currentActivePage,
    pathItemId, // Expose for main content decisions
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
    bodyState, sidePaneContent, currentActivePage, pathItemId, itemId, messagingView, viewMode,
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
import { useDataDemoStore, useSelectedItem } from "./store/dataDemo.store";
import { AddDataItemCta } from "@/features/dynamic-view/components/shared/AddDataItemCta";
import { DataDetailContent } from "./components/DataDetailContent";

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
    pathItemId,
  } = useAppViewManager();

  const selectedItem = useSelectedItem(pathItemId);

  const {
    items: allItems,
    hasMore,
    isLoading,
    isInitialLoading,
    totalItemCount,
    loadData,
    updateItem,
  } = useDataDemoStore((state) => ({
    items: state.items,
    hasMore: state.hasMore,
    isLoading: state.isLoading,
    isInitialLoading: state.isInitialLoading,
    totalItemCount: state.totalItemCount,
    loadData: state.loadData,
    updateItem: state.updateItem,
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

  if (pathItemId && selectedItem) {
    // Render detail view as the main content
    return <DataDetailContent item={selectedItem} />;
  }

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
        onItemUpdate={updateItem}
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
