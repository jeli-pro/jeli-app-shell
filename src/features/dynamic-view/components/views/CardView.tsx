import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'
import type { GenericItem } from '../../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import { EmptyState } from '../shared/EmptyState'
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'

export function CardView({ data, isGrid = false, ctaElement }: { data: GenericItem[]; isGrid?: boolean, ctaElement?: ReactNode }) {
  const { config, onItemSelect, selectedItemId } = useDynamicView();
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
        const isSelected = selectedItemId === item.id
        
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
                  <FieldRenderer key={fieldId} item={item} fieldId={fieldId} options={{ displayAs: 'indicator' }} />
                ))}
              </div>
            </div>

            {/* Card Content */}
            <div className="px-6 pb-6">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                <FieldRenderer item={item} fieldId={viewConfig.titleField} />
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                <FieldRenderer item={item} fieldId={viewConfig.descriptionField} />
              </p>

              {/* Status and Category */}
              <div className="flex items-center gap-2 mb-4">
                <FieldRenderer item={item} fieldId={viewConfig.statusField} />
                <FieldRenderer item={item} fieldId={viewConfig.categoryField} />
              </div>

              {/* Tags, Progress, Assignee */}
              <div className="space-y-4 mb-4">
                <FieldRenderer item={item} fieldId={viewConfig.tagsField} />
                <FieldRenderer item={item} fieldId={viewConfig.progressField} />
                <FieldRenderer item={item} fieldId={viewConfig.assigneeField} />
              </div>

              {/* Metrics and Date */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <FieldRenderer item={item} fieldId={viewConfig.metricsField} />
                <FieldRenderer item={item} fieldId={viewConfig.dateField} />
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
      {ctaElement}
    </div>
  )
}