import { useState, useRef } from 'react'
import { PageLayout } from '@/components/shared/PageLayout'
import { DataViewModeSelector } from './components/DataViewModeSelector'
import { DataListView } from './components/DataListView'
import { DataCardView } from './components/DataCardView'
import { DataTableView } from './components/DataTableView'
import { DataDetailPanel } from './components/DataDetailPanel'
import { useAppShell } from '@/context/AppShellContext'
import { mockDataItems } from './data/mockData'
import type { DataItem, ViewMode } from './types'

export default function DataDemoPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)
  const { openSidePane } = useAppShell()

  // Filter data based on search
  const filteredData = mockDataItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle item selection and open side panel
  const handleItemSelect = (item: DataItem) => {
    setSelectedItem(item)
    openSidePane('data-details')
  }

  const renderView = () => {
    const commonProps = {
      data: filteredData,
      onItemSelect: handleItemSelect,
      selectedItem
    }

    switch (viewMode) {
      case 'list':
        return <DataListView {...commonProps} />
      case 'cards':
        return <DataCardView {...commonProps} />
      case 'grid':
        return <DataCardView {...commonProps} isGrid />
      case 'table':
        return <DataTableView {...commonProps} />
      default:
        return <DataListView {...commonProps} />
    }
  }

  return (
    <PageLayout
      // Note: Search functionality is handled by a separate SearchBar in the TopBar
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Data Showcase</h1>
            <p className="text-muted-foreground">
              Showing {filteredData.length} of {mockDataItems.length} items
            </p>
          </div>
          <DataViewModeSelector 
            viewMode={viewMode} 
            onChange={setViewMode}
          />
        </div>

        <div ref={contentRef} className="min-h-[500px]">
          {renderView()}
        </div>

      </div>

      {/* Detail Panel */}
      <DataDetailPanel 
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </PageLayout>
  )
}