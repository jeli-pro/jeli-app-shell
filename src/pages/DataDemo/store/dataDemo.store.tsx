import { create } from 'zustand';
import { type ReactNode } from 'react';
import { capitalize, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { mockDataItems } from '../data/mockData';
import type { DataItem, GroupableField, SortConfig } from '../types';
import type { FilterConfig } from '../components/DataToolbar';

// --- State and Actions ---
interface DataDemoState {
    items: DataItem[];
    hasMore: boolean;
    isLoading: boolean;
    isInitialLoading: boolean;
    totalItemCount: number;
}

interface DataDemoActions {
    loadData: (params: {
        page: number;
        groupBy: GroupableField | 'none';
        filters: FilterConfig;
        sortConfig: SortConfig | null;
    }) => void;
}

const defaultState: DataDemoState = {
    items: [],
    hasMore: true,
    isLoading: true,
    isInitialLoading: true,
    totalItemCount: 0,
};

// --- Store Implementation ---
export const useDataDemoStore = create<DataDemoState & DataDemoActions>((set) => ({
    ...defaultState,

    loadData: ({ page, groupBy, filters, sortConfig }) => {
        set({ isLoading: true, ...(page === 1 && { isInitialLoading: true }) });
        const isFirstPage = page === 1;

        const filteredAndSortedData = (() => {
            const filteredItems = mockDataItems.filter((item) => {
                const searchTermMatch =
                    item.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                    item.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
                const statusMatch = filters.status.length === 0 || filters.status.includes(item.status);
                const priorityMatch = filters.priority.length === 0 || filters.priority.includes(item.priority);
                return searchTermMatch && statusMatch && priorityMatch;
            });

            if (sortConfig) {
                filteredItems.sort((a, b) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const getNestedValue = (obj: DataItem, path: string): any =>
                        path.split('.').reduce((o: any, k) => (o || {})[k], obj);

                    const aValue = getNestedValue(a, sortConfig.key);
                    const bValue = getNestedValue(b, sortConfig.key);

                    if (aValue === undefined || bValue === undefined) return 0;
                    if (typeof aValue === 'string' && typeof bValue === 'string') {
                        return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                    }
                    if (typeof aValue === 'number' && typeof bValue === 'number') {
                        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
                    }
                    if (sortConfig.key === 'updatedAt' || sortConfig.key === 'createdAt') {
                        if (typeof aValue === 'string' && typeof bValue === 'string') {
                            return sortConfig.direction === 'asc'
                                ? new Date(aValue).getTime() - new Date(bValue).getTime()
                                : new Date(bValue).getTime() - new Date(aValue).getTime();
                        }
                    }
                    return 0;
                });
            }
            return filteredItems;
        })();
        
        const totalItemCount = filteredAndSortedData.length;

        setTimeout(() => {
            if (groupBy !== 'none') {
                set({
                    items: filteredAndSortedData,
                    hasMore: false,
                    isLoading: false,
                    isInitialLoading: false,
                    totalItemCount,
                });
                return;
            }

            const pageSize = 12;
            const newItems = filteredAndSortedData.slice((page - 1) * pageSize, page * pageSize);
            
            set(state => ({
                items: isFirstPage ? newItems : [...state.items, ...newItems],
                hasMore: totalItemCount > page * pageSize,
                isLoading: false,
                isInitialLoading: false,
                totalItemCount,
            }));

        }, isFirstPage ? 1500 : 500);
    }
}));

// --- Selectors ---
export const useGroupTabs = (
    groupBy: GroupableField | 'none',
    activeGroupTab: string,
) => useDataDemoStore(state => {
    const items = state.items;
    if (groupBy === 'none' || !items.length) return [];
    
    const groupCounts = items.reduce((acc, item) => {
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
    
    const totalCount = items.length;

    return [
        { id: 'all', label: createLabel('All', totalCount, activeGroupTab === 'all') },
        ...sortedGroups.map((g) => ({
            id: g,
            label: createLabel(capitalize(g), groupCounts[g], activeGroupTab === g),
        })),
    ];
});

export const useDataToRender = (
    groupBy: GroupableField | 'none',
    activeGroupTab: string,
) => useDataDemoStore(state => {
    const items = state.items;
    if (groupBy === 'none') {
        return items;
    }
    if (activeGroupTab === 'all') {
        return items;
    }
    return items.filter((item) => String(item[groupBy as GroupableField]) === activeGroupTab);
});

export const useSelectedItem = (itemId?: string) => {
    if (!itemId) return null;
    return mockDataItems.find(item => item.id === itemId) ?? null;
};