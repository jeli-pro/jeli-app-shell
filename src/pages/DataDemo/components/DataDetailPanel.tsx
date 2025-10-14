import React, { useRef } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
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
import type { DataItem } from '../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import { getStatusColor, getPriorityColor } from '../utils'

interface DataDetailPanelProps {
  item: DataItem | null
  onClose: () => void
}

export function DataDetailPanel({ item, onClose }: DataDetailPanelProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  useStaggeredAnimation(contentRef, [item]);

  if (!item) {
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
        <Button variant="ghost" onClick={onClose} className="mb-4 -ml-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to list
        </Button>
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
            <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-4">
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