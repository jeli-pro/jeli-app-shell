import { useRef, useLayoutEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  ExternalLink
} from 'lucide-react'
import type { GenericItem } from '../../types'
import type { SortableField } from '../../pages/DataDemo/types'
import { EmptyState } from './EmptyState'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import {
  useSelectedItem,
} from '../store/dataDemo.store'
import { capitalize } from '@/lib/utils'
import { AddDataItemCta } from './shared/AddDataItemCta'
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'

export function DataTableView({ data }: { data: GenericItem[] }) {
  const {
    sortConfig,
    setTableSort,
    groupBy,
    onItemSelect,
    itemId,
  } = useAppViewManager();
  const { config } = useDynamicView();
  const { tableView: viewConfig } = config;
  const selectedItem = useSelectedItem(itemId);

  const tableRef = useRef<HTMLTableElement>(null)
  const animatedItemsCount = useRef(0)

  useLayoutEffect(() => {
    if (tableRef.current) {
      // Only select item rows for animation, not group headers
      const newItems = Array.from( 
        tableRef.current.querySelectorAll('tbody tr')
      ).filter(tr => !(tr as HTMLElement).dataset.groupHeader)
       .slice(animatedItemsCount.current);
      gsap.fromTo(newItems,
        { y: 20, opacity: 0 },
        {
          duration: 0.5,
          y: 0,
          opacity: 1,
          stagger: 0.05,
          ease: "power2.out",
        },
      );
      animatedItemsCount.current = data.length;
    }
  }, [data]);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortConfig?.key !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp className="w-4 h-4 text-primary" />
    }
    if (sortConfig.direction === 'desc') {
      return <ArrowDown className="w-4 h-4 text-primary" />
    }
    return <ArrowUpDown className="w-4 h-4 opacity-50" />
  }

  const handleSortClick = (field: string) => {
    setTableSort(field as SortableField) // Cast for now
  }

  const groupedData = useMemo(() => {
    if (groupBy === 'none') return null;
    return (data as GenericItem[]).reduce((acc, item) => {
      const groupKey = item[groupBy as 'status' | 'priority' | 'category'] || 'N/A';
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    }, {} as Record<string, GenericItem[]>);
  }, [data, groupBy]);

  if (data.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table ref={tableRef} className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20">
              {viewConfig.columns.map(col => (
                <th key={col.fieldId} className="text-left p-4 font-semibold text-sm">
                  {col.isSortable ? (
                    <button
                      onClick={() => handleSortClick(col.fieldId)}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      {col.label}
                      <SortIcon field={col.fieldId} />
                    </button>
                  ) : (
                    <span>{col.label}</span>
                  )}
                </th>
              ))}
              <th className="text-center p-4 font-semibold text-sm w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groupedData
              ? Object.entries(groupedData).flatMap(([groupName, items]) => [
                  <tr key={groupName} data-group-header="true" className="sticky top-0 z-10">
                    <td colSpan={viewConfig.columns.length + 1} className="p-2 bg-muted/50 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{capitalize(groupName)}</h3>
                        <span className="text-xs px-2 py-0.5 bg-background rounded-full font-medium">{items.length}</span>
                      </div>
                    </td>
                  </tr>,
                  ...items.map(item => <TableRow key={item.id} item={item} isSelected={selectedItem?.id === item.id} onItemSelect={onItemSelect} />)
                ])
              : data.map(item => <TableRow key={item.id} item={item} isSelected={selectedItem?.id === item.id} onItemSelect={onItemSelect} />)
            }
            <AddDataItemCta viewMode='table' colSpan={viewConfig.columns.length + 1} />
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TableRow({ item, isSelected, onItemSelect }: { item: GenericItem; isSelected: boolean; onItemSelect: (item: GenericItem) => void }) {
  const { config } = useDynamicView();
  return (
    <tr
      onClick={() => onItemSelect(item)}
      className={cn(
        "group border-b border-border/30 transition-all duration-200 cursor-pointer",
        "hover:bg-accent/20 hover:border-primary/20",
        isSelected && "bg-primary/5 border-primary/30"
      )}
    >
      {config.tableView.columns.map(col => (
        <td key={col.fieldId} className="p-4">
          <FieldRenderer item={item} fieldId={col.fieldId} options={{ showPercentage: true }} />
        </td>
      ))}
      {/* Actions Column */}
      <td className="p-4">
        <button 
          onClick={(e) => {
            e.stopPropagation()
            onItemSelect(item)
          }}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-accent transition-colors"
          title="View details"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </td>
    </tr>
  )
}