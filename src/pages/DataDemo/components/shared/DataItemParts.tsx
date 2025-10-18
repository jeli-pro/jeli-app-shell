import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn, getStatusColor, getPriorityColor } from '@/lib/utils'
import { Clock, Eye, Heart, Share } from 'lucide-react'
import type { DataItem } from '../../types'

export function ItemStatusBadge({ status, className }: { status: DataItem['status']; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", getStatusColor(status), className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export function ItemPriorityBadge({ priority, className }: { priority: DataItem['priority']; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", getPriorityColor(priority), className)}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  )
}

export function AssigneeInfo({
  assignee,
  avatarClassName = "w-8 h-8",
  compact = false,
}: {
  assignee: DataItem['assignee']
  avatarClassName?: string
  compact?: boolean
}) {
  const avatar = (
    <Avatar className={cn("border-2 border-transparent group-hover:border-primary/50 transition-colors", avatarClassName)}>
      <AvatarImage src={assignee.avatar} alt={assignee.name} />
      <AvatarFallback>{assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
    </Avatar>
  )

  if (compact) {
    return avatar
  }

  return (
    <div className="flex items-center gap-2 group">
      {avatar}
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

export function ItemProgressBar({ completion, showPercentage }: { completion: number; showPercentage?: boolean }) {
  const bar = (
    <div className="w-full bg-muted rounded-full h-2.5">
      <div
        className="bg-gradient-to-r from-primary to-primary/80 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${completion}%` }}
      />
    </div>
  );

  if (!showPercentage) return bar;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">{bar}</div>
      <span className="text-sm font-medium text-muted-foreground">{completion}%</span>
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
  const MAX_TAGS = 2
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