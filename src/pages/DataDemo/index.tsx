import { useRef, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import {
  Layers, 
  AlertTriangle, 
  PlayCircle, 
  Loader2,
  TrendingUp,
  CheckCircle,
  Clock,
  Archive,
  PlusCircle
} from 'lucide-react'
import { gsap } from 'gsap'
import { DynamicViewProvider } from '@/features/dynamic-view/DynamicViewContext'
import { PageLayout } from '@/components/shared/PageLayout'
import { useScrollToBottom } from '@/hooks/useScrollToBottom.hook';
import { ScrollToBottomButton } from '@/components/shared/ScrollToBottomButton';
import { ListView } from '@/features/dynamic-view/components/views/ListView'
import { CardView } from '@/features/dynamic-view/components/views/CardView'
import { TableView } from '@/features/dynamic-view/components/views/TableView'
import { KanbanView } from '@/features/dynamic-view/components/views/KanbanView'
import { CalendarView } from '@/features/dynamic-view/components/views/CalendarView'
import { ViewModeSelector } from '@/features/dynamic-view/components/controls/ViewModeSelector'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { StatCard } from '@/components/shared/StatCard'
import { AnimatedLoadingSkeleton } from '@/features/dynamic-view/components/shared/AnimatedLoadingSkeleton'
import { ViewControls } from '@/features/dynamic-view/components/controls/ViewControls'
import { mockDataItems } from './data/mockData'
import type { GroupableField, GenericItem } from '@/features/dynamic-view/types'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import { useAutoAnimateStats } from './hooks/useAutoAnimateStats.hook'
import { useDataDemoStore } from './store/dataDemo.store'
import { capitalize, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { 
} from './store/dataDemo.store'

import { dataDemoViewConfig } from './DataDemo.config';

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
  const {
    viewMode,
    groupBy,
    activeGroupTab,
    setGroupBy,
    setSort,
    setActiveGroupTab,
    page,
    filters,
    sortConfig,
    setPage,
  } = useAppViewManager();

  const { items: allItems, hasMore, isLoading, isInitialLoading, totalItemCount, loadData } = useDataDemoStore(state => ({
    items: state.items,
    hasMore: state.hasMore,
    isLoading: state.isLoading,
    isInitialLoading: state.isInitialLoading,
    totalItemCount: state.totalItemCount,
    loadData: state.loadData,
  }));

  // --- Start of logic moved from store selectors ---
  const groupTabs = useMemo(() => {
    if (groupBy === 'none' || !allItems.length) return [];
    
    const groupCounts = allItems.reduce((acc, item) => {
        const groupKey = String(item[groupBy as GroupableField]);
        acc[groupKey] = (acc[groupKey] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const sortedGroups = Object.keys(groupCounts).sort((a, b) => a.localeCompare(b));

    const createLabel = (text: string, count: number, isActive: boolean): ReactNode => (
        <>
            {text}
            <Badge variant={isActive ? 'default' : 'secondary'} className={cn('transition-colors duration-300 text-xs font-semibold', !isActive && 'group-hover:bg-accent group-hover:text-accent-foreground')}>
                {count}
            </Badge>
        </>
    );
    
    const totalCount = allItems.length;

    return [
        { id: 'all', label: createLabel('All', totalCount, activeGroupTab === 'all') },
        ...sortedGroups.map((g) => ({
            id: g,
            label: createLabel(capitalize(g), groupCounts[g], activeGroupTab === g),
        })),
    ];
  }, [allItems, groupBy, activeGroupTab]);

  const groupedData = useMemo(() => {
    if (groupBy === 'none') {
        return null;
    }
    return allItems.reduce((acc, item) => {
        const groupKey = String(item[groupBy as GroupableField]) || 'N/A';
        if (!acc[groupKey]) {
            acc[groupKey] = [] as GenericItem[];
        }
        acc[groupKey].push(item);
        return acc;
    }, {} as Record<string, GenericItem[]>);
  }, [allItems, groupBy]);
  const dataToRender = useMemo(() => {
    if (groupBy === 'none' || activeGroupTab === 'all' || !groupedData) {
      return allItems;
    }
    return groupedData[activeGroupTab] || [];
  }, [groupBy, activeGroupTab, allItems, groupedData]);
  // --- End of logic moved from store selectors ---


  const statsRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null);

  // Note: The `DynamicViewProvider` needs `GenericItem[]`. 
  // Our store uses `GenericItem` so no cast is needed.
  const genericItems: GenericItem[] = allItems;
  // Auto-hide stats container on scroll down
  useAutoAnimateStats(scrollRef, statsRef);

  // Calculate stats from data
  const totalItems = mockDataItems.length
  const { showScrollToBottom, scrollToBottom, handleScroll } = useScrollToBottom(scrollRef);

  const activeItems = mockDataItems.filter(item => item.status === 'active').length
  const highPriorityItems = mockDataItems.filter(item => item.priority === 'high' || item.priority === 'critical').length
  const avgCompletion = totalItems > 0 ? Math.round(
    mockDataItems.reduce((acc, item) => acc + item.metrics.completion, 0) / totalItems
  ) : 0

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
      chartData: [65, 68, 70, 69, 72, 75, 78],
    },
    {
      title: "Completion Rate",
      value: "88%",
      icon: <CheckCircle className="w-5 h-5" />,
      change: "+1.5% this month",
      trend: "up" as const,
      type: 'chart',
      chartData: [80, 82, 81, 84, 85, 87, 88],
    },
    {
      title: "Overdue Items",
      value: "8",
      icon: <Clock className="w-5 h-5" />,
      change: "-3 this week",
      trend: "down" as const,
    },
    {
      title: "New This Week",
      value: "12",
      icon: <PlusCircle className="w-5 h-5" />,
      change: "+2 from last week",
      trend: "up" as const,
    },
    {
      title: "Archived Projects",
      value: "153",
      icon: <Archive className="w-5 h-5" />,
      change: "+20 this month",
      trend: "up" as const,
    }
  ]

  useEffect(() => {
    // Animate stats cards in
    if (!isInitialLoading && statsRef.current) {
      gsap.fromTo(statsRef.current.children,
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
  }, [isInitialLoading]);

  useEffect(() => {
    loadData({
      page,
      groupBy,
      filters,
      sortConfig,
      isFullLoad: viewMode === 'calendar' || viewMode === 'kanban',
    });
  }, [page, groupBy, filters, sortConfig, loadData, viewMode]);

  const observer = useRef<IntersectionObserver>();
  const loaderRef = useCallback(
    (node: Element | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, page, setPage],
  );
  
  // Auto-group by status when switching to kanban view for the first time
  useEffect(() => {
    if (viewMode === 'kanban' && groupBy === 'none') {
      setGroupBy('status');
      setSort(null); // Kanban is manually sorted, so disable programmatic sort
    }
    // For calendar view, we don't want grouping.
    if (viewMode === 'calendar' && groupBy !== 'none') {
      setGroupBy('none');
    }
  }, [viewMode, groupBy, setGroupBy, setSort]);

  const renderViewForData = useCallback((data: GenericItem[]) => {
    const items = data as GenericItem[];
    switch (viewMode) {
        case 'table': return <TableView data={items} />;
        case 'cards': return <CardView data={items} />;
        case 'calendar': return null; // Calendar has its own render path below
        case 'kanban': return null; // Kanban has its own render path below
        case 'grid': return <CardView data={items} isGrid />;
        case 'list': default: return <ListView data={items} />;
    }
  }, [viewMode]);

  const isGroupedView = useMemo(() => 
    groupBy !== 'none' && groupTabs.length > 1 && groupedData,
  [groupBy, groupTabs.length, groupedData]);


  return (
    <DynamicViewProvider viewConfig={dataDemoViewConfig} data={genericItems}>
      <PageLayout
        scrollRef={scrollRef}
        onScroll={handleScroll}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold tracking-tight">Data Showcase</h1>
                <p className="text-muted-foreground">
                  {isInitialLoading 
                    ? "Loading projects..." 
                    : `Showing ${dataToRender.length} of ${totalItemCount} item(s)`}
                </p>
              </div>
              <ViewModeSelector />
            </div>
            <ViewControls />
          </div>

          {/* Stats Section */}
          {!isInitialLoading && (
            <div ref={statsRef} className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
              {stats.map((stat) => (
                <StatCard
                  className="w-64 md:w-72 flex-shrink-0"
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  trend={stat.trend}
                  icon={stat.icon}
                  chartData={stat.type === 'chart' ? stat.chartData : undefined}
                />
              ))}
            </div>
          )}

        <div className="min-h-[500px]">
          {isInitialLoading ? (
            <AnimatedLoadingSkeleton viewMode={viewMode} />
          ) : viewMode === 'calendar' ? (
            <CalendarView data={genericItems} />
          ) : viewMode === 'kanban' ? (
            isGroupedView ? (
              <KanbanView data={groupedData as Record<string, GenericItem[]>} />
            ) : (
              <div className="flex items-center justify-center h-96 text-muted-foreground">
                Group data by a metric to use the Kanban view.
              </div>
            )
          ) : !isGroupedView ? (
            renderViewForData(allItems)
          ) : (
            // Grouped view with AnimatedTabs
            <div className="relative">
              <AnimatedTabs
                tabs={groupTabs}
                activeTab={activeGroupTab}
                onTabChange={setActiveGroupTab}
                wrapperClassName="flex flex-col"
                className="border-b"
                contentClassName="pt-6 flex-grow"
              >
                {groupTabs.map(tab => (
                  <div key={tab.id} className="min-h-[440px]">
                    {renderViewForData(
                      tab.id === 'all' ? allItems : groupedData?.[tab.id] || []
                    )}
                  </div>
                ))}
              </AnimatedTabs>
            </div>
          )}
        </div>

        {/* Loader for infinite scroll */}
        <div ref={loaderRef} className="flex justify-center items-center py-6">
          {isLoading && !isInitialLoading && groupBy === 'none' && viewMode !== 'calendar' && viewMode !== 'kanban' && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more...</span>
            </div>
          )}
          {!isLoading && !hasMore && dataToRender.length > 0 && !isInitialLoading && groupBy === 'none' && viewMode !== 'calendar' && viewMode !== 'kanban' && (
            <p className="text-muted-foreground">You've reached the end.</p>
          )}
        </div>
      </div>
        <ScrollToBottomButton isVisible={showScrollToBottom} onClick={scrollToBottom} />
      </PageLayout>
    </DynamicViewProvider>
  );
}