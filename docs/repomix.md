# Directory Structure
```
src/
  components/
    ui/
      animated-tabs.tsx
  hooks/
    useAppViewManager.hook.ts
  pages/
    Messaging/
      components/
        MessagingContent.tsx
        TaskDetail.tsx
        TaskList.tsx
      data/
        mockData.ts
      store/
        messaging.store.ts
      index.tsx
      types.ts
```

# Files

## File: src/components/ui/animated-tabs.tsx
```typescript
"use client"

import React, { useState, useRef, useEffect, useLayoutEffect, useId } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"

interface Tab {
  id: string
  label: React.ReactNode
}

interface AnimatedTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void,
  size?: 'default' | 'sm',
  children?: React.ReactNode,
  wrapperClassName?: string,
  contentClassName?: string
}

const AnimatedTabs = React.forwardRef<HTMLDivElement, AnimatedTabsProps>(
  ({ className, tabs, activeTab, onTabChange, size = 'default', children, wrapperClassName, contentClassName, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const contentTrackRef = useRef<HTMLDivElement>(null)
    const uniqueId = useId()
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
    useLayoutEffect(() => {
      const activeElement = tabRefs.current[activeIndex];
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
        activeElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }, [activeIndex, tabs]);

    // Animate content track position
    useLayoutEffect(() => {
      if (contentTrackRef.current) {
        gsap.to(contentTrackRef.current, {
          xPercent: -100 * activeIndex,
          duration: 0.4,
          ease: "power3.inOut",
        })
      }
    }, [activeIndex]);

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

    const tabHeadersRootProps = {
      className: cn("overflow-x-auto overflow-y-hidden no-scrollbar", className),
      role: "tablist",
      ...props
    };

    const TabHeadersContent = (
      <div className="relative flex w-max items-center whitespace-nowrap">
        {/* Active Indicator */}
        <div
          className="absolute -bottom-px h-0.5 bg-primary transition-all duration-300 ease-out"
          style={activeStyle}
        />

        {/* Tabs */}
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`tab-${uniqueId}-${tab.id}`}
            ref={(el) => (tabRefs.current[index] = el)}
            role="tab"
            aria-selected={index === activeIndex}
            aria-controls={`tabpanel-${uniqueId}-${tab.id}`}
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
              "flex items-center gap-2",
              size === 'default' 
                ? "text-lg font-semibold"
                : "text-sm font-medium"
            )}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    );

    if (!children) {
      return (
        <div ref={ref} {...tabHeadersRootProps}>
          {TabHeadersContent}
        </div>
      );
    }

    return (
      <div ref={ref} className={wrapperClassName}>
        <div {...tabHeadersRootProps}>{TabHeadersContent}</div>
        <div className={cn("relative overflow-hidden", contentClassName)}>
          <div ref={contentTrackRef} className="flex h-full w-full">
            {React.Children.map(children, (child, index) => (
              <div
                key={tabs[index].id}
                id={`tabpanel-${uniqueId}-${tabs[index].id}`}
                role="tabpanel"
                aria-labelledby={`tab-${uniqueId}-${tabs[index].id}`}
                aria-hidden={activeIndex !== index}
                className="h-full w-full flex-shrink-0"
              >
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
)
AnimatedTabs.displayName = "AnimatedTabs"

export { AnimatedTabs }
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
    <div className="h-full flex-1 flex flex-col bg-background overflow-hidden" data-testid="messaging-content-scroll-pane">
      <div className="flex-shrink-0 border-b p-6">
        <TaskHeader task={task} />
      </div>
      <AnimatedTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        size="sm" 
        className="px-6 border-b flex-shrink-0"
        wrapperClassName="flex-1 flex flex-col min-h-0"
        contentClassName="flex-1 min-h-0"
      >
        <div className="p-6 h-full overflow-y-auto"><ContactInfoPanel contact={task.contact} /></div>
        <div className="p-6 h-full overflow-y-auto"><AIInsightsPanel task={task} /></div>
        <div className="p-6 h-full overflow-y-auto"><ActivityPanel contact={task.contact} /></div>
        <div className="p-6 h-full overflow-y-auto"><NotesPanel contact={task.contact} /></div>
      </AnimatedTabs>
    </div>
  );
};
```

