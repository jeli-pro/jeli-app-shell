# Directory Structure
```
src/
  components/
    ui/
      animated-tabs.tsx
      dropdown-menu.tsx
      popover.tsx
  hooks/
    useAppViewManager.hook.ts
  pages/
    DataDemo/
      components/
        DataToolbar.tsx
    Messaging/
      components/
        ActivityFeed.tsx
        MessagingContent.tsx
        TaskDetail.tsx
        TaskHeader.tsx
        TaskList.tsx
      data/
        mockData.ts
      store/
        messaging.store.ts
      index.tsx
      types.ts
  App.tsx
```

# Files

## File: src/pages/Messaging/components/ActivityFeed.tsx
```typescript
import React from 'react';
import { useMessagingStore } from '../store/messaging.store';
import type { Message, Contact, Assignee } from '../types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { StickyNote, Info } from 'lucide-react';

interface ActivityFeedProps {
  messages: Message[];
  contact: Contact;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ messages, contact }) => {
  const getAssigneeById = useMessagingStore(state => state.getAssigneeById);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((message) => {
        const assignee = message.userId ? getAssigneeById(message.userId) : null;
        
        if (message.type === 'system') {
          return (
            <div key={message.id} className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Info className="w-3.5 h-3.5" />
              <p>{message.text}</p>
              <p className="whitespace-nowrap">{formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}</p>
            </div>
          );
        }

        if (message.type === 'note') {
          return (
            <div key={message.id} className="flex items-start gap-3">
              <div className="p-1.5 bg-yellow-400/20 text-yellow-600 rounded-full mt-1.5">
                <StickyNote className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm">{assignee?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}</p>
                </div>
                <div className="bg-card border rounded-lg p-3 text-sm">
                  <p>{message.text}</p>
                </div>
              </div>
            </div>
          )
        }

        // Default: 'comment' type
        return (
          <div key={message.id} className={cn(
            "flex items-end gap-3",
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          )}>
            {message.sender === 'contact' && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={contact.avatar} />
                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div className={cn(
              "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl",
              message.sender === 'user' 
                ? 'bg-primary text-primary-foreground rounded-br-none' 
                : 'bg-card border rounded-bl-none'
            )}>
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        )
      })}
    </div>
  );
};
```

## File: src/pages/Messaging/components/TaskDetail.tsx
```typescript
import React from 'react';
import { useParams } from 'react-router-dom';
import { useMessagingStore } from '../store/messaging.store';
import { ActivityFeed } from './ActivityFeed';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, SendHorizontal, Smile, StickyNote } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export const TaskDetail: React.FC = () => {
  const { conversationId: taskId } = useParams<{ conversationId: string }>();
  const task = useMessagingStore(state => taskId ? state.getTaskById(taskId) : undefined);
  
  if (!taskId || !task) {
    return (
        <div className="h-full flex flex-col items-center justify-center p-6 bg-background">
            <p className="text-muted-foreground">Select a task to see its details.</p>
        </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <ActivityFeed messages={task.messages} contact={task.contact} />

      {/* Input Form */}
      <div className="p-4 border-t flex-shrink-0 bg-background/50">
        <Tabs defaultValue="comment" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="comment">Comment</TabsTrigger>
            <TabsTrigger value="note"><StickyNote className="w-4 h-4 mr-2" />Internal Note</TabsTrigger>
          </TabsList>
          <TabsContent value="comment">
             <div className="relative">
                <Textarea placeholder={`Reply to ${task.contact.name}...`} className="pr-24 min-h-[52px]" />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8"><Smile className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8"><Paperclip className="w-4 h-4" /></Button>
                    <Button size="icon" className="rounded-full h-8 w-8"><SendHorizontal className="w-4 h-4" /></Button>
                </div>
            </div>
          </TabsContent>
          <TabsContent value="note">
            <div className="relative">
                <Textarea placeholder="Add an internal note..." className="pr-24 min-h-[52px] bg-yellow-400/10 border-yellow-400/30 focus-visible:ring-yellow-500" />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                    <Button size="icon" className="rounded-full h-8 w-8"><SendHorizontal className="w-4 h-4" /></Button>
                </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
```

## File: src/pages/Messaging/components/TaskHeader.tsx
```typescript
import React from 'react';
import { useMessagingStore } from '../store/messaging.store';
import type { Task, TaskStatus, TaskPriority, Assignee, Contact } from '../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, Inbox, Zap, Shield, Clock, Calendar, Plus, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const statusOptions: { value: TaskStatus; label: string; icon: React.ReactNode }[] = [
    { value: 'open', label: 'Open', icon: <Inbox className="w-4 h-4" /> },
    { value: 'in-progress', label: 'In Progress', icon: <Zap className="w-4 h-4" /> },
    { value: 'done', label: 'Done', icon: <Shield className="w-4 h-4" /> },
    { value: 'snoozed', label: 'Snoozed', icon: <Clock className="w-4 h-4" /> },
];

const priorityOptions: { value: TaskPriority; label: string; icon: React.ReactNode }[] = [
    { value: 'high', label: 'High', icon: <div className="w-2.5 h-2.5 rounded-full bg-red-500" /> },
    { value: 'medium', label: 'Medium', icon: <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> },
    { value: 'low', label: 'Low', icon: <div className="w-2.5 h-2.5 rounded-full bg-green-500" /> },
    { value: 'none', label: 'None', icon: <div className="w-2.5 h-2.5 rounded-full bg-gray-400" /> },
];


interface TaskHeaderProps {
  task: (Task & { contact: Contact; assignee: Assignee | null });
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({ task }) => {
  const { updateTask, assignees } = useMessagingStore();
  const currentStatus = statusOptions.find(o => o.value === task.status);
  const currentPriority = priorityOptions.find(o => o.value === task.priority);

  return (
    <div className="space-y-4">
      {/* Task Title & Contact */}
      <div className="overflow-hidden">
        <h2 className="font-bold text-xl lg:text-2xl truncate" title={task.title}>
          {task.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          With <a href="#" className="hover:underline font-medium text-foreground/80">{task.contact.name}</a>
          <span className="mx-1.5">&middot;</span>
          via <span className="capitalize font-medium text-foreground/80">{task.channel}</span>
        </p>
      </div>

      {/* Properties Bar */}
      <div className="flex flex-wrap items-center gap-y-2 text-sm">
        {/* Assignee Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 font-normal">
              {task.assignee ? (
                <Avatar className="h-5 w-5"><AvatarImage src={task.assignee.avatar} /><AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback></Avatar>
              ) : (
                <User className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="font-medium">{task.assignee?.name || 'Unassigned'}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup value={task.assigneeId || 'null'} onValueChange={val => updateTask(task.id, { assigneeId: val === 'null' ? null : val })}>
              <DropdownMenuRadioItem value="null">
                <User className="w-4 h-4 mr-2 text-muted-foreground" /> Unassigned
              </DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              {assignees.map(a => (
                <DropdownMenuRadioItem key={a.id} value={a.id}>
                  <Avatar className="h-5 w-5 mr-2"><AvatarImage src={a.avatar} /><AvatarFallback>{a.name.charAt(0)}</AvatarFallback></Avatar>
                  {a.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-2 h-4 w-px bg-border" />

        {/* Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              {currentStatus?.icon}
              <span className="font-medium text-foreground">{currentStatus?.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {statusOptions.map(o => (
              <DropdownMenuItem key={o.value} onClick={() => updateTask(task.id, { status: o.value })}>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2">{o.icon}</div>
                  <span>{o.label}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="mx-2 h-4 w-px bg-border" />
        
        {/* Priority Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              {currentPriority?.icon}
              <span className="font-medium text-foreground">{currentPriority?.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {priorityOptions.map(o => (
              <DropdownMenuItem key={o.value} onClick={() => updateTask(task.id, { priority: o.value })}>
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 mr-2">{o.icon}</div>
                  <span>{o.label}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-2 h-4 w-px bg-border" />

        {/* Due Date - for display, could be a popover trigger */}
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground cursor-default" disabled>
            <Calendar className="w-4 h-4" />
            <span className="font-medium text-foreground">{task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}</span>
        </Button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2">
        {task.tags.map(t => <Badge variant="secondary" key={t}>{t}</Badge>)}
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs rounded-md border-dashed">
          <Plus className="w-3 h-3 mr-1" /> Tag
        </Button>
      </div>
    </div>
  );
};
```

