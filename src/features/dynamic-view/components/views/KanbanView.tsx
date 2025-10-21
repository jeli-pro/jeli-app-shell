import { useState, useEffect, Fragment } from "react";
import {
  GripVertical,
  Plus,
} from "lucide-react";
import type { GenericItem } from '../../types'
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EmptyState } from "../shared/EmptyState";
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'

interface KanbanCardProps {
  item: GenericItem;
  isDragging: boolean;
}

function KanbanCard({ item, isDragging, ...props }: KanbanCardProps & React.HTMLAttributes<HTMLDivElement>) {
  const { config, onItemSelect } = useDynamicView();
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
  const { groupBy, onItemUpdate } = useDynamicView();

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
        onItemUpdate?.(itemId, { [groupBy]: targetColumnId } as Partial<GenericItem>);
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