## File: src/pages/Messaging/components/TaskList.tsx
```typescript
import { useEffect } from 'react';
import { Search, SlidersHorizontal, Check, Inbox, Clock, Zap, Shield, Eye } from 'lucide-react';
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
import type { TaskStatus, TaskPriority, TaskView } from '../types';
import { useAppViewManager } from '@/hooks/useAppViewManager.hook';

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
    setSearchTerm,
    activeFilters,
    setActiveTaskView,
    searchTerm,
   } = useMessagingStore();
   const { messagingView, setMessagingView } = useAppViewManager();

  useEffect(() => {
    setActiveTaskView(messagingView || 'all_open');
  }, [messagingView, setActiveTaskView]);

  const filteredTasks = getFilteredTasks();
  const activeFilterCount = Object.values(activeFilters).reduce((count, filterArray) => count + filterArray.length, 0);

  const TABS: { id: TaskView, label: string }[] = [
    { id: 'all_open', label: 'Open' },
    { id: 'unassigned', label: 'Unassigned' },
    { id: 'done', label: 'Done' }
  ];

  return (
    <div className="h-full flex flex-col bg-background/80">
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
      <AnimatedTabs
        tabs={TABS}
        activeTab={messagingView || 'all_open'}
        onTabChange={(tabId) => setMessagingView(tabId as TaskView)}
      />

      {/* Task List */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-1">
          {filteredTasks.map(task => {
            const currentUserId = 'user-1';
            const isHandledByOther = task.activeHandlerId && task.activeHandlerId !== currentUserId;

            return (
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
                          <p className="text-sm font-semibold truncate pr-2">
                            {task.contact.name} <span className="text-muted-foreground font-normal">&middot; {task.contact.company}</span>
                          </p>
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
                          {isHandledByOther && <Eye className="w-3.5 h-3.5" title="Being handled by another user" />}
                      </div>
                  </div>
                  {task.unreadCount > 0 && (
                      <div className="flex items-center justify-center self-center ml-auto">
                          <Badge className="bg-primary h-5 w-5 p-0 flex items-center justify-center">{task.unreadCount}</Badge>
                      </div>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  );
};

// Filter component for popover
function FilterCommand() {
    const { activeFilters, setFilters, assignees, getAvailableTags } = useMessagingStore();
    const availableTags = getAvailableTags();

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

## File: src/pages/Messaging/components/TaskDetail.tsx
```typescript
import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMessagingStore } from '../store/messaging.store';
import { ActivityFeed } from './ActivityFeed';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, SendHorizontal, Smile, StickyNote } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TakeoverBanner } from './TakeoverBanner';
import { useToast } from '@/components/ui/toast';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { useAppShellStore } from '@/store/appShell.store';
import { JourneyScrollbar } from './JourneyScrollbar';