## File: src/pages/Messaging/components/TaskList.tsx
```typescript
import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Check, Inbox, Clock, Zap, Shield } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useMessagingStore } from '../store/messaging.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { AnimatedTabs } from '@/components/ui/animated-tabs';
import type { TaskStatus, TaskPriority } from '../types';

// Local helpers for styling based on task properties
const getStatusIcon = (status: TaskStatus) => {
    switch(status) {
        case 'open': return <Inbox className="w-3 h-3 text-blue-500" />;
        case 'in-progress': return <Zap className="w-3 h-3 text-yellow-500" />;
        case 'done': return <Shield className="w-3 h-3 text-green-500" />;
        case 'snoozed': return <Clock className="w-3 h-3 text-gray-500" />;
    }
};

const getPriorityIcon = (priority: TaskPriority) => {
    switch(priority) {
        case 'high': return <div className="w-2 h-2 rounded-full bg-red-500" />;
        case 'medium': return <div className="w-2 h-2 rounded-full bg-yellow-500" />;
        case 'low': return <div className="w-2 h-2 rounded-full bg-green-500" />;
        default: return <div className="w-2 h-2 rounded-full bg-gray-400" />;
    }
};

const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'open', label: 'Open' }, { value: 'in-progress', label: 'In Progress' }, { value: 'done', label: 'Done' }, { value: 'snoozed', label: 'Snoozed' }
];
const priorityOptions: { value: TaskPriority; label: string }[] = [
    { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }, { value: 'none', label: 'None' }
];

export const TaskList = () => {
  const { conversationId } = useParams<{ conversationId: string }>(); // This will be taskId later
  const { 
    getFilteredTasks,
    searchTerm,
    setSearchTerm,
    activeFilters,
   } = useMessagingStore();
  const tasks = getFilteredTasks();
  const [activeTab, setActiveTab] = useState('all');

  const tabs = useMemo(() => [{ id: 'all', label: 'All Tasks' }, { id: 'unread', label: 'Unread' }], []);

  const filteredTasks = useMemo(() => {
    if (activeTab === 'unread') {
      return tasks.filter(task => task.unreadCount > 0);
    }
    return tasks;
  }, [tasks, activeTab]);
  
  const activeFilterCount = Object.values(activeFilters).reduce((count, filterArray) => count + filterArray.length, 0);


  return (
    <div className="h-full flex flex-col border-r bg-background/80">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-background/80 p-4 space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Inbox</h2>
        <div className="flex gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search tasks..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10 border-dashed gap-2">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                        {activeFilterCount > 0 && <Badge variant="secondary" className="rounded-sm px-1 font-normal">{activeFilterCount}</Badge>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0" align="end">
                    <FilterCommand />
                </PopoverContent>
            </Popover>
        </div>
      </div>
      <AnimatedTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Task List */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-1">
          {filteredTasks.map(task => (
            <Link
              to={`/messaging/${task.id}`}
              key={task.id}
              className={cn(
                "block p-3 rounded-lg text-left transition-all duration-200 hover:bg-accent/50",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none",
                conversationId === task.id && "bg-accent"
              )}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9 mt-1">
                  <AvatarImage src={task.contact.avatar} alt={task.contact.name} />
                  <AvatarFallback>{task.contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-semibold truncate pr-2">{task.contact.name}</p>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">{formatDistanceToNow(new Date(task.lastActivity.timestamp), { addSuffix: true })}</p>
                    </div>
                    <p className="text-sm truncate text-foreground">{task.title}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5" title={task.status}>
                            {getStatusIcon(task.status)}
                            <span className="capitalize">{task.status.replace('-', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title={task.priority}>
                            {getPriorityIcon(task.priority)}
                            <span className="capitalize">{task.priority}</span>
                        </div>
                        {task.assignee && (
                            <div className="flex items-center gap-1.5" title={`Assigned to ${task.assignee.name}`}>
                                <Avatar className="h-4 w-4"><AvatarImage src={task.assignee.avatar} /></Avatar>
                            </div>
                        )}
                    </div>
                </div>
                {task.unreadCount > 0 && (
                    <div className="flex items-center justify-center self-center ml-auto">
                        <Badge className="bg-primary h-5 w-5 p-0 flex items-center justify-center">{task.unreadCount}</Badge>
                    </div>
                )}
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

// Filter component for popover
function FilterCommand() {
    const { activeFilters, setFilters, assignees, getAvailableTags } = useMessagingStore();
    const availableTags = useMemo(() => getAvailableTags(), [getAvailableTags]);

    const handleSelect = (type: 'status' | 'priority' | 'assigneeId' | 'tags', value: string) => {
        const current = new Set(activeFilters[type]);
        current.has(value) ? current.delete(value) : current.add(value);
        setFilters({ [type]: Array.from(current) });
    };

    const hasActiveFilters = Object.values(activeFilters).some(arr => arr.length > 0);

    return (
        <Command>
            <CommandInput placeholder="Filter by..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Status">
                    {statusOptions.map(o => (
                        <CommandItem key={o.value} onSelect={() => handleSelect('status', o.value)}>
                            <div className={cn('mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary', activeFilters.status.includes(o.value) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible')}><Check className="h-4 w-4" /></div>
                            <span>{o.label}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Priority">
                    {priorityOptions.map(o => (
                        <CommandItem key={o.value} onSelect={() => handleSelect('priority', o.value)}>
                            <div className={cn('mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary', activeFilters.priority.includes(o.value) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible')}><Check className="h-4 w-4" /></div>
                            <span>{o.label}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Assignee">
                    {assignees.map(a => (
                        <CommandItem key={a.id} onSelect={() => handleSelect('assigneeId', a.id)}>
                            <div className={cn('mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary', activeFilters.assigneeId.includes(a.id) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible')}><Check className="h-4 w-4" /></div>
                            <Avatar className="h-5 w-5 mr-2"><AvatarImage src={a.avatar} /><AvatarFallback>{a.name.charAt(0)}</AvatarFallback></Avatar>
                            <span>{a.name}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Tags">
                    {availableTags.map(t => (
                        <CommandItem key={t} onSelect={() => handleSelect('tags', t)}>
                            <div className={cn('mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary', activeFilters.tags.includes(t) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible')}><Check className="h-4 w-4" /></div>
                            <span>{t}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>

                {hasActiveFilters && (
                    <>
                        <CommandSeparator />
                        <CommandGroup>
                            <CommandItem onSelect={() => setFilters({ status: [], priority: [], assigneeId: [], tags: [], channels: [] })} className="justify-center text-center text-sm">Clear all filters</CommandItem>
                        </CommandGroup>
                    </>
                )}
            </CommandList>
        </Command>
    );
}
```

