import { useMemo, useCallback, type ReactNode, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import { DynamicViewProvider } from '@/features/dynamic-view/DynamicViewContext';
import type { ViewConfig, GenericItem, ViewMode, FilterConfig, SortConfig, CalendarDateProp, CalendarDisplayProp, CalendarColorProp, StatItem, GroupableField } from './types';
import { ViewControls } from './components/controls/ViewControls';
import { ViewModeSelector } from './components/controls/ViewModeSelector';
import { AnimatedLoadingSkeleton } from './components/shared/AnimatedLoadingSkeleton';
import { ListView } from './components/views/ListView';
import { CardView } from './components/views/CardView';
import { TableView } from './components/views/TableView';
import { KanbanView } from './components/views/KanbanView';
import { CalendarView } from './components/views/CalendarView';
import { EmptyState } from './components/shared/EmptyState';
import { useAutoAnimateStats } from '@/hooks/useAutoAnimateStats.hook';
import { StatCard } from '@/components/shared/StatCard';

// Define the props for the controlled DynamicView component
export interface DynamicViewProps<TFieldId extends string, TItem extends GenericItem> {
  // Config
  viewConfig: ViewConfig<TFieldId, TItem>;
  
  // Data & State
  items: TItem[];
  isLoading: boolean;
  isInitialLoading: boolean;
  totalItemCount: number;
  hasMore: boolean;
  
  // Controlled State Props
  viewMode: ViewMode;
  filters: FilterConfig;
  sortConfig: SortConfig<TFieldId> | null;
  groupBy: GroupableField<TFieldId>;
  activeGroupTab: string;
  page: number;
  selectedItemId?: string;
  // Calendar-specific state
  calendarDateProp?: CalendarDateProp<TFieldId>;
  calendarDisplayProps?: CalendarDisplayProp<TFieldId>[];
  calendarItemLimit?: 'all' | number;
  calendarColorProp?: CalendarColorProp<TFieldId>;
  calendarDate?: Date;
  statsData?: StatItem[];

  // State Change Callbacks
  onViewModeChange: (mode: ViewMode) => void;
  onFiltersChange: (filters: FilterConfig) => void;
  onSortChange: (sort: SortConfig<TFieldId> | null) => void;
  onGroupByChange: (group: GroupableField<TFieldId>) => void;
  onActiveGroupTabChange: (tab: string) => void;
  onPageChange: (page: number) => void;
  onItemSelect: (item: TItem) => void;
  onItemUpdate?: (itemId: string, updates: Partial<TItem>) => void;
  // Calendar-specific callbacks
  onCalendarDatePropChange?: (prop: CalendarDateProp<TFieldId>) => void;
  onCalendarDisplayPropsChange?: (props: CalendarDisplayProp<TFieldId>[]) => void;
  onCalendarItemLimitChange?: (limit: 'all' | number) => void;
  onCalendarColorPropChange?: (prop: CalendarColorProp<TFieldId>) => void;
  onCalendarDateChange?: (date: Date) => void;
  
  // Custom Renderers
  renderHeaderControls?: () => ReactNode;
  renderCta?: (viewMode: ViewMode, ctaProps: { colSpan?: number }) => ReactNode;
  loaderRef?: React.Ref<HTMLDivElement>;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

export function DynamicView<TFieldId extends string, TItem extends GenericItem>({ viewConfig, ...rest }: DynamicViewProps<TFieldId, TItem>) {
  
  const { viewMode, isInitialLoading, isLoading, hasMore, items, groupBy, statsData, scrollContainerRef } = rest;
  const statsRef = useRef<HTMLDivElement>(null);

  // Auto-hide stats container on scroll down
  useAutoAnimateStats(scrollContainerRef!, statsRef);

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

  const groupedData = useMemo(() => {
    if (groupBy === 'none' || viewMode !== 'kanban') {
        return null;
    }
    return (items as TItem[]).reduce((acc, item) => {
        const groupValue = item[groupBy as keyof TItem];
        const groupKey = (groupValue === null || groupValue === undefined || groupValue === '') ? 'N/A' : String(groupValue);
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(item);
        return acc;
    }, {} as Record<string, TItem[]>);
  }, [items, groupBy, viewMode]);

  const renderViewForData = useCallback((data: TItem[], cta: ReactNode) => {
    switch (viewMode) {
        case 'table': return <TableView data={data} ctaElement={cta} />;
        case 'cards': return <CardView data={data} ctaElement={cta} />;
        case 'grid': return <CardView data={data} isGrid ctaElement={cta} />;
        case 'list': default: return <ListView data={data} ctaElement={cta} />;
    }
  }, [viewMode]);

  const renderContent = () => {
    if (isInitialLoading) {
      return <AnimatedLoadingSkeleton viewMode={viewMode} />;
    }

    if (viewMode === 'calendar') {
        return <CalendarView data={items} />;
    }

    if (viewMode === 'kanban') {
        return groupedData ? (
          <KanbanView data={groupedData} />
        ) : (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            Group data by a metric to use the Kanban view.
          </div>
        );
    }
    
    if (items.length === 0 && !isInitialLoading) {
        return <EmptyState />;
    }
    
    const ctaProps = {
        colSpan: viewMode === 'table' ? viewConfig.tableView.columns.length + 1 : undefined,
    };
    const ctaElement = rest.renderCta
        ? rest.renderCta(viewMode, ctaProps)
        : null;
    
    // This will be expanded later to handle group tabs
    return renderViewForData(items, ctaElement);
  };

  return (
    <DynamicViewProvider<TFieldId, TItem> viewConfig={viewConfig} {...rest}>
      <div className="space-y-6">
          <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                      {rest.renderHeaderControls ? rest.renderHeaderControls() : (
                          <>
                              <h1 className="text-2xl font-bold tracking-tight">Data Showcase</h1>
                              <p className="text-muted-foreground">
                                  {isInitialLoading 
                                      ? "Loading projects..." 
                                      : `Showing ${items.length} of ${rest.totalItemCount} item(s)`}
                              </p>
                          </>
                      )}
                  </div>
                  <ViewModeSelector />
              </div>
              <ViewControls />
          </div>

          {!isInitialLoading && statsData && statsData.length > 0 && (
            <div ref={statsRef} className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
              {statsData.map((stat) => (
                <StatCard
                  className="w-64 md:w-72 flex-shrink-0"
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  trend={stat.trend}
                  icon={stat.icon}
                  chartData={stat.chartData}
                />
              ))}
            </div>
          )}
          
          <div className="min-h-[500px]">
              {renderContent()}
          </div>

          {/* Loader for infinite scroll */}
          <div ref={rest.loaderRef} className="flex justify-center items-center py-6">
            {isLoading && !isInitialLoading && groupBy === 'none' && viewMode !== 'calendar' && viewMode !== 'kanban' && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading more...</span>
              </div>
            )}
            {!isLoading && !hasMore && items.length > 0 && !isInitialLoading && groupBy === 'none' && viewMode !== 'calendar' && viewMode !== 'kanban' && (
              <p className="text-muted-foreground">You've reached the end.</p>
            )}
          </div>
      </div>
    </DynamicViewProvider>
  );
}