import { useDynamicView } from '../../DynamicViewContext';
import type { GenericItem, BadgeFieldDefinition, FieldDefinition } from '../../types';
import { cn, getNestedValue } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Heart, Share } from 'lucide-react';

interface FieldRendererProps<TFieldId extends string, TItem extends GenericItem> {
  item: TItem;
  fieldId: TFieldId;
  className?: string;
  options?: Record<string, any>; // For extra props like 'compact' for avatar
}

export function FieldRenderer<TFieldId extends string, TItem extends GenericItem>({ item, fieldId, className, options }: FieldRendererProps<TFieldId, TItem>) {
  const { getFieldDef } = useDynamicView<TFieldId, TItem>();
  const fieldDef = getFieldDef(fieldId);
  const value = getNestedValue(item, fieldId);

  // Custom render function takes precedence
  if (fieldDef?.render) {
    return <>{(fieldDef as FieldDefinition<TFieldId, TItem>).render?.(item, options)}</>;
  }

  if (!fieldDef) {
    console.warn(`[FieldRenderer] No field definition found for ID: ${fieldId}`);
    return <span className="text-red-500">?</span>;
  }

  if (value === null || typeof value === 'undefined') {
    return null; // Or some placeholder like 'N/A'
  }
  
  switch (fieldDef.type) {
    case 'string':
    case 'longtext':
      return <span className={cn("truncate", className)}>{String(value)}</span>;
    
    case 'thumbnail':
      return <span className={cn("text-xl", className)}>{String(value)}</span>;

    case 'badge': {
      const { colorMap, indicatorColorMap } = fieldDef as BadgeFieldDefinition<TFieldId, TItem>;
      
      if (options?.displayAs === 'indicator' && indicatorColorMap) {
        const indicatorColorClass = indicatorColorMap[String(value)] || 'bg-muted-foreground';
        return (
          <div className={cn("w-3 h-3 rounded-full", indicatorColorClass, className)} />
        );
      }

      const colorClass = colorMap?.[String(value)] || '';
      return (
        <Badge variant="outline" className={cn("font-medium capitalize", colorClass, className)}>
          {String(value)}
        </Badge>
      );
    }
    
    case 'avatar': {
      const { compact = false, avatarClassName = "w-8 h-8" } = options || {};
      const avatarUrl = getNestedValue(value, 'avatar');
      const name = getNestedValue(value, 'name');
      const email = getNestedValue(value, 'email');
      const fallback = name?.split(' ').map((n: string) => n[0]).join('') || '?';

      const avatarEl = (
        <Avatar className={cn("border-2 border-transparent group-hover:border-primary/50 transition-colors", avatarClassName)}>
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      );
      if (compact) return avatarEl;

      return (
        <div className={cn("flex items-center gap-2 group", className)}>
          {avatarEl}
          <div className="min-w-0 hidden sm:block">
            <p className="font-medium text-sm truncate">{name}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>
      );
    }
    
    case 'progress': {
      const { showPercentage = false } = options || {};
      const bar = (
        <div className="w-full bg-muted rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-primary to-primary/80 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${value}%` }}
          />
        </div>
      );
      if (!showPercentage) return bar;
      
      return (
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">{bar}</div>
          <span className="text-sm font-medium text-muted-foreground">{value}%</span>
        </div>
      );
    }

    case 'date':
      return (
        <div className={cn("flex items-center gap-1.5 text-sm", className)}>
          <Clock className="w-4 h-4" />
          <span>{new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      );

    case 'tags': {
      const MAX_TAGS = 2;
      const tags = Array.isArray(value) ? value : [];
      const remainingTags = tags.length - MAX_TAGS;
      return (
        <div className={cn("flex items-center gap-1.5 flex-wrap", className)}>
          {tags.slice(0, MAX_TAGS).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
          {remainingTags > 0 && (
            <Badge variant="outline" className="text-xs">+{remainingTags}</Badge>
          )}
        </div>
      );
    }

    case 'metrics': {
      const views = getNestedValue(value, 'views') || 0;
      const likes = getNestedValue(value, 'likes') || 0;
      const shares = getNestedValue(value, 'shares') || 0;
      return (
        <div className={cn("flex items-center gap-3 text-sm", className)}>
          <div className="flex items-center gap-1"><Eye className="w-4 h-4" /> {views}</div>
          <div className="flex items-center gap-1"><Heart className="w-4 h-4" /> {likes}</div>
          <div className="flex items-center gap-1"><Share className="w-4 h-4" /> {shares}</div>
        </div>
      );
    }
      
    default:
      return <>{String(value)}</>;
  }
}