## File: src/components/ui/animated-tabs.tsx
```typescript
"use client"

import * as React from "react"
import { useState, useRef, useEffect, useLayoutEffect } from "react"
import { cn } from "@/lib/utils"

interface Tab {
  id: string
  label: React.ReactNode
}

interface AnimatedTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void,
  size?: 'default' | 'sm'
}

const AnimatedTabs = React.forwardRef<HTMLDivElement, AnimatedTabsProps>(
  ({ className, tabs, activeTab, onTabChange, size = 'default', ...props }, ref) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" })
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

    // Update active index when controlled prop changes
    useEffect(() => {
      const newActiveIndex = tabs.findIndex(tab => tab.id === activeTab)
      if (newActiveIndex !== -1 && newActiveIndex !== activeIndex) {
        setActiveIndex(newActiveIndex)
      }
    }, [activeTab, tabs, activeIndex])
    
    // Update active indicator position
    useEffect(() => {
      const activeElement = tabRefs.current[activeIndex]
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        })
      }
    }, [activeIndex, tabs])

    // Set initial position of active indicator
    useLayoutEffect(() => {
        const initialActiveIndex = activeTab ? tabs.findIndex(tab => tab.id === activeTab) : 0
        const indexToUse = initialActiveIndex !== -1 ? initialActiveIndex : 0
        
        const firstElement = tabRefs.current[indexToUse]
        if (firstElement) {
          const { offsetLeft, offsetWidth } = firstElement
          setActiveStyle({
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          })
        }
    }, [tabs, activeTab])

    return (
      <div 
        ref={ref} 
        className={cn("relative flex w-full items-center", className)} 
        {...props}
      >
        {/* Active Indicator */}
        <div
          className="absolute -bottom-px h-0.5 bg-primary transition-all duration-300 ease-out"
          style={activeStyle}
        />

        {/* Tabs */}
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[index] = el)}
            className={cn(
              "group relative cursor-pointer text-center transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              size === 'default' ? "px-4 py-5" : "px-3 py-2.5",
              index === activeIndex 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => onTabChange(tab.id)}
          >
            <span className={cn(
              "flex items-center gap-2 whitespace-nowrap",
              size === 'default' 
                ? "text-lg font-semibold"
                : "text-sm font-medium"
            )}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    )
  }
)
AnimatedTabs.displayName = "AnimatedTabs"

export { AnimatedTabs }
```

## File: src/components/ui/dropdown-menu.tsx
```typescript
import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-lg py-2 pl-8 pr-3 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-lg py-2 pl-8 pr-3 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
```

## File: src/components/ui/popover.tsx
```typescript
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  useTriggerWidth?: boolean
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  ({ className, align = "center", sideOffset = 4, useTriggerWidth = false, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-xl border bg-popover p-4 text-popover-foreground shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        useTriggerWidth && "w-[var(--radix-popover-trigger-width)]",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
export type { PopoverContentProps }
```

## File: src/pages/Messaging/components/MessagingContent.tsx
```typescript
import React, { useState, useMemo } from 'react';
import { useMessagingStore } from '../store/messaging.store';
import { ContactInfoPanel } from './ContactInfoPanel';
import { AIInsightsPanel } from './AIInsightsPanel';
import { ActivityPanel } from './ActivityPanel';
import { NotesPanel } from './NotesPanel';
import { TaskHeader } from './TaskHeader';
import { AnimatedTabs } from '@/components/ui/animated-tabs';
import { TechOrbitDisplay } from '@/components/effects/OrbitingCircles';

interface MessagingContentProps {
  conversationId?: string;
}

export const MessagingContent: React.FC<MessagingContentProps> = ({ conversationId }) => {
  const [activeTab, setActiveTab] = useState('contact');
  const task = useMessagingStore(state => conversationId ? state.getTaskById(conversationId) : undefined);
  
  const tabs = useMemo(() => [
    { id: 'contact', label: 'Contact' },
    { id: 'ai', label: 'AI Insights' },
    { id: 'activity', label: 'Activity' },
    { id: 'notes', label: 'Notes' },
  ], []);

  if (!task) {
    return (
      <div className="h-full flex-1 flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
        <TechOrbitDisplay text="Context" />
        <div className="text-center z-10 bg-background/50 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="mt-4 text-lg font-medium">Select a Task</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Task details and contact information will appear here.
            </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex-1 flex flex-col bg-background overflow-y-auto" data-testid="messaging-content-scroll-pane">
      {/* Combined Header */}
      <div className="flex-shrink-0 border-b">
        <div className="p-6">
          <TaskHeader task={task} />
        </div>
        <AnimatedTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} size="sm" className="px-6" />
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6">
        {activeTab === 'contact' && <ContactInfoPanel contact={task.contact} />}
        {activeTab === 'ai' && <AIInsightsPanel task={task} />}
        {activeTab === 'activity' && <ActivityPanel contact={task.contact} />}
        {activeTab === 'notes' && <NotesPanel contact={task.contact} />}
      </div>
    </div>
  );
};
```

