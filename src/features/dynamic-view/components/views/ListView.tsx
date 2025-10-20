import { useRef } from 'react'
import { cn } from '@/lib/utils'
import type { GenericItem } from '../../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import { EmptyState } from '../shared/EmptyState'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import { 
  useSelectedItem,
} from '../../../../pages/DataDemo/store/dataDemo.store'
import { AddDataItemCta } from '../shared/AddDataItemCta'
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'

export function ListView({ data }: { data: GenericItem[] }) {
  const { onItemSelect, itemId } = useAppViewManager();
  const selectedItem = useSelectedItem(itemId);
  const { config } = useDynamicView();

  const listRef = useRef<HTMLDivElement>(null)
  useStaggeredAnimation(listRef, [data], { mode: 'incremental', scale: 1, y: 20, stagger: 0.05, duration: 0.4 });

  const items = Array.isArray(data) ? data : [];
  if (items.length === 0) {
    return <EmptyState />
  }

  return (
    <div ref={listRef}>
      {items.map((item: GenericItem) => {
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
                <div className="flex-shrink-0 w-8 text-center">
                  <FieldRenderer item={item} fieldId={config.listView.iconField} className="text-xl" />
                </div>
                <div className="font-medium truncate text-card-foreground group-hover:text-primary">
                  <FieldRenderer item={item} fieldId={config.listView.titleField} />
                </div>
              </div>

              {/* Right side: Metadata */}
              <div className="flex shrink-0 items-center gap-2 sm:gap-4 md:gap-6 ml-4 text-sm text-muted-foreground">
                {config.listView.metaFields.map(fieldId => (
                  <FieldRenderer key={fieldId} item={item} fieldId={fieldId} options={{ compact: true, avatarClassName: 'w-7 h-7' }} />
                ))}
              </div>
            </div>
          </div>
        )
      })}
      <AddDataItemCta viewMode='list' />
    </div>
  )
}