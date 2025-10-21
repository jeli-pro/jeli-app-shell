import { useRef, useEffect, useCallback } from "react";
import {
  Layers,
  AlertTriangle,
  PlayCircle,
  TrendingUp,
  CheckCircle,
  Clock,
  Archive,
  PlusCircle,
} from "lucide-react";
import { DynamicView } from "@/features/dynamic-view/DynamicView";
import { PageLayout } from "@/components/shared/PageLayout";
import { useScrollToBottom } from "@/hooks/useScrollToBottom.hook";
import { ScrollToBottomButton } from "@/components/shared/ScrollToBottomButton";
import { mockDataItems } from "./data/mockData";
import { useAppViewManager } from "@/hooks/useAppViewManager.hook";
import { useDataDemoStore } from "./store/dataDemo.store";
import { AddDataItemCta } from "@/features/dynamic-view/components/shared/AddDataItemCta";

import { dataDemoViewConfig } from "./DataDemo.config";
import type { StatItem } from "@/features/dynamic-view/types";

export default function DataDemoPage() {
  const {
    viewMode,
    groupBy,
    activeGroupTab,
    setGroupBy,
    setSort,
    setActiveGroupTab,
    page,
    filters,
    sortConfig,
    setPage,
    setFilters,
    setViewMode,
    onItemSelect,
  } = useAppViewManager();

  const {
    items: allItems,
    hasMore,
    isLoading,
    isInitialLoading,
    totalItemCount,
    loadData,
    updateItem,
  } = useDataDemoStore((state) => ({
    items: state.items,
    hasMore: state.hasMore,
    isLoading: state.isLoading,
    isInitialLoading: state.isInitialLoading,
    totalItemCount: state.totalItemCount,
    loadData: state.loadData,
    updateItem: state.updateItem,
  }));

  const scrollRef = useRef<HTMLDivElement>(null);

  // Note: The `DynamicViewProvider` needs `GenericItem[]`.
  // Our store uses `GenericItem` so no cast is needed.

  // Calculate stats from data
  const totalItems = mockDataItems.length;
  const { showScrollToBottom, scrollToBottom, handleScroll } =
    useScrollToBottom(scrollRef);

  const activeItems = mockDataItems.filter(
    (item) => item.status === "active",
  ).length;
  const highPriorityItems = mockDataItems.filter(
    (item) => item.priority === "high" || item.priority === "critical",
  ).length;
  const avgCompletion =
    totalItems > 0
      ? Math.round(
          mockDataItems.reduce(
            (acc, item) => acc + item.metrics.completion,
            0,
          ) / totalItems,
        )
      : 0;

  const stats: StatItem[] = [
    {
      title: "Total Projects",
      value: totalItems.toString(),
      icon: <Layers className="w-5 h-5" />,
      change: "+5.2% this month",
      trend: "up" as const,
      chartData: [120, 125, 122, 130, 135, 138, 142],
    },
    {
      title: "Active Projects",
      value: activeItems.toString(),
      icon: <PlayCircle className="w-5 h-5" />,
      change: "+2 this week",
      trend: "up" as const,
      chartData: [45, 50, 48, 55, 53, 60, 58],
    },
    {
      title: "High Priority",
      value: highPriorityItems.toString(),
      icon: <AlertTriangle className="w-5 h-5" />,
      change: "-1 from last week",
      trend: "down" as const,
      chartData: [25, 26, 28, 27, 26, 24, 23],
    },
    {
      title: "Avg. Completion",
      value: `${avgCompletion}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      change: "+3.2%",
      trend: "up" as const,
      chartData: [65, 68, 70, 69, 72, 75, 78],
    },
    {
      title: "Completion Rate",
      value: "88%",
      icon: <CheckCircle className="w-5 h-5" />,
      change: "+1.5% this month",
      trend: "up" as const,
      chartData: [80, 82, 81, 84, 85, 87, 88],
    },
    {
      title: "Overdue Items",
      value: "8",
      icon: <Clock className="w-5 h-5" />,
      change: "-3 this week",
      trend: "down" as const,
    },
    {
      title: "New This Week",
      value: "12",
      icon: <PlusCircle className="w-5 h-5" />,
      change: "+2 from last week",
      trend: "up" as const,
    },
    {
      title: "Archived Projects",
      value: "153",
      icon: <Archive className="w-5 h-5" />,
      change: "+20 this month",
      trend: "up" as const,
    },
  ];

  useEffect(() => {
    loadData({
      page,
      groupBy,
      filters,
      sortConfig,
      isFullLoad: viewMode === "calendar" || viewMode === "kanban",
    });
  }, [page, groupBy, filters, sortConfig, loadData, viewMode]);

  const observer = useRef<IntersectionObserver>();
  const loaderRef = useCallback(
    (node: Element | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, page, setPage],
  );

  useEffect(() => {
    // Auto-group by status when switching to kanban view for the first time
    if (viewMode === "kanban" && groupBy === "none") {
      setGroupBy("status");
      setSort(null); // Kanban is manually sorted, so disable programmatic sort
    }
    // For calendar view, we don't want grouping.
    else if (viewMode === "calendar" && groupBy !== "none") {
      setGroupBy("none");
    }
  }, [viewMode, groupBy, setGroupBy, setSort]);

  return (
    <PageLayout scrollRef={scrollRef} onScroll={handleScroll}>
      <DynamicView
        viewConfig={dataDemoViewConfig}
        items={allItems}
        isLoading={isLoading}
        isInitialLoading={isInitialLoading}
        totalItemCount={totalItemCount}
        hasMore={hasMore}
        // Controlled state
        viewMode={viewMode}
        filters={filters}
        sortConfig={sortConfig}
        groupBy={groupBy}
        activeGroupTab={activeGroupTab}
        page={page}
        // Callbacks
        onViewModeChange={setViewMode}
        onFiltersChange={setFilters}
        onSortChange={setSort}
        onGroupByChange={setGroupBy}
        onActiveGroupTabChange={setActiveGroupTab}
        onPageChange={setPage}
        onItemUpdate={updateItem}
        onItemSelect={onItemSelect}
        loaderRef={loaderRef}
        scrollContainerRef={scrollRef}
        statsData={stats}
        // Custom Renderers
        renderCta={(viewMode, ctaProps) => (
          <AddDataItemCta viewMode={viewMode} colSpan={ctaProps.colSpan} />
        )}
      />

      <ScrollToBottomButton
        isVisible={showScrollToBottom}
        onClick={scrollToBottom}
      />
    </PageLayout>
  );
}
