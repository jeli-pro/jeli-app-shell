import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'
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

export function CardView({ data, isGrid = false }: { data: GenericItem[]; isGrid?: boolean }) {
  const { onItemSelect, itemId } = useAppViewManager();
  const selectedItem = useSelectedItem(itemId);
  const { config } = useDynamicView();
  const { cardView: viewConfig } = config;

  const containerRef = useRef<HTMLDivElement>(null)
  useStaggeredAnimation(containerRef, [data], { mode: 'incremental', y: 40 });

  const items = Array.isArray(data) ? data : [];
  if (items.length === 0) {
    return <EmptyState />
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "gap-6",
        isGrid
          ? "grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]"
          : "grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))]",
        "pb-4"
      )}
    >
      {items.map((item: GenericItem) => {
        const isSelected = selectedItem?.id === item.id
        
        return (
          <div
            key={item.id}
            onClick={() => onItemSelect(item)}
            className={cn(
              "group relative overflow-hidden rounded-3xl border bg-card/50 backdrop-blur-sm transition-all duration-500 cursor-pointer",
              "hover:bg-card/80 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-2",
              "active:scale-[0.98]",
              isSelected && "ring-2 ring-primary/30 border-primary/40 bg-card/90 shadow-lg shadow-primary/20",
            )}
          >
            {/* Card Header with Thumbnail */}
            <div className="relative p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                  <FieldRenderer item={item} fieldId={viewConfig.thumbnailField} />
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </div>

              {/* Header Fields (e.g., priority indicator) */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {viewConfig.headerFields.map(fieldId => (
                  <FieldRenderer key={fieldId} item={item} fieldId={fieldId} />
                ))}
              </div>
            </div>

            {/* Card Content */}
            <div className="px-6 pb-6 space-y-4">
              <div className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                <FieldRenderer item={item} fieldId={viewConfig.titleField} />
              </div>
              <div className="text-muted-foreground text-sm line-clamp-3">
                <FieldRenderer item={item} fieldId={viewConfig.descriptionField} />
              </div>
              
              {viewConfig.contentFields.map(fieldId => (
                <FieldRenderer key={fieldId} item={item} fieldId={fieldId} options={{ showPercentage: true }} />
              ))}
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {viewConfig.footerFields.map(fieldId => (
                  <FieldRenderer key={fieldId} item={item} fieldId={fieldId} />
                ))}
              </div>
            </div>

            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 pointer-events-none" />
            )}
          </div>
        )
      })}
      <AddDataItemCta viewMode={isGrid ? 'grid' : 'cards'} />
    </div>
  )
}