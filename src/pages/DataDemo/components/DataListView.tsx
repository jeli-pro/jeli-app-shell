import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Calendar, Eye, Heart, Share, ArrowRight } from 'lucide-react'
import type { ViewProps } from '../types'
import { getStatusColor, getPriorityColor } from '../utils'
import { EmptyState } from './EmptyState'

export function DataListView({ data, onItemSelect, selectedItem }: ViewProps) {
  const listRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (listRef.current) {
      gsap.fromTo(listRef.current.children,
        { y: 30, opacity: 0 },
        {
          duration: 0.5,
          y: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "power2.out"
        }
      )
    }
  }, [data])

  if (data.length === 0) {
    return <EmptyState />
  }

  return (
    <div ref={listRef} className="space-y-4">
      {data.map((item) => {
        const isSelected = selectedItem?.id === item.id
        
        return (
          <div
            key={item.id}
            onClick={() => onItemSelect(item)}
            className={cn(
              "group relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm transition-all duration-300 cursor-pointer",
              "hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20",
              "active:scale-[0.99]",
              isSelected && "ring-2 ring-primary/20 border-primary/30 bg-card/90"
            )}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center text-2xl">
                    {item.thumbnail}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 ml-4 flex-shrink-0" />
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                    <Badge variant="outline" className="bg-accent/50">
                      {item.category}
                    </Badge>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Assignee */}
                      <div className="flex items-center gap-2">
                        <Avatar className="w-7 h-7 text-sm">
                          {item.assignee.avatar}
                        </Avatar>
                        <span className="text-sm text-muted-foreground font-medium">
                          {item.assignee.name}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.metrics.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {item.metrics.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share className="w-3 h-3" />
                        {item.metrics.shares}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-medium">{item.metrics.completion}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary/80 h-1.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${item.metrics.completion}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        )
      })}
    </div>
  )
}