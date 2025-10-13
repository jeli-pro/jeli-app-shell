import { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Layers, 
  AlertTriangle, 
  PlayCircle, 
  TrendingUp,
  Loader2,
  ChevronsUpDown
} from 'lucide-react'
import { gsap } from 'gsap'
import { capitalize, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { PageLayout } from '@/components/shared/PageLayout'
import { DataListView } from './components/DataListView'
import { DataCardView } from './components/DataCardView'
import { DataTableView } from './components/DataTableView'
import { DataViewModeSelector } from './components/DataViewModeSelector'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { AnimatedLoadingSkeleton } from './components/AnimatedLoadingSkeleton'
import { StatChartCard } from './components/StatChartCard'
import { DataToolbar, FilterConfig } from './components/DataToolbar'
import { mockDataItems } from './data/mockData'
import type { DataItem, ViewMode, SortConfig, SortableField, GroupableField } from './types'

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
  const [searchParams, setSearchParams] = useSearchParams()

  // Derive state from URL search params
  const viewMode = useMemo(() => (searchParams.get('view') as ViewMode) || 'list', [searchParams])
  const page = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams])
  const groupBy = useMemo(() => (searchParams.get('groupBy') as GroupableField | 'none') || 'none', [searchParams])
  const activeGroupTab = useMemo(() => searchParams.get('tab') || 'all', [searchParams])

  const filters = useMemo<FilterConfig>(() => ({
    searchTerm: searchParams.get('q') || '',
    status: (searchParams.get('status')?.split(',') || []).filter(Boolean) as Status[],
    priority: (searchParams.get('priority')?.split(',') || []).filter(Boolean) as Priority[],
  }), [searchParams])

  const sortConfig = useMemo<SortConfig | null>(() => {
    const sortParam = searchParams.get('sort');
    if (!sortParam) return { key: 'updatedAt', direction: 'desc' }; // Default sort
    if (sortParam === 'default') return null;
    
    const [key, direction] = sortParam.split('-');
    return { key: key as SortableField, direction: direction as 'asc' | 'desc' };
  }, [searchParams])

  // Centralized handler for updating URL search params
  const handleParamsChange = useCallback(
    (newParams: Record<string, string | string[] | null | undefined>) => {
      setSearchParams(
        (prev) => {
          const updated = new URLSearchParams(prev);
          let pageReset = false;

          for (const [key, value] of Object.entries(newParams)) {
            const isFilterOrSort = ['q', 'status', 'priority', 'sort', 'groupBy'].includes(key);
            
            if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || value === '') {
              updated.delete(key);
            } else if (Array.isArray(value)) {
              updated.set(key, value.join(','));
            } else {
              updated.set(key, String(value));
            }
            
            if (isFilterOrSort) {
              pageReset = true;
            }
          }

          if (pageReset) {
            updated.delete('page');
          }
          if ('groupBy' in newParams) {
            updated.delete('tab');
          }

          return updated;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const groupOptions: { id: GroupableField | 'none'; label: string }[] = [
    { id: 'none', label: 'None' }, { id: 'status', label: 'Status' }, { id: 'priority', label: 'Priority' }, { id: 'category', label: 'Category' }
  ]
  const [items, setItems] = useState<DataItem[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const observer = useRef<IntersectionObserver>()
  const navigate = useNavigate()
  const { itemId } = useParams<{ itemId: string }>()

  const handleItemSelect = (item: DataItem) => {
    navigate(`/data-demo/${item.id}`)
  }

  const selectedItem = useMemo(() => {
    if (!itemId) return null
    return mockDataItems.find(item => item.id === itemId) ?? null
  }, [itemId])

  const isInitialLoading = isLoading && items.length === 0

  // Step 1: Centralized data filtering and sorting from the master list
  const filteredAndSortedData = useMemo(() => {
    let filteredItems = mockDataItems.filter(item => {
      const searchTermMatch =
        item.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.searchTerm.toLowerCase())

      const statusMatch = filters.status.length === 0 || filters.status.includes(item.status)
      const priorityMatch = filters.priority.length === 0 || filters.priority.includes(item.priority)

      return searchTermMatch && statusMatch && priorityMatch
    })

    if (sortConfig) {
      filteredItems.sort((a, b) => {
        let aValue: any
        let bValue: any

        const getNestedValue = (obj: any, path: string) => path.split('.').reduce((o, k) => (o || {})[k], obj)

        aValue = getNestedValue(a, sortConfig.key)
        bValue = getNestedValue(b, sortConfig.key)

        if (aValue === undefined || bValue === undefined) return 0;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
        }
        // Date sorting (assuming ISO strings)
        if (sortConfig.key === 'updatedAt' || sortConfig.key === 'createdAt') {
            return sortConfig.direction === 'asc'
                ? new Date(aValue).getTime() - new Date(aValue).getTime()
                : new Date(bValue).getTime() - new Date(bValue).getTime()
        }
        return 0
      })
    }

    return filteredItems;
  }, [filters, sortConfig]);


  // Data loading effect
  useEffect(() => {
    setIsLoading(true);
    const isFirstPage = page === 1;

    const loadData = () => {
      if (groupBy !== 'none') {
        // For grouped views, load all data at once, pagination is disabled.
        setItems(filteredAndSortedData);
        setHasMore(false);
        setIsLoading(false);
        return;
      }
      
      // Handle paginated view
      const pageSize = 12;
      const newItems = filteredAndSortedData.slice((page - 1) * pageSize, page * pageSize);
      
      setTimeout(() => {
        // Double-check in case groupBy changed during the timeout
        if (groupBy === 'none') {
          setItems(prev => isFirstPage ? newItems : [...prev, ...newItems]);
          setHasMore(filteredAndSortedData.length > page * pageSize);
          setIsLoading(false);
        }
      }, isFirstPage && items.length === 0 ? 1500 : 500); // Longer delay for initial skeleton
    };

    loadData();
  }, [searchParams, filteredAndSortedData]); // Reacts to any URL change

  const loaderRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        // Instead of setting local state, we update the URL, which triggers the data loading effect.
        handleParamsChange({ page: (page + 1).toString() })
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, page, handleParamsChange]);

  // Calculate stats from data
  const totalItems = mockDataItems.length
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
      chartData: [65, 68, 70, 69, 72, 75, 78]
    }
  ]

  useEffect(() => {
    // Animate stats cards in
    if (!isInitialLoading && statsRef.current) {
      gsap.fromTo(statsRef.current.children,
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
  }, [isInitialLoading])

  const handleSortChange = (config: SortConfig | null) => {
    if (!config) {
      handleParamsChange({ sort: 'default' });
    } else {
      handleParamsChange({ sort: `${config.key}-${config.direction}` });
    }
  }

  // For table view header clicks
  const handleTableSort = (field: SortableField) => {
    if (sortConfig?.key === field) {
      if (sortConfig.direction === 'desc') {
        // Cycle: desc -> asc
        handleParamsChange({ sort: `${field}-asc` });
      } else {
        // Cycle: asc -> default (by removing param)
        handleParamsChange({ sort: 'default' });
      }
    } else {
      // New field, default to desc
      handleParamsChange({ sort: `${field}-desc` });
    }
  }

  const handleFilterChange = (newFilters: FilterConfig) => {
    handleParamsChange({ q: newFilters.searchTerm, status: newFilters.status, priority: newFilters.priority });
  }

  const groupTabs = useMemo(() => {
    if (groupBy === 'none' || !filteredAndSortedData.length) return []

    const groupCounts = filteredAndSortedData.reduce((acc, item) => {
      const groupKey = String(item[groupBy as GroupableField])
      acc[groupKey] = (acc[groupKey] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const sortedGroups = Object.keys(groupCounts).sort((a, b) => a.localeCompare(b))

    const createLabel = (text: string, count: number, isActive: boolean) => (
      <>
        {text}
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={cn(
            "transition-colors duration-300 text-xs font-semibold",
            !isActive && "group-hover:bg-accent group-hover:text-accent-foreground"
          )}
        >
          {count}
        </Badge>
      </>
    )

    return [
      { id: 'all', label: createLabel('All', filteredAndSortedData.length, activeGroupTab === 'all') },
      ...sortedGroups.map(g => ({
        id: g,
        label: createLabel(capitalize(g), groupCounts[g], activeGroupTab === g),
      })),
    ]
  }, [filteredAndSortedData, groupBy, activeGroupTab]);

  // Data to be rendered in the current view, after grouping and tab selection is applied
  const dataToRender = useMemo(() => {
    if (groupBy === 'none') {
      return items; // This is the paginated list.
    }
    
    // When grouped, `items` contains ALL filtered/sorted data.
    if (activeGroupTab === 'all') {
      return items;
    }
    return items.filter(item => String(item[groupBy as GroupableField]) === activeGroupTab);
  }, [items, groupBy, activeGroupTab]);

  const commonViewProps = {
    onItemSelect: handleItemSelect,
    selectedItem,
  };

  const totalItemCount = filteredAndSortedData.length;

  return (
    <PageLayout
      // Note: Search functionality is handled by a separate SearchBar in the TopBar
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">Data Showcase</h1>
            <p className="text-muted-foreground">
              {isInitialLoading 
                ? "Loading projects..." 
                : `Showing ${dataToRender.length} of ${totalItemCount} item(s)`}
            </p>
          </div>
          <DataViewModeSelector viewMode={viewMode} onChange={(mode) => handleParamsChange({ view: mode })} />
        </div>

        {/* Stats Section */}
        {!isInitialLoading && (
          <div ref={statsRef} className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
            {stats.map((stat) =>
              stat.type === 'chart' ? (
                <StatChartCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  trend={stat.trend}
                  icon={stat.icon}
                  chartData={stat.chartData}
                />
              ) : null
            )}
          </div>
        )}

        {/* Controls Area */}
        <div className="space-y-6">
          <DataToolbar
            filters={filters}
            onFiltersChange={handleFilterChange}
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Group by and Tabs section */}
        <div className={cn(
          "flex items-center justify-between gap-4",
          groupBy !== 'none' && "border-b"
        )}>
          {/* Tabs on the left, takes up available space */}
          <div className="flex-grow overflow-x-auto overflow-y-hidden no-scrollbar">
            {groupBy !== 'none' && groupTabs.length > 1 ? (
              <AnimatedTabs
                tabs={groupTabs}
                activeTab={activeGroupTab}
                onTabChange={(tab) => handleParamsChange({ tab: tab === 'all' ? null : tab })}
              />
            ) : (
              <div className="h-[68px]" /> // Placeholder for consistent height.
            )}
          </div>
          
          {/* Group by dropdown on the right */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-medium text-muted-foreground shrink-0">Group by:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-between">
                  {groupOptions.find(o => o.id === groupBy)?.label}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[180px]">
                <DropdownMenuRadioGroup value={groupBy} onValueChange={(val) => handleParamsChange({ groupBy: val === 'none' ? null : val })}>
                  {groupOptions.map(option => (
                    <DropdownMenuRadioItem key={option.id} value={option.id}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div ref={contentRef} className="min-h-[500px]">
          {isInitialLoading ? <AnimatedLoadingSkeleton viewMode={viewMode} /> : (
            <div>
              {viewMode === 'table' ? (
                 <DataTableView 
                    data={dataToRender} 
                    {...commonViewProps}
                    sortConfig={sortConfig} 
                    onSort={handleTableSort} 
                  />
              ) : (
                <>
                  {viewMode === 'list' && <DataListView data={dataToRender} {...commonViewProps} />}
                  {viewMode === 'cards' && <DataCardView data={dataToRender} {...commonViewProps} />}
                  {viewMode === 'grid' && <DataCardView data={dataToRender} {...commonViewProps} isGrid />}
                </>
              )}
            </div>
          )}
        </div>

        {/* Loader for infinite scroll */}
        <div ref={loaderRef} className="flex justify-center items-center py-6">
          {isLoading && !isInitialLoading && groupBy === 'none' && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more...</span>
            </div>
          )}
          {!isLoading && !hasMore && items.length > 0 && !isInitialLoading && groupBy === 'none' && (
            <p className="text-muted-foreground">You've reached the end.</p>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
