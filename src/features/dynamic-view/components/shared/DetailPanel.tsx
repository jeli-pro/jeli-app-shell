import React, { useRef, useState, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Clock, 
  Tag,
  User,
  BarChart3,
} from 'lucide-react'
import type { GenericItem, DetailViewConfig } from '../../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook';
import { EditableField } from './EditableField'
import { DraggableSection } from './DraggableSection'
import { getNestedValue } from '@/lib/utils'
import { useDynamicView } from '../../DynamicViewContext'

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
  
  const { getFieldDef } = useDynamicView<TFieldId, TItem>();
  const { header, body } = config;
  const [sections, setSections] = useState([...body.sections]);

  const sectionIds = useMemo(() => sections.map(s => s.title), [sections]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setSections((currentSections) => {
        const oldIndex = sectionIds.indexOf(active.id as string);
        const newIndex = sectionIds.indexOf(over!.id as string);
        return arrayMove(currentSections, oldIndex, newIndex);
      });
    }
  };

  if (!item) {
    return null
  }
  
  return (
    <div ref={contentRef} className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
             <EditableField item={item} fieldId={header.thumbnailField} />
          </div>
          <div className="flex-1 min-w-0 break-words">
            <h1 className="text-2xl font-bold mb-1 leading-tight truncate">
              <EditableField item={item} fieldId={header.titleField} />
            </h1>
            <div className="text-muted-foreground truncate">
              <EditableField item={item} fieldId={header.descriptionField} />
            </div>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {header.badgeFields.map((fieldId: TFieldId) => (
            <EditableField key={fieldId} item={item} fieldId={fieldId} />
          ))}
        </div>

        {/* Progress */}
        <EditableField item={item} fieldId={header.progressField} options={{ showPercentage: true }} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sectionIds}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section) => {
                const IconComponent = SECTION_ICONS[section.title];
                const hasContent = section.fields.some((fieldId: TFieldId) => {
                  const value = getNestedValue(item, fieldId as string);
                  return value !== null && typeof value !== 'undefined';
                });

                if (!hasContent) return null;

                return (
                  <DraggableSection key={section.title} id={section.title} >
                    <div className="p-4 bg-card/30 rounded-2xl border border-border/30">
                      <div className="flex items-center gap-1 mb-3">
                        {IconComponent && <IconComponent className="w-4 h-4 text-muted-foreground" />}
                        <h3 className="font-semibold text-sm">{section.title}</h3>
                      </div>
                      <div className="space-y-3">
                        {section.fields.map((fieldId: TFieldId) => {
                          const fieldDef = getFieldDef(fieldId);
                          return (
                            <div key={fieldId} className="flex items-start gap-4 text-sm">
                              <div className="w-1/3 text-muted-foreground pt-1.5 shrink-0">{fieldDef?.label}</div>
                              <div className="w-2/3 grow min-w-0 break-words"><EditableField item={item} fieldId={fieldId} /></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </DraggableSection>
                );
              })}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  )
}