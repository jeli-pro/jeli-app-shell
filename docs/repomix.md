# Directory Structure
```
src/
  pages/
    Messaging/
      components/
        JourneyScrollbar.tsx
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

## File: src/pages/Messaging/components/JourneyScrollbar.tsx
```typescript
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Message } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { gsap } from 'gsap';

interface JourneyScrollbarProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  journeyPoints: Message[];
  onDotClick: (messageId: string) => void;
}

interface DotPosition {
  id: string;
  topPercentage: number;
  message: Message;
}

export const JourneyScrollbar: React.FC<JourneyScrollbarProps> = ({
  scrollContainerRef,
  journeyPoints,
  onDotClick,
}) => {
  const [dotPositions, setDotPositions] = useState<DotPosition[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragOffsetY = useRef(0);
  const activeJourneyPointIdRef = useRef<string | null>(null);

  const calculateDotPositions = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || journeyPoints.length === 0) return;

    const { scrollHeight } = container;
    if (scrollHeight === 0) return;

    const newPositions: DotPosition[] = journeyPoints
      .map(point => {
        const element = container.querySelector(`[data-message-id="${point.id}"]`) as HTMLElement;
        if (element) {
          const topPercentage = (element.offsetTop / scrollHeight) * 100;
          return {
            id: point.id,
            topPercentage,
            message: point,
          };
        }
        return null;
      })
      .filter((p): p is DotPosition => p !== null);

    setDotPositions(currentPositions => {
        if (JSON.stringify(newPositions) !== JSON.stringify(currentPositions)) {
            return newPositions;
        }
        return currentPositions;
    });
  }, [journeyPoints, scrollContainerRef]);

  const updateScrollbar = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !trackRef.current || !thumbRef.current || !progressRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    
    if (scrollHeight <= clientHeight) {
      gsap.to([thumbRef.current, progressRef.current], { autoAlpha: 0, duration: 0.1 });
      return;
    }

    gsap.to([thumbRef.current, progressRef.current], { autoAlpha: 1, duration: 0.1 });

    // Calculate proportional thumb height, but cap it at 10% of the container height
    // to prevent it from looking too long. A minimum of 20px is enforced for usability.
    const thumbHeight = Math.max(20, Math.min((clientHeight / scrollHeight) * clientHeight, clientHeight * 0.1));
    const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - thumbHeight);
    
    gsap.to(thumbRef.current, {
      height: thumbHeight,
      y: thumbTop,
      duration: 0.1,
      ease: 'power1.out',
    });
    
    gsap.to(progressRef.current, {
        height: thumbTop,
        duration: 0.1,
        ease: 'power1.out'
    });

    // Active journey point logic
    const viewportCenter = scrollTop + clientHeight / 2;
    let closestPointId: string | null = null;
    let minDistance = Infinity;

    journeyPoints.forEach(point => {
      const element = container.querySelector(`[data-message-id="${point.id}"]`) as HTMLElement;
      if (element) {
        const elementCenter = element.offsetTop + element.offsetHeight / 2;
        const distance = Math.abs(viewportCenter - elementCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestPointId = point.id;
        }
      }
    });

    if (closestPointId && activeJourneyPointIdRef.current !== closestPointId) {
      if (activeJourneyPointIdRef.current) {
        const oldActiveDot = trackRef.current.querySelector(`[data-dot-id="${activeJourneyPointIdRef.current}"]`);
        gsap.to(oldActiveDot, { scale: 1, opacity: 0.5, duration: 0.2, ease: 'back.out' });
      }
      
      const newActiveDot = trackRef.current.querySelector(`[data-dot-id="${closestPointId}"]`);
      if (newActiveDot) {
        gsap.to(newActiveDot, { scale: 1.75, opacity: 1, duration: 0.2, ease: 'back.out' });
      }
      activeJourneyPointIdRef.current = closestPointId;
    }

  }, [scrollContainerRef, journeyPoints]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const handleScroll = () => {
        if (!isDraggingRef.current) {
          updateScrollbar();
        }
      };
      updateScrollbar();
      calculateDotPositions();
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [scrollContainerRef, updateScrollbar, calculateDotPositions]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observerCallback = () => {
        updateScrollbar();
        calculateDotPositions();
    };

    const resizeObserver = new ResizeObserver(observerCallback);
    resizeObserver.observe(container);
    if(trackRef.current) resizeObserver.observe(trackRef.current);

    const mutationObserver = new MutationObserver(observerCallback);
    mutationObserver.observe(container, { childList: true, subtree: true, characterData: true });

    return () => {
        resizeObserver.disconnect();
        mutationObserver.disconnect();
    };
  }, [calculateDotPositions, updateScrollbar, scrollContainerRef]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current || !trackRef.current || !thumbRef.current) return;
    
    e.preventDefault();
    const container = scrollContainerRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    
    const { scrollHeight, clientHeight } = container;
    const scrollableDist = scrollHeight - clientHeight;
    if (scrollableDist <= 0) return;
    
    const trackRect = track.getBoundingClientRect();
    const thumbHeight = thumb.offsetHeight;
    
    const newThumbTop = e.clientY - trackRect.top - dragOffsetY.current;
    const clampedThumbTop = Math.max(0, Math.min(newThumbTop, trackRect.height - thumbHeight));
    
    const scrollRatio = clampedThumbTop / (trackRect.height - thumbHeight);
    
    gsap.to(container, {
      scrollTop: scrollRatio * scrollableDist,
      duration: 0,
      onUpdate: updateScrollbar
    });

  }, [scrollContainerRef, updateScrollbar]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!scrollContainerRef.current || !thumbRef.current) return;
    
    isDraggingRef.current = true;
    const thumbRect = thumbRef.current.getBoundingClientRect();
    dragOffsetY.current = e.clientY - thumbRect.top;
    
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [scrollContainerRef, handleMouseMove, handleMouseUp]);
  
  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
     if (e.target === thumbRef.current || (e.target as HTMLElement).closest('[data-dot-id]')) return;

    const container = scrollContainerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;
    
    const { scrollHeight, clientHeight } = container;
    const trackRect = track.getBoundingClientRect();
    const clickY = e.clientY - trackRect.top;
    
    const thumbHeight = Math.max(20, Math.min((clientHeight / scrollHeight) * clientHeight, clientHeight * 0.1));
    const clickRatio = (clickY - thumbHeight / 2) / (trackRect.height - thumbHeight);
    
    gsap.to(container, {
      scrollTop: (scrollHeight - clientHeight) * Math.max(0, Math.min(1, clickRatio)),
      duration: 0.3,
      ease: 'power2.out'
    });
    
  }, [scrollContainerRef]);

  return (
    <div
      ref={trackRef}
      className="absolute top-0 right-0 h-full w-8 py-2 z-10 cursor-pointer"
      onMouseDown={handleTrackClick}
    >
        <TooltipProvider delayDuration={100}>
            <div className="relative h-full w-full">
                {/* Track Line */}
                <div className="track-line absolute top-0 left-1/2 -translate-x-1/2 h-full w-1 bg-border rounded-full" />
                
                {/* Progress Fill */}
                <div 
                  ref={progressRef}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-1 bg-primary opacity-0"
                />

                {/* Thumb */}
                <div
                    ref={thumbRef}
                    className="absolute left-1/2 -translate-x-1/2 w-2 bg-muted-foreground hover:bg-muted-foreground/80 rounded-sm cursor-grab active:cursor-grabbing opacity-0"
                    onMouseDown={handleMouseDown}
                />

                {/* Journey Dots */}
                {dotPositions.map((pos) => (
                <Tooltip key={pos.id}>
                    <TooltipTrigger asChild>
                    <button
                        data-dot-id={pos.id}
                        onClick={(e) => { e.stopPropagation(); onDotClick(pos.id); }}
                        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-primary opacity-50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-background transition-all duration-200 hover:scale-125 hover:opacity-100"
                        style={{ top: `${pos.topPercentage}%` }}
                        aria-label={`Jump to message: ${pos.message.text.substring(0, 30)}...`}
                    />
                    </TooltipTrigger>
                    <TooltipContent side="left" className="text-sm p-2 w-auto max-w-xs shadow-xl" sideOffset={8}>
                    <p className="line-clamp-3">{pos.message.text}</p>
                    </TooltipContent>
                </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    </div>
  );
};
```

## File: src/pages/Messaging/components/TaskDetail.tsx
```typescript
import React, { useRef, useEffect } from 'react';
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
      <div 
        ref={scrollContainerRef} 
        className="relative flex-1 overflow-y-auto pr-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <ActivityFeed messages={task.messages} contact={task.contact} />
        {journeyPoints.length > 0 && (
            <JourneyScrollbar
                scrollContainerRef={scrollContainerRef}
                journeyPoints={journeyPoints}
                onDotClick={handleDotClick}
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

## File: src/pages/Messaging/data/mockData.ts
```typescript
import type { Contact, Task, Message, ActivityEvent, Note, Assignee, TaskStatus, TaskPriority } from '../types';

// --- ASSIGNEES ---
export const mockAssignees: Assignee[] = [
  { id: 'user-1', name: 'You', avatar: `https://avatar.vercel.sh/you.png`, type: 'human' },
  { id: 'user-2', name: 'Alex Johnson', avatar: `https://avatar.vercel.sh/alex.png`, type: 'human' },
  { id: 'user-3', name: 'Samira Kumar', avatar: `https://avatar.vercel.sh/samira.png`, type: 'human' },
  { id: 'user-ai-1', name: 'AI Assistant', avatar: `https://avatar.vercel.sh/ai.png`, type: 'ai' },
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
    activeHandlerId: 'user-2', // Alex is handling this
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
    activeHandlerId: null,
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
    activeHandlerId: 'user-ai-1', // AI Assistant is handling this
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
    activeHandlerId: null,
  },
];
```

## File: src/pages/Messaging/store/messaging.store.ts
```typescript
import { create } from 'zustand';
import { mockTasks, mockContacts, mockAssignees } from '../data/mockData';
import type { Task, Contact, Channel, Assignee, TaskStatus, TaskPriority, TaskView, Message, JourneyPointType } from '../types';

// Data augmentation to add journey points for demonstration
const augmentedTasks = mockTasks.map(task => {
  if (task.id === 'task-1' && task.messages.length > 8) {
    const messagesWithJourneyPoints: Message[] = [...task.messages];
    messagesWithJourneyPoints[2] = { ...messagesWithJourneyPoints[2], journeyPoint: 'Consult' as JourneyPointType };
    messagesWithJourneyPoints[5] = { ...messagesWithJourneyPoints[5], journeyPoint: 'Order' as JourneyPointType };
    messagesWithJourneyPoints[8] = { ...messagesWithJourneyPoints[8], journeyPoint: 'Complain' as JourneyPointType };
    return { ...task, messages: messagesWithJourneyPoints };
  }
  return task;
});

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
  getAvailableTags: () => string[];
}

export const useMessagingStore = create<MessagingState & MessagingActions>((set, get) => ({
  tasks: augmentedTasks,
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

export type JourneyPointType = 'Consult' | 'Order' | 'Complain' | 'Reorder';

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
