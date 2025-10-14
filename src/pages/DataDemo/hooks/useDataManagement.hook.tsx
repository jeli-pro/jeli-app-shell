import { useState, useRef, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { capitalize, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { mockDataItems } from '../data/mockData';
import type { DataItem, ViewMode, SortConfig, SortableField, GroupableField, Status, Priority } from '../types';
import type { FilterConfig } from '../components/DataToolbar';

export function useDataManagement() {
	const [searchParams, setSearchParams] = useSearchParams();

	// Derive state from URL search params
	const viewMode = useMemo(() => (searchParams.get('view') as ViewMode) || 'list', [searchParams]);
	const page = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams]);
	const groupBy = useMemo(() => (searchParams.get('groupBy') as GroupableField | 'none') || 'none', [searchParams]);
	const activeGroupTab = useMemo(() => searchParams.get('tab') || 'all', [searchParams]);

	const filters = useMemo<FilterConfig>(
		() => ({
			searchTerm: searchParams.get('q') || '',
			status: (searchParams.get('status')?.split(',') || []).filter(Boolean) as Status[],
			priority: (searchParams.get('priority')?.split(',') || []).filter(Boolean) as Priority[],
		}),
		[searchParams],
	);

	const sortConfig = useMemo<SortConfig | null>(() => {
		const sortParam = searchParams.get('sort');
		if (!sortParam) return { key: 'updatedAt', direction: 'desc' }; // Default sort
		if (sortParam === 'default') return null;

		const [key, direction] = sortParam.split('-');
		return { key: key as SortableField, direction: direction as 'asc' | 'desc' };
	}, [searchParams]);

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
				{ replace: true },
			);
		},
		[setSearchParams],
	);

	const [items, setItems] = useState<DataItem[]>([]);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const observer = useRef<IntersectionObserver>();

	// Centralized data filtering and sorting from the master list
	const filteredAndSortedData = useMemo(() => {
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
				const getNestedValue = (obj: DataItem, path: string): unknown => 
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
				// Date sorting (assuming ISO strings)
				if (sortConfig.key === 'updatedAt' || sortConfig.key === 'createdAt') {
					return sortConfig.direction === 'asc'
						? new Date(aValue).getTime() - new Date(bValue).getTime()
						: new Date(bValue).getTime() - new Date(aValue).getTime();
				}
				return 0;
			});
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
					setItems((prev) => (isFirstPage ? newItems : [...prev, ...newItems]));
					setHasMore(filteredAndSortedData.length > page * pageSize);
					setIsLoading(false);
				}
			}, isFirstPage && items.length === 0 ? 1500 : 500); // Longer delay for initial skeleton
		};

		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams, filteredAndSortedData]); // Reacts to any URL change

	const loaderRef = useCallback(
		(node: Element | null) => {
			if (isLoading) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					// Instead of setting local state, we update the URL, which triggers the data loading effect.
					handleParamsChange({ page: (page + 1).toString() });
				}
			});
			if (node) observer.current.observe(node);
		},
		[isLoading, hasMore, page, handleParamsChange],
	);

	const groupTabs = useMemo(() => {
		if (groupBy === 'none' || !filteredAndSortedData.length) return [];

		const groupCounts = filteredAndSortedData.reduce((acc, item) => {
			const groupKey = String(item[groupBy as GroupableField]);
			acc[groupKey] = (acc[groupKey] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const sortedGroups = Object.keys(groupCounts).sort((a, b) => a.localeCompare(b));

		const createLabel = (text: string, count: number, isActive: boolean): ReactNode => (
			<>
				{text}
				<Badge
					variant={isActive ? 'default' : 'secondary'}
					className={cn(
						'transition-colors duration-300 text-xs font-semibold',
						!isActive && 'group-hover:bg-accent group-hover:text-accent-foreground',
					)}
				>
					{count}
				</Badge>
			</>
		);

		return [
			{ id: 'all', label: createLabel('All', filteredAndSortedData.length, activeGroupTab === 'all') },
			...sortedGroups.map((g) => ({
				id: g,
				label: createLabel(capitalize(g), groupCounts[g], activeGroupTab === g),
			})),
		];
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
		return items.filter((item) => String(item[groupBy as GroupableField]) === activeGroupTab);
	}, [items, groupBy, activeGroupTab]);

	const totalItemCount = filteredAndSortedData.length;
	const isInitialLoading = isLoading && items.length === 0;

  const setViewMode = (mode: ViewMode) => handleParamsChange({ view: mode });
  const setGroupBy = (val: string) => handleParamsChange({ groupBy: val === 'none' ? null : val });
  const setActiveGroupTab = (tab: string) => handleParamsChange({ tab: tab === 'all' ? null : tab });
  const setFilters = (newFilters: FilterConfig) => {
    handleParamsChange({ q: newFilters.searchTerm, status: newFilters.status, priority: newFilters.priority });
  }
  const setSort = (config: SortConfig | null) => {
    if (!config) {
      handleParamsChange({ sort: 'default' });
    } else {
      handleParamsChange({ sort: `${config.key}-${config.direction}` });
    }
  }
  const setTableSort = (field: SortableField) => {
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

	return {
		viewMode,
		groupBy,
		activeGroupTab,
		filters,
		sortConfig,
		hasMore,
		isLoading,
		loaderRef,
		groupTabs,
		dataToRender,
		totalItemCount,
		isInitialLoading,
    setViewMode,
    setGroupBy,
    setActiveGroupTab,
    setFilters,
    setSort,
    setTableSort
	};
}