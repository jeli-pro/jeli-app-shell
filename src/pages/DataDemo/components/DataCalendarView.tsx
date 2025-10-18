import { useState, useMemo, useRef } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isSameDay, } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getPriorityColor } from "@/lib/utils";
import type { DataItem, CalendarDisplayProp, CalendarDateProp } from "../types";
import { useAppViewManager } from "@/hooks/useAppViewManager.hook";
import { useResizeObserver } from "@/hooks/useResizeObserver.hook";
import { useSelectedItem, useDataDemoStore } from "../store/dataDemo.store";
import { CalendarViewControls } from "./DataCalendarViewControls";
import { ItemTags } from "./shared/DataItemParts";

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

function CalendarEvent({ item, isSelected, isDragging, onDragStart, displayProps }: { 
    item: DataItem; 
    isSelected: boolean;
    isDragging: boolean;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, itemId: string) => void;
    displayProps: CalendarDisplayProp[];
}) {
  const { onItemSelect } = useAppViewManager();
    const hasFooter = displayProps.includes('priority') || displayProps.includes('assignee');

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
                "p-2 rounded-lg cursor-grab transition-all duration-200 border bg-card/60 dark:bg-neutral-800/60 backdrop-blur-sm space-y-1",
                "hover:bg-card/80 dark:hover:bg-neutral-700/70",
                isSelected && "ring-2 ring-primary ring-offset-background ring-offset-2 bg-card/90",
                isDragging && "opacity-50 ring-2 ring-primary cursor-grabbing"
            )}
        >
            <h4 className="font-semibold text-sm leading-tight text-card-foreground/90 line-clamp-2">
                {item.title}
            </h4>

            {displayProps.includes('tags') && item.tags.length > 0 && (
                <ItemTags tags={item.tags} />
            )}

            {hasFooter && (
                <div className="flex items-center justify-between pt-1 border-t border-border/30 dark:border-neutral-700/50">
                    {displayProps.includes('priority') ? (
                        <Badge className={cn("text-xs border capitalize", getPriorityColor(item.priority))}>
                            {item.priority}
                        </Badge>
                    ) : <div />}
                    {displayProps.includes('assignee') && (
                        <Avatar className="w-5 h-5">
                            <AvatarImage src={item.assignee.avatar} />
                            <AvatarFallback className="text-[10px] bg-muted dark:bg-neutral-700 text-foreground dark:text-neutral-200 font-medium">
                                {item.assignee.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                        </Avatar>
                    )}
                </div>
            )}
        </motion.div>
    );
}

const datePropLabels: Record<CalendarDateProp, string> = {
  dueDate: 'due dates',
  createdAt: 'creation dates',
  updatedAt: 'update dates',
};

export function DataCalendarView({ data }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { 
    itemId, 
    calendarDateProp, 
    calendarDisplayProps, 
    calendarItemLimit 
  } = useAppViewManager();
  const selectedItem = useSelectedItem(itemId);
  const updateItem = useDataDemoStore(s => s.updateItem);
  
  // Drag & Drop State
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dropTargetDate, setDropTargetDate] = useState<Date | null>(null);

  // Responsive Calendar State
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const { width } = useResizeObserver(calendarContainerRef);
  const MIN_DAY_WIDTH = 160; // px
  const numColumns = useMemo(() => {
    if (width === 0) return 7;
    const cols = Math.floor(width / MIN_DAY_WIDTH);
    return Math.max(3, Math.min(7, cols));
  }, [width]);

  const itemsByDateProp = useMemo(() => data.filter(item => !!item[calendarDateProp]), [data, calendarDateProp]);

  const eventsByDate = useMemo(() => {
    const eventsMap = new Map<string, DataItem[]>();
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
  
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

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

          <AnimatePresence mode="wait">
            <motion.div
              key={format(currentDate, "yyyy-MM")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
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
                      <AnimatePresence>
                        {visibleEvents.map(item => (
                          <CalendarEvent
                            key={item.id} 
                            item={item} 
                            isSelected={selectedItem?.id === item.id}
                            isDragging={draggedItemId === item.id}
                            onDragStart={handleDragStart}
                            displayProps={calendarDisplayProps}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                    {hiddenEventsCount > 0 && (
                      <div className="absolute bottom-1 right-2 text-xs font-bold text-muted-foreground">
                        +{hiddenEventsCount} more
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