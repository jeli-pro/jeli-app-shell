import React, { useState, useLayoutEffect, useRef, useCallback } from 'react';
import type { Message, JourneyPointType } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { gsap } from 'gsap';
import { MessageSquare, ShoppingCart, PackageCheck, AlertCircle, RefreshCw, MailQuestion, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JourneyScrollbarProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  journeyPoints: Message[];
  onDotClick: (messageId: string) => void;
  onHoverChange?: (isHovering: boolean) => void;
  showAllTooltips?: boolean;
}

const journeyInfoMap: Record<JourneyPointType, { Icon: LucideIcon; textColor: string; bgColor: string; }> = {
  Consult: { Icon: MessageSquare, textColor: 'text-blue-500', bgColor: 'bg-blue-500' },
  Order: { Icon: ShoppingCart, textColor: 'text-green-500', bgColor: 'bg-green-500' },
  Delivered: { Icon: PackageCheck, textColor: 'text-emerald-500', bgColor: 'bg-emerald-500' },
  Complain: { Icon: AlertCircle, textColor: 'text-red-500', bgColor: 'bg-red-500' },
  Reorder: { Icon: RefreshCw, textColor: 'text-indigo-500', bgColor: 'bg-indigo-500' },
  'Follow-up': { Icon: MailQuestion, textColor: 'text-yellow-500', bgColor: 'bg-yellow-500' },
};

export const JourneyScrollbar: React.FC<JourneyScrollbarProps> = ({
  scrollContainerRef,
  journeyPoints,
  onDotClick,
  onHoverChange,
  showAllTooltips,
}) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotsContainerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragOffsetY = useRef(0);
  const activeJourneyPointIdRef = useRef<string | null>(null);

  const updateScrollbar = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !trackRef.current || !thumbRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    
    if (scrollHeight <= clientHeight) {
      gsap.to(thumbRef.current, { autoAlpha: 0, duration: 0.1 });
      return;
    }

    gsap.to(thumbRef.current, { autoAlpha: 1, duration: 0.1 });

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
        if (isOverflowing) {
          (newActiveDot as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
      activeJourneyPointIdRef.current = closestPointId;
    }
  }, [scrollContainerRef, journeyPoints, isOverflowing]);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const handleScroll = () => {
        if (!isDraggingRef.current) {
          updateScrollbar();
        }
      };
      updateScrollbar();
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [scrollContainerRef, updateScrollbar]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || journeyPoints.length === 0) return;

    const MIN_DOT_SPACING = 32; // Corresponds to h-8 in Tailwind

    const checkOverflow = () => {
      const requiredHeight = journeyPoints.length * MIN_DOT_SPACING;
      const trackHeight = track.clientHeight;
      setIsOverflowing(requiredHeight > trackHeight);
    };
    
    checkOverflow();
    const resizeObserver = new ResizeObserver(() => {
        checkOverflow();
        updateScrollbar();
    });
    resizeObserver.observe(trackRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [journeyPoints.length, updateScrollbar]);

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
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onMouseDown={handleTrackClick}
    >
        <TooltipProvider delayDuration={100}>
            <div className="relative h-full w-full">
                {/* Track Line */}
                <div className="track-line absolute top-0 left-1/2 -translate-x-1/2 h-full w-1 bg-border rounded-full" />

                {/* Thumb */}
                <div
                    ref={thumbRef}
                    className="absolute left-1/2 -translate-x-1/2 w-2 bg-muted-foreground hover:bg-muted-foreground/80 rounded-sm cursor-grab active:cursor-grabbing opacity-0"
                    onMouseDown={handleMouseDown}
                />

                {/* Journey Dots */}
                <div
                  ref={dotsContainerRef}
                  className={cn(
                    // This container is click-through so the thumb and track can be interactive.
                    // Individual dots will re-enable pointer events for themselves.
                    "absolute top-0 left-0 w-full h-full pointer-events-none",
                    isOverflowing 
                      ? "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                      : "flex flex-col"
                  )}
                >
                  {journeyPoints.map((point) => {
                    const journeyInfo = point.journeyPoint ? journeyInfoMap[point.journeyPoint] : null;
                    return (
                      <div 
                        key={point.id} 
                        className={cn("flex items-center justify-center", isOverflowing ? "h-8 flex-shrink-0" : "flex-1")}
                      >
                          <Tooltip open={showAllTooltips}>
                              <TooltipTrigger asChild>
                                <button
                                    data-dot-id={point.id}
                                    onClick={(e) => { e.stopPropagation(); onDotClick(point.id); }}
                                    // Dots are on top of the thumb and are clickable.
                                    className={cn("relative z-10 pointer-events-auto w-2.5 h-2.5 opacity-50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-background transition-all duration-200 hover:scale-125 hover:opacity-100",
                                        journeyInfo ? journeyInfo.bgColor : 'bg-primary'
                                    )}
                                    aria-label={`Jump to message: ${point.text.substring(0, 30)}...`}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="left" className="text-sm p-2 w-auto max-w-xs shadow-xl" sideOffset={8}>
                                {journeyInfo && <div className="flex items-center gap-2 font-semibold mb-1.5"><journeyInfo.Icon className={cn("w-4 h-4", journeyInfo.textColor)} /><span>{point.journeyPoint}</span></div>}
                                <p className="line-clamp-3 text-muted-foreground">{point.text}</p>
                              </TooltipContent>
                          </Tooltip>
                      </div>
                    );
                  })}
                </div>
            </div>
        </TooltipProvider>
    </div>
  );
};