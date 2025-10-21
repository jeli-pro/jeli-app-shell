import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { GenericItem } from '../../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import { EmptyState } from '../shared/EmptyState'
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'

export function ListView({ data, ctaElement }: { data: GenericItem[], ctaElement?: ReactNode }) {
  const { config, onItemSelect, selectedItemId } = useDynamicView();

  const listRef = useRef<HTMLDivElement>(null)
  useStaggeredAnimation(listRef, [data], { mode: 'incremental', scale: 1, y: 20, stagger: 0.05, duration: 0.4 });

  const items = Array.isArray(data) ? data : [];
  if (items.length === 0) {
    return <EmptyState />
  }

  return (
    <div ref={listRef}>
      {items.map((item: GenericItem) => {
        const isSelected = selectedItemId === item.id
        
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
                {config.listView.metaFields.map(fieldConfig => (
                  <div key={fieldConfig.fieldId} className={fieldConfig.className}>
                    <FieldRenderer item={item} fieldId={fieldConfig.fieldId} options={{ avatarClassName: 'w-7 h-7' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
      {ctaElement}
    </div>
  )
}