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
          <div key={item.id} onClick={() => onItemSelect(item)} className="border-b cursor-pointer px-2">
            <div
              className={cn(
                "group flex items-center px-2 py-2 rounded-md transition-colors duration-200",
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
                <ItemPriorityBadge priority={item.priority} className="hidden sm:inline-flex" />
              </div>
            </div>
          </div>
        )
      })}
      <AddDataItemCta viewMode='list' />
    </div>
  )
}