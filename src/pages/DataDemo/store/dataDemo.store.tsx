import { create } from "zustand";
import { mockDataItems } from "@/pages/DataDemo/data/mockData";
import type {
  GroupableField,
  FilterConfig,
  SortConfig,
} from "@/features/dynamic-view/types";

import type { DataDemoItem } from "../data/DataDemoItem";
// --- State and Actions ---
interface DataDemoState {
  items: DataDemoItem[];
  hasMore: boolean;
  isLoading: boolean;
  isInitialLoading: boolean;
  totalItemCount: number;
}

interface DataDemoActions {
  loadData: (params: {
    page: number;
    groupBy: GroupableField<string> | "none";
    filters: FilterConfig;
    sortConfig: SortConfig<string> | null;
    isFullLoad?: boolean;
  }) => void;
  updateItem: (itemId: string, updates: Partial<DataDemoItem>) => void;
}

const defaultState: DataDemoState = {
  items: [],
  hasMore: true,
  isLoading: true,
  isInitialLoading: true,
  totalItemCount: 0,
};

// Cast the mock data to our strict type to satisfy the store's requirements
const typedMockData = mockDataItems as DataDemoItem[];

// --- Store Implementation ---
export const useDataDemoStore = create<DataDemoState & DataDemoActions>(
  (set) => ({
    ...defaultState,

    loadData: ({ page, groupBy, filters, sortConfig, isFullLoad }) => {
      set({ isLoading: true, ...(page === 1 && { isInitialLoading: true }) });
      const isFirstPage = page === 1;

      const filteredAndSortedData = (() => {
        const filteredItems = typedMockData.filter((item) => {
          const searchTermMatch =
            item.title
              .toLowerCase()
              .includes(filters.searchTerm.toLowerCase()) ||
            item.description
              .toLowerCase()
              .includes(filters.searchTerm.toLowerCase());
          const statusMatch =
            filters.status.length === 0 || filters.status.includes(item.status);
          const priorityMatch =
            filters.priority.length === 0 ||
            filters.priority.includes(item.priority);
          return searchTermMatch && statusMatch && priorityMatch;
        });

        if (sortConfig) {
          filteredItems.sort((a, b) => {
            const getNestedValue = (obj: DataDemoItem, path: string): unknown =>
              path.split(".").reduce((o: any, k) => (o || {})[k], obj);

            const aValue = getNestedValue(a, sortConfig.key);
            const bValue = getNestedValue(b, sortConfig.key);

            if (aValue === undefined || bValue === undefined) return 0;
            if (typeof aValue === "string" && typeof bValue === "string") {
              return sortConfig.direction === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
            }
            if (typeof aValue === "number" && typeof bValue === "number") {
              return sortConfig.direction === "asc"
                ? aValue - bValue
                : bValue - aValue;
            }
            if (
              sortConfig.key === "updatedAt" ||
              sortConfig.key === "createdAt"
            ) {
              if (typeof aValue === "string" && typeof bValue === "string") {
                return sortConfig.direction === "asc"
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

      setTimeout(
        () => {
          if (groupBy !== "none" || isFullLoad) {
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
          const newItems = filteredAndSortedData.slice(
            (page - 1) * pageSize,
            page * pageSize,
          );

          set((state) => ({
            items: isFirstPage ? newItems : [...state.items, ...newItems],
            hasMore: totalItemCount > page * pageSize,
            isLoading: false,
            isInitialLoading: false,
            totalItemCount,
          }));
        },
        isFirstPage ? 1500 : 500,
      );
    },

    updateItem: (itemId, updates) => {
      // In a real app, this would be an API call. Here we update the mock source.
      const itemIndex = typedMockData.findIndex((i) => i.id === itemId);
      if (itemIndex > -1) {
        typedMockData[itemIndex] = { ...typedMockData[itemIndex], ...updates };
      }

      // Also update the currently loaded items in the store's state for UI consistency
      set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item,
        ),
      }));
    },
  }),
);

export const useSelectedItem = (itemId?: string) => {
  if (!itemId) return null;
  return (
    (typedMockData.find((item) => item.id === itemId) as DataDemoItem) ?? null
  );
};
