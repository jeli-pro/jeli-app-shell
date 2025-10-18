import { useState, useMemo } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, getPriorityColor, getPrioritySolidColor } from "@/lib/utils";
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
  const priorityColor = getPrioritySolidColor(item.priority);

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
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
              "flex items-center gap-2 p-1.5 rounded-lg cursor-grab transition-all duration-200",
              "hover:bg-accent",
              isSelected && "bg-primary/10 ring-1 ring-primary/50",
              isDragging && "opacity-30 cursor-grabbing"
            )}
          >
            <div className={cn("w-2 h-2 rounded-full flex-shrink-0", priorityColor)} />
            <span className="text-xs font-medium truncate text-foreground/80">{item.title}</span>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" align="start">
          <div className="font-semibold">{item.title}</div>
          <div className="text-sm text-muted-foreground">{item.category}</div>
          <Badge className={cn("mt-2 text-xs", getPriorityColor(item.priority))}>{item.priority}</Badge>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

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
    itemsWithDueDate.forEach(item => {
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
        <div className="grid grid-cols-7 border-t border-l border-border" onDragEnd={handleDragEnd}>
          {weekdays.map(day => (
            <div key={day} className="p-2 text-center text-xs font-semibold text-muted-foreground bg-muted/30 border-b border-r">
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
              className="col-span-7 grid grid-cols-7"
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
                      "relative min-h-[160px] border-b border-r p-2 flex flex-col transition-all duration-200",
                      isCurrentMonthDay ? "bg-card/50" : "bg-muted/20 text-muted-foreground",
                      isDropTarget ? "bg-primary/10 ring-2 ring-primary/30 z-10" : "hover:bg-accent/50"
                    )}
                  >
                    <span className={cn(
                      "font-semibold text-xs mb-2",
                      isToday(day) && "flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground"
                    )}>
                      {format(day, "d")}
                    </span>
                    <div className="space-y-1 overflow-y-auto flex-grow">
                      <AnimatePresence>
                        {dayEvents.slice(0, 3).map(item => (
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
                    {dayEvents.length > 3 && (
                      <div className="absolute bottom-1 right-2 text-xs font-bold text-muted-foreground">
                        +{dayEvents.length - 3} more
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