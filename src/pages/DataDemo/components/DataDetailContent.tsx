import { ExternalLink, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DynamicViewProvider } from '@/features/dynamic-view/DynamicViewContext';
import { DetailPanel } from '@/features/dynamic-view/components/shared/DetailPanel';
import { dataDemoViewConfig } from '@/pages/DataDemo/DataDemo.config';
import type { DataDemoItem } from '@/pages/DataDemo/data/DataDemoItem';
import { useDataDemoStore } from '../store/dataDemo.store';
import { useRef, useLayoutEffect } from 'react';

interface DataDetailContentProps {
  item: DataDemoItem;
}

export function DataDetailContent({ item }: DataDetailContentProps) {
  const { updateItem } = useDataDemoStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // HACK: This is a temporary workaround to fix a DOM nesting warning (`div` inside `p`)
  // originating from the `DetailPanel` component, which is not available for direct editing.
  // The correct solution is to modify `DetailPanel.tsx` to use `div` instead of `p` as a container for its fields.
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // Find all <p> tags that have a <div> as a descendant
    const paragraphs = Array.from(containerRef.current.getElementsByTagName('p'));

    for (const p of paragraphs) {
      if (p.querySelector('div')) {
        const wrapperDiv = document.createElement('div');
        // Copy classes from the <p> to the new <div>
        wrapperDiv.className = p.className;
        // Move all children from <p> to the new <div>
        while (p.firstChild) {
          wrapperDiv.appendChild(p.firstChild);
        }
        // Replace the <p> with the new <div>
        p.parentNode?.replaceChild(wrapperDiv, p);
      }
    }
  }, [item]); // Rerun when the item changes

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
      <div ref={containerRef} className="h-full flex flex-col bg-card">
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