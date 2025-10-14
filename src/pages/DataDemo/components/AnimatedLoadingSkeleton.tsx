import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ViewMode } from '../types'

interface GridConfig {
  numCards: number
  cols: number
}

export const AnimatedLoadingSkeleton = ({ viewMode }: { viewMode: ViewMode }) => {
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  const getGridConfig = (width: number): GridConfig => {
    if (width === 0) return { numCards: 8, cols: 2 }; // Default before measurement
    if (viewMode === 'list' || viewMode === 'table') {
      return { numCards: 5, cols: 1 }
    }
    // For card view
    if (viewMode === 'cards') {
      const cols = Math.max(1, Math.floor(width / 344)); // 320px card + 24px gap
      return { numCards: Math.max(8, cols * 2), cols }
    }
    // For grid view
    const cols = Math.max(1, Math.floor(width / 304)); // 280px card + 24px gap
    return { numCards: Math.max(8, cols * 2), cols }
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.kill()
    }
    if (!iconRef.current || !containerRef.current || containerWidth === 0) return

    // Allow DOM to update with new skeleton cards
    const timeoutId = setTimeout(() => {
      const cards = Array.from(containerRef.current!.children)
      if (cards.length === 0) return

      const shuffledCards = gsap.utils.shuffle(cards)

      const getCardPosition = (card: Element) => {
        const rect = card.getBoundingClientRect()
        const containerRect = containerRef.current!.getBoundingClientRect()
        const iconRect = iconRef.current!.getBoundingClientRect()

        return {
          x: rect.left - containerRect.left + rect.width / 2 - iconRect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2 - iconRect.height / 2,
        }
      }
      
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.5,
        defaults: { duration: 1, ease: 'power2.inOut' }
      });
      timelineRef.current = tl

      // Animate to a few random cards
      shuffledCards.slice(0, 5).forEach(card => {
        const pos = getCardPosition(card)
        tl.to(iconRef.current, { 
          x: pos.x,
          y: pos.y,
          scale: 1.2,
          duration: 0.8
        }).to(iconRef.current, {
          scale: 1,
          duration: 0.2
        })
      });

      // Loop back to the start
      const firstPos = getCardPosition(shuffledCards[0]);
      tl.to(iconRef.current, { x: firstPos.x, y: firstPos.y, duration: 0.8 });
    }, 100) // Small delay to ensure layout is calculated

    return () => {
      clearTimeout(timeoutId)
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }

  }, [containerWidth, viewMode])

  const config = getGridConfig(containerWidth)

  const renderSkeletonCard = (key: number) => {
    if (viewMode === 'list' || viewMode === 'table') {
      return (
        <div key={key} className="bg-card/30 border border-border/30 rounded-2xl p-6 flex items-start gap-4 animate-pulse">
          <div className="w-14 h-14 bg-muted rounded-xl flex-shrink-0"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-5/6"></div>
            <div className="flex gap-2 pt-2">
              <div className="h-6 bg-muted rounded-full w-20"></div>
              <div className="h-6 bg-muted rounded-full w-20"></div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div 
        key={key} 
        className={cn(
          "bg-card/30 border border-border/30 rounded-3xl p-6 space-y-4 animate-pulse",
        )}
      >
        <div className="flex items-start justify-between">
          <div className="w-16 h-16 bg-muted rounded-2xl"></div>
          <div className="w-4 h-4 bg-muted rounded-full"></div>
        </div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-3 bg-muted rounded w-full"></div>
        <div className="h-3 bg-muted rounded w-5/6"></div>
        <div className="h-2 w-full bg-muted rounded-full my-4"></div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-muted rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-2 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      </div>
    )
  }

  const gridClasses = {
    list: "space-y-4",
    table: "space-y-4",
    cards: "grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6",
    grid: "grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6"
  }

  return (
    <div className="relative overflow-hidden rounded-lg min-h-[500px]">
      <div 
        ref={iconRef}
        className="absolute z-10 p-3 bg-primary/20 rounded-full backdrop-blur-sm"
        style={{ willChange: 'transform' }}
      >
        <Search className="w-6 h-6 text-primary" />
      </div>

      <div 
        ref={containerRef}
        className={cn(gridClasses[viewMode])}
      >
        {[...Array(config.numCards)].map((_, i) => renderSkeletonCard(i))}
      </div>
    </div>
  )
}