import { useState, useRef } from 'react'
import { PageLayout } from '@/components/shared/PageLayout'
import { ViewModeSwitcher } from '@/components/layout/ViewModeSwitcher'
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
      title="Data Showcase"
      subtitle="Explore data with immersive view modes and seamless interactions"
      rightContent={<ViewModeSwitcher />}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search data items..."
    >
      <div className="space-y-6">
        {/* View Mode Selector */}
        <div className="flex justify-center">
          <DataViewModeSelector 
            viewMode={viewMode} 
            onChange={setViewMode}
          />
        </div>

        {/* Data Content */}
        <div ref={contentRef} className="min-h-[500px]">
          {renderView()}
        </div>

        {/* Results Counter */}
        <div className="text-center text-sm text-muted-foreground">
          Showing {filteredData.length} of {mockDataItems.length} items
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