## File: src/pages/Messaging/data/mockData.ts
```typescript
import type { Contact, Task, Message, ActivityEvent, Note, Assignee, TaskStatus, TaskPriority } from '../types';

// --- ASSIGNEES ---
export const mockAssignees: Assignee[] = [
  { id: 'user-1', name: 'You', avatar: `https://avatar.vercel.sh/you.png` },
  { id: 'user-2', name: 'Alex Johnson', avatar: `https://avatar.vercel.sh/alex.png` },
  { id: 'user-3', name: 'Samira Kumar', avatar: `https://avatar.vercel.sh/samira.png` },
];

// --- HELPERS ---
const generateNotes = (contactName: string): Note[] => [
  { id: `note-${Math.random()}`, content: `Initial discovery call with ${contactName}. Seemed very interested in our enterprise package.`, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: `note-${Math.random()}`, content: `Followed up via email with pricing details.`, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
];

const generateActivity = (contactName: string): ActivityEvent[] => [
  { id: `act-${Math.random()}`, type: 'email', content: `Sent follow-up email regarding pricing.`, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: `act-${Math.random()}`, type: 'call', content: `Had a 30-minute discovery call with ${contactName}.`, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: `act-${Math.random()}`, type: 'meeting', content: `Scheduled a demo for next week.`, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
];

// --- CONTACTS ---
export const mockContacts: Contact[] = [
  { id: 'contact-1', name: 'Elena Rodriguez', avatar: `https://avatar.vercel.sh/elenarodriguez.png`, online: true, tags: ['VIP', 'New Lead'], email: 'elena.r@example.com', phone: '+1 234 567 8901', lastSeen: 'online', company: 'Innovate Inc.', role: 'CTO', activity: generateActivity('Elena Rodriguez'), notes: generateNotes('Elena Rodriguez'), },
  { id: 'contact-2', name: 'Marcus Chen', avatar: `https://avatar.vercel.sh/marcuschen.png`, online: false, tags: ['Returning Customer'], email: 'marcus.c@example.com', phone: '+1 345 678 9012', lastSeen: '2 hours ago', company: 'Solutions Co.', role: 'Product Manager', activity: generateActivity('Marcus Chen'), notes: generateNotes('Marcus Chen'), },
  { id: 'contact-3', name: 'Aisha Khan', avatar: `https://avatar.vercel.sh/aishakhan.png`, online: true, tags: ['Support Request'], email: 'aisha.k@example.com', phone: '+1 456 789 0123', lastSeen: 'online', company: 'Data Dynamics', role: 'Data Analyst', activity: generateActivity('Aisha Khan'), notes: generateNotes('Aisha Khan'), },
  { id: 'contact-4', name: 'Leo Tolstoy', avatar: `https://avatar.vercel.sh/leotolstoy.png`, online: false, tags: [], email: 'leo.tolstoy@example.com', phone: '+44 20 7946 0958', lastSeen: 'yesterday', company: 'Classic Reads', role: 'Author', activity: generateActivity('Leo Tolstoy'), notes: generateNotes('Leo Tolstoy'), }
];

// --- MESSAGE GENERATOR ---
const generateMessages = (count: number, contactName: string): Message[] => {
  const messages: Message[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const random = Math.random();
    let sender: Message['sender'] = 'contact';
    let type: Message['type'] = 'comment';
    let text = `This is a sample message number ${i} from ${contactName}.`;
    let userId: string | undefined = undefined;

    if (random > 0.85) { // Internal Note
      sender = 'user';
      type = 'note';
      const user = mockAssignees[Math.floor(Math.random() * mockAssignees.length)];
      userId = user.id;
      text = `Internal note from ${user.name}: we should check their account history.`;
    } else if (random > 0.7) { // System message
      sender = 'system';
      type = 'system';
      text = `Task status changed to "in-progress"`;
    } else if (random > 0.35) { // User comment
      sender = 'user';
      type = 'comment';
      userId = 'user-1'; // "You"
      text = `This is a reply from me. Time is roughly ${count - i} hours ago.`;
    }
    
    messages.push({
      id: `msg-${Math.random()}`,
      text,
      timestamp: new Date(now.getTime() - i * 60 * 60 * 1000).toISOString(),
      sender,
      type,
      read: i < count - 2,
      userId,
    });
  }
  // Ensure the last message is from the contact for preview purposes
  messages[messages.length - 1] = {
    ...messages[messages.length-1],
    sender: 'contact',
    type: 'comment',
    text: `Hey! This is the latest message from ${contactName}.`,
    userId: undefined
  };
  return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// --- TASKS ---
const statuses: TaskStatus[] = ['open', 'in-progress', 'done', 'snoozed'];
const priorities: TaskPriority[] = ['none', 'low', 'medium', 'high'];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Question about enterprise pricing',
    contactId: 'contact-1',
    channel: 'whatsapp',
    unreadCount: 2,
    messages: generateMessages(15, 'Elena Rodriguez'),
    get lastActivity() { return this.messages[this.messages.length - 1]; },
    status: 'in-progress',
    assigneeId: 'user-2',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    tags: ['onboarding', 'pricing'],
    aiSummary: { sentiment: 'positive', summaryPoints: ['Expressed strong interest in the new feature.', 'Asked about pricing tiers for enterprise.', 'Is ready for a follow-up call next week.',], suggestedReplies: ['Let\'s schedule that call!', 'Here is the pricing information.', 'Happy to hear you like it!',], },
  },
  {
    id: 'task-2',
    title: 'Minor issue with order #12345',
    contactId: 'contact-2',
    channel: 'instagram',
    unreadCount: 0,
    messages: generateMessages(8, 'Marcus Chen'),
    get lastActivity() { return this.messages[this.messages.length - 1]; },
    status: 'done',
    assigneeId: 'user-1',
    dueDate: null,
    priority: 'medium',
    tags: ['bug-report'],
    aiSummary: { sentiment: 'neutral', summaryPoints: ['Reported a minor issue with order #12345.', 'Was satisfied with the proposed solution.', 'Inquired about the return policy.',], suggestedReplies: ['Can I help with anything else?', 'Here is our return policy.',], },
  },
  {
    id: 'task-3',
    title: 'Login issues, cannot reset password',
    contactId: 'contact-3',
    channel: 'facebook',
    unreadCount: 5,
    messages: generateMessages(20, 'Aisha Khan'),
    get lastActivity() { return this.messages[this.messages.length - 1]; },
    status: 'open',
    assigneeId: null,
    dueDate: null,
    priority: 'high',
    tags: ['urgent', 'tech-support'],
    aiSummary: { sentiment: 'negative', summaryPoints: ['Frustrated with login issues.', 'Unable to reset password via email link.', 'Threatened to cancel their subscription.',], suggestedReplies: ['I\'m escalating this to our technical team.', 'Let\'s try a manual password reset.', 'We apologize for the inconvenience.',], },
  },
  {
    id: 'task-4',
    title: 'Follow-up on previous conversation',
    contactId: 'contact-4',
    channel: 'email',
    unreadCount: 0,
    messages: generateMessages(5, 'Leo Tolstoy'),
    get lastActivity() { return this.messages[this.messages.length - 1]; },
    status: 'snoozed',
    assigneeId: 'user-3',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'low',
    tags: [],
    aiSummary: { sentiment: 'neutral', summaryPoints: ['Followed up on a previous conversation.', 'Confirmed meeting time for Thursday.', 'No outstanding issues.',], suggestedReplies: ['Sounds good!', 'See you then!',], },
  },
];
```

## File: src/pages/Messaging/store/messaging.store.ts
```typescript
import { create } from 'zustand';
import { mockTasks, mockContacts, mockAssignees } from '../data/mockData';
import type { Task, Contact, Channel, Assignee, TaskStatus, TaskPriority } from '../types';

interface MessagingState {
  tasks: Task[];
  contacts: Contact[];
  assignees: Assignee[];
  searchTerm: string;
  activeFilters: {
    channels: Channel[];
    tags: string[];
    status: TaskStatus[];
    priority: TaskPriority[];
    assigneeId: string[];
  };
}

interface MessagingActions {
  getTaskById: (id: string) => (Task & { contact: Contact, assignee: Assignee | null }) | undefined;
  getFilteredTasks: () => (Task & { contact: Contact, assignee: Assignee | null })[];
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<MessagingState['activeFilters']>) => void;
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id'>>) => void;
  getAssigneeById: (assigneeId: string) => Assignee | undefined;
  getAvailableTags: () => string[];
}

