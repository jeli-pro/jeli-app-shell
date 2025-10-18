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