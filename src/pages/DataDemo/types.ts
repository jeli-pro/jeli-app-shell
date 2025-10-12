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