export const useMessagingStore = create<MessagingState & MessagingActions>((set, get) => ({
  tasks: mockTasks,
  contacts: mockContacts,
  assignees: mockAssignees,
  searchTerm: '',
  activeFilters: {
    channels: [],
    tags: [],
    status: [],
    priority: [],
    assigneeId: [],
  },

  getTaskById: (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return undefined;

    const contact = get().contacts.find(c => c.id === task.contactId);
    if (!contact) return undefined;

    const assignee = get().assignees.find(a => a.id === task.assigneeId) || null;

    return { ...task, contact, assignee };
  },

  getFilteredTasks: () => {
    const { tasks, contacts, assignees, searchTerm, activeFilters } = get();
    const lowercasedSearch = searchTerm.toLowerCase();

    const mapped = tasks.map(task => {
      const contact = contacts.find(c => c.id === task.contactId) as Contact;
      const assignee = assignees.find(a => a.id === task.assigneeId) || null;
      return { ...task, contact, assignee };
    });

    const filtered = mapped.filter(task => {
      const searchMatch = task.title.toLowerCase().includes(lowercasedSearch) || task.contact.name.toLowerCase().includes(lowercasedSearch);
      const channelMatch = activeFilters.channels.length === 0 || activeFilters.channels.includes(task.channel);
      const tagMatch = activeFilters.tags.length === 0 || activeFilters.tags.some(tag => task.tags.includes(tag));
      const statusMatch = activeFilters.status.length === 0 || activeFilters.status.includes(task.status);
      const priorityMatch = activeFilters.priority.length === 0 || activeFilters.priority.includes(task.priority);
      const assigneeMatch = activeFilters.assigneeId.length === 0 || (task.assigneeId && activeFilters.assigneeId.includes(task.assigneeId));
      
      return searchMatch && channelMatch && tagMatch && statusMatch && priorityMatch && assigneeMatch;
    });

    return filtered.sort((a, b) => new Date(b.lastActivity.timestamp).getTime() - new Date(a.lastActivity.timestamp).getTime());
  },

  setSearchTerm: (term) => set({ searchTerm: term }),

  setFilters: (newFilters) => set(state => ({
    activeFilters: { ...state.activeFilters, ...newFilters }
  })),

  updateTask: (taskId, updates) => set(state => ({
    tasks: state.tasks.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, lastActivity: { ...task.lastActivity, timestamp: new Date().toISOString() } } 
        : task
    )
  })),

  getAssigneeById: (assigneeId: string) => {
    return get().assignees.find(a => a.id === assigneeId);
  },

  getAvailableTags: () => {
    const contactTags = get().contacts.flatMap(c => c.tags);
    const taskTags = get().tasks.flatMap(t => t.tags);
    const allTags = new Set([...contactTags, ...taskTags]);
    return Array.from(allTags);
  }
}));
```

## File: src/pages/Messaging/types.ts
```typescript
import type { LucideIcon } from "lucide-react";

export type Channel = 'whatsapp' | 'instagram' | 'facebook' | 'email';

export interface ChannelIcon {
  Icon: LucideIcon;
  color: string;
}

export interface Contact {
  id: string;
  name:string;
  avatar: string;
  online: boolean;
  tags: string[];
  email: string;
  phone: string;
  lastSeen: string;
  company: string;
  role: string;
  activity: ActivityEvent[];
  notes: Note[];
}

export interface Assignee {
  id: string;
  name: string;
  avatar: string;
}

export type ActivityEventType = 'note' | 'call' | 'email' | 'meeting';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  content: string;
  timestamp: string;
}
export interface Note {
  id: string;
  content: string;
  createdAt: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'contact' | 'system';
  type: 'comment' | 'note' | 'system';
  read: boolean;
  userId?: string; // for notes or system messages from users
}

export interface AISummary {
  sentiment: 'positive' | 'negative' | 'neutral';
  summaryPoints: string[];
  suggestedReplies: string[];
}

export type TaskStatus = 'open' | 'in-progress' | 'done' | 'snoozed';
export type TaskPriority = 'none' | 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  contactId: string;
  channel: Channel;
  unreadCount: number;
  lastActivity: Message;
  messages: Message[];
  status: TaskStatus;
  assigneeId: string | null;
  dueDate: string | null;
  priority: TaskPriority;
  tags: string[];
  aiSummary: AISummary;
}
```

## File: src/pages/DataDemo/components/DataToolbar.tsx
```typescript
import * as React from 'react'
import { Check, ListFilter, Search, SortAsc } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

import type { SortableField, Status, Priority } from '../types'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'

export interface FilterConfig {
  searchTerm: string
  status: Status[]
  priority: Priority[]
}

const statusOptions: { value: Status; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const sortOptions: { value: SortableField, label: string }[] = [
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'title', label: 'Title' },
  { value: 'status', label: 'Status' },
  { value: 'priority', label: 'Priority' },
  { value: 'metrics.completion', label: 'Progress' },
]


