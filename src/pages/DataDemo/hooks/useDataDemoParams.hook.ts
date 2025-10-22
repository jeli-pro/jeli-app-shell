import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, parse, isValid } from 'date-fns';
import type { ViewMode, SortConfig, GroupableField, CalendarDateProp, CalendarDisplayProp, CalendarColorProp, FilterConfig } from '@/features/dynamic-view/types';

export function useDataDemoParams() {
    const [searchParams, setSearchParams] = useSearchParams();

    // --- READ URL PARAMS ---
    const q = searchParams.get('q');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const sort = searchParams.get('sort');
    const calDate = searchParams.get('calDate');
    const calDisplay = searchParams.get('calDisplay');
    const calLimit = searchParams.get('calLimit');
    const calColor = searchParams.get('calColor');
    const dateParam = searchParams.get('date');

    // --- DERIVED STATE FROM URL ---
    const viewMode = useMemo(() => (searchParams.get('dataView') as ViewMode) || 'list', [searchParams]);
    const page = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams]);
    const groupBy = useMemo(() => {
        const groupByParam = (searchParams.get('groupBy') as GroupableField<string> | 'none') || 'none';
        if (viewMode === 'kanban' && groupByParam === 'none') {
            return 'status';
        }
        return groupByParam;
    }, [searchParams, viewMode]);
    const activeGroupTab = useMemo(() => searchParams.get('tab') || 'all', [searchParams]);
    const filters = useMemo<FilterConfig>(
        () => ({
            searchTerm: q || '',
            status: (status?.split(',') || []).filter(Boolean),
            priority: (priority?.split(',') || []).filter(Boolean),
        }),
        [q, status, priority],
    );
    const sortConfig = useMemo<SortConfig<string> | null>(() => {
        if (viewMode === 'kanban') return null;
        const sortParam = sort;
        if (!sortParam) return { key: 'updatedAt', direction: 'desc' };
        if (sortParam === 'default') return null;

        const [key, direction] = sortParam.split('-');
        return { key, direction: direction as 'asc' | 'desc' };
    }, [sort, viewMode]);
    const calendarDateProp = useMemo(() => (calDate || 'dueDate') as CalendarDateProp<string>, [calDate]);
    const calendarDisplayProps = useMemo(
        () => {
            if (calDisplay === null) return [];
            if (calDisplay === '') return [];
            return calDisplay.split(',') as CalendarDisplayProp<string>[];
        },
        [calDisplay]
    );
    const calendarItemLimit = useMemo(() => {
        const limit = parseInt(calLimit || '3', 10);
        if (calLimit === 'all') return 'all';
        return isNaN(limit) ? 3 : limit;
    }, [calLimit]);
    const calendarColorProp = useMemo(() => (calColor || 'none') as CalendarColorProp<string>, [calColor]);
    const calendarDate = useMemo(() => {
        if (!dateParam) return new Date();
        const parsedDate = parse(dateParam, 'yyyy-MM', new Date());
        return isValid(parsedDate) ? parsedDate : new Date();
    }, [dateParam]);

    // --- MUTATOR ACTIONS ---
    const handleParamsChange = useCallback(
        (newParams: Record<string, string | number | string[] | null | undefined>, resetPage = false) => {
            setSearchParams(
                (prev) => {
                    const updated = new URLSearchParams(prev);
                    
                    for (const [key, value] of Object.entries(newParams)) {
                        if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || value === '') {
                            updated.delete(key);
                        } else if (Array.isArray(value)) {
                            updated.set(key, value.join(','));
                        } else {
                            updated.set(key, String(value));
                        }
                    }

                    if (resetPage) {
                        updated.delete('page');
                    }
                    if ('groupBy' in newParams) {
                        updated.delete('tab');
                    }

                    return updated;
                },
                { replace: true },
            );
        },
        [setSearchParams],
    );

    const setViewMode = (mode: ViewMode) => handleParamsChange({ dataView: mode === 'list' ? null : mode });
    const setGroupBy = (val: string) => handleParamsChange({ groupBy: val === 'none' ? null : val }, true);
    const setActiveGroupTab = (tab: string) => handleParamsChange({ tab: tab === 'all' ? null : tab });
    const setFilters = (newFilters: FilterConfig) => {
        handleParamsChange({ q: newFilters.searchTerm, status: newFilters.status, priority: newFilters.priority }, true);
    }
    const setSort = (config: SortConfig<string> | null) => {
        if (!config) {
            handleParamsChange({ sort: null }, true);
        } else {
            handleParamsChange({ sort: `${config.key}-${config.direction}` }, true);
        }
    }
    const setTableSort = (field: string) => {
        let newSort: string | null = `${field}-desc`;
        if (sortConfig && sortConfig.key === field) {
            if (sortConfig.direction === 'desc') newSort = `${field}-asc`;
            else if (sortConfig.direction === 'asc') newSort = null;
        }
        handleParamsChange({ sort: newSort }, true);
    };
    const setPage = (newPage: number) => handleParamsChange({ page: newPage > 1 ? newPage.toString() : null });

    // Calendar specific actions
    const setCalendarDateProp = (prop: CalendarDateProp<string>) => handleParamsChange({ calDate: prop === 'dueDate' ? null : prop });
    const setCalendarDisplayProps = (props: CalendarDisplayProp<string>[]) => {
        const isDefault = props.length === 0;
        handleParamsChange({ calDisplay: isDefault ? null : props.join(',') });
    };
    const setCalendarItemLimit = (limit: number | 'all') => handleParamsChange({ calLimit: limit === 3 ? null : String(limit) });
    const setCalendarColorProp = (prop: CalendarColorProp<string>) => handleParamsChange({ calColor: prop === 'none' ? null : prop });
    
    const setCalendarDate = useCallback((date: Date) => {
        const newDateStr = format(date, 'yyyy-MM');
        const currentDateStr = format(new Date(), 'yyyy-MM');
        const valueToSet = newDateStr === currentDateStr ? null : newDateStr;
        handleParamsChange({ date: valueToSet });
    }, [handleParamsChange]);


    return useMemo(() => ({
        viewMode,
        page,
        groupBy,
        activeGroupTab,
        filters,
        sortConfig,
        calendarDateProp,
        calendarDisplayProps,
        calendarItemLimit,
        calendarColorProp,
        calendarDate,
        setViewMode,
        setGroupBy,
        setActiveGroupTab,
        setFilters,
        setSort,
        setTableSort,
        setPage,
        setCalendarDateProp,
        setCalendarDisplayProps,
        setCalendarItemLimit,
        setCalendarColorProp,
        setCalendarDate,
    }), [
        viewMode, page, groupBy, activeGroupTab, filters, sortConfig, calendarDateProp,
        calendarDisplayProps, calendarItemLimit, calendarColorProp, calendarDate,
        setViewMode, setGroupBy, setActiveGroupTab, setFilters,
        setSort, setTableSort, setPage, setCalendarDateProp, setCalendarDisplayProps, setCalendarItemLimit, setCalendarColorProp, setCalendarDate
    ]);
}