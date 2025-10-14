import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn, getStatusColor, getPriorityColor } from '@/lib/utils'
import { Clock, Eye, Heart, Share } from 'lucide-react'
import type { DataItem } from '../../types'

export function ItemStatusBadge({ status }: { status: DataItem['status'] }) {
  return (
    <Badge variant="outline" className={cn("font-medium", getStatusColor(status))}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export function ItemPriorityBadge({ priority }: { priority: DataItem['priority'] }) {
  return (
    <Badge variant="outline" className={cn("font-medium", getPriorityColor(priority))}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  )
}

export function AssigneeInfo({
  assignee,
  avatarClassName = "w-8 h-8",
}: {
  assignee: DataItem['assignee']
  avatarClassName?: string
}) {
  return (
    <div className="flex items-center gap-2 group">
      <Avatar className={cn("border-2 border-transparent group-hover:border-primary/50 transition-colors", avatarClassName)}>
        <AvatarImage src={assignee.avatar} alt={assignee.name} />
        <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="font-medium text-sm truncate">{assignee.name}</p>
        <p className="text-xs text-muted-foreground truncate">{assignee.email}</p>
      </div>
    </div>
  )
}

export function ItemMetrics({ metrics }: { metrics: DataItem['metrics'] }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-1"><Eye className="w-4 h-4" /> {metrics.views}</div>
      <div className="flex items-center gap-1"><Heart className="w-4 h-4" /> {metrics.likes}</div>
      <div className="flex items-center gap-1"><Share className="w-4 h-4" /> {metrics.shares}</div>
    </div>
  )
}

export function ItemProgressBar({ completion }: { completion: number }) {
  return (
    <div className="w-full bg-muted rounded-full h-2.5">
      <div
        className="bg-gradient-to-r from-primary to-primary/80 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${completion}%` }}
      />
    </div>
  )
}

export function ItemDateInfo({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Clock className="w-4 h-4" />
      <span>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
    </div>
  )
}

export function ItemTags({ tags }: { tags: string[] }) {
  const MAX_TAGS = 3
  const remainingTags = tags.length - MAX_TAGS
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {tags.slice(0, MAX_TAGS).map(tag => (
        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
      ))}
      {remainingTags > 0 && (
        <Badge variant="outline" className="text-xs">+{remainingTags}</Badge>
      )}
    </div>
  )
}