export function DataToolbar() {
  const {
    filters,
    setFilters,
    sortConfig,
    setSort,
  } = useAppViewManager();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchTerm: event.target.value })
  }
  
  const activeFilterCount = filters.status.length + filters.priority.length

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
      {/* Left side: Search, Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9 w-full sm:w-64"
            value={filters.searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 w-full sm:w-auto justify-start border-dashed">
              <ListFilter className="mr-2 h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <>
                  <div className="mx-2 h-4 w-px bg-muted-foreground/50" />
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {activeFilterCount}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[240px] p-0" align="start">
            <CombinedFilter filters={filters} onFiltersChange={setFilters} />
          </PopoverContent>
        </Popover>

        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={() => setFilters({ searchTerm: filters.searchTerm, status: [], priority: [] })}>Reset</Button>
        )}
      </div>

      {/* Right side: Sorter */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-start md:justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto justify-start">
              <SortAsc className="mr-2 h-4 w-4" />
              Sort by: {sortOptions.find(o => o.value === sortConfig?.key)?.label || 'Default'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={`${sortConfig?.key || 'default'}-${sortConfig?.direction || ''}`}
              onValueChange={(value) => {
                if (value.startsWith('default')) {
                  setSort(null)
                } else {
                  const [key, direction] = value.split('-')
                  setSort({ key: key as SortableField, direction: direction as 'asc' | 'desc' })
                }
              }}
            >
              <DropdownMenuRadioItem value="default-">Default</DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              {sortOptions.map(option => (
                <React.Fragment key={option.value}>
                  <DropdownMenuRadioItem value={`${option.value}-desc`}>{option.label} (Desc)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={`${option.value}-asc`}>{option.label} (Asc)</DropdownMenuRadioItem>
                </React.Fragment>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

function CombinedFilter({
  filters,
  onFiltersChange,
}: {
  filters: FilterConfig;
  onFiltersChange: (filters: FilterConfig) => void;
}) {
  const selectedStatus = new Set(filters.status);
  const selectedPriority = new Set(filters.priority);

  const handleStatusSelect = (status: Status) => {
    selectedStatus.has(status) ? selectedStatus.delete(status) : selectedStatus.add(status);
    onFiltersChange({ ...filters, status: Array.from(selectedStatus) });
  };

  const handlePrioritySelect = (priority: Priority) => {
    selectedPriority.has(priority) ? selectedPriority.delete(priority) : selectedPriority.add(priority);
    onFiltersChange({ ...filters, priority: Array.from(selectedPriority) });
  };

  const hasActiveFilters = filters.status.length > 0 || filters.priority.length > 0;

  return (
    <Command>
      <CommandInput placeholder="Filter by..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Status">
          {statusOptions.map((option) => {
            const isSelected = selectedStatus.has(option.value);
            return (
              <CommandItem
                key={option.value}
                onSelect={() => handleStatusSelect(option.value)}
              >
                <div
                  className={cn(
                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                    isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                  )}
                >
                  <Check className={cn('h-4 w-4')} />
                </div>
                <span>{option.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Priority">
          {priorityOptions.map((option) => {
            const isSelected = selectedPriority.has(option.value);
            return (
              <CommandItem
                key={option.value}
                onSelect={() => handlePrioritySelect(option.value)}
              >
                <div
                  className={cn(
                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                    isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                  )}
                >
                  <Check className={cn('h-4 w-4')} />
                </div>
                <span>{option.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        {hasActiveFilters && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => onFiltersChange({ ...filters, status: [], priority: [] })}
                className="justify-center text-center text-sm"
              >
                Clear filters
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  )
}
```

## File: src/hooks/useAppViewManager.hook.ts
```typescript
import { useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAppShellStore, type AppShellState, type ActivePage } from '@/store/appShell.store';
import type { DataItem, ViewMode, SortConfig, SortableField, GroupableField, Status, Priority } from '@/pages/DataDemo/types';
import type { FilterConfig } from '@/pages/DataDemo/components/DataToolbar';
import { BODY_STATES, SIDEBAR_STATES } from '@/lib/utils';

const pageToPaneMap: Record<string, AppShellState['sidePaneContent']> = {
  dashboard: 'main',
  settings: 'settings',
  toaster: 'toaster',
  notifications: 'notifications',
  'data-demo': 'dataDemo',
  messaging: 'messaging',
};

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

/**
 * A centralized hook to manage and synchronize all URL-based view states.
 * This is the single source of truth for view modes, side panes, split views,
 * and page-specific parameters.
 */
export function useAppViewManager() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ itemId: string; conversationId: string }>();
  const { itemId, conversationId } = params;
  const { setSidebarState, sidebarState } = useAppShellStore();

  // --- DERIVED STATE FROM URL ---

  const view = searchParams.get('view');
  const sidePane = searchParams.get('sidePane');
  const right = searchParams.get('right');

  const { bodyState, sidePaneContent } = useMemo(() => {
    const validPanes: AppShellState['sidePaneContent'][] = ['details', 'settings', 'main', 'toaster', 'notifications', 'dataDemo', 'messaging'];
    
    // 1. Priority: Explicit side pane overlay via URL param
    if (sidePane && validPanes.includes(sidePane as AppShellState['sidePaneContent'])) {
      return { bodyState: BODY_STATES.SIDE_PANE, sidePaneContent: sidePane as AppShellState['sidePaneContent'] };
    }

    // 2. Data item detail view (can be overlay or split)
    if (itemId) {
      if (view === 'split') {
        return { bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: 'dataItem' as const };
      }
      return { bodyState: BODY_STATES.SIDE_PANE, sidePaneContent: 'dataItem' as const };
    }

    // 3. Messaging conversation view (always split)
    if (conversationId) {
      return { bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: 'messaging' as const };
    }

    // 4. Generic split view via URL param
    if (view === 'split' && right && validPanes.includes(right as AppShellState['sidePaneContent'])) {
      return { bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: right as AppShellState['sidePaneContent'] };
    }

    return { bodyState: BODY_STATES.NORMAL, sidePaneContent: 'details' as const };
  }, [itemId, conversationId, view, sidePane, right]);
  
  const currentActivePage = useMemo(() => (location.pathname.split('/')[1] || 'dashboard') as ActivePage, [location.pathname]);
  const prevActivePage = usePrevious(currentActivePage);

  // --- SIDE EFFECTS ---
  useEffect(() => {
    // On navigating to messaging page, collapse sidebar if it's expanded.
    // This ensures a good default view but allows the user to expand it again if they wish.
    if (currentActivePage === 'messaging' && prevActivePage !== 'messaging' && sidebarState === SIDEBAR_STATES.EXPANDED) {
      setSidebarState(SIDEBAR_STATES.COLLAPSED);
    }
  }, [currentActivePage, prevActivePage, sidebarState, setSidebarState]);

  // DataDemo specific state
  const viewMode = useMemo(() => (searchParams.get('view') as ViewMode) || 'list', [searchParams]);
	const page = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams]);
	const groupBy = useMemo(() => (searchParams.get('groupBy') as GroupableField | 'none') || 'none', [searchParams]);
	const activeGroupTab = useMemo(() => searchParams.get('tab') || 'all', [searchParams]);
	const filters = useMemo<FilterConfig>(
		() => ({
			searchTerm: searchParams.get('q') || '',
			status: (searchParams.get('status')?.split(',') || []).filter(Boolean) as Status[],
			priority: (searchParams.get('priority')?.split(',') || []).filter(Boolean) as Priority[],
		}),
		[searchParams],
	);
	const sortConfig = useMemo<SortConfig | null>(() => {
		const sortParam = searchParams.get('sort');
		if (!sortParam) return { key: 'updatedAt', direction: 'desc' }; // Default sort
		if (sortParam === 'default') return null;

		const [key, direction] = sortParam.split('-');
		return { key: key as SortableField, direction: direction as 'asc' | 'desc' };
	}, [searchParams]);

  // --- MUTATOR ACTIONS ---

  const handleParamsChange = useCallback(
		(newParams: Record<string, string | string[] | null | undefined>, resetPage = false) => {
			setSearchParams(
				(prev) => {
					const updated = new URLSearchParams(prev);
					
					for (const [key, value] of Object.entries(newParams)) {
						if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || value === '') {
							updated.delete(key);
						} else if (Array.isArray(value)) {
							updated.set(key, value.join(','));
						} else {
							updated.set(key, String(value));
						}
					}

					if (resetPage) {
						updated.delete('page');
					}
					if ('groupBy' in newParams) {
						updated.delete('tab');
					}

					return updated;
				},
				{ replace: true },
			);
		},
		[setSearchParams],
	);

  const navigateTo = useCallback((page: string) => {
    navigate(page.startsWith('/') ? page : `/${page}`);
  }, [navigate]);

  const openSidePane = useCallback((pane: AppShellState['sidePaneContent']) => {
    if (location.pathname === `/${Object.keys(pageToPaneMap).find(key => pageToPaneMap[key] === pane)}`) {
        navigate({ pathname: '/dashboard', search: `?sidePane=${pane}` }, { replace: true });
    } else {
        handleParamsChange({ sidePane: pane, view: null, right: null });
    }
  }, [handleParamsChange, navigate, location.pathname]);

  const closeSidePane = useCallback(() => {
    if (itemId) {
      navigate('/data-demo');
    } else {
      handleParamsChange({ sidePane: null, view: null, right: null });
    }
  }, [itemId, navigate, handleParamsChange]);

  const toggleSidePane = useCallback((pane: AppShellState['sidePaneContent']) => {
    if (sidePane === pane) {
      closeSidePane();
    } else {
      openSidePane(pane);
    }
  }, [sidePane, openSidePane, closeSidePane]);

  const toggleSplitView = useCallback(() => {
    if (bodyState === BODY_STATES.SIDE_PANE) {
      handleParamsChange({ view: 'split', right: sidePane, sidePane: null });
    } else if (bodyState === BODY_STATES.SPLIT_VIEW) {
      handleParamsChange({ sidePane: right, view: null, right: null });
    } else { // From normal
      const paneContent = pageToPaneMap[currentActivePage] || 'details';
      handleParamsChange({ view: 'split', right: paneContent, sidePane: null });
    }
  }, [bodyState, sidePane, right, currentActivePage, handleParamsChange]);
  
  const setNormalView = useCallback(() => {
      handleParamsChange({ sidePane: null, view: null, right: null });
  }, [handleParamsChange]);

  const switchSplitPanes = useCallback(() => {
    if (bodyState !== BODY_STATES.SPLIT_VIEW) return;
    const newSidePaneContent = pageToPaneMap[currentActivePage];
    const newActivePage = Object.entries(pageToPaneMap).find(
      ([, value]) => value === sidePaneContent
    )?.[0] as ActivePage | undefined;

    if (newActivePage && newSidePaneContent) {
      navigate(`/${newActivePage}?view=split&right=${newSidePaneContent}`, { replace: true });
    }
  }, [bodyState, currentActivePage, sidePaneContent, navigate]);
  
  const closeSplitPane = useCallback((paneToClose: 'main' | 'right') => {
    if (bodyState !== BODY_STATES.SPLIT_VIEW) return;
    if (paneToClose === 'right') {
      navigate(`/${currentActivePage}`, { replace: true });
    } else { // Closing main pane
      const pageToBecomeActive = Object.entries(pageToPaneMap).find(
        ([, value]) => value === sidePaneContent
      )?.[0] as ActivePage | undefined;
      
      if (pageToBecomeActive) {
        navigate(`/${pageToBecomeActive}`, { replace: true });
      } else {
        navigate(`/dashboard`, { replace: true });
      }
    }
  }, [bodyState, currentActivePage, sidePaneContent, navigate]);
  
  // DataDemo actions
  const setViewMode = (mode: ViewMode) => handleParamsChange({ view: mode });
  const setGroupBy = (val: string) => handleParamsChange({ groupBy: val === 'none' ? null : val }, true);
  const setActiveGroupTab = (tab: string) => handleParamsChange({ tab: tab === 'all' ? null : tab });
  const setFilters = (newFilters: FilterConfig) => {
    handleParamsChange({ q: newFilters.searchTerm, status: newFilters.status, priority: newFilters.priority }, true);
  }
  const setSort = (config: SortConfig | null) => {
    if (!config) {
      handleParamsChange({ sort: 'default' }, true);
    } else {
      handleParamsChange({ sort: `${config.key}-${config.direction}` }, true);
    }
  }
  const setTableSort = (field: SortableField) => {
    let newSort: string | null = `${field}-desc`;
    if (sortConfig?.key === field) {
      if (sortConfig.direction === 'desc') newSort = `${field}-asc`;
      else if (sortConfig.direction === 'asc') newSort = 'default';
    }
    handleParamsChange({ sort: newSort }, true);
  };
  const setPage = (newPage: number) => handleParamsChange({ page: newPage.toString() });

  const onItemSelect = useCallback((item: DataItem) => {
		navigate(`/data-demo/${item.id}${location.search}`);
	}, [navigate, location.search]);


  return useMemo(() => ({
    // State
    bodyState,
    sidePaneContent,
    currentActivePage,
    itemId,
    // DataDemo State
    viewMode,
    page,
    groupBy,
    activeGroupTab,
    filters,
    sortConfig,
    // Actions
    navigateTo,
    openSidePane,
    closeSidePane,
    toggleSidePane,
    toggleSplitView,
    setNormalView,
    switchSplitPanes,
    closeSplitPane,
    // DataDemo Actions
    onItemSelect,
    setViewMode,
    setGroupBy,
    setActiveGroupTab,
    setFilters,
    setSort,
    setTableSort,
    setPage,
  }), [
    bodyState, sidePaneContent, currentActivePage, itemId,
    viewMode, page, groupBy, activeGroupTab, filters, sortConfig,
    navigateTo, openSidePane, closeSidePane, toggleSidePane, toggleSplitView, setNormalView, 
    switchSplitPanes, closeSplitPane, onItemSelect, setViewMode, setGroupBy, setActiveGroupTab, setFilters,
    setSort, setTableSort, setPage
  ]);
}
```

## File: src/pages/Messaging/index.tsx
```typescript
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { TaskList } from "./components/TaskList";
import { TaskDetail } from "./components/TaskDetail";
import { cn } from "@/lib/utils";

const useResizableMessagingPanes = (
  containerRef: React.RefObject<HTMLDivElement>,
  initialWidth: number = 320
) => {
  const [isResizing, setIsResizing] = useState(false);
  const [listWidth, setListWidth] = useState(initialWidth);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;
      // Constraints for the conversation list pane
      setListWidth(Math.max(280, Math.min(newWidth, containerRect.width - 500)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp, { once: true });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (document.body) {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
  }, [isResizing, containerRef]);

  return { listWidth, handleMouseDown, isResizing };
};

export default function MessagingPage() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const containerRef = useRef<HTMLDivElement>(null);

  const { listWidth, handleMouseDown, isResizing } = useResizableMessagingPanes(containerRef);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "h-full w-full flex bg-background",
        isResizing && "cursor-col-resize select-none"
      )}
    >
      <div style={{ width: `${listWidth}px` }} className="flex-shrink-0 h-full">
        <TaskList />
      </div>
      <div onMouseDown={handleMouseDown} className="w-2 flex-shrink-0 cursor-col-resize group flex items-center justify-center">
        <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200" />
      </div>
      <div className="flex-1 min-w-0 h-full">
        <TaskDetail />
      </div>
    </div>
  );
}
```

## File: src/App.tsx
```typescript
import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useNavigate, // used in LoginPageWrapper
  useLocation,
} from "react-router-dom";

import { AppShell } from "./components/layout/AppShell";
import { AppShellProvider } from "./providers/AppShellProvider";
import { useAppShellStore } from "./store/appShell.store";
import { useAuthStore } from "./store/authStore";
import "./index.css";

// Import library components
import { EnhancedSidebar } from "./components/layout/EnhancedSidebar";
import { MainContent } from "./components/layout/MainContent";
import { RightPane } from "./components/layout/RightPane";
import { TopBar } from "./components/layout/TopBar";
import { CommandPalette } from "./components/global/CommandPalette";
import { ToasterProvider } from "./components/ui/toast";

// --- Page/Content Components for Pages and Panes ---
import { DashboardContent } from "./pages/Dashboard";
import { SettingsPage } from "./pages/Settings";
import { ToasterDemo } from "./pages/ToasterDemo";
import { NotificationsPage } from "./pages/Notifications";
import DataDemoPage from "./pages/DataDemo";
import MessagingPage from "./pages/Messaging";
import { LoginPage } from "./components/auth/LoginPage";

// --- Icons ---
import {
  Search,
  Filter,
  Plus,
  ChevronRight,
  Rocket,
} from "lucide-react";

// --- Utils & Hooks ---
import { cn } from "./lib/utils";
import { useAppViewManager } from "./hooks/useAppViewManager.hook";
import { useRightPaneContent } from "./hooks/useRightPaneContent.hook";
import { BODY_STATES } from "./lib/utils";

// Checks for authentication and redirects to login if needed
function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

// A root component to apply global styles and effects
function Root() {
  const isDarkMode = useAppShellStore((state) => state.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return <Outlet />;
}

// The main layout for authenticated parts of the application
function ProtectedLayout() {

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <AppShellProvider
        appName="Jeli App"
        appLogo={
          <div className="p-2 bg-primary/20 rounded-lg">
            <Rocket className="w-5 h-5 text-primary" />
          </div>
        }
      >
        <ComposedApp />
      </AppShellProvider>
    </div>
  );
}

// Content for the Top Bar (will be fully refactored in Part 2)
function AppTopBar() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const location = useLocation();
  const activePage = location.pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'dashboard';

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "hidden md:flex items-center gap-2 text-sm transition-opacity",
          {
            "opacity-0 pointer-events-none":
              isSearchFocused && activePage === "dashboard",
          },
        )}
      >
        <a
          href="#"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Home
        </a>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-foreground capitalize">
          {activePage}
        </span>
      </div>

      {/* Page-specific: Dashboard search and actions */}
      {activePage === "dashboard" && (
        <div className="flex items-center gap-2 flex-1 justify-end">
          <div
            className={cn(
              "relative transition-all duration-300 ease-in-out",
              isSearchFocused ? "flex-1 max-w-lg" : "w-auto",
            )}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={cn(
                "pl-9 pr-4 py-2 h-10 border-none rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ease-in-out w-full",
                isSearchFocused ? "bg-background" : "w-48",
              )}
            />
          </div>
          <button className="h-10 w-10 flex-shrink-0 flex items-center justify-center hover:bg-accent rounded-full transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 h-10 flex-shrink-0">
            <Plus className="w-5 h-5" />
            <span
              className={cn(isSearchFocused ? "hidden sm:inline" : "inline")}
            >
              New Project
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

// The main App component that composes the shell
function ComposedApp() {
  const { setBodyState, setSidePaneContent } = useAppShellStore();
  const viewManager = useAppViewManager();

  // Sync URL state with AppShellStore
  useEffect(() => {
    setBodyState(viewManager.bodyState);
    setSidePaneContent(viewManager.sidePaneContent);
  }, [viewManager.bodyState, viewManager.sidePaneContent, setBodyState, setSidePaneContent]);

  return (
    <AppShell
      sidebar={<EnhancedSidebar />}
      onOverlayClick={viewManager.closeSidePane}
      topBar={
        <TopBar>
          <AppTopBar />
        </TopBar>
      }
      mainContent={
        <MainContent>
          <Outlet />
        </MainContent>
      }
      rightPane={<RightPane />}
      commandPalette={<CommandPalette />}
    />
  );
}

function App() {
  const router = createBrowserRouter([
    {
      element: <Root />,
      children: [
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/",
          element: <ProtectedRoute />,
          children: [
            {
              path: "/",
              element: <ProtectedLayout />,
              children: [
                { index: true, element: <Navigate to="/dashboard" replace /> },
                { path: "dashboard", element: <DashboardContent /> },
                { path: "settings", element: <SettingsPage /> },
                { path: "toaster", element: <ToasterDemo /> },
                { path: "notifications", element: <NotificationsPage /> },
                { path: "data-demo", element: <DataDemoPage /> },
                { path: "data-demo/:itemId", element: <DataDemoPage /> },
                { path: "messaging", element: <MessagingPage /> },
                { path: "messaging/:conversationId", element: <MessagingPage /> },
              ],
            },
          ],
        },
      ],
    },
  ]);

  return (
    <ToasterProvider>
      <RouterProvider router={router} />
    </ToasterProvider>
  );
}

export default App;
```
