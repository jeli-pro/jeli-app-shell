# Directory Structure
```
src/
  features/
    dynamic-view/
      components/
        shared/
          FieldRenderer.tsx
        views/
          CalendarView.tsx
          CardView.tsx
          KanbanView.tsx
          ListView.tsx
          TableView.tsx
      types.ts
  hooks/
    useRightPaneContent.hook.tsx
  pages/
    DataDemo/
      DataDemo.config.ts
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

## File: src/features/dynamic-view/components/shared/FieldRenderer.tsx
```typescript
import { useDynamicView } from '../../DynamicViewContext';
import type { GenericItem, BadgeFieldDefinition } from '../../types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Heart, Share } from 'lucide-react';

// A helper to get nested properties from an object, e.g., 'metrics.views'
function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((o, k) => (o && o[k] !== 'undefined' ? o[k] : undefined), obj);
}

interface FieldRendererProps {
  item: GenericItem;
  fieldId: string;
  className?: string;
  options?: Record<string, any>; // For extra props like 'compact' for avatar
}

export function FieldRenderer({ item, fieldId, className, options }: FieldRendererProps) {
  const { getFieldDef } = useDynamicView();
  const fieldDef = getFieldDef(fieldId);
  const value = getNestedValue(item, fieldId);

  // Custom render function takes precedence
  if (fieldDef?.render) {
    return <>{fieldDef.render(item, options)}</>;
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
      const { colorMap } = fieldDef as BadgeFieldDefinition;
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
          <div className="min-w-0">
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
import { useAppViewManager } from "@/hooks/useAppViewManager.hook";
import { useResizeObserver } from "@/hooks/useResizeObserver.hook";
import { useSelectedItem, useDataDemoStore } from "../../../../pages/DataDemo/store/dataDemo.store";
import { CalendarViewControls } from "./DataCalendarViewControls";
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
        <CalendarViewControls />
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
    onDragStart: (e: React.DragEvent<HTMLDivElement>, itemId: string) => void;
    colorProp: CalendarColorProp;
}) {
  const { onItemSelect } = useAppViewManager();
  const { config } = useDynamicView();
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

const datePropLabels: Record<CalendarDateProp, string> = {
  dueDate: 'due dates',
  createdAt: 'creation dates',
  updatedAt: 'update dates',
};

export function CalendarView({ data }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { 
    itemId,
    calendarDateProp,
    calendarItemLimit,
    calendarColorProp,
  } = useAppViewManager();
  const selectedItem = useSelectedItem(itemId);
  const updateItem = useDataDemoStore((s: any) => s.updateItem);
  
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
            updateItem(itemIdToUpdate, { [calendarDateProp]: newDueDate.toISOString() });
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
                          isSelected={selectedItem?.id === item.id}
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
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'
import type { GenericItem } from '../../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import { EmptyState } from '../shared/EmptyState'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import {
  useSelectedItem,
} from '../../../../pages/DataDemo/store/dataDemo.store'
import { AddDataItemCta } from '../shared/AddDataItemCta'
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'

export function CardView({ data, isGrid = false }: { data: GenericItem[]; isGrid?: boolean }) {
  const { onItemSelect, itemId } = useAppViewManager();
  const selectedItem = useSelectedItem(itemId);
  const { config } = useDynamicView();
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
                  <FieldRenderer item={item} fieldId={viewConfig.thumbnailField} />
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </div>

              {/* Header Fields (e.g., priority indicator) */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {viewConfig.headerFields.map(fieldId => (
                  <FieldRenderer key={fieldId} item={item} fieldId={fieldId} />
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
      <AddDataItemCta viewMode={isGrid ? 'grid' : 'cards'} />
    </div>
  )
}
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
import { useAppViewManager } from "@/hooks/useAppViewManager.hook";
import { useDataDemoStore } from "../../../../pages/DataDemo/store/dataDemo.store";
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'

interface KanbanCardProps {
  item: GenericItem;
  isDragging: boolean;
}

function KanbanCard({ item, isDragging, ...props }: KanbanCardProps & React.HTMLAttributes<HTMLDivElement>) {
  const { onItemSelect } = useAppViewManager();
  const { config } = useDynamicView();
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
  const { groupBy } = useAppViewManager();
  const updateItem = useDataDemoStore((s: any) => s.updateItem);

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
        updateItem(itemId, { [groupBy]: targetColumnId } as Partial<GenericItem>);
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

## File: src/features/dynamic-view/components/views/ListView.tsx
```typescript
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import type { GenericItem } from '../../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import { EmptyState } from '../shared/EmptyState'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import { 
  useSelectedItem,
} from '../../../../pages/DataDemo/store/dataDemo.store'
import { AddDataItemCta } from '../shared/AddDataItemCta'
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'

export function ListView({ data }: { data: GenericItem[] }) {
  const { onItemSelect, itemId } = useAppViewManager();
  const selectedItem = useSelectedItem(itemId);
  const { config } = useDynamicView();

  const listRef = useRef<HTMLDivElement>(null)
  useStaggeredAnimation(listRef, [data], { mode: 'incremental', scale: 1, y: 20, stagger: 0.05, duration: 0.4 });

  const items = Array.isArray(data) ? data : [];
  if (items.length === 0) {
    return <EmptyState />
  }

  return (
    <div ref={listRef}>
      {items.map((item: GenericItem) => {
        const isSelected = selectedItem?.id === item.id
        
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
                    <FieldRenderer item={item} fieldId={fieldConfig.fieldId} options={{ compact: true, avatarClassName: 'w-7 h-7' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
      <AddDataItemCta viewMode='list' />
    </div>
  )
}
```

## File: src/features/dynamic-view/components/views/TableView.tsx
```typescript
import { useRef, useLayoutEffect, useMemo } from 'react'
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
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import {
  useSelectedItem,
} from '../../../../pages/DataDemo/store/dataDemo.store'
import { capitalize } from '@/lib/utils'
import { AddDataItemCta } from '../shared/AddDataItemCta'
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'

export function TableView({ data }: { data: GenericItem[] }) {
  const {
    sortConfig,
    setTableSort,
    groupBy,
    onItemSelect,
    itemId,
  } = useAppViewManager();
  const { config } = useDynamicView();
  const { tableView: viewConfig } = config;
  const selectedItem = useSelectedItem(itemId);

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
    setTableSort(field)
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
                  ...items.map(item => <TableRow key={item.id} item={item} isSelected={selectedItem?.id === item.id} onItemSelect={onItemSelect} />)
                ])
              : data.map(item => <TableRow key={item.id} item={item} isSelected={selectedItem?.id === item.id} onItemSelect={onItemSelect} />)
            }
            <AddDataItemCta viewMode='table' colSpan={viewConfig.columns.length + 1} />
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TableRow({ item, isSelected, onItemSelect }: { item: GenericItem; isSelected: boolean; onItemSelect: (item: GenericItem) => void }) {
  const { config } = useDynamicView();
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

export interface BaseFieldDefinition {
  id: string; // Corresponds to a key in GenericItem
  label: string;
  type: FieldType;
  // Optional custom render function for ultimate flexibility.
  render?: (item: GenericItem, options?: Record<string, any>) => ReactNode;
}

export interface BadgeFieldDefinition extends BaseFieldDefinition {
  type: 'badge';
  colorMap?: Record<string, string>; // e.g., { 'active': 'bg-green-500', 'pending': 'bg-yellow-500' }
}

// Add other specific field types if they need unique properties
// For now, most can be handled by the base definition.

export type FieldDefinition = BaseFieldDefinition | BadgeFieldDefinition;


// --- VIEW CONFIGURATION ---
// The master configuration object that defines the entire view.

export type ViewMode = 'list' | 'cards' | 'grid' | 'table' | 'kanban' | 'calendar';

export interface ListViewConfig {
  iconField: string;
  titleField: string;
  metaFields: Array<{
    fieldId: string;
    className?: string;
  }>;
}

export interface CardViewConfig {
  thumbnailField: string;
  titleField: string;
  descriptionField: string;
  headerFields: string[];
  // Specific fields to recreate the original layout
  statusField: string;
  categoryField: string;
  tagsField: string;
  progressField: string;
  assigneeField: string;
  metricsField: string;
  dateField: string;
}

export interface TableColumnConfig {
  fieldId: string;
  label: string;
  isSortable: boolean;
}

export interface TableViewConfig {
  columns: TableColumnConfig[];
}

export interface KanbanViewConfig {
  groupByField: string; // Field ID to group by (e.g., 'status')
  cardFields: {
    titleField: string;
    descriptionField: string;
    priorityField: string;
    tagsField: string;
    // footer fields
    dateField: string;
    metricsField: string; // for comments/attachments
    assigneeField: string;
  };
}

export interface CalendarViewConfig {
  dateField: string;
  titleField: string;
  displayFields: string[];
  colorByField?: string; // Field ID to color events by (e.g., 'priority', 'status')
}

export interface ControlOption {
  id: string;
  label: string;
}

export interface FilterableFieldConfig {
  id: string; // fieldId
  label: string;
  options: ControlOption[];
}

export interface ViewConfig {
  fields: FieldDefinition[];
  sortableFields: ControlOption[];
  groupableFields: ControlOption[];
  filterableFields: FilterableFieldConfig[];
  
  // Layouts for each view mode
  listView: ListViewConfig;
  cardView: CardViewConfig;
  tableView: TableViewConfig;
  kanbanView: KanbanViewConfig;
  calendarView: CalendarViewConfig;
  detailView: DetailViewConfig;
}

// --- DETAIL VIEW ---
export interface DetailViewSection {
  title: string;
  fields: string[];
}

export interface DetailViewConfig {
  header: {
    thumbnailField: string;
    titleField: string;
    descriptionField: string;
    badgeFields: string[];
    progressField: string;
  };
  body: {
    sections: DetailViewSection[];
  };
}

// --- GENERIC CONTROL & DATA TYPES ---

export type Status = 'active' | 'pending' | 'completed' | 'archived';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface FilterConfig {
  searchTerm: string;
  [key: string]: any; // For dynamic filter keys like status, priority
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export type GroupableField = 'status' | 'priority' | 'category';

export type CalendarDateProp = 'dueDate' | 'createdAt' | 'updatedAt';
export type CalendarDisplayProp = 'priority' | 'assignee' | 'status';
export type CalendarColorProp = 'priority' | 'status' | 'category' | 'none';
```

## File: src/pages/DataDemo/DataDemo.config.ts
```typescript
import { capitalize } from '@/lib/utils';
import { FieldRenderer } from '@/features/dynamic-view/components/shared/FieldRenderer';
import type { ViewConfig } from '@/features/dynamic-view/types';

export const dataDemoViewConfig: ViewConfig = {
  // 1. Field Definitions
  fields: [
    { id: 'id', label: 'ID', type: 'string' },
    { id: 'title', label: 'Title', type: 'string' },
    { id: 'description', label: 'Description', type: 'longtext' },
    { id: 'thumbnail', label: 'Thumbnail', type: 'thumbnail' },
    { id: 'category', label: 'Category', type: 'badge' },
    {
      id: 'status', label: 'Status', type: 'badge',
      colorMap: {
        active: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
        pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        completed: 'bg-emerald-600/10 text-emerald-700 border-emerald-600/20',
        archived: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20',
      }
    },
    {
      id: 'priority', label: 'Priority', type: 'badge',
      colorMap: {
        critical: 'bg-red-600/10 text-red-700 border-red-600/20',
        high: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
        medium: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        low: 'bg-green-500/10 text-green-600 border-green-500/20',
      }
    },
    { id: 'assignee', label: 'Assignee', type: 'avatar' },
    { id: 'tags', label: 'Tags', type: 'tags' },
    { id: 'metrics', label: 'Engagement', type: 'metrics' },
    { id: 'metrics.completion', label: 'Progress', type: 'progress' },
    { id: 'dueDate', label: 'Due Date', type: 'date' },
    { id: 'createdAt', label: 'Created At', type: 'date' },
    { id: 'updatedAt', label: 'Last Updated', type: 'date' },
    // A custom field to replicate the composite "Project" column in the table view
    {
      id: 'project_details',
      label: 'Project',
      type: 'custom',
      render: (item) => (
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
  ],
  // 2. Control Definitions
  sortableFields: [
    { id: 'updatedAt', label: 'Last Updated' },
    { id: 'title', label: 'Title' },
    { id: 'status', label: 'Status' },
    { id: 'priority', label: 'Priority' },
    { id: 'metrics.completion', label: 'Progress' },
  ],
  groupableFields: [
    { id: 'none', label: 'None' },
    { id: 'status', label: 'Status' },
    { id: 'priority', label: 'Priority' },
    { id: 'category', label: 'Category' },
  ],
  filterableFields: [
    {
      id: 'status', label: 'Status',
      options: [
        { id: 'active', label: 'Active' },
        { id: 'pending', label: 'Pending' },
        { id: 'completed', label: 'Completed' },
        { id: 'archived', label: 'Archived' },
      ]
    },
    {
      id: 'priority', label: 'Priority',
      options: [
        { id: 'critical', label: 'Critical' },
        { id: 'high', label: 'High' },
        { id: 'medium', label: 'Medium' },
        { id: 'low', label: 'Low' },
      ]
    }
  ],
  // 3. View Layouts
  listView: {
    iconField: 'thumbnail',
    titleField: 'title',
    metaFields: [
      { fieldId: 'status', className: 'hidden sm:flex' },
      { fieldId: 'tags', className: 'hidden lg:flex' },
      { fieldId: 'updatedAt', className: 'hidden md:flex' },
      { fieldId: 'assignee' },
      { fieldId: 'priority', className: 'hidden xs:flex' },
    ],
  },
  cardView: {
    thumbnailField: 'thumbnail',
    titleField: 'title',
    descriptionField: 'description',
    headerFields: ['priority'],
    statusField: 'status',
    categoryField: 'category',
    tagsField: 'tags',
    progressField: 'metrics.completion',
    assigneeField: 'assignee',
    metricsField: 'metrics',
    dateField: 'updatedAt',
  },
  tableView: {
    columns: [
      { fieldId: 'project_details', label: 'Project', isSortable: true },
      { fieldId: 'status', label: 'Status', isSortable: true },
      { fieldId: 'priority', label: 'Priority', isSortable: true },
      { fieldId: 'assignee', label: 'Assignee', isSortable: true },
      { fieldId: 'metrics.completion', label: 'Progress', isSortable: true },
      { fieldId: 'metrics', label: 'Engagement', isSortable: true },
      { fieldId: 'updatedAt', label: 'Last Updated', isSortable: true },
    ],
  },
  kanbanView: {
    groupByField: 'status',
    cardFields: {
      titleField: 'title',
      descriptionField: 'description',
      priorityField: 'priority',
      tagsField: 'tags',
      dateField: 'dueDate',
      metricsField: 'metrics',
      assigneeField: 'assignee',
    },
  },
  calendarView: {
    dateField: 'dueDate',
    titleField: 'title',
    displayFields: ['tags', 'priority', 'assignee'],
    colorByField: 'priority',
  },
  detailView: {
    header: {
      thumbnailField: 'thumbnail',
      titleField: 'title',
      descriptionField: 'description',
      badgeFields: ['status', 'priority', 'category'],
      progressField: 'metrics.completion',
    },
    body: {
      sections: [
        { title: 'Assigned to', fields: ['assignee'] },
        { title: 'Engagement Metrics', fields: ['metrics'] },
        { title: 'Tags', fields: ['tags'] },
        {
          title: 'Timeline',
          fields: ['createdAt', 'updatedAt', 'dueDate'],
        },
      ],
    },
  },
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
    "@faker-js/faker": "^10.1.0",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.2.8"
  }
}
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

import { Button } from '@/components/ui/button';
import { DashboardContent } from "@/pages/Dashboard";
import { SettingsContent } from "@/features/settings/SettingsContent";
import { ToasterDemo } from "@/pages/ToasterDemo";
import { NotificationsPage } from "@/pages/Notifications";
import DataDemoPage from "@/pages/DataDemo/index";
import { DetailPanel } from '@/features/dynamic-view/components/shared/DetailPanel';
import { dataDemoViewConfig } from '@/pages/DataDemo/DataDemo.config';
import { mockDataItems } from "@/pages/DataDemo/data/mockData";
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
    return mockDataItems.find(item => item.id === itemId) ?? null;
  }, [itemId]);

  const { meta, content } = useMemo(() => {
    if (sidePaneContent === 'dataItem' && selectedItem) {
      return {
        meta: { title: "Item Details", icon: Database, page: `data-demo/${itemId}` },
        content: (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <DetailPanel item={selectedItem} config={dataDemoViewConfig} />
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

## File: src/pages/DataDemo/index.tsx
```typescript
import { useRef, useEffect, useCallback, useMemo } from 'react'
import {
  Layers, 
  AlertTriangle, 
  PlayCircle, 
  Loader2,
  TrendingUp,
  CheckCircle,
  Clock,
  Archive,
  PlusCircle
} from 'lucide-react'
import { gsap } from 'gsap'
import { DynamicViewProvider } from '@/features/dynamic-view/DynamicViewContext'
import { PageLayout } from '@/components/shared/PageLayout'
import { useScrollToBottom } from '@/hooks/useScrollToBottom.hook';
import { ScrollToBottomButton } from '@/components/shared/ScrollToBottomButton';
import { ListView } from '@/features/dynamic-view/components/views/ListView'
import { CardView } from '@/features/dynamic-view/components/views/CardView'
import { TableView } from '@/features/dynamic-view/components/views/TableView'
import { KanbanView } from '@/features/dynamic-view/components/views/KanbanView'
import { CalendarView } from '@/features/dynamic-view/components/views/CalendarView'
import { ViewModeSelector } from '@/features/dynamic-view/components/controls/ViewModeSelector'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { StatCard } from '@/components/shared/StatCard'
import { AnimatedLoadingSkeleton } from '@/features/dynamic-view/components/shared/AnimatedLoadingSkeleton'
import { ViewControls } from '@/features/dynamic-view/components/controls/ViewControls'
import { mockDataItems } from './data/mockData'
import type { GroupableField, GenericItem } from '@/features/dynamic-view/types'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import { useAutoAnimateStats } from './hooks/useAutoAnimateStats.hook'
import { 
  useDataDemoStore, 
  useGroupTabs
} from './store/dataDemo.store'

import { dataDemoViewConfig } from './DataDemo.config';

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
    setGroupBy,
    setSort,
    setActiveGroupTab,
    page,
    filters,
    sortConfig,
    setPage,
  } = useAppViewManager();

  const { hasMore, isLoading, isInitialLoading, totalItemCount, loadData } = useDataDemoStore(state => ({
    hasMore: state.hasMore,
    isLoading: state.isLoading,
    isInitialLoading: state.isInitialLoading,
    totalItemCount: state.totalItemCount,
    loadData: state.loadData,
  }));

  const groupTabs = useGroupTabs(groupBy, activeGroupTab);
  const allItems = useDataDemoStore(s => s.items);

  const groupedData = useMemo(() => {
    if (groupBy === 'none') {
        return null;
    }
    return allItems.reduce((acc, item) => {
        const groupKey = String(item[groupBy as GroupableField]);
        if (!acc[groupKey]) {
            acc[groupKey] = [] as GenericItem[];
        }
        acc[groupKey].push(item);
        return acc;
    }, {} as Record<string, GenericItem[]>);
  }, [allItems, groupBy]);

  const dataToRender = useMemo(() => {
    if (groupBy === 'none' || activeGroupTab === 'all' || !groupedData) {
      return allItems;
    }
    return groupedData[activeGroupTab] || [];
  }, [groupBy, activeGroupTab, allItems, groupedData]);

  const statsRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null);

  // Note: The `DynamicViewProvider` needs `GenericItem[]`. 
  // Our store uses `GenericItem` so no cast is needed.
  const genericItems: GenericItem[] = allItems;

  // Auto-hide stats container on scroll down
  useAutoAnimateStats(scrollRef, statsRef);

  // Calculate stats from data
  const totalItems = mockDataItems.length
  const { showScrollToBottom, scrollToBottom, handleScroll } = useScrollToBottom(scrollRef);

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
      chartData: [65, 68, 70, 69, 72, 75, 78],
    },
    {
      title: "Completion Rate",
      value: "88%",
      icon: <CheckCircle className="w-5 h-5" />,
      change: "+1.5% this month",
      trend: "up" as const,
      type: 'chart',
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
    }
  ]

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

  useEffect(() => {
    loadData({
      page,
      groupBy,
      filters,
      sortConfig,
      isFullLoad: viewMode === 'calendar',
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
  
  // Auto-group by status when switching to kanban view for the first time
  useEffect(() => {
    if (viewMode === 'kanban' && groupBy === 'none') {
      setGroupBy('status');
      setSort(null); // Kanban is manually sorted, so disable programmatic sort
    }
    // For calendar view, we don't want grouping.
    if (viewMode === 'calendar' && groupBy !== 'none') {
      setGroupBy('none');
    }
  }, [viewMode, groupBy, setGroupBy, setSort]);

  const renderViewForData = useCallback((data: GenericItem[]) => {
    const items = data as GenericItem[];
    switch (viewMode) {
        case 'table': return <TableView data={items} />;
        case 'cards': return <CardView data={items} />;
        case 'calendar': return null; // Calendar has its own render path below
        case 'kanban': return null; // Kanban has its own render path below
        case 'grid': return <CardView data={items} isGrid />;
        case 'list': default: return <ListView data={items} />;
    }
  }, [viewMode]);

  const isGroupedView = useMemo(() => 
    groupBy !== 'none' && groupTabs.length > 1 && groupedData,
  [groupBy, groupTabs.length, groupedData]);


  return (
    <DynamicViewProvider viewConfig={dataDemoViewConfig} data={genericItems}>
      <PageLayout
        scrollRef={scrollRef}
        onScroll={handleScroll}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold tracking-tight">Data Showcase</h1>
                <p className="text-muted-foreground">
                  {isInitialLoading 
                    ? "Loading projects..." 
                    : `Showing ${dataToRender.length} of ${totalItemCount} item(s)`}
                </p>
              </div>
              <ViewModeSelector />
            </div>
            <ViewControls />
          </div>

          {/* Stats Section */}
          {!isInitialLoading && (
            <div ref={statsRef} className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
              {stats.map((stat) => (
                <StatCard
                  className="w-64 md:w-72 flex-shrink-0"
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

        <div className="min-h-[500px]">
          {isInitialLoading ? (
            <AnimatedLoadingSkeleton viewMode={viewMode} />
          ) : viewMode === 'calendar' ? (
            <CalendarView data={genericItems} />
          ) : viewMode === 'kanban' ? (
            isGroupedView ? (
              <KanbanView data={groupedData as Record<string, GenericItem[]>} />
            ) : (
              <div className="flex items-center justify-center h-96 text-muted-foreground">
                Group data by a metric to use the Kanban view.
              </div>
            )
          ) : !isGroupedView ? (
            renderViewForData(allItems)
          ) : (
            // Grouped view with AnimatedTabs
            <div className="relative">
              <AnimatedTabs
                tabs={groupTabs}
                activeTab={activeGroupTab}
                onTabChange={setActiveGroupTab}
                wrapperClassName="flex flex-col"
                className="border-b"
                contentClassName="pt-6 flex-grow"
              >
                {groupTabs.map(tab => (
                  <div key={tab.id} className="min-h-[440px]">
                    {renderViewForData(
                      tab.id === 'all' ? allItems : groupedData?.[tab.id] || []
                    )}
                  </div>
                ))}
              </AnimatedTabs>
            </div>
          )}
        </div>

        {/* Loader for infinite scroll */}
        <div ref={loaderRef} className="flex justify-center items-center py-6">
          {isLoading && !isInitialLoading && groupBy === 'none' && viewMode !== 'calendar' && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more...</span>
            </div>
          )}
          {!isLoading && !hasMore && dataToRender.length > 0 && !isInitialLoading && groupBy === 'none' && viewMode !== 'calendar' && (
            <p className="text-muted-foreground">You've reached the end.</p>
          )}
        </div>
      </div>
        <ScrollToBottomButton isVisible={showScrollToBottom} onClick={scrollToBottom} />
      </PageLayout>
    </DynamicViewProvider>
  );
}
```
