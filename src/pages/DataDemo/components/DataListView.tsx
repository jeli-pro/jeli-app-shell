import { useRef } from 'react'
import { cn } from '@/lib/utils'
import type { DataItem } from '../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import { EmptyState } from './EmptyState'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import { useResizeObserver } from '@/hooks/useResizeObserver.hook'
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
  const { width } = useResizeObserver(listRef);

  // Breakpoints for responsive metadata
  const showTags = width > 1050;
  const showDate = width > 850;
  const showStatus = width > 700;
  const compactAssignee = width < 600;
  const showPriority = width > 450;

  const items = Array.isArray(data) ? data : [];
  if (items.length === 0) {
    return <EmptyState />
  }

  return (
    <div ref={listRef}>
      {items.map((item: DataItem) => {
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
                <span className="text-xl flex-shrink-0 w-8 text-center">{item.thumbnail}</span>
                <p className="font-medium truncate text-card-foreground group-hover:text-primary">{item.title}</p>
              </div>

              {/* Right side: Metadata */}
              <div className="flex shrink-0 items-center gap-2 sm:gap-4 md:gap-6 ml-4 text-sm text-muted-foreground">
                {showStatus && <ItemStatusBadge status={item.status} />}
                {showTags && <ItemTags tags={item.tags} />}
                {showDate && <ItemDateInfo date={item.updatedAt} />}
                <AssigneeInfo assignee={item.assignee} avatarClassName="w-7 h-7" compact={compactAssignee} />
                {showPriority && <ItemPriorityBadge priority={item.priority} />}
              </div>
            </div>
          </div>
        )
      })}
      <AddDataItemCta viewMode='list' />
    </div>
  )
}