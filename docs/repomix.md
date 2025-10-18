# Directory Structure
```
src/
  hooks/
    useStaggeredAnimation.motion.hook.ts
  lib/
    utils.ts
  pages/
    DataDemo/
      components/
        shared/
          DataItemParts.tsx
        DataKanbanView.tsx
        DataListView.tsx
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

## File: postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

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

## File: src/pages/DataDemo/components/shared/DataItemParts.tsx
```typescript
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn, getStatusColor, getPriorityColor } from '@/lib/utils'
import { Clock, Eye, Heart, Share } from 'lucide-react'
import type { DataItem } from '../../types'

export function ItemStatusBadge({ status }: { status: DataItem['status'] }) {
  return (
    <Badge variant="outline" className={cn("font-medium", getStatusColor(status))}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export function ItemPriorityBadge({ priority }: { priority: DataItem['priority'] }) {
  return (
    <Badge variant="outline" className={cn("font-medium", getPriorityColor(priority))}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  )
}

export function AssigneeInfo({
  assignee,
  avatarClassName = "w-8 h-8",
  compact = false,
}: {
  assignee: DataItem['assignee']
  avatarClassName?: string
  compact?: boolean
}) {
  const avatar = (
    <Avatar className={cn("border-2 border-transparent group-hover:border-primary/50 transition-colors", avatarClassName)}>
      <AvatarImage src={assignee.avatar} alt={assignee.name} />
      <AvatarFallback>{assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
    </Avatar>
  )

  if (compact) {
    return avatar
  }

  return (
    <div className="flex items-center gap-2 group">
      {avatar}
      <div className="min-w-0">
        <p className="font-medium text-sm truncate">{assignee.name}</p>
        <p className="text-xs text-muted-foreground truncate">{assignee.email}</p>
      </div>
    </div>
  )
}

export function ItemMetrics({ metrics }: { metrics: DataItem['metrics'] }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-1"><Eye className="w-4 h-4" /> {metrics.views}</div>
      <div className="flex items-center gap-1"><Heart className="w-4 h-4" /> {metrics.likes}</div>
      <div className="flex items-center gap-1"><Share className="w-4 h-4" /> {metrics.shares}</div>
    </div>
  )
}

export function ItemProgressBar({ completion, showPercentage }: { completion: number; showPercentage?: boolean }) {
  const bar = (
    <div className="w-full bg-muted rounded-full h-2.5">
      <div
        className="bg-gradient-to-r from-primary to-primary/80 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${completion}%` }}
      />
    </div>
  );

  if (!showPercentage) return bar;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">{bar}</div>
      <span className="text-sm font-medium text-muted-foreground">{completion}%</span>
    </div>
  )
}

export function ItemDateInfo({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Clock className="w-4 h-4" />
      <span>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
    </div>
  )
}

export function ItemTags({ tags }: { tags: string[] }) {
  const MAX_TAGS = 3
  const remainingTags = tags.length - MAX_TAGS
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {tags.slice(0, MAX_TAGS).map(tag => (
        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
      ))}
      {remainingTags > 0 && (
        <Badge variant="outline" className="text-xs">+{remainingTags}</Badge>
      )}
    </div>
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

## File: src/hooks/useStaggeredAnimation.motion.hook.ts
```typescript
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAppShellStore } from '@/store/appShell.store';

interface StaggeredAnimationOptions {
	stagger?: number;
	duration?: number;
	y?: number;
	scale?: number;
	ease?: string;
	mode?: 'full' | 'incremental';
}

/**
 * Animates the direct children of a container element with a staggered fade-in effect.
 *
 * @param containerRef Ref to the container element.
 * @param deps Dependency array to trigger the animation.
 * @param options Animation options.
 * @param options.mode - 'full' (default): animates all children every time deps change.
 *                       'incremental': only animates new children added to the container.
 */
export function useStaggeredAnimation<T extends HTMLElement>(
	containerRef: React.RefObject<T>,
	deps: React.DependencyList,
	options: StaggeredAnimationOptions = {},
) {
	const reducedMotion = useAppShellStore(s => s.reducedMotion);
	const {
		stagger = 0.08,
		duration = 0.6,
		y = 30,
		scale = 1,
		ease = 'power3.out',
		mode = 'full',
	} = options;

	const animatedItemsCount = useRef(0);

	useLayoutEffect(() => {
		if (reducedMotion || !containerRef.current) return;

		const children = Array.from(containerRef.current.children) as HTMLElement[];

		if (mode === 'incremental') {
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
		} else {
			if (children.length) {
				gsap.fromTo(
					children,
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
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [containerRef, ...deps]);
}
```

## File: src/pages/DataDemo/components/DataKanbanView.tsx
```typescript
import { useState, useEffect, Fragment } from "react";
import {
  GripVertical,
  Plus,
  Calendar,
  MessageSquare,
  Paperclip,
} from "lucide-react";
import type { DataItem } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getPriorityColor } from "@/lib/utils";
import { EmptyState } from "./EmptyState";
import { useAppViewManager } from "@/hooks/useAppViewManager.hook";
import { useDataDemoStore } from "../store/dataDemo.store";

interface KanbanCardProps {
  item: DataItem;
  isDragging: boolean;
}

function KanbanCard({ item, isDragging, ...props }: KanbanCardProps & React.HTMLAttributes<HTMLDivElement>) {
  const { onItemSelect } = useAppViewManager();

  // Mock comment and attachment counts for UI purposes
  const comments = Math.floor(item.metrics.views / 10);
  const attachments = Math.floor(item.metrics.shares / 5);

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
              {item.title}
            </h4>
            <GripVertical className="w-5 h-5 text-muted-foreground/60 dark:text-neutral-400 cursor-grab flex-shrink-0" />
          </div>

          <p className="text-sm text-muted-foreground dark:text-neutral-300 leading-relaxed line-clamp-2">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge className={cn("text-xs border", getPriorityColor(item.priority))}>
              {item.priority}
            </Badge>
            {item.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs backdrop-blur-sm">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/30 dark:border-neutral-700/30">
            <div className="flex items-center gap-4 text-muted-foreground/80 dark:text-neutral-400">
              {item.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium">
                    {new Date(item.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs font-medium">{comments}</span>
              </div>
              <div className="flex items-center gap-1">
                <Paperclip className="w-4 h-4" />
                <span className="text-xs font-medium">{attachments}</span>
              </div>
            </div>

            <Avatar className="w-8 h-8 ring-2 ring-white/50 dark:ring-neutral-700/50">
              <AvatarImage src={item.assignee.avatar} />
              <AvatarFallback className="bg-muted dark:bg-neutral-700 text-foreground dark:text-neutral-200 font-medium">
                {item.assignee.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DataKanbanViewProps {
  data: Record<string, DataItem[]>;
}

export function DataKanbanView({ data }: DataKanbanViewProps) {
  const [columns, setColumns] = useState(data);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{ columnId: string; index: number } | null>(null);
  const { groupBy } = useAppViewManager();
  const updateItem = useDataDemoStore(s => s.updateItem);

  useEffect(() => {
    setColumns(data);
  }, [data]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: DataItem, sourceColumnId: string) => {
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
        updateItem(itemId, { [groupBy]: targetColumnId } as Partial<DataItem>);
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
            <div className="flex items-center gap-3">
              <div className={cn("w-3.5 h-3.5 rounded-full", statusColors[columnId] || "bg-muted-foreground")} />
              <h3 className="font-semibold text-card-foreground dark:text-neutral-100 capitalize">{columnId}</h3>
              <Badge variant="secondary" className="backdrop-blur-sm">{items.length}</Badge>
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

## File: src/pages/DataDemo/components/DataListView.tsx
```typescript
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import type { DataItem } from '../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import { EmptyState } from './EmptyState'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import { 
  useSelectedItem,
} from '../store/dataDemo.store'
import {
  AssigneeInfo,
  ItemStatusBadge,
  ItemPriorityBadge,
  ItemDateInfo,
  ItemTags,
} from './shared/DataItemParts'
import { AddDataItemCta } from './shared/AddDataItemCta'

export function DataListView({ data }: { data: DataItem[] }) {
  const { onItemSelect, itemId } = useAppViewManager();
  const selectedItem = useSelectedItem(itemId);

  const listRef = useRef<HTMLDivElement>(null)
  useStaggeredAnimation(listRef, [data], { mode: 'incremental', scale: 1, y: 20, stagger: 0.05, duration: 0.4 });

  const items = Array.isArray(data) ? data : [];
  if (items.length === 0) {
    return <EmptyState />
  }

  return (
    <div ref={listRef} className="border-t">
      {items.map((item: DataItem) => {
        const isSelected = selectedItem?.id === item.id
        
        return (
          <div
            key={item.id}
            onClick={() => onItemSelect(item)}
            className={cn(
              "group flex items-center px-4 py-2 border-b transition-colors duration-200 cursor-pointer",
              "hover:bg-accent/80",
              isSelected ? "bg-accent" : "bg-transparent"
            )}
          >
            {/* Left side: Icon and Title */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-xl flex-shrink-0 w-8 text-center">{item.thumbnail}</span>
              <p className="font-medium truncate text-card-foreground group-hover:text-primary">{item.title}</p>
            </div>

            {/* Right side: Metadata */}
            <div className="flex items-center gap-4 ml-4 text-sm text-muted-foreground shrink-0">
              <div className="hidden lg:flex items-center gap-4">
                <ItemStatusBadge status={item.status} />
                <ItemTags tags={item.tags} />
              </div>
              <div className="hidden md:flex items-center gap-4">
                <ItemDateInfo date={item.updatedAt} />
              </div>
              <AssigneeInfo assignee={item.assignee} avatarClassName="w-7 h-7" compact />
              <ItemPriorityBadge priority={item.priority} />
            </div>
          </div>
        )
      })}
      <AddDataItemCta viewMode='list' />
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

## File: src/pages/DataDemo/index.tsx
```typescript
import { useRef, useEffect, useCallback, useMemo } from 'react'
import {
  Layers, 
  AlertTriangle, 
  PlayCircle, 
  Loader2,
  ChevronsUpDown,
  TrendingUp,
  CheckCircle,
  Clock,
  Archive,
  PlusCircle
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
import { useScrollToBottom } from '@/hooks/useScrollToBottom.hook';
import { ScrollToBottomButton } from '@/components/shared/ScrollToBottomButton';
import { DataListView } from './components/DataListView'
import { DataCardView } from './components/DataCardView'
import { DataTableView } from './components/DataTableView'
import { DataKanbanView } from './components/DataKanbanView'
import { DataCalendarView } from './components/DataCalendarView'
import { DataViewModeSelector } from './components/DataViewModeSelector'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { StatCard } from '@/components/shared/StatCard'
import { AnimatedLoadingSkeleton } from './components/AnimatedLoadingSkeleton'
import { DataToolbar } from './components/DataToolbar'
import { mockDataItems } from './data/mockData'
import type { GroupableField, DataItem } from './types'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import { useAutoAnimateStats } from './hooks/useAutoAnimateStats.hook'
import { 
  useDataDemoStore, 
  useGroupTabs
} from './store/dataDemo.store'

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

function DataDemoContent() {
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
            acc[groupKey] = [];
        }
        acc[groupKey].push(item);
        return acc;
    }, {} as Record<string, DataItem[]>);
  }, [allItems, groupBy]);

  const dataToRender = useMemo(() => {
    if (groupBy === 'none' || activeGroupTab === 'all' || !groupedData) {
      return allItems;
    }
    return groupedData[activeGroupTab] || [];
  }, [groupBy, activeGroupTab, allItems, groupedData]);

  const groupOptions = useMemo(() => [
    { id: 'none' as const, label: 'None' }, { id: 'status' as const, label: 'Status' }, { id: 'priority' as const, label: 'Priority' }, { id: 'category' as const, label: 'Category' }
  ], []);

  const statsRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null);

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
    if (viewMode === 'calendar') {
      if (groupBy !== 'none') setGroupBy('none');
    }
  }, [viewMode, groupBy, setGroupBy]);

  const renderViewForData = useCallback((data: DataItem[]) => {
    switch (viewMode) {
        case 'table': return <DataTableView data={data} />;
        case 'cards': return <DataCardView data={data} />;
        case 'calendar': return null; // Calendar has its own render path below
        case 'kanban': return null; // Kanban has its own render path below
        case 'grid': return <DataCardView data={data} isGrid />;
        case 'list':
        default:
            return <DataListView data={data} />;
    }
  }, [viewMode]);

  const GroupByDropdown = useCallback(() => (
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
  ), [groupBy, setGroupBy, groupOptions]);

  const isGroupedView = useMemo(() => 
    groupBy !== 'none' && groupTabs.length > 1 && groupedData,
  [groupBy, groupTabs.length, groupedData]);


  return (
    <PageLayout
      scrollRef={scrollRef}
      onScroll={handleScroll}
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
          <DataViewModeSelector />
        </div>

        {/* Stats Section */}
        {!isInitialLoading && (
          <div ref={statsRef} className="flex overflow-x-auto gap-6 pb-2 no-scrollbar">
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
          <DataToolbar />
        </div>

        <div className="min-h-[500px]">
          {isInitialLoading 
            ? <AnimatedLoadingSkeleton viewMode={viewMode} /> 
            : viewMode === 'calendar' ? (
              <DataCalendarView data={allItems} />
            )
            : viewMode === 'kanban' ? (
              <>
                <div className="flex items-center justify-end gap-4 h-[68px]">
                  <GroupByDropdown />
                </div>
                {isGroupedView ? (
                  <DataKanbanView data={groupedData} />
                ) : (
                  <div className="flex items-center justify-center h-96 text-muted-foreground">
                    Group data by a metric to use the Kanban view.
                  </div>
                )}
              </>
            )
            : !isGroupedView ? (
              // Not grouped view
              <>
                <div className="flex items-center justify-between gap-4 h-[68px]">
                  <div className="flex-grow border-b" /> {/* Mimic tab border */}
                  <GroupByDropdown />
                </div>
                {renderViewForData(allItems)}
              </>
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
                <div className="absolute top-[14px] right-0">
                    <GroupByDropdown />
                </div>
              </div>
            )
          }
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
  )
}

export default function DataDemoPage() {
  return <DataDemoContent />;
}
```
