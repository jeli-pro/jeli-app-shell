import React, { useRef } from 'react'
import {
  Clock, 
  Tag,
  User,
  BarChart3,
} from 'lucide-react'
import type { GenericItem, DetailViewConfig } from '../../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook';
import { FieldRenderer } from '@/features/dynamic-view/components/shared/FieldRenderer'
import { getNestedValue } from '@/lib/utils'

interface DetailPanelProps<TFieldId extends string, TItem extends GenericItem> {
  item: TItem;
  config: DetailViewConfig<TFieldId>;
}

const SECTION_ICONS: Record<string, React.ElementType> = {
  "Assigned to": User,
  "Engagement Metrics": BarChart3,
  "Tags": Tag,
  "Timeline": Clock,
};

export function DetailPanel<TFieldId extends string, TItem extends GenericItem>({ item, config }: DetailPanelProps<TFieldId, TItem>) {
  const contentRef = useRef<HTMLDivElement>(null)
  useStaggeredAnimation(contentRef, [item]);

  if (!item) {
    return null
  }
  
  const { header, body } = config;

  return (
    <div ref={contentRef} className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
            <FieldRenderer item={item} fieldId={header.thumbnailField} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold mb-2 leading-tight">
              <FieldRenderer item={item} fieldId={header.titleField} />
            </h1>
            <p className="text-muted-foreground">
              <FieldRenderer item={item} fieldId={header.descriptionField} />
            </p>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {header.badgeFields.map((fieldId: TFieldId) => (
            <FieldRenderer key={fieldId} item={item} fieldId={fieldId} />
          ))}
        </div>

        {/* Progress */}
        <FieldRenderer item={item} fieldId={header.progressField} options={{ showPercentage: true }} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {body.sections.map((section) => {
            const IconComponent = SECTION_ICONS[section.title];
            // Render section only if at least one of its fields has a value
            const hasContent = section.fields.some((fieldId: TFieldId) => {
              const value = getNestedValue(item, fieldId as string);
              return value !== null && typeof value !== 'undefined';
            });

            if (!hasContent) return null;

            return (
              <div key={section.title} className="bg-card/30 rounded-2xl p-4 border border-border/30">
                <div className="flex items-center gap-1 mb-3">
                  {IconComponent && <IconComponent className="w-4 h-4 text-muted-foreground" />}
                  <h3 className="font-semibold text-sm">{section.title}</h3>
                </div>
                <div className="space-y-3">
                  {section.fields.map((fieldId: TFieldId) => (
                    <FieldRenderer key={fieldId} item={item} fieldId={fieldId} options={{ avatarClassName: "w-12 h-12" }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}