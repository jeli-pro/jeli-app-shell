import React, { useRef } from 'react'
import {
  User,
  BarChart3,
  Tag,
  Clock,
} from 'lucide-react'
import type { GenericItem, ViewConfig } from '../../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import { FieldRenderer } from './FieldRenderer'

interface DetailPanelProps {
  item: GenericItem;
  config: ViewConfig;
}

// Map section titles to icons for a richer display
const sectionIconMap: Record<string, React.ElementType> = {
  "Assigned to": User,
  "Engagement Metrics": BarChart3,
  "Tags": Tag,
  "Timeline": Clock,
};

export function DetailPanel({ item, config }: DetailPanelProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  useStaggeredAnimation(contentRef, [item]);
  
  const { detailView: viewConfig } = config;

  if (!item || !viewConfig) {
    return null;
  }

  return (
    <div ref={contentRef}>
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
            <FieldRenderer item={item} fieldId={viewConfig.header.thumbnailField} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold mb-2 leading-tight">
              <FieldRenderer item={item} fieldId={viewConfig.header.titleField} />
            </h1>
            <p className="text-muted-foreground">
              <FieldRenderer item={item} fieldId={viewConfig.header.descriptionField} />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {viewConfig.header.badgeFields.map(fieldId => (
            <FieldRenderer key={fieldId} item={item} fieldId={fieldId} />
          ))}
        </div>
        
        <FieldRenderer item={item} fieldId={viewConfig.header.progressField} options={{ showPercentage: false }} />
      </div>

      {/* Body Content */}
      <div className="p-6 space-y-6">
        {viewConfig.body.sections.map(section => {
          const IconComponent = sectionIconMap[section.title];
          return (
            <div key={section.title} className="bg-card/30 rounded-2xl p-4 border border-border/30">
              <div className="flex items-center gap-2 mb-3">
                {IconComponent && <IconComponent className="w-4 h-4 text-muted-foreground" />}
                <h3 className="font-semibold text-sm">{section.title}</h3>
              </div>
              <div className="space-y-2">
                {section.fields.map(fieldId => (
                  <FieldRenderer key={fieldId} item={item} fieldId={fieldId} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}