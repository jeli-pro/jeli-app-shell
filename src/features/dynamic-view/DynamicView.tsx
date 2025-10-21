import { useMemo, useCallback, type ReactNode } from 'react';
import { DynamicViewProvider } from '@/features/dynamic-view/DynamicViewContext';
import type { ViewConfig, GenericItem, ViewMode, FilterConfig, SortConfig, CalendarDateProp, CalendarDisplayProp, CalendarColorProp } from './types';
import { ViewControls } from './components/controls/ViewControls';
import { ViewModeSelector } from './components/controls/ViewModeSelector';
import { AnimatedLoadingSkeleton } from './components/shared/AnimatedLoadingSkeleton';
import { ListView } from './components/views/ListView';
import { CardView } from './components/views/CardView';
import { TableView } from './components/views/TableView';
import { KanbanView } from './components/views/KanbanView';
import { CalendarView } from './components/views/CalendarView';
import { EmptyState } from './components/shared/EmptyState';

// Define the props for the controlled DynamicView component
export interface DynamicViewProps {
  // Config
  viewConfig: ViewConfig;
  
  // Data & State
  items: GenericItem[];
  isLoading: boolean;
  isInitialLoading: boolean;
  totalItemCount: number;
  hasMore: boolean;
  
  // Controlled State Props
  viewMode: ViewMode;
  filters: FilterConfig;
  sortConfig: SortConfig | null;
  groupBy: string;
  activeGroupTab: string;
  page: number;
  selectedItemId?: string;
  // Calendar-specific state
  calendarDateProp?: CalendarDateProp;
  calendarDisplayProps?: CalendarDisplayProp[];
  calendarItemLimit?: 'all' | number;
  calendarColorProp?: CalendarColorProp;

  // State Change Callbacks
  onViewModeChange: (mode: ViewMode) => void;
  onFiltersChange: (filters: FilterConfig) => void;
  onSortChange: (sort: SortConfig | null) => void;
  onGroupByChange: (group: string) => void;
  onActiveGroupTabChange: (tab: string) => void;
  onPageChange: (page: number) => void;
  onItemSelect: (item: GenericItem) => void;
  onItemUpdate?: (itemId: string, updates: Partial<GenericItem>) => void;
  // Calendar-specific callbacks
  onCalendarDatePropChange?: (prop: CalendarDateProp) => void;
  onCalendarDisplayPropsChange?: (props: CalendarDisplayProp[]) => void;
  onCalendarItemLimitChange?: (limit: 'all' | number) => void;
  onCalendarColorPropChange?: (prop: CalendarColorProp) => void;
  
  // Custom Renderers
  renderHeaderControls?: () => ReactNode;
  renderStats?: () => ReactNode;
  renderCta?: (viewMode: ViewMode, ctaProps: { colSpan?: number }) => ReactNode;
}

export function DynamicView({ viewConfig, ...rest }: DynamicViewProps) {
  
  const { viewMode, isInitialLoading, items, groupBy } = rest;

  const groupedData = useMemo(() => {
    if (groupBy === 'none' || viewMode !== 'kanban') {
        return null;
    }
    return items.reduce((acc, item) => {
        const groupKey = String(item[groupBy as keyof GenericItem]) || 'N/A';
        if (!acc[groupKey]) {
            acc[groupKey] = [] as GenericItem[];
        }
        acc[groupKey].push(item);
        return acc;
    }, {} as Record<string, GenericItem[]>);
  }, [items, groupBy, viewMode]);

  const renderViewForData = useCallback((data: GenericItem[], cta: ReactNode) => {
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
    <DynamicViewProvider viewConfig={viewConfig} {...rest}>
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

          {rest.renderStats && !isInitialLoading && rest.renderStats()}
          
          <div className="min-h-[500px]">
              {renderContent()}
          </div>
      </div>
    </DynamicViewProvider>
  );
}