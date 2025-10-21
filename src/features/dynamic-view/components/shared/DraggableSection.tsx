import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface DraggableSectionProps {
  id: string;
  children: React.ReactNode;
}

export function DraggableSection({ id, children }: DraggableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn('relative group', isDragging && 'opacity-50 z-50')}>
      <button
        {...attributes}
        {...listeners}
        className="absolute top-4 left-0 -translate-x-full pr-2 p-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-5 h-5" />
      </button>
      {children}
    </div>
  );
}