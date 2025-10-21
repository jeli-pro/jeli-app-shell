import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { ViewConfig, GenericItem, ViewMode, FilterConfig, SortConfig, CalendarDateProp, CalendarDisplayProp, CalendarColorProp } from './types';

export interface DynamicViewContextProps {
  config: ViewConfig;
  data: GenericItem[];
  getFieldDef: (fieldId: string) => ViewConfig['fields'][number] | undefined;

  // Data & State from parent
  items: GenericItem[];
  isLoading: boolean;
  isInitialLoading: boolean;
  totalItemCount: number;
  hasMore: boolean;

  // Controlled State Props from parent
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

  // Callbacks to parent
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
}

const DynamicViewContext = createContext<DynamicViewContextProps | null>(null);

interface DynamicViewProviderProps extends Omit<DynamicViewContextProps, 'getFieldDef' | 'config' | 'data'> {
  viewConfig: ViewConfig,
  children: ReactNode;
}

export function DynamicViewProvider({ viewConfig, children, ...rest }: DynamicViewProviderProps) {
  const fieldDefsById = useMemo(() => {
    return new Map(viewConfig.fields.map(field => [field.id, field]));
  }, [viewConfig.fields]);

  const getFieldDef = (fieldId: string) => {
    return fieldDefsById.get(fieldId);
  };

  const value = useMemo(() => ({
    ...rest,
    config: viewConfig,
    data: rest.items, // alias for convenience
    getFieldDef,
  }), [viewConfig, getFieldDef, rest]);

  return (
    <DynamicViewContext.Provider value={value}>
      {children}
    </DynamicViewContext.Provider>
  );
}

export function useDynamicView() {
  const context = useContext(DynamicViewContext);
  if (!context) {
    throw new Error('useDynamicView must be used within a DynamicViewProvider');
  }
  return context;
}