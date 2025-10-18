# Directory Structure
```
src/
  hooks/
    useAppViewManager.hook.ts
  lib/
    utils.ts
  pages/
    DataDemo/
      components/
        DataCalendarView.tsx
        DataCardView.tsx
        DataKanbanView.tsx
        DataToolbar.tsx
        DataViewModeSelector.tsx
      store/
        dataDemo.store.tsx
      index.tsx
      types.ts
  index.css
```

# Files

## File: src/pages/DataDemo/components/DataCalendarView.tsx
```typescript
import { useState, useMemo } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isSameDay, } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getPriorityColor } from "@/lib/utils";
import type { DataItem } from "../types";
import { useAppViewManager } from "@/hooks/useAppViewManager.hook";
import { useSelectedItem, useDataDemoStore } from "../store/dataDemo.store";

interface CalendarViewProps {
  data: DataItem[];
}

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

function CalendarEvent({ item, isSelected, isDragging, onDragStart }: { 
    item: DataItem; 
    isSelected: boolean;
    isDragging: boolean;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, itemId: string) => void;
}) {
  const { onItemSelect } = useAppViewManager();
    const { onItemSelect } = useAppViewManager();

    return (
        <motion.div
            layout
            draggable
            onDragStart={(e) => onDragStart(e, item.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onClick={() => onItemSelect(item)}
            className={cn(
                "p-2.5 rounded-xl cursor-grab transition-all duration-200 border bg-card/60 dark:bg-neutral-800/60 backdrop-blur-sm",
                "hover:bg-card/80 dark:hover:bg-neutral-700/70",
                isSelected && "ring-2 ring-primary ring-offset-background ring-offset-2 bg-card/90",
                isDragging && "opacity-50 ring-2 ring-primary cursor-grabbing"
            )}
        >
            <h4 className="font-semibold text-sm leading-tight text-card-foreground/90 line-clamp-2">
                {item.title}
            </h4>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30 dark:border-neutral-700/50">
                <Badge className={cn("text-xs border capitalize", getPriorityColor(item.priority))}>
                    {item.priority}
                </Badge>
                <Avatar className="w-5 h-5">
                    <AvatarImage src={item.assignee.avatar} />
                    <AvatarFallback className="text-[10px] bg-muted dark:bg-neutral-700 text-foreground dark:text-neutral-200 font-medium">
                        {item.assignee.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                </Avatar>
            </div>
        </motion.div>
    );

export function DataCalendarView({ data }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { itemId } = useAppViewManager();
  const selectedItem = useSelectedItem(itemId);
  const updateItem = useDataDemoStore(s => s.updateItem);
  
  // Drag & Drop State
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dropTargetDate, setDropTargetDate] = useState<Date | null>(null);

  const itemsWithDueDate = useMemo(() => data.filter(item => !!item.dueDate), [data]);

  const eventsByDate = useMemo(() => {
    const eventsMap = new Map<string, DataItem[]>();

      const dueDate = new Date(item.dueDate as string);
      const dateKey = format(dueDate, "yyyy-MM-dd");
      if (!eventsMap.has(dateKey)) {
        eventsMap.set(dateKey, []);
      }
      eventsMap.get(dateKey)?.push(item);
    });
    return eventsMap;
  }, [itemsWithDueDate]);

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
        const originalItem = itemsWithDueDate.find(i => i.id === itemIdToUpdate);
        if (originalItem && originalItem.dueDate) {
            const originalDate = new Date(originalItem.dueDate);
            // Preserve the time, only change the date part
            const newDueDate = new Date(day);
            newDueDate.setHours(originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds(), originalDate.getMilliseconds());
            updateItem(itemIdToUpdate, { dueDate: newDueDate.toISOString() });
        }
    }
    handleDragEnd(); // Reset state
  };
  
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  return (
    <div className="-mx-4 md:-mx-6">
      <div className="px-4 md:px-6">
        <CalendarHeader currentDate={currentDate} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} onToday={handleToday} />
      </div>
      {itemsWithDueDate.length === 0 ? (
        <div className="flex items-center justify-center h-96 text-muted-foreground rounded-lg border bg-card/30 mx-4 md:mx-6">
          No items with due dates to display on the calendar.
        </div>
      ) : (
        <div className="grid grid-cols-7 p-2 gap-2" onDragEnd={handleDragEnd}>
          {weekdays.map(day => (
            <div key={day} className="py-2 px-3 text-center text-xs font-semibold text-muted-foreground">
              {day}
            </div>
          ))}

          <AnimatePresence mode="wait">
            <motion.div
              key={format(currentDate, "yyyy-MM")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="col-span-7 grid grid-cols-7 gap-2"
            >
              {days.map(day => {
                const dateKey = format(day, "yyyy-MM-dd");
                const dayEvents = eventsByDate.get(dateKey) || [];
                const isCurrentMonthDay = isSameMonth(day, currentDate);
                const isDropTarget = dropTargetDate && isSameDay(day, dropTargetDate);

                return (
                  <div
                    key={day.toString()}
                    onDragOver={(e) => handleDragOver(e, day)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, day)}
                    className={cn(
                      "relative min-h-[150px] rounded-2xl p-3 flex flex-col gap-2 transition-all duration-300 border",
                      isCurrentMonthDay ? "bg-card/40 dark:bg-neutral-900/40 border-transparent" : "bg-muted/30 dark:bg-neutral-800/20 border-transparent text-muted-foreground/60",
                      isDropTarget ? "border-primary/50 bg-primary/10" : "hover:border-primary/20 hover:bg-card/60"
                    )}
                  >
                    <span className={cn(
                      "font-semibold text-sm",
                      isToday(day) && "flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground"
                    )}>
                      {format(day, "d")}
                    </span>
                    <div className="space-y-2 overflow-y-auto flex-grow custom-scrollbar">
                      <AnimatePresence>
                        {dayEvents.slice(0, 4).map(item => (
                          <CalendarEvent
                            key={item.id} 
                            item={item} 
                            isSelected={selectedItem?.id === item.id}
                            isDragging={draggedItemId === item.id}
                            onDragStart={handleDragStart}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                    {dayEvents.length > 4 && (
                      <div className="absolute bottom-1 right-2 text-xs font-bold text-muted-foreground">
                        +{dayEvents.length - 4} more
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
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

import type { SortableField, Status, Priority } from '../types'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'

export interface FilterConfig {
  searchTerm: string
  status: Status[]
  priority: Priority[]
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


export function DataToolbar() {
  const {
    filters,
    setFilters,
    sortConfig,
    setSort,
  } = useAppViewManager();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchTerm: event.target.value })
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
            <CombinedFilter filters={filters} onFiltersChange={setFilters} />
          </PopoverContent>
        </Popover>

        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={() => setFilters({ searchTerm: filters.searchTerm, status: [], priority: [] })}>Reset</Button>
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
                  setSort(null)
                } else {
                  const [key, direction] = value.split('-')
                  setSort({ key: key as SortableField, direction: direction as 'asc' | 'desc' })
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

## File: src/pages/DataDemo/store/dataDemo.store.tsx
```typescript
import { create } from 'zustand';
import { type ReactNode } from 'react';
import { capitalize, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { mockDataItems } from '../data/mockData';
import type { DataItem, GroupableField, SortConfig } from '../types';
import type { FilterConfig } from '../components/DataToolbar';

// --- State and Actions ---
interface DataDemoState {
    items: DataItem[];
    hasMore: boolean;
    isLoading: boolean;
    isInitialLoading: boolean;
    totalItemCount: number;
}

interface DataDemoActions {
    loadData: (params: {
        page: number;
        groupBy: GroupableField | 'none';
        filters: FilterConfig;
        sortConfig: SortConfig | null;
    isFullLoad?: boolean;
    }) => void;
    updateItem: (itemId: string, updates: Partial<DataItem>) => void;
}

const defaultState: DataDemoState = {
    items: [],
    hasMore: true,
    isLoading: true,
    isInitialLoading: true,
    totalItemCount: 0,
};

// --- Store Implementation ---
export const useDataDemoStore = create<DataDemoState & DataDemoActions>((set, get) => ({
    ...defaultState,

    loadData: ({ page, groupBy, filters, sortConfig, isFullLoad }) => {
        set({ isLoading: true, ...(page === 1 && { isInitialLoading: true }) });
        const isFirstPage = page === 1;

        const filteredAndSortedData = (() => {
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
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const getNestedValue = (obj: DataItem, path: string): any =>
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
                    if (sortConfig.key === 'updatedAt' || sortConfig.key === 'createdAt') {
                        if (typeof aValue === 'string' && typeof bValue === 'string') {
                            return sortConfig.direction === 'asc'
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

        setTimeout(() => {
            if (groupBy !== 'none' || isFullLoad) {
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
            const newItems = filteredAndSortedData.slice((page - 1) * pageSize, page * pageSize);
            
            set(state => ({
                items: isFirstPage ? newItems : [...state.items, ...newItems],
                hasMore: totalItemCount > page * pageSize,
                isLoading: false,
                isInitialLoading: false,
                totalItemCount,
            }));

        }, isFirstPage ? 1500 : 500);
    },

    updateItem: (itemId, updates) => {
        // In a real app, this would be an API call. Here we update the mock source.
        const itemIndex = mockDataItems.findIndex(i => i.id === itemId);
        if (itemIndex > -1) {
            mockDataItems[itemIndex] = { ...mockDataItems[itemIndex], ...updates };
        }

        // Also update the currently loaded items in the store's state for UI consistency
        set(state => ({
            items: state.items.map(item => 
                item.id === itemId ? { ...item, ...updates } : item
            ),
        }));
    },
}));

// --- Selectors ---
export const useGroupTabs = (
    groupBy: GroupableField | 'none',
    activeGroupTab: string,
) => useDataDemoStore(state => {
    const items = state.items;
    if (groupBy === 'none' || !items.length) return [];
    
    const groupCounts = items.reduce((acc, item) => {
        const groupKey = String(item[groupBy as GroupableField]);
        acc[groupKey] = (acc[groupKey] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const sortedGroups = Object.keys(groupCounts).sort((a, b) => a.localeCompare(b));

    const createLabel = (text: string, count: number, isActive: boolean): ReactNode => (
        <>
            {text}
            <Badge variant={isActive ? 'default' : 'secondary'} className={cn('transition-colors duration-300 text-xs font-semibold', !isActive && 'group-hover:bg-accent group-hover:text-accent-foreground')}>
                {count}
            </Badge>
        </>
    );
    
    const totalCount = items.length;

    return [
        { id: 'all', label: createLabel('All', totalCount, activeGroupTab === 'all') },
        ...sortedGroups.map((g) => ({
            id: g,
            label: createLabel(capitalize(g), groupCounts[g], activeGroupTab === g),
        })),
    ];
});

export const useDataToRender = (
    groupBy: GroupableField | 'none',
    activeGroupTab: string,
) => useDataDemoStore(state => {
    const items = state.items;
    if (groupBy === 'none') {
        return items;
    }
    if (activeGroupTab === 'all') {
        return items;
    }
    return items.filter((item) => String(item[groupBy as GroupableField]) === activeGroupTab);
});

export const useSelectedItem = (itemId?: string) => {
    if (!itemId) return null;
    return mockDataItems.find(item => item.id === itemId) ?? null;
};
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

## File: src/pages/DataDemo/types.ts
```typescript
export type ViewMode = 'list' | 'cards' | 'grid' | 'table' | 'kanban' | 'calendar'

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

## File: src/pages/DataDemo/components/DataViewModeSelector.tsx
```typescript
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { List, Grid3X3, LayoutGrid, Table, LayoutDashboard, CalendarDays } from 'lucide-react'
import type { ViewMode } from '../types'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'

const viewModes = [
  { id: 'list' as ViewMode, label: 'List', icon: List, description: 'Compact list with details' },
  { id: 'cards' as ViewMode, label: 'Cards', icon: LayoutGrid, description: 'Rich card layout' },
  { id: 'kanban' as ViewMode, label: 'Kanban', icon: LayoutDashboard, description: 'Interactive Kanban board' },
  { id: 'calendar' as ViewMode, label: 'Calendar', icon: CalendarDays, description: 'Interactive calendar view' },
  { id: 'grid' as ViewMode, label: 'Grid', icon: Grid3X3, description: 'Masonry grid view' },
  { id: 'table' as ViewMode, label: 'Table', icon: Table, description: 'Structured data table' }
]

export function DataViewModeSelector() {
  const { viewMode, setViewMode } = useAppViewManager();
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
            onClick={() => setViewMode(mode.id)}
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

## File: src/hooks/useAppViewManager.hook.ts
```typescript
import { useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAppShellStore, type AppShellState, type ActivePage } from '@/store/appShell.store';
import type { DataItem, ViewMode, SortConfig, SortableField, GroupableField, Status, Priority } from '@/pages/DataDemo/types';
import type { FilterConfig } from '@/pages/DataDemo/components/DataToolbar';
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
	const groupBy = useMemo(() => (searchParams.get('groupBy') as GroupableField | 'none') || 'none', [searchParams]);
	const activeGroupTab = useMemo(() => searchParams.get('tab') || 'all', [searchParams]);
	const filters = useMemo<FilterConfig>(
		() => ({
			searchTerm: q || '',
			status: (status?.split(',') || []).filter(Boolean) as Status[],
			priority: (priority?.split(',') || []).filter(Boolean) as Priority[],
		}),
		[q, status, priority],
	);
	const sortConfig = useMemo<SortConfig | null>(() => {
		const sortParam = sort;
		if (!sortParam) return { key: 'updatedAt', direction: 'desc' }; // Default sort
		if (sortParam === 'default') return null;

		const [key, direction] = sortParam.split('-');
		return { key: key as SortableField, direction: direction as 'asc' | 'desc' };
	}, [sort]);

  // --- MUTATOR ACTIONS ---

  const handleParamsChange = useCallback(
		(newParams: Record<string, string | string[] | null | undefined>, resetPage = false) => {
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
  const setSort = (config: SortConfig | null) => {
    if (!config) {
      handleParamsChange({ sort: null }, true);
    } else {
      handleParamsChange({ sort: `${config.key}-${config.direction}` }, true);
    }
  }
  const setTableSort = (field: SortableField) => {
    let newSort: string | null = `${field}-desc`;
    if (sortConfig?.key === field) {
      if (sortConfig.direction === 'desc') newSort = `${field}-asc`;
      else if (sortConfig.direction === 'asc') newSort = null;
    }
    handleParamsChange({ sort: newSort }, true);
  };
  const setPage = (newPage: number) => handleParamsChange({ page: newPage.toString() });

  const onItemSelect = useCallback((item: DataItem) => {
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
  }), [
    bodyState, sidePaneContent, currentActivePage, itemId, messagingView,
    viewMode, page, groupBy, activeGroupTab, filters, sortConfig,
    navigateTo, openSidePane, closeSidePane, toggleSidePane, toggleSplitView, setNormalView, setMessagingView,
    switchSplitPanes, closeSplitPane, onItemSelect, setViewMode, setGroupBy, setActiveGroupTab, setFilters,
    setSort, setTableSort, setPage
  ]);
}
```

## File: src/pages/DataDemo/components/DataCardView.tsx
```typescript
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight } from 'lucide-react'
import type { DataItem } from '../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import { EmptyState } from './EmptyState'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import {
  useSelectedItem,
} from '../store/dataDemo.store'
import {
  AssigneeInfo,
  ItemMetrics,
  ItemProgressBar,
  ItemStatusBadge,
  ItemTags,
  ItemDateInfo,
} from './shared/DataItemParts'
import { AddDataItemCta } from './shared/AddDataItemCta'

export function DataCardView({ data, isGrid = false }: { data: DataItem[]; isGrid?: boolean }) {
  const { onItemSelect, itemId } = useAppViewManager();
  const selectedItem = useSelectedItem(itemId);

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
      {items.map((item: DataItem) => {
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
      <AddDataItemCta viewMode={isGrid ? 'grid' : 'cards'} />
    </div>
  )
}
```

## File: src/pages/DataDemo/index.tsx
```typescript
import { useRef, useEffect, useCallback, useMemo } from 'react'
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
