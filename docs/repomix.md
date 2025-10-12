# Directory Structure
```
src/
  components/
    shared/
      PageLayout.tsx
  lib/
    utils.ts
  pages/
    DataDemo/
      components/
        DataCardView.tsx
        DataDetailPanel.tsx
        DataListView.tsx
        DataTableView.tsx
        DataViewModeSelector.tsx
        EmptyState.tsx
      index.tsx
      types.ts
      utils.ts
index.html
package.json
postcss.config.js
README.md
tailwind.config.js
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: src/pages/DataDemo/components/EmptyState.tsx
````typescript
import { Eye } from 'lucide-react'

export function EmptyState() {
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
````

## File: src/pages/DataDemo/utils.ts
````typescript
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
````

## File: src/components/shared/PageLayout.tsx
````typescript
import React from 'react';
import { cn } from '@/lib/utils';
import { useAppShell } from '@/context/AppShellContext';

interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement>;
  isInSidePane?: boolean;
}

export const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ children, onScroll, scrollRef, className, isInSidePane = false, ...props }, ref) => {
    const { isTopBarVisible, bodyState } = useAppShell();
    const isFullscreen = bodyState === 'fullscreen';

    return (
      <div
        ref={scrollRef}
        className={cn("h-full overflow-y-auto", className)}
        onScroll={onScroll}
      >
        <div ref={ref} className={cn(
          "space-y-8 transition-all duration-300",
          !isInSidePane ? "px-6 lg:px-12 pb-6" : "px-6 pb-6",
          isTopBarVisible && !isFullscreen ? "pt-24" : "pt-6"
        )}
        {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);

PageLayout.displayName = 'PageLayout';
````

## File: src/pages/DataDemo/components/DataCardView.tsx
````typescript
import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Calendar, Eye, Heart, Share, ArrowUpRight, Tag } from 'lucide-react'
import type { ViewProps } from '../types'
import { getStatusColor, getPriorityColor } from '../utils'
import { EmptyState } from './EmptyState'

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

  if (data.length === 0) {
    return <EmptyState />
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
````

## File: src/pages/DataDemo/components/DataDetailPanel.tsx
````typescript
import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  Share, 
  Download,
  FileText,
  Image,
  Video,
  File,
  ExternalLink,
  Tag,
  User,
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Circle
} from 'lucide-react'
import { useAppShell } from '@/context/AppShellContext'
import type { DataItem } from '../types'
import { getStatusColor, getPriorityColor } from '../utils'

interface DataDetailPanelProps {
  item: DataItem | null
  onClose: () => void
}

export function DataDetailPanel({ item, onClose }: DataDetailPanelProps) {
  const { bodyState, sidePaneContent } = useAppShell()
  const contentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (item && contentRef.current && sidePaneContent === 'data-details') {
      gsap.fromTo(contentRef.current.children,
        { y: 30, opacity: 0 },
        {
          duration: 0.6,
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: "power2.out"
        }
      )
    }
  }, [item, sidePaneContent])

  if (!item || sidePaneContent !== 'data-details') {
    return null
  }

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return FileText
      case 'image':
      case 'png':
      case 'jpg':
      case 'jpeg': return Image
      case 'video':
      case 'mp4': return Video
      default: return File
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle
      case 'active': return Circle
      case 'pending': return AlertCircle
      default: return Circle
    }
  }

  return (
    <div ref={contentRef} className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
            {item.thumbnail}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold mb-2 leading-tight">
              {item.title}
            </h1>
            <p className="text-muted-foreground">
              {item.description}
            </p>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className={getStatusColor(item.status)}>
            {React.createElement(getStatusIcon(item.status), { className: "w-3 h-3 mr-1" })}
            {item.status}
          </Badge>
          <Badge variant="outline" className={getPriorityColor(item.priority)}>
            {item.priority}
          </Badge>
          <Badge variant="outline" className="bg-accent/50">
            {item.category}
          </Badge>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-bold">{item.metrics.completion}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${item.metrics.completion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Assignee Info */}
          <div className="bg-card/30 rounded-2xl p-4 border border-border/30">
            <div className="flex items-center gap-1 mb-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Assigned to</h3>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                {item.assignee.avatar}
              </Avatar>
              <div>
                <p className="font-medium">{item.assignee.name}</p>
                <p className="text-sm text-muted-foreground">{item.assignee.email}</p>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="bg-card/30 rounded-2xl p-4 border border-border/30">
            <div className="flex items-center gap-1 mb-3">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Engagement Metrics</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Eye className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-2xl font-bold">{item.metrics.views}</p>
                <p className="text-xs text-muted-foreground">Views</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Heart className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-2xl font-bold">{item.metrics.likes}</p>
                <p className="text-xs text-muted-foreground">Likes</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Share className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold">{item.metrics.shares}</p>
                <p className="text-xs text-muted-foreground">Shares</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-card/30 rounded-2xl p-4 border border-border/30">
            <div className="flex items-center gap-1 mb-3">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-muted/50 text-muted-foreground px-3 py-1 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content Details */}
          {item.content && (
            <div className="bg-card/30 rounded-2xl p-4 border border-border/30">
              <h3 className="font-semibold text-sm mb-3">Project Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.content.summary}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.content.details}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Attachments */}
          {item.content?.attachments && item.content.attachments.length > 0 && (
            <div className="bg-card/30 rounded-2xl p-4 border border-border/30">
              <h3 className="font-semibold text-sm mb-3">Attachments</h3>
              <div className="space-y-2">
                {item.content.attachments.map((attachment, index) => {
                  const IconComponent = getFileIcon(attachment.type)
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                    >
                      <IconComponent className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {attachment.type} • {attachment.size}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-card/30 rounded-2xl p-4 border border-border/30">
            <div className="flex items-center gap-1 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Timeline</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">Last updated:</span>
                <span className="font-medium">
                  {new Date(item.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {item.dueDate && (
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-3 h-3 text-orange-500" />
                  <span className="text-muted-foreground">Due date:</span>
                  <span className="font-medium text-orange-600">
                    {new Date(item.dueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-border/50 bg-card/30">
        <div className="flex gap-3">
          <Button className="flex-1" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Project
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  )
}
````

## File: src/pages/DataDemo/components/DataListView.tsx
````typescript
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
````

## File: src/pages/DataDemo/components/DataTableView.tsx
````typescript
import { useState, useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { 
  Calendar, 
  Eye, 
  Heart, 
  Share, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react'
import type { ViewProps, DataItem } from '../types'
import { getStatusColor, getPriorityColor } from '../utils'
import { EmptyState } from './EmptyState'

type SortField = keyof DataItem | 'assignee.name' | 'metrics.views' | 'metrics.completion'
type SortDirection = 'asc' | 'desc' | null

export function DataTableView({ data, onItemSelect, selectedItem }: ViewProps) {
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const tableRef = useRef<HTMLTableElement>(null)

  useLayoutEffect(() => {
    if (tableRef.current) {
      gsap.fromTo(tableRef.current.querySelectorAll('tbody tr'),
        { y: 20, opacity: 0 },
        {
          duration: 0.5,
          y: 0,
          opacity: 1,
          stagger: 0.05,
          ease: "power2.out"
        }
      )
    }
  }, [data])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => 
        prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'
      )
      if (sortDirection === 'desc') {
        setSortField(null)
      }
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortedData = () => {
    if (!sortField || !sortDirection) return data

    return [...data].sort((a, b) => {
      let aValue: any
      let bValue: any

      if (sortField === 'assignee.name') {
        aValue = a.assignee.name
        bValue = b.assignee.name
      } else if (sortField === 'metrics.views') {
        aValue = a.metrics.views
        bValue = b.metrics.views
      } else if (sortField === 'metrics.completion') {
        aValue = a.metrics.completion
        bValue = b.metrics.completion
      } else {
        aValue = a[sortField as keyof DataItem]
        bValue = b[sortField as keyof DataItem]
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }

      return 0
    })
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-4 h-4 text-primary" />
    }
    if (sortDirection === 'desc') {
      return <ArrowDown className="w-4 h-4 text-primary" />
    }
    return <ArrowUpDown className="w-4 h-4 opacity-50" />
  }

  const sortedData = getSortedData()

  if (data.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table ref={tableRef} className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20">
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Project
                  <SortIcon field="title" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Status
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSort('priority')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Priority
                  <SortIcon field="priority" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSort('assignee.name')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Assignee
                  <SortIcon field="assignee.name" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSort('metrics.completion')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Progress
                  <SortIcon field="metrics.completion" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSort('metrics.views')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Engagement
                  <SortIcon field="metrics.views" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">Date</th>
              <th className="text-center p-4 font-semibold text-sm w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => {
              const isSelected = selectedItem?.id === item.id
              
              return (
                <tr
                  key={item.id}
                  onClick={() => onItemSelect(item)}
                  className={cn(
                    "group border-b border-border/30 transition-all duration-200 cursor-pointer",
                    "hover:bg-accent/20 hover:border-primary/20",
                    isSelected && "bg-primary/5 border-primary/30"
                  )}
                >
                  {/* Project Column */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {item.thumbnail}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium group-hover:text-primary transition-colors truncate">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="p-4">
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </td>

                  {/* Priority Column */}
                  <td className="p-4">
                    <Badge variant="outline" className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                  </td>

                  {/* Assignee Column */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8 text-sm">
                        {item.assignee.avatar}
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.assignee.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Progress Column */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.metrics.completion}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {item.metrics.completion}%
                      </span>
                    </div>
                  </td>

                  {/* Engagement Column */}
                  <td className="p-4">
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
                  </td>

                  {/* Date Column */}
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="p-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        onItemSelect(item)
                      }}
                      className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-accent transition-colors"
                      title="View details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
````

## File: src/pages/DataDemo/components/DataViewModeSelector.tsx
````typescript
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { List, Grid3X3, LayoutGrid, Table } from 'lucide-react'
import type { ViewMode } from '../types'

interface DataViewModeSelectorProps {
  viewMode: ViewMode
  onChange: (mode: ViewMode) => void
}

const viewModes = [
  { id: 'list' as ViewMode, label: 'List', icon: List, description: 'Compact list with details' },
  { id: 'cards' as ViewMode, label: 'Cards', icon: LayoutGrid, description: 'Rich card layout' },
  { id: 'grid' as ViewMode, label: 'Grid', icon: Grid3X3, description: 'Masonry grid view' },
  { id: 'table' as ViewMode, label: 'Table', icon: Table, description: 'Structured data table' }
]

export function DataViewModeSelector({ viewMode, onChange }: DataViewModeSelectorProps) {
  const indicatorRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!indicatorRef.current || !containerRef.current) return

    const activeButton = containerRef.current.querySelector(`[data-mode="${viewMode}"]`) as HTMLElement
    if (!activeButton) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const buttonRect = activeButton.getBoundingClientRect()
    
    const left = buttonRect.left - containerRect.left
    const width = buttonRect.width

    gsap.to(indicatorRef.current, {
      duration: 0.3,
      x: left,
      width: width,
      ease: "power2.out"
    })
  }, [viewMode])

  return (
    <div className="relative">
      {/* Background container */}
      <div 
        ref={containerRef}
        className="relative flex items-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-1.5 shadow-lg"
      >
        {/* Animated indicator */}
        <div
          ref={indicatorRef}
          className="absolute inset-y-1.5 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20 rounded-xl transition-all duration-300"
          style={{ left: 0, width: 0 }}
        />
        
        {/* Mode buttons */}
        {viewModes.map((mode) => {
          const IconComponent = mode.icon
          const isActive = viewMode === mode.id
          
          return (
            <button
              key={mode.id}
              data-mode={mode.id}
              onClick={() => onChange(mode.id)}
              className={cn(
                "relative flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 group min-w-[120px]",
                "hover:bg-accent/20 active:scale-95",
                isActive && "text-primary"
              )}
              title={mode.description}
            >
              <IconComponent className={cn(
                "w-5 h-5 transition-all duration-300",
                isActive && "scale-110",
                "group-hover:scale-105"
              )} />
              <span className={cn(
                "font-medium transition-all duration-300",
                isActive ? "text-primary" : "text-muted-foreground",
                "group-hover:text-foreground"
              )}>
                {mode.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Description tooltip */}
      <div className="mt-3 text-center">
        <p className="text-sm text-muted-foreground">
          {viewModes.find(m => m.id === viewMode)?.description}
        </p>
      </div>
    </div>
  )
}
````

## File: src/pages/DataDemo/index.tsx
````typescript
import { useState, useRef } from 'react'
import { PageLayout } from '@/components/shared/PageLayout'
import { DataViewModeSelector } from './components/DataViewModeSelector'
import { DataListView } from './components/DataListView'
import { DataCardView } from './components/DataCardView'
import { DataTableView } from './components/DataTableView'
import { DataDetailPanel } from './components/DataDetailPanel'
import { useAppShell } from '@/context/AppShellContext'
import { mockDataItems } from './data/mockData'
import type { DataItem, ViewMode } from './types'

export default function DataDemoPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)
  const { openSidePane } = useAppShell()

  // Filter data based on search
  const filteredData = mockDataItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle item selection and open side panel
  const handleItemSelect = (item: DataItem) => {
    setSelectedItem(item)
    openSidePane('data-details')
  }

  const renderView = () => {
    const commonProps = {
      data: filteredData,
      onItemSelect: handleItemSelect,
      selectedItem
    }

    switch (viewMode) {
      case 'list':
        return <DataListView {...commonProps} />
      case 'cards':
        return <DataCardView {...commonProps} />
      case 'grid':
        return <DataCardView {...commonProps} isGrid />
      case 'table':
        return <DataTableView {...commonProps} />
      default:
        return <DataListView {...commonProps} />
    }
  }

  return (
    <PageLayout
      // Note: Search functionality is handled by a separate SearchBar in the TopBar
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Data Showcase</h1>
            <p className="text-muted-foreground">
              Showing {filteredData.length} of {mockDataItems.length} items
            </p>
          </div>
          <DataViewModeSelector 
            viewMode={viewMode} 
            onChange={setViewMode}
          />
        </div>

        <div ref={contentRef} className="min-h-[500px]">
          {renderView()}
        </div>

      </div>

      {/* Detail Panel */}
      <DataDetailPanel 
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </PageLayout>
  )
}
````

## File: src/pages/DataDemo/types.ts
````typescript
export type ViewMode = 'list' | 'cards' | 'grid' | 'table'

export interface DataItem {
  id: string
  title: string
  description: string
  category: string
  status: 'active' | 'pending' | 'completed' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee: {
    name: string
    avatar: string
    email: string
  }
  metrics: {
    views: number
    likes: number
    shares: number
    completion: number
  }
  tags: string[]
  createdAt: string
  updatedAt: string
  dueDate?: string
  thumbnail?: string
  content?: {
    summary: string
    details: string
    attachments?: Array<{
      name: string
      type: string
      size: string
      url: string
    }>
  }
}

export interface ViewProps {
  data: DataItem[]
  onItemSelect: (item: DataItem) => void
  selectedItem: DataItem | null
  isGrid?: boolean
}
````

## File: postcss.config.js
````javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
````

## File: src/lib/utils.ts
````typescript
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
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Library Build */
    "declaration": true,
    "emitDeclarationOnly": true,
    "declarationDir": "dist",

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": [
    "dist",
    "src/App.tsx",
    "src/main.tsx",
    "src/pages"
  ],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

## File: index.html
````html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jeli App Shell</title>
  </head>
  <body>
    <div id="root"></div>
    <div id="toaster-container"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
````

## File: tailwind.config.js
````javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        DEFAULT: "0.5rem",
      },
      boxShadow: {
        input: [
          "0px 2px 3px -1px rgba(0, 0, 0, 0.1)",
          "0px 1px 0px 0px rgba(25, 28, 33, 0.02)",
          "0px 0px 0px 1px rgba(25, 28, 33, 0.08)",
        ].join(", "),
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        ripple: "ripple 2s ease calc(var(--i, 0) * 0.2s) infinite",
        orbit: "orbit calc(var(--duration) * 1s) linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        ripple: {
          "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
          "50%": { transform: "translate(-50%, -50%) scale(0.9)" },
        },
        orbit: {
          "0%": {
            transform:
              "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
          },
          "100%": {
            transform:
              "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
          },
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
````

## File: tsconfig.node.json
````json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true
  },
  "include": ["vite.config.ts"]
}
````

## File: vite.config.ts
````typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'
import { resolve } from 'path'
import pkg from './package.json' with { type: 'json' }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'JeliAppShell',
      fileName: (format) => `jeli-app-shell.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: Object.keys(pkg.peerDependencies || {}),
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          tailwindcss: 'tailwindcss',
          gsap: 'gsap',
          'lucide-react': 'lucide-react',
          zustand: 'zustand',
          sonner: 'sonner'
        },
      },
    },
  },
})
````

