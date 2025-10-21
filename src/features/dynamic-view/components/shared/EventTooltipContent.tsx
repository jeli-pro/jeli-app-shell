import type { GenericItem } from '../../types';
import { FieldRenderer } from './FieldRenderer';
import { formatDistanceToNowShort, getPrioritySolidColor, getStatusColor } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface EventTooltipContentProps {
  item: GenericItem;
}

export function EventTooltipContent({ item }: EventTooltipContentProps) {
  const { config } = {
    // This is a placeholder. In a real scenario, this might come from context.
    // For now, we'll hardcode the field IDs we know exist in DataDemoItem.
    statusField: 'status',
    priorityField: 'priority',
    assigneeField: 'assignee',
    dateField: 'dueDate'
  }

  const priorityColor = getPrioritySolidColor(item[config.priorityField]);
  const statusClasses = getStatusColor(item[config.statusField]);

  return (
    <div className="relative w-72 overflow-hidden rounded-xl border border-border/20 bg-background/80 p-4 shadow-xl backdrop-blur-lg">
      {/* Priority Indicator */}
      <div className={`absolute left-0 top-0 h-full w-1.5 ${priorityColor}`} />

      <div className="ml-1.5 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="flex-1 font-semibold leading-tight text-foreground">
            <FieldRenderer item={item} fieldId="title" />
          </h3>
          <div className="flex-shrink-0">
            <FieldRenderer item={item} fieldId={config.assigneeField} options={{ compact: true, avatarClassName: 'w-7 h-7' }} />
          </div>
        </div>

        {/* Status & Date */}
        <div className="flex items-center justify-between text-sm">
          <Badge variant="outline" className={`border-transparent capitalize ${statusClasses}`}>
            {item[config.statusField]}
          </Badge>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatDistanceToNowShort(item[config.dateField])}</span>
          </div>
        </div>

        {/* Tags */}
        <div>
          <FieldRenderer item={item} fieldId="tags" />
        </div>
      </div>
    </div>
  );
}