export const TaskDetail: React.FC = () => {
  const { conversationId: taskId } = useParams<{ conversationId: string }>();
  const { show } = useToast();
  const { getTaskById, takeOverTask, requestAndSimulateTakeover } = useMessagingStore();
  const reducedMotion = useAppShellStore(s => s.reducedMotion);
  
  const task = taskId ? getTaskById(taskId) : undefined;

  // In a real app, this would come from the auth store
  const currentUserId = 'user-1'; 

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isLocked = !!task?.activeHandlerId && task.activeHandlerId !== currentUserId;
  const inputAreaRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const [isJourneyHovered, setIsJourneyHovered] = useState(false);

  useLayoutEffect(() => {
    // On conversation change, scroll to the bottom of the message list.
    // This ensures the user sees the latest message and that the scrollbar
    // component has the correct scrollHeight to calculate its visibility.
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [taskId]);

  useEffect(() => {
    if (!inputAreaRef.current) return;

    const initialBorderWidth = '1px'; // from 'border-t'
    const initialPadding = '1rem';    // from 'p-4'

    const target = isLocked
      ? {
          y: 20,
          opacity: 0,
          maxHeight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          borderTopWidth: 0,
          pointerEvents: 'none' as const,
        }
      : {
          y: 0,
          opacity: 1,
          maxHeight: 500, // Ample room for the input
          paddingTop: initialPadding,
          paddingBottom: initialPadding,
          borderTopWidth: initialBorderWidth,
          pointerEvents: 'auto' as const,
        };

    if (reducedMotion) {
      gsap.set(inputAreaRef.current, target);
      return;
    }
    
    if (isFirstRender.current) {
      gsap.set(inputAreaRef.current, target);
      isFirstRender.current = false;
    } else {
      gsap.to(inputAreaRef.current, {
        ...target,
        duration: 0.35,
        ease: 'power2.inOut',
      });
    }
  }, [isLocked, reducedMotion]);

  if (!taskId || !task) {
    return (
        <div className="h-full flex flex-col items-center justify-center p-6 bg-background">
            <p className="text-muted-foreground">Select a task to see its details.</p>
        </div>
    );
  }

  const journeyPoints = task.messages.filter(m => m.journeyPoint);

  const handleDotClick = (messageId: string) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const element = container.querySelector(`[data-message-id="${messageId}"]`);
    
    if (element) {
      // Using 'center' to avoid the message being at the very top/bottom of the view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleTakeOver = () => {
    takeOverTask(task.id, currentUserId);
    show({
        variant: 'success',
        title: 'Task Taken Over',
        message: `You are now handling the task from ${task.contact.name}.`
    });
  };

  const handleRequestTakeover = () => {
    requestAndSimulateTakeover(task.id, currentUserId);
    if (task.activeHandler) {
        show({
            variant: 'default',
            title: 'Request Sent',
            message: `A takeover request has been sent to ${task.activeHandler.name}.`
        });
    }
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {isLocked && task.activeHandler && (
        <TakeoverBanner
            activeHandler={task.activeHandler}
            isRequesting={!!task.takeoverRequested}
            onTakeOver={handleTakeOver}
            onRequestTakeover={handleRequestTakeover}
        />
      )}
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={scrollContainerRef}
          className={cn(
            "h-full overflow-y-auto pr-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
            "transition-all duration-200",
            isJourneyHovered && "blur-sm pointer-events-none"
          )}
        >
          <ActivityFeed messages={task.messages} contact={task.contact} />
        </div>
        {journeyPoints.length > 0 && (
            <JourneyScrollbar
                scrollContainerRef={scrollContainerRef}
                journeyPoints={journeyPoints}
                onDotClick={handleDotClick}
                onHoverChange={setIsJourneyHovered}
                showAllTooltips={isJourneyHovered}
            />
        )}
      </div>

      {/* Input Form */}
      <div ref={inputAreaRef} className="p-4 border-t flex-shrink-0 bg-background/50">
        <Tabs defaultValue="comment" className="w-full" >
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="comment" disabled={isLocked}>Comment</TabsTrigger>
            <TabsTrigger value="note" disabled={isLocked}><StickyNote className="w-4 h-4 mr-2" />Internal Note</TabsTrigger>
          </TabsList>
          <TabsContent value="comment">
             <div className="relative">
                <Textarea placeholder={isLocked ? "Take over to reply..." : `Reply to ${task.contact.name}...`} className="pr-24 min-h-[52px]" disabled={isLocked} />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" disabled={isLocked}><Smile className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" disabled={isLocked}><Paperclip className="w-4 h-4" /></Button>
                    <Button size="icon" className="rounded-full h-8 w-8" disabled={isLocked}><SendHorizontal className="w-4 h-4" /></Button>
                </div>
            </div>
          </TabsContent>
          <TabsContent value="note">
            <div className="relative">
                <Textarea placeholder={isLocked ? "Take over to add a note..." : "Add an internal note..."} className="pr-24 min-h-[52px] bg-yellow-400/10 border-yellow-400/30 focus-visible:ring-yellow-500" disabled={isLocked} />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                    <Button size="icon" className="rounded-full h-8 w-8" disabled={isLocked}><SendHorizontal className="w-4 h-4" /></Button>
                </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
```

## File: src/pages/Messaging/data/mockData.ts
```typescript
import type { Contact, Task, Message, ActivityEvent, Note, Assignee, TaskStatus, TaskPriority, Channel, JourneyPointType } from '../types';
import { faker } from '@faker-js/faker';

// --- ASSIGNEES ---
export const mockAssignees: Assignee[] = [
  { id: 'user-1', name: 'You', avatar: `https://avatar.vercel.sh/you.png`, type: 'human' },
  { id: 'user-2', name: 'Alex Johnson', avatar: `https://avatar.vercel.sh/alex.png`, type: 'human' },
  { id: 'user-3', name: 'Samira Kumar', avatar: `https://avatar.vercel.sh/samira.png`, type: 'human' },
  { id: 'user-4', name: 'Casey Lee', avatar: `https://avatar.vercel.sh/casey.png`, type: 'human' },
  { id: 'user-5', name: 'Jordan Rivera', avatar: `https://avatar.vercel.sh/jordan.png`, type: 'human' },
  { id: 'user-ai-1', name: 'AI Assistant', avatar: `https://avatar.vercel.sh/ai.png`, type: 'ai' },
];

// --- HELPERS ---
const generateNotes = (contactName: string): Note[] => [
  { id: `note-${faker.string.uuid()}`, content: `Initial discovery call with ${contactName}. Seemed very interested in our enterprise package.`, createdAt: faker.date.past().toISOString() },
  { id: `note-${faker.string.uuid()}`, content: `Followed up via email with pricing details.`, createdAt: faker.date.recent().toISOString() },
];

const generateActivity = (contactName: string): ActivityEvent[] => [
  { id: `act-${faker.string.uuid()}`, type: 'email', content: `Sent follow-up email regarding pricing.`, timestamp: faker.date.past().toISOString() },
  { id: `act-${faker.string.uuid()}`, type: 'call', content: `Had a 30-minute discovery call with ${contactName}.`, timestamp: faker.date.recent().toISOString() },
  { id: `act-${faker.string.uuid()}`, type: 'meeting', content: `Scheduled a demo for next week.`, timestamp: faker.date.soon().toISOString() },
];

// --- COMPANIES ---
const mockCompanies = Array.from({ length: 25 }, () => faker.company.name());

// --- CONTACTS ---
export const mockContacts: Contact[] = Array.from({ length: 80 }, (_, i) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const company = faker.helpers.arrayElement(mockCompanies);
    return {
        id: `contact-${i + 1}`,
        name,
        avatar: `https://avatar.vercel.sh/${firstName.toLowerCase()}${lastName.toLowerCase()}.png`,
        online: faker.datatype.boolean(),
        tags: faker.helpers.arrayElements(['VIP', 'New Lead', 'Returning Customer', 'Support Request', 'High Value'], { min: 1, max: 3 }),
        email: faker.internet.email({ firstName, lastName }),
        phone: faker.phone.number(),
        lastSeen: faker.datatype.boolean() ? 'online' : `${faker.number.int({ min: 2, max: 59 })} minutes ago`,
        company,
        role: faker.person.jobTitle(),
        activity: generateActivity(name),
        notes: generateNotes(name),
    };
});

// --- MESSAGE GENERATOR ---
const generateMessages = (messageCount: number, contactName: string, journeyPath: JourneyPointType[]): Message[] => {
  const messages: Message[] = [];
  const now = new Date();
  
  const journeyPointsWithIndices = journeyPath.map((point, index) => ({
      point,
      index: Math.floor((messageCount / journeyPath.length) * (index + Math.random() * 0.8))
  }));

  for (let i = 0; i < messageCount; i++) {
    const random = Math.random();
    let sender: Message['sender'] = 'contact';
    let type: Message['type'] = 'comment';
    let text = faker.lorem.sentence();
    let userId: string | undefined = undefined;

    if (random > 0.85) { // Internal Note
      sender = 'user';
      type = 'note';
      const user = faker.helpers.arrayElement(mockAssignees.filter(u => u.type === 'human'));
      userId = user.id;
      text = `Internal note from ${user.name}: ${faker.lorem.sentence()}`;
    } else if (random > 0.7) { // System message
      sender = 'system';
      type = 'system';
      text = faker.helpers.arrayElement(['Task status changed to "in-progress"', 'Task assigned to Alex Johnson', 'User joined the conversation']);
    } else if (random > 0.35) { // User comment
      sender = 'user';
      type = 'comment';
      userId = 'user-1'; // "You"
      text = faker.lorem.sentence();
    }
    
    const journeyPointInfo = journeyPointsWithIndices.find(jp => jp.index === i);

    messages.push({
      id: `msg-${faker.string.uuid()}`,
      text,
      timestamp: new Date(now.getTime() - (messageCount - i) * 60 * 60 * 100).toISOString(),
      sender,
      type,
      read: i < messageCount - faker.number.int({min: 0, max: 5}),
      userId,
      journeyPoint: journeyPointInfo?.point
    });
  }
  
  // Ensure the last message is from the contact for preview purposes
  messages[messages.length - 1] = {
    ...messages[messages.length-1],
    sender: 'contact',
    type: 'comment',
    text: `Hey! This is the latest message from ${contactName}. ${faker.lorem.sentence()}`,
    userId: undefined
  };
  return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// --- TASK GENERATOR ---
const generateTasks = (count: number): Task[] => {
    const tasks: Task[] = [];
    const statuses: TaskStatus[] = ['open', 'in-progress', 'done', 'snoozed'];
    const priorities: TaskPriority[] = ['none', 'low', 'medium', 'high'];
    const channels: Channel[] = ['whatsapp', 'instagram', 'facebook', 'email'];
    const possibleJourneys: JourneyPointType[][] = [
        ['Inquiry', 'Consult', 'Quote', 'Order', 'Payment', 'Shipped', 'Delivered', 'Review'],
        ['Inquiry', 'Consult', 'Quote', 'Order', 'Payment', 'Shipped', 'Delivered', 'Follow-up'],
        ['Inquiry', 'Consult', 'Follow-up'],
        ['Inquiry', 'Consult', 'Quote', 'Order', 'Canceled'],
        ['Consult', 'Order', 'Payment', 'Shipped', 'Delivered', 'Complain', 'Refund'],
        ['Consult', 'Order', 'Payment', 'Shipped', 'Complain', 'Follow-up'],
        ['Order', 'Delivered', 'Review', 'Reorder', 'Delivered'],
        ['Complain', 'Follow-up', 'Refund'],
        ['Quote', 'Follow-up', 'Order', 'Payment', 'Shipped', 'Delivered'],
        ['Inquiry', 'Quote', 'Order', 'Payment', 'Shipped', 'Canceled', 'Refund'],
        ['Consult', 'Follow-up'],
        ['Complain'],
        ['Order', 'Delivered'],
    ];

    for (let i = 0; i < count; i++) {
        const contact = faker.helpers.arrayElement(mockContacts);
        const status = faker.helpers.arrayElement(statuses);
        const unreadCount = status === 'open' || status === 'in-progress' ? faker.number.int({ min: 0, max: 8 }) : 0;
        const messageCount = faker.number.int({ min: 10, max: 150 });
        const journey = faker.helpers.arrayElement(possibleJourneys);
        const messages = generateMessages(messageCount, contact.name, journey);
        const assignee = faker.datatype.boolean(0.8) ? faker.helpers.arrayElement(mockAssignees) : null;

        const task: Task = {
            id: `task-${i + 1}`,
            title: faker.lorem.sentence({ min: 3, max: 7 }),
            contactId: contact.id,
            channel: faker.helpers.arrayElement(channels),
            unreadCount,
            messages,
            get lastActivity() { return this.messages[this.messages.length - 1]; },
            status,
            assigneeId: assignee?.id || null,
            dueDate: faker.datatype.boolean() ? faker.date.future().toISOString() : null,
            priority: faker.helpers.arrayElement(priorities),
            tags: faker.helpers.arrayElements(['onboarding', 'pricing', 'bug-report', 'urgent', 'tech-support'], faker.number.int({min: 0, max: 2})),
            aiSummary: {
                sentiment: faker.helpers.arrayElement(['positive', 'negative', 'neutral']),
                summaryPoints: Array.from({ length: 3 }, () => faker.lorem.sentence()),
                suggestedReplies: Array.from({ length: 2 }, () => faker.lorem.words({ min: 3, max: 6})),
            },
            activeHandlerId: faker.helpers.arrayElement([assignee?.id, null, 'user-ai-1']),
        };
        tasks.push(task);
    }
    return tasks;
}

export const mockTasks: Task[] = generateTasks(200);
```

## File: src/pages/Messaging/store/messaging.store.ts
```typescript
import { create } from 'zustand';
import { mockTasks, mockContacts, mockAssignees } from '../data/mockData';
import type { Task, Contact, Channel, Assignee, TaskStatus, TaskPriority, TaskView, Message, JourneyPointType } from '../types';

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
  activeTaskView: TaskView;
}

interface MessagingActions {
  getTaskById: (id: string) => (Task & { contact: Contact, assignee: Assignee | null, activeHandler: Assignee | null }) | undefined;
  getFilteredTasks: () => (Task & { contact: Contact, assignee: Assignee | null })[];
  setSearchTerm: (term: string) => void;
  setActiveTaskView: (view: TaskView) => void;
  setFilters: (filters: Partial<MessagingState['activeFilters']>) => void;
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id'>>) => void;
  takeOverTask: (taskId: string, userId: string) => void;
  requestAndSimulateTakeover: (taskId: string, requestedByUserId: string) => void;
  getAssigneeById: (assigneeId: string) => Assignee | undefined;
  getContactsByCompany: (companyName: string, currentContactId: string) => Contact[];
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
  activeTaskView: 'all_open',

  getTaskById: (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return undefined;

    const contact = get().contacts.find(c => c.id === task.contactId);
    if (!contact) return undefined;

    const assignee = get().assignees.find(a => a.id === task.assigneeId) || null;
    const activeHandler = get().assignees.find(a => a.id === task.activeHandlerId) || null;

    return { ...task, contact, assignee, activeHandler };
  },

  getFilteredTasks: () => {
    const { tasks, contacts, assignees, searchTerm, activeFilters, activeTaskView } = get();
    const lowercasedSearch = searchTerm.toLowerCase();

    const viewFilteredTasks = tasks.filter(task => {
      switch (activeTaskView) {
        case 'all_open':
          return task.status === 'open' || task.status === 'in-progress';
        case 'unassigned':
          return !task.assigneeId && (task.status === 'open' || task.status === 'in-progress');
        case 'done':
          return task.status === 'done';
        default:
          return true;
      }
    });
    const mapped = viewFilteredTasks.map(task => {
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
  
  setActiveTaskView: (view) => set({ activeTaskView: view }),

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

  takeOverTask: (taskId, userId) => set(state => ({
    tasks: state.tasks.map(task => 
      task.id === taskId 
        ? { ...task, activeHandlerId: userId, takeoverRequested: false } 
        : task
    )
  })),

  requestAndSimulateTakeover: (taskId, requestedByUserId) => {
    set(state => ({
      tasks: state.tasks.map(task => 
        task.id === taskId ? { ...task, takeoverRequested: true } : task
      )
    }));
    // Simulate a 2-second delay for the other user to "approve"
    setTimeout(() => get().takeOverTask(taskId, requestedByUserId), 2000);
  },

  getAssigneeById: (assigneeId: string) => {
    return get().assignees.find(a => a.id === assigneeId);
  },

  getContactsByCompany: (companyName, currentContactId) => {
    return get().contacts.filter(
      c => c.company === companyName && c.id !== currentContactId
    );
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
  type: 'human' | 'ai';
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

export type JourneyPointType = 'Inquiry' | 'Consult' | 'Quote' | 'Order' | 'Payment' | 'Shipped' | 'Delivered' | 'Canceled' | 'Refund' | 'Complain' | 'Reorder' | 'Follow-up' | 'Review';

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'contact' | 'system';
  type: 'comment' | 'note' | 'system';
  read: boolean;
  userId?: string; // for notes or system messages from users
  journeyPoint?: JourneyPointType;
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
  activeHandlerId: string | null;
  takeoverRequested?: boolean;
}

export type TaskView = 'all_open' | 'unassigned' | 'done';
```

## File: src/hooks/useAppViewManager.hook.ts
```typescript
import { useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAppShellStore, type AppShellState, type ActivePage } from '@/store/appShell.store';
import type { DataItem, ViewMode, SortConfig, SortableField, GroupableField, Status, Priority } from '@/pages/DataDemo/types';
import type { FilterConfig } from '@/pages/DataDemo/components/DataToolbar';
import type { TaskView } from '@/pages/Messaging/types';
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
  const messagingView = searchParams.get('messagingView') as TaskView | null;
  const q = searchParams.get('q');
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const sort = searchParams.get('sort');

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
  const viewMode = useMemo(() => (searchParams.get('dataView') as ViewMode) || 'list', [searchParams]);
	const page = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams]);
	const groupBy = useMemo(() => (searchParams.get('groupBy') as GroupableField | 'none') || 'none', [searchParams]);
	const activeGroupTab = useMemo(() => searchParams.get('tab') || 'all', [searchParams]);
	const filters = useMemo<FilterConfig>(
		() => ({
			searchTerm: q || '',
			status: (status?.split(',') || []).filter(Boolean) as Status[],
			priority: (priority?.split(',') || []).filter(Boolean) as Priority[],
		}),
		[q, status, priority],
	);
	const sortConfig = useMemo<SortConfig | null>(() => {
		const sortParam = sort;
		if (!sortParam) return { key: 'updatedAt', direction: 'desc' }; // Default sort
		if (sortParam === 'default') return null;

		const [key, direction] = sortParam.split('-');
		return { key: key as SortableField, direction: direction as 'asc' | 'desc' };
	}, [sort]);

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

  const navigateTo = useCallback((page: string, params?: Record<string, string | null>) => {
    const targetPath = page.startsWith('/') ? page : `/${page}`;
    const isSamePage = location.pathname === targetPath;
    
    const newSearchParams = new URLSearchParams(isSamePage ? searchParams : undefined);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === undefined) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      }
    }

    navigate({ pathname: targetPath, search: newSearchParams.toString() });
  }, [navigate, location.pathname, searchParams]);

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
  const setViewMode = (mode: ViewMode) => handleParamsChange({ dataView: mode === 'list' ? null : mode });
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

  const setMessagingView = (view: TaskView) => handleParamsChange({ messagingView: view });


  return useMemo(() => ({
    // State
    bodyState,
    sidePaneContent,
    currentActivePage,
    itemId,
    messagingView,
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
    setMessagingView,
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
    bodyState, sidePaneContent, currentActivePage, itemId, messagingView,
    viewMode, page, groupBy, activeGroupTab, filters, sortConfig,
    navigateTo, openSidePane, closeSidePane, toggleSidePane, toggleSplitView, setNormalView, setMessagingView,
    switchSplitPanes, closeSplitPane, onItemSelect, setViewMode, setGroupBy, setActiveGroupTab, setFilters,
    setSort, setTableSort, setPage
  ]);
}
```

## File: src/pages/Messaging/index.tsx
```typescript
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { usePageViewConfig } from "@/hooks/usePageViewConfig.hook";
import { useAppShellStore } from "@/store/appShell.store";
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

  const defaultSplitPaneWidth = useAppShellStore((s) => s.defaultSplitPaneWidth);
  // When a conversation is selected (split view), reset the pane width to default.
  // When no conversation is selected, we don't want to manage the width, so pass undefined.
  const desiredSplitPaneWidth = conversationId ? defaultSplitPaneWidth : undefined;
  usePageViewConfig({ splitPaneWidth: desiredSplitPaneWidth });

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
