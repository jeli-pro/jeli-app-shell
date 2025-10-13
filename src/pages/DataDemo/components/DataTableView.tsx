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
import type { ViewProps, DataItem, SortableField } from '../types'
import { getStatusColor, getPriorityColor } from '../utils'
import { EmptyState } from './EmptyState'
import { capitalize } from '@/lib/utils'

export function DataTableView({ data, onItemSelect, selectedItem, sortConfig, onSort }: ViewProps) {
  const tableRef = useRef<HTMLTableElement>(null)
  const animatedItemsCount = useRef(0)

  useLayoutEffect(() => {
    if (tableRef.current) {
      // Only select item rows for animation, not group headers
      const newItems = Array.from( 
        tableRef.current.querySelectorAll('tbody tr')
      ).filter(tr => !tr.dataset.groupHeader)
       .slice(animatedItemsCount.current);
      gsap.fromTo(newItems,
        { y: 20, opacity: 0 },
        {
          duration: 0.5,
          y: 0,
          opacity: 1,
          stagger: 0.05,
          ease: "power2.out",
        },
      );
      animatedItemsCount.current = Array.isArray(data) 
        ? data.length 
        : Object.values(data).reduce((sum, items) => sum + items.length, 0);
    }
  }, [data]);

  const SortIcon = ({ field }: { field: SortableField }) => {
    if (sortConfig?.key !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp className="w-4 h-4 text-primary" />
    }
    if (sortConfig.direction === 'desc') {
      return <ArrowDown className="w-4 h-4 text-primary" />
    }
    return <ArrowUpDown className="w-4 h-4 opacity-50" />
  }

  const handleSortClick = (field: SortableField) => {
    onSort?.(field)
  }

  if ((Array.isArray(data) && data.length === 0) || (!Array.isArray(data) && Object.keys(data).length === 0)) {
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
                  onClick={() => handleSortClick('title')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Project
                  <SortIcon field="title" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSortClick('status')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Status
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSortClick('priority')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Priority
                  <SortIcon field="priority" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSortClick('assignee.name')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Assignee
                  <SortIcon field="assignee.name" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSortClick('metrics.completion')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Progress
                  <SortIcon field="metrics.completion" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSortClick('metrics.views')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Engagement
                  <SortIcon field="metrics.views" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">Last Updated</th>
              <th className="text-center p-4 font-semibold text-sm w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data)
              ? data.map(item => <TableRow key={item.id} item={item} isSelected={selectedItem?.id === item.id} onItemSelect={onItemSelect} />)
              : Object.entries(data).flatMap(([groupName, items]) => [
                  <tr key={groupName} data-group-header="true" className="sticky top-0 z-10">
                    <td colSpan={8} className="p-2 bg-muted/50 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{capitalize(groupName)}</h3>
                        <span className="text-xs px-2 py-0.5 bg-background rounded-full font-medium">{items.length}</span>
                      </div>
                    </td>
                  </tr>,
                  ...items.map(item => <TableRow key={item.id} item={item} isSelected={selectedItem?.id === item.id} onItemSelect={onItemSelect} />)
                ])
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TableRow({ item, isSelected, onItemSelect }: { item: DataItem; isSelected: boolean; onItemSelect: (item: DataItem) => void }) {
  return (
    <tr
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
}