## File: README.md
````markdown
# Jeli App Shell

[![npm version](https://img.shields.io/npm/v/jeli-app-shell.svg?style=flat)](https://www.npmjs.com/package/jeli-app-shell)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/travis/com/your-username/jeli-app-shell.svg)](https://travis-ci.com/your-username/jeli-app-shell)

A fully-featured, animated, and customizable application shell for React, built with TypeScript, Tailwind CSS, and powered by GSAP for smooth animations. Provide a modern, desktop-grade user experience out of the box.

This library provides all the necessary components and hooks to build a complex application layout with a resizable sidebar, a dynamic main content area, a contextual side pane, and more.

[**Live Demo (Storybook) →**](https://your-demo-link.com)

 <!-- TODO: Add a real preview image -->

---

## Key Features

-   **Component-Based Architecture**: Build your shell by composing flexible and powerful React components.
-   **Resizable Sidebar**: Draggable resizing with multiple states: `Expanded`, `Collapsed`, `Hidden`, and `Peek` (on hover).
-   **Dynamic Body States**: Seamlessly switch between `Normal`, `Fullscreen`, and `Side Pane` views.
-   **Smooth Animations**: Fluid transitions powered by GSAP for a premium feel.
-   **Dark Mode Support**: First-class dark mode support, easily toggled.
-   **Customizable Theming**: Easily theme your application using CSS variables, just like shadcn/ui.
-   **State Management Included**: Simple and powerful state management via React Context and Zustand.
-   **Command Palette**: Built-in command palette for quick navigation and actions.
-   **TypeScript & Modern Tools**: Built with TypeScript, React, Vite, and Tailwind CSS for a great developer experience.

## Installation

Install the package and its peer dependencies using your preferred package manager.
```bash
npm install jeli-app-shell react react-dom tailwindcss gsap lucide-react tailwind-merge class-variance-authority clsx tailwindcss-animate
```

or

```bash
yarn add jeli-app-shell react react-dom tailwindcss gsap lucide-react tailwind-merge class-variance-authority clsx tailwindcss-animate
```

## Getting Started

Follow these steps to integrate Jeli App Shell into your project.

### 1. Configure Tailwind CSS

You need to configure Tailwind CSS to correctly process the styles from the library.

**`tailwind.config.js`**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  // ... your other config
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // Add the path to the library's components
    './node_modules/jeli-app-shell/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    // ...
  },
  plugins: [require('tailwindcss-animate')],
};
```

**`index.css` (or your main CSS file)**

You need to import the library's stylesheet. It contains all the necessary base styles and CSS variables for theming.

```css
/* Import Tailwind's base, components, and utilities */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Import the App Shell's stylesheet */
@import 'jeli-app-shell/dist/style.css';
```

### 2. Set Up Providers

Wrap your application's root component with `AppShellProvider` and `ToasterProvider`.

**`App.tsx`**

```tsx
import React from 'react';
import { AppShellProvider } from 'jeli-app-shell';
import { ToasterProvider } from 'jeli-app-shell'; // Re-exported for convenience
import { Rocket } from 'lucide-react';
import { YourAppComponent } from './YourAppComponent';

function App() {
  const myLogo = (
    <div className="p-2 bg-primary/20 rounded-lg">
      <Rocket className="w-5 h-5 text-primary" />
    </div>
  );

  return (
    <AppShellProvider appName="My Awesome App" appLogo={myLogo}>
      <ToasterProvider>
        <YourAppComponent />
      </ToasterProvider>
    </AppShellProvider>
  );
}

export default App;
```

### 3. Compose Your Shell

The `<AppShell>` component is the heart of the library. You compose your layout by passing the `sidebar`, `topBar`, `mainContent`, and `rightPane` components as props.

Here's a complete example:

**`YourAppComponent.tsx`**

```tsx
import {
  // Main Layout
  AppShell,
  MainContent,
  RightPane,
  TopBar,

  // Sidebar Primitives
  Sidebar,
  SidebarBody,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarIcon,
  SidebarLabel,

  // Hooks & Context
  useAppShell,
} from 'jeli-app-shell';
import { Home, Settings, PanelRight } from 'lucide-react';

// 1. Build your custom sidebar
const MySidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <SidebarTitle>My App</SidebarTitle>
        </SidebarHeader>
        <SidebarBody>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <SidebarIcon><Home /></SidebarIcon>
              <SidebarLabel>Dashboard</SidebarLabel>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <SidebarIcon><Settings /></SidebarIcon>
              <SidebarLabel>Settings</SidebarLabel>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarBody>
      </SidebarContent>
    </Sidebar>
  );
};

// 2. Build your custom top bar content
const MyTopBarContent = () => {
  const { openSidePane } = useAppShell();
  return (
    <button onClick={() => openSidePane('details')} title="Open Details">
      <PanelRight />
    </button>
  );
};

// 3. Build your main content
const MyMainContent = () => {
  return (
    <div>
      <h1>Welcome to your Dashboard!</h1>
      <p>This is the main content area.</p>
    </div>
  );
};

// 4. Build your right pane
const MyRightPane = () => {
  return (
    <div>
      <h3>Details Panel</h3>
      <p>Contextual information goes here.</p>
    </div>
  );
};

// 5. Assemble the App Shell
export function YourAppComponent() {
  return (
    <AppShell
      sidebar={<MySidebar />}
      topBar={<TopBar><MyTopBarContent /></TopBar>}
      mainContent={<MainContent><MyMainContent /></MainContent>}
      rightPane={<RightPane>{<MyRightPane />}</RightPane>}
    />
  );
}
```

## Component API

### Layout Components

-   `<AppShellProvider>`: Wraps your app and provides the context for all hooks and components.
-   `<AppShell>`: The main container that orchestrates the layout. Requires `sidebar`, `topBar`, `mainContent`, and `rightPane` props.
-   `<TopBar>`: The header component. It's a container for your own controls and branding.
-   `<MainContent>`: The primary content area of your application.
-   `<RightPane>`: A panel that slides in from the right, perfect for details, forms, or secondary information.

### Sidebar Primitives

The sidebar is built using a set of highly composable components.

-   `<Sidebar>`: The root sidebar component.
-   `<SidebarContent>`: Wrapper for all sidebar content.
-   `<SidebarHeader>`, `<SidebarBody>`, `<SidebarFooter>`: Structural components to organize sidebar content.
-   `<SidebarTitle>`: The title of your app, automatically hidden when the sidebar is collapsed.
-   `<SidebarSection>`: A component to group menu items with an optional title.
-   `<SidebarMenuItem>`: A wrapper for a single menu item, including the button and potential actions.
-   `<SidebarMenuButton>`: The main clickable button for a menu item.
-   `<SidebarIcon>`, `<SidebarLabel>`, `<SidebarBadge>`, `<SidebarTooltip>`: Atomic parts of a menu item.

### Ready-to-use Components

-   `<UserDropdown>`: A pre-styled user profile dropdown menu.
-   `<WorkspaceSwitcher>`: A complete workspace/tenant switcher component.
-   `<PageHeader>`: A standardized header for your main content pages.
-   `<LoginPage>`: A beautiful, animated login page component.
-   `<CommandPalette>`: A powerful command palette for your application.

### UI Primitives

The library also exports a set of UI components (Button, Card, Badge, etc.) based on shadcn/ui. You can import them directly from `jeli-app-shell`.

## Hooks

-   `useAppShell()`: The primary hook to control the shell's state.
    -   `sidebarState`: Current state of the sidebar (`expanded`, `collapsed`, etc.).
    -   `bodyState`: Current body state (`normal`, `fullscreen`, `side_pane`).
    -   `toggleSidebar()`: Toggles the sidebar between expanded and collapsed.
    -   `openSidePane(content: string)`: Opens the right-hand pane.
    -   `closeSidePane()`: Closes the right-hand pane.
    -   `toggleFullscreen()`: Toggles fullscreen mode.
    -   `dispatch`: For more granular state control.
-   `useToast()`: A hook to display toast notifications.
    -   `show({ title, message, variant, ... })`

## Theming

Customizing the look and feel is straightforward. The library uses CSS variables for colors, border radius, etc., which you can override in your global CSS file.

**`index.css`**

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 262.1 83.3% 57.8%; /* New primary color: Violet */
    --primary-foreground: 210 40% 98%;
    --radius: 0.75rem; /* New border radius */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 262.1 83.3% 57.8%;
    --primary-foreground: 210 40% 98%;
  }
}
```

## Contributing

Contributions are welcome! Please read our [contributing guidelines](./CONTRIBUTING.md) to get started.

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.
````

## File: package.json
````json
{
  "name": "jeli-app-shell",
  "private": false,
  "version": "1.0.1",
  "type": "module",
  "files": [
    "dist"
  ],
  "main": "./dist/jeli-app-shell.umd.js",
  "module": "./dist/jeli-app-shell.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/jeli-app-shell.es.js",
      "require": "./dist/jeli-app-shell.umd.js"
    },
    "./dist/style.css": "./dist/style.css"
  },
  "sideEffects": [
    "**/*.css"
  ],
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {},
  "peerDependencies": {
    "@iconify/react": "^4.1.1",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "cmdk": "^0.2.0",
    "gsap": "^3.12.2",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "sonner": "^1.2.4",
    "tailwind-merge": "^2.0.0",
    "tailwindcss": "^3.3.5",
    "zustand": "^4.5.7"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.1.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5.2.2",
    "vite": "^4.5.0"
  }
}
````
