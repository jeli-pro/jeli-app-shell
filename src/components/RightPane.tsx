import { forwardRef } from 'react'
import { X, SlidersHorizontal } from 'lucide-react'
import { useAppStore } from '@/store/appStore'

export const RightPane = forwardRef<HTMLDivElement>((_props, ref) => {
  const { toggleSidePane } = useAppStore()

  return (
    <aside ref={ref} className="bg-card border-l border-border flex flex-col h-full overflow-hidden w-0">
      <div className="flex items-center justify-between p-4 border-b border-border h-20 flex-shrink-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          <h2 className="text-lg font-semibold whitespace-nowrap">Details Panel</h2>
        </div>
        <button
          onClick={toggleSidePane}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-muted-foreground">
          This is the side pane. It can be used to display contextual information, forms, or actions related to the main content.
        </p>
      </div>
    </aside>
  )
})

RightPane.displayName = "RightPane"