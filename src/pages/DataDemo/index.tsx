import { useState, useRef, useEffect, useCallback } from 'react'
import { 
  Layers, 
  AlertTriangle, 
  PlayCircle, 
  TrendingUp,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PageLayout } from '@/components/shared/PageLayout'
import { DataViewModeSelector } from './components/DataViewModeSelector'
import { DataListView } from './components/DataListView'
import { DataCardView } from './components/DataCardView'
import { DataTableView } from './components/DataTableView'
import { DataDetailPanel } from './components/DataDetailPanel'
import { AnimatedLoadingSkeleton } from './components/AnimatedLoadingSkeleton'
import { StatChartCard } from './components/StatChartCard'
import { useAppShell } from '@/context/AppShellContext'
import { mockDataItems } from './data/mockData'
import { Card } from '@/components/ui/card'
import type { DataItem, ViewMode } from './types'

type Stat = {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down';
  type?: 'card';
};

type ChartStat = {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down';
  type: 'chart';
  chartData: number[];
};

type StatItem = Stat | ChartStat;

export default function DataDemoPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null)  
  const [items, setItems] = useState<DataItem[]>([])
  const [page, setPage] = useState(0) // Start at 0 to trigger initial load effect
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)
  const observer = useRef<IntersectionObserver>()
  const { openSidePane } = useAppShell()

  // Calculate stats from data
  const totalItems = mockDataItems.length
  const activeItems = mockDataItems.filter(item => item.status === 'active').length
  const highPriorityItems = mockDataItems.filter(item => item.priority === 'high' || item.priority === 'critical').length
  const avgCompletion = totalItems > 0 ? Math.round(
    mockDataItems.reduce((acc, item) => acc + item.metrics.completion, 0) / totalItems
  ) : 0

  // Infinite scroll logic
  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    if (page === 0) return;

    const fetchItems = async () => {
      setIsLoading(true);
      // Add a longer delay for the initial load to showcase the skeleton
      const delay = page === 1 ? 1500 : 500
      await new Promise(resolve => setTimeout(resolve, delay)); // Simulate network delay
      
      const pageSize = 12;
      const newItems = mockDataItems.slice((page - 1) * pageSize, page * pageSize);
      
      if (newItems.length > 0) {
        setItems(prev => [...prev, ...newItems]);
      }
      if (items.length + newItems.length >= mockDataItems.length) {
        setHasMore(false);
      }
      setIsLoading(false);
    };

    if (hasMore) fetchItems();
  }, [page]);

  const loaderRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const stats: StatItem[] = [
    {
      title: "Total Projects",
      value: totalItems.toString(),
      icon: <Layers className="w-5 h-5" />,
      change: "+5.2% this month",
      trend: "up" as const,
      type: 'chart',
      chartData: [120, 125, 122, 130, 135, 138, 142]
    },
    {
      title: "Active Projects",
      value: activeItems.toString(),
      icon: <PlayCircle className="w-5 h-5" />,
      change: "+2 this week", 
      trend: "up" as const,
      type: 'chart',
      chartData: [45, 50, 48, 55, 53, 60, 58]
    },
    {
      title: "High Priority",
      value: highPriorityItems.toString(),
      icon: <AlertTriangle className="w-5 h-5" />,
      change: "-1 from last week",
      trend: "down" as const,
      type: 'chart',
      chartData: [25, 26, 28, 27, 26, 24, 23]
    },
    {
      title: "Avg. Completion",
      value: `${avgCompletion}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      change: "+3.2%",
      trend: "up" as const,
      type: 'chart',
      chartData: [65, 68, 70, 69, 72, 75, 78]
    }
  ]

  useEffect(() => {
    // Initial load by setting page to 1
    setPage(1);
  }, []);

  // Handle item selection and open side panel
  const handleItemSelect = (item: DataItem) => {
    setSelectedItem(item)
    openSidePane('data-details')
  }

  const isInitialLoading = isLoading && items.length === 0

  const renderView = () => {
    const commonProps = {
      data: items,
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
              {isInitialLoading 
                ? "Loading projects..." 
                : `Showing ${items.length} of ${mockDataItems.length} items`}
            </p>
          </div>
          <DataViewModeSelector 
            viewMode={viewMode} 
            onChange={setViewMode}
          />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            if (stat.type === 'chart') {
              return (
                <StatChartCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  trend={stat.trend}
                  icon={stat.icon}
                  chartData={stat.chartData}
                />
              )
            }
            return (
              <Card
                key={stat.title}
                className="p-6 border-border/50 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    {stat.icon}
                  </div>
                  <div className={cn("text-sm font-medium", stat.trend === 'up' ? "text-green-600" : "text-red-600")}>
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                </div>
              </Card>
            )
          })}
        </div>

        <div ref={contentRef} className="min-h-[500px]">
          {isInitialLoading ? <AnimatedLoadingSkeleton viewMode={viewMode} /> : renderView()}
        </div>

        {/* Loader for infinite scroll */}
        <div ref={loaderRef} className="flex justify-center items-center py-6">
          {isLoading && !isInitialLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more...</span>
            </div>
          )}
          {!isLoading && !hasMore && items.length > 0 && !isInitialLoading && (
            <p className="text-muted-foreground">You've reached the end.</p>
          )}
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