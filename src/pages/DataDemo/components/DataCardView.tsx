import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Calendar, Clock, Eye, Heart, Share, ArrowUpRight, Tag } from 'lucide-react'
import type { ViewProps } from '../types'

export function DataCardView({ data, onItemSelect, selectedItem, isGrid = false }: ViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children, 
        { y: 40, opacity: 0, scale: 0.95 },
        {
          duration: 0.6,
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          ease: "power2.out",
        }
      )
    }
  }, [data])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-700 border-green-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
      case 'completed': return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
      case 'archived': return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-700 border-red-500/30'
      case 'high': return 'bg-orange-500/20 text-orange-700 border-orange-500/30'
      case 'medium': return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
      case 'low': return 'bg-green-500/20 text-green-700 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
    }
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Eye className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No items found</h3>
        <p className="text-muted-foreground">Try adjusting your search criteria</p>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "gap-6",
        isGrid 
          ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 space-y-6" 
          : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      )}
    >
      {data.map((item) => {
        const isSelected = selectedItem?.id === item.id
        
        return (
          <div
            key={item.id}
            onClick={() => onItemSelect(item)}
            className={cn(
              "group relative overflow-hidden rounded-3xl border bg-card/50 backdrop-blur-sm transition-all duration-500 cursor-pointer",
              "hover:bg-card/80 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-2",
              "active:scale-[0.98]",
              isSelected && "ring-2 ring-primary/30 border-primary/40 bg-card/90 shadow-lg shadow-primary/20",
              isGrid && "break-inside-avoid mb-6"
            )}
          >
            {/* Card Header with Thumbnail */}
            <div className="relative p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                  {item.thumbnail}
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </div>

              {/* Priority indicator */}
              <div className="absolute top-4 right-4">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  item.priority === 'critical' && "bg-red-500",
                  item.priority === 'high' && "bg-orange-500",
                  item.priority === 'medium' && "bg-blue-500",
                  item.priority === 'low' && "bg-green-500"
                )} />
              </div>
            </div>

            {/* Card Content */}
            <div className="px-6 pb-6">
              {/* Title and Description */}
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {item.description}
              </p>

              {/* Status and Category */}
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
                <Badge variant="outline" className="bg-accent/50 text-xs">
                  {item.category}
                </Badge>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1 mb-4">
                <Tag className="w-3 h-3 text-muted-foreground" />
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs font-semibold">{item.metrics.completion}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${item.metrics.completion}%` }}
                  />
                </div>
              </div>

              {/* Assignee */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-8 h-8 text-sm">
                  {item.assignee.avatar}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {item.assignee.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.assignee.email}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
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
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 pointer-events-none" />
            )}
          </div>
        )
      })}
    </div>
  )
}