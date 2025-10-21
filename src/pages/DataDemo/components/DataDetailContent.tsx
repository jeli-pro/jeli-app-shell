import { ExternalLink, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DynamicViewProvider } from '@/features/dynamic-view/DynamicViewContext';
import { DetailPanel } from '@/features/dynamic-view/components/shared/DetailPanel';
import { dataDemoViewConfig } from '@/pages/DataDemo/DataDemo.config';
import type { DataDemoItem } from '@/pages/DataDemo/data/DataDemoItem';
import { useDataDemoStore } from '../store/dataDemo.store';

interface DataDetailContentProps {
  item: DataDemoItem;
}

export function DataDetailContent({ item }: DataDetailContentProps) {
  const { updateItem } = useDataDemoStore();

  return (
    <DynamicViewProvider
      viewConfig={dataDemoViewConfig}
      items={[]} // Not needed for detail view, but provider requires it
      isLoading={false}
      isInitialLoading={false}
      totalItemCount={0}
      hasMore={false}
      viewMode="list" // Doesn't matter which, but required
      filters={{ searchTerm: "" }}
      sortConfig={null}
      groupBy="none"
      activeGroupTab=""
      page={1}
      onViewModeChange={() => {}}
      onFiltersChange={() => {}}
      onSortChange={() => {}}
      onGroupByChange={() => {}}
      onActiveGroupTabChange={() => {}}
      onPageChange={() => {}}
      onItemSelect={() => {}}
      onItemUpdate={updateItem}
    >
      <div className="h-full flex flex-col bg-card">
        <DetailPanel item={item} config={dataDemoViewConfig.detailView} />
        {/* Application-specific actions can be composed here */}
        <div className="p-6 border-t border-border/50 bg-card/30 flex-shrink-0">
          <div className="flex gap-3">
            <Button className="flex-1" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Project
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </DynamicViewProvider>
  );
}