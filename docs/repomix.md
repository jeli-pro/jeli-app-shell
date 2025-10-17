# Directory Structure
```
src/
  components/
    effects/
      BoxReveal.tsx
  lib/
    utils.ts
  pages/
    Messaging/
      components/
        JourneyScrollbar.tsx
        TaskDetail.tsx
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

    const thumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 20);
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
    
    const thumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 20);
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

## File: src/components/effects/BoxReveal.tsx
```typescript
import { ReactNode, useEffect, useRef, memo } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

type BoxRevealProps = {
	children: ReactNode;
	width?: string;
	boxColor?: string;
	duration?: number;
	className?: string;
};

export const BoxReveal = memo(function BoxReveal({
	children,
	width = 'fit-content',
	boxColor,
	duration,
	className,
}: BoxRevealProps) {
	const sectionRef = useRef<HTMLDivElement>(null);
	const boxRef = useRef<HTMLDivElement>(null);
	const childRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						gsap.timeline()
							.set(childRef.current, { opacity: 0, y: 50 })
							.set(boxRef.current, { transformOrigin: 'right' })
							.to(boxRef.current, {
								scaleX: 0,
								duration: duration ?? 0.5,
								ease: 'power3.inOut',
							})
							.to(
								childRef.current,
								{ y: 0, opacity: 1, duration: duration ?? 0.5, ease: 'power3.out' },
								'-=0.3',
							);
						observer.unobserve(section);
					}
				});
			},
			{ threshold: 0.1 },
		);

		observer.observe(section);

		return () => {
			if (section) {
				observer.unobserve(section);
			}
		};
	}, [duration]);

	return (
		<div ref={sectionRef} style={{ width }} className={cn('relative overflow-hidden', className)}>
			<div ref={childRef}>{children}</div>
			<div
				ref={boxRef}
				style={{
					background: boxColor ?? 'hsl(var(--skeleton))',
				}}
				className="absolute top-1 bottom-1 left-0 right-0 z-20 rounded-sm"
			/>
		</div>
	);
});
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
        className="relative flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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

## File: src/lib/utils.ts
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SIDEBAR_STATES = {
  HIDDEN: 'hidden',
  COLLAPSED: 'collapsed', 
  EXPANDED: 'expanded',
  PEEK: 'peek'
} as const

export const BODY_STATES = {
  NORMAL: 'normal',
  FULLSCREEN: 'fullscreen',
  SIDE_PANE: 'side_pane',
  SPLIT_VIEW: 'split_view'
} as const

export type SidebarState = typeof SIDEBAR_STATES[keyof typeof SIDEBAR_STATES]
export type BodyState = typeof BODY_STATES[keyof typeof BODY_STATES]

export function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500/20 text-green-700 border-green-500/30'
    case 'pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
    case 'completed': return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
    case 'archived': return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
    default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
  }
}

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-500/20 text-red-700 border-red-500/30'
    case 'high': return 'bg-orange-500/20 text-orange-700 border-orange-500/30'
    case 'medium': return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
    case 'low': return 'bg-green-500/20 text-green-700 border-green-500/30'
    default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
  }
}
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
