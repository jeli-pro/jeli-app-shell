import { create } from "zustand";
import { mockDataItems } from "@/pages/DataDemo/data/mockData";
import type {
  GenericItem,
  GroupableField,
  SortConfig,
  FilterConfig,
} from "@/features/dynamic-view/types";

// --- State and Actions ---
interface DataDemoState {
  items: GenericItem[];
  hasMore: boolean;
  isLoading: boolean;
  isInitialLoading: boolean;
  totalItemCount: number;
}

interface DataDemoActions {
  loadData: (params: {
    page: number;
    groupBy: GroupableField | "none";
    filters: FilterConfig;
    sortConfig: SortConfig | null;
    isFullLoad?: boolean;
  }) => void;
  updateItem: (itemId: string, updates: Partial<GenericItem>) => void;
}

const defaultState: DataDemoState = {
  items: [],
  hasMore: true,
  isLoading: true,
  isInitialLoading: true,
  totalItemCount: 0,
};

// --- Store Implementation ---
export const useDataDemoStore = create<DataDemoState & DataDemoActions>(
  (set) => ({
    ...defaultState,

    loadData: ({ page, groupBy, filters, sortConfig, isFullLoad }) => {
      set({ isLoading: true, ...(page === 1 && { isInitialLoading: true }) });
      const isFirstPage = page === 1;

      const filteredAndSortedData = (() => {
        const filteredItems = mockDataItems.filter((item) => {
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const getNestedValue = (obj: GenericItem, path: string): any =>
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
      const itemIndex = mockDataItems.findIndex((i) => i.id === itemId);
      if (itemIndex > -1) {
        mockDataItems[itemIndex] = { ...mockDataItems[itemIndex], ...updates };
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
    (mockDataItems.find((item) => item.id === itemId) as GenericItem) ?? null
  );
};
