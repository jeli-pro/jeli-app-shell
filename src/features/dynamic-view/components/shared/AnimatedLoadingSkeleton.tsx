import { type ViewMode } from '../../types'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function AnimatedLoadingSkeleton({ viewMode }: { viewMode: ViewMode }) {
  const renderSkeleton = () => {
    switch (viewMode) {
      case 'table':
        return (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        )
      case 'list':
        return (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        )
      case 'grid':
      case 'cards':
        return (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-12 w-12 rounded-lg" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )
        case 'kanban':
            return (
              <div className="flex items-start gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-80 flex-shrink-0 space-y-4">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ))}
              </div>
            )
        case 'calendar':
            return (
              <div className="space-y-4">
                  <div className="flex justify-between">
                      <Skeleton className="h-8 w-48" />
                      <Skeleton className="h-8 w-32" />
                  </div>
                <Skeleton className="h-[600px] w-full" />
              </div>
            )
      default:
        return <div>Loading...</div>
    }
  }

  return <div>{renderSkeleton()}</div>
}