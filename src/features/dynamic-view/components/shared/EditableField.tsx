import React, { useState, useRef, useEffect } from 'react';
import { useDynamicView } from '../../DynamicViewContext';
import type { GenericItem, ControlOption } from '../../types';
import { FieldRenderer } from './FieldRenderer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Slider } from '@/components/ui/slider';
import { cn, getNestedValue } from '@/lib/utils';
import { mockDataItems } from '@/pages/DataDemo/data/mockData';

interface EditableFieldProps<TFieldId extends string, TItem extends GenericItem> {
  item: TItem;
  fieldId: TFieldId;
  className?: string;
  options?: Record<string, any>;
}

// Mock user list for assignee field
const userList = Array.from(new Set(mockDataItems.map(i => i.assignee.email)))
  .map(email => mockDataItems.find(i => i.assignee.email === email)?.assignee)
  .filter(Boolean) as { name: string; email: string; avatar: string }[];


export function EditableField<TFieldId extends string, TItem extends GenericItem>({
  item,
  fieldId,
  className,
  options,
}: EditableFieldProps<TFieldId, TItem>) {
  const { config, getFieldDef, onItemUpdate } = useDynamicView<TFieldId, TItem>();
  const [isEditing, setIsEditing] = useState(false);
  const fieldDef = getFieldDef(fieldId);
  const value = getNestedValue(item, fieldId);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && (fieldDef?.type === 'string' || fieldDef?.type === 'longtext' || fieldDef?.type === 'thumbnail')) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing, fieldDef]);

  if (!fieldDef || !onItemUpdate) {
    return <FieldRenderer item={item} fieldId={fieldId} className={className} options={options} />;
  }

  const handleUpdate = (newValue: any) => {
    if (value !== newValue) {
      onItemUpdate(item.id, { [fieldId]: newValue } as Partial<TItem>);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !(e.currentTarget instanceof HTMLTextAreaElement)) {
      handleUpdate(e.currentTarget.value);
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const renderEditComponent = () => {
    switch (fieldDef.type) {
      case 'string':
      case 'thumbnail': // For emoji
        return (
          <Input
            ref={inputRef as React.Ref<HTMLInputElement>}
            type="text"
            defaultValue={value}
            onBlur={(e) => handleUpdate(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-auto p-1 bg-transparent border-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
          />
        );
      case 'longtext':
        return (
          <Textarea
            ref={inputRef as React.Ref<HTMLTextAreaElement>}
            defaultValue={value}
            onBlur={(e) => handleUpdate(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-sm w-full p-1 bg-transparent border-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
          />
        );
      case 'badge': {
        const filterableField = config.filterableFields.find((f) => f.id === fieldId);
        const badgeOptions: readonly ControlOption<string>[] = filterableField?.options || [];
        return (
          <Popover open={isEditing} onOpenChange={setIsEditing}>
            <PopoverTrigger asChild>
              <div className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"></div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[200px]" align="start">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {badgeOptions.map((option) => (
                      <CommandItem key={option.id} onSelect={() => handleUpdate(option.id)}>
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      }
      case 'progress': {
        const progressValue = typeof value === 'number' ? value : 0;
        return (
           <div className="flex items-center gap-3 w-full">
            <Slider
              value={[progressValue]}
              max={100} step={1}
              onValueCommit={(val) => handleUpdate(val[0])}
              className="flex-1"
            />
            <span className="text-sm font-medium text-muted-foreground w-10 text-right">{progressValue}%</span>
           </div>
        );
      }
      case 'avatar': {
        return (
          <Popover open={isEditing} onOpenChange={setIsEditing}>
            <PopoverTrigger asChild>
               <div className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"></div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[250px]" align="start">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {userList.map((user) => (
                      <CommandItem key={user.email} onSelect={() => handleUpdate(user)}>
                          <FieldRenderer item={{ assignee: user } as TItem} fieldId={'assignee' as TFieldId} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      }
      case 'date': {
        return (
          <Input
            autoFocus
            type="date"
            defaultValue={value ? new Date(value).toISOString().split('T')[0] : ''}
            onChange={(e) => {
              const date = e.target.valueAsDate;
              if (date) {
                const originalDate = value ? new Date(value) : new Date();
                date.setHours(originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds());
                handleUpdate(date.toISOString());
              }
            }}
            onBlur={() => setIsEditing(false)}
            className="h-8"
          />
        )
      }
      default:
        return <FieldRenderer item={item} fieldId={fieldId} className={className} options={options} />;
    }
  };

  return (
    <div className={cn("w-full group relative", className)} onClick={() => !isEditing && setIsEditing(true)}>
      {isEditing ? (
        renderEditComponent()
      ) : (
        <div className={cn(
          "hover:bg-accent/50 rounded-md transition-colors cursor-text min-h-[32px] w-full p-1",
           fieldDef.type === 'longtext' ? 'flex items-start' : 'flex items-center'
        )}>
            <FieldRenderer item={item} fieldId={fieldId} options={options} />
        </div>
      )}
       {/* For Popover fields, the editor is always rendered when isEditing is true to control its open state */}
       {isEditing && ['badge', 'avatar'].includes(fieldDef.type) && renderEditComponent()}
    </div>
  );
}