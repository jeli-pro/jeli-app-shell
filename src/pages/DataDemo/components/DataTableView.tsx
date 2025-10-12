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