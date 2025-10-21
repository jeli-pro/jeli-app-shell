# Directory Structure
```
src/
  components/
    layout/
      MainContent.tsx
      RightPane.tsx
    shared/
      PageLayout.tsx
  features/
    dynamic-view/
      components/
        shared/
          DetailPanel.tsx
      DynamicViewContext.tsx
  hooks/
    useAppViewManager.hook.ts
    useRightPaneContent.hook.tsx
  pages/
    DataDemo/
      store/
        dataDemo.store.tsx
      DataDemo.config.tsx
      index.tsx
  App.tsx
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

## File: src/components/shared/PageLayout.tsx
```typescript
import React from 'react';
import { cn } from '@/lib/utils';
import { useAppShellStore } from '@/store/appShell.store';
import { BODY_STATES } from '@/lib/utils';

interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

export const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ children, onScroll, scrollRef, className, ...props }, ref) => {
    const isTopBarVisible = useAppShellStore(s => s.isTopBarVisible);
    const bodyState = useAppShellStore(s => s.bodyState);
    const isFullscreen = bodyState === 'fullscreen';
    const isInSidePane = bodyState === BODY_STATES.SIDE_PANE;

    return (
      <div
        ref={scrollRef}
        className={cn("h-full overflow-y-auto", className)}
        onScroll={onScroll}
      >
        <div ref={ref} className={cn(
          "space-y-8 transition-all duration-300",
          !isInSidePane ? "px-6 lg:px-12 pb-6" : "px-6 pb-6",
          isTopBarVisible && !isFullscreen ? "pt-24" : "pt-6"
        )}
        {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);

PageLayout.displayName = 'PageLayout';
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
        "relative flex flex-col h-full overflow-hidden bg-background",
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

## File: src/features/dynamic-view/components/shared/DetailPanel.tsx
```typescript
import React, { useRef, useState, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Clock, 
  Tag,
  User,
  BarChart3,
} from 'lucide-react'
import type { GenericItem, DetailViewConfig, DetailViewSection } from '../../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook';
import { EditableField } from './EditableField'
import { DraggableSection } from './DraggableSection'
import { getNestedValue } from '@/lib/utils'
import { useDynamicView } from '../../DynamicViewContext'

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
  
  const { getFieldDef } = useDynamicView<TFieldId, TItem>();
  const { header, body } = config;
  const [sections, setSections] = useState(body.sections);

  const sectionIds = useMemo(() => sections.map(s => s.title), [sections]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setSections((currentSections) => {
        const oldIndex = sectionIds.indexOf(active.id as string);
        const newIndex = sectionIds.indexOf(over!.id as string);
        return arrayMove(currentSections, oldIndex, newIndex);
      });
    }
  };

  if (!item) {
    return null
  }
  
  return (
    <div ref={contentRef} className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
             <EditableField item={item} fieldId={header.thumbnailField} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold mb-1 leading-tight">
              <EditableField item={item} fieldId={header.titleField} />
            </h1>
            <p className="text-muted-foreground">
              <EditableField item={item} fieldId={header.descriptionField} />
            </p>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {header.badgeFields.map((fieldId: TFieldId) => (
            <EditableField key={fieldId} item={item} fieldId={fieldId} />
          ))}
        </div>

        {/* Progress */}
        <EditableField item={item} fieldId={header.progressField} options={{ showPercentage: true }} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sectionIds}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section) => {
                const IconComponent = SECTION_ICONS[section.title];
                const hasContent = section.fields.some((fieldId: TFieldId) => {
                  const value = getNestedValue(item, fieldId as string);
                  return value !== null && typeof value !== 'undefined';
                });

                if (!hasContent) return null;

                return (
                  <DraggableSection key={section.title} id={section.title} >
                    <div className="p-4 bg-card/30 rounded-2xl border border-border/30">
                      <div className="flex items-center gap-1 mb-3">
                        {IconComponent && <IconComponent className="w-4 h-4 text-muted-foreground" />}
                        <h3 className="font-semibold text-sm">{section.title}</h3>
                      </div>
                      <div className="space-y-3">
                        {section.fields.map((fieldId: TFieldId) => {
                          const fieldDef = getFieldDef(fieldId);
                          return (
                            <div key={fieldId} className="flex items-start gap-4 text-sm">
                              <div className="w-1/3 text-muted-foreground pt-1.5 shrink-0">{fieldDef?.label}</div>
                              <div className="w-2/3 grow"><EditableField item={item} fieldId={fieldId} /></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </DraggableSection>
                );
              })}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  )
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

## File: src/components/layout/RightPane.tsx
```typescript
import { forwardRef, useMemo, createElement, memo } from 'react'
import {
  ChevronRight,
  X,
} from 'lucide-react'
import { cn, BODY_STATES } from '@/lib/utils';
import { useAppShellStore } from '@/store/appShell.store';
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import { useRightPaneContent } from '@/hooks/useRightPaneContent.hook'
import { ViewModeSwitcher } from './ViewModeSwitcher';

export const RightPane = memo(forwardRef<HTMLDivElement, { className?: string }>(({ className }, ref) => {
  const fullscreenTarget = useAppShellStore(s => s.fullscreenTarget)
  const bodyState = useAppShellStore(s => s.bodyState)
  const { toggleFullscreen, setIsResizingRightPane } =
    useAppShellStore.getState()

  const viewManager = useAppViewManager()
  const { sidePaneContent, closeSidePane } = viewManager
  
  const { meta, content: children } = useRightPaneContent(sidePaneContent)
  
  const isSplitView = bodyState === BODY_STATES.SPLIT_VIEW;
  const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;

  const header = useMemo(() => (
    <div className="flex items-center justify-between p-4 border-b border-border h-20 flex-shrink-0 pl-6">
      {bodyState !== BODY_STATES.SPLIT_VIEW && 'icon' in meta ? (
        <div className="flex items-center gap-2">
          {meta.icon && createElement(meta.icon, { className: "w-5 h-5" })}
          <h2 className="text-lg font-semibold whitespace-nowrap">{meta.title}</h2>
        </div>
      ) : <div />}
      <div className="flex items-center">
        {bodyState === BODY_STATES.SIDE_PANE && 'page' in meta && meta.page && <ViewModeSwitcher pane="right" targetPage={meta.page} />}
      </div>
    </div>
  ), [bodyState, meta]);

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
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

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

// Breadcrumbs for the Top Bar
function AppBreadcrumbs() {
  const { currentActivePage } = useAppViewManager();
  const activePageName = currentActivePage.replace('-', ' ');

  return (
    <div className="hidden md:flex items-center gap-2 text-sm">
      <a
        href="#"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Home
      </a>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
      <span className="font-medium text-foreground capitalize">
        {activePageName}
      </span>
    </div>
  );
}

// Page-specific controls for the Top Bar
function TopBarPageControls() {
  const { currentActivePage, filters, setFilters } = useAppViewManager();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  if (currentActivePage === 'dashboard') {
    return (
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
            placeholder="Search dashboard..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="pl-9 pr-4 py-2 h-10 border-none rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ease-in-out w-full"
          />
        </div>
        <Button variant="ghost" size="icon" className="flex-shrink-0">
          <Filter className="w-5 h-5" />
        </Button>
        <Button className="flex-shrink-0">
          <Plus className="w-5 h-5 mr-0 sm:mr-2" />
          <span className={cn(isSearchFocused ? "hidden sm:inline" : "inline")}>
            New Project
          </span>
        </Button>
      </div>
    );
  }

  if (currentActivePage === 'data-demo') {
    return (
      <div className="flex items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search items..."
            className="pl-9 bg-card border-none"
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Item
        </Button>
      </div>
    );
  }

  return null;
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
        <TopBar breadcrumbs={<AppBreadcrumbs />} pageControls={<TopBarPageControls />} />
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
