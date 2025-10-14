import { useState, useRef, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { capitalize, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { mockDataItems } from '../data/mockData';
import type { DataItem, GroupableField } from '../types';
import { useAppViewManager } from '@/hooks/useAppViewManager.hook';

export function useDataManagement() {
	const {
		viewMode,
		page,
		groupBy,
		activeGroupTab,
		filters,
		sortConfig,
		setPage,
		setViewMode,
		setGroupBy,
		setActiveGroupTab,
		setFilters,
		setSort,
		setTableSort,
	} = useAppViewManager();

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
	}, [page, groupBy, filteredAndSortedData]);

	const loaderRef = useCallback(
		(node: Element | null) => {
			if (isLoading) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					// Instead of setting local state, we update the URL, which triggers the data loading effect.
					setPage(page + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[isLoading, hasMore, page, setPage],
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
		setTableSort,
	};
}