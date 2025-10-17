import { useState, useEffect } from "react";
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
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDragEnter = (columnId: string) => {
    setDragOverColumn(columnId);
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    try {
      const { itemId, sourceColumnId } = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (sourceColumnId === targetColumnId) return;

      const droppedItem = columns[sourceColumnId]?.find(i => i.id === itemId);
      if (!droppedItem) return;

      // Update local state for immediate feedback
      setColumns(prev => {
        const newColumns = { ...prev };
        newColumns[sourceColumnId] = newColumns[sourceColumnId].filter(i => i.id !== itemId);
        newColumns[targetColumnId] = [...newColumns[targetColumnId], droppedItem];
        return newColumns;
      });
      
      // Persist change to global store. The groupBy value tells us which property to update.
      if (groupBy !== 'none') {
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
    setDragOverColumn(null);
  };

  const initialColumns = Object.entries(data);

  if (!initialColumns || initialColumns.length === 0) {
    return <EmptyState />;
  }

  const statusColors: Record<string, string> = {
    active: "bg-blue-500", pending: "bg-yellow-500", completed: "bg-green-500", archived: "bg-gray-500",
    low: "bg-green-500", medium: "bg-blue-500", high: "bg-orange-500", critical: "bg-red-500",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 items-start gap-6 pb-4">
      {Object.entries(columns).map(([columnId, items]) => (
        <div
          key={columnId}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, columnId)}
          onDragEnter={() => handleDragEnter(columnId)}
          onDragLeave={() => setDragOverColumn(null)}
          className={cn(
            "bg-card/20 dark:bg-neutral-900/20 backdrop-blur-xl rounded-3xl p-5 border border-border dark:border-neutral-700/50 transition-all duration-300",
            dragOverColumn === columnId && "bg-primary/10 border-primary/30"
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

          <div className="space-y-4 min-h-[100px]">
            {items.map((item) => (
              <KanbanCard 
                key={item.id} 
                item={item} 
                isDragging={draggedItemId === item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item